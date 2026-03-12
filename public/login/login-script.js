const SUPABASE_URL = "https://qjsvsfrqfnrwzdxtrebb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZzZnJxZm5yd3pkeHRyZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQ4MzgsImV4cCI6MjA4ODY2MDgzOH0.elMyC9DBlbqkMyojlus019irQwgHI4ma3IklyAOM1vg";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

  btn.textContent = "Logging in...";
  btn.disabled = true;

  try {
    const { data, error } = await supabase
      .from("user_table")
      .select("User_ID, Username, password")
      .eq("Username", username)
      .eq("password", password)
      .maybeSingle();

    console.log("LOGIN RESULT:", { data, error });

    if (error) {
      console.error("Supabase error:", error);
      showError("Invalid username or password.");
      btn.textContent = "Login";
      btn.disabled = false;
      return;
    }

    if (!data) {
      showError("Invalid username or password.");
      btn.textContent = "Login";
      btn.disabled = false;
      return;
    }

    localStorage.setItem("loggedInUser", data.Username);
    localStorage.setItem("loggedInUserId", data.User_ID);
    localStorage.setItem("isLoggedIn", "true");

    console.log("loggedInUser =", localStorage.getItem("loggedInUser"));
    console.log("loggedInUserId =", localStorage.getItem("loggedInUserId"));
    console.log("isLoggedIn =", localStorage.getItem("isLoggedIn"));

    btn.textContent = "Redirecting...";

    setTimeout(() => {
      window.location.href = "../rate-stats/rate-statistics.html";
    }, 300);

  } catch (err) {
    console.error("Unexpected error:", err);
    showError("Something went wrong. Please try again.");
    btn.textContent = "Login";
    btn.disabled = false;
  }
}