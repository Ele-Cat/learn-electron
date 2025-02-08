const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})，变量a=${versions.a}, b=${versions.b}`

const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // 打印 'pong'
}

func()

console.log('myApi', myApi);

const setButton = document.getElementById('setButton')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
  const title = titleInput.value
  window.electronAPI.setTitle(title)
})

const openButton = document.getElementById('openButton')
const filePathElement = document.getElementById('filePath')

openButton.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath
})