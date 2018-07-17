## HTTP

###1.HTTP为什么重要

1. HTTP 是前后端合作的重要方式
   99%的需求都是通过 HTTP 做到，小部分需求可以通过 WebSockets 做到。
2. HTTP 能帮你从本质上理解 HTML、CSS、JS、图片、JSON、JSONP 等不同形式的资源
3. Web 性能优化基本等价于对 HTTP 传输效率优化
4. 前端工程化需要你对 HTTP 缓存有深入了解

### 2.什么是HTTP

####1.四个概念

1. server
2. client
3. request
4. response

- server

  服务器端

- client

  客户端

#### 2.request 请求

请求包含四个部分

1. 动词  路径  协议/版本号  --- GET ./style.css  HTTP/1.1

2. 一些 key : value ，用回车分割

   Host : xxx.xxx.xxx

   Connection : keep-alive

   Content-Type : application/javascript

   User-Agent : xxxxxxxxxxx

   Accept : xxxxx

3. 回车，作用：分割第二部分和第三部分

4. 什么都行，但是内容的格式必须要在第二部分的 `Content-Type`中声明

#### 3.response 响应

响应也包含四个部分

1. 协议/版本号 状态码 状态信息  HTTP/1.1 200 OK
2. 一些 key : value ，用回车分割
3. 回车，作用：分割第二部分和第三部分
4. 什么都行，但是内容的格式必须要在第二部分的 `Content-Type`中声明

### 3.HTML,CSS,JS,JSON,JSONP都是什么？

#### 1.HTML，CSS，JS的本质

本质是字符串，只是 `Content-Type`不同

- HTML  Content-Type : text/html
- CSS      Content-Type : text/css
- JS          Content-Type : application/javascript

注意 url 里的后缀是废话，毫无意义。

1. 浏览器通过地址栏、iframe 来请求 HTML
2. 浏览器通过 link 标签获取 CSS，然后渲染
3. 浏览器通过 script 标签获取 JS，然后执行
4. 浏览器通过 image 标签获取图片，然后展示

#### 2.JSON

json也是字符串

JSON Content-Type : application/json

#### 3.JSONP

本质就是字符串，只不过

1. Content-Type 为application/javascript 或者 text/javascript
2. 内容格式为 `functionName( {"format": "JSON"} )`



### 4.缓存

1. 使用 Cache-Control 缓存是常用的缓存方式
2. 想要更新缓存只需稍微变更一下 url
   1. app-2131312362387123.js
   2. app.js?v=1
   3. app.js?t=201801012334
   4. 不要缓存入口页面，这是你更新资源的唯一入口

**并不是缓存**

Etag 和 304 会避免下载，但是还是会发出请求，并不属于缓存



### 5.Cookie 和 Session

#### 1.Cookie

因为HTTP协议是 **无状态** 的，通俗来说是 **没脑子**，它没有记忆。

假如用户登录成功后，刷新页面，用户的登录状态就没有了，这里可以用 Cookie 解决。

**保存登录状态**

jack登录a.com发出请求 uername:jack ; password : 123 ---->  

后台接收到数据，账号密码正确，发出响应，响应头`header`写上`'Set-Cookie','login = jack'`----->

浏览器收到响应，种上 Cookie  ---->

当jack再次访问a.com的其他页面时候，请求头中会带上`Cookie : login=jack`------>

jack发现他还是登录状态，非常高兴 : ) ----- end

**区分用户**

frank 这时候也登录 a.com 这时候他获得的 响应头就是`'Set-Cookie','login = frank'`了，这样我们也能区分jack 和 frank 了

但是`Cookie`有一个很不安全的地方，任何一个前端都可以使用`document.cookie = xxx  `来伪造。



**我们需要一个方法既需要能标识用户，又可以防止前端伪造**

#### 2.Session

因为`Cookie`不安全，所以出现了`Session`。

`Session`是存在数据库的，因此前端无法修改。

**流程**

用户输入账户密码登录 ——>  发送请求 ———> 服务器验证账户密码正确———> 

**分配一个`session`，通过`cookie`告诉浏览器**———>`Set-Cookie,sessionId = 'xxxxxxxxxxxxx'`

剩下的就是和`Cookie`一样了。



#### 3.两者不同

1. 使用时间：用Cookie分辨两个不同的用户，用Session存放用户的敏感数据。
2. 实现方式：Cookie使用Set-Cookie实现，Session你想怎么实现就怎么实现。
3. 存放方式：Cookie存放在浏览器里，Session存在服务器端的文件，数据库，内存等等。
4. 两者关系：Session一般基于Cookie，存在里面。但也可以放到 localStorage 里面，放到 URL 里等等