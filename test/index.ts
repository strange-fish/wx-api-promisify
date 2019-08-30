import { wxp } from '../dist/wxp'

async function test () {
  const userInfo = await wxp.getUserInfo({})
  const { code } = await wxp.login()
}