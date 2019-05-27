# Map &amp;&amp; Set

<a name="vwKgD"></a>
## Map
<a name="UUV6K"></a>
### Methods
Map 是一个键值对的集合，与 Object 很像 ，**但是 Map 允许任何数据类型作为键**。<br />主要的方法包括：

- `new Map()` – 创建 map。
- `map.set(key, value)` – 根据键（key）存储值（value）。
- `map.get(key)` – 根据键返回值，如果 map 中该键不存在，返回 `undefined`。
- `map.has(key)` – 如果键存在，返回 `true`，否则返回 `false`。
- `map.delete(key)` – 移除该键的值。
- `map.clear()` – 清空 map
- `map.size` – 返回当前元素个数。

```javascript
let map = new Map();
map.set(1,'num');
map.set('1','str');
map.set(true,'bool');
// Object 会将所有的键转化为字符串
map.get(1); // 'num'
map.get('1'); // 'str'
```

Map 还可以使用对象来作为键

```javascript
let map = new Map();
let obj = {a:1};
map.set(obj,1);
map.get(obj); // 1
```

<a name="uknod"></a>
### 将 Object 转化为 Map
在创建 Map 时可以给构造函数传递一个`[key,value]`键值对数组。
```javascript
let map = new Map([['1','str'],[1,'num']]);
```

有一个内建方法 `Object.entries` 可以返回对象的键值对数组。

```javascript
let map = new Map(Object.entries({
	name:'Jhon',
  age:12
}));
```

这里  `Object.entries` 返回了` [['name','Jhon'], ['age',12]]`

<a name="9KduC"></a>
### 遍历 Map
有三种方法可以循环遍历 `map`：

- `map.keys()` – 返回键的迭代器，
- `map.values()` – 返回值的迭代器，
- `map.entries()` – 返回 `[key, value]` 迭代器入口，`for..of` 循环会默认使用它。

例如：[](https://zh.javascript.info/map-set-weakmap-weakset#)<br />[](https://zh.javascript.info/map-set-weakmap-weakset#)
```javascript
let recipeMap = new Map([
  ['cucumber', 500],
  ['tomatoes', 350],
  ['onion',    50]
]);
// 迭代键（vegetables）
for (let vegetable of recipeMap.keys()) {
  alert(vegetable); // cucumber, tomatoes, onion
}
// 迭代值（amounts）
for (let amount of recipeMap.values()) {
  alert(amount); // 500, 350, 50
}
// 迭代键值对 [key, value]
for (let entry of recipeMap) { // 和 recipeMap.entries() 一样
  alert(entry); // cucumber,500（等等）
}
```
**The insertion order is used**<br />和普通 `Object` 不同，迭代器的迭代顺序和值被插入的顺序一致，`Map` 会保留这个顺序。<br />另外，`Map` 有一个内建的 `forEach` 方法，和 `Array` 很像：
```javascript
recipeMap.forEach( (value, key, map) => {
  alert(`${key}: ${value}`); // cucumber: 500 等等
});
```

<a name="ppZ1Q"></a>
## Set
Set 是一个值的集合，**集合中所有值只出现一次**。<br />主要方法包括：

- `new Set(iterable)` – 创建 set，利用数组来创建是可选的（任何可迭代对象都可以）。
- `set.add(value)` – 添加值，返回 set 自身。
- `set.delete(value)` – 删除值，如果该 `value` 在调用方法的时候存在则返回 `true` ，否则返回 `false`。
- `set.has(value)` – 如果 set 中存在该值则返回 `true` ，否则返回 `false`。
- `set.clear()` – 清空 set。
- `set.size` – 元素个数。

例如，我们有访客登门，我们希望记住所有人。但是重复来访者并不应该有两份记录。一个访客必须只记录一次。<br />`Set` 就恰好是可以做到这个的数据结构：<br />[](https://zh.javascript.info/map-set-weakmap-weakset#)<br />[](https://zh.javascript.info/map-set-weakmap-weakset#)
```javascript
let set = new Set();
let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };
// 访客，一些用户来了多次
set.add(john);
set.add(pete);
set.add(mary);
set.add(john);
set.add(mary);
// set 保证了值的唯一
alert( set.size ); // 3
for (let user of set) {
  alert(user.name); // John（然后是 Pete 和 Mary）
}
```
`Set` 的替换方案是使用用户数组，每次插入新元素时使用 [arr.find](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Array/find) 方法检查用户编码是否重复。但是性能就会很差，因为这个方法会遍历整个数组，检查每个元素。而对于唯一性检查，`Set` 在内部优化得更好。
<a name="sGl9y"></a>
### Set 迭代
我们可以使用 `for..of` 或者 `forEach` 来循环查看 set：[](https://zh.javascript.info/map-set-weakmap-weakset#)<br />[](https://zh.javascript.info/map-set-weakmap-weakset#)
```javascript
let set = new Set(["oranges", "apples", "bananas"]);
for (let value of set) alert(value);
// 和 forEach 相同：
set.forEach((value, valueAgain, set) => {
  alert(value);
});
```
注意到这里有个有趣得事情。`forEach` 函数用于 `Set` 时有三个参数：value，然后又一个 value，之后是目标对象。确实，相同值的 value 在参数中出现了两次。<br />这是为了兼容 `Map`，它在使用 `forEach` 方法时也包括三个参数。<br />适用于 `Map` 的迭代方法 set 也同样支持：

- `set.keys()` – 返回 set 中值的迭代对象，
- `set.values()` – 和 `set.keys` 一样，为了兼容 `Map`，
- `set.entries()` – 返回形如 `[value, value]` 的迭代对象，为了兼容 `Map` 而存在。

<a name="tYqDG"></a>
### 数组通过 Set 去重

```javascript
let newArr = Array.from(new Set(oldArr));
```

