

const userName = document.getElementById("user-name")
const startBtn = document.getElementById("start-btn")

// runs on load to check if user already exists
switchPages()

startBtn.addEventListener("click", function () {
    setLocalStorage("user", userName.value)
    switchPages()
})

