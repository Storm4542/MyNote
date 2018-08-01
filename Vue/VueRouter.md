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
    ]
})
```

加上 children 以后不要以为万事大吉了,需要在 `user` 里面加上 `router-view` 标签，不然无法展示。

```vue
<template>
    <div>
        id:{{$route.params.id}}
        <router-view></router-view>
    </div>

</template>
```

**要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径。**

你会发现，`children` 配置就是像 `routes` 配置一样的路由配置数组，所以呢，你可以嵌套多层路由。



##### 3.编程式的导航

之前我们写导航是这么写的：`<router-link to="/user/1/profile"></router-link>`,这叫做声明式的导航。

除了使用 `<router-link>` 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。

## `route.push(location,onComplete?,onAbort?)`

**注意：在 Vue 实例内部，你可以通过 $router 访问路由实例。因此你可以调用 this.$router.push。**

想要导航到不同的 URL，则使用 `router.push` 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。

当你点击 `<router-link>` 时，这个方法会在内部调用，所以说，点击 `<router-link :to="...">` 等同于调用 `router.push(...)`。

| 声明式                    | 编程式             |
| ------------------------- | ------------------ |
| `<router-link :to="...">` | `router.push(...)` |

该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如：

```javascript
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: 123 }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

**注意：如果提供了 path，params 会被忽略，上述例子中的 query 并不属于这种情况。取而代之的是下面例子的做法，你需要提供路由的 name 或手写完整的带有参数的 path：**

```javascript
const userId = 123
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
// 这里的 params 不生效
router.push({ path: '/user', params: { userId }}) // -> /user
```

同样的规则也适用于 `router-link` 组件的 `to` 属性。

在 2.2.0+，可选的在 `router.push` 或 `router.replace` 中提供 `onComplete` 和 `onAbort` 回调作为第二个和第三个参数。这些回调将会在导航成功完成 (在所有的异步钩子被解析之后) 或终止 (导航到相同的路由、或在当前导航完成之前导航到另一个不同的路由) 的时候进行相应的调用。

**注意：**如果目的地和当前路由相同，只有参数发生了改变 (比如从一个用户资料到另一个 `/users/1` -> `/users/2`)，你需要使用 [`beforeRouteUpdate`](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E5%93%8D%E5%BA%94%E8%B7%AF%E7%94%B1%E5%8F%82%E6%95%B0%E7%9A%84%E5%8F%98%E5%8C%96) 来响应这个变化 (比如抓取用户信息)。

## `route.replace(location,onComplete?,onAbort?)`

和 push 很像，唯一不同的是，它不会向 history 添加记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。 这意味着，浏览器上的后退按钮将不会后退到前一个页面。

| 声明式                            | 编程式                |
| --------------------------------- | --------------------- |
| `<router-link :to="..." replace>` | `router.replace(...)` |

## `router.go(n)`

参数 n 是整数，意思是在 histroy 记录中向前或者向后几步。类似 `window.history.go(n)`

```javascript
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)

// 后退一步记录，等同于 history.back()
router.go(-1)

// 前进 3 步记录
router.go(3)

// 如果 history 记录不够用，那就默默地失败呗
router.go(-100)
router.go(100)
```

##### 4.命名路由

```javascript
  routes: [
        {
            name:'index',
            path: '/',
            component: index
        },
        {
            name:'user',
            path: '/user/:id',
            component: user,
            children: [
                {
                    name:'profile',
                    path: 'profile',
                    component: profile
                }
            ]
        },
    ]
```

加上 name 会使我们在 push 和 to 操作的时候更加方便

`route.push({name:'user',params:{id:123}})`

`<router-link :to='{name:"user",params:{id:123}}'></router-link>`

##### 5.命名视图

当我们想在一个页面中展示两个视图组件的时候就用到命名视图了。

首先，在 router.js里修改。

```javascript
 	  {
            name:'index',
            path: '/',
            components: {   //component ---> components
                default:index,  //默认index
                a:profile       // a是profile
            }
        },
```

在视图里增加入口。

```vue

```

这样就可以展示两个视图组件了。

**嵌套命名视图**

简单的来说就是children里有命名视图

比如，我想在 /user/123/profile 里展示 profile 和 photo ，就像下面这么写。这样，user,profile,photo 这些视图组件就都在一个页面里了。

```javascript
	  {
            name:'user',
            path: '/user/:id',
            component: user,
            children: [
                {
                    name:'profile',
                    path: 'profile',
                    components: {
                        default: profile,
                        a:photo
                    }
                }
            ]
        },
```

```vue
 <router-view></router-view>
 <router-view name="a"></router-view>
```

##### 6.重定向

重定向的三种方式。

```javascript
const router = [
    {
        name:'foo'
        path:'/a',
        redirect:'/b'
	},
    {
        path:'/c',
        redirect:'{name:foo}'
    },
    {
        path:'/a',
        redirect:to=>{
           // 方法接收 目标路由 作为参数
          // return 重定向的 字符串路径/路径对象
        }
    }
    }
]
```

注意[导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)并没有应用在跳转路由，上而仅仅应用在其目标上 ，第下面例子中，为 `/a` 路由添加一个 `beforeEach` 或 `beforeLeave` 守卫并不会有任何效果。 

```javascript
const router = [
    {
        name:'foo'
        path:'/a',
        redirect:'/b',
        beforeLeave(to,from,next){}
	}
    ]
```

##### 7.别名

当我们想从`/a`跳转到`/b`，但是又不想改变URL，就用到了别名alias

```javascript
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

**/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。** 



##### 8.路由组件传参

- $route

比如我们要展示用户 alan 的个人主页，路由是`/user/alan/profile` , 可以通过 `$route.params.id`

```vue
<div>{{$route.params.id}}</div>	
```

- props 布尔模式

在路由配置中写入`props:true`,这样`route.params`会被设置为组件属性。

```javascript
	 {
            name:'user',
            path: '/user/:id',
            component: user,
            props:true,
            children: [
                {
                    name:'profile',
                    path: 'profile',
                    components: {
                        default: profile,
                        a:index
                    },
                    // 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
                    props: {default:true,a:false}
                }
            ]
        },
```

```vue
<template>
	<div>
        {{id}}
    </div>
</template>
<script>
    export default{
        props:['id']
    }
</script>
```

- props 对象模式

```javascript
 routes: [
        {
            name:'index',
            path: '/',
            props:{username:'map_name'},
            component:index
        },
     ]
```

```vue
<template>
	<div>
        {{username}}
    </div>
</template>
<script>
    export default{
        props:['username']
    }
</script>
```

注意，此时的 props 必须是静态的。

- props 函数模式

这样就可以动态生成 props ，比如Url 是 `/user/:id/postId/:postId`,我现在想把所有参数传进去

```javascript
 routes: [
        {
            name:'user',
            path: '/user/:id/postId/:postId',
		   props:  (route) => ({ params: route.params }) ,
            component:User
        },
     ]
```

```javascript
<template>
	<div>
        {{params.id}}--{{params.postId}}
    </div>
</template>
<script>
    export default{
        props:['params']
    }
</script>
```

