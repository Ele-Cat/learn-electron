document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle()
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
})
document.getElementById('reset-to-system').addEventListener('click', async () => {
  await window.darkMode.system()
  document.getElementById('theme-source').innerHTML = 'System'
})

function handleKeyPress (event) {
  // You can put code here to handle the keypress.
  document.getElementById('last-keypress').innerText = event.key
  console.log(`You pressed ${event.key}`)
}
window.addEventListener('keyup', handleKeyPress, true)

document.getElementById('drag').ondragstart = (event) => {
  event.preventDefault()
  window.electron.startDrag('drag-and-drop-1.md')
}