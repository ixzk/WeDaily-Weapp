/**
 * 全局格式化unix时间戳方法，默认显示year和second。
 */
const formatTime = (date, y = true, s = true) => {
  // 10位转换13位时间戳
  if (date.toString().length == 10) {
    date *= 1000;
  } 

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + (y ? (s ? [hour, minute, second] : [hour, minute]).map(formatNumber).join(':') : "");
}

/**
 * 距离今天已经多少天
 */
const sinceToday = (date, end = null) => {
  var dateBegin = new Date(date);//将-转化为/，使用new Date
    var dateEnd = end == null ? new Date() : new Date(end);//获取当前时间
    var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
    var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    var timesString = '';

    if (dayDiff != 0) {
        timesString = dayDiff;
    } else if (dayDiff == 0 && hours != 0) {
        timesString = 1;
    } else if (dayDiff == 0 && hours == 0) {
        timesString = 1;
    } else {
        timesString = 1;
    }

    return timesString;
}
  
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
    formatTime: formatTime,
    sinceToday: sinceToday
}