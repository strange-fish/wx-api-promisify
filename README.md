# wx-api-promisify
use ast to parse wx.api.d.ts and generate promisfy d.ts

usage:
```js
import { wxp } from '@strange-fish/wxp'

async function demo () {
  const userInfo = await wxp.getUserInfo()
  console.log(userInfo)
}
```