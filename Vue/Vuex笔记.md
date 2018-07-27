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

