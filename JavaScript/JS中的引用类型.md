#### 1.JS中的类型

- 基本类型

  String

  Boolean

  Number

  undefined

  Null

  Symbol

- 引用类型

  Object

对于基本类型，`= `代表的是值得拷贝，`===`代表的是值得比较。

对于引用类型，`=`代表的是引用地址的拷贝，`===`代表的是引用地址的比较。

#### 2.几个例子深入理解

- 案例一

```javascript
let a = 1;
let b = a;
a === b // true
b = 2;
a === 1 ; //true
```

基本类型Number，赋值为拷贝，当 `b`改变的时候不会影响到`a`

- 案例二

```javascript
let a = {};
let b = {};
let c = a ;
a === b //false
a === c //true
```

引用类型Object，比较的是引用地址，`a`和`b`的引用地址明显是不同的，所以他们不相等。

`c`得到了`a`的引用的地址，因此`a===c`

- 案例三

```javascript
let a = {name:'张三',info:{age:11,sex:'男'}};
let b = a;
b.info.age = 22;
a === b //true
a.info.age === 22 //true
```

因为`a`和`b`指向同一个地址，所以`b`做修改的时候，`a`同样修改了。

- 案例四

```javascript
let a = {name:'张三',info:{age:11,sex:'男'}};
let b = a ; //展开运算符浅拷贝
a === b //false
a.name === b.name //true
a.info === b.info //true
```

因为展开运算符是浅拷贝，所以两个对象指向不同的地址，即`a!==b`。

但是浅拷贝毕竟是浅拷贝。

`name`是基本类型，拷贝的值，所以相同。

`info`为引用类型，拷贝的地址，也相同。

- 案例五

```javascript
let a = {name:'张三',info:{age:11,sex:'男'}};
let b = JSON.parse(JSON.stringify) ; //深拷贝
a === b //false
a.name === b.name //true
a.info === b.info //false
a.info.age === b.info.age//true
```

深拷贝了，其他的不用说。

因为深拷贝过了，`info`指向的就是各自的地址了，没啥关系了。

但是基本类型该相同相同。