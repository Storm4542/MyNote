### 1.加密 解密 工具

- bcrypt 

  [链接]: https://www.npmjs.com/package/bcrypt

  加密

  ```javascript
  const saltRounds = 10; //加密轮数
  let password = userInfo.password //密码
  bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
              //把hash值赋值给password变量
              password = hash;
              storeUInfo({ //存储
                  username: userInfo.username,
                  password,
                  name: userInfo.name,
                  age: userInfo.age
              });
          })
      })
  ```

  解密验证

  ```javascript
  async function login(userInfo) {
      const user = await UserModel.findOne({ //从数据库中找到该用户
          username: userInfo.username
      })
      const match = await bcrypt.compare(userInfo.password, user.password) // 看看 密码是否相同
      if (match) {
          return user
      } else {
          throw new HttpParamError('user', '用户名密码错误', 'username password error')
      }
  }
  ```


 