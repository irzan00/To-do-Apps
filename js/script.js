const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
    }

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('form');
    document.addEventListener('submit', function(event){
        event.preventDefault();
        addTodo();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
      }
});

function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timeStamp = document.getElementById('date').value;

    const generateID = generateId();
    const toDoObject = generateToDoObject(generateID, textTodo, timeStamp, false);
    todos.push(toDoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));    
    saveData();
};

function generateId() {
    return +new Date();
};

function generateToDoObject(id, task, timestamp, isCompleted) {
    return {
        id,
        task,
        timestamp,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function(){
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';
 
    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if(!todoItem.isCompleted) {
            uncompletedTODOList.append(todoElement);
        } else {
            completedTODOList.append(todoElement);
        }
  }
});

function makeTodo(toDoObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = toDoObject.task;

    const textTimeStamp = document.createElement('p');
    textTimeStamp.innerText = toDoObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimeStamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${toDoObject.id}`);

    if (toDoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
     
        undoButton.addEventListener('click', function () {
          undoTaskFromCompleted(toDoObject.id);
        });
     
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
     
        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(toDoObject.id);
        });
     
        container.append(undoButton, trashButton);
      } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        
        checkButton.addEventListener('click', function () {
          addTaskToCompleted(toDoObject.id);
        });
        
        container.append(checkButton);
      }

    return container;
};

function addTaskToCompleted(todoId) {
    const toDoTarget = findTodo(todoId);

    if(toDoTarget == null) return;

    toDoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function findTodo(todoId) {
    for(const todoItem of todos) {
        if(todoItem.id == todoId) {
            return todoItem;
        };
    };
    return null;
};

function removeTaskFromCompleted(todoId) {
    const toDoTarget = findTodoIndex(todoId);

    if(toDoTarget === -1) return;

    todos.splice(toDoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function undoTaskFromCompleted(todoId) {
    const toDoTarget = findTodo(todoId);

    if(toDoTarget == null) return;

    toDoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTodoIndex(todoId) {
    for(const index in todos) {
        if(todos[index].id == todoId) {
            return index;
        }
    }

    return -1;
};

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const todo of data) {
        todos.push(todo);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
  });