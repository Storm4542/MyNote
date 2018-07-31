### Vue-Router

#### 1.简单配置

创建router.js

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import index from './components/index'
import user from './components/user'
Vue.use(Router)
export default new Router({
     routes:[
        {path:'/',component:index},
        {path:'/user',component:user},
    ]
})
```

在main.js里加入根实例

```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    router
}).$mount('#app')
```

在App.vue里使用

```vue
<template>
    <div id="app">
        <router-link to="/">index</router-link>
        <router-link to="/user">info</router-link>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
    }
</script>
```

#### 2.基础用法

##### 1.动态路由匹配

```javascript
//router.js
export default new Router({
     routes:[
        {path:'/',component:index},
        {path:'/user/:id',component:user},
    ]
})
```

可以以 冒号 标记参数，该参数可以通过 `this.$router.params.id`获得。

```vue
<!-- user.vue -->
<template>
    <div>id:{{id}}</div>
</template>

<script>
    export default {
        name: "info",
        computed:{
            id(){
                return this.$route.params.id
            }
        },
    }
</script>
```

**响应路由参数的变化**

> 提醒一下，当使用路由参数时，例如从 `/user/1` 导航到 `/user/2`，**原来的组件实例会被复用**。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。**不过，这也意味着组件的生命周期钩子不会再被调用**。
>
> 复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch (监测变化) `$route` 对象：

```javascript
 export default {
        name: "info",
        computed:{
            id(){
                return this.$route.params.id
            }
        },
        watch:{
            '$route'(to,from){
                //（到哪去，从哪来）
                //对路由变化做出响应
            }
        }
    }
```

或者使用`beforeRouteUpdate(to,from,next)`守卫

##### 2.嵌套路由 children

```javascript
export default new Router({
    routes: [
        {
            path: '/',
            component: index
        },
        {
            path: '/user/:id/',
            component: user,
            children: [
                {
                    path: 'profile',
                    component: profile
                }
            ]
        },
        {
            path:'/a',
            name:'a',
            component:index,
            children: [{
                path:'profile',
                component:profile
            }]
        }
    ]
})
```

