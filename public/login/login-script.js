const SUPABASE_URL = "https://qjsvsfrqfnrwzdxtrebb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZzZnJxZm5yd3pkeHRyZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQ4MzgsImV4cCI6MjA4ODY2MDgzOH0.elMyC9DBlbqkMyojlus019irQwgHI4ma3IklyAOM1vg";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("loginForm").addEventListener("submit", handleLogin);

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

  document.getElementById("btn").insertAdjacentElement("afterend", err);
}

function clearError() {
  const existing = document.getElementById("loginError");
  if (existing) existing.remove();
}

async function handleLogin(e) {
  e.preventDefault();
  clearError();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.getElementById("btn");

  if (!username || !password) {
    showError("Please enter your username and password.");
    return;
  }

  btn.textContent = "Logging in...";
  btn.disabled = true;

  try {
    const { data, error } = await supabase
      .from("user_table")
      .select("*")
      .eq("Username", username)
      .eq("password", password)
      .maybeSingle();

    console.log("LOGIN RESULT:", data, error);

    if (error) {
      console.error("Supabase error:", error);
      showError("Login failed. Please try again.");
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

    // Save login session
    localStorage.setItem("loggedInUser", username);

    btn.textContent = "Redirecting...";

    console.log("Login successful. Redirecting...");

    // Redirect to homepage (public/index.html)
    window.location.replace("/");

  } catch (err) {
    console.error("Unexpected error:", err);
    showError("Something went wrong. Please try again.");
    btn.textContent = "Login";
    btn.disabled = false;
  }
}