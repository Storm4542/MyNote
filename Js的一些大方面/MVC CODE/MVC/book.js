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

