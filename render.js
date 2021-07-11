import { createElement } from "./helpers.js";

export function renderTodo(item, options = {}) {
  const li = document.createElement("li");
  // li.innerHTML = item.title;
  li.className = `list-item flex-row ${item.completed ? "completed" : ""}`;

  /** create input checkbox**/
  createElement({
    element: "input",
    type: "checkbox",
    className: "circle",
    root: li,
  });
  createElement({
    element: "span",
    innerHTML: item.title,
    className: "title",
    root: li,
  });

  /** create button remove X **/
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove";
  removeBtn.innerHTML = "&times;";
  removeBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    options.onRemove(item);
  });
  li.appendChild(removeBtn);
  return li;
}
