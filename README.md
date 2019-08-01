# wx-api-promisify
use ast to parse wx.api.d.ts and generate promisify d.ts

使用ast重写官方的wx.api.d.ts声明文件生成promise化的声明文件

从2.7.7 开始跟随 miniprogram-api-typings 的版本代号

## 使用方法:

### 安装
```
npm i @strange-fish/wxp
```

### 使用
```js
import { wxp } from '@strange-fish/wxp'

async function demo () {
  const userInfo = await wxp.getUserInfo()
  console.log(userInfo)
}
```