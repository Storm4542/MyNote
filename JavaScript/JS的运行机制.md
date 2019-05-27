# JS的运行机制

<a name="hE5hW"></a>
## 1.为什么JS是单线程的？

JavsScript 的目的就是与用户交互，以及操作 DOM ， 假如是多线程的，A线程添加了一个DOM节点，B线程删除了该DOM节点，这时浏览器应该以那个为准呢？<br />为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。


<a name="yPVlP"></a>
## 2.任务队列  task queue

因为JS是单线程的，所以所有的任务都要在主线程里排队，一个一个执行。但是因为 I/O 设备很慢，CPU 很快，所以大多数时间 CPU 都是闲着的。因此 JavaScript 的设计者意识到，这时主线程可以不用管 I/O 设备，先挂起，执行后面的任务，等 I/O 设备返回了结果，再处理。

因此任务分为了两种，同步任务和异步任务。

<a name="JWjpb"></a>
### 2.1 同步任务

同步任务是指在主线程排队的任务，他们会按照顺序一个一个的执行。

<a name="S5cRn"></a>
### 2.2 异步任务

异步任务是指不在主线程，而是在任务队列(task queue)的任务，只有任务队列向主线程通知，某个异步任务可以执行了，该任务才会进入主线程执行。<br />异步的执行流程如下：
> ( 1 ) 所有同步任务都在主线程上执行，形成一个执行栈
> ( 2 ) 主线程之外还有一个任务队列。只要异步任务返回了结果，就在任务队列之中放置一个事件
> ( 3 ) 一旦执行栈中的同步任务执行完毕，系统就会读取任务队列，其中的异步任务会结束等待状态，进入执行栈，开始执行
> ( 4 ) 主线程不断重复以上三个过程<br />

以下是主线程和任务队列的示意图<br />![bg2014100801.jpg](https://cdn.nlark.com/yuque/0/2019/jpeg/148286/1557456919693-9ba790ff-b2ad-41ea-82e9-1e21f5227f97.jpeg#align=left&display=inline&height=420&name=bg2014100801.jpg&originHeight=420&originWidth=581&size=39698&status=done&width=581)<br />只要主线程空了，就回去读取任务队列。<br />任务队列是“先进先出”的结构。
<a name="HDq8H"></a>
## 
<a name="1Tuxe"></a>
## 3.事件和回调函数

任务队列是事件的队列，I/O 设备每执行完一个任务，就会向任务队列中添加一个事件，主线程的执行栈为空时，就会去读取任务队列的事件。<br />除了 I/O 设备外，还有一些用户的事件（onClick,onScroll等），这些事件需要指定回调函数，进入任务队列，等待主线程读取。<br />所谓回调函数（callback），就是指被主线程挂起的代码，异步事件必须指定回调函数，主线程在任务队列读取并执行的就是回调函数。

<a name="B1pDY"></a>
## 4.Event Loop

主线程执行栈一空，就去读取任务队列，这是一个不断循环的过程，这种运行机制被称为 Event Loop(事件循环)。<br />示意图：<br />![bg2014100802.png](https://cdn.nlark.com/yuque/0/2019/png/148286/1557457486862-5373606b-967f-4850-b895-87d7e5811bdf.png#align=left&display=inline&height=527&name=bg2014100802.png&originHeight=527&originWidth=601&size=22933&status=done&width=601)<br />主线程运行的时候产生堆（heap）和栈（stack），在栈中执行的同步任务会调用 WebAPI，他们会在任务队列中添加各种回调函数，执行栈清空后，主线程读取任务队列，依次执行队列中的回调函数。<br />
<br />因此执行栈中的同步函数，总是在读取任务队列之前执行。

举个例子

```javascript
let xml = new XMlHttoRequest()
xml.open('GET',url)
xml.onload = function(){}
xml.onerror = function(){}
xml.send()
```

```javascript
let xml = new XMlHttoRequest()
xml.open('GET',url)
xml.send()
xml.onload = function(){}
xml.onerror = function(){}
```

上面两组代码的区别在于 `xml.send()`的位置不同。但是执行起来是没有任何区别的。<br />因为` xml.send()`是异步方法，他会被放在任务队列，而指定回调的部分（onload,onerror）在执行栈中，所以两者的执行顺序是可以预见的。

<a name="GyLNw"></a>
## 5. setTimeout

setTimeout 的第一个参数是回调函数，第二个参数是 最小延迟时间。

setTimeout(func,0)的意思是指，在主线程空闲后，尽可能早的执行 func。因此 func 会在放入任务队列的尾部执行。

根据上面我们可以知道，必须等待主线程空闲后才可以执行 setTimeout(func,dely)，假如主线程有一个任务需要很久才能完成，setTimeout 的执行间隔就不能保证了，因此 dely 是指 最小延迟时间 , 而不是固定延时时间。
