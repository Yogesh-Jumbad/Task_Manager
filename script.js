/* ==========================================================
                    APPLICATION STATE
========================================================== */

/*
    The application state stores everything the app needs.

    Think of it as the "single source of truth."

    Instead of keeping multiple unrelated variables throughout
    the file, we organize them inside one object.

    Any feature we build later (search, filter, edit, delete,
    dark mode, etc.) will read from or update this object.
*/

const appState = {
  tasks: [],

  currentFilter: "all",

  searchQuery: "",

  editingTaskId: null,

  theme: "light",
};

/* ==========================================================
                    DOM REFERENCES
========================================================== */

/*
    Instead of repeatedly searching the DOM whenever we need
    an element, we store references once.

    This improves readability and avoids unnecessary DOM queries.
*/

const taskForm = document.getElementById("taskForm");

const taskTitle = document.getElementById("taskTitle");

const taskDescription = document.getElementById("taskDescription");

const taskPriority = document.getElementById("taskPriority");

const taskDate = document.getElementById("taskDate");

const searchInput = document.getElementById("searchInput");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");

const pendingTasks = document.getElementById("pendingTasks");

const completedTasks = document.getElementById("completedTasks");

const todayTasks = document.getElementById("todayTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

/* ==========================================================
                APPLICATION INITIALIZATION
========================================================== */

/*
    Every application needs a starting point.

    Instead of placing code randomly at the bottom of the file,
    we create one initialization function responsible for
    preparing the application.
*/

function initializeApplication() {
  bindEvents();
  loadTasks();
  renderApplication();
}

/* ==========================================================
                    EVENT BINDING
========================================================== */

/*
    All browser events are registered from one place.

    This makes debugging much easier because every interaction
    starts here.
*/

function bindEvents() {
  taskForm.addEventListener(
    "submit",

    handleTaskSubmission,
  );

  taskList.addEventListener(

    "click",

    handleTaskActions

  );
  searchInput.addEventListener(

    "input",

    handleSearch

  );
  filterButtons.forEach(function (button) {

    button.addEventListener("click", handleFilterChange);

  });
}

/* ==========================================================
                APPLICATION RENDER
========================================================== */

/*
    The render function is responsible for refreshing the UI.

    Whenever application data changes,
    this function is called.

    Instead of manually updating many places,
    we centralize rendering.
*/

function renderApplication() {
  renderStatistics();
  renderTaskList();
}

function renderStatistics() {

  totalTasks.textContent = appState.tasks.length;

  const completed = appState.tasks.filter(function (task) {

    return task.completed;

  }).length;

  const pending = appState.tasks.length - completed;

  completedTasks.textContent = completed;

  pendingTasks.textContent = pending;

  todayTasks.textContent = 0;

}

/* ==========================================================
                    TASK CARD TEMPLATE
========================================================== */

function createTaskCard(task) {
  return `

       <article class="task-card" data-id="${task.id}">

            <div class="task-header">

                <div class="task-info">

    <label class="checkbox-container">

        <input
            type="checkbox"
            class="complete-checkbox"
            data-action="toggle"
            ${task.completed ? "checked" : ""}>

        <span class="checkmark"></span>

    </label>

    <div>

        <h3 class="${task.completed ? "completed-task" : ""}">

            ${task.title}

        </h3>

        <p>

            ${task.description}

        </p>

    </div>

</div>

                <span class="priority ${task.priority.toLowerCase()}">

                    ${task.priority}

                </span>

            </div>

            <div class="task-footer">

                <span>

                    📅 ${task.dueDate || "No Due Date"}

                </span>

                <div class="task-actions">

                    <button class="edit-btn" data-action="edit">
                        <i class="fa-solid fa-pen"></i>
                        Edit
                    </button>

                   <button class="delete-btn" data-action="delete">
                      <i class="fa-solid fa-trash"></i>
                      Delete
                    </button>

                </div>

            </div>

        </article>

    `;
}

function renderTaskList() {

  const filteredTasks = appState.tasks.filter(function (task) {

    const matchesSearch = task.title
      .toLowerCase()
      .includes(appState.searchQuery);

    if (appState.currentFilter === "pending") {

      return matchesSearch && !task.completed;

    }

    if (appState.currentFilter === "completed") {

      return matchesSearch && task.completed;

    }

    return matchesSearch;

  });

  if (filteredTasks.length === 0) {

    taskList.innerHTML = `
            <div class="empty-state">

                <i class="fa-solid fa-magnifying-glass"></i>

                <h3>No Matching Tasks</h3>

                <p>Try another search.</p>

            </div>
        `;

    return;

  }

  let html = "";

  filteredTasks.forEach(function (task) {

    html += createTaskCard(task);

  });

  taskList.innerHTML = html;

}

/* ==========================================================
                    FORM VALIDATION
========================================================== */

function validateTaskForm() {
  if (taskTitle.value.trim() === "") {
    alert("Task title is required.");

    return false;
  }

  if (taskTitle.value.trim().length < 3) {
    alert("Task title must contain at least 3 characters.");

    return false;
  }

  return true;
}

function handleTaskSubmission(event) {
  event.preventDefault();

  const isFormValid = validateTaskForm();

  if (!isFormValid) {
    return;
  }

  if (appState.editingTaskId) {

    updateTask();

  } else {

    const newTask = createTaskObject();

    appState.tasks.unshift(newTask);

  }

  saveTasks();

  renderApplication();

  taskForm.reset();

  appState.editingTaskId = null;

  document.querySelector(".add-btn").textContent = "Add Task";
}

function createTaskObject() {
  const timestamp = Date.now();

  return {
    id: timestamp,

    title: taskTitle.value.trim(),

    description: taskDescription.value.trim(),

    priority: taskPriority.value,

    dueDate: taskDate.value,

    completed: false,

    createdAt: timestamp,
  };
}



function handleTaskActions(event) {

  const action = event.target.dataset.action;

  const taskCard = event.target.closest(".task-card");

  if (!taskCard) {

    return;

  }

  const taskId = Number(taskCard.dataset.id);

  switch (action) {

    case "delete":
      deleteTask(taskId);
      break;

    case "toggle":
      toggleTask(taskId);
      break;

    case "edit":
      editTask(taskId);
      break;

  }

}


function deleteTask(taskId) {

  appState.tasks = appState.tasks.filter(function (task) {

    return task.id !== taskId;

  });

  saveTasks();

  renderApplication();

}


function toggleTask(taskId) {

  appState.tasks = appState.tasks.map(function (task) {

    if (task.id === taskId) {

      return {

        ...task,

        completed: !task.completed

      };

    }

    return task;

  });

  saveTasks();

  renderApplication();

}

function editTask(taskId) {

  const task = appState.tasks.find(function (task) {

    return task.id === taskId;

  });

  if (!task) {

    return;

  }

  taskTitle.value = task.title;

  taskDescription.value = task.description;

  taskPriority.value = task.priority;

  taskDate.value = task.dueDate;

  appState.editingTaskId = taskId;

  document.querySelector(".add-btn").textContent = "Update Task";

  taskTitle.focus();

}

function updateTask() {

  appState.tasks = appState.tasks.map(function (task) {

    if (task.id === appState.editingTaskId) {

      return {

        ...task,

        title: taskTitle.value.trim(),

        description: taskDescription.value.trim(),

        priority: taskPriority.value,

        dueDate: taskDate.value

      };

    }

    return task;

  });

  appState.editingTaskId = null;

  document.querySelector(".add-btn").textContent = "Add Task";

}
/* ==========================================================
                LOCAL STORAGE
========================================================== */

function saveTasks() {

  localStorage.setItem(

    "tasks",

    JSON.stringify(appState.tasks)

  );

}
function loadTasks() {

  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {

    appState.tasks = JSON.parse(savedTasks);

  }

}

// Handle Search

function handleSearch(event) {

  appState.searchQuery =

    event.target.value.toLowerCase();

  renderApplication();

}

function handleFilterChange(event) {

  appState.currentFilter = event.target.dataset.filter;

  updateActiveFilterButton();

  renderApplication();

}

function updateActiveFilterButton() {

  filterButtons.forEach(function (button) {

    button.classList.remove("active");

    if (button.dataset.filter === appState.currentFilter) {

      button.classList.add("active");

    }

  });

}


//Application starts.

initializeApplication();
