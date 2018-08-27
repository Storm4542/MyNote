### 在 Vue Cli 3 中使用 px2rem



#### # 安装 postcss-px2rem

```bash
yarn add postcss-px2rem
```

#### # 在 vue.config.js 中添加配置

```javascript
const px2rem = require('postcss-px2rem')

const postcss = px2rem({
  remUnit: 32 	//基准大小 baseSize，需要和rem.js中相同
})

module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          postcss
        ]
      }
    }
  }
}
```

#### # 添加 rem.js 

```javascript
// 基准大小
const baseSize = 32
// 设置 rem 函数
function setRem() {
  // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
  const scale = document.documentElement.clientWidth / 750
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function() {
  setRem()
}
```

#### # 引入 rem.js

- 方法一：直接在 index.html 中写入语句

- 方法二：将 rem.js 放入 public 文件夹 ， 在 main.js 中添加以下语句

  ```javascript
  ;(function(){
    var rem = document.createElement('script');
    rem.src = './rem.js';
    document.body.appendChild(rem)
  })()
  ```

  