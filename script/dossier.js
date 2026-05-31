const user = document.getElementById("user")
const metricTotal = document.getElementById("total")
const metricOngoing = document.getElementById("ongoing")
const metricMissed = document.getElementById("missed")
const metricSuccess = document.getElementById("completed")
const metricUpcoming = document.getElementById("upcoming")
const successRate = document.getElementById("success-rate")
const successMeter = document.querySelector(".success-meter")
const judgement = document.getElementById("judgement")


const addBtn = document.getElementById("add-btn")
const todoList = document.getElementById("todo-list")
const toDoForm = document.getElementById("form")
const modal = document.getElementById("modal")

//form contents
const title = document.getElementById("todo-title")
const desc = document.getElementById("todo-desc")
const expTime = document.getElementById("todo-expiry")
const ping = document.getElementById("todo-priority")
const addItemBtn = document.getElementById("add-item")
const cancel = document.getElementById("cancel")

// welcome user
user.innerHTML = localStorage.getItem("user")

//toggleModal
addBtn.addEventListener("click", ()=>loadModal())
cancel.addEventListener("click", ()=>loadModal())

addItemBtn.addEventListener("click", ()=>saveTodo())

generateTodoCards()
