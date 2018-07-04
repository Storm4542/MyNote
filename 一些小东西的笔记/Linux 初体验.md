## 1、Linux 初体验

> 1.安装
>
> DEEPIN下载ISO文件，通过U盘安装。

> 2.安装中的小坑
>
> - 虚拟机安装没有声音
> - 插耳机需要在设置中设置耳机模拟输出
> - 总体来说安装很简单

> 3.Shaowsocks科学上网
>
> 1.安装命令行sslocal
>
> > macOS系统
> >
> > ​    `brew install shadowsocks-libev`
> >
> > - 如果没有 brew ，安装 <https://brew.sh/>

> > Linux 系统
> >
> > ​    `sudo apt-get install python-pip; sudo pip install shadowsocks`
> >
> > - 如果遇到了 _cleanup 不存在的提示，需要将 openssl.py 中的 _cleanup 换成 _reset
> > - 运行命令   `sed -i 's/_cleanup/_reset/g' xxxxxxxxxxxxxxxxxxxxxx/openssl.py `  ，注意将路径换为 openssl.py 的路径

> 2.创建 sslocal 配置文件
>
> > 1.可以创建在任意位置 比如 (  `~/.ssconf.json `  ).
> >
> > `{`
> >
> > ​	`"server": xxx.xxx.xxx.xxx,`
> >
> > ​	`"server_port":xxxx,`
> >
> > ​	`"local_address":"127.0.0.1",`
> >
> > ​	`"local_port":1080,`
> >
> > ​	`"password":123456,`
> >
> > ​	`"timeout":300,`
> >
> > ​	`"method":"aec-256-fcb",`
> >
> > ​	`"fast_open":false`
> >
> > `}`
> >
> > 
> >
> > 2.使用   `ss-local -c ~/.ssconf.json` 或者 ` sslocal -c ~/.ssconf.json  `开启代理

> 4.安装Node.js
>
> > ```
> > sudo apt-get install nodejs
> > ```
> >
> > ```
> > sudo apt-get install npm
> > ```

> > 1.小坑
> >
> > - 全局安装包的时候需要使用 sudo ，以管理员权限运行
>
> 5.安装GIT
>
> `sudo apt-get install git`

## 命令行初体验

> 1.两个插件
>
> > 1. Z  [下载地址](https://github.com/rupa/z)
> >
> >    - 找到 z.sh ，打开 ，点击 RAW 
> >
> >    - CTRL+S 保存到电脑
> >
> >    - 在命令行中输入 `vi ~/.zshrc` ,回车
> >
> >    - 在最上方写入 ` source ~/xxx/xxx/z.sh`，保存退出
> >
> >    - 在命令行输入 `source ~/.zshrc`
> >
> >    - Z进阶，用 J 代替 Z ， JJ  可以显示最近使用的文件路径
> >
> >      ```
> >      j() {
> >           if [[ -z "$*" ]]; then
> >               cd "$(_z -l 2>&1 | fzf +s | sed 's/^[0-9,.]* *//')"
> >           else
> >               _last_z_args="$@"
> >               _z "$@"
> >           fi
> >       }
> >
> >       jj() {
> >           cd "$(_z -l 2>&1 | sed 's/^[0-9,.]* *//' | fzf -q $_last_z_args)"
> >       }
> >      ```

> > 2. fzf [下载地址](https://github.com/junegunn/fzf#installation)
> >
> >    `git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf`
> >
> >    `~/.fzf/install`

> 2.VIM
>
> 