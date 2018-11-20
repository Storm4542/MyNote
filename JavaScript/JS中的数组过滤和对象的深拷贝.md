本文借鉴了该文章 

[链接]: https://juejin.im/post/5bc44a71e51d450e935caa11

原数组

```javascript
let res = [
    {name:'Anne', age: 23, gender:'female'},
    {name:'Lisa', age: 16, gender:'female'},
    {name:'Jay', age: 19, gender:'male'},
    {name:'Jay', age: 22, gender:'male'},
    {name:'Mark', age: 40, gender:'male'}
]
```

#### 1.单个条件单数据筛选

```javascript
function findOneByName(res, name) {
    return res.filter(item => item.name === name) //注意:filter返回的是数组
}
console.log(findOneByName(res,'Anne')) // [ { name: 'Anne', age: 23, gender: 'female' } ]
```

#### 2.单个条件多个数据筛选

有时候可能会遇到重名情况

使用 `forEach`,`Map`或`for`遍历数组，push 进入一个临时数组返回。 

```javascript
function findSomeByName(res, name) {
    let result = []
    res.forEach(e => {
        if (e.name === name) {
            result.push(e)
        }
    });
    return result
}
console.log(findSomeByName(res, 'Jay')) 
//[ { name: 'Jay', age: 19, gender: 'male' },
//  { name: 'Jay', age: 22, gender: 'male' } ]
```

#### 3.多个条件单个数据筛选

数据中有两个 ' Jay '，我只想要那个 22 岁的。

```javascript
function findOneByNameAge(res, name, age) {
    return res.filter(item => item.name === name && item.age === age)
}
console.log(findOneByNameAge(res, 'Jay', 22));
//[ { name: 'Jay', age: 22, gender: 'male' } ]
```

#### 4.多个条件多个筛选

我想找到所有叫 Jay 和  Anne 的人

```javascript
function multiFilter(array, filters) {
    const filterKeys = Object.keys(filters)
    // filters all elements passing the criteria
    return array.filter((item) => {
        // dynamically validate all filter criteria
        return filterKeys.every(key => {
            //ignore when the filter is empty Anne
            if (!filters[key].length) return true
            return !!~filters[key].indexOf(item[key])
        })
    })
}

let filter = {
    name: ['Jay', 'Anne'],
    age: []
}
console.log(multiFilter(res, filter));
```

#### 5. 判断是否有这个人，或者是否全部都为该人

```javascript
// res 里有没有 Anne ?
console.log(res.some(item => item.name === 'Anne'));//true
// res 里是不是全都是 Anne ?
console.log(res.every(item => item.name === 'Anne'));//false
```

#### 6.知识点1 : Object.keys() 获取数据索引或者对象属性

```javascript
let arr = [1, 2, 3]
console.log(Object.keys(arr)); // [ '0', '1', '2' ]

let obj = {
    a: '1',
    b: '2',
    c: '3'
}
console.log(Object.keys(obj));//[ 'a', 'b', 'c' ]
```

#### 7. 对象的深拷贝

```javascript
let newRes = Json.parse(Json.stringify(res)); 
//数据量不大的时候使用，而且必须遵循JSON格式,假如有 function 就无法拷贝

//递归深拷贝 o1:得到的新对象 , o2:原对象
let newRes = {} ; //想得到数组
let newRes = [] ; //想得到对象
function deepClone(o1, o2) {
    for (let k in o2) {
        if (typeof o2[k] === 'object') {
            o1[k] = {};
            deepClone(o1[k], o2[k]);
        } else {
            o1[k] = o2[k];
        }
    }
}
deepClone(newRes,res)
```

