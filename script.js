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

    theme: "light"

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

const filterButtons =
document.querySelectorAll(".filter-btn");


/* ==========================================================
                APPLICATION INITIALIZATION
========================================================== */

/*
    Every application needs a starting point.

    Instead of placing code randomly at the bottom of the file,
    we create one initialization function responsible for
    preparing the application.
*/

function initializeApplication(){

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

function bindEvents(){

    taskForm.addEventListener(

        "submit",

        handleTaskSubmission

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

function renderApplication(){

    renderStatistics();

    renderTaskList();

}


function renderStatistics(){

    totalTasks.textContent =
    appState.tasks.length;

    pendingTasks.textContent = 0;

    completedTasks.textContent = 0;

    todayTasks.textContent = 0;

}

function renderTaskList(){

    console.log("Rendering Tasks");

}


function handleTaskSubmission(event){

    event.preventDefault();

    console.log("Form Submitted");

}

//Application starts.

initializeApplication();