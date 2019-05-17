import methodList from '../dist/methodList.json'

if (!wx) throw Error(`wx object doesn't exist!`)

function promisifyWxApi (methodName) {
  return function wxpApi(param = {}) {
    const { success: originS, fail: originF } = param
    return new Promise((resolve, reject) => {
      wx[methodName]({
        ...param,
        success (res) {
          resolve(res)
          originS && originS(res)
        },
        fail (err) {
          reject(err)
          originF && originF(err)
        }
      })
    })
  }
}

const wxp = {}
// from @minapp/wx https://github.com/wx-minapp/minapp-wx/blob/master/src/wxp.ts
Object.getOwnPropertyNames(wx).forEach(key => {
  const desc = Object.getOwnPropertyDescriptor(wx, key)
  if (desc) {
    if (methodList.indexOf(key) >= 0) {
      Object.defineProperty(wxp, key, {
        configurable: desc.configurable,
        enumerable: desc.enumerable,
        get() {
          return promisifyWxApi(key)
        }
      })
    } else {
      Object.defineProperty(wxp, key, desc)
    }
  }
})

export { wxp }