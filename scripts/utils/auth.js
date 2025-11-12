export function getUserId() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    location.replace("/login.html");
  }

  return userId;
}
