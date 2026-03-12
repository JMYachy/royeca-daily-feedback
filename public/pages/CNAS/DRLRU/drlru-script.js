// =============================
// SUPABASE CONNECTION
// =============================
const SUPABASE_URL = "https://qjsvsfrqfnrwzdxtrebb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZzZnJxZm5yd3pkeHRyZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQ4MzgsImV4cCI6MjA4ODY2MDgzOH0.elMyC9DBlbqkMyojlus019irQwgHI4ma3IklyAOM1vg";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// =============================
// Rating Data
// =============================
const ratingData = [
  { val: 1, emoji: "😭", label: "Extremely Sad", color: "#740A03" },
  { val: 2, emoji: "😢", label: "Very sad", color: "#C3110C" },
  { val: 3, emoji: "😞", label: "Sad", color: "#FF6500" },
  { val: 4, emoji: "😕", label: "Slightly Sad", color: "#FA8112" },
  { val: 5, emoji: "😐", label: "Neutral", color: "#FFC300" },
  { val: 6, emoji: "🙂", label: "A little Happy", color: "#FFD400" },
  { val: 7, emoji: "😊", label: "Happy", color: "#F3FF90" },
  { val: 8, emoji: "😁", label: "Very Happy", color: "#9BEC00" },
  { val: 9, emoji: "🤩", label: "Extremely Happy", color: "#06D001" },
  { val: 10, emoji: "🥳", label: "Happiest Ever", color: "#059212" },
];

// =============================
// Run after page loads
// =============================
document.addEventListener("DOMContentLoaded", () => {

  let selectedRating = null;

  const formWrap = document.getElementById("form-wrap");
  const successWrap = document.getElementById("success-wrap");
  const emojiFace = document.getElementById("emoji-face");
  const emojiLabel = document.getElementById("emoji-label");
  const progressFill = document.getElementById("progress-fill");
  const ratingButtons = document.getElementById("rating-buttons");
  const submitBtn = document.getElementById("submit-btn");
  const successIcon = document.getElementById("success-icon");
  const successTitle = document.getElementById("success-title");
  const successMessage = document.getElementById("success-message");
  const tryAgainBtn = document.getElementById("try-again");

  // =============================
  // CREATE RATING BUTTONS
  // =============================
  function initRatingButtons() {

    ratingData.forEach((r) => {

      const btn = document.createElement("button");

      btn.className = "rate-btn";
      btn.dataset.val = r.val;
      btn.title = r.label;
      btn.textContent = r.val;

      btn.addEventListener("click", () => handleSelectRating(r.val));

      ratingButtons.appendChild(btn);

    });

  }

  // =============================
  // HANDLE RATING SELECT
  // =============================
  function handleSelectRating(val) {

    document.querySelectorAll(".rate-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });

    const selectedBtn = document.querySelector(`.rate-btn[data-val="${val}"]`);

    if (selectedBtn) {
      selectedBtn.classList.add("selected");
    }

    selectedRating = val;

    const rating = ratingData[val - 1];

    emojiFace.textContent = rating.emoji;
    emojiFace.style.filter = `drop-shadow(0 0 24px ${rating.color}99)`;

    emojiLabel.textContent = `${val} — ${rating.label}`;
    emojiLabel.style.color = rating.color;

    progressFill.style.width = `${(val / 10) * 100}%`;

    submitBtn.disabled = false;
    submitBtn.textContent = `Submit Rating: ${val}/10`;

    submitBtn.style.background =
      `linear-gradient(135deg, ${rating.color}, ${rating.color}bb)`;

    submitBtn.style.color = val <= 4 ? "#fff" : "#000";

  }

  // =============================
  // SUBMIT FEEDBACK
  // =============================
  async function handleSubmit() {

    if (!selectedRating) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {

      const { data, error } = await supabaseClient
        .from("table_reports")
        .insert([
          {
            branch_name: "DRLRU",
            role: "DRLRU/Employee", rating: selectedRating,
            created_at: new Date().toLocaleString()
          }
        ])
        .select();

      if (error) throw error;

      const rating = ratingData[selectedRating - 1];

      let title, message;

      if (selectedRating >= 8) {

        title = "Awesome! Thank you!";
        message = "We're thrilled you had a great experience!";

      }
      else if (selectedRating >= 5) {

        title = "Thanks for your feedback!";
        message = "We'll use your feedback to keep improving.";

      }
      else {

        title = "We appreciate your honesty.";
        message = "We're sorry to hear that. We'll work hard to do better.";

      }

      successIcon.textContent = rating.emoji;
      successTitle.textContent = title;
      successMessage.textContent = message;

      formWrap.classList.add("hidden");
      successWrap.classList.add("visible");

    } catch (err) {

      console.error("Supabase error:", err);

      alert("Failed to save feedback.");

      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Again";

    }

  }

  // =============================
  // RESET FORM
  // =============================
  function handleReset() {
    window.location.href = "/index.html"

  }

  // =============================
  // EVENTS
  // =============================
  submitBtn.addEventListener("click", handleSubmit);
  tryAgainBtn.addEventListener("click", handleReset);

  initRatingButtons();

});