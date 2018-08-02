### LESS

#### 1.LESS是什么

LESS是一种**动态**样式语言。

LESS 将 CSS 赋予了动态语言的特性，如 变量， 继承，运算， 函数. LESS 既可以在 客户端 上运行 (支持IE 6+, Webkit, Firefox)，也可以借助Node.js或者Rhino在服务端运行。

#### 2.基本用法

##### 1.变量

```less
@border-color:#fff;
div{border:1px solid @border-color}
```

##### 2.混合

混合可以将一个定义好的class A轻松的引入到另一个class B中，从而简单实现class B继承class A中的所有属性。我们还可以带参数地调用，就像使用函数一样。

```less
.classA (@radius:5px){border-radius:@radius}
.classB {.classA}
.classC {.classA(10px)}
```

@arguments变量 像写函数一样写CSS , 理解为JS里的 arguments 即可

```less
.box-shadow(@x:0 , @y:0 , @blur:1px, @color:#666){
    box-shadow:@arguments
}
.box-shadow(1px,2px);  // '调用函数'的感觉
.box-shadow(0,0,2px,#888)
```

##### 3.嵌套

**最常用的**

我们可以在一个选择器中嵌套另一个选择器来实现继承，这样很大程度减少了代码量，并且代码看起来更加的清晰。(&表示当前元素)

```less
.Parent{
    font-size:12px;
    > h1{ font-size : inherit}
    > input { 
        color: black;
        &:hover{ color: red}
    }
}
```

##### 4.函数&&运算

运算提供了加，减，乘，除操作；我们可以做属性值和颜色的运算，这样就可以实现属性值之间的复杂关系。LESS中的函数一一映射了JavaScript代码，如果你愿意的话可以操作属性值。

```less
@the-border: 1px;
@base-color: #111;
@red: #842210;
#header {
  color: @base-color * 3;
  border-left: @the-border;
  border-right: @the-border * 2;
}
#footer { 
  color: @base-color + #003300;
  border-color: desaturate(@red, 10%);
}
```

##### 5.引导

当我们想根据表达式进行匹配，而非根据值和参数匹配时，导引就显得非常有用。如果你对函数式编程非常熟悉，那么你很可能已经使用过导引。

为了尽可能地保留CSS的可声明性，LESS通过导引混合而非if/else语句来实现条件判断，因为前者已在@media query特性中被定义。

```less
//匹配模式和引导表达式
.min(drak,@color){
    color: darken(@color,20%);
    //将颜色加深20%
}
.min(light,@color){
    color: lighten(@color,20%);
    //将颜色变浅20%
}
.min(@_,@color){
    display: block;
}
@switch1:drak;
@switch2:light;

span{
    //.min(@switch1,#ddd);
    //.min(drak,#ddd);@color:#ddd
    //.min(@switch2,#ddd);
    //@_,接受任意值，你传什么值他都会执行；
    .min(@word,#ccc);
}

/*---------------------------------*/
.mixin(@a){
    color:@a
}
/*@a的color亮度大于50%的话*/
.mixin(@a) when (lightness(@a)>=50%){ 
    background-color:black
}
.mixin(@a) when (lightness(@a)<50%){
    background-color:white
}

.classA{.mixin(#ddd)}
.classB{.mixin(#555)}
//注释
/*
 注释
 * color函数
 * 1. lighten(@color,10%):
 * 意思：return a color which is 10% lighter than @color
 * 2. darken(@color,10%);
 * 意思：return a color which is 10% draker than @color
 * 3. statuate(@color,10%);//增加饱和度
 * 意思：return a color which is 10% statuated than @color
 * 4. destatuste(@color,10%);//减少饱和度，褪色
 * 5. fadein(@color,10%)
 * 6. fadeout(@color,10%)
 * 7. fade(@color,50%)
 * 8. spin(@color,10)
 * 9. spin(@color,-10)
 * 10. mix(@color1,@color2);混合
 * 
 * 
 * 提取颜色信息
 * hue(@color):返回当前颜色的色调
 * staturation(@color):返回当前颜色的饱和度
 * lightness(@color):返回当前颜色的亮度(浅的度数)
 * */
```

得到

```css
.classA {
  background-color: black;
  color: #ddd;
}
.classB {
  background-color: white;
  color: #555;
}
```

##### 6.计算功能

```less
//计算功能：任何颜色，变量都可以参与运算
@base:5%;
@filter:@base*2;//10%
@other:@base*4+@filter;//30%
.box{
    color: #FFFF00;
    background-color: @filter+#111;
    height: 100%/2+@other;
}

@var:10px + 5;
#box1{
    width: (@var + 20)*2;
    height: (@var - 5)*3;
    p{
        height: (@var + 5)/2;
        background-color: #101010+#000111;
        border: @var - 5 solid #0000ff;
    }
}

//less也支持部分Math函数
//round(1.67)->2
//ceil(2.1)->3
//floor(2.9)->2
//peercentage(0.5)->50%转为百分数的函数
#s{
    width: 100px;
    height: 100px;
    border-radius: percentage(0.5);
}

```

##### 7.Import && 字符串插值

```less
import 'lib.less'
import 'lib' //可省略后缀名

import 'lib.css' //引入一个CSS，并且不让LESS对它进行处理

@baseURL = 'http://storm4542.github.com'
body{background: url("@{baseURL}/image/bg.jpg")}  //类似JS 的 ${xxx}
```

[LESS粗略了解]: http://www.bootcss.com/p/lesscss/	"粗略了解"
[LESS函数]: http://lesscss.cn/functions/	"LESS函数"

