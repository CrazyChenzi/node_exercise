/**
 * path 日志文件所存放的文件夹路径
 * fileName 日志文件名称
 * content 详细
 * logger.info 2019-01-22 19:54:50.536 [INFO] 1
 * logger.error 2019-01-22 19:54:50.537 [ERROR] 2
 */

const fs = require('fs')
const path = 'G://blacklisten//node_exercise//logsDemo//logs'

function formatDate(fmt, date) {
  if (!fmt) fmt = 'yyyy-MM-dd';
  if (!date) {
    date = new Date();
  } else {
    date = new Date(date);
  }
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

function readPath (path) {
  if (fs.existsSync(path)) {
    return new Promise((resolve, reject) => {
      return resolve('true')
    })
  } else {
    return new Promise ((resolve, reject) => {
      return fs.mkdir(path, {recursive: true}, (err) => {
        if (err) return reject('false')
        return resolve(fs.existsSync(path))
      })
    })
  }
}

class Logger {
  writeLogs ({path, fileName, content}) {
    readPath(path).then((res) => {
      if (res) {
        fs.appendFile(`${path + '//' + fileName}`, content, (err) => {
          if (err) throw err
          console.log(content)
        })
      } else {
        console.log('创建文件夹失败！请手动在' + path + '下创建logs文件夹')
      }
    })
  }
  info ({path, fileName = 'logs', content}) {
    content = formatDate('yyyy-MM-dd hh:mm:ss.S', Date.now()) + ' [INFO] ' + content + '\r\n'
    this.writeLogs({path, fileName, content})
  }
  error ({path, fileName = 'logs', content}) {
    content = formatDate('yyyy-MM-dd hh:mm:ss.S', Date.now()) + ' [ERROR] ' + content + '\r\n'
    this.writeLogs({path, fileName, content})
  }
}

const logger = new Logger()

logger.info({path, content: 1})
logger.error({path, content: 2})