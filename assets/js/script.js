/*This app is built with jquery.*/
/*We start by initializing tasks as a empty object.*/
let tasks = {};

/*createTask is a function with three parameters; taskText, taskDate, and taskList. We create the variables taskLi, taskSpan, and taskP
as elements li, span, and p, while also affecting them with methods like addClass(which adds a class to something) and text(which sets
the text content of the element called on to the argument provided). Continued...*/
let createTask = function(taskText, taskDate, taskList) {
  let taskLi = $("<li>").addClass("list-group-item");
  let taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  let taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);
  /*...Here, we then append taskSpan and taskP to taskLi, creating our task, and call the auditTask function with an argument of taskLi,
  which will check if the tasks date is past-due. Last, we affect the containing ul elements id through string-concat and append the
  taskLi onto what that id evaluates to(this affects where the task-card is displayed based on where the user drags it).*/
  taskLi.append(taskSpan, taskP);

  auditTask(taskLi);

  $("#list-" + taskList).append(taskLi);
};

/*loadTasks is a function which allows us to save our previously created, editted, or sorted tasks between sessions. We first set tasks
equal to the "tasks" item saved in localStorage, parsed into JSON format. We then enter an if statement that checks if tasks is falsey(if
it does NOT exist/nothing saved in localStorage) and if so we set tasks equal to and object containing four empty arrays; toDo,
inProgress, inReview, and done. Continued...*/
let loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  /*...Here, we call the .each method on our jquery object(the $ character), which will loop through the objects properties, then loop
  over the arr variable using a forEach loop. This will call the createTask function with appropriate arguments passed, for each item in
  the arr variable.*/
  $.each(tasks, function(list, arr) {
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

/*saveTasks is a function which very simply saves our task items by setting them as the entry "tasks" in localStorage and using the 
.stringify method on the tasks variable.*/
let saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

/*auditTask is a function with a single parameter, which checks if a task is close to its due date. We first define our date variable as
the date associated with a task element, using .find method to select the "span" containing our task, applying .text to give us the text
content of the task, and .trim to remove any potentially interfering whitespace at the beginning or end of the text content. Then, we
define our time variable as a call to moment- with the parameters of date(evaluates to a string) and "L"(denotes that the value should be
set to local formats), and use the .set method to provide the time we'd like the time variable to represent(set to the unit "hour", and
the value of 17, which evaluates to 5pm). Continued...*/
let auditTask = function(taskEl) {
  let date = $(taskEl)
    .find("span")
    .text()
    .trim();
  console.log(date);

  let time = moment(date, "L").set("hour", 17);
  console.log(time);

  /*...Here, we use the removeClass method on taskEl to remove old classes, then enter into an if statement which checks if our moment
  object is after the value which our time variable evaluates to, and if it is we add a class to taskEl which will indicate it is near or
  over its due date. Otherwise we enter an else if to check if the difference between our moment object and our time variable in the unit
  of "days" is less-than or equal to 2, and if so we add a class indicating that the task is near its over-due date.*/
  $(taskEl).removeClass("list-group-item-warning list-group-item-danger");

  if (moment().isAfter(time)) {
    $(taskEl).addClass("list-group-item-danger");
  }else if (Math.abs(moment().diff(time, "days")) <= 2) {
    $(taskEl).addClass("list-group-item-warning");
  }
};

/*Overall, this jquery call is affecting the ability to and details of dragging-dropping and sorting within the app:
Here we make a call to our jquery object, defining the elements we're looking for as having the classes ".card .list-group", and
calling the .sortable method on them. The .sortable method is a jquery ui method which allows for the reordering of elements in a list
or group using the mouse. We define its connectWith option as the same two classes, declaring that the items we're affecting should
connect to those classes. The scroll option is set to false, preventing automatic scolling when near edges. The tolerance option is set
to "pointer", which affects how items hover over eachother when being dragged. The helper option is set to "clone", which makes a copy of
the element being dragged and drags the copy(allows user to release dragged element wherever, and will return dragged element to starting
position if not released in applicable area). The activate event is passed an anonymous function which adds a class to the this object,
and adds a class to an element with a class of .bottom-trash, while the deactivate event recieves an anonymous function that does the
inverse; removes a class from the this object and from an element with a class of .bottom-trash. Continued...*/
$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event, ui) {
    $(this).addClass("dropover")
    $(".bottom-trash").addClass("bottom-trash-drag")
    console.log(ui);
  },
  deactivate: function(event, ui) {
    $(this).removeClass("dropover")
    $(".bottom-trash").removeClass("bottom-trash-drag")
    console.log(ui);
  },
  /*...Here, the over event is triggered when a sortable item is moved into a sortable list. It recieves an anonymous function that adds
  a class to the target of the event(in this app, this determines how the containing element will look when a user is drag-and-holding a
  task over a container), while the out event recieves an anonymous function that again does the inverse; removes a class from the target
  of the event(this will determine how a containing element will look when a user is drag-and-holding a task outside of a container).
  Continued...*/
  over: function(event) {
    $(event.target).addClass("dropover-active")
    console.log(event);
  },
  out: function(event) {
    $(event.target).removeClass("dropover-active")
    console.log(event);
  },
  /*...Here, the update event is triggered when the user stops sorting and DOM element positions have changed. It recieves an anonymous
  function which first initializes tempArr as an empty array, then calls to our jquery object pertaining to the this object(here that's
  the moved/sorted task item), append the .children method which will give us the children of the this object, and append the .each
  method which will perform a function for each element(in this case on each child element of the this object). The .each method accepts
  an anonymous function which uses .push to save an object to the tempArr variable. The object saved is comprised of two key:value pairs,
  with the key of text having a value which corresponds to the text content returned by the .text method, within any "p" elements 
  returned by the .find method, trimmed of any start-or-end whitespace using the .trim method- and the key of date having a value which
  corresponds to the text content returned by the .text method, within any "span" elements returned by the .find method, trimmed of any
  start-or-end whitespace using the .trim method. Continued...*/
  update: function() {
    let tempArr = [];

    $(this)
      .children()
      .each(function() {
        tempArr.push({
          text: $(this)
            .find("p")
            .text()
            .trim(),
          date: $(this)
            .find("span")
            .text()
            .trim()
        });
      });

    /*...Here, we define arrName as a call to our jquery object pertaining to the this object, returning the value belonging to "id" by
    using the .attr method, and using the .replace method to change instances with an id containing "list-" to an empty string. We then
    assign tasks at an index of arrName equal to the variable tempArr, and call the saveTasks function. Finally, the stop event is
    triggered when sorting has stopped. It is passed an anonymous function which removes a class on the this object.*/
    let arrName = $(this)
      .attr("id")
      .replace("list-", "");

    tasks[arrName] = tempArr;
    saveTasks();
  },
  stop: function(event) {
    $(this).removeClass("dropover");
  }
});

/*Overall, this jquery call determines when/how/if a dragged element is marked-for/within the deletion zone defined by the droppable
element:
Here we call to our jquery object any elements with an id of #trash, and append the droppable method which declares that other elements
may be dropped onto this one. We then define the accept option as elements containing a class of ".card .list-group-item" which will
allow those elements to be accepted by the droppable element, and define the tolerance method as "touch" which will accept a
dragged-item as dropped-onto the droppable element if any portion of them are overlapping. Then we use the drop event which triggers
when an acceptable dragged-item is dropped onto the droppable element. It takes an anonymous function which will remove the dragged
element from the DOM and remove the class ".bottom-trash-active" from anything matching the class ".bottom-trash"(this makes the trash
tab disappear after the user has dropped/stopped dragging a given element). The over event is triggered when a draggable element is
dropped onto a droppable element(different from the other over event defined previously). It accepts an anonymous function which will add
a class of ".bottom-trash-active" to any element with a class of ".bottom-trash". Then, the out event is triggered when a draggable is
taken out of the droppable elements area. It accepts an anonymous function which will remove the class ".bottom-trash-active" from any
element with a class of ".bottom-trash".*/
$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  drop: function(event, ui) {
    ui.draggable.remove();
    $(".bottom-trash").removeClass(".bottom-trash-active")
  },
  over: function(event, ui) {
    $(".bottom-trash").addClass(".bottom-trash-active")
    console.log(ui);
  },
  out: function(event, ui) {
    $(".bottom-trash").removeClass(".bottom-trash-active")
    console.log(ui);
  }
});

/*Here we call to our jquery object any elements with an id of #modalDueDate, appending the .datepicker method which will allow the user
to pick a date from the pop-up calendar for the associated element, and setting its minDate property to 1 which will force the user to
select a date 1 day from today.*/
$("#modalDueDate").datepicker({
  minDate: 1
});

/*Here we call to our jquery object any elements with an id of #task-form-modal, appending the .on method which will trigger an anonymous
function on the activation of the "show.bs.modal" event. The anonymous function will use the .val method to clear the values of elements
with the ids "modalTaskDescription, #modalDueDate".*/
$("#task-form-modal").on("show.bs.modal", function() {
  $("#modalTaskDescription, #modalDueDate").val("");
});

/*Here we call to our jquery object any elements with an id of #task-form-modal, appending the .on method which will trigger an anonymous
function on the activation of the "show.bs.modal" event. The anonymous function will use the .trigger method to activate any handlers
attached to the event-type of "focus"(this will highlight the textarea of the task when it is clicked).*/
$("#task-form-modal").on("shown.bs.modal", function() {
  $("#modalTaskDescription").trigger("focus");
});

/*Here we call to our jquery object any elements with either an id of #task-form-modal or a class of .btn-save, and append the .click
method which will activate the anonymous function upon a click event. The anonymous function first defines taskText as the value
associated with an element with an id of #modalTaskDescription, and defines taskDate as the value associated with an element with an id
of #modalDueDate. Continued...*/
$("#task-form-modal .btn-save").click(function() {
  let taskText = $("#modalTaskDescription").val();
  let taskDate = $("#modalDueDate").val();

/*...Here, we enter an if statement which checks if taskText and taskDate are truthy(if they exist), and if so we call the createTask
function with three arguments. Then we call to our jquery object any elements with the id of #task-form-modal, and call .modal with its
"hide" method to manually hide any open modals. Then we use the .push method on the toDo property of our tasks array to save an object
with a property of text as taskText, and a property of date as taskDate. Finally, we call the saveTasks function.*/
  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    $("#task-form-modal").modal("hide");

    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });
    saveTasks();
  };
});

/*Overall, this jquery call affects how the text-containing elements in a task are changed/managed:
Here we call to the jquery object any element which has a class of .list-group, and append the .on method which will call an anonymous
function on any "p" element upon a "click" event. The anonymous function first defines text by calling the .text method which will
return the text content of the this object(that would be the text associated with the "p" element), and defines textInput as a "textarea"
element with an added class of "form-control", and using the .val method to set the text value to the previous text contained in the "p"
element(this replaces the "p" element with a "textarea" element). Then we call the .trigger method on textInput to "focus" the now
rendered "textarea" element.*/
$(".list-group").on("click", "p", function() {
  let text = $(this)
    .text()
    .trim();

  let textInput = $("<textarea>").addClass("form-control").val(text);
  $(this).replaceWith(textInput);

  textInput.trigger("focus");
});

/*Here we call to the jquery object any element with a class of .list-group, and append the .on method which will call an anonymous
function on any "textarea" element upon a "blur" event. The anonymous function first defines text by calling the .val method on the this
object, which will give us the text content of the "textarea" element. The function also defines status as replacing the "list-" part of
the id attribute, of the element sharing the class ".list-group" closest to the this object, and defines index as a given element amongst
elements sharing the class ".list-group-item" closest to the this object(These allow us to get the status and position of the element,
thus the variable names status and index). Continued...*/
$(".list-group").on("blur", "textarea", function() {
  let text = $(this).val();

  let status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  let index = $(this)
    .closest(".list-group-item")
    .index();

  /*...Here, we assign the text property of tasks at an index of status, at an index of index, to the text variable. The saveTasks
  function is called after this(to save changes made to the text content of an element). Then, we define taskP as a "p" element, given
  a class of "m-1", with the text of the previous "textarea" element(whether changed or not). Finally, we use the .replaceWith method to
  replace any "textarea" elements referred to by the this object with our taskP variable.*/
  tasks[status][index].text = text;
  saveTasks();

  let taskP = $("<p>")
    .addClass("m-1")
    .text(text);

  $(this).replaceWith(taskP);
});

/*Here we call to the jquery object any elements with a class of .list-group, and append a .on method which will call an anonymous
function on any "span" elements upon a "click" event. The anonymous function first defines date as the text content of the this object,
trimmed of any starting or ending whitespace, and defines dateInput as an "input" element with the attributes of "type" and "text" as
well as a class of "form-control", and the value of the date variable(the previously associated date in the task). We then use the
.replaceWith method on our this object(which will create a new input element). Continued...*/
$(".list-group").on("click", "span", function() {
  let date = $(this)
    .text()
    .trim();

  let dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);
  $(this).replaceWith(dateInput);

  /*...Here, we call the .datepicker modal on dateInput, which will allow the user to select a new date in their task. The minDate
  property is set to 1, ensuring the user picks a date 1 day away from our current date. The onClose event is passed an anonymous
  function, which will trigger the anything attached to the this object on a "change" event. Finally, we append .trigger onto dateInput
  to activate its attached utilities on a "focus" event(this will trigger the calendar modal).*/
  dateInput.datepicker({
    minDate: 1,
    onClose: function() {
      $(this).trigger("change");
    }
  });

  dateInput.trigger("focus");
});

/*Here we call to our jquery object any element which matches the class .list-group, and append the .on method to call an anonymous
function on any elements matching the attribute "input[type='text']", on a "change" event. The anonymous function first defines date as
the value associated with the this object, defines status as replacing the "list-" part of the id attribute, of the element sharing the
class ".list-group" closest to the this object, and defines index as a given element amongst elements sharing the class
".list-group-item" closest to the this object(These allow us to get the status and position of the element, thus the variable names
status and index). Continued...*/
$(".list-group").on("change", "input[type='text']", function() {
  let date = $(this).val();

  let status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  let index = $(this)
    .closest(".list-group-item")
    .index();

  /*...Here, we assign the date property of tasks at an index of status, at an index of index, to our date variable. The saveTasks
  function is then called to ensure any changes are saved. Then, taskSpan is defined as a "span" element, given the classes "badge
  badge-primary badge-pill", with the text content of our date variable. Finally, we use the .replaceWith method on our this object to
  create a "span" element, and call the auditTask function with an argument of the first element within the taskSpan variable, matching
  the class ".list-group-item"(this ensures the editted tasks date is saved an displayed).*/
  tasks[status][index].date = date;
  saveTasks();

  let taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);
    $(this).replaceWith(taskSpan);
    auditTask($(taskSpan).closest(".list-group-item"));
});

/*Here we call to our jquery object any element matching an id of #remove-tasks, and append the .on method to call an anonymous
function on a "click" event. The anonymous function enters a for loop, checking for the key value in our tasks array, setting the length
property of tasks at an index of key to 0, and appending the .empty method onto any elements with an id of "#list-" + key(this removes
all saved tasks from the tasks array), and the saveTasks function is called to save all changes.*/
$("#remove-tasks").on("click", function() {
  for (let key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  };
  console.log(tasks);
  saveTasks();
});

/*Here we call the setInterval function with an anonymous functon as the first argument. The anonymous function selects elements with
the classes ".card .list-group-item" and appends a .each method to it, performing another anonymous function which calls the auditTask
function. Finally, the last argument of setInterval is set, (1000 * 60) * 30, which determines the interval at which setInterval calls
the auditTask function(roughly every 30 minutes, tasks will be checked to see if their date is within a certain threshold of the current
date).*/
setInterval(function(){
  $(".card .list-group-item").each(function(index, el){
    auditTask(el);
  });
}, (1000 * 60) * 30);

/*The loadTasks function is called here upon app loading. This ensures any saved tasks from a previous session are loaded.*/
loadTasks();