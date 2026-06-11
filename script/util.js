const setLocalStorage = function (a, b) {
  localStorage.setItem(a, b);
};

const setTimer = function (a, b) {
  return setTimeout(a, b);
};

const switchPages = function () {
  const user = localStorage.getItem("user");
  if (user !== null && user !== "") {
    setTimer(() => window.location.replace("pages/dossier.html"), 1200);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//++++BUTTON EXPANSION AND MODAL LOGIC++++++++++++++++++++++++++++++++++++++++++++++++++++
// Button Expansion and Collapse: Click button to expand options, click outside to collapse
const showButtonOptions = function () {
  addBtn.classList.add("expanded");
  body.addEventListener("click", function hideOptions(e) {
    if (!addBtn.contains(e.target)) {
      addBtn.classList.remove("expanded");
      body.removeEventListener("click", hideOptions);
    }
  });
};

const onLongPress = function (callback, duration = 600) {
  let pressTimer;
  return {
    start: () => {
      pressTimer = setTimer(callback, duration);
    },
    cancel: () => clearTimeout(pressTimer),
  };
};

// Load Form Modal: Toggle visibility of the form modal
const loadModal = function () {
  modal.classList.toggle("none");
};

// load reset modal: Toggle visibility of the reset confirmation modal
const loadResetModal = function () {
  reset.classList.toggle("none");
};

// Clear Completed Tasks: Remove all completed tasks from localStorage and update the display
const clearCompleted = function () {
  localStorage.removeItem("todos");
  loadResetModal();
  generateTodoCards();
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

const storeTodo = function (todo) {
  const existing = localStorage.getItem("todos");
  const todosArray = existing ? JSON.parse(existing) : [];
  todosArray.push(todo);
  localStorage.setItem("todos", JSON.stringify(todosArray));
};

const collectFormData = function () {
  if (
    !title.value ||
    !desc.value ||
    ping.value === "_blank" ||
    !expTime.value
  ) {
    alert("All fields are required!");
    return false;
  }

  const todo = {
    title: title.value,
    desc: desc.value,
    priority: ping.value,
    expiry: expTime.value,
    createdAt: Date.now(),
    status: "upcoming",
  };
  storeTodo(todo);
};

const getStatus = function (expiry, savedStatus) {
  if (savedStatus === "completed") return "completed";
  const now = Date.now();
  const expiryTime = new Date(expiry).getTime();
  if (now < expiryTime) return "upcoming";
  if (now < expiryTime + 2 * 60 * 60 * 1000) return "ongoing";
  return "missed";
};

const formatDate = function (timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "short",
  });
};

const getJudgement = function (rate) {
  if (rate <= 10)
    return "your productivity is statically insignificant today. Pathetic.";
  if (rate <= 20)
    return "Your commitment is as reliable as Nigerian power supply.";
  if (rate <= 30) return "You're trying. Unfortunately, trying doesn't count.";
  if (rate <= 40) return "Mediocrity called. It wants its standards back.";
  if (rate <= 50)
    return "You're exactly average. Congratulations on achieving nothing remarkable.";
  if (rate <= 60)
    return "More than half. Your ancestors are mildly less disappointed.";
  if (rate <= 70) return "Decent. For someone with no actual ambition.";
  if (rate <= 80)
    return "You're doing well. Don't let it go to your head, it won't last.";
  if (rate <= 90)
    return "Impressive. Statistically anomalous for someone like you.";
  return "Almost perfect. Almost. That one failure haunts you doesn't it?";
};

const updateMetrics = function () {
  const todoItems = localStorage.getItem("todos");
  const todos = todoItems ? JSON.parse(todoItems) : [];

  const total = todos.length;
  const completed = todos.filter((t) => t.status === "completed").length;
  const missed = todos.filter(
    (t) => getStatus(t.expiry, t.status) === "missed",
  ).length;
  const ongoing = todos.filter(
    (t) => getStatus(t.expiry, t.status) === "ongoing",
  ).length;
  const upcoming = todos.filter(
    (t) => getStatus(t.expiry, t.status) === "upcoming",
  ).length;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  metricTotal.innerHTML = total;
  metricSuccess.innerHTML = completed;
  metricMissed.innerHTML = missed;
  metricOngoing.innerHTML = ongoing;
  metricUpcoming.innerHTML = upcoming;
  successRate.innerHTML = rate + "%";

  successMeter.style.background = `conic-gradient(#fff 0% ${rate}%, #333 ${rate}% 100%)`;

  judgement.innerHTML = getJudgement(rate);
};

const completeTask = function (checkbox) {
  const todoItem = checkbox.closest(".todo-item");
  if (todoItem.classList.contains("missed")) return;

  // rest of the function stays the same
  const unchecked = checkbox.querySelector(".icon-unchecked");
  const checked = checkbox.querySelector(".icon-checked");

  unchecked.classList.add("none");
  checked.classList.remove("none");
  todoItem.classList.remove("upcoming", "ongoing", "missed");
  todoItem.classList.add("completed");

  // update status badge
  const statusBadge = todoItem.querySelector(".todo-status-badge");
  statusBadge.className = "todo-status-badge completed";
  statusBadge.textContent = "COMPLETED";

  // update localStorage by createdAt timestamp (unique per todo)
  const createdAt = parseInt(todoItem.dataset.createdat);
  const todos = JSON.parse(localStorage.getItem("todos"));
  const todo = todos.find((t) => t.createdAt === createdAt);
  if (todo) {
    todo.status = "completed";
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  updateMetrics();
};

const generateTodoCards = function () {
  const todoItems = localStorage.getItem("todos");
  const parsedItems = todoItems ? JSON.parse(todoItems) : [];

  todoList.innerHTML = "";

  for (const todoItem of parsedItems) {
    const status = getStatus(todoItem.expiry, todoItem.status);
    const isCompleted = status === "completed";

    const newTodo = `
        <div class='todo-item ${todoItem.priority} ${status}' data-createdat='${todoItem.createdAt}' onclick='this.classList.toggle("expanded")'>
            <div class='todo-header'>
                <span class='todo-category'>${todoItem.priority.toUpperCase()}</span>
                <span class='todo-time'>${formatDate(todoItem.createdAt)}</span>
            </div>
            <div class='todo-main'>
                <span class='todo-checkbox' onclick='event.stopPropagation(); completeTask(this)'>
                    <svg class='lucide icon-unchecked ${isCompleted ? "none" : ""}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/></svg>
                    <svg class='lucide icon-checked ${isCompleted ? "" : "none"}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><path d='m9 11 3 3L22 4'/></svg>
                </span>
                <div class='todo-content'>
                    <span class='todo-title'>${todoItem.title}</span>
                    <p class='todo-desc'>${todoItem.desc}</p>
                </div>
            </div>
            <div class='todo-footer'>
                <span class='todo-priority-badge'>${todoItem.priority}</span>
                <span class='todo-status-badge ${status}'>${status.toUpperCase()}</span>
            </div>
            <div class='todo-expanded-content'>
                <span class='todo-expiry-label'>EXPIRES</span>
                <span class='todo-expiry-value'>${todoItem.expiry}</span>
            </div>
        </div>`;

    todoList.insertAdjacentHTML("afterbegin", newTodo);
  }
  updateMetrics();
};

const saveTodo = function () {
  if (collectFormData() === false) return;
  generateTodoCards();
  loadModal();
};
