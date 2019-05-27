### Cordova + Vue 实现点击两次退出应用

#### 注册事件

```javascript
//注意在 deviceready 后使用,写在methods中
//点击返回按键
  onBackKeyDown() {
       this.$toast('再点击一次退出应用');
       document.removeEventListener("backbutton", this.onBackKeyDown, false); // 注销返回键
       document.addEventListener("backbutton", this.exitApp, false);//绑定退出事件
       setInterval(() => {
             document.addEventListener("backbutton", this.onBackKeyDown, false);
             document.removeEventListener("backbutton", this.exitApp, false);
           }, 3000)
        }
//关闭APP
 exitApp() {
         navigator.app.exitApp();
        },
```

#### 启动事件

```javascript
  created() {
        document.addEventListener("backbutton", this.onBackKeyDown, false);
        this.refreshTask();
        this.refreshNotice();
    }
```

#### 销毁事件

```javascript
 beforeDestroy() {
        document.removeEventListener("backbutton", this.onBackKeyDown, false); // 注销返回键
        document.removeEventListener("backbutton", this.exitApp, false);
    }
```

如果页面使用了`<keep-alive>`标签，那么销毁事件的时机为页面离开之前。

```javascript
    beforeRouteLeave(to, from, next) {
        document.removeEventListener("backbutton", this.onBackKeyDown, false); // 注销返回键
        document.removeEventListener("backbutton", this.exitApp, false);
        this.$indicator.close()
        next()
    }
```

