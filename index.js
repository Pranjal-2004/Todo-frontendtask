window.onload = function () {
    loadTasks();
    document.getElementById('task').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
};

function loadTasks() {
    let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
    let inProgressList = JSON.parse(localStorage.getItem('inProgressList')) || [];
    let completedList = JSON.parse(localStorage.getItem('completedList')) || [];

    taskList.forEach(task => {
        addTaskToDOM(task, 'task-list');
    });

    inProgressList.forEach(task => {
        addTaskToDOM(task, 'in-progress', true);
    });

    completedList.forEach(task => {
        addTaskToDOM(task, 'completed', false, true);
    });
}

function addTaskToDOM(task, listId, isInProgress = false, isCompleted = false) {
    var li = document.createElement('li');
    li.innerHTML = task;

    if (!isCompleted && !isInProgress) {
        li.innerHTML += '<span><button class="prg-btn" onclick="moveToProgress(this)">Progress</button><button class="del-btn" onclick="openModal(this)">Delete</button></span>';
    } else if (isInProgress) {
        li.innerHTML += '<span><button class="cmp-btn" onclick="markCompleted(this)">Completed</button><button class="del-btn" onclick="openModal(this)">Delete</button></span>';
    } else if (isCompleted) {
        li.innerHTML += ".......Task Completed";
    }

    document.getElementById(listId).appendChild(li);
}

function addTask() {
    const input = document.getElementById('task').value.trim();
    if (input === "") return;

    let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
    let inProgressList = JSON.parse(localStorage.getItem('inProgressList')) || [];
    let completedList = JSON.parse(localStorage.getItem('completedList')) || [];

    if (taskList.includes(input) || inProgressList.includes(input) || completedList.includes(input)) {
        alert("Task already exists!");
        return;
    }

    var taskHTML = input;
    addTaskToDOM(taskHTML, 'task-list');

    taskList.push(taskHTML);
    localStorage.setItem('taskList', JSON.stringify(taskList));

    document.getElementById('task').value = ""; 
}

function updateLocalStorageAfterRemove(taskHTML) {
    ['taskList', 'inProgressList', 'completedList'].forEach(listName => {
        let list = JSON.parse(localStorage.getItem(listName)) || [];
        list = list.filter(task => task !== taskHTML);
        localStorage.setItem(listName, JSON.stringify(list));
    });
}

function moveToProgress(task) {
    var item = task.parentElement.parentElement;
    let taskHTML = item.firstChild.nodeValue;

    item.remove();
    updateLocalStorageAfterRemove(taskHTML);

    addTaskToDOM(taskHTML, 'in-progress', true);

    let inProgressList = JSON.parse(localStorage.getItem('inProgressList')) || [];
    inProgressList.push(taskHTML);
    localStorage.setItem('inProgressList', JSON.stringify(inProgressList));
}

function markCompleted(task) {
    var item = task.parentElement.parentElement;
    let taskHTML = item.firstChild.nodeValue;

    item.remove();
    updateLocalStorageAfterRemove(taskHTML);

    addTaskToDOM(taskHTML, 'completed', false, true);

    let completedList = JSON.parse(localStorage.getItem('completedList')) || [];
    completedList.push(taskHTML);
    localStorage.setItem('completedList', JSON.stringify(completedList));
}

function clearCompleted() {
    var completed = document.getElementById('completed');
    completed.innerHTML = '';
    localStorage.removeItem('completedList');
}

var modal = document.getElementById("myModal");
var selectedTaskToDelete; 

function openModal(task) {
    modal.style.display = "block";
    selectedTaskToDelete = task;
}

var closeSpan = document.getElementsByClassName("close")[0];
closeSpan.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

var okButton = document.getElementsByClassName("ok")[0];
okButton.onclick = function () {
    removeTask(selectedTaskToDelete); 
    modal.style.display = "none";  
};

function removeTask(task) {
    var item = task.parentElement.parentElement;
    let taskHTML = item.firstChild.nodeValue;
    item.remove();
    updateLocalStorageAfterRemove(taskHTML);
}
