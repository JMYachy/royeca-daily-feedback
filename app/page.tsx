"use client"

import { useState } from "react"
import "./feedback.css"

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
]

export default function FeedbackPage() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [emojiScale, setEmojiScale] = useState(false)

  const currentRating = selectedRating ? ratingData[selectedRating - 1] : null

  const handleSelectRating = (val: number) => {
    setSelectedRating(val)
    setEmojiScale(true)
    setTimeout(() => setEmojiScale(false), 300)
  }

  const handleSubmit = () => {
    if (!selectedRating) return
    setSubmitted(true)
  }

  const handleReset = () => {
    setSelectedRating(null)
    setSubmitted(false)
  }

  const getSuccessContent = () => {
    if (!selectedRating) return { title: "", message: "" }
    if (selectedRating >= 8) {
      return {
        title: "Awesome! Thank you!",
        message: "We're thrilled you had a great experience!",
      }
    }
    if (selectedRating >= 5) {
      return {
        title: "Thanks for your feedback!",
        message: "We'll use your feedback to keep improving.",
      }
    }
    return {
      title: "We appreciate your honesty.",
      message: "We're sorry to hear that. We'll work hard to do better.",
    }
  }

  const successContent = getSuccessContent()

  return (
    <div className="feedback-page">
      <div className="bg-glow" />

      <nav className="feedback-nav">
        <div className="feedback-logo">
          DRJPRH<span> FEEDBACK</span>
        </div>
      </nav>

      <div className="feedback-container">
        <div className="client-hero">
          <div className="eyebrow">admin/employee</div>
          <h1>
            How are
            <br />
            you <em>today?</em>
          </h1>
          <p>Your honest feedback helps us grow. Tell us what you feel today.</p>
        </div>

        {/* Form */}
        {!submitted && (
          <div id="form-wrap">
            <div className="rating-card">
              <div className="emoji-row">
                <img 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DRJPRH-LOGO-whs9I1MJKYLMKZCI1yMREuDUe26vWX.jpg" 
                  alt="Dr. Jorge P. Royeca City Hospital Logo" 
                  className="side-logo"
                />
                <div className="emoji-display">
                  <span
                    className="emoji-face"
                    style={{
                      filter: currentRating ? `drop-shadow(0 0 24px ${currentRating.color}99)` : undefined,
                      transform: emojiScale ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    {currentRating?.emoji || "😶"}
                  </span>
                  <div
                    className="emoji-label"
                    style={{ color: currentRating?.color || "white" }}
                  >
                    {currentRating ? `${selectedRating} — ${currentRating.label}` : "Pick a number"}
                  </div>
                  <div className="emoji-sublabel">1 = Extremely Sad · 10 = Happiest</div>
                </div>
                <img 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LGU%20LOGO-SLbvY5LgCOBmUgP1StiZm35XGvZbO4.png" 
                  alt="City of General Santos Seal" 
                  className="side-logo"
                />
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: selectedRating ? `${(selectedRating / 10) * 100}%` : "0%" }}
                />
              </div>

              <div className="rating-buttons">
                {ratingData.map((r) => (
                  <button
                    key={r.val}
                    className={`rate-btn ${selectedRating === r.val ? "selected" : ""}`}
                    data-val={r.val}
                    title={r.label}
                    onClick={() => handleSelectRating(r.val)}
                  >
                    {r.val}
                  </button>
                ))}
              </div>

              <div className="scale-bar">
                <span>Extremely Sad</span>
                <span>Happiest Ever</span>
              </div>

              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!selectedRating}
                style={
                  currentRating
                    ? {
                        background: `linear-gradient(135deg, ${currentRating.color}, ${currentRating.color}bb)`,
                        color: selectedRating <= 3 || selectedRating === 10 ? "#fff" : "#000",
                      }
                    : undefined
                }
              >
                {selectedRating ? `Submit Rating: ${selectedRating}/10` : "Select a Rating to Continue"}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {submitted && (
          <div className="success-wrap visible">
            <div className="success-card">
              <span className="success-icon">{currentRating?.emoji}</span>
              <h3>{successContent.title}</h3>
              <p>{successContent.message}</p>
              <button className="try-again" onClick={handleReset}>
                Submit Another Rating
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
