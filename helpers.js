export function createElement(options) {
  const element = document.createElement(options.element);
  element.className = options.className ? options.className : "";
  element.innerHTML = options.innerHTML ? options.innerHTML : "";
  element.type = options.type ? options.type : "";
  options.root.appendChild(element);
  return element;
}

export function sumActive(total, todo) {
    if (!todo.completed) {
      return total + 1;
    }
    return total;
}

export function darkMode() {
  //the function change html.className when user click on toggleLighting button
  let btn = document.querySelector(".toggleBtnLighting");
  const html = document.querySelector("html");
  btn.addEventListener("click", function () {
    if (html.className == "light-mode") html.className = "dark-mode";
    else html.className = "light-mode";
  });
}
