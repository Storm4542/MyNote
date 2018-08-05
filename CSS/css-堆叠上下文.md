### 堆叠上下文

#### 1.堆叠顺序

div是有空间层次关系的。

原则：相同类型的元素，后出现的会覆盖之前的。

层次顺序（底层-上层）： 

1. background
2. border
3. 块级
4. 浮动
5. 内联
6. z-index : 0 ( position :relative , absolute)
7. z-index :  +

注意：z-index 只有在 position 不是 static 的时候才有用，比如 relative , absolute