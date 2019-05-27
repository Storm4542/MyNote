# 使用 Vue Cli 3 打包组件并发布至npm

<a name="XTDAo"></a>
## 1.使用 Vue Cli 3 创建项目

`vue create vue-test`

<a name="RfzFH"></a>
## 2.修改目录并配置webpack
修改后的目录<br />**![image.png](https://cdn.nlark.com/yuque/0/2019/png/148286/1558923194873-d02299bf-4410-4267-926c-2bcec79d11a6.png#align=left&display=inline&height=399&name=image.png&originHeight=798&originWidth=556&size=87992&status=done&width=278)**

- src -> examples  用于放置示例文件
- 增加 packages 文件夹 用于打包
- 增加 lib 文件夹 用户放置打包后的文件
- 增加 vue.config.js 文件 用于配置webpack

**vue.config.js 配置**

```javascript
module.exports = {
    // 修改 src 为 examples
    pages: {
        index: {
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        }
    },
    css: {
        extract: false,
    },
    // 扩展 webpack 配置，使 packages 加入编译
    chainWebpack: config => {
        config.module
            .rule('js')
            .include
            .add('/packages')
            .end()
            .use('babel')
            .loader('babel-loader')
            .tap(options => {
                // 修改它的选项...
                return options;
            });
    }
};
```

<a name="TP1jO"></a>
## 3.packages 配置
**packages/index.js**<br />用于导出组件，
```javascript
// 导入组件
import datePicker from './datepicker';

// 存储组件列表
const components = [
    datePicker
];

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue) {
    // 判断是否安装
    if (install.installed) return;
    // 遍历注册全局组件
    components.map(component => Vue.component(component.name, component));
};

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
    install,
    // 以下是具体的组件列表
    datePicker
};

```

**packages/datepicker/index.js**

```javascript
import datepicker from './src/date-picker';

// 为组件提供 install 安装方法，供按需引入
datepicker.install = function (Vue) {
    Vue.component(datepicker.name, datepicker); //datepiacker.name 下面解释
};

// 默认导出组件
export default datepicker;
```

- datepicker.name  为组件内的 name , 未来使用时，需要使用该 name 作为标签，因此不能随意写。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/148286/1558923611695-fbdca6d1-4f50-4976-b223-37f659f9bacb.png#align=left&display=inline&height=296&name=image.png&originHeight=784&originWidth=946&size=87746&status=done&width=357)

**packages/src**

里面包含组件的所有文件

<a name="B713v"></a>
## 4. package.json
在 scripts 中增加一行命令

```javascript
"lib": "vue-cli-service build --target lib --name vue-simple-datepicker --dest lib packages/index.js",
```

-  --target lib  表明打包至 lib 文件夹
-  --name vue-simple-d aepicker 表明打包后的文件名
-  --dest lib  指定输出的目标文件

然后我们执行 yarn build<br />可以看到 lib 文件夹下出现了三个文件

![image.png](https://cdn.nlark.com/yuque/0/2019/png/148286/1558924162109-795823a3-06d9-4f9e-a02a-5516b11775d3.png#align=left&display=inline&height=116&name=image.png&originHeight=232&originWidth=670&size=30083&status=done&width=335)

demo.html 不用管，下面的两个文件才是我们想要的。<br />一个是 umd 的，一个是 common 的。<br />在前端内我们一般都用 umd 的，因此可以在 package.json 加上这么一条 

```javascript
"main": "lib/vue-simple-datepicker.umd.min.js",
```

表明入口文件是 **lib/vue-simple-datepicker.umd.min.js**<br />**
<a name="c2zJZ"></a>
## 5. 发布至 npm

首先你要完善你的 package.json 

```json
{
  "name": "vue-simple-datepicker-ln",
  "version": "1.0.1",
  "private": false,    //一定要是 false
  "main": "lib/vue-simple-datepicker.umd.min.js",
  "repository": {
    "type": "git",
    "url": "git@github.com:Storm4542/vue-simple-datepicker.git"
  },
  "bugs": {
    "url": "https://github.com/Storm4542/vue-simple-datepicker/issues"
  },
  "homepage": " https://storm4542.github.io/vue-simple-datepicker/",
  "keywords": [
    "datepicker",
    "vue-datepicker"
  ],
  "license": "MIT",
  "scripts": {
    "lib": "vue-cli-service build --target lib --name vue-simple-datepicker --dest lib packages/index.js",
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build"
  },
  "dependencies": {
    "@vue/babel-preset-app": "^3.0.0",
    "vue": "^2.6.6"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^3.5.3",
    "@vue/cli-service": "^3.5.3",
    "less": "^3.0.4",
    "less-loader": "^4.1.0",
    "vue-template-compiler": "^2.5.21"
  }
}

```
登录 npm 。<br />yarn lib 后  npm publish 即可。
