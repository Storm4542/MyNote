### Vue动画

#### 1.简单例子

```html
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

```javascript
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
```

```css
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
```

该例子可以实现 p 标签的渐隐效果。

#### 2.使用CSS添加稍微多一点动画

```css
.test{
  width:100px;
  border:1px solid red;
  text-align: center;
}
.slide-enter-active,.slide-leave-active{
  transition:all 1s;
}
.slide-enter{
  opacity: 0;
  transform:translateX(100px)
}
.slide-leave-to{
  opacity: 0;
  transform:translateX(-100px)
}
```

实现了一个类似轮播感觉的动画。

##### # 使用 animation

```css
.test {
  width: 100px;
  border: 1px solid red;
  text-align: center;
}
.slide-enter-active {
  animation: bounce-in 2s
}
.slide-leave-active {
  animation: bounce-in 2s reverse
}
@keyframes bounce-in {
  0% {
    transform: scale(0)
  }
  50% {
    transform: scale(2)
  }
  100% {
    transform: scale(1)
  }
}
```

一个 Scale-in-out 的动画效果

#### 3.使用 Animate.css

动画这个东西写起来还是比较复杂的，但是有大牛帮我们写好了。

```html
<!--  <link href="https://cdn.bootcss.com/animate.css/3.5.2/animate.css" rel="stylesheet"> -->
 <div id="demo">
    <button v-on:click="visable = !visable">
      Toggle
    </button>
    <transition 
                name="custom-classes-transition" 
                enter-active-class="animated tada" 
                leave-active-class="animated bounceOutRight">
      <p class=test v-if="visable">hello</p>
    </transition>
  </div>
```

这样不用写 CSS 了，这里的 name 可写可不写。

但是标签里的 **过度类名** 和之前不一样了:

- `enter-class`
- `enter-active-class`
- `enter-to-class` (2.1.8+)
- `leave-class`
- `leave-active-class`
- `leave-to-class` (2.1.8+)

各种效果预览:

[Animate.css]: https://daneden.github.io/animate.css/

#### 4.使用 JavaScript 钩子

有时候我们需要在动画的过程中做一些事情，这就需要钩子函数了。

首先在属性中声明钩子:

```html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```

然后在实例中的 methods 中：

```javascript
// ...
methods: {
  // --------
  // 进入中
  // --------

  beforeEnter: function (el) {
    // ...
  },
  // 此回调函数是可选项的设置
  // 与 CSS 结合时使用
  enter: function (el, done) {
    // ...
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },

  // --------
  // 离开时
  // --------

  beforeLeave: function (el) {
    // ...
  },
  // 此回调函数是可选项的设置
  // 与 CSS 结合时使用
  leave: function (el, done) {
    // ...
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled 只用于 v-show 中
  leaveCancelled: function (el) {
    // ...
  }
}
```

当**只用 JavaScript 过渡**的时候，**在 enter 和 leave 中必须使用 done 进行回调**。

否则，它们将被同步调用，过渡会立即完成。

##### # 使用 Velocity.js

这是一个很出名的使用 JavaScript 做动画的库，与其自己写，不如直接用他的。

(当然，我们一般用CSS )

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<div id="example-4">
  <button @click="show = !show">
    Toggle
  </button>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
    v-bind:css="false"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
```

```javascript
new Vue({
  el: '#example-4',
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transformOrigin = 'left'
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
})
```

#### 5.多个元素的过度

上面我们一直在写单个元素的动画，涉及到多个元素，该如何操作呢？

```javascript
new Vue({
  el: '#demo',
  data: {
    status: 'on'
  }
})
```

```html
<div id="demo">
    <transition name='slide' mode = "out-in">
      <button v-if="status === 'off'" key="on" @click="status='on'">on</button>
      <button v-else="status === 'on'" key="off" @click="status='off'">off</button>
    </transition>
</div>
```

- `name` : 类名
- `mode` : `in-out `, `out-in` 
- `key `: 两个元素的时候一定要加上 `key` 属性，里面写啥不重要，但是一定要写上，并且不重复

```css
#demo {
  position: relative;
}
button {
  position: absolute;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 1s;
}
.slide-enter {
  opacity: 0;
  transform: translateX(100px)
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100px)
}
```

#### 6.组件之间的过度

```html
  <div id="demo">
       <button @click="temp='v-a'">A</button>
       <button @click="temp='v-b'">B</button>
    <transition name='slide' mode="out-in">
      <component v-bind:is='temp'></component>
    </transition>
  </div>
```

```javascript
new Vue({
  el: '#demo',
  data: {
    temp: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }

  }
})
```

```css
.slide-enter-active,
.slide-leave-active {
  transition: all 1s;
}
.slide-enter {
  opacity: 0;
  transform: translateX(100px)
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100px)
}
```

组件之间的过度不需要 `key`