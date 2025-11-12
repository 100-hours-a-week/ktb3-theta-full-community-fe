import { fetchHeader, getErrorMessageElement } from "../../utils/dom.js";
import { getUserId } from "../../utils/auth.js";

document.addEventListener("DOMContentLoaded", main);

function main() {
  fetchHeader();

  const form = document.querySelector('form[action="/articles"]');
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const help = getErrorMessageElement(contentInput);

  form.addEventListener("submit", handleSubmit);
  titleInput?.addEventListener("blur", () => validateField(titleInput));
  contentInput?.addEventListener("blur", () => validateField(contentInput));

  function validateField(input) {
    help.style.display = "block";

    if (input === titleInput) {
      if (titleInput.value.trim().length <= 0) {
        help.textContent = "제목을 반드시 채워야 합니다.";
        return false;
      }
      help.textContent = "";
      return true;
    }

    if (input === contentInput) {
      if (contentInput.value.trim().length <= 0) {
        help.textContent = "내용을 반드시 채워야 합니다.";
        return false;
      }
      help.textContent = "";
      return true;
    }

    help.textContent = "";
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateField(titleInput) || !validateField(contentInput)) {
      return;
    }

    const userId = getUserId();

    const payload = {
      title: titleInput.value,
      content: contentInput.value,
    };

    try {
      const res = await fetch(`http://localhost:8080/articles?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw Error(data?.message || "게시글 작성에 실패했습니다.");
      }

      location.href = "/index.html";
    } catch (err) {
      help.textContent = "네트워크 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.";
    }
  }
}
