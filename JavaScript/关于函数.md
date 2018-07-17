你真的懂函数吗---JS高阶课程

### 1.定义

 	i 匿名函数

​	` var fn = function(){return 1} 有name fn.name = 'fn'`

​	ii 具名函数

​	`function fn(){ return 1}`

​	`var fn2 = function fn3(){ return 2 }`

​	 两者的区别在于函数作用域

​	` console.log(fn()) fn()`  

​	`console.log(fn3()) undefined`

​	iii 箭头函数

​	`var fn = (i,j)=>{return i+j}` fn.name = fn

###2.词法作用域（静态作用域）

      var global1 = 1

         function fn1(param1){

           var local1 = 'local1'
           var local2 = 'local2')
           function fn2(param2){
               var local2 = 'inner local2'
               console.log(local1)
               console.log(local2)
           }
    
         function fn3(){
             var local2 = 'fn3 local2'
             fn2(local2)
         }
       }


    var i = 1,j = 2,k = 3;

    function a(o,p,x,q){

    var x = 4;
        alert(i+'a');
    function b(r,s) {
        var i = 11,y = 5;
            alert(i+ 'b');
        function c(t){
          var z = 6;
                alert(i+'c');
        };
            //函数表达式
        var d = function(){
                alert(y+'y d');
            };
            c(60);
            d();
    };
        b(40,50);
        }
    
    a(10,20,30);

 通过画出词法树分析。先找同级有没有，再找上级的。

[方方的视频](https://xiedaimala.com/tasks/f3b7885d-ac51-4c41-a498-d01d532cc651?learnable_type=VideoTutorial&learnable_id=76247167-7764-4c49-bf78-53b4d126da7a#/)

[参考](http://js8.in/2011/08/15/javascript%E7%9A%84%E8%AF%8D%E6%B3%95%E4%BD%9C%E7%94%A8%E5%9F%9F/)

###3.call stack

​	i stack

​	栈，先进后出，后进先出。

> [1+1+1](http://latentflip.com/loupe/?code=ZnVuY3Rpb24gYSgpewogICAgY29uc29sZS5sb2coJ2EnKQogIHJldHVybiAnYScgIAp9CgpmdW5jdGlvbiBiKCl7CiAgICBjb25zb2xlLmxvZygnYicpCiAgICByZXR1cm4gJ2InCn0KCmZ1bmN0aW9uIGMoKXsKICAgIGNvbnNvbGUubG9nKCdjJykKICAgIHJldHVybiAnYycKfQoKYSgpCmIoKQpjKCk%3D!!!)
>
> [1+2+3](http://latentflip.com/loupe/?code=ZnVuY3Rpb24gYSgpewogICAgY29uc29sZS5sb2coJ2ExJykKICAgIGIoKQogICAgY29uc29sZS5sb2coJ2EyJykKICByZXR1cm4gJ2EnICAKfQpmdW5jdGlvbiBiKCl7CiAgICBjb25zb2xlLmxvZygnYjEnKQogICAgYygpCiAgICBjb25zb2xlLmxvZygnYjInKQogICAgcmV0dXJuICdiJwp9CmZ1bmN0aW9uIGMoKXsKICAgIGNvbnNvbGUubG9nKCdjJykKICAgIHJldHVybiAnYycKfQphKCkKY29uc29sZS5sb2coJ2VuZCcp!!!)
>
> [递归](ZnVuY3Rpb24gZmFiKG4pewogICAgY29uc29sZS5sb2coJ3N0YXJ0IGNhbGMgZmFiICcrIG4pCiAgICBpZihuPj0zKXsKICAgICAgICByZXR1cm4gZmFiKG4tMSkgKyBmYWIobi0yKQogICAgfWVsc2V7CiAgICAgICAgcmV0dXJuIDEKICAgIH0KfQoKZmFiKDUp)
>
> > 斐波那契数列
> >
> > function fb(n){
> >
> > console.log('我正在计算'+ n );
> >
> > if( n>=3 ){
> >
> > return fb(n-1) + fb(n-2)
> >
> > }else{
> >
> > return 1;
> >
> > }
> >
> > }

### 4.this && arguments

- this 是隐藏的第一个参数，而且必须是对象。

  - ```javascript
    function f(){console.log(this); console.log(arguments)}
    f.call() // window []
    f.call({name:'zty'}) // {name:'zty'} []
    f.call({name:'zty'},1,2) // {name:'zty} [1,2]
    ```

  - 调用一个函数，开始需要三部

    - 记录函数的位置，放入 call stack

    - 传入 this 对象

    - 传入 arguments 数组(伪)

  - 为什么要用 call

    - fn() 是 fn.call() 的阉割版

- 为什么 this 必须是对象

  - 因为 this 就是函数与对象之间的羁绊

  - ```javascript
    var person = {
      name : 'zty',
      sayHi : function(person){
        console.log(person.name ,'HI')
      }
    }
    person.sayHi(person) // zty HI 这种方式很蠢，前面有 person 后面有 person, 为什么 JS 不能帮我把 参数中的person 指定了呢，于是改造一下
    var person = {
      name : 'zty',
      sayHi : function(){
        console.log(this.name ,'HI')
      }
    }
    person.sayHi.call(person) // zty HI 不吃语法糖 this === person ，指定this
    person.sayHi() // 吃语法糖
    person.sayHi.call({name:'xxx'}) // xxx HI 说明里面的函数其实跟person对象没有任何关系，是独立的。(this 真的很不靠谱)
    ------------------------------
    var fn = person.sayHi;
    fn() // HI 显示不出 'zty',这是因为fn()其实是 fn.call() => this为window
    fn(person) // HI this === window
    fn.call(person) // zty HI this === persom
    ```

### 5.call/aplly

​	i call 用是函数调用标准写法，传递this , xxx.call(ASthis , arguments)

​	ii  当你不确定参数的个数时候(数组)，使用apply , xxx.apply(ASthis , [ ... ])

```javascript
function sum () {
  var n = 0 ;
  for(var i = 0 ; i<arguments.length ; i++){
    n+=arguments[i]
  }
  return n ;
} // 无论有多少参数都可以求和的函数
sum.call(undefined , 1,2,3)   // 6
sum.call(undefined , 1,2,3,4) // 10
//假如你不知道有多少参数呢？传给你一个数组 a , 并不知道里面的内容，如何求和？
//或者 a.length === 100 ，你如何传参呢？
sum.apply(undefined , a);
```

### 6.bind

​	call 和 apply 都是直接调用函数，而 bind 是返回一个新的函数 ， 这个新函数会call 原来的参数 ，call 的参数由你指定。

```javascript
var view = {
  element : '#div',
  bindEvents : function (){
    this.element.onClick = this.onClick.bind(this)
    //view.element.onClick = view.onClick.bind(view)
    //this.onClick.bind(this) bind的参数this ，会变成 onClick 的第一个参数
    //为什么这么做？因为 onClick 的 this ， 是被点击元素，我们需要的 this === view
  }
    onClick: function (){
      this.element.addClass('active')
    }
}
```

### 7.回调 callback

​	i 名词形式 ： 被当做参数的函数 ` array.sort(function(a,b){return a-b})`

​	ii 动词形式 ： 调用这个回调

​	回调跟异步没有一点关系

### 8.构造函数

​	i 返回对象的函数就是构造函数  `new Number(1)`

​	ii 一般首字母大写。

### 9.箭头函数

​	i 箭头函数没有 this 

​	ii 有 arguments 







