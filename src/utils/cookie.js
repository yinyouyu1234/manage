export const setCookie = (name, value, iDay) => {
  var oDate = new Date()
  oDate.setDate(oDate.getDate() + iDay) // 用来设置过期时间用的，获取当前时间加上传进来的iDay就是过期时间
  document.cookie = name + '=' + value + ';expires=' + oDate
}
export const getCookie = (name) => {
  var arr = document.cookie.split('; ') // 多个cookie值是以; 分隔的，用split把cookie分割开并赋值给数组
  for (var i = 0; i < arr[i].length; i++) // 历遍数组
  {
    var arr2 = arr[i].split('=') // 原来割好的数组是：user=simon，再用split('=')分割成：user simon 这样可以通过arr2[0] arr2[1]来分别获取user和simon 
    if (arr2[0] === name) {
      // 如果数组的属性名等于传进来的name
      return arr2[1] // 就返回属性名对应的值
    }
    return '' // 没找到就返回空
  }
}
export const removeCookie = (name) => {
  setCookie(name, 1, -1)
}
