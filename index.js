// Load tasks from localStorage on page load
window.onload = function () {
    loadTasks();
};

function loadTasks() {
    let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
    let inProgressList = JSON.parse(localStorage.getItem('inProgressList')) || [];
    let completedList = JSON.parse(localStorage.getItem('completedList')) || [];

    // Populate task-list
    taskList.forEach(task => {
        addTaskToDOM(task, 'task-list');
    });

    // Populate in-progress list
    inProgressList.forEach(task => {
        addTaskToDOM(task, 'in-progress', true);
    });

    // Populate completed list
    completedList.forEach(task => {
        addTaskToDOM(task, 'completed', false, true);
    });
}

function addTaskToDOM(task, listId, isInProgress = false, isCompleted = false) {
    var li = document.createElement('li');
    li.innerHTML = task;
    
    if (!isCompleted && !isInProgress) {
        li.innerHTML += '<span><button class="prg-btn" onclick="moveToProgress(this)">Progress</button><button class="del-btn" onclick="removeTask(this)">Delete</button></span>';
    } else if (isInProgress) {
        li.innerHTML += '<span><button class="cmp-btn" onclick="markCompleted(this)">Completed</button><button class="del-btn" onclick="removeTask(this)">Delete</button></span>';
    } else if (isCompleted) {
        li.innerHTML += ".......Task Completed";
    }
    
    document.getElementById(listId).appendChild(li);
}

function addTask() {
    const input = document.getElementById('task').value;
    if (input === "") return;
    
    var taskHTML = input;
    addTaskToDOM(taskHTML, 'task-list');

    // Update localStorage
    let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
    taskList.push(taskHTML);
    localStorage.setItem('taskList', JSON.stringify(taskList));

    document.getElementById('task').value = ""; // clear input
}

function removeTask(task) {
    var item = task.parentElement.parentElement;
    let taskHTML = item.firstChild.nodeValue;

    // Remove from the DOM
    item.remove();

    // Update localStorage based on list it was in
    updateLocalStorageAfterRemove(taskHTML);
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

    // Remove from task-list
    item.remove();
    updateLocalStorageAfterRemove(taskHTML);

    // Add to in-progress list
    addTaskToDOM(taskHTML, 'in-progress', true);

    let inProgressList = JSON.parse(localStorage.getItem('inProgressList')) || [];
    inProgressList.push(taskHTML);
    localStorage.setItem('inProgressList', JSON.stringify(inProgressList));
}

function markCompleted(task) {
    var item = task.parentElement.parentElement;
    let taskHTML = item.firstChild.nodeValue;

    // Remove from in-progress list
    item.remove();
    updateLocalStorageAfterRemove(taskHTML);

    // Add to completed list
    addTaskToDOM(taskHTML, 'completed', false, true);

    let completedList = JSON.parse(localStorage.getItem('completedList')) || [];
    completedList.push(taskHTML);
    localStorage.setItem('completedList', JSON.stringify(completedList));
}

function clearCompleted() {
    var completed = document.getElementById('completed');
    completed.innerHTML = '';

    // Clear from localStorage
    localStorage.removeItem('completedList');
}
