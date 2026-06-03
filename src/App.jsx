import { useState, useCallback } from "react";

/* ─── Global Styles ─── */

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    min-height: 100vh;
    background: #0c0c14;
  }

  body {
    color: #f0ece4;
    font-family: 'Nunito', sans-serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .screen {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.25rem;
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .screen.entering { opacity: 0; transform: translateY(24px); }
  .screen.visible  { opacity: 1; transform: translateY(0); }
  .screen.leaving  { opacity: 0; transform: translateY(-24px); }

  .display-font { font-family: 'Cormorant Garamond', serif; }

  .btn {
    font-family: 'Nunito', sans-serif;
    background: transparent;
    border: 1.5px solid #c9a87c;
    color: #c9a87c;
    padding: 0.75rem 2.25rem;
    border-radius: 999px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 0.02em;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .btn:hover {
    background: #c9a87c;
    color: #0c0c14;
    box-shadow: 0 0 24px rgba(201, 168, 124, 0.25);
  }
  .btn:active { transform: scale(0.97); }

  /* ─ Card Flip ─ */
  .flip-card {
    perspective: 800px;
    width: 200px;
    height: 280px;
    cursor: pointer;
    flex-shrink: 0;
  }
  @media (max-width: 640px) {
    .flip-card { width: 160px; height: 230px; }
  }
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  .flip-card-inner.flipped { transform: rotateY(180deg); }

  .flip-card-front,
  .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
  }
  .flip-card-front {
    background: linear-gradient(145deg, #1a1a2e 0%, #16162a 100%);
    border: 1px solid rgba(201, 168, 124, 0.15);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .flip-card-back {
    background: linear-gradient(145deg, #1f1a14 0%, #1a1520 100%);
    border: 1px solid rgba(201, 168, 124, 0.3);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    transform: rotateY(180deg);
  }
  .flip-card.dimmed {
    opacity: 0.3;
    pointer-events: none;
    filter: grayscale(0.6);
    transition: all 0.5s ease;
  }
  .flip-card.selected .flip-card-front,
  .flip-card.selected .flip-card-back {
    border-color: #c9a87c;
    box-shadow: 0 0 30px rgba(201, 168, 124, 0.2);
  }

  /* ─ End Screen ─ */
  .choice-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    background: linear-gradient(145deg, #1f1a14 0%, #1a1520 100%);
    border: 1px solid rgba(201, 168, 124, 0.3);
    border-radius: 14px;
    padding: 1rem 1.75rem;
    margin-bottom: 2rem;
  }

  .slot-card {
    background: linear-gradient(145deg, #1a1a2e 0%, #16162a 100%);
    border: 1px solid rgba(201, 168, 124, 0.12);
    border-radius: 14px;
    padding: 1.25rem 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    width: 100%;
    max-width: 300px;
  }
  .slot-card:hover {
    border-color: rgba(201, 168, 124, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
  .slot-card.selected {
    border-color: #c9a87c;
    background: linear-gradient(145deg, #1f1a14 0%, #1a1520 100%);
    box-shadow: 0 0 24px rgba(201, 168, 124, 0.15);
  }

  /* ─ Sparkles ─ */
  .sparkle {
    position: fixed;
    width: 3px;
    height: 3px;
    background: #c9a87c;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    animation: sparkle-float 3s ease-in-out infinite;
  }
  @keyframes sparkle-float {
    0%   { opacity: 0; transform: translateY(0) scale(0); }
    20%  { opacity: 0.6; transform: translateY(-20px) scale(1); }
    100% { opacity: 0; transform: translateY(-80px) scale(0); }
  }

  .pulse-soft { animation: pulse-soft 2.5s ease-in-out infinite; }
  @keyframes pulse-soft {
    0%, 100% { opacity: 0.7; }
    50%      { opacity: 1; }
  }
`;

/* ─── SVG Animals ─── */

function DuckSVG() {
  return (
    <svg viewBox="0 0 120 120" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="78" rx="36" ry="28" fill="#F2C94C" />
      <ellipse cx="45" cy="74" rx="16" ry="12" fill="#E5B83A" transform="rotate(-10 45 74)" />
      <circle cx="82" cy="44" r="18" fill="#F2C94C" />
      <circle cx="88" cy="40" r="3" fill="#1a1a2e" />
      <circle cx="89" cy="39" r="1" fill="white" />
      <ellipse cx="102" cy="48" rx="10" ry="5" fill="#E57C23" />
      <path d="M72 58 Q78 50 76 44" stroke="#F2C94C" strokeWidth="14" fill="none" strokeLinecap="round" />
      <circle cx="85" cy="48" r="4" fill="#E5A83A" opacity="0.5" />
      <path d="M45 104 L38 114 L52 114 Z" fill="#E57C23" />
      <path d="M65 104 L58 114 L72 114 Z" fill="#E57C23" />
    </svg>
  );
}

function ElephantSVG() {
  return (
    <svg viewBox="0 0 120 120" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="72" rx="34" ry="30" fill="#8B9EB7" />
      <circle cx="60" cy="42" r="24" fill="#9AAFC4" />
      <ellipse cx="32" cy="38" rx="16" ry="20" fill="#7B8FA7" />
      <ellipse cx="34" cy="38" rx="10" ry="14" fill="#A8B8C8" opacity="0.5" />
      <ellipse cx="88" cy="38" rx="16" ry="20" fill="#7B8FA7" />
      <ellipse cx="86" cy="38" rx="10" ry="14" fill="#A8B8C8" opacity="0.5" />
      <circle cx="50" cy="38" r="4" fill="#1a1a2e" />
      <circle cx="51" cy="37" r="1.5" fill="white" />
      <circle cx="70" cy="38" r="4" fill="#1a1a2e" />
      <circle cx="71" cy="37" r="1.5" fill="white" />
      <path d="M60 52 Q60 70 50 80 Q45 85 48 88" stroke="#8B9EB7" strokeWidth="8" fill="none" strokeLinecap="round" />
      <circle cx="46" cy="46" r="5" fill="#B5A0B8" opacity="0.35" />
      <circle cx="74" cy="46" r="5" fill="#B5A0B8" opacity="0.35" />
      <rect x="38" y="92" width="12" height="18" rx="6" fill="#7B8FA7" />
      <rect x="68" y="92" width="12" height="18" rx="6" fill="#7B8FA7" />
      <ellipse cx="44" cy="110" rx="5" ry="2" fill="#6B7F97" />
      <ellipse cx="74" cy="110" rx="5" ry="2" fill="#6B7F97" />
      <path d="M94 72 Q100 68 98 60" stroke="#7B8FA7" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function BearSVG() {
  return (
    <svg viewBox="0 0 120 120" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="80" rx="32" ry="28" fill="#A67C52" />
      <ellipse cx="60" cy="84" rx="18" ry="16" fill="#C4956A" opacity="0.5" />
      <circle cx="60" cy="42" r="26" fill="#B8895C" />
      <circle cx="38" cy="22" r="10" fill="#A67C52" />
      <circle cx="38" cy="22" r="6" fill="#C4956A" />
      <circle cx="82" cy="22" r="10" fill="#A67C52" />
      <circle cx="82" cy="22" r="6" fill="#C4956A" />
      <ellipse cx="60" cy="50" rx="12" ry="9" fill="#C4956A" />
      <ellipse cx="60" cy="46" rx="5" ry="3.5" fill="#4A3520" />
      <ellipse cx="59" cy="45" rx="2" ry="1" fill="#6B5040" opacity="0.5" />
      <path d="M56 50 Q60 54 64 50" stroke="#4A3520" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="38" r="4" fill="#2C1810" />
      <circle cx="51" cy="37" r="1.5" fill="white" />
      <circle cx="70" cy="38" r="4" fill="#2C1810" />
      <circle cx="71" cy="37" r="1.5" fill="white" />
      <ellipse cx="36" cy="100" rx="10" ry="8" fill="#A67C52" />
      <ellipse cx="84" cy="100" rx="10" ry="8" fill="#A67C52" />
      <circle cx="34" cy="100" r="3" fill="#8B6340" opacity="0.4" />
      <circle cx="38" cy="98" r="2" fill="#8B6340" opacity="0.4" />
      <circle cx="82" cy="100" r="3" fill="#8B6340" opacity="0.4" />
      <circle cx="86" cy="98" r="2" fill="#8B6340" opacity="0.4" />
      <circle cx="44" cy="48" r="5" fill="#D4A07A" opacity="0.35" />
      <circle cx="76" cy="48" r="5" fill="#D4A07A" opacity="0.35" />
    </svg>
  );
}

/* ─── Data ─── */

const CARDS = [
  { Animal: DuckSVG, label: "Китайско и кино", emoji: "🥡🎬" },
  { Animal: ElephantSVG, label: "Хепи и аркадна зала", emoji: "🍔🕹️" },
  { Animal: BearSVG, label: "Пица и коктейли", emoji: "🍕🍸" },
];

// TODO: Replace with your Formspree form ID
// Sign up free at formspree.io → create a form → paste the ID here
const FORMSPREE_ID = "xvznpojb";

const TIME_SLOTS = [
  { day: "Четвъртък", date: "04.06", time: "20:00" },
  { day: "Петък", date: "05.06", time: "20:00" },
  { day: "Неделя", date: "07.06", time: "20:00" },
];

/* ─── Sparkle Background ─── */

function Sparkles() {
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${8 + ((i * 37 + 13) % 84)}%`,
    top: `${10 + ((i * 53 + 7) % 80)}%`,
    delay: `${(i * 0.7) % 4}s`,
    size: 2 + ((i * 1.3) % 3),
  }));

  return (
    <>
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="sparkle"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            width: s.size,
            height: s.size,
          }}
        />
      ))}
    </>
  );
}

/* ─── App ─── */

export default function App() {
  const [screen, setScreen] = useState("portal");
  const [animState, setAnimState] = useState("visible");
  const [flippedCard, setFlippedCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const transitionTo = useCallback((next) => {
    setAnimState("leaving");
    setTimeout(() => {
      setScreen(next);
      setAnimState("entering");
      setTimeout(() => setAnimState("visible"), 50);
    }, 500);
  }, []);

  const handleCardClick = (index) => {
    if (flippedCard === index) {
      setFlippedCard(null);
      setSelectedCard(null);
    } else {
      setFlippedCard(index);
      setSelectedCard(index);
    }
  };

  const handleConfirm = async () => {
    if (selectedCard === null || selectedSlot === null || submitting) return;
    setSubmitting(true);
    const card = CARDS[selectedCard];
    const slot = TIME_SLOTS[selectedSlot];
    try {
      await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: `Мирела избра: ${card.emoji} ${card.label} — ${slot.day} ${slot.date}, ${slot.time}`,
          choice: `${card.emoji} ${card.label}`,
          timeslot: `${slot.day} ${slot.date} — ${slot.time}`,
          timestamp: new Date().toLocaleString("bg-BG"),
        }),
      });
    } catch {
      // Still show success — she shouldn't see an error
    }
    setSubmitting(false);
    setConfirmed(true);
  };

  return (
    <>
      <style>{STYLES}</style>
      <Sparkles />

      <div className={`screen ${animState}`}>

        {/* ── Portal ── */}
        {screen === "portal" && (
          <div style={{ textAlign: "center" }}>
            <h1
              className="display-font"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                fontWeight: 600,
                color: "#f0ece4",
                marginBottom: "2.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              Здравей <span style={{ color: "#c9a87c" }}>:)</span>
            </h1>
            <button className="btn" onClick={() => transitionTo("message")}>
              Здрасти?
            </button>
          </div>
        )}

        {/* ── Message ── */}
        {screen === "message" && (
          <div style={{ textAlign: "center", maxWidth: 520, padding: "0 1rem" }}>
            <h2
              className="display-font"
              style={{
                fontSize: "clamp(2rem, 5.5vw, 3rem)",
                fontWeight: 600,
                color: "#f0ece4",
                marginBottom: "1.5rem",
              }}
            >
              Мирела
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "rgba(240, 236, 228, 0.72)",
                marginBottom: "1rem",
              }}
            >
              Вече се извиних, но знам, че делата са по-важни и въпреки склонноста си да говоря глупости идвам с добри намерения. Надявам се да намериш сили в сърцето си да ми простиш, но най-вече се чудя дали ще ми позволиш да се реванширам?
            </p>
            <p
              className="display-font"
              style={{
                fontSize: "1.2rem",
                color: "rgba(240, 236, 228, 0.72)",
                marginBottom: "2.5rem",
                fontStyle: "italic",
              }}
            >
              — Ради
            </p>
            <button className="btn" onClick={() => transitionTo("cards")}>
              Как?
            </button>
          </div>
        )}

        {/* ── Cards ── */}
        {screen === "cards" && (
          <div style={{ textAlign: "center", maxWidth: 700 }}>
            <p
              className="display-font"
              style={{
                fontSize: "clamp(1.15rem, 3.5vw, 1.5rem)",
                color: "rgba(240, 236, 228, 0.8)",
                marginBottom: "1rem",
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              Зад всяка от тези животинки се крие занимание.
            </p>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(240, 236, 228, 0.65)",
                marginBottom: "2.5rem",
                lineHeight: 1.7,
              }}
            >
              Натисни някоя от тях за да я разкриеш. Ако не ти хареса — просто натисни друга.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1.25rem",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "2.5rem",
              }}
            >
              {CARDS.map((card, i) => {
                const isFlipped = flippedCard === i;
                return (
                  <div
                    key={i}
                    className={`flip-card${isFlipped ? " selected" : ""}`}
                    onClick={() => handleCardClick(i)}
                  >
                    <div className={`flip-card-inner${isFlipped ? " flipped" : ""}`}>
                      <div className="flip-card-front">
                        <card.Animal />
                        <p
                          className="pulse-soft"
                          style={{
                            marginTop: "1rem",
                            fontSize: "0.9rem",
                            color: "rgba(201, 168, 124, 0.8)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Натисни Ме
                        </p>
                      </div>
                      <div className="flip-card-back">
                        <span style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                          {card.emoji}
                        </span>
                        <p
                          className="display-font"
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: 600,
                            color: "#c9a87c",
                            lineHeight: 1.5,
                          }}
                        >
                          {card.label}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="btn"
              style={{
                animation: selectedCard !== null ? "pulse-soft 2s ease-in-out infinite" : "none",
                opacity: selectedCard !== null ? 1 : 0,
                pointerEvents: selectedCard !== null ? "auto" : "none",
                transition: "opacity 0.4s ease",
              }}
              onClick={() => transitionTo("timeslots")}
            >
              Продължи →
            </button>
          </div>
        )}

        {/* ── Timeslots ── */}
        {screen === "timeslots" && selectedCard !== null && (
          <div style={{ textAlign: "center", maxWidth: 420 }}>
            <div className="choice-badge" style={{ marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "1.5rem" }}>{CARDS[selectedCard].emoji}</span>
              <span
                className="display-font"
                style={{ fontSize: "1.1rem", fontWeight: 600, color: "#c9a87c" }}
              >
                {CARDS[selectedCard].label}
              </span>
            </div>

            <p
              className="display-font"
              style={{
                fontSize: "1.2rem",
                color: "rgba(240, 236, 228, 0.75)",
                marginBottom: "0.75rem",
                fontStyle: "italic",
              }}
            >
              Кога ти е удобно?
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                color: "rgba(240, 236, 228, 0.6)",
                marginBottom: "1.75rem",
              }}
            >
              Не забравяй да попиташ за специалните ни предложения.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              {TIME_SLOTS.map((slot, i) => (
                <div
                  key={i}
                  className={`slot-card${selectedSlot === i ? " selected" : ""}`}
                  onClick={() => setSelectedSlot(i)}
                >
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: selectedSlot === i ? "#c9a87c" : "#f0ece4",
                    }}
                  >
                    {slot.day} {slot.date}
                  </p>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "rgba(240, 236, 228, 0.6)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {slot.time}
                  </p>
                </div>
              ))}
            </div>

            <button
              className="btn"
              style={{
                opacity: selectedSlot !== null ? 1 : 0,
                pointerEvents: selectedSlot !== null ? "auto" : "none",
                transition: "opacity 0.4s ease",
              }}
              onClick={() => transitionTo("end")}
            >
              Продължи →
            </button>

            <p
              onClick={() => { setSelectedSlot(null); transitionTo("cards"); }}
              style={{
                marginTop: "1.5rem",
                fontSize: "0.95rem",
                color: "rgba(201, 168, 124, 0.7)",
                cursor: "pointer",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => e.target.style.color = "rgba(201, 168, 124, 1)"}
              onMouseLeave={(e) => e.target.style.color = "rgba(201, 168, 124, 0.7)"}
            >
              ← Назад
            </p>
          </div>
        )}

        {/* ── End Screen ── */}
        {screen === "end" && selectedCard !== null && !confirmed && (
          <div style={{ textAlign: "center", maxWidth: 440 }}>
            <div className="choice-badge">
              <span style={{ fontSize: "1.5rem" }}>{CARDS[selectedCard].emoji}</span>
              <span
                className="display-font"
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "#c9a87c",
                }}
              >
                {CARDS[selectedCard].label}
              </span>
            </div>

            {selectedSlot !== null && (
              <p style={{
                fontSize: "1rem",
                color: "rgba(240, 236, 228, 0.7)",
                marginBottom: "1.5rem",
              }}>
                {TIME_SLOTS[selectedSlot].day} {TIME_SLOTS[selectedSlot].date} — {TIME_SLOTS[selectedSlot].time}
              </p>
            )}

            <p
              style={{
                fontSize: "1.05rem",
                color: "rgba(240, 236, 228, 0.65)",
                lineHeight: 1.8,
                marginBottom: "2rem",
                maxWidth: 340,
              }}
            >
              Просто натисни бутона за потвърждение и ще се свържа с теб.
            </p>

            <button
              className="btn"
              onClick={handleConfirm}
              disabled={submitting}
              style={{
                opacity: submitting ? 0.6 : 1,
                pointerEvents: submitting ? "none" : "auto",
              }}
            >
              {submitting ? "Изпращане..." : "Потвърди ✓"}
            </button>

            <p
              onClick={() => transitionTo("timeslots")}
              style={{
                marginTop: "1.5rem",
                fontSize: "0.95rem",
                color: "rgba(201, 168, 124, 0.7)",
                cursor: "pointer",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => e.target.style.color = "rgba(201, 168, 124, 1)"}
              onMouseLeave={(e) => e.target.style.color = "rgba(201, 168, 124, 0.7)"}
            >
              ← Назад
            </p>
          </div>
        )}

        {/* ── Success ── */}
        {screen === "end" && confirmed && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>💛</p>
            <h2
              className="display-font"
              style={{
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                fontWeight: 600,
                color: "#f0ece4",
                marginBottom: "1rem",
              }}
            >
              Готово!
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(240, 236, 228, 0.7)",
                fontStyle: "italic",
                lineHeight: 1.7,
              }}
            >
              Ще се свържа с теб възможно най-бързо! 🐻
            </p>
          </div>
        )}
      </div>

    </>
  );
}
