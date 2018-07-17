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


