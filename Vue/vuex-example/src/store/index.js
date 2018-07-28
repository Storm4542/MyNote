import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const state = {
    isNum: true,
    BookList: [
        {id: 1, name: '莎士比亚',number:4, ishave: true},
        {id: 2, name: '哈姆雷特',number:6, ishave: true},
        {id: 3, name: '西游记',number:9, ishave: false},
        {id: 4, name: '红楼梦',number:12, ishave: true},
        {id: 5, name: '三国',number:22, ishave: false},
        {id: 6, name: '射雕',number:7, ishave: true}
    ]
}
const getters = {
    findBook: (state) => (ishave) => {
        return state.BookList.filter(book => book.ishave === ishave)
    },
    /*
     //上面的写法等价于，就是返回一个函数
       findBook:(state)=>{
        return (ishave)=>{
            return state.BookList.filter(book=>book.ishave===ishave)
        }
    }
    */
    changeNum: (state) => {
        state.isNum = false
    },
    booksCount: (state) => {
        return state.BookList.length
    }

}

const mutations = {
    addBookNum(state,books){
        let thebook = state.BookList.filter(book=>book.name === books.name);
        console.log(thebook);
        thebook[0].number+= books.addNum
    },
    addNewBook(state,newBooks){
        state.BookList.push(...newBooks)
    }
}

const actions = {
    addBookNumAsync({commit},options){
        setTimeout(()=>{
            commit('addBookNum',options)
        },3000)
    },
    addNewBookAsync({commit}){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                let newBook = [{id:66,name:'水浒', number:12,ishave:true}]
                commit('addNewBook',newBook)
                resolve()
            },3000)
        })
    }
}
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})