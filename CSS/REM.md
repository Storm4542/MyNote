### REM

#### 1.各种单位

1. px 像素

2. em 一个M的宽度，跟自身的 font-size 相同

3. rem  **根元素**的 font-size

4. vh : viewport height 视口高度  100vh === 视口高度

   vm: viewport width 视口宽度 100vw === 视口宽度

#### 2.使用REM

当我们要写一个适配手机的页面的时候，我们就会陷入这样蛋疼的境地。

因为各种品牌，各种型号的手机分辨率是不一样的，这就很蛋疼了。

这时候就使用REM来解决这个问题。

1. REM始终为根元素(html)的 font-size 的值。

2. 手机页面的宽度 width 是永远不变的。

知道了上面两个前提，我们就可以做一些事情了。

1. 通过 width的值设置根元素的 font-size。
2. 通过 REM 定义各种宽和高，这样就是永远适配当前页面宽度的。

首先，添加 meta:viewport 标签

```html
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```

第二步，通过 width 计算根元素的font-size

```javascript
var $width = window.outerWidth;
document.write(`<style>html{font-size:${$width/10}px}</style>`)
```

P.S. 虽然这个 fontsize/n 中的 n  ,是你可以自己决定的，但不要忘记了 

1. 12px 原则，chrome浏览器会阻止你设置比 12px还小的字。

2. 假如你换算出来的 px 太小，CSS会认为这是 0 或者 1。

第三步，写CSS

```css
div{
    height:3rem;
    widht:3rem;
    margin:0 .5rem
}
```

通过上面的换算，我们可以知道

1. 根元素的 font-size = $width/10 ， 也就是 十分之一个屏幕的宽度。
2. 所以 3rem === 十分之三个屏幕宽度。
3. 所以，无论在什么环境下，它都永远等于十分之三个屏幕宽度。
4. 因此，在每一个设备上的观看效果都相同。

#### 3.使用sass

每次都要计算，非常的麻烦，所以使用 sass 或者 less 帮我们计算。

安装sass

- npm config set registry <https://registry.npm.taobao.org/>

- touch ~/.bashrc

- echo 'export SASS_BINARY_SITE="[https://npm.taobao.org/mirrors/node-sass"'](https://npm.taobao.org/mirrors/node-sass%22') >> ~/.bashrc

- source ~/.bashrc

- npm i -g node-sass

- mkdir ~/Desktop/scss-demo

- cd ~/Desktop/scss-demo

- mkdir scss css

- touch scss/style.scss

- start scss/style.scss

- node-sass -wr scss -o css

  编辑 scss 文件就会自动得到 css 文件

```scss
@function px( $px) {
    @return $px/$designWidth*10+rem;  
    //这里为啥✖️10呢，因为在上面我们除以10了，所以要计算出比例值需要✖️10
    //假设 屏幕宽度为 320px , 那么 root font-size:32px ,即 1rem === 32px ，把屏幕分成了10等份。
    //但是 设计稿宽度为 640px , 里面还有一个高度为 320px 的 div,
    //相对于设计稿,div的比例是 320/640=1/2 , 也就是占了5份的屏幕宽度 即为 5rem 
    //所以 height : 5rem 
}
@designWidth:640; //根据设计稿的宽度来写。
body{
    font-size: 16px;
}
.child {
    width: px2rem(320);;
    height: px2rem(160);
    margin: px2rem(40) px2rem(40);
    border: 1px solid red;
}
```