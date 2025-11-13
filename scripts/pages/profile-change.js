import { fetchHeader, getErrorMessageElement } from "../utils/dom.js";
import { getUserId } from "../utils/auth.js";
import { showToast } from "../components/toast.js";
import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", main);

function main() {
  fetchHeader();

  const userId = getUserId();

  const form = document.querySelector(".account-edit-form");
  const nicknameInput = document.getElementById("nickname");
  const emailField = document.getElementById("email");
  const submitBtn = form.querySelector('button[type="submit"]');
  const avatarPicker = document.querySelector(".profile-image-picker");
  const profilePreviewImg = document.getElementById("profile-preview");
  const profileImageInput = document.getElementById("profile-image");

  let currentProfileImage = null;

  if (profileImageInput) {
    profileImageInput.disabled = true;
  }

  nicknameInput?.addEventListener("blur", validateNickname);
  form.addEventListener("submit", handleSubmit);
  avatarPicker?.addEventListener("click", handleAvatarClick);

  loadUserProfile();

  async function loadUserProfile() {
    if (!emailField || !nicknameInput) return;

    emailField.textContent = "로딩 중...";
    nicknameInput.disabled = true;
    submitBtn.disabled = true;

    try {
      const data = await api.get("/users", { params: { userId } });
      if (!data?.result) {
        throw new Error("회원 정보를 불러오지 못했습니다.");
      }

      const user = data.result;
      emailField.textContent = user.email || "-";
      nicknameInput.value = user.nickname || "";
      setProfileImage(user.profile_image ?? user.profileImage ?? null);
    } catch (err) {
      emailField.textContent = "회원 정보를 불러오지 못했습니다.";
    } finally {
      nicknameInput.disabled = false;
      submitBtn.disabled = false;
    }
  }

  function setProfileImage(imageUrl) {
    currentProfileImage = imageUrl || null;

    if (!profilePreviewImg || !avatarPicker) return;

    if (currentProfileImage) {
      profilePreviewImg.src = currentProfileImage;
      avatarPicker.classList.add("has-image");
    } else {
      profilePreviewImg.removeAttribute("src");
      avatarPicker.classList.remove("has-image");
    }
  }

  function handleAvatarClick(event) {
    event.preventDefault();

    // TODO: 이미지 처리
  }

  function validateNickname() {
    if (!nicknameInput) return false;

    const help = getErrorMessageElement(nicknameInput);
    help.style.display = "none";
    help.textContent = "";

    const value = nicknameInput.value.trim();

    if (value.length === 0) {
      help.textContent = "닉네임을 입력해주세요.";
    } else if (/\s/.test(value)) {
      help.textContent = "띄어쓰기를 없애주세요.";
    } else if (value.length > 10) {
      help.textContent = "닉네임은 최대 10자까지 작성 가능합니다.";
    }

    if (help.textContent) {
      help.style.display = "block";
      return false;
    }

    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateNickname()) return;

    submitBtn.disabled = true;

    const payload = {
      nickname: nicknameInput.value.trim(),
      profile_image: currentProfileImage,
    };

    try {
      await api.patch("/users", { params: { userId }, body: payload });

      if (currentProfileImage) {
        localStorage.setItem("userProfileImage", currentProfileImage);
      } else {
        localStorage.removeItem("userProfileImage");
      }

      showToast("수정완료");
    } catch (err) {
      const help = getErrorMessageElement(nicknameInput);
      const message = err.body?.message || err.message || "네트워크 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.";
      help.textContent = message;
      help.style.display = "block";
    } finally {
      submitBtn.disabled = false;
    }
  }
}
