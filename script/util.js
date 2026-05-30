const setLocalStorage = function (a, b) {
    localStorage.setItem(a, b)
}

const setTimer = function (a, b) {
    setTimeout(a, b)
}

const switchPages = function () {
    if (localStorage.getItem("user") !== null) {
        setTimer(() => window.location.replace("pages/dossier.html"), 1500)
    }
}

const loadModal = function () {
    modal.classList.toggle("none")
}

const storeTodo = function (todo) {
    const existing = localStorage.getItem("todos")
    const todosArray = existing ? JSON.parse(existing) : []
    todosArray.push(todo)
    localStorage.setItem("todos", JSON.stringify(todosArray))
}

const collectFormData = function () {
    if (!title.value || !desc.value || ping.value === "_blank" || !expTime.value) {
        alert("All fields are required!")
        return false
    }
    
    
    const todo = {
        title: title.value,
        desc: desc.value,
        priority: ping.value,
        expiry: expTime.value,
        createdAt: Date.now(),
        status: "upcoming"
    }
    storeTodo(todo)
}


const getStatus = function (expiry, savedStatus) {
    if (savedStatus === "completed") return "completed"
    const now = Date.now()
    const expiryTime = new Date(expiry).getTime()
    if (now < expiryTime) return "upcoming"
    if (now < expiryTime + (2 * 60 * 60 * 1000)) return "ongoing"
    return "missed"
}

const formatDate = function (timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: '2-digit',
        month: 'short'
    })
}


const updateMetrics = function () {
    const todoItems = localStorage.getItem("todos")
    if (!todoItems) return
    const todos = JSON.parse(todoItems)

    const total = todos.length
    const completed = todos.filter(t => t.status === "completed").length
    const missed = todos.filter(t => getStatus(t.expiry, t.status) === "missed").length
    const ongoing = todos.filter(t => getStatus(t.expiry, t.status) === "ongoing").length
    const upcoming = todos.filter(t => getStatus(t.expiry, t.status) === "upcoming").length
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100)

    metricTotal.innerHTML = total
    metricSuccess.innerHTML = completed
    metricMissed.innerHTML = missed
    metricOngoing.innerHTML = ongoing
    metricUpcoming.innerHTML = upcoming
    successRate.innerHTML = rate + "%"

    successMeter.style.background = `conic-gradient(#fff 0% ${rate}%, #333 ${rate}% 100%)`
}

const completeTask = function (checkbox) {
    const todoItem = checkbox.closest('.todo-item')
    if (todoItem.classList.contains('missed')) return
    
    // rest of the function stays the same
    const unchecked = checkbox.querySelector('.icon-unchecked')
    const checked = checkbox.querySelector('.icon-checked')

    unchecked.classList.add('none')
    checked.classList.remove('none')
    todoItem.classList.remove('upcoming', 'ongoing', 'missed')
    todoItem.classList.add('completed')

    // update status badge
    const statusBadge = todoItem.querySelector('.todo-status-badge')
    statusBadge.className = 'todo-status-badge completed'
    statusBadge.textContent = 'COMPLETED'

    // update localStorage by createdAt timestamp (unique per todo)
    const createdAt = parseInt(todoItem.dataset.createdat)
    const todos = JSON.parse(localStorage.getItem('todos'))
    const todo = todos.find(t => t.createdAt === createdAt)
    if (todo) {
        todo.status = 'completed'
        localStorage.setItem('todos', JSON.stringify(todos))
    }
    
    updateMetrics()
}



const generateTodoCards = function () {
    const todoItems = localStorage.getItem("todos")
    if (!todoItems) return
    const parsedItems = JSON.parse(todoItems)

    todoList.innerHTML = ""

    for (const todoItem of parsedItems) {
        const status = getStatus(todoItem.expiry, todoItem.status)
        const isCompleted = status === "completed"

        todoList.innerHTML += `
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
        </div>`
    }
    updateMetrics()
}

const saveTodo = function () {
    if (collectFormData() === false) return
    generateTodoCards()
    loadModal()
}
