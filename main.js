// 导入模块
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('node:path')

const createWindow = () => {
  // 创建并控制浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#fdfdfd',
    // autoHideMenuBar: true, // 隐藏菜单栏，用户仍然可以通过按下 Alt 键临时显示菜单栏
    // frame: false, // 移除标题栏和菜单栏
    webPreferences: {
      nodeIntegration: true, // 控制渲染进程是否可以访问 Node.js 的 API
      contextIsolation: true, // 控制渲染进程的 JavaScript 上下文是否与 Electron 的内部上下文隔离
      preload: path.join(__dirname, 'preload.js')
    },
  })

  win.loadFile('index.html')
  // win.loadURL('https://www.baidu.com')

  // 移除默认菜单
  // Menu.setApplicationMenu(null);
  // 动态隐藏菜单栏
  win.setMenuBarVisibility(false);

  win.webContents.openDevTools();
}

// 控制应用程序的事件生命周期
app.on('ready', () => {
  ipcMain.handle('ping', () => 'pong')
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})