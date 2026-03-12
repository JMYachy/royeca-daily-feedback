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

  // If already logged in, skip login page
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const loggedInUser = localStorage.getItem("loggedInUser");

  console.log("LOGIN PAGE CHECK:", { isLoggedIn, loggedInUser });

  if (isLoggedIn === "true" && loggedInUser) {
    window.location.href = "/rate-stats/rate-statistics.html";
  }
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
    const { data: user, error } = await supabase
      .from("user_table")
      .select('User_ID, Username, password')
      .eq("Username", username)
      .maybeSingle();

    console.log("USER LOOKUP:", { user, error });

    if (error) {
      console.error("Supabase error:", error);
      showError("Database error.");
      btn.disabled = false;
      btn.textContent = "Login";
      return;
    }

    if (!user) {
      showError("Invalid username or password.");
      btn.disabled = false;
      btn.textContent = "Login";
      return;
    }

    if (user.password !== password) {
      showError("Invalid username or password.");
      btn.disabled = false;
      btn.textContent = "Login";
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", user.Username);
    localStorage.setItem("loggedInUserId", String(user.User_ID));

    console.log("STORED LOGIN VALUES:");
    console.log("isLoggedIn =", localStorage.getItem("isLoggedIn"));
    console.log("loggedInUser =", localStorage.getItem("loggedInUser"));
    console.log("loggedInUserId =", localStorage.getItem("loggedInUserId"));

    window.location.href = "/rate-stats/rate-statistics.html";

  } catch (err) {
    console.error("Unexpected login error:", err);
    showError("Something went wrong. Please try again.");
    btn.disabled = false;
    btn.textContent = "Login";
  }
}