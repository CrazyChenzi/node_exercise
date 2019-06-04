const http = require('http')
const fs = require('fs')
const path = require('path')

let percentage

class StreamDownload {
  constructor (downloadFileCallback) {
    this.totalBytes = 0
    this.receivedBytes = 0
    this.downloadCallback = downloadFileCallback
  }

  // 进程
  showProgress (received, total) {
    percentage = (received * 100) / total
    // 用回调显示到界面上
    this.downloadCallback('progress', percentage)
  }

  downloadFile (patchUrl, baseDir, downloadFile) {
    http.get(patchUrl, (req, res) => {
      const out = fs.createWriteStream(path.join(baseDir, downloadFile))
      // 更新总文件字节大小
      this.totalBytes = parseInt(req.headers['content-length'], 10)

      req.pipe(out)

      req.on('data', (data) => {
        // 更新下载的文件块字节大小
        this.receivedBytes += data.length
        this.showProgress(this.receivedBytes, this.totalBytes)
      })
      req.on('end', function () {
        console.log('下载已完成，等待处理')
        // TODO: 检查文件，部署文件，删除文件
        this.downloadCallback('finished', percentage)
      })
    })
  }
}


const s = new StreamDownload(downloadFileCallback)

// 定义回调函数
function downloadFileCallback (arg, percentage) {
  if (arg === 'progress') {
    console.debug('progress', percentage)    // 显示进度
  } else if (arg === 'finished') {
    console.debug('finished', percentage)  // 通知完成
  }
}

// 调用下载
s.downloadFile('http://xz.hfjy.com/learning/StudentSetup.exe', './file', 'StudentSetup.exe')