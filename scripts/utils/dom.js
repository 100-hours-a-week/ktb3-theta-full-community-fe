export function fetchHeader() {
  fetch("/scripts/components/header.html")
    .then((res) => res.text())
    .then((html) => (document.getElementById("header").innerHTML = html));
}

export function getErrorMessageElement(input) {
  let el = input.nextElementSibling;
  if (!el || !el.classList.contains("field-error-message")) {
    el = document.createElement("small");
    el.className = "field-error-message";
    el.style.display = "none";
    input.insertAdjacentElement("afterend", el);
  }
  return el;
}
