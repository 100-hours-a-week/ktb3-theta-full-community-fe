import { fetchHeader, getErrorMessageElement } from "../../utils/dom.js";
import { getUserId } from "../../utils/auth.js";
import { api } from "../../utils/api.js";

document.addEventListener("DOMContentLoaded", main);

function main() {
  fetchHeader();

  const form = document.querySelector('form[action="/articles"]');
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const imageInput = document.getElementById("image");
  const help = getErrorMessageElement(contentInput);

  form.addEventListener("submit", handleSubmit);
  titleInput?.addEventListener("blur", () => validateField(titleInput));
  contentInput?.addEventListener("blur", () => validateField(contentInput));
  // TODO : 이미지 처리 로직 추가

  function validateField(input) {
    help.style.display = "block";

    if (input === titleInput) {
      if (titleInput.value.trim().length <= 0) {
        help.textContent = "제목을 반드시 채워야 합니다.";
        return false;
      }
    }

    if (input === contentInput) {
      if (contentInput.value.trim().length <= 0) {
        help.textContent = "내용을 반드시 채워야 합니다.";
        return false;
      }
    }

    help.textContent = "";
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const userId = getUserId();

    if (!validateField(titleInput) || !validateField(contentInput)) {
      return;
    }

    const payload = {
      title: titleInput.value,
      content: contentInput.value,
    };

    try {
      await api.post("/articles", { params: { userId }, body: payload });
      location.href = "/index.html";
    } catch (err) {
      help.textContent = err.message || "네트워크 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.";
    }
  }
}
