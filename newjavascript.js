var tasks = [];
var draft = [];

loadLastTask ();
loadDraft();
setInputDate();
enableTaskRemove();

document.querySelector('form').addEventListener('submit', function(event) { // for adding new tasks to task board and save tham in localStorage when submiting 
    event.preventDefault();
    var form = document.querySelector('form');
    var newTask = form.querySelector('textarea').value;
    newTask.replace(/\n\r?/g, '<br />');
    var taskDoDate = form.querySelector('input[type="date"]').value;
    var taskTime = form.querySelector('input[type="time"]').value;
    if (localStorage.getItem('tasks') !== null){
        tasks = JSON.parse(localStorage.getItem('tasks')); 
    }
    tasks.unshift({
        newTask: newTask,
        taskDoDate: taskDoDate,
        taskTime: taskTime
    });	
    addNewTask(tasks);
    var jsonTasks = JSON.stringify(tasks);
    localStorage.setItem("tasks", jsonTasks);
    checkValuesValidation();
    clearDraft();
    setNewForm(form);
    fadeInNewNote();
    enableTaskRemove();
    return false;
});

function addNewTask(arr) { // for adding new tasks to the task board
    var note_container = document.querySelector('.note_container');
    var pin = document.createElement('div');
    pin.classList.add('pin');
    var button = document.createElement('button');
    button.classList.add('trash_icon');
    var note = document.createElement('div');
    note.classList.add('note');
    note.classList.add('fade-out');
    var noteContent = document.createElement('div');
    noteContent.classList.add('noteContent');
    var task = document.createElement('span');
    task.classList.add('task');
    task.textContent = arr[0].newTask;
    noteContent.appendChild(task);
    var date = document.createElement('span');
    date.classList.add('date');
    date.textContent = arr[0].taskDoDate;
    noteContent.appendChild(date);
    var time = document.createElement('span');
    time.classList.add('time');
    time.textContent = arr[0].taskTime;
    noteContent.appendChild(time);
    note.appendChild(pin);
    note.appendChild(button);
    note.appendChild(noteContent);
    note_container.appendChild(note);
    note_container.insertBefore(note, note_container.childNodes[0]);
}

function addLastTasks(arr) { // for loading last tasks to the task board
    var note_container = document.querySelector('.note_container');
    for (var i = 0; i < arr.length; i++) {
        var pin = document.createElement('div');
        pin.classList.add('pin');
        var button = document.createElement('button');
        button.classList.add('trash_icon');
        var note = document.createElement('div');
        note.classList.add('note');
        var noteContent = document.createElement('div');
        noteContent.classList.add('noteContent');
        var task = document.createElement('span');
        task.classList.add('task');
        task.textContent = arr[i].newTask;
        noteContent.appendChild(task);
        var date = document.createElement('span');
        date.classList.add('date');
        date.textContent = arr[i].taskDoDate;
        noteContent.appendChild(date);
        var time = document.createElement('span');
        time.classList.add('time');
        time.textContent = arr[i].taskTime;
        noteContent.appendChild(time);
        note.appendChild(pin);
        note.appendChild(button);
        note.appendChild(noteContent);
        note_container.appendChild(note);
    }
} 

function loadLastTask (){ // for loading last tasks from localStorage only if existent
    if (localStorage.getItem("tasks") !== null) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        addLastTasks(tasks);
    }
}

document.querySelector('form').addEventListener('input', function(event) { // for saving unsent values in draft
    var form = document.querySelector('form');
    var newTaskDraft = form.querySelector('textarea').value;
    var taskDoDateDraft = form.querySelector('input[type="date"]').value;
    var taskTimeDraft = form.querySelector('input[type="time"]').value;
    draft[0] = {
        newTaskDraft: newTaskDraft,
        taskDoDateDraft: taskDoDateDraft,
        taskTimeDraft: taskTimeDraft
    };	
    var jsondraft = JSON.stringify(draft);
    localStorage.setItem("draft", jsondraft);	
})

function loadDraft() { // for loading last draft only if existent when form loaded
    var form = document.querySelector('form');
    if (localStorage.getItem("draft") !== null) {
        var draft = JSON.parse(localStorage.getItem("draft"));
        form.querySelector('textarea').value = draft[0].newTaskDraft;
        form.querySelector('input[type="date"]').value = draft[0].taskDoDateDraft;
        form.querySelector('input[type="time"]').value = draft[0].taskTimeDraft;
    }
}

function setInputDate() { // for setting todays real date in task date input
    var day = new Date(),
        d = day.getDate(),
        m = day.getMonth() + 1,
        y = day.getFullYear(),
        data;
    if (d < 10) {
        d = "0" + d;
    };
    if (m < 10) {
        m = "0" + m;
    };
    data = y + "-" + m + "-" + d;
    if (localStorage.getItem('draft') == null){
        document.querySelector('input[type="date"]').value = data;
    }
}

function setNewForm(form) { //for reset form after note submited
    form.querySelector('textarea').value = "";
    setInputDate();
    form.querySelector('input[type="time"]').value = "";
}

function clearDraft() { //for clearing draft after note submited
    localStorage.removeItem('draft');
}

function fadeInNewNote() { // for fading in new note after loaded
    setTimeout(function(){
        document.querySelector('.note.fade-out').classList.remove('fade-out');
     }, 0100);
}

function fadeOutDeletedNote() { // for removing note from DOM after faded out
    setTimeout(function(){
        document.querySelector('.note.fade-out').remove('.note.fade-out');
     }, 1500);
}

function enableTaskRemove() { // for enabling all buttons to delete notes
    var icon = document.querySelectorAll('.trash_icon');
    for (var i = 0; i < icon.length; i++) {
        icon[i].addEventListener('click',redirect,false);
    }
}    

function redirect(event) { // for deleting notes from localStorage and from screen and calling fade out function
    var note = event.target.parentNode;
    var nodeList = Array.prototype.slice.call(note.parentNode.children);
    var noteIndex = nodeList.indexOf(note);
    var tasks = JSON.parse(localStorage.getItem('tasks'));
    for (var i = 0; i < tasks.length; i++) {
        if (i == noteIndex) {
            tasks.splice(i, 1);
            var jsonTasks = JSON.stringify(tasks);
            localStorage.setItem("tasks", jsonTasks);
            event.target.parentNode.classList.add('fade-out');
            fadeOutDeletedNote();
        }
    }
}

function checkValuesValidation() {
    var regexp = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/);
    if (!document.querySelector('input[type="date"]').value.match(regexp)) {
        console.log("invalid date value");
    } else {
        var regexp = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);
        if (!document.querySelector('input[type="time"]').value.match(regexp)) {
            console.log("invalid time value");
        } else {
            console.log('values are valid :)');
        }
    }
}  