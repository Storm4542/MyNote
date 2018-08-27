最近接触了小程序业务，了解到美团的 mpvue 也可以做小程序。

[Mpvue]: http://mpvue.com/mpvue/

使用方式也很简单，和 vue 一样， 但是他会自动将 Vue 编译为 小程序 语言。

下面言归正传，介绍一下如何在 mpvue 中使用第三方组件。

1. 创建 mpvue 

   ```cmd
   vue init mpvue/mpvue-quickstart my-app
   ```

   

2. 以 ivew weapp UI 举例 ，进入其 github 地址，下载后将 dist 目录下的所有东西，拷贝到 my-app 下 static 的 ivew (自己创建) 目录。

   

3. 在需要使用的页面中创建 main.json。

   ```json
    {
      "usingComponents": {
        "i-card": "../../../static/iview/card/index",
        "i-button": "../../../static/iview/button/index"
      }
    }
   ```

   

4. 接下来就可以在 index.vue 中使用该标签了。

   ```html
   <template>
   <div>
      <i-card full title="卡片标题" extra="额外内容" thumb="https://i.loli.net/2017/08/21/599a521472424.jpg">
         <view slot="content">内容不错</view>
         <view slot="footer">尾部内容</view>
       </i-card>
       <i-button type="success">按钮</i-button>
   </div>
   </template>
   ```

   