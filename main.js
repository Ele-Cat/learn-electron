// 导入模块
const { app, BrowserWindow, ipcMain, nativeTheme, Menu, MenuItem, globalShortcut, Notification } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const https = require('node:https')
// 离屏渲染
// app.disableHardwareAcceleration()
let progressInterval

const createWindow = () => {
  // 创建并控制浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // autoHideMenuBar: true, // 隐藏菜单栏，用户仍然可以通过按下 Alt 键临时显示菜单栏
    // frame: false, // 移除标题栏和菜单栏
    webPreferences: {
      // 离屏渲染
      // offscreen: true,
      // nodeIntegration: true, // 控制渲染进程是否可以访问 Node.js 的 API
      // contextIsolation: true, // 控制渲染进程的 JavaScript 上下文是否与 Electron 的内部上下文隔离
      preload: path.join(__dirname, 'preload.js')
    },
  })

  // 拦截主进程中的事件
  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'i') {
      console.log('Pressed Control+I')
      event.preventDefault()
    }
  })

  win.loadFile('index.html')

  // 离屏渲染
  // win.loadURL('https://chat18.aichatos98.com')
  // win.webContents.on('paint', (event, dirty, image) => {
  //   fs.writeFileSync('ex.png', image.toPNG())
  // })
  // win.webContents.setFrameRate(60)
  // console.log(`The screenshot has been successfully saved to ${path.join(process.cwd(), 'ex.png')}`)

  // 移除默认菜单
  // Menu.setApplicationMenu(null);
  // 动态隐藏菜单栏
  // win.setMenuBarVisibility(false);

  // 打开开发者工具
  win.webContents.openDevTools();

  // 打开通知
  showNotification()

  // 显示进度条
  showProgressBar(win)
}

// 注册本地快捷键
const menu = new Menu()
menu.append(new MenuItem({
  label: 'Electron',
  submenu: [{
    role: 'help',
    accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
    click: () => { console.log('Electron rocks!') }
  }]
}))
Menu.setApplicationMenu(menu)

// Dark mode toggle
ipcMain.handle('dark-mode:toggle', () => {
  console.log('nativeTheme.shouldUseDarkColors: ', nativeTheme.shouldUseDarkColors);
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})
ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})

// 生成文件 & 图标
const iconName = path.join(__dirname, 'iconForDragAndDrop.png')
const icon = fs.createWriteStream(iconName)
// Create a new file to copy - you can also copy existing files.
fs.writeFileSync(path.join(__dirname, 'drag-and-drop.md'), '# File to test drag and drop')
fs.writeFileSync(path.join(__dirname, 'drag-and-drop-1.md'), '# First file to test drag and drop')
fs.writeFileSync(path.join(__dirname, 'drag-and-drop-2.md'), '# Second file to test drag and drop')
https.get('https://img.icons8.com/ios/452/drag-and-drop.png', (response) => {
  response.pipe(icon)
})

// 控制应用程序的事件生命周期
app.on('ready', () => {
  // 注册全局快捷键
  globalShortcut.register('Alt+CommandOrControl+Q', () => {
    console.log('Electron loves global shortcuts!')
  })
  globalShortcut.register('Alt+Z', () => {
    console.log('Electron loves global shortcuts Alt+Z!')
  })
  createWindow()
})

// 原生文件拖 & 放
ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: path.join(__dirname, filePath),
    icon: iconName
  })
})

const NOTIFICATION_TITLE = 'Basic Notification'
const NOTIFICATION_BODY = 'Notification from the Main process'
function showNotification () {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

function showProgressBar (win) {
  const INCREMENT = 0.03
  const INTERVAL_DELAY = 100 // ms

  let c = 0
  progressInterval = setInterval(() => {
    // update progress bar to next value
    // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%
    // 将参数设置为负值 (例如， -1) 将删除progress bar。 
    // 设定值大于 1 在 Windows 中将表示一个不确定的进度条 ，或在其他操作系统中显示为 100%。 
    // 一个不确定的progress bar 仍然处于活动状态，但不显示实际百分比， 并且用于当 您不知道一个操作需要多长时间才能完成的情况。
    win.setProgressBar(c)

    // increment or reset progress bar
    if (c < 2) {
      c += INCREMENT
    } else {
      c = (-INCREMENT * 30) // reset to a bit less than 0 to show reset state
    }
  }, INTERVAL_DELAY)
}

// before the app is terminated, clear both timers
app.on('before-quit', () => {
  clearInterval(progressInterval)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})