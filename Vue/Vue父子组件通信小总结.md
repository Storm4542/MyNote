感觉Vue中父子传参的方式，实在是太多了，于是做一个小总结，只是总结我所知道的。

### 1.父传子

基本就用一个方式，`props`

父亲通过在 **标签** 中写入需要传入的数据。

```html
<!--father.vue-->
<template>
    <div>
        我是爸爸，下面是儿子
        <son title='儿子' :selected='selected'></son>
    </div>
</template>
```

儿子在 实例中的 `props` 选项中获取

```javascript
//son.vue
export default {
    name:'son',
    props:{
        selected:{
            type:Boolean
        },
        title:{
            type:String
        }
    }
}
```

### 2.子传父

#### # `update:my-prop-name` 模式

Vue 是单项数据流，所以不允许 儿子 直接修改父亲的数据，也不允许儿子直接修改自己的`props`。

假设一个情况，点击儿子，儿子需要改变 `selected` 的状态。

**儿子方面**

触发点击事件后， 让儿子触发一个 `update` 事件，把新的 `selected` 传出去

```vue
<!--son.vue-->
<template>
    <div class="son" @click="onClick">
        title:{{title}} selected:{{selected}}
    </div>
</template>
<script>
export default {
  name: "son",
  props: {
    selected: {
      type: Boolean
    },
    title: {
      type: String
    }
  },
  methods: {
    onClick() {
      this.$emit("update:selected", !this.selected); //关键点
    }
  }
};
</script>

<style>
.son {
  border: 1px solid red;
}
</style>
```

**父亲方面**

在标签中监听 `update`事件，并将传过来的 `$event`付给 `selected`，这样就完成了一次传参。

```vue
<!--father.vue-->
<template>
    <div>
        我是爸爸，下面是儿子
        <son title='儿子' :selected='selected' @update:selected='selected=$event'></son> 
        <!--关键点-->
    </div>
</template>

<script>
import Son from "./son";
export default {
  name: "father",
  components: {
    Son
  },
  data() {
    return {
      selected: true
    };
  }
};
</script>
```

简单方式

**.sync 修饰符**

```vue
<!--father.vue-->
<template>
    <div>
        我是爸爸，下面是儿子
        <son title='儿子' :selected.sync='selected'></son> 
        <!--关键点-->
    </div>
</template>
```

#### #  $parents API

**儿子方面**

从 `this.$parent`中可以获取到 父组件 的 data 数据 ，直接进行修改，是不是很刺激。

```javascript
methods: {
    onClick() {
      this.$parent.selected = !this.$parent.selected;
    }
  }
```

虽然刺激，**但是，我建议调用父组件的函数，来切换状态。**

**父亲方面**

```javascript
//father.vue
export default {
  name: "father",
  components: {
    Son
  },
  data() {
    return {
      selected: true
    };
  },
  methods: {
    changeSelected() {
      this.selected = !this.selected;
    }
  }
};
```

**儿子方面**

```javascript
//son.vue 
methods: {
    onClick() {
      this.$parent.changeSelected();
    }
  }
```

#### # EventBus

如果只是一个父亲，一个儿子上面的方法非常的简单实用，但是如果是祖孙三代传参呢？上面的方法就很麻烦了。

具体怎么麻烦，可以看一下我的这篇文章，用原始的方法造 tabs轮子:https://zhuanlan.zhihu.com/p/39601572 

废话不多说，开始用 EventBus做一个简单的 tabs组件。

##### #app.vue

```vue
<template>
  <div id="app">
    <tab selected='news'>
      <tab-item name='news'>新闻</tab-item>
      <tab-item name='car'>汽车</tab-item>
      <tab-item name=‘code’>代码</tab-item>

      <tab-pane name='news'>新闻列表</tab-pane>
      <tab-pane name='car'>汽车列表</tab-pane>
      <tab-pane name=‘code’>代码列表</tab-pane>
    </tab>
  </div>
</template>

<script>
import Tab from "./components/tabs.vue";
import TabItem from "./components/tab-item";
import TabPane from "./components/tab-pane";

export default {
  name: "app",
  components: {
    Tab,
    TabItem,
    TabPane
  }
};
</script>
```

##### # tabs.vue

```vue
<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
import TabItem from "./tab-item.vue";
import Vue from "vue";  //引入VUE
export default {
  name: "tab",
  props: {
    selected: {
      type: [Number, String]
    }
  },
  data() {
    return {
      eventBus: new Vue() // 创建 eventBus
    };
  },
  provide() {
    return {
      eventBus: this.eventBus // 提供 eventBus
    };
  },
  mounted() {
    this.eventBus.$emit("update:selected", this.selected); 
      //发布消息，告诉大家，现在的selected是啥
  }
};
</script>

<style>
</style>
```

##### # tabs-item.vue

```vue
<template>
    <div @click="onClick" :class="{active}">
        <slot/>
    </div>
</template>

<script>
export default {
  name: "tab-item",
  props: {
    name: {
      type: [String, Number]
    }
  },
  inject: ["eventBus"], //注入 eventBus
  data() {
    return {
      active: false
    };
  },
  created() {
    this.eventBus.$on("update:selected", newSelected => {
      this.active = this.name === newSelected;
    }); //接收消息，如果newselected 和我的 name 相同，那么我就被选中了
  },
  methods: {
    onClick() {
      this.eventBus.$emit("update:selected", this.name);
        //发布消息，如果点击了我，我就告诉大家，我被选中了
    }
  }
};
</script>

<style>
.active {
  color: red;
}
</style>
```

##### # tab-pane.vue

```vue
<template>
  <div v-if="active" class="pane">
    <slot/>
  </div>
</template>

<script>
export default {
  name: "tab-pane",
  props: {
    name: {
      type: [String, Number]
    }
  },
  data() {
    return {
      active: false
    };
  },
  inject: ["eventBus"],//注入 eventBus
  created() {
    this.eventBus.$on("update:selected", newSelected => {
      this.active = this.name === newSelected;
    });
      //接收消息，如果newselected 和我的 name 相同，那么我就被选中了
  }
};
</script>

<style>
.pane {
  color: red;
}
</style>
```

#### # 灵活运用 provide inject

```javascript
//father.vue
export default {
    name:'father',
    data(){
        return {
            someThing:'father'
        }
    },
    provide(){
        return {
            father:this
        }
    }
}
```

```javascript
//son.vue
export default {
    name:'son',
    inject:['father'],
    methods:{
        onClick(){
            this.father.someThing = 'son'
        }
    }
}
```

