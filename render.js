import { createElement } from "./helpers.js";

function renderTodo(item, options = {}) {
  const li = document.createElement("li");
  // li.innerHTML = item.title;
  li.className = `flex-row ${item.completed ? "completed" : ""}`;

  /** create input checkbox**/
  createElement({
    element: "input",
    type: "checkbox",
    className: "circle",
    root: li,
  });
  createElement({
    element: "p",
    innerHTML: item.title,
    className: "task",
    root: li,
  });

  /** create button remove X **/
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "removeBtn";
  removeBtn.innerHTML = "&times;";
  removeBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    options.onRemove(item);
  });
  li.appendChild(removeBtn);
  return li;
}

export default renderTodo;