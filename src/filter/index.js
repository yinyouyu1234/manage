
export function timeFormat(time) {
  let str = ''
  time.forEach(item => {
    str += `${item.getFullYear()}/${item.getMonth() + 1}/${item.getDate()}, `
  })
  return str.substring(0, str.length - 2)
}
