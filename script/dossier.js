const user = document.getElementById("user");
const metricTotal = document.getElementById("total");
const metricOngoing = document.getElementById("ongoing");
const metricMissed = document.getElementById("missed");
const metricSuccess = document.getElementById("completed");
const metricUpcoming = document.getElementById("upcoming");
const successRate = document.getElementById("success-rate");
const successMeter = document.querySelector(".success-meter");
const judgement = document.getElementById("judgement");

const addBtn = document.getElementById("add-btn");
const addIcon = document.querySelector(".lucide-plus-icon");
const trashIcon = document.querySelector(".trash-icon");
const todoList = document.getElementById("todo-list");
const toDoForm = document.getElementById("form");
const modal = document.getElementById("modal");
const reset = document.getElementById("reset");

//form contents
const title = document.getElementById("todo-title");
const desc = document.getElementById("todo-desc");
const expTime = document.getElementById("todo-expiry");
const ping = document.getElementById("todo-priority");
const addItemBtn = document.getElementById("add-item");
const cancel = document.getElementById("cancel");
const body = document.body;

//reset modal contents
const resetConfirmBtn = document.querySelector(".yes-btn");
const resetCancelBtn = document.querySelector(".no-btn");

// welcome user
user.innerHTML = localStorage.getItem("user");

const addBtnHold = onLongPress(showButtonOptions, 600);

const setMinExpiry = function () {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);
  expTime.setAttribute("min", minDateTime);
};

setMinExpiry();

//show button options: Toggle visibility of add and clear buttons
addBtn.addEventListener("touchstart", addBtnHold.start);
addBtn.addEventListener("touchend", addBtnHold.cancel);
//toggleModal
addIcon.addEventListener("click", () => loadModal());
cancel.addEventListener("click", () => loadModal());
// toggle reset modal
trashIcon.addEventListener("click", () => loadResetModal());
resetCancelBtn.addEventListener("click", () => loadResetModal());

//Add new to-do item: Collect form data, store it, and update the display
addItemBtn.addEventListener("click", () => saveTodo());
// Clear Completed Tasks: Remove all completed tasks from localStorage and update the display
resetConfirmBtn.addEventListener("click", () => clearCompleted());

generateTodoCards();
