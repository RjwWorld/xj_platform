export function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}
export function isvalidPassword(str) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/
  return reg.test(str)
}
export function isvalidPhoneCode(str) {
  const reg =  /^[a-zA-Z0-9]{6}$/
  return reg.test(str)
}
export function isvalidCode(str) {
  const reg =  /^[a-zA-Z0-9]{4}$/
  return reg.test(str)
}
export function isvalidAnotherName(str) {
  const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
  return reg.test(str)
}
export function isvalidEmail(str) {
  const reg =  /^[a-zA-z0-9]+@[a-zA-Z0-9]+\.\w{2,3}$/
  return reg.test(str)
}
export function isvalidLocal(str) {
  const reg = /^[a-zA-Z\u4e00-\u9fa5]+$/
  return reg.test(str)
}
export function isvalidQq(str) {
  const reg = /[1-9][0-9]{4,14}/
  return reg.test(str)
}
export function isfile(str) {
  const reg = /[1-9][0-9]{1,10}/
  return reg.test(str)
}
export function isvalidUserCard(str) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(str)
}
export function isvalidCompany(str) {
  const reg = /^[a-zA-Z\u4e00-\u9fa5]+$/
  return reg.test(str)
}
export function isSureDeg(str) {
  if (str === '100') {
    return true
  }else {
    const reg = /^[1-9]{1,3}$/
    return reg.test(str)
  }

}
