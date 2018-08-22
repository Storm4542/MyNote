### Cordova踩坑日记

#### 1.配置环境

​	配置SDK踩了很多坑，其实只需要下载一个 android studio 就能配置好所有的 SDK.

1. Node.js

	. npm  install -g  cordova	

3. Android Studio

4.  JAVA8

5. Gradle

   ![环境要求](/Users/zhengtianyu/Documents/Mynote/Cordova/环境要求.png)

#### 2.与Vue配合使用

一步一步来，一步都不能错

1. 创建一个Cordova应用  目录 hello 、id: com.example.hello 、别名: HelloWorld

   ```bash
   $ cordova create hello com.example.hello HelloWorld
   ```

2. 进入 hello

   ```bash
   $ cd hello
   ```

3. 添加Android作为目标平台

   ```bash
   $ cordova platform add android
   ```

   

4. 安装Crosswalk的Webview插件

   ```bash
   $ cordova plugin add cordova-plugin-crosswalk-webview
   ```

5. 编译

   ```bash
    $ cordova build android
   ```

6. 在模拟器上启动它

   ```bash
   $ cordova emulate android
   ```

   在第六步遇见了一个大坑，如果它找不到模拟器，运行

   ```bash
   $ cordova emulate android --list 
   ```

   这是后就会出现可以选择的模拟器,我这里出现的是 4e884cfe

   ```bash
   $ cordova emulate android --target 4e884cfe
   ```

   这时候连接上手机，就会自动安装应用了（开发者模式要启动）

   现在我们可以在手机上运行 cordova 应用了。

7. 写好 vue , 并 build 出来，设置 vue.config.js 如下，也可以直接输出到 hello 的 www 目录下。

   ```javascript
   module.exports = {
       baseUrl: '', 
       outputDir: 'www', 
       productionSourceMap: false, 
       runtimeCompiler: true
   };
   ```

8. 把 build 出来的 www 目录覆盖 hello 的 www 目录

9. 在 hello 目录下运行第5步和第6步
