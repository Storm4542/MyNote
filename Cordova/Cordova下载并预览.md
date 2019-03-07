---
title: Cordova下载并预览功能
tags: Cordova
abbrlink: 990bab20
date: 2019-02-01 11:00:43
---

## 1.前言

近期混合应用开发需要下载和预览的功能，选择方案为先下载到本地，再使用`cordova-plugin-file-opener2 `插件进行预览。

采用此预览方案文件会被先下载到本地，`cordova-plugin-file-opener2`插件其实可以直接打开网络地址来实现预览，采用此方式是基于以下考虑：

1. 避免重复下载

2. 避免有文件格式解析错误的情况，用户可以到本地再次进行查看

3. 下载目录可控


## 2.框架

项目采用 `Cordova + Vue + MintUI `



## 3.操作

- 下载
- - `fileInfo`提供下载地址、文件名称、文件格式（或扩展名）

```javascript
function downLoad(fileInfo) {
    Vue.$toast('正在下载，请稍等');
    new FileTransfer().download(
        encodeURI(FILES_HOST + "/" + fileInfo.fileid), //uri网络下载路径
        cordova.file.dataDirectory + fileInfo.fileid, //文件本地存储路径
        function (fileEntry) {
            preView(fileEntry, fileInfo);
        },
        function (error) {
            Vue.$toast('下载失败');
            console.log(error);
        },
        false,
        {
            headers: {'Authorization': `Bearer ${localStorage.getItem('CFA0')}`},
        }
    );
}
```



- 下载完成，预览文件


- - 使用 ` cordova-plugin-file-opener2` 打开文件

  - `mineType`使用 `mime-types`获取，提供扩展名即可获取（若后端提供格式则不需要）。

    [地址]: https://github.com/jshttp/mime-types	"Mime-types"

```javascript
function preView(fileEntry, fileInfo) {
    Vue.$toast('开始预览');
    let url;
    let platform = device.platform.toLowerCase();
    if (platform === 'android') {
        url = fileEntry.toInternalURL() //安卓预览路径
    } else {
        url = fileEntry.toURL() //ios 预览路径
    }
    console.log('路径', url);
    cordova.plugins.fileOpener2.showOpenWithDialog(
        url,
        mime.lookup(fileInfo.fileType),
        {
            error: function (e) {
                Vue.$toast('预览失败');
            },
            success: function () {
                Vue.$toast('预览成功');
            }
        },
    );
}
```

## 4. 可能遇到的坑

在预览文件的时候 `cordova-plugin-file-opener2`有可能会报以下错误：

> Attempt to invoke virtual method 'android.content.res.XmlResourceParser android.content.pm.ProviderInfo.loadXmlMetaData(android.content.pm.PackageManager, java.lang.String)' on a null object reference

寻找很久，应该是因为权限问题导致，解决办法如下:

在 `AndroidManifest.xml`中`application`标签内增加

```xml
<provider 
          android:name="io.github.pwlin.cordova.plugins.fileopener2.FileProvider" 				  android:authorities="${applicationId}.opener.provider" 
          android:exported="false" android:grantUriPermissions="true">
<meta-data 
           android:name="android.support.FILE_PROVIDER_PATHS"
           android:resource="@xml/opener_paths" />
</provider>
```


