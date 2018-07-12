Vue.component('tabs', {
    props: ['selectedTab'],
    template: `
        <div class='tabs'>
            <slot/>
        </div>
    `,
    mounted() {
        this.$children.forEach((vm) => { //遍历所有的孩子
            if (vm.$options.name === 'tabs-navs') {
                console.log('爷爷的selectedTab是' + this.selectedTab)
                vm.SelectedTab(this.selectedTab) //通过儿子的selectedTab方法，传给儿子
                vm.$on('update:selectedTab',(e)=>{ //爷爷监听爸爸的update，更新属性，更新操作在updatde里面做
                    console.log('爷爷知道了爸爸给我的selectedTab是' + e)                    
                    this.$emit('update:selectedTab',e)
                })
            } else if (vm.$options.name === 'tabs-panels') {
                vm.SelectedTab(this.selectedTab)
            }
        })
    },
    updated() {  //更新selectedTab
        this.$children.forEach((vm) => {
            if (vm.$options.name === 'tabs-navs') {    
                vm.SelectedTab(this.selectedTab)
            } else if (vm.$options.name === 'tabs-panels') {
                vm.SelectedTab(this.selectedTab)
            }
        })
    }
})
Vue.component('tabs-navs', {
    data() {
        return {
            selectedTab: undefined //爸爸自己有一个selectedTab属性       
        }
    },
    template: `
    <div class='tabs-navs'>
        <slot/>
    </div>
    `,
    methods: {
        SelectedTab(tab) {
            this.selectedTab = tab //通过这个方法，从爷爷那里获取selectedTab
            console.log('爸爸获取到了爷爷的selectedTab是' + this.selectedTab)
            this.$children.forEach((vm) => { //同样的方法传给孙子
                if (vm.$options.name === 'tabs-navs-item') {
                    vm.SelectedTab(this.selectedTab)
                }
            })
        }
    },
    mounted() {
        this.$children.forEach((vm) => {
            if (vm.$options.name === 'tabs-navs-item') {
                vm.$on('update:selectedTab', (e) => {
                    console.log('爸爸知道了你要更新selectedTab是' + e)
                    this.$emit('update:selectedTab', e) //爸爸传给爷爷需要改的数
                })
            }
        })
    }
})
Vue.component('tabs-navs-item', {
    props: ['name'],
    data() {
        return {
            selectedTab: undefined
        }
    },
    template: `
    <div class='tabs-navs-item' :class = '{active}' @click = 'onClick'>
        <slot/>
    </div>
    `,
    computed: {
        active() {
            return this.selectedTab === this.name
        }
    },
    methods: {
        SelectedTab(tab) {
            this.selectedTab = tab
            console.log('儿子获取到了从爸爸的selected是' + this.selectedTab)
        },
        onClick() {
            this.$emit('update:selectedTab', this.name)
        }
    }
})
Vue.component('tabs-panels', {
    data() {
        return {
            selectedTab: undefined
        }
    },
    template: `
    <div class='tabs-panels'>
        <slot/>
    </div>
    `,
    methods: {
        SelectedTab(tab) {
            this.selectedTab = tab;
            this.$children.forEach((vm) => { //同样的方法传给孙子
                if (vm.$options.name === 'tabs-panels-item') {
                    vm.SelectedTab(this.selectedTab)
                }
            })
        }
    }
})
Vue.component('tabs-panels-item', {
    props: ['name'],
    data() {
        return {
            selectedTab: undefined
        }
    },
    template: `
    <div class='tabs-panels-item' :class = '{active}'>
        <slot/>
    </div>
    `,
    computed: {
        active() {
            return this.selectedTab === this.name
        }
    },
    methods: {
        SelectedTab(tab) {
            this.selectedTab = tab
        }
    }
})

///////上面的是轮子 //////////


var vm = new Vue({
    el: '#app',
    data() {
        return {
            value: 'tab1'
        }
    },
    template: `
    <tabs :selectedTab.sync = 'value' >
        <tabs-navs>
            <tabs-navs-item name = 'tab1' >1</tabs-navs-item>
            <tabs-navs-item name = 'tab2' >2</tabs-navs-item>
        </tabs-navs>
        <tabs-panels>
            <tabs-panels-item name = 'tab1'>content 1</tabs-panels-item>
            <tabs-panels-item name = 'tab2'>content 2</tabs-panels-item>
        </tabs-panels>
    </tabs>
    `
})