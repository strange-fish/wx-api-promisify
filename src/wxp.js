import methodList from '../dist/methodList.json'

if (!wx) throw Error(`wx object doesn't exist!`)

function promisifyWxApi (methodName) {
  return function wxpApi(param) {
    const { success: originS, fail: originF } = param
    return new Promise((resolve, reject) => {
      wx[methodName]({
        ...param,
        success (res) {
          originS && originS(res)
          resolve(res)
        },
        fail (err) {
          originF && originF(err)
          reject(err)
        }
      })
    })
  }
}

const wxp = Object.create(wx)

methodList.forEach((method) => {
  wxp[method] = promisifyWxApi(method)
})

export default wxp