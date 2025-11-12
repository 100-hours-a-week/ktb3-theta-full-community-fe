import { fetchHeader, getErrorMessageElement } from "../utils/dom.js";
import { getUserId } from "../utils/auth.js";
import { showToast } from "../components/toast.js";

document.addEventListener("DOMContentLoaded", main);

function main() {
  fetchHeader();

  const form = document.querySelector("form");
  const passwordInput = document.getElementById("password");
  const passwordConfirmInput = document.getElementById("confirm-password");
  const submitBtn = form.querySelector('button[type="submit"]');
  const userId = getUserId();

  form.addEventListener("submit", handleChangePassword);
  passwordInput?.addEventListener("blur", () => validateField(passwordInput));
  passwordConfirmInput?.addEventListener("blur", () => validateField(passwordConfirmInput));

  async function handleChangePassword(event) {
    event.preventDefault();

    if (!validateField(passwordInput) || !validateField(passwordConfirmInput)) {
      return;
    }

    submitBtn.disabled = true;

    try {
      const payload = { password: passwordInput.value };
      const res = await fetch(`http://localhost:8080/users/password?userId=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "비밀번호 변경에 실패했습니다.");
      }

      showToast("수정 완료");
    } catch (err) {
      const help = getErrorMessageElement(passwordConfirmInput);
      help.textContent = "네트워크 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.";
    } finally {
      submitBtn.disabled = false;
    }
  }

  function validateField(input) {
    const help = getErrorMessageElement(input);
    help.textContent = "";

    if (input === passwordInput) {
      const v = input.value;

      if (v.length === 0) {
        help.textContent = "비밀번호를 입력해주세요.";
        return false;
      }
      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/.test(v)) {
        help.textContent =
          "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        return false;
      }
    }

    if (input === passwordConfirmInput) {
      if (input.value.length <= 0) {
        help.textContent = "비밀번호를 한 번 더 입력해주세요.";
        return false;
      }
      if (input.value !== passwordInput.value) {
        help.textContent = "비밀번호가 다릅니다.";
        return false;
      }
    }

    return true;
  }
}
