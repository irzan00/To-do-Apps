const todos = [];
const RENDER_EVENT = 'render-todo';

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('form');
    document.addEventListener('submit', function(event){
        event.preventDefault();
        addTodo();
    });
});

function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timeStamp = document.getElementById('date').value;

    const generateID = generateId();
    const toDoObject = generateToDoObject(generateID, textTodo, timeStamp, false);
    todos.push(toDoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));    
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

function addTaskToCompleted(toDoId) {
    const toDoTarget = findTodo(toDoId);

    if(toDoTarget == null) return;

    toDoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function findTodo(todoId) {
    for(const todoItem of todos) {
        if(todoItem.id == todoId) {
            return todoItem;
        };
    };
    return null;
};

function removeTaskFromCompleted(toDoId) {
    const toDoTarget = findTodoIndex(toDoId);

    if(toDoTarget == -1) return;

    todos.splice(toDoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function undoTaskFromCompleted(toDoId) {
    const toDoTarget = findTodo(toDoId);

    if(toDoTarget == null) return;

    toDoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodoIndex(toDoId) {
    for(const index of todos) {
        if(todos[index].id == toDoId) {
            return index;
        }
    }

    return -1;
};