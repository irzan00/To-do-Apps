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
    console.log(todos);
});