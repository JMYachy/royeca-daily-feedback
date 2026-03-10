// DRJPRH Feedback Page Script

const supabaseUrl = "https://qjsvsfrqfnrwzdxtrebb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZzZnJxZm5yd3pkeHRyZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQ4MzgsImV4cCI6MjA4ODY2MDgzOH0.elMyC9DBlbqkMyojlus019irQwgHI4ma3IklyAOM1vg";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Rating data
const ratingData = [
  { val: 1, emoji: "\u{1F62D}", label: "Extremely Sad", color: "#740A03" },
  { val: 2, emoji: "\u{1F622}", label: "Very sad", color: "#C3110C" },
  { val: 3, emoji: "\u{1F61E}", label: "Sad", color: "#FF6500" },
  { val: 4, emoji: "\u{1F615}", label: "Slightly Sad", color: "#FA8112" },
  { val: 5, emoji: "\u{1F610}", label: "Neutral", color: "#FFC300" },
  { val: 6, emoji: "\u{1F642}", label: "A little Happy", color: "#FFD400" },
  { val: 7, emoji: "\u{1F60A}", label: "Happy", color: "#F3FF90" },
  { val: 8, emoji: "\u{1F601}", label: "Very Happy", color: "#9BEC00" },
  { val: 9, emoji: "\u{1F929}", label: "Extremely Happy", color: "#06D001" },
  { val: 10, emoji: "\u{1F973}", label: "Happiest Ever", color: "#059212" },
];

// State
let selectedRating = null;
let isSubmitting = false;

// DOM Elements
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

// Initialize rating buttons
function initRatingButtons() {
  ratingData.forEach((r) => {
    const btn = document.createElement("button");
    btn.className = "rate-btn";
    btn.dataset.val = r.val;
    btn.title = r.label;
    btn.textContent = r.val;
    btn.addEventListener("click", () => {
      // Prevent clicks while submitting
      if (isSubmitting) return;
      handleSelectRating(r.val);
    });
    ratingButtons.appendChild(btn);
  });
}

// Handle rating selection
function handleSelectRating(val) {
  // Remove selected class from all buttons
  document.querySelectorAll(".rate-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });

  // Add selected class to clicked button
  const selectedBtn = document.querySelector(`.rate-btn[data-val="${val}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add("selected");
  }

  selectedRating = val;
  const rating = ratingData[val - 1];

  // Update emoji display
  emojiFace.textContent = rating.emoji;
  emojiFace.style.filter = `drop-shadow(0 0 24px ${rating.color}99)`;
  emojiFace.classList.add("scale");
  setTimeout(() => emojiFace.classList.remove("scale"), 300);

  // Update label
  emojiLabel.textContent = `${val} — ${rating.label}`;
  emojiLabel.style.color = rating.color;

  // Update progress bar
  progressFill.style.width = `${(val / 10) * 100}%`;

  // Update submit button
  submitBtn.disabled = false;
  submitBtn.textContent = `Submit Rating: ${val}/10`;
  submitBtn.style.background = `linear-gradient(135deg, ${rating.color}, ${rating.color}bb)`;
  submitBtn.style.color = val <= 3 || val === 10 ? "#fff" : "#000";
}

// Handle form submission
async function handleSubmit() {
  if (!selectedRating || isSubmitting) return;

  // Set loading state — keeps buttons visible, just disables interaction
  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  try {
    const { error } = await supabase
      .from("table_reports")
      .insert([
        {
          branch_name: "DRJPRH",
          role: "admin/employee",
          rating: selectedRating,
          date: date,
          time: time,
        },
      ]);

    if (error) {
      console.error("Insert error:", error);
      // Restore UI so user can try again — rating selection stays intact
      isSubmitting = false;
      const rating = ratingData[selectedRating - 1];
      submitBtn.disabled = false;
      submitBtn.textContent = `Submit Rating: ${selectedRating}/10`;
      submitBtn.style.background = `linear-gradient(135deg, ${rating.color}, ${rating.color}bb)`;
      submitBtn.style.color = selectedRating <= 3 || selectedRating === 10 ? "#fff" : "#000";
      alert("Failed to submit. Please try again.");
      return;
    }

    // Success — show success screen
    const rating = ratingData[selectedRating - 1];
    let title, message;

    if (selectedRating >= 8) {
      title = "Awesome! Thank you!";
      message = "We're thrilled you had a great experience!";
    } else if (selectedRating >= 5) {
      title = "Thanks for your feedback!";
      message = "We'll use your feedback to keep improving.";
    } else {
      title = "We appreciate your honesty.";
      message = "We're sorry to hear that. We'll work hard to do better.";
    }

    successIcon.textContent = rating.emoji;
    successTitle.textContent = title;
    successMessage.textContent = message;

    formWrap.classList.add("show");
    successWrap.classList.add("show");

  } catch (err) {
    console.error("Unexpected error:", err);
    isSubmitting = false;
    const rating = ratingData[selectedRating - 1];
    submitBtn.disabled = false;
    submitBtn.textContent = `Submit Rating: ${selectedRating}/10`;
    submitBtn.style.background = `linear-gradient(135deg, ${rating.color}, ${rating.color}bb)`;
    submitBtn.style.color = selectedRating <= 3 || selectedRating === 10 ? "#fff" : "#000";
    alert("Something went wrong. Please try again.");
  }
}

// Handle reset
function handleReset() {
  window.location.href = "/index.html";
}

// Event listeners
submitBtn.addEventListener("click", handleSubmit);
tryAgainBtn.addEventListener("click", handleReset);

// Initialize
document.addEventListener("DOMContentLoaded", initRatingButtons);