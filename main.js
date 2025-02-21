// 导入模块
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const createWindow = () => {
  // 创建并控制浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  })


  // win.loadFile('index.html')
  win.loadURL('https://example.com')

  win.webContents.openDevTools();
}

// 控制应用程序的事件生命周期
app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})