## Array

### 1.Array.prototype.forEach()

```javascript
var array = ['a','b','c'];
array.forEach((e)=>{
  console.log(e)
})
//a
//b
//c
```

一般应用场景，为相同的元素绑定事件处理器

**注意：没有返回一个新数组! & 没有返回值!**

```javascript
function pre(){}
function next(){}
function cleartimer(){}
function resettimer(){} //四个事件需要绑定到几个元素上
var events = [
  {el:'.prebtn',event:'click',fn:pre},
  {el:'.nextbtn',event:'click',fn:next},
  {el:'.timer',event:'mouseenter',fn:cleartimer},
  {el:'.timer',event:'mouseleave',fn:resettimer},
];
events.forEach((eventobject)=>{
  $(eventobject.el).on(eventobject.event,eventobject.fn)
})
```

### 2.Array.prototype.map()

`map()` 方法创建一个**新数组**，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。

```javascript

var newarr = array.map((currentvalue , index , array)=>{
	//dosomething
},[thisArg])

```

`currentvalue`: 数组中当前处理的元素

`index`: 数组中当前处理的元素的索引

`array`: 正在被处理的数组

`thisArg` : 可选的，指定callback的 this 值

[MDN map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

### 3.交换两个值

```javascript
var a = 'a';
var b = 'b';
[a,b] = [b,a]
console.log(a) // 'b'
console.log(b) // 'a'
```

