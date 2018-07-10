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

```javascript
/*创建一个model层 负责存储数据、请求数据、更新数据*/
/*因为没有后台，默认bookdata就是从服务器传来的数据，由fethDb获取，saveDb更新 */
let model = {
    bookData: {
        "id": "1",
        "name": "javascript高程",
        "number": 2 //数量
    },
    fetchDb() {
        return this.bookData;
    },
    saveDb() {
        return this.bookData;
    }
}
/*view层，渲染视图*/
let view = {
    el: '#app',
    template : `
    书名<span id="name">《__name__》</span>
    数量<span id="number"> __number__</span>
    <div>
    <button id="add">加一</button>
    <button id="minus">减一</button>
    </div>
    `,
    render(result) { //此处将showbook改名为render
        var html = this.template.replace('__name__', result.name).replace('__number__', result.number);
        $('#app').html(html)
    }
}

/*控制器，负责调度 model 和 view */
let controller = {
    init({model,view}){
        this.model = model
        this.view = view
        this.view.render(model.fetchDb()) //渲染模板
        this.bindEvents()
    },
    events:[
        {type:'click',selector:'#add',fn:'add'},
        {type:'click',selector:'#minus',fn:'minus'},
    ],
    bindEvents(){
        this.events.map((e)=>{
            $(this.view.el).on(e.type,e.selector,this[e.fn].bind(this)) //事件绑定 注意this需要使用外面的this
        })
    },
    add() {
        model.bookData.number += 1
        var newdata = model.saveDb(); //假设更新了，并从服务器获取了修改后的新数据
        $('#number').text(newdata.number)

    },
    minus() {
        model.bookData.number -= 1
        var newdata = model.saveDb();
        $('#number').text(newdata.number)

    }
}

controller.init({model,view})

```

## 3.模板代码(也就是类)

一个页面或模块只需要 model view controller 三个对象
第二个页面就需要再来 model2 view2 controller2 三个对象
第三个页面就需要再来 model3 view3 controller3 三个对象
……
第N个页面就需要再来 modelN viewN controllerN 三个对象

你每次写一个 model 都要写很类似的代码
你每次写一个 view 都要写很类似的代码
你每次写一个 controller 都要写很类似的代码

为什么不利用模板代码（俗称面向对象）把重复的代码写到一个类呢（JS里面就是把「共有属性」放到原型里）

代码如下

```javascript
/*创建一个model calss 负责存储数据、请求数据、更新数据*/
/*因为没有后台，默认bookdata就是从服务器传来的数据，由fethDb获取，saveDb更新 */
class Model{
    constructor(options){
        this.data = options.data || {}
    }
    fetchDb(){
        return this.data
    }
    saveDb(){
        return this.data
    }
}
var model = new Model({
    data: {
        "id": "1",
        "name": "javascript高程",
        "number": 2 //数量
    }
})

/*view class，渲染视图*/
class View{
    constructor(options){
        this.el = options.el
        this.template = options.template
    }
    render(result){
        var html = this.template.replace('__name__', result.name).replace('__number__', result.number);
        $(this.el).html(html)
    }
}
var view = new View({
    el:'#app',
    template:`
    书名<span id="name">《__name__》</span>
    数量<span id="number"> __number__</span>
    <div>
    <input type="text">
    <button id="add">加一</button>
    <button id="minus">减一</button>
    </div>
    `,
})

/*控制器 class，负责调度 model 和 view */
class Controller{
    constructor({view ,model , events , init , ...rest}){
        this.view = view
        this.model = model
        this.events = events
        Object.assign(this,rest)
        this.bindEvents()
        //this.view.render(this.model.fetchDb())
        init.apply()
    }
    bindEvents(){
        this.events.map((e)=>{
            $(this.view.el).on(e.type,e.selector,this[e.fn].bind(this)) //事件绑定 注意this需要使用外面的this
        })
    }
}

var controller = new Controller({
    view : view,
    model : model,
    events:[
        {type:'click',selector:'#add',fn:'add'},
        {type:'click',selector:'#minus',fn:'minus'},
    ],
    init(){
        this.view.render(this.model.fetchDb());
    },
    add() {
        this.model.data.number += 1
        var newdata = this.model.saveDb(); //假设更新了，并从服务器获取了修改后的新数据
        this.view.render(this.model.saveDb());

    },
    minus() {
        this.model.data.number -= 1
        if(this.model.data.number <0){
            this.model.data.number = 0
        }
        var newdata = this.model.saveDb();
        this.view.render(this.model.saveDb());

    }

})
```

**这么写，有一个bug ，每次更新数据，我们都要用 innerHtml 替换 #app里的东西，里面如果有 input 标签，用户的数据就无法保存**

## 4.Vue的双向绑定

```javascript
/*创建一个model calss 负责存储数据、请求数据、更新数据*/
/*因为没有后台，默认bookdata就是从服务器传来的数据，由fethDb获取，saveDb更新 */
class Model {
    constructor(options) {
        this.data = options.data || {}
    }
    fetchDb() {
        return this.data
    }
    saveDb() {
        return this.data
    }
}
var model = new Model({
    data: {
        "id": "1",
        "name": "javascript高程",
        "number": 2 //数量
    }
})

/*把 View 换成 VUE*/
var view = new Vue({
    el: '#app',
    data: {
        book: {
            id:null,
            name: '未命名',
            number: 0,
        },
        n: 100

    },
    template: `
    <div>
    书名<span id="name" >{{ book.name }}</span>
    数量<span id="number" > {{book.number}}</span>
    <div>
    <input type="text" v-model = 'n'>
    <button id="add" v-on:click = 'add'>加一</button>
    <button id="minus" v-on:click = 'minus'>减一</button>
    </div>
    </div>
    `,
    created() {
        
        view.book= model.fetchDb()
       
    },
    methods: {
        add() {
            model.data.number += 1
            console.log(model.saveDb().number)
            this.book.number = model.saveDb().number; //假设更新了，并从服务器获取了修改后的新数据

        },
        minus() {
            model.data.number -= 1
            if (model.data.number < 0) {
                model.data.number = 0
            }
            this.book.number = model.saveDb().number;

        }
    }
})
```

Vue 代替了 View，这就是 Vue 的名字和其读音的来历。

Vue 的双向绑定（也是 Angular 的双向绑定）有这些功能：

1. 只要 JS 改变了 view.number 或 view.name 或 view.n （注意 Vue 把 data 里面的 number、name 和 n 放到了 view 上面，没有 view.data 这个东西）， HTML 就会局部更新
2. 只要用户在 input 里输入了值，JS 里的 view.n 就会更新。

这就像双向绑定：JS 数据与页面元素互相绑定。

### Vue的双向绑定原理

使用了getter setter，缺点是无法监听不存在的属性

原理：

```javascript
var data = {name:'aaa'}
var _name = 'zty'
Object.defineProperty(data,'name',{
  get(){return _name}
  set(value){ _name = value ; console.log('更新了name')} //在这里做一个拦截，我们就可以知道用户修改了某个值，比如说input
})
console.log(data.name)
```

但是假如之前没有在 `data`里声明，，vue就无法监听了

强制监听

`vm.$set()`

向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新属性，因为 Vue 无法探测普通的新增属性 (比如 `this.myObject.newProperty = 'hi'`)

[vm-set](https://cn.vuejs.org/v2/api/#vm-set)

### 模拟上面的set 和 get

```javascript
class X{
    constructor({data}){
        for(let key in data){
            Object.defineProperty(this, key, {
                get (){
                    return data[key]
                },
                set (value){
                    console.log('有人修改了' + key)
                    data[key] = value
                }
            })
        }
    }
}

var view = new X({
    data: {
        name: 'frank'
    }
})

console.log(view.name === 'frank') // 输出 true
view.name = 'jack' // 输出「有人修改了 name」
```

