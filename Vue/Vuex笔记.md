### Vuex

#### 1.Vuex是什么？

> Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。 
>
> Vuex 使用**单一状态树**——是的，用一个对象就包含了全部的应用层级状态。至此它便作为一个“唯一数据源 ([SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth))”而存在。这也意味着，每个应用将仅仅包含一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。
>
> 单状态树和模块化并不冲突

#### 2.安装并配置好Vuex

```javascript
//main.js
import Vue from 'vue'
import stroe from './store' //引用文件夹即可，不用定位到文件

new Vue({
    el:'#app',
    store
    //......
})
```

**将 store 对象提供给store选项，可以把 store 的实例注入到所有组件**

我这里没有使用Vuex文档上的方式，我把store放到了一个单独的文件夹里。

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
```

可以看到我们在index.js里使用了`Vue.use(Vuex)`，这表明Vuex本质上来说是一个插件，里面有`install`方法。

#### 3.State

state 可以理解为组件中的  data , 用于存储各种原始数据。

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const state = {
    isNum:true,
    BookList:{
        book1:{id:1,name:'莎士比亚'},
        book2:{id:2,name:'哈姆雷特'}
    }
}
export default new Vuex.Store({
    state
})
```

在组件中使用Vuex

```vue
// component/book.vue
<template>
    <div>
        <p v-for="item of $store.state.BookList" :key="item.id">
            {{item.name}}
        </p>
    </div>
</template>
<script>
import store from "../../store/index";
export default {
    name:'book'
}
</script>
```

因为我们注入过 `store`，所以`$store.state.BookList`可以访问到state

**也可以通过 `computed`获取数据**

```vue
<template>
    <div>
        <p v-for="item of booklist" :key="item.id">
            {{item.name}}
        </p>
    </div>
</template>

<script>
import store from "../../store/index";
export default {
    name:'book',
    computed:{
        booklist(){
            return  this.$store.state.BookList
        }
    }
}
</script>
```

假如我有很多数据，那么用上面这种方法就会使代码变得很长很难看，所以推荐使用`mapstate`辅助函数。

```vue
<script>
import store from "../../store/index";
import {mapState} from 'vuex'
export default {
    name:'book',
    computed:mapState({
        booklist:state=>state.BookList
    })
}
</script>
```

加入你的`computed`中的属性和`state`中的名字相同，那就而可以更方便了。

```vue
 <template>
    <div>
        <p v-for="item of BookList" :key="item.id">
            {{item.name}}
        </p>
    </div>
</template>

<script>
import store from "../../store/index";
import {mapState} from 'vuex'
export default {
    name:'book',
    computed:{
        ...mapState(['BookList'])
    }
}
</script>xxxxxxxxxx <script>import store from "../../store/index";import {mapState} from 'vuex'export default {    name:'book',    computed:mapState({        booklist:state=>state.BookList    })}</script>
```

... ：对象展开运算符 --- ES6的新语法

#### 4.Getter

有时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数：

```javascript
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

如果有多个组件需要用到此属性，我们要么复制这个函数，或者抽取到一个共享函数然后在多处导入它——无论哪种方式都不是很理想。

Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

Getter 接受 state 作为其第一个参数。

现在我修改一下`state`,如果我们想找所有还在的书籍，就需要用到`getter`了

```javascript
const state = {
    isNum:true,
    BookList:[
        {id:1,name:'莎士比亚',ishave:true},
        {id:2,name:'哈姆雷特',ishave:true},
        {id:3,name:'西游记',ishave:false},
        {id:4,name:'红楼梦',ishave:true},
        {id:5,name:'三国',ishave:false},
        {id:6,name:'射雕',ishave:true}
    ]
}
const getters = {
    findBook:(state)=>(ishave)=>{
        return state.BookList.filter(book=>book.ishave===ishave)
    },
    /*
     //上面的写法等价于，就是返回一个函数
       findBook:(state)=>{
        return (ishave)=>{
            return state.BookList.filter(book=>book.ishave===ishave)
        }
    }
    */
     changeNum:(state)=>{
        state.isNum = false
    },
    booksCount:(state)=>{
        return state.BookList.length
    }

}
```

组件中使用

```javascript
<template>
    <div>
        <h3>所有的书</h3>
        <p v-for="item of BookList" :key="item.id">
            {{item.name}}
        </p>
        <h3>现在还存在的书</h3>
        <p v-for="item of findBook" :key="item.id">
            {{item.name}}
        </p>
    </div>
</template>

<script>
import store from "../../store/index";
import {mapState,mapGetters} from 'vuex'
export default {
    name:'book',
    computed:{
        ...mapState(['BookList']),
        findBook(){
            return this.$store.getters.findBook(true)
        }
    }
}
</script>
```

同样 getter 也有简写,上面的因为我们要传参，所以不能简写，getter 的简写形式和 state 差不多

`...mapGetters(['xxx'])`

```javascript
import {mapState,mapGetters} from 'vuex'
export default {
    name:'book',
    computed:{
        ...mapState(['BookList','isNum']),
        findBook(){
            return this.$store.getters.findBook(true)
        },
        ...mapGetters(['booksCount'])
    }
}
```

如果想起一个别的名字

```javascript
...mapGetters({
    bookcount:'booksCount'
})
```

#### 5.Mutation

> 更改 Vuex 的 store 中的状态的**唯一方法**是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 **事件类型 (type)** 和 一个 **回调函数 (handler)**。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数

**注意: Mutation必须是同步函数，目的是让 vue的devtool里方便捕捉**

简单的来说，这就相当于Vue实例中的methods,修改东西，就要靠他commit.

我现在想要加一个给每个书籍增加数量的功能，就要使用mutations了。

在index.js里的mutations对象里写好逻辑，通过书名增加数量。

```javascript
//index.js
const mutations = {
    addBookNum(state,books){  //books = {name:'xxx',addNum:xx}
        let thebook = state.BookList.filter(book=>book.name === books.name);
        thebook[0].number+= books.addNum
    }
}
```

然后在book.vue里提交，注意，mutations的方法写在methods里

```vue
<template>
    <div>
        <h3>所有的书</h3>
        <p v-for="item of BookList" :key="item.id">
            {{item.name}}, 还有 {{item.number}}本
            <button @click="addBook({name:item.name,addNum:1})">增加1本书</button>
        </p>
        <h3>现在可以借走的书</h3>
        <p v-for="item of findBook" :key="item.id">
            {{item.name}} , 还有 {{item.number}}本
        </p>
    </div>
</template>

<script>
    import store from "../store/index";
    import {mapState,mapGetters} from 'vuex'
    export default {
        name:'book',
        computed:{
            ...mapState(['BookList']),
            findBook(){
                return this.$store.getters.findBook(true)
            },
            ...mapGetters(['booksCount'])
        },
        methods:{
            addBook(options){
                this.$store.commit('addBookNum', options)  //{name:'莎士比亚',addNum:200}
            }
        }
    }
</script>
```

这样，每一个后面就都加上了一个按钮，并且可以增加书籍的数量。

Vue的作者建议，使用常量代替Mutaions事件类型。具体使用看文档，这里就不写了。

**在组件提交的方式**

1. `this.$store.commit( 'fn' , playload)`

2. 如果不需要传参数可以使用 `mapMutations`

   ```javascript
   methods:{
       ...mapMutations([
           'addBook', //把this.addBook()映射为 this.$store.commit('addBook')
           'removeBook'
       ]),
        ...mapMutations({
               add:'addBook' // 把 this.add() 映射为 this.$store.commit('addBook')
           })
          
   }
   ```

   

#### 6.Action

刚才说了 Mutation 只能为同步函数，那么处理异步的时候就需要 Action了。

- Action 提交的是 mutation , 而不是更改 state
- Action 可以包含任何异步操作

Action接收一个`context`参数，里面包含`commit state getters`。

在actions里面异步提交 `addBookNum`

```javascript
const actions = {
    addBookNumAsync({commit},options){
        setTimeout(()=>{
            commit('addBookNum',options)
        },3000)
    }
```

在book.vue里通过dispatch触发。

```javascript
 methods:{
            addBook(options){
                this.$store.commit('addBookNum', options)  //{name:'莎士比亚',addNum:200}
            },
            addBookAsync(options){
                console.log(options);
                this.$store.dispatch('addBookNumAsync',options)
            }
        }
```

上面是最简单的异步处理，

> Action 通常是异步的，那么如何知道 action 什么时候结束呢？更重要的是，我们如何才能组合多个 action，以处理更加复杂的异步流程？
>
> 首先，你需要明白 `store.dispatch` 可以处理被触发的 action 的处理函数返回的 Promise，并且 `store.dispatch` 仍旧返回 Promise

模拟一下更新书籍的操作

```javascript
addNewBookAsync({commit}){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                let newBook = [{id:66,name:'水浒', number:12,ishave:true}]
                commit('addNewBook',newBook)
                resolve()
            },3000)
        })
    }
```

在book.vue里

```javascript
 addNewBook(){
                this.$store.dispatch('addNewBookAsync').then(()=>{
                    alert('更新成功')
                })
            }
```

在另外一个actions中也可以

```javascript
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

也可以使用 async/await

```javascript
// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

一个 `store.dispatch` 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。

#### 7.Module

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成**模块（module）**。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：

```javascript
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

#### 7.总结

使用vuex的流程是这样的

action调用=>mutation修改=>state(发生改变的时候)=>getter