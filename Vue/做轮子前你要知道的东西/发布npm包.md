## 发布npm包

### 1. 确保测试通过

`npm run test` 都是原谅色.(要想生活过得去,就得头上带点绿)

### 2.上传代码的步骤

1. 更新`package.json`

   - 每次上传的版本号都要不同

   - 根目录创建 index.js 把我们想要导出的东西导出

     ```JavaScript
     import Button from './src/button'
     import ButtonGroup from './src/button-group'
     import Icon from './src/icon'

     export {Button,ButtonGroup,Icon}
     ```

     这里就有问题了,NodeJs不认识 `import`,这么发上去没法用,所以我们先转义一下

     `parcel build index.js --no-minify`

2. 注册 https://www.npmjs.com/ 的账号

3. 注册好了确认邮箱,必须做

4. 在项目根目录运行 `npm adduser`,输入用户名密码邮箱.

5. `npm publish`

6. 完事儿

