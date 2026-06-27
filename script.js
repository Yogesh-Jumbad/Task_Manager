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

                <div>

                    <h3>

                        ${task.title}

                    </h3>

                    <p>

                        ${task.description}

                    </p>

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
                       Edit
                    </button>

                   <button class="delete-btn" data-action="delete">
                      Delete
                    </button>

                </div>

            </div>

        </article>

    `;
}

function renderTaskList() {
  if (appState.tasks.length === 0) {
    taskList.innerHTML = `

            <div class="empty-state">

                <i class="fa-regular fa-folder-open"></i>

                <h3>No Tasks Yet</h3>

                <p>

                    Create your first task and
                    start being productive.

                </p>

            </div>

        `;

    return;
  }

  let html = "";

  appState.tasks.forEach(function (task) {
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

  const newTask = createTaskObject();

  appState.tasks.unshift(newTask);

  renderApplication();

  taskForm.reset();
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

  if (action !== "delete") {

    return;

  }

  const taskCard = event.target.closest(".task-card");

  const taskId = Number(taskCard.dataset.id);

  deleteTask(taskId);

}


function deleteTask(taskId) {

  appState.tasks = appState.tasks.filter(function (task) {

    return task.id !== taskId;

  });

  renderApplication();

}

//Application starts.

initializeApplication();
