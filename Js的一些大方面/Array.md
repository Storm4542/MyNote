## Array

#### 1.join

```javascript
var array = [1,2,3]
array.join('-') // 1-2-3
```

猜测一下源码

```javascript
Array.prototype.join = function(char){
  let result = this[0] || '';
  let length = this.length;
  for( let i = 1 ; i < length ; i++ ){
    result += char + this[i]
  }
  return result
}
```

#### 2.slice

```javascript
array.slice(benginIndex,endIndex)
```

猜测一下源码

```javascript
Array.prototype.slice = function( begin , end ){
  begin = begin || 0 ;
  end = end || this.length;
  let result = [];
  for(let i = begin ; i < end ; i++){
    result.push(this[i])
  }
  return result
} 
```

于是可以使用`slice`将伪数组转化为数组

```javascript
var arraylike = 'abcde';
Array.prototype.slice.call(arraylike) //['a','b','c','d','e']
//或者
[].slice.call(....)
```

ES6新方法 伪数组转化为数组

`Array.from(arraylike)`

P.S. 伪数组原型链里面没有 `Array.prototype`，所以他就没有 `join slice`等方法

#### 3.sort

```javascript
var array = [1,3,2]
array.sort() //[1,2,3]
```

猜测一下源码

```javascript
Array.prototype.sort = function (fn){
    let defaultfn = (a,b)=>{ return a-b }
    fn = fn|| defaultfn
    var roundcount = this.length; //比较的轮数
    for(let i = 0 ; i < roundcount ; i++){
          let minIndex = this[i]
          for( let k = 0 ; k < this.length ; k++){
            if(fn.call( null , this[i] , this[k]) < 0 ){  // 决定了谁大谁小
              [ this[i] , this[k] ] = [ this[k] , this[i] ] //es6新语法，交换值
            }
          }
    }
  	return this
  }
```

#### 4.foreach

猜测一下源码

```javascript
Array.prototype.foreach = function(fn){
  for(let i = 0 ; i < this.length ; i++){
    if(i in this){
      fn.call(undefined , this[i] , i , this) // 三个参数代表了 item index array
    }
  }
}
```

> for 和 foreach 的区别
>
> 1. foreach 没有 break 
>
>
> 2. forEach 用到了函数，所以每次迭代都会有一个新的函数作用域；for 循环只有一个作用域 (著名前端面试题)

#### 5.map

猜测一下源码

```javascript
Array.prototype.map = function(fn){
  let result = []
  for(let i = 0 ; i < this.length ; i++){
    if(i in this){
      result[i] = fn.call(undefined , this[i] , i , this) // 三个参数代表了 item index array
    }
  }
  return result
}
```

map 和 foreach 的区别就是 map 有返回值，所以推荐**忘记** **foreach**

#### 6.filter

猜测一下源码

```javascript
Array.prototype.filter = function(fn){
  let result = [];
  let temp;
  for(let i = 0 ; i < this.length ; i++){
    if(temp = fn.call(null , this[i] , i , this)){  //如果temp的到的返回值为 true
      	result.push(this[i])
    }
  }
  return result
}
```

**所以说 filter 就是一个加了条件的 map** 

#### 7.reduce

猜测一下源码

```javascript
Array.prototype.reduce = function(fn , init){  // 函数 初始值(可以不传)
  let result = init;
  for(let i = 0 ; i < this.length ; i++ ){
    if(i in this){
      result = fn.call(undefined , result , this[i] , i , this) 
      // 后四个参数  当前累计值，当前值，序列，该数组
    }
  }
  return this
}

var a  = [1,2,3,4]
a.reduce( (result,currentValue,currentIndex,array)=>{ return result + currentValue } , 0 ) 
//累加 10
```

