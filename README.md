# wx-api-promisify (废弃)
最新版的miniprogram-api-typings(2.10.4) 已经支持promise返回。

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

#### 全局声明
全局声明后可直接使用 wxp

typings/wxp.d.ts
```ts
import { wxp as wxPromise } from '@strange-fish/wxp'

export as namespace wxp
export = wxPromise
```

global.js
```js
import { wxp } from '@strange-fish/wxp'

global.wxp = wxp
```