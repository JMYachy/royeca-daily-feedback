document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (!form) {
    console.error("loginForm not found");
    return;
  }

  form.addEventListener("submit", handleLogin);
});

function showError(message) {
  const existing = document.getElementById("loginError");
  if (existing) existing.remove();

  const err = document.createElement("div");
  err.id = "loginError";
  err.textContent = message;
  err.style.cssText = `
    margin-top: 12px;
    padding: 10px 14px;
    background: rgba(220, 50, 50, 0.12);
    border: 1px solid rgba(220, 50, 50, 0.35);
    border-radius: 8px;
    font-size: 13px;
    color: #f87171;
    text-align: center;
  `;

  const btn = document.getElementById("btn");
  if (btn) btn.insertAdjacentElement("afterend", err);
}

function clearError() {
  const existing = document.getElementById("loginError");
  if (existing) existing.remove();
}

async function handleLogin(e) {
  e.preventDefault();
  clearError();

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const btn = document.getElementById("btn");

  if (!usernameInput || !passwordInput || !btn) {
    showError("Page setup error. Check your HTML IDs.");
    return;
  }

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showError("Please enter your username and password.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Logging in...";

  try {
    // Send login request to server-side API
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include", // Include cookies for session
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message || "Login failed. Please try again.");
      btn.disabled = false;
      btn.textContent = "Login";
      return;
    }

    // Successful login
    window.location.href = "/rate-stats/rate-statistics.html";

  } catch (err) {
    console.error("Login error:", err);
    showError("Something went wrong. Please try again.");
    btn.disabled = false;
    btn.textContent = "Login";
  }
}
