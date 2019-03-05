function completeTask(checkboxNode) {
  const nodeParent = checkboxNode.parentElement;
  const taskText = nodeParent.getElementsByClassName("todo-list-item")[0];
  const taskIcon = nodeParent.getElementsByClassName("todo-list-checkbox")[0];
  const taskTextValue = taskText.value;

  // Create new span element
  let newTextElement = document.createElement("SPAN");
  newTextElement.classList = "todo-list-item";
  newTextElement.innerHTML = taskTextValue.strike();

  // Replace input element with created span element
  nodeParent.replaceChild(newTextElement, taskText);

  // Replace class of task icon element
  taskIcon.classList.remove("todo-list-checkbox");
  taskIcon.classList.add("todo-list-checkbox-completed");

  // Change data atrribute to reflect task is completed
  nodeParent.dataset.completed = "true";

  saveTodoTasks();
}

function removeTask(selectedNode) {
  selectedNode.parentNode.style.display = "none";
  saveTodoTasks();
}

const taskRows = document.getElementsByClassName("todo-list-task");
for (let row of taskRows) {
  addTaskElementListeners(row);
}

function addTaskElementListeners(taskElement) {
  const checkboxElement = taskElement.children[0];
  const textElement = taskElement.children[1];

  // Checkbox listeners
  checkboxElement.onclick = () => {
    const isComplete = taskElement.dataset.completed == "true";
    if (isComplete) {
      removeTask(checkboxElement);
    } else {
      completeTask(checkboxElement);
    }
  };
  checkboxElement.onmouseover = () => {
    const isComplete = taskElement.dataset.completed == "true";
    checkboxElement.innerHTML = isComplete ? "close" : "done";
  };
  checkboxElement.onmouseout = () => {
    const isComplete = taskElement.dataset.completed == "true";
    checkboxElement.innerHTML = isComplete ? "done" : "radio_button_unchecked";
  };

  // Text listeners
  textElement.onchange = () => {
    saveTodoTasks();
  };
}

function createTask(taskObject) {
  const taskText = taskObject["text"];
  const isComplete = taskObject["completed"];

  // Create parent
  let taskElement = document.createElement("DIV");
  taskElement.classList = "todo-list-row todo-list-task";
  taskElement.dataset.completed = "false";

  // Create icon element
  let taskIconElement = document.createElement("I");
  taskIconElement.classList =
    "material-icons todo-list-checkbox green-on-hover";
  taskIconElement.innerHTML = isComplete ? "done" : "radio_button_unchecked";

  // Create text element
  let taskTextElement = document.createElement("INPUT");
  taskTextElement.setAttribute("type", "text");
  taskTextElement.setAttribute("autocomplete", "off");
  taskTextElement.classList = "todo-list-item";
  taskTextElement.value = taskText;

  // Append icon and text element as children to parent element
  taskElement.appendChild(taskIconElement);
  taskElement.appendChild(taskTextElement);

  // Add listeners
  addTaskElementListeners(taskElement);

  // Complete task if completed
  if (isComplete) {
    // The checkbox node is required as argument
    completeTask(taskElement.children[0]);
  }

  // Append parent element to to-do list
  const todoListContent = document.getElementById("todo-list-content");
  todoListContent.insertBefore(taskElement, todoListContent.firstChild);

  saveTodoTasks();
}

/* Add Task Listeners */
const todoAddForm = document.getElementById("todo-list-add-form");
todoAddForm.onsubmit = event => {
  event.preventDefault();
  const textElement = document.getElementById("todo-list-add-text");
  const todoAddText = textElement.value;
  textElement.value = "";
  createTask({ text: todoAddText, completed: false });
};
const todoAddIcon = document.getElementById("todo-list-add-icon");
todoAddIcon.onclick = () => {
  const textElement = document.getElementById("todo-list-add-text");
  const todoAddText = textElement.value;
  textElement.value = "";
  createTask({ text: todoAddText, completed: false });
};

function fetchTodoTasks() {
  /*
   * Fetch list of task objects from storage, clear tasks in current list,
   * then create task elements from each task objects and add them to the list.
   */

  chrome.storage.sync.get("todo_tasks", result => {
    clearAllTodoTasks();
    const tasks = result["todo_tasks"];
    // Reverse list first
    tasks.reverse();
    tasks.forEach(task => createTask(task));
  });
}

function clearAllTodoTasks() {
  const taskElements = document.getElementsByClassName("todo-list-task");
  for (let element of taskElements) {
    element.style.display = "none";
  }
}

function saveTodoTasks() {
  const taskElements = document.getElementsByClassName("todo-list-task");
  let tasks = [];
  for (let element of taskElements) {
    const isComplete = element.dataset.completed == "true";
    const isDisplayed = element.style.display != "none";
    const taskText = isComplete
      ? element.children[1].innerHTML
      : element.children[1].value;

    if (isDisplayed) {
      tasks.push({ text: taskText, completed: isComplete });
    }
  }
  chrome.storage.sync.set({ todo_tasks: tasks });
}

fetchTodoTasks();
