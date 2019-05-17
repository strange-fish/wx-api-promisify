# wx-api-promisify
use ast to parse wx.api.d.ts and generate promisfy d.ts

使用ast重写官方的wx.api.d.ts声明文件生成promise化的声明文件

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