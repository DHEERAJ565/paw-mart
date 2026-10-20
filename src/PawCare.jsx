import { useCallback, useEffect, useMemo, useState } from "react";
import "./PawCare.css";

const API_BASE = "http://localhost:5000/api";

const initialTasks = [
  {
    id: 1,
    title: "Review your pet's health records",
    pet: "",
    date: "Today",
    category: "Health",
    done: false,
  },
];

const navItems = [
  { id: "overview", icon: "◫", label: "Overview" },
  { id: "pets", icon: "♧", label: "My pets" },
  { id: "health", icon: "♡", label: "Health records" },
  { id: "planner", icon: "▦", label: "Care planner" },
  { id: "assistant", icon: "✳", label: "PawCare AI" },
];

function Icon({ children, className = "" }) {
  return (
    <span className={`paw-icon ${className}`} aria-hidden="true">
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="paw-section-heading">
      <div>
        <div className="paw-eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getLatestWeight(healthRecord) {
  if (!healthRecord?.weightHistory?.length) {
    return null;
  }

  const records = [...healthRecord.weightHistory].sort(
    (a, b) =>
      new Date(b.recordedAt || 0) - new Date(a.recordedAt || 0)
  );

  return records[0];
}

function getPetAge(pet) {
  return pet.healthRecord?.age || "Age not recorded";
}

function getPetWeight(pet) {
  if (!pet || !pet.healthRecord) {
    return 0;
  }

  const weightHistory = pet.healthRecord.weightHistory || [];

  if (weightHistory.length === 0) {
    return 0;
  }

  const latestWeight = weightHistory[weightHistory.length - 1];

  return latestWeight?.weightKg ?? 0;
}

function PetCard({ pet, active, onClick }) {
  const weight = getPetWeight(pet);

  return (
    <button
      type="button"
      className={`paw-pet-card ${active ? "is-active" : ""}`}
      onClick={onClick}
    >
      <div className="paw-pet-photo-wrap">
        <img
          src={
            pet.dogImage ||
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=85"
          }
          alt={pet.dogName}
          className="paw-pet-photo"
        />

        <span className="paw-pet-status">
          <span /> Delivered
        </span>
      </div>

      <div className="paw-pet-card-content">
        <div>
          <h3>{pet.dogName}</h3>
          <p>{pet.breed}</p>
        </div>

        <span className="paw-pet-arrow">↗</span>
      </div>

      <div className="paw-pet-card-bottom">
        <span>{getPetAge(pet)}</span>
        <span>{weight === null ? "Weight unavailable" : `${weight} kg`}</span>
      </div>
    </button>
  );
}

function WeightChart({ pet }) {
  const records = useMemo(() => {
    const history = pet?.healthRecord?.weightHistory || [];

    return [...history]
      .filter(
        (item) =>
          Number.isFinite(Number(item.weightKg)) &&
          Number(item.weightKg) > 0
      )
      .sort(
        (a, b) =>
          new Date(a.recordedAt || 0) - new Date(b.recordedAt || 0)
      )
      .slice(-6);
  }, [pet]);

  const points = useMemo(() => {
    if (!records.length) return [];

    const values = records.map((item) => Number(item.weightKg));
    const min = Math.min(...values) - 1;
    const max = Math.max(...values) + 1;

    return values.map((value, index) => ({
      x: records.length === 1 ? 190 : 15 + index * (350 / (records.length - 1)),
      y: 120 - ((value - min) / (max - min)) * 85,
      value,
      date: records[index].recordedAt,
    }));
  }, [records]);

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");

  const area = points.length
    ? `15,130 ${line} 365,130`
    : "";

  const latestWeight = getLatestWeight(pet?.healthRecord);

  return (
    <div className="paw-chart">
      <div className="paw-chart-summary">
        <div>
          <span className="paw-muted">Latest recorded weight</span>

          <div className="paw-chart-weight">
            {latestWeight ? Number(latestWeight.weightKg) : "—"}
            <small> kg</small>
          </div>
        </div>

        <div className="paw-chart-trend">
          <span>♡</span> Recorded data
        </div>
      </div>

      {points.length > 0 ? (
        <>
          <svg
            className="paw-chart-svg"
            viewBox="0 0 380 150"
            role="img"
            aria-label={`Recorded weight history for ${pet.dogName}`}
          >
            <defs>
              <linearGradient
                id={`paw-area-${pet.bookingId}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#77ad82" stopOpacity=".35" />
                <stop offset="100%" stopColor="#77ad82" stopOpacity=".015" />
              </linearGradient>
            </defs>

            {[35, 65, 95, 125].map((y) => (
              <line
                key={y}
                x1="10"
                y1={y}
                x2="370"
                y2={y}
                stroke="#e7ede5"
                strokeDasharray="4 5"
              />
            ))}

            {points.length > 1 && (
              <>
                <polygon
                  points={area}
                  fill={`url(#paw-area-${pet.bookingId})`}
                />

                <polyline
                  points={line}
                  fill="none"
                  stroke="#39764c"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4.5"
                fill="#ffffff"
                stroke="#39764c"
                strokeWidth="2.5"
              >
                <title>
                  {point.value} kg — {formatDate(point.date)}
                </title>
              </circle>
            ))}
          </svg>

          <div className="paw-chart-labels">
            {records.map((record, index) => (
              <span key={`${record._id || index}`}>
                {new Date(record.recordedAt).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            ))}
          </div>
        </>
      ) : (
        <div className="paw-empty-message">
          No weight history has been recorded yet.
        </div>
      )}

      <p className="paw-chart-note">
        This chart displays recorded measurements. Ask your veterinarian
        what weight range is appropriate for your pet.
      </p>
    </div>
  );
}

export default function PawCare() {
  const [pets, setPets] = useState([]);
  const [activePetId, setActivePetId] = useState(null);
  const [activeNav, setActiveNav] = useState("overview");
  const [tasks, setTasks] = useState(initialTasks);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);

  const [assistantInput, setAssistantInput] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hi! 🐾 I'm PawCare AI. I can help you organize pet-care information and prepare questions for your veterinarian. What would you like to know?",
    },
  ]);

  const activePet = useMemo(
    () =>
      pets.find(
        (pet) => String(pet.bookingId) === String(activePetId)
      ) || pets[0] || null,
    [pets, activePetId]
  );

  const completedTasks = tasks.filter((task) => task.done).length;

  const showNotice = useCallback((message) => {
    setNotice(message);

    window.setTimeout(() => {
      setNotice("");
    }, 3500);
  }, []);

  const loadPets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/pet-health/mine`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            (response.status === 401
              ? "Please log in to view your PawCare dashboard."
              : "Unable to load your pets.")
        );
      }

      const loadedPets = Array.isArray(data.pets) ? data.pets : [];

      setPets(loadedPets);

      setActivePetId((currentId) => {
        const currentStillExists = loadedPets.some(
          (pet) => String(pet.bookingId) === String(currentId)
        );

        return currentStillExists
          ? currentId
          : loadedPets[0]?.bookingId || null;
      });
    } catch (err) {
      console.error("PawCare load error:", err);
      setError(err.message || "Unable to connect to PawMart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  async function refreshHealthRecord(bookingId) {
    const response = await fetch(
      `${API_BASE}/pet-health/${bookingId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Unable to refresh health records.");
    }

    setPets((current) =>
      current.map((pet) =>
        String(pet.bookingId) === String(bookingId)
          ? {
              ...pet,
              healthRecord: data.healthRecord,
            }
          : pet
      )
    );
  }

  async function saveHealthUpdate(event) {
    event.preventDefault();

    if (!activePet) return;

    const form = new FormData(event.currentTarget);

    const generalNotes = String(form.get("generalNotes") || "").trim();
    const knownConditions = String(
      form.get("knownConditions") || ""
    ).trim();
    const knownAllergies = String(
      form.get("knownAllergies") || ""
    ).trim();

    const weightValue = String(form.get("weightKg") || "").trim();
    const weightKg = weightValue ? Number(weightValue) : null;

    if (
      weightValue &&
      (!Number.isFinite(weightKg) || weightKg <= 0 || weightKg > 300)
    ) {
      showNotice("Please enter a valid weight in kilograms.");
      return;
    }

    const body = {
      generalNotes,
      knownConditions,
      knownAllergies,
    };

    if (weightKg !== null) {
      body.newWeightRecords = [
        {
          weightKg,
          recordedAt: new Date().toISOString(),
          notes: "Recorded by the pet owner.",
        },
      ];
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_BASE}/pet-health/${activePet.bookingId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to save health information.");
      }

      setPets((current) =>
        current.map((pet) =>
          String(pet.bookingId) === String(activePet.bookingId)
            ? {
                ...pet,
                healthRecord: data.healthRecord,
              }
            : pet
        )
      );

      setShowHealthForm(false);
      showNotice("Health information saved successfully.");
    } catch (err) {
      console.error("PawCare save error:", err);
      showNotice(err.message || "Unable to save health information.");
    } finally {
      setSaving(false);
    }
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function addTask(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const title = String(form.get("title") || "").trim();
    const date = String(form.get("date") || "");

    if (!title || !date) {
      showNotice("Please enter a task and date.");
      return;
    }

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title,
        date,
        pet: activePet?.dogName || "My pet",
        category: "Care task",
        done: false,
      },
    ]);

    setShowTaskForm(false);
    showNotice("Task added for this session.");
  }

  function sendAssistantMessage(event) {
    event.preventDefault();

    const question = assistantInput.trim();

    if (!question) return;

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: question,
      },
      {
        role: "assistant",
        text:
          "I can help you organize this question for your veterinarian. Record when the concern started, changes in eating or drinking, behavior, and other observations. This is a frontend demo, not a medical diagnosis. If your pet has difficulty breathing, collapses, has seizures, or may have swallowed something toxic, seek urgent veterinary care.",
      },
    ]);

    setAssistantInput("");
  }

  const pageTitles = {
    overview: [
      "Your pet's world",
      "A healthier, happier life starts here.",
    ],
    pets: [
      "Your companions",
      "Every little detail about your best friends.",
    ],
    health: [
      "Health records",
      "Keep important wellness information organized.",
    ],
    planner: [
      "Your care planner",
      "Little habits make a big difference.",
    ],
    assistant: [
      "Meet PawCare AI",
      "Your pet-care organizer, always ready to help.",
    ],
  };

  if (loading) {
    return (
      <div className="paw-app">
        <div className="paw-empty-state">
          <h2>Loading your PawCare dashboard...</h2>
          <p>Connecting to your pet health records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="paw-app">
      <aside className="paw-sidebar">
        <a href="/" className="paw-brand">
          <span className="paw-brand-symbol">p</span>
          <span>
            PawMart
            <small>PAWCARE STUDIO</small>
          </span>
        </a>

        <div className="paw-side-label">WORKSPACE</div>

        <nav className="paw-navigation" aria-label="PawCare navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`paw-nav-item ${
                activeNav === item.id ? "active" : ""
              }`}
              onClick={() => setActiveNav(item.id)}
            >
              <Icon>{item.icon}</Icon>
              <span>{item.label}</span>

              {item.id === "assistant" && (
                <span className="paw-nav-new">AI</span>
              )}
            </button>
          ))}
        </nav>

        <div className="paw-sidebar-spacer" />

        <div className="paw-sidebar-tip">
          <div className="paw-tip-icon">✳</div>
          <h3>Little care, big love.</h3>
          <p>
            Consistent routines help you stay on top of your pet's needs.
          </p>
          <button onClick={() => setActiveNav("planner")}>
            View care plan <span>↗</span>
          </button>
        </div>

        <a href="/" className="paw-back-home">
          <span>←</span> Back to PawMart
        </a>
      </aside>

      <main className="paw-main">
        <header className="paw-topbar">
          <div className="paw-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>PawCare</strong>
          </div>

          <div className="paw-topbar-right">
            <div className="paw-live-label">
              <span /> Connected dashboard
            </div>

            <button
              type="button"
              className="paw-avatar"
              title="Refresh pet records"
              onClick={loadPets}
            >
              ↻
            </button>
          </div>
        </header>

        <div className="paw-content">
          {error && (
            <div className="paw-inline-banner" role="alert">
              <div>
                <h3>Unable to load your pet records</h3>
                <p>{error}</p>
              </div>

              <button
                className="paw-primary-button"
                onClick={loadPets}
              >
                Try again ↻
              </button>
            </div>
          )}

          <section className="paw-welcome">
            <div className="paw-welcome-copy">
              <div className="paw-eyebrow">
                <span className="paw-sparkle">✳</span>
                A LITTLE MORE LOVE, EVERY DAY
              </div>

              <h1>
                Every paw has
                <br />
                <span>a story.</span> Let's care for it.
              </h1>

              <p>
                Your personal space for tracking wellness, organizing care,
                and celebrating every little milestone.
              </p>

              <button
                className="paw-primary-button"
                onClick={() => setActiveNav("health")}
              >
                Explore health records <span>↗</span>
              </button>
            </div>

            <div className="paw-welcome-visual">
              <div className="paw-orbit paw-orbit-one" />
              <div className="paw-orbit paw-orbit-two" />

              <div className="paw-floating-tag paw-tag-top">
                <span className="paw-tag-icon">♡</span>
                <span>
                  <strong>Care with love</strong>
                  <small>Every single day</small>
                </span>
              </div>

              <div className="paw-hero-image">
                <img
                  src={
                    activePet?.dogImage ||
                    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=85"
                  }
                  alt={activePet ? activePet.dogName : "A pet"}
                />
              </div>

              <div className="paw-floating-tag paw-tag-bottom">
                <span className="paw-tag-check">✓</span>
                <span>
                  <strong>
                    {activePet?.dogName || "Your pet"}
                  </strong>
                  <small>
                    {activePet ? "Delivered pet profile" : "Ready when you are"}
                  </small>
                </span>
              </div>

              <span className="paw-decor paw-decor-one">✳</span>
              <span className="paw-decor paw-decor-two">♡</span>
            </div>
          </section>

          <div className="paw-page-heading">
            <div>
              <div className="paw-eyebrow">YOUR PERSONAL DASHBOARD</div>
              <h2>{pageTitles[activeNav][0]}</h2>
              <p>{pageTitles[activeNav][1]}</p>
            </div>

            <div className="paw-date-pill">
              <Icon>▦</Icon>
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          {activeNav === "assistant" ? (
            <section className="paw-ai-layout">
              <div className="paw-ai-card">
                <div className="paw-ai-heading">
                  <div className="paw-ai-symbol">✳</div>
                  <div>
                    <span className="paw-ai-label">PAWCARE AI</span>
                    <h2>Your pet-care companion.</h2>
                    <p>Ask a question or organize your observations.</p>
                  </div>
                </div>

                <div className="paw-chat-messages">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`paw-chat-message ${
                        message.role === "user" ? "user" : "assistant"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <span className="paw-chat-avatar">✳</span>
                      )}
                      <p>{message.text}</p>
                    </div>
                  ))}
                </div>

                <div className="paw-ai-disclaimer">
                  Frontend demo only — responses are not AI-generated and
                  cannot diagnose or treat medical conditions.
                </div>

                <form
                  className="paw-chat-form"
                  onSubmit={sendAssistantMessage}
                >
                  <input
                    value={assistantInput}
                    onChange={(event) =>
                      setAssistantInput(event.target.value)
                    }
                    placeholder="Ask about everyday pet care..."
                    aria-label="Ask PawCare AI"
                  />

                  <button type="submit" aria-label="Send message">
                    ↑
                  </button>
                </form>

                <div className="paw-prompt-list">
                  {[
                    "Prepare for a vet visit",
                    "Organize a puppy routine",
                    "Track my pet's symptoms",
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setAssistantInput(prompt)}
                    >
                      {prompt} ↗
                    </button>
                  ))}
                </div>
              </div>

              <aside className="paw-ai-side">
                <div className="paw-panel">
                  <div className="paw-panel-heading">
                    <h3>Before your vet visit</h3>
                    <span>♡</span>
                  </div>

                  <ul className="paw-vet-list">
                    <li>Record when the concern started.</li>
                    <li>List current medications.</li>
                    <li>Note changes in eating or behavior.</li>
                    <li>Bring relevant health records.</li>
                  </ul>
                </div>

                <div className="paw-safety-card">
                  <span>✚</span>
                  <h3>Need urgent help?</h3>
                  <p>
                    For breathing difficulties, collapse, seizures, or
                    suspected poisoning, contact an emergency veterinarian
                    immediately.
                  </p>
                </div>
              </aside>
            </section>
          ) : (
            <>
              {activeNav === "overview" && (
                <section className="paw-metric-grid">
                  <MetricCard
                    icon="♡"
                    label="Delivered pets"
                    value={pets.length}
                    note="Linked to your account"
                    color="mint"
                  />

                  <MetricCard
                    icon="⚖"
                    label="Latest weight"
                    value={
                      getPetWeight(activePet) === null
                        ? "Not recorded"
                        : `${getPetWeight(activePet)} kg`
                    }
                    note="Most recent measurement"
                    color="peach"
                  />

                  <MetricCard
                    icon="▦"
                    label="Care tasks"
                    value={`${completedTasks}/${tasks.length}`}
                    note="Completed in this session"
                    color="lavender"
                  />

                  <MetricCard
                    icon="♡"
                    label="Vaccinations"
                    value={activePet?.healthRecord?.vaccinations?.length || 0}
                    note="Recorded vaccinations"
                    color="yellow"
                  />
                </section>
              )}

              {activeNav === "pets" && (
                <section className="paw-inline-banner">
                  <div>
                    <h3>Your delivered companions.</h3>
                    <p>
                      Pets appear here when their delivery is confirmed and
                      their health record is linked to your account.
                    </p>
                  </div>

                  <button
                    className="paw-primary-button"
                    onClick={loadPets}
                  >
                    Refresh pets ↻
                  </button>
                </section>
              )}

              {activeNav === "health" && (
                <section className="paw-inline-banner">
                  <div>
                    <h3>Health information from your pet's record.</h3>
                    <p>
                      Seller-reported details and owner updates are shown
                      separately from veterinary verification.
                    </p>
                  </div>

                  {activePet && (
                    <button
                      className="paw-primary-button"
                      onClick={() => setShowHealthForm(true)}
                    >
                      + Add update
                    </button>
                  )}
                </section>
              )}

              {pets.length === 0 ? (
                <section className="paw-panel paw-empty-state">
                  <div className="paw-tip-icon">♡</div>
                  <h2>Your PawCare journey starts here.</h2>

                  <p>
                    No delivered pets are linked to your account yet. Once a
                    real pet booking is delivered and its health record is
                    linked to your account, it will appear here.
                  </p>

                  <button
                    className="paw-primary-button"
                    onClick={loadPets}
                  >
                    Refresh records ↻
                  </button>
                </section>
              ) : (
                <section className="paw-dashboard-grid">
                  <div className="paw-panel paw-pets-panel">
                    <SectionTitle
                      eyebrow="THE ONES YOU LOVE"
                      title="Meet your pets"
                      description="Choose a delivered pet to view its records."
                      action={
                        <button
                          className="paw-text-button"
                          onClick={loadPets}
                        >
                          Refresh ↻
                        </button>
                      }
                    />

                    <div className="paw-pets-grid">
                      {pets.map((pet) => (
                        <PetCard
                          key={pet.bookingId}
                          pet={pet}
                          active={
                            String(pet.bookingId) ===
                            String(activePet?.bookingId)
                          }
                          onClick={() => setActivePetId(pet.bookingId)}
                        />
                      ))}
                    </div>
                  </div>

                  {activePet && (
                    <>
                      <div className="paw-panel paw-wellness-panel">
                        <SectionTitle
                          eyebrow="A MOMENT TO CHECK IN"
                          title="Health snapshot"
                        />

                        <div className="paw-wellness-body">
                          <div className="paw-wellness-ring">
                            <svg viewBox="0 0 140 140" aria-hidden="true">
                              <circle
                                cx="70"
                                cy="70"
                                r="57"
                                fill="none"
                                stroke="#e9eee5"
                                strokeWidth="10"
                              />

                              <circle
                                cx="70"
                                cy="70"
                                r="57"
                                fill="none"
                                stroke="#478456"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={
                                  activePet.healthRecord ? "358 358" : "0 358"
                                }
                                transform="rotate(-90 70 70)"
                              />
                            </svg>

                            <div className="paw-ring-value">
                              <strong>
                                {activePet.healthRecord ? "✓" : "—"}
                              </strong>
                              <span>
                                {activePet.healthRecord
                                  ? "Record linked"
                                  : "No record"}
                              </span>
                            </div>
                          </div>

                          <div className="paw-wellness-copy">
                            <span className="paw-status-dot" />
                            <strong>{activePet.dogName}'s records</strong>

                            <p>
                              {activePet.healthRecord
                                ? `Information source: ${
                                    activePet.healthRecord.informationSource ||
                                    "Not provided"
                                  }. This is a record status, not a medical score.`
                                : "A health record has not been linked yet."}
                            </p>

                            <button
                              className="paw-text-button"
                              onClick={() => setActiveNav("health")}
                            >
                              View health records ↗
                            </button>
                          </div>
                        </div>

                        <div className="paw-wellness-footer">
                          <span>Delivered</span>
                          <strong>
                            {formatDate(activePet.deliveredAt)}
                          </strong>
                        </div>
                      </div>

                      <div className="paw-panel paw-weight-panel">
                        <SectionTitle
                          eyebrow="GROWTH & PROGRESS"
                          title="Weight journey"
                          description="Measurements recorded for this pet."
                          action={
                            <button
                              className="paw-text-button"
                              onClick={() => setShowHealthForm(true)}
                            >
                              + Record weight
                            </button>
                          }
                        />

                        <WeightChart pet={activePet} />
                      </div>

                      <div className="paw-panel paw-tasks-panel">
                        <SectionTitle
                          eyebrow="SMALL HABITS, BIG LOVE"
                          title="Care planner"
                          description={`${completedTasks} of ${tasks.length} tasks completed`}
                          action={
                            <button
                              className="paw-text-button"
                              onClick={() => setShowTaskForm(true)}
                            >
                              + Add task
                            </button>
                          }
                        />

                        <div className="paw-task-progress">
                          <span
                            style={{
                              width: `${
                                tasks.length
                                  ? (completedTasks / tasks.length) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>

                        <div className="paw-task-list">
                          {tasks.map((task) => (
                            <label
                              key={task.id}
                              className={`paw-task ${
                                task.done ? "completed" : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() => toggleTask(task.id)}
                              />

                              <span className="paw-task-check">
                                {task.done ? "✓" : ""}
                              </span>

                              <span className="paw-task-copy">
                                <strong>{task.title}</strong>
                                <small>
                                  {task.pet || activePet.dogName} ·{" "}
                                  {task.category}
                                </small>
                              </span>

                              <span className="paw-task-date">
                                {task.date}
                              </span>
                            </label>
                          ))}
                        </div>

                        <button
                          className="paw-view-all"
                          onClick={() => setShowTaskForm(true)}
                        >
                          Create a care task <span>↗</span>
                        </button>
                      </div>

                      {activeNav === "health" && (
                        <div className="paw-panel">
                          <SectionTitle
                            eyebrow="PET HEALTH INFORMATION"
                            title={`${activePet.dogName}'s health records`}
                            description="Review recorded details and their verification status."
                            action={
                              <button
                                className="paw-text-button"
                                onClick={() => setShowHealthForm(true)}
                              >
                                + Add update
                              </button>
                            }
                          />

                          {!activePet.healthRecord ? (
                            <p className="paw-empty-message">
                              No health record is linked to this booking yet.
                            </p>
                          ) : (
                            <div className="paw-health-records">
                              <div>
                                <h3>General information</h3>
                                <p>
                                  <strong>Age:</strong>{" "}
                                  {activePet.healthRecord.age || "Not recorded"}
                                </p>
                                <p>
                                  <strong>Sex:</strong>{" "}
                                  {activePet.healthRecord.sex || "Unknown"}
                                </p>
                                <p>
                                  <strong>Known conditions:</strong>{" "}
                                  {activePet.healthRecord.knownConditions ||
                                    "None recorded"}
                                </p>
                                <p>
                                  <strong>Known allergies:</strong>{" "}
                                  {activePet.healthRecord.knownAllergies ||
                                    "None recorded"}
                                </p>
                                <p>
                                  <strong>General notes:</strong>{" "}
                                  {activePet.healthRecord.generalNotes ||
                                    "No notes"}
                                </p>
                                <p>
                                  <strong>Information source:</strong>{" "}
                                  {activePet.healthRecord.informationSource ||
                                    "Not provided"}
                                </p>
                              </div>

                              <div>
                                <h3>Vaccinations</h3>

                                {activePet.healthRecord.vaccinations?.length ? (
                                  activePet.healthRecord.vaccinations.map(
                                    (item, index) => (
                                      <div
                                        className="paw-health-item"
                                        key={item._id || index}
                                      >
                                        <strong>{item.name}</strong>
                                        <p>
                                          Date given: {formatDate(item.dateGiven)}
                                        </p>
                                        <p>
                                          Next due: {formatDate(item.nextDueDate)}
                                        </p>
                                        <p>
                                          Verification:{" "}
                                          {item.verificationStatus ||
                                            "Unverified"}
                                        </p>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <p className="paw-empty-message">
                                    No vaccinations recorded.
                                  </p>
                                )}
                              </div>

                              <div>
                                <h3>Weight history</h3>

                                {activePet.healthRecord.weightHistory?.length ? (
                                  activePet.healthRecord.weightHistory.map(
                                    (item, index) => (
                                      <div
                                        className="paw-health-item"
                                        key={item._id || index}
                                      >
                                        <strong>
                                          {item.weightKg} kg
                                        </strong>
                                        <p>
                                          Recorded:{" "}
                                          {formatDate(item.recordedAt)}
                                        </p>
                                        <p>
                                          Source:{" "}
                                          {item.source || "Not recorded"}
                                        </p>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <p className="paw-empty-message">
                                    No weight records available.
                                  </p>
                                )}
                              </div>

                              <div>
                                <h3>Veterinary visits</h3>

                                {activePet.healthRecord.vetVisits?.length ? (
                                  activePet.healthRecord.vetVisits.map(
                                    (item, index) => (
                                      <div
                                        className="paw-health-item"
                                        key={item._id || index}
                                      >
                                        <strong>
                                          {item.reason || "Veterinary visit"}
                                        </strong>
                                        <p>
                                          Date: {formatDate(item.visitDate)}
                                        </p>
                                        <p>
                                          Veterinarian:{" "}
                                          {item.veterinarian || "Not recorded"}
                                        </p>
                                        <p>
                                          Verification:{" "}
                                          {item.verificationStatus ||
                                            "Unverified"}
                                        </p>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <p className="paw-empty-message">
                                    No veterinary visits recorded.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}

              <section className="paw-ai-banner">
                <div className="paw-ai-banner-icon">✳</div>
                <div className="paw-ai-banner-copy">
                  <span>YOUR PET-CARE COMPANION</span>
                  <h2>A little question can make a big difference.</h2>
                  <p>
                    Organize your pet-care questions and prepare for your
                    next veterinary visit.
                  </p>
                </div>

                <button
                  className="paw-ai-banner-button"
                  onClick={() => setActiveNav("assistant")}
                >
                  Explore PawCare AI <span>↗</span>
                </button>
              </section>
            </>
          )}

          <footer className="paw-footer">
            <span>♡ Made for the love between you and your pet.</span>
            <span>PAWCARE STUDIO · CONNECTED TO PAWMART</span>
          </footer>
        </div>
      </main>

      {showHealthForm && activePet && (
        <HealthForm
          pet={activePet}
          saving={saving}
          onSubmit={saveHealthUpdate}
          onClose={() => setShowHealthForm(false)}
        />
      )}

      {showTaskForm && (
        <TaskForm
          onSubmit={addTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}

      {notice && (
        <div className="paw-toast" role="status">
          <span>✓</span> {notice}
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, note, color }) {
  return (
    <article className="paw-metric-card">
      <div className={`paw-metric-icon ${color}`}>
        <Icon>{icon}</Icon>
      </div>
      <div className="paw-metric-label">{label}</div>
      <div className="paw-metric-value">{value}</div>
      <div className="paw-metric-note">{note}</div>
    </article>
  );
}

function HealthForm({ pet, saving, onSubmit, onClose }) {
  const health = pet.healthRecord || {};

  return (
    <div
      className="paw-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <form className="paw-modal" onSubmit={onSubmit}>
        <div className="paw-modal-header">
          <div>
            <span className="paw-eyebrow">HEALTH JOURNAL</span>
            <h2>Update {pet.dogName}'s records</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            disabled={saving}
          >
            ×
          </button>
        </div>

        <label>
          Known conditions
          <textarea
            name="knownConditions"
            defaultValue={health.knownConditions || ""}
            placeholder="Record known conditions"
            rows="2"
          />
        </label>

        <label>
          Known allergies
          <textarea
            name="knownAllergies"
            defaultValue={health.knownAllergies || ""}
            placeholder="Record known allergies"
            rows="2"
          />
        </label>

        <label>
          General notes
          <textarea
            name="generalNotes"
            defaultValue={health.generalNotes || ""}
            placeholder="Add your observations"
            rows="3"
          />
        </label>

        <label>
          New weight measurement (kg)
          <input
            name="weightKg"
            type="number"
            min="0.01"
            max="300"
            step="0.01"
            placeholder="Leave blank if not recording weight"
          />
        </label>

        <p className="paw-form-note">
          New weight measurements will be saved as owner-reported. This
          form does not certify veterinary verification.
        </p>

        <div className="paw-modal-actions">
          <button
            type="button"
            className="paw-secondary-button"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="paw-primary-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save health update ↗"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TaskForm({ onSubmit, onClose }) {
  return (
    <div
      className="paw-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form className="paw-modal" onSubmit={onSubmit}>
        <div className="paw-modal-header">
          <div>
            <span className="paw-eyebrow">A LITTLE REMINDER</span>
            <h2>Create a care task</h2>
          </div>

          <button type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <label>
          Task name
          <input
            name="title"
            placeholder="e.g. Book a vet visit"
            required
          />
        </label>

        <label>
          Date
          <input name="date" type="date" required />
        </label>

        <p className="paw-form-note">
          Tasks are stored in the current page session only. Database
          persistence and reminders have not been implemented.
        </p>

        <div className="paw-modal-actions">
          <button
            type="button"
            className="paw-secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button type="submit" className="paw-primary-button">
            Add task ↗
          </button>
        </div>
      </form>
    </div>
  );
}