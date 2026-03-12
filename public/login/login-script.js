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
    margin-top:12px;
    padding:10px;
    border-radius:8px;
    background:#3b0000;
    color:#ff8080;
    text-align:center;
  `;

  const btn = document.getElementById("btn");
  btn.insertAdjacentElement("afterend", err);
}

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const btn = document.getElementById("btn");

  if (!username || !password) {
    showError("Please enter username and password.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Logging in...";

  try {

    /* STEP 1: find user by username */

    const { data: user, error } = await supabase
      .from("user_table")
      .select("User_ID, Username, password")
      .eq("Username", username)
      .maybeSingle();

    if (error) {
      console.error(error);
      showError("Database error.");
      btn.disabled = false;
      btn.textContent = "Login";
      return;
    }

    if (!user) {
      showError("User not found.");
      btn.disabled = false;
      btn.textContent = "Login";
      return;
    }

    /* STEP 2: check password */

    if (user.password !== password) {
      showError("Incorrect password.");
      btn.disabled = false;
      btn.textContent = "Login";
      return;
    }

    /* STEP 3: store session */

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", user.Username);
    localStorage.setItem("loggedInUserId", user.User_ID);

    console.log("Login successful:", user);

    /* STEP 4: redirect */

    window.location.href = "../rate-stats/rate-statistics.html";

  } catch (err) {
    console.error(err);
    showError("Unexpected error.");
    btn.disabled = false;
    btn.textContent = "Login";
  }
}