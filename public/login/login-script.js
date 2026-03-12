document.getElementById("loginForm").addEventListener("submit", handleLogin);

function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.getElementById("btn");

  if (!username || !password) return;

  btn.textContent = "Logging in...";
  btn.disabled = true;

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1200);
}