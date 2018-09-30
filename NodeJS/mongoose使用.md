### 1. 命令行中创建并启动数据库

1. 指定存储的位置和端口号

```
mongod --dbpath --port=27018  code/mongo_demo 
```

2.  另开一个命令行窗口，进入 code/mongo_demo

```
mongo
```

### 2. 使用 mongoose 链接数据库并创建 Collection

1. 链接数据库

   ```javascript
   const mongoose = require('mongoose');
   const Schema = mongoose.Schema;
   
   const uri = 'mongodb://localhost/what_i_love';
   
   const ObjectId = Schema.Types.ObjectId;
   
   mongoose.set('useCreateIndex', true)
   
   mongoose.Promise = Promise;
   
   const connection = mongoose.connect(uri, {useNewUrlParser: true})
   
   const db = mongoose.connection;
   ```

2. 创建 Collection

   ```javascript
   let UserSchema = new Schema({
       name: {type: String, required: true, unique: true, index: 1},
       age: {type: Number, required: true, max: 199, min: [0,'你还没生出来呢']}
   });
   const UserModel = mongoose.model('user', UserSchema);
   //创建一个叫做 user 的 collection
   ```

3. 操作 Collection

   ```javascript
   async function insert(userInfo) {
       return await UserModel.create(userInfo)
   }
   async function getOneById(id) {
       return await UserModel.findOne({
           _id: id
       })
   }
   
   async function getOneByName(name) {
       return await UserModel.findOne({
           name
       })
   }
   
   async function list(params) {
       const match = {}
       const flow = UserModel.find(match)
       return await flow.exec()
   
   }
   module.exports = {
       insert,
       getOneById,
       getOneByName,
       list,
   }
   ```

### 3. 使用中

 一般来说链接数据库的方法单独放在一个地方。（第一步操作）

创建 Collection 并 操作Collection 放在一个地方。(第二步操作)