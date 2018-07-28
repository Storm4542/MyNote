<template>
    <div>
        <button @click="addNewBook()">更新书籍</button>
        <h3>所有的书</h3>
        <p v-for="item of BookList" :key="indexComputed()">
            {{item.name}}, 还有 {{item.number}}本
            <button @click="addBook({name:item.name,addNum:1})">增加1本书</button>
        </p>
        <h3>现在可以借走的书</h3>
        <p v-for="item of findBook" :key="indexComputed()">
            {{item.name}} , 还有 {{item.number}}本
            <button @click="addBookAsync({name:item.name,addNum:1})">异步增加1本书</button>
        </p>
    </div>
</template>

<script>
    import store from "../store/index";
    import {mapState,mapGetters,mapActions,mapMutations} from 'vuex'
    export default {
        name:'book',
        computed:{
            ...mapState(['BookList']),
            findBook(){
                return this.$store.getters.findBook(true)
            },
            ...mapGetters(['booksCount']),

        },
        methods:{
            indexComputed(){
                return Math.random()*10
            },
            addBook(options){
                this.$store.commit('addBookNum', options)  //{name:'莎士比亚',addNum:200}
            },
            addBookAsync(options){
                console.log(options);
                this.$store.dispatch('addBookNumAsync',options)
            },
            addNewBook(){
                this.$store.dispatch('addNewBookAsync').then(()=>{
                    alert('更新成功')
                })
            }
        }
    }
</script>

<style scoped>

</style>