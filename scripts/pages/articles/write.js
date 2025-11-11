import { getErrorMessageElement } from "../../utils/dom.js";

fetch("../scripts/components/header.html")
  .then((res) => res.text())
  .then((html) => (document.getElementById("header").innerHTML = html));

const form = document.querySelector('form[action="/articles"]');
const titleInput = form?.querySelector("#title");
const contentInput = form?.querySelector("#content");
const help = getErrorMessageElement(contentInput);

function validateField(input) {
  help.style.display = "block";

  if (input === titleInput) {
    if (titleInput.value.trim().length <= 0) {
      help.textContent = "제목을 반드시 채워야 합니다.";
    }
    return false;
  }
  if (input === contentInput && contentInput.value.trim().length <= 0) {
    help.textContent = "내용을 반드시 채워야 합니다.";
    return false;
  }
  help.textContent = "";
}

async function writeArticle(e) {
  e.preventDefault();

  const payload = {
    title: titleInput.value,
    content: contentInput.value,
  };

  const userId = localStorage.getItem("userId");
  if (userId == null) {
    location.href = "/index.html";
  }

  try {
    const res = await fetch(`http://localhost:8080/articles?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      help.textContent = res.json().result.message;
      return;
    }

    location.href = "/index.html";
  } catch (err) {
    help.textContent = err.message;
  }
}

form.addEventListener("submit", writeArticle);
titleInput.addEventListener("blur", () => validateField(titleInput));
contentInput.addEventListener("blur", () => validateField(contentInput));
