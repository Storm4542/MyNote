### 1.var

```javascript
console.log(a) //undefined

var a = 1;
```

输出 a 为 `undefined`

说明var在代码执行前就将 **创建变量，并初始化为 undefined** 

### 2.let

```javascript
console.log(a) //ReferenceError: a is not defined

let a = 1;
```

输出 `ReferenceError: a is not defined`，a  未定义

说明let在代码执行前 **创建变量，并未初始化**

### 3.function

```javascript
console.log(a) // [Function:a]
a()//我是a
function a(){console.log('我是a')}
```

说明 funtuon 在代码执行前  **创建、初始化并赋值**



### 4.const

```javascript
console.log(a) //ReferenceError: a is not defined

const a = 1;
```

const 与 let 相同，但是唯一区别是 const 只有 **创建和初始化并没有赋值**