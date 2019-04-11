export const isImage = (file) => {
  const type = ['image/jpeg', 'image/png']
  const isImage = type.indexOf(file.type) !== -1
  return isImage
}
