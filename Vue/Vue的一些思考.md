## Vue的一些思考

### 1.Vue的双向绑定其实是单向绑定

**双向绑定的假设**

> 假设，我有两个儿子，大儿子和二儿子
>
> 我有500元
>
> 大儿子要花500买衣服，把钱花了
>
> 二儿子要花200买书籍，钱没了。
>
> 原因：大儿子花钱的时候没有告诉我。
>
> 所以：我定了规矩，以后花钱必须先跟我说，然后我再把钱给你！

- 因此，Vue的 v-model 变成了两个单项绑定组成的双向绑定，把 v-model 拆分可以变成这样

	参考代码]: http://jsbin.com/gapoquq/4/edit?html,js,output	"1"

- 现在我加一个子组件child ，有一个属性 selected ，通过 button 切换值

	参考代码]: http://jsbin.com/hecaled/1/edit?html,js,output	"2"

- 这样能改，但是会报出警告，告诉你别在子组件里自己改，你要通过父亲修改（上面的假设）

​        所以我改成这样

[参考代码]: http://jsbin.com/bozaxah/2/edit?js,output	"3"

这样子组件的修改需要通过父组件，流程

**Click button => **

**触发@click事件=>**

**$emit触发当前实例上的事件“xxx”,传递$events=>**

**父组件监听 xxx方法，并将 value = $events => **

**data中的value改变 => **

**selected改变为当前value值**

- 上面的实例更加证明了，Vue是单向数据流

  但是双向绑定很爽，于是作者给了我们一个语法糖  .sync语法糖

	参考代码]: http://jsbin.com/haqati/3/edit?js,output	"4"

	原理写在下面注释里了，其实还是 监听了 @updata:selected 方法