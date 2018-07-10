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


