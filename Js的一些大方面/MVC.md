## 前端中的MVC

**需求:通过AJAX获取数据，展示一个图书的书名，数量，并且用户可以修改数量，并上传到服务器。**

###1.意大利面条写法

```html
<div id="app"> </div>
```

```javascript
/*因为没有后台，默认bookdata就是从服务器传来的数据，由fethDb获取，saveDb更新 */
var bookData = {
    "id": "1",
    "name": "javascript高程",
    "number": 2 //数量
}
function fetchDb() { //获取数据
    return bookData;
}
function saveDb() { //更新数据
    return bookData;
}

/*我们需要把内容放到HTML里，所以需要有个模板 */

var template = `
        书名<span id="name">《__name__》</span>
        数量<span id="number"> __number__</span>
        <div>
        <button id="add">加一</button>
        <button id="minus">减一</button>
        </div>
        `
/*将我们的数据，放入模板*/
function showBook(result){
    var html = template.replace('__name__', result.name).replace('__number__', result.number);
    $('#app').html(html)
}
showBook(fetchDb()) //渲染模板
/*写加减数量的方法 */     
function add() { 
    bookData.number+=1 
    var newdata =  saveDb(); //假设更新了，并从服务器获取了修改后的新数据
    $('#number').text( newdata.number)
    
}
$('#add').on('click',add)
function minus() { 
    bookData.number-=1
    var newdata =  saveDb();
    $('#number').text( newdata.number)
    
}
$('#minus').on('click',minus)
```

*这种代码写法叫做意大利面条式代码，表示代码长短不一，很杂乱，如果我想要读懂这段代码，必须从开头读起。*

## 2.MVC

**一些程序员想出了解决办法**

一些程序员通过自己的总结，发现这些代码总是可以分成三类：

1. 专门操作远程数据的代码（fetchDb 和 saveDb 等等）
2. 专门呈现页面元素的代码（innerHTML 等等）
3. 其他控制逻辑的代码（点击某按钮之后做啥的代码）

为什么分成这三类呢？因为我们前端抄袭了后端的分类思想，后端代码也经常分为三类：

1. 专门操作 MySQL 数据库的代码
2. 专门渲染 HTML 的代码
3. 其他控制逻辑的代码（用户请求首页之后去读数据库，然后渲染 HTML 作为响应等等）

这些思路经过慢慢的演化，最终被广大程序员完善为 MVC 思想。

1. M 专门负责数据
2. V 专门负责表现
3. C 负责其他逻辑

如果我们来反思一下，会发现这个分类是无懈可击的：

1. 每个网页都有数据
2. 每个网页都有表现（具体为 HTML）
3. 每个网页都有其他逻辑

于是乎，MVC 成了经久不衰的设计模式（设计模式就是「套路」的意思）

**我们改写一下上面的代码**

