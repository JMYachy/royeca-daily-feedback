const SUPABASE_URL = "https://qjsvsfrqfnrwzdxtrebb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZzZnJxZm5yd3pkeHRyZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQ4MzgsImV4cCI6MjA4ODY2MDgzOH0.elMyC9DBlbqkMyojlus019irQwgHI4ma3IklyAOM1vg";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("loginForm").addEventListener("submit", handleLogin);

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("Username").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.getElementById("btn");

  btn.textContent = "Logging in...";
  btn.disabled = true;

  const { data, error } = await supabase
    .from("user_table")
    .select("*")
    .eq("Username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    alert("Invalid username or password");
    btn.textContent = "Login";
    btn.disabled = false;
    return;
  }

  // success
  window.location.href = "/index.html";
}