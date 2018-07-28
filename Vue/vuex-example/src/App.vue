<template>
    <div id="app">
        <book></book>
    </div>
</template>

<script>
    import HelloWorld from './components/HelloWorld.vue'
    import book from './components/book'

    export default {
        name: 'app',
        components: {
            HelloWorld,
            book
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
