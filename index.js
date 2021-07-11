import { createElement,sumActive,darkMode } from "./helpers.js";
import { renderTodo } from "./render.js";

const addBtn = document.getElementById("addBtn");
const textInput = document.getElementById("text");
const listEl = document.getElementById("list");

const activeItemsTotalEl = document.getElementById("activeItemsTotal");

const allBtn = document.getElementsByClassName("all");
const completedBtn = document.getElementsByClassName("completed");
const activeBtn = document.getElementsByClassName("active");
for (let i = 0; i < 2; i++) {
  allBtn[i].addEventListener("click", function () {
    filterState = "all"; //update state
    render(); //update ui
  });
  completedBtn[i].addEventListener("click", function () {
    filterState = "completed"; //update state
    render(); //update ui
  });
  activeBtn[i].addEventListener("click", function () {
    filterState = "active"; //update state
    render(); //update ui
  });
}
let clearCompletedBtn = document.querySelector("#clearCompleted");
clearCompletedBtn.addEventListener("click", function () {
  let flagCompleted = false;
  for (let i = 0; i < items.length; i++) {
    if (items[i].completed) {
      console.log("you delete index", i, items[i]);
      console.log("items after delete:", items);
      items.splice(i, 1);
      i--;
      flagCompleted = true;
    }
  }
  if (!flagCompleted) alert("no task completed");
  else {
    console.log(
      "the completed tasks have been deleted from local storage, the items are:",
      items
    );
    localStorage.setItem("items", JSON.stringify(items)); //Update Local Storage
  }
  render(); //update ui
});
/******************** end bottomMenu (EventListeners) *********************/

function fechData(url) {
  return new Promise(function (resolve, reject) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function onSuccess() {
      console.log("document.readyState:", document.readyState);
      if (this.readyState == 4) {
        const data = JSON.parse(xhttp.responseText);
        resolve(data);
        // reject(new Error('idan error'));
      }
    };
    try {
      xhttp.open("GET", url, true);
      xhttp.send(); // send http request (async action)
    } catch (err) {
      listEl.innerHTML = "<h3 style='color:red'>Error Data failed to load</h3>";
      reject(new Error("Error Data failed to load"));
    }
  });
}

// state
let defaultItems = [
  // { title: "Complete online javaScript course", completed: false },
  // { title: "Jog around the park 3x", completed: false },
  // { title: "10 minutes meditation", completed: false },
  // { title: "Read for 1 hour", completed: false },
  // { title: "Pick up groceries", completed: false },
  // { title: "Complete Todo App on Frontend Mentor", completed: false },
];


let localItems = JSON.parse(localStorage.getItem("items"));

// if(localItems){
//   items = localItems
// }else{
//   items = defaultItems
// }
let items = localItems == true ? localItems : defaultItems;

let filterState = "all"; // all, completed, active

/********** add new task **********/
addBtn.addEventListener("click", function () {
  // add to list
  const val = textInput.value;
  if ((val != "")&&(addBtn.checked)) {
    let num = defaultItems.length + 1;
    const new_task = {
      userId: Math.ceil((defaultItems.length + 1) / 20) /* number div 20 */,
      id: num,
      title: val,
      completed: false,
    };
    items.push(new_task); //update state
    render(); // update UI
    console.log("the new task save in local storage, the items are:", items);
    localStorage.setItem("items", JSON.stringify(items)); //Update Local Storage

    /*****add to server post XMLHttpRequest */
    fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify(new_task),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
    /***** end add to server post XMLHttpRequest */
  } else if (val == ""){
    alert("Error: your input is empty");
  } else if ((val != "")&&(!addBtn.checked)){
    alert("Error: the checkbox unchecked");
  } 
});
/**********end add new task **********/

init();

function init() {
  darkMode();
  const promise = fechData("https://jsonplaceholder.typicode.com/todos");

  promise.then(function (data) {
    console.log("data from server:", data);
    defaultItems = JSON.parse(JSON.stringify(data));
    items = defaultItems;
    console.log("in promise then items:", items);
    document.querySelector(".spinnerParent").style.display = "none";
    render();
  });
}

function deleteItem(item) {
  // delete from array
  const index = items.findIndex(function (i) {
    return i.title == item.title;
  });
  console.log("index to remove", index);
  items.splice(index, 1);
  render();

  /****delete from localStorage ******/
  localStorage.setItem("items", JSON.stringify(items)); //Update Local Storage

  /****delete from server ******/
  let url = `https://jsonplaceholder.typicode.com/posts/${item.id}`;
  console.log("the item in url:", url, "was deleted from server");
  fetch(url, {
    method: "DELETE",
  });
}

function filterItems(item) {
  switch (filterState) {
    case "all":
      return true;
    case "completed":
      return item.completed === true;
    case "active":
      return item.completed === false;
    default:
      return true;
  }
}

// UI

function render() {
  console.log("render", filterState);
  const filteredItems = items.filter(filterItems); //what to display in list
  const activeItemsNumber = items.reduce(sumActive, 0); //what to display in list

  console.log("filteredItems", filteredItems);
  renderList(filteredItems);
  activeItemsTotalEl.innerHTML = activeItemsNumber;
  // renderCards(items);
}

// const div = createElement({ root: app, className: "card", element: "div" });

function renderList(array) {
  listEl.innerHTML = ""; //clear
  array.forEach(function (item) {
    const li = renderTodo(item, {
      onRemove: function (item) {
        console.log("item:", item);
        deleteItem(item);
      },
    });
    li.addEventListener("click", function () {
      // toggleCompleted
      item.completed = !item.completed;
      render();
    });
    listEl.appendChild(li);
  });
}


