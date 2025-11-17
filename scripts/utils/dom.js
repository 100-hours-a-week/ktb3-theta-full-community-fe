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

export function fetchHeader() {
  const headerRoot = document.getElementById("header");
  if (!headerRoot) return Promise.reject();

  return fetch("/scripts/components/header.html")
    .then((res) => {
      if (!res.ok) throw new Error("헤더 로딩에 실패했습니다.");
      return res.text();
    })
    .then((html) => {
      headerRoot.innerHTML = html;
      initializeHeader();
    })
    .catch((err) => {
      console.error(err);
    });
}

export function fetchFooter() {
  const footerRoot = document.getElementById("footer");
  if (!footerRoot) return Promise.reject();

  return fetch("/scripts/components/footer.html")
    .then((res) => {
      if (!res.ok) throw new Error("푸터 로딩에 실패했습니다.");
      return res.text();
    })
    .then((html) => {
      footerRoot.innerHTML = html;
    })
    .catch((err) => {
      console.error(err);
    });
}

function initializeHeader() {}
