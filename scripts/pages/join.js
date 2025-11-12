import { fetchHeader, getErrorMessageElement } from "../utils/dom.js";

document.addEventListener("DOMContentLoaded", main);

function main() {
  fetchHeader();

  const form = document.querySelector('form[action="/join"]');
  const profileImageInput = document.getElementById("profile-image");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordConfirmInput = document.getElementById("confirm-password");
  const nicknameInput = document.getElementById("nickname");
  const submitBtn = form?.querySelector('button[type="submit"]');

  function validateField(input) {
    showErrorMessageElement(input, "").style.display = "none";

    if (input === emailInput) {
      const v = input.value;

      if (v.length <= 0) {
        showErrorMessageElement(input, "이메일을 입력해주세요.");
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        showErrorMessageElement(input, "올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)");
        return false;
      }
    }

    if (input === passwordInput) {
      const v = input.value;
      if (v.length === 0) {
        showErrorMessageElement(input, "비밀번호를 입력해주세요.");
        return false;
      }
      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/.test(v)) {
        showErrorMessageElement(
          passwordInput,
          "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다."
        );
        return false;
      }
    }

    if (input === passwordConfirmInput) {
      if (input.value != passwordInput.value) {
        showErrorMessageElement(input, "비밀번호가 다릅니다.");
        return false;
      }
    }

    if (input === nicknameInput) {
      const v = input.value;

      if (v.length <= 0) {
        showErrorMessageElement(input, "닉네임을 입력해주세요.");
        return false;
      }

      if (v.includes(" ")) {
        showErrorMessageElement(input, "띄어쓰기를 없애주세요.");
        return false;
      }

      if (v.length > 10) {
        showErrorMessageElement(input, "닉네임은 최대 10자까지 작성 가능합니다.");
        return false;
      }
    }

    return true;
  }

  async function join(e) {
    e.preventDefault();

    if (
      !(
        validateField(emailInput) &&
        validateField(passwordInput) &&
        validateField(passwordConfirmInput) &&
        validateField(nicknameInput)
      )
    ) {
      return;
    }

    submitBtn.style.backgroundColor = "#7F6AEE";
    submitBtn.disabled = true;

    const payload = {
      email: emailInput.value.trim(),
      password: passwordInput.value,
      nickname: nicknameInput.value,
    };

    try {
      const res = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.message.includes("email_already_exists")) {
          const help = getErrorMessageElement(emailInput);
          help.textContent = "중복된 이메일 입니다.";
          help.style.display = "block";
        } else if (data.message.includes("nickname_already_exists")) {
          const help = getErrorMessageElement(nicknameInput);
          help.textContent = "중복된 닉네임 입니다.";
          help.style.display = "block";
        } else {
          throw new Error(data?.message || "회원 가입에 실패하였습니다.");
        }

        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = "";
        return;
      }

      location.href = "/login.html";
    } catch (err) {
      showErrorMessageElement(nicknameInput, "네트워크 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  form.addEventListener("submit", join);
  emailInput.addEventListener("blur", () => validateField(emailInput));
  passwordInput.addEventListener("blur", () => validateField(passwordInput));
  passwordConfirmInput.addEventListener("blur", () => validateField(passwordConfirmInput));
  nicknameInput.addEventListener("blur", () => validateField(nicknameInput));
}

function showErrorMessageElement(input, message) {
  let el = getErrorMessageElement(input);
  el.textContent = message;
  el.style.display = "block";
  return el;
}
