### tabs轮子制作

#### 1.先实现一下

```html
<div id='app'></div>
```

```css
.active{background:red}
```

```javascript
var vm = new Vue({
    el: '#app',
    data() {
        return {
            selectedTab: 1
        }
    },
    template: `
       <div class="tabs">
            <ol class="nav">
                <li @click = 'selectedTab = 1' :class ='{ active: selectedTab === 1 }'  >tab1</li>
                <li @click = 'selectedTab = 2' :class ='{ active: selectedTab === 2 }' >tab2</li>
            </ol>
            <ol class="panels">
                <li :class = '{active : selectedTab === 1}' >content1</li>
                <li :class = '{ active: selectedTab === 2 }' >content2 </li>
            </ol>
        </div>
    `
})
```

很简单，但是没有复用性。

#### 2.轮子的实现

- 思路：用户如何使用我这个组件呢？

  ```javascript
  var vm = new Vue({
      el: '#app',
      data() {
          return {
              selectedTab: 1
          }
      },
      template: `
      <tabs>
          <tabs-navs>
              <tabs-navs-item>1</tabs-navs-item>
              <tabs-navs-item>2</tabs-navs-item>
          </tabs-navs>
          <tabs-panels>
              <tabs-panels-item>content 1</tabs-panels-item>
              <tabs-panels-item>content 2</tabs-panels-item>
          </tabs-panels>
      </tabs>
      `
  })
  ```

  差不多这样调用，其他的不用管，一个tabs就出来了

- 开始写，我先声明这些tabs的组件

  ```javascript
  Vue.component('tabs',{})
  Vue.component('tans-navs',{})
  Vue.component('tabs-navs-item',{})
  Vue.component('tans-panels',{})
  Vue.component('tabs-panels-item',{})
  var vm = new Vue({
      el: '#app',
      data() {
          return {
              selectedTab: 1
          }
      },
      template: `
      <tabs>
          <tabs-navs>
              <tabs-navs-item>1</tabs-navs-item>
              <tabs-navs-item>2</tabs-navs-item>
          </tabs-navs>
          <tabs-panels>
              <tabs-panels-item>content 1</tabs-panels-item>
              <tabs-panels-item>content 2</tabs-panels-item>
          </tabs-panels>
      </tabs>
      `
  })
  ```

  现在有个问题，我怎么知道要选中那个tab呢?用1，2不大好，所以，改为字符串,并且给下面加上name

  ```javascript
  Vue.component('tabs',{
      props: ['selectedTab'],
      template: `
          <div class='tabs'>
              <slot/>  //注意有子元素的话，添加 插槽
          </div>
      `
  })
  Vue.component('tans-navs',{
      template: `
      <div class='tabs-navs'>
          <slot/>
      </div>
  `
  })
  Vue.component('tabs-navs-item',{
      props: ['name'],
      template: `
      <div class='tabs-navs-item'>
          <slot/>
      </div>
  `
  })
  Vue.component('tans-panels',{
      template: `
      <div class='tabs-panels'>
          <slot/>
      </div>
  `
  })
  Vue.component('tabs-panels-item',{
      props: ['name'],
      template: `
      <div class='tabs-panels-item'>
          <slot/>
      </div>
  `
  })
  var vm = new Vue({
      el: '#app',
      data() {
          return {
              selectedTab: 'tab1'
          }
      },
      template: `
      <tabs selectedTab = 'tab1'>
          <tabs-navs>
              <tabs-navs-item name = 'tab1' >1</tabs-navs-item>
              <tabs-navs-item name = 'tab2' >2</tabs-navs-item>
          </tabs-navs>
          <tabs-panels>
              <tabs-panels-item name = 'tab1'>content 1</tabs-panels-item>
              <tabs-panels-item name = 'tab2'>content 2</tabs-panels-item>
          </tabs-panels>
      </tabs>
      `
  })
  ```

  这样就初见雏形了

- 下面就是重点了，孙子怎么知道爷爷的 `selectedTab`的值呢？

  答案是通过孙子的爸爸，爸爸获得`selectedTab`，然后再给孙子，

  问题又来了，爸爸怎么从爷爷那里获得呢？

  P.S 爷爷：tabs ， 爸爸 ： tabs-navs , 孙子: tabs-navs-item

  ```javascript
  Vue.component('tabs', {
      props: ['selectedTab'],
      template: `
          <div class='tabs'>
              <slot/>
          </div>
      `,
      mounted() {
          this.$children.forEach((vm) => { //遍历所有的孩子
              if (vm.$options.name === 'tabs-navs') {
                  console.log('爷爷的selectedTab是'+this.selectedTab)
                  vm.SelectedTab(this.selectedTab) //通过儿子的selectedTab方法，传给儿子
              }else if(vm.$options.name === 'tabs-panels'){
                  vm.SelectedTab(this.selectedTab)
              }
          })
      }
  })
  Vue.component('tabs-navs', {
      data() {
          return {
              selectedTab: undefined //爸爸自己有一个selectedTab属性       
          }
      },
      template: `
      <div class='tabs-navs'>
          <slot/>
      </div>
      `,
      methods: {
          SelectedTab(tab) {
              this.selectedTab = tab //通过这个方法，从爷爷那里获取selectedTab
              console.log('爸爸获取到了爷爷的selectedTab是'+this.selectedTab)
              this.$children.forEach((vm)=>{ //同样的方法传给孙子
                  if(vm.$options.name === 'tabs-navs-item'){
                      vm.SelectedTab(this.selectedTab)
                  }
              })
          }
      }
  })
  Vue.component('tabs-navs-item', {
      props: ['name'],
      data () {
          return {
              selectedTab:undefined      
          }
      },
      template: `
      <div class='tabs-navs-item' :class = '{active}'>
          <slot/>
      </div>
      `,
      computed: {
          active() {
              return this.selectedTab === this.name
          }
      },
      methods:{
          SelectedTab(tab){
              this.selectedTab = tab
              console.log('儿子获取到了从爸爸的selected是'+this.selectedTab)
          }
      }
  })
  Vue.component('tabs-panels', {
      data () {
          return {
              selectedTab:undefined       
          }
      },
      template: `
      <div class='tabs-panels'>
          <slot/>
      </div>
      `,
      methods:{
          SelectedTab(tab){
              this.selectedTab = tab;
              this.$children.forEach((vm)=>{ //同样的方法传给孙子
                  if(vm.$options.name === 'tabs-panels-item'){
                      vm.SelectedTab(this.selectedTab)
                  }
              })
          }
      }
  })
  Vue.component('tabs-panels-item', {
      props: ['name'],
      data () {
          return {
              selectedTab:undefined
          }
      },
      template: `
      <div class='tabs-panels-item' :class = '{active}'>
          <slot/>
      </div>
      `,
      computed:{
          active(){
              return this.selectedTab === this.name
          }
      },
      methods:{
          SelectedTab(tab){
              this.selectedTab = tab
          }
      }
  })
  var vm = new Vue({
      el: '#app',
      data() {
          return {
              selectedTab: 'tab1'
          }
      },
      template: `
      <tabs selectedTab = 'tab1'>
          <tabs-navs>
              <tabs-navs-item name = 'tab1' >1</tabs-navs-item>
              <tabs-navs-item name = 'tab2' >2</tabs-navs-item>
          </tabs-navs>
          <tabs-panels>
              <tabs-panels-item name = 'tab1'>content 1</tabs-panels-item>
              <tabs-panels-item name = 'tab2'>content 2</tabs-panels-item>
          </tabs-panels>
      </tabs>
      `
  })
  ```

  这样，`selectedTab`  整个传递的线路，我们就打通了。tabs-panels的方法同理

- 下面，我点击`tabs-navs-item`的时候，需要`selectedTab = this.name`，孙子必须告诉爷爷`$emit`，但是爷爷没法直接知道，先告诉爸爸，爸爸再告诉爷爷。

  **注意：Vue没有冒泡，孙子触发的$emit事件，爸爸是不知道的，所以要用爸爸监听$on孙子，爷爷监听$on爸爸，然后爷	 爷再把数据传出去update()**

  ```javascript
  //孙子
  onClick(){
      this.$emit('update:selectedTab', this.name) //孙子传出去
  }
  //爸爸
  mounted() {
          this.$children.forEach((vm) => {
              if (vm.$options.name === 'tabs-navs-item') {
                  vm.$on('update:selectedTab', (e) => { //监听儿子的 update：selectedTab
                      console.log('爸爸知道了你要更新selectedTab是' + e)
                      this.$emit('update:selectedTab', e) //爸爸传给爷爷需要改的数
                  })
              }
          })
      }
  //爷爷
  mounted() {
          this.$children.forEach((vm) => { //遍历所有的孩子
              if (vm.$options.name === 'tabs-navs') {
                  console.log('爷爷的selectedTab是' + this.selectedTab)
                  vm.SelectedTab(this.selectedTab) //通过儿子的selectedTab方法，传给儿子
                  //爷爷监听爸爸的update，更新selectedTab属性，更新操作在updatde里面做
                  vm.$on('update:selectedTab',(e)=>{ 
                      console.log('爷爷知道了爸爸给我的selectedTab是' + e)                    
                      this.$emit('update:selectedTab',e)
                  })
              } else if (vm.$options.name === 'tabs-panels') {
                  vm.SelectedTab(this.selectedTab)
              }
          })
      },
  updated() {  //更新selectedTab
          this.$children.forEach((vm) => {
              if (vm.$options.name === 'tabs-navs') {    
                  vm.SelectedTab(this.selectedTab)
              } else if (vm.$options.name === 'tabs-panels') {
                  vm.SelectedTab(this.selectedTab)
              }
          })
      }
  
  //然后体现在 template 里 ，使用 .sync 修饰符
  var vm = new Vue({
      el: '#app',
      data() {
          return {
              value: 'tab1'
          }
      },
      template: `
      <tabs :selectedTab.sync = 'value' >  // 在这里更新
          <tabs-navs>
              <tabs-navs-item name = 'tab1' >1</tabs-navs-item>
              <tabs-navs-item name = 'tab2' >2</tabs-navs-item>
          </tabs-navs>
          <tabs-panels>
              <tabs-panels-item name = 'tab1'>content 1</tabs-panels-item>
              <tabs-panels-item name = 'tab2'>content 2</tabs-panels-item>
          </tabs-panels>
      </tabs>
      `
  })
  ```

  

  