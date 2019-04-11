export const formart = (t, type) => {
  const time = new Date(t)
  if (type === 'hh:mm') {
    return `${time.getHours() < 10 ? ('0' + time.getHours()) : time.getHours()}:${time.getMinutes() < 10 ? ('0' + time.getMinutes()) : time.getMinutes()}`
  }
}
