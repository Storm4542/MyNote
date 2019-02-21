## 1.前言

近期混合应用开发需要下载和预览的功能，选择方案为先下载到本地，再使用`cordova-plugin-file-opener2 `插件进行预览。

采用此预览方案文件会被先下载到本地，`cordova-plugin-file-opener2`插件其实可以直接打开网络地址来实现预览，采用此方式是基于以下考虑：

1. 避免重复下载（因app中还有下载功能）

2. 避免有文件格式解析错误的情况，用户可以到本地再次进行查看

3. 下载目录可控


## 2.框架

项目采用 `Cordova + Vue + MintUI `



## 3.操作

- 根据不同系统，选择不同的方法创建目录。

  - Android : 

    - `  window.resolveLocalFileSystemURL` 可访问沙盒存储之外的文件系统位置

    - `cordova.file.externalRootDirectory` 外部储存(sd卡)

  - IOS : 

    - ` window.requestFileSystem` 仅为沙盒文件系统授予访问权限（沙箱限制对应用程序本身的访问），而不是对设备上任何文件系统位置的一般访问权限。
    - 

```javascript
  getEntry() {
    let _this = this
    let platform = device.platform.toLowerCase() // cordova-plugin-device 获取系统
    if (platform === "android") {
        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, _this.onFileSystemSuccess, _this.onError);
    } else {
        // for iOS
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, _this.onFileSystemSuccess, _this.onError);
    }
},
```

- `onFileSystemSuccess`成功回调接收`fileSystem对象`
  - `fileSystem.root`返回一个`DirectoryEntry`对象，你可以用它来创建或获取文件（通过调用`getFile`）
  - `entry.getDirectory()`创建目录

```javascript
onFileSystemSuccess(fileSystem) {
    let _this = this
    let entry = "";
    let platform = device.platform.toLowerCase()
    if (platform === "android") {
        entry = fileSystem;
    } else {
        entry = fileSystem.root;
    }
    entry.getDirectory("Cordova", {
        create: true,
        exclusive: false
    }, _this.onGetDirectorySuccess, _this.onGetDirectoryFail);
},
```

- 成功创建目录`onGetDirectorySuccess`接收 `DirectoryEntry`对象
  - `dir.getFile`创建文件

```javascript
onGetDirectorySuccess(dir) {
    let _this = this
    this.cdr = dir;
    dir.getFile(_this.fileName, {
        create: true,
        exclusive: false
    }, _this.downloadFile, _this.errorHandler);
},
```

- 成功创建文件，通过下载写入文件
  - 使用 `cordova-plugin-file-transfer`下载并写入文件

```javascript
downloadFile(fileEntry) {
    this.$toast('正在下载...');
    let fileTransfer = new FileTransfer();
    let _this = this
    fileTransfer.download(
        encodeURI(_this.savePath), //uri网络下载路径
        fileEntry.toURL(), //文件本地存储路径
        function (entry) {
            _this.$toast('下载成功');
            // 下载完成执行本地预览  
            _this.preView(fileEntry);  
        },
        function (error) {
            _this.$toast('下载失败');
        },
        false, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('CFA0')}`
            },
        }
    );
}
```

- 下载完成，预览文件

  - 使用 ` cordova-plugin-file-opener2` 打开文件

  - `mineType`使用 `mime-types`获取，提供扩展名即可获取。

    [地址]: https://github.com/jshttp/mime-types	"Mime-types"

```javascript
preView(fileEntry) {
    let _this = this;
    cordova.plugins.fileOpener2.showOpenWithDialog(
        // 此处必须填写cdvfile://地址，不然android7.0+会报文件权限错误
        fileEntry.toInternalURL(), //文件本地地址转cdvfile://地址
        _this.mineType, //文件类型
        {
            error: function (e) {
                console.log(e, 'Error status: ' + e.status + ' - Error message: ' + e.message);
            },
            success: function () {
                _this.$toast('开始预览');
            }
        },
    );
},
```

## 4. 可能遇到的坑

在预览文件的时候 `cordova-plugin-file-opener2`有可能会报以下错误：

> Attempt to invoke virtual method 'android.content.res.XmlResourceParser android.content.pm.ProviderInfo.loadXmlMetaData(android.content.pm.PackageManager, java.lang.String)' on a null object reference

寻找很久，应该是因为权限问题导致，解决办法如下:

在 `AndroidManifest.xml`中`application`标签内增加

```
<provider android:authorities="${applicationId}.provider" android:exported="false" android:grantUriPermissions="true" android:name="org.apache.cordova.camera.FileProvider">
<meta-data android:name="android.support.FILE_PROVIDER_PATHS" android:resource="@xml/camera_provider_paths" />
</provider>
```

