import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PawSure.css";

const API_BASE = "http://localhost:5000/api";

const demoPets = [
  {
    id: "demo-1",
    name: "Buddy",
    breed: "Golden Retriever",
    age: "8 months",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=85",
    healthStatus: "Information not verified",
    sellerStatus: "Not verified",
    vaccinations: "Not confirmed",
    source: "Demo information",
  },
  {
    id: "demo-2",
    name: "Luna",
    breed: "Labrador Retriever",
    age: "6 months",
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=700&q=85",
    healthStatus: "Information not verified",
    sellerStatus: "Not verified",
    vaccinations: "Not confirmed",
    source: "Demo information",
  },
  {
    id: "demo-3",
    name: "Max",
    breed: "German Shepherd",
    age: "1 year",
    image:
      "https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=700&q=85",
    healthStatus: "Information not verified",
    sellerStatus: "Not verified",
    vaccinations: "Not confirmed",
    source: "Demo information",
  },
];

const safetyChecks = [
  {
    title: "Vaccination records",
    description: "Review vaccination dates and supporting documents.",
  },
  {
    title: "Veterinary health records",
    description: "Check whether veterinary records are available.",
  },
  {
    title: "Seller identity",
    description: "Check the seller's identity and available verification.",
  },
  {
    title: "Pet information",
    description: "Confirm age, breed, and other listing details.",
  },
  {
    title: "Purchase documentation",
    description: "Ask for relevant purchase and health documentation.",
  },
];

/* Reusable image component with a fallback */
function SafeImage({
  src,
  alt,
  className = "",
  fallbackHeight,
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`ps-image-fallback ${className}`}
        style={fallbackHeight ? { minHeight: fallbackHeight } : undefined}
        role="img"
        aria-label={`${alt || "Pet"} image unavailable`}
      >
        <span className="ps-fallback-paw">🐾</span>
        <span className="ps-fallback-text">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  let className = "ps-status-unknown";

  if (
    normalized.includes("verified") &&
    !normalized.includes("not verified") &&
    !normalized.includes("unverified")
  ) {
    className = "ps-status-verified";
  } else if (
    normalized.includes("pending") ||
    normalized.includes("incomplete")
  ) {
    className = "ps-status-pending";
  }

  return (
    <span className={`ps-status ${className}`}>
      <span className="ps-status-dot" />
      {status || "Not available"}
    </span>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="ps-section-heading">
      <span className="ps-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export default function PawSure() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPet, setSelectedPet] = useState(null);
  const [search, setSearch] = useState("");
  const [pets, setPets] = useState(demoPets);
  const [loading, setLoading] = useState(true);

  const [apiMessage, setApiMessage] = useState(
    "Showing clearly labelled demonstration profiles."
  );

  useEffect(() => {
    let cancelled = false;

    async function loadListings() {
      try {
        const response = await fetch(`${API_BASE}/breeds`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Listings endpoint is unavailable.");
        }

        const data = await response.json();

        if (cancelled) return;

        const listings = Array.isArray(data)
          ? data
          : Array.isArray(data.breeds)
            ? data.breeds
            : Array.isArray(data.pets)
              ? data.pets
              : [];

        if (listings.length > 0) {
          const mappedPets = listings.map((pet, index) => ({
            id: pet._id || pet.id || `listing-${index}`,
            name: pet.name || pet.dogName || "Unnamed pet",
            breed: pet.breed || "Breed not provided",
            age: pet.age || "Age not provided",
            image:
              pet.image ||
              pet.dogImage ||
              demoPets[index % demoPets.length].image,
            healthStatus: "Not verified",
            sellerStatus: "Not verified",
            vaccinations: "Not confirmed",
            source:
              "Pet listing; health verification has not been connected.",
          }));

          setPets(mappedPets);

          setApiMessage(
            "Pet listings loaded. Health and seller verification have not been confirmed."
          );
        } else {
          setApiMessage(
            "No compatible listings were returned. Showing demonstration profiles."
          );
        }
      } catch {
        if (!cancelled) {
          setApiMessage(
            "Live listings could not be loaded. Showing demonstration profiles."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadListings();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPets = pets.filter((pet) => {
    const query = search.toLowerCase();

    return (
      String(pet.name).toLowerCase().includes(query) ||
      String(pet.breed).toLowerCase().includes(query)
    );
  });

  function openPetDetails(pet) {
    setSelectedPet(pet);
  }

  return (
    <div className="ps-app">
      {/* SIDEBAR */}
      <aside className="ps-sidebar">
        <Link to="/" className="ps-brand">
          <span className="ps-brand-icon">P</span>

          <span>
            PawMart
            <small>PAWSURE PROTECTION</small>
          </span>
        </Link>

        <div className="ps-sidebar-label">TRUST CENTER</div>

        <nav className="ps-navigation">
          {[
            { id: "overview", icon: "⌂", label: "Overview" },
            { id: "pets", icon: "♧", label: "Pet profiles" },
            { id: "health", icon: "♡", label: "Health records" },
            { id: "safety", icon: "✓", label: "Safety checklist" },
          ].map((item) => (
            <button
              type="button"
              key={item.id}
              className={`ps-nav-item ${
                activeTab === item.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ps-sidebar-bottom">
          <div className="ps-shield">♧</div>

          <h3>Trust starts with transparency.</h3>

          <p>
            Review available information before making a pet purchase.
          </p>
        </div>

        <Link to="/" className="ps-back-link">
          ← Back to PawMart
        </Link>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ps-main">
        <header className="ps-topbar">
          <div>
            <span>PAWMART</span>
            <span className="ps-breadcrumb-divider">/</span>
            <strong>PawSure</strong>
          </div>

          <div className="ps-topbar-right">
            <span className="ps-live-dot" />
            Pet trust center

            <Link to="/pawcare" className="ps-topbar-link">
              PawCare ↗
            </Link>
          </div>
        </header>

        <div className="ps-content">
          {/* HERO */}
          <section className="ps-hero">
            <div className="ps-hero-copy">
              <div className="ps-hero-label">
                <span>✳</span> PET TRUST & SAFETY
              </div>

              <h1>
                More trust.
                <br />
                <span>More tail wags.</span>
              </h1>

              <p>
                Make informed decisions with organized pet health
                information, safety checks, and transparent verification
                statuses.
              </p>

              <button
                type="button"
                className="ps-primary-button"
                onClick={() => setActiveTab("pets")}
              >
                Explore pet profiles <span>↗</span>
              </button>

              <div className="ps-hero-footnote">
                <span>✓</span>
                Clear information. No false verification claims.
              </div>
            </div>

            <div className="ps-hero-visual">
              <div className="ps-hero-orbit" />

              <div className="ps-hero-image">
                <SafeImage
                  src={demoPets[0].image}
                  alt="Golden retriever sitting outdoors"
                />
              </div>

              <div className="ps-floating-card ps-floating-top">
                <span className="ps-floating-icon">♡</span>

                <div>
                  <strong>Health information</strong>
                  <small>Review before purchase</small>
                </div>
              </div>

              <div className="ps-floating-card ps-floating-bottom">
                <span className="ps-floating-icon">✓</span>

                <div>
                  <strong>Transparency first</strong>
                  <small>Verification status matters</small>
                </div>
              </div>
            </div>
          </section>

          {/* API STATUS */}
          <div className="ps-notice">
            <span>ⓘ</span>

            <div>
              <strong>Listing status</strong>
              <p>{apiMessage}</p>
            </div>
          </div>

          {/* STATISTICS */}
          <section className="ps-stat-grid">
            <article className="ps-stat-card">
              <span className="ps-stat-icon green">♧</span>
              <span className="ps-stat-label">Pet profiles</span>
              <strong>{pets.length}</strong>
              <small>Profiles currently displayed</small>
            </article>

            <article className="ps-stat-card">
              <span className="ps-stat-icon peach">♡</span>
              <span className="ps-stat-label">Health records</span>
              <strong>Review</strong>
              <small>Check each record individually</small>
            </article>

            <article className="ps-stat-card">
              <span className="ps-stat-icon purple">✓</span>
              <span className="ps-stat-label">Safety checklist</span>
              <strong>{safetyChecks.length}</strong>
              <small>Checks to review before buying</small>
            </article>

            <article className="ps-stat-card">
              <span className="ps-stat-icon yellow">♢</span>
              <span className="ps-stat-label">Verified profiles</span>
              <strong>—</strong>
              <small>No live verification data connected</small>
            </article>
          </section>

          {/* PAGE HEADING */}
          <div className="ps-page-heading">
            <div>
              <span className="ps-eyebrow">YOUR TRUST DASHBOARD</span>

              <h2>
                {activeTab === "overview" &&
                  "Make every decision informed"}

                {activeTab === "pets" && "Explore pet profiles"}

                {activeTab === "health" &&
                  "Health information center"}

                {activeTab === "safety" &&
                  "Your pet safety checklist"}
              </h2>

              <p>
                {activeTab === "overview" &&
                  "Explore available information and understand what still needs verification."}

                {activeTab === "pets" &&
                  "Search profiles and inspect the information currently available."}

                {activeTab === "health" &&
                  "Learn which health documents and details to review."}

                {activeTab === "safety" &&
                  "Use these practical checks before making a purchase."}
              </p>
            </div>

            <div className="ps-date-pill">
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          {/* PET DIRECTORY */}
          {(activeTab === "overview" || activeTab === "pets") && (
            <section className="ps-panel">
              <div className="ps-panel-heading">
                <div>
                  <span className="ps-eyebrow">PET DIRECTORY</span>

                  <h3>Meet your potential companion</h3>

                  <p>
                    These profiles are not proof of health or seller
                    verification.
                  </p>
                </div>

                <div className="ps-search">
                  <span>⌕</span>

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search pets or breeds"
                    aria-label="Search pet profiles"
                  />
                </div>
              </div>

              {loading && (
                <p className="ps-loading">
                  Checking available listings...
                </p>
              )}

              <div className="ps-pet-grid">
                {filteredPets.map((pet) => (
                  <article className="ps-pet-card" key={pet.id}>
                    <div className="ps-pet-image-wrap">
                      <SafeImage src={pet.image} alt={pet.name} />

                      <span className="ps-pet-tag">Profile</span>
                    </div>

                    <div className="ps-pet-body">
                      <div className="ps-pet-title">
                        <div>
                          <h3>{pet.name}</h3>
                          <p>{pet.breed}</p>
                        </div>

                        <span className="ps-paw-mark">♡</span>
                      </div>

                      <div className="ps-pet-age">
                        <span>Age</span>
                        <strong>{pet.age}</strong>
                      </div>

                      <div className="ps-pet-statuses">
                        <div>
                          <span>Health</span>
                          <StatusBadge status={pet.healthStatus} />
                        </div>

                        <div>
                          <span>Seller</span>
                          <StatusBadge status={pet.sellerStatus} />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ps-outline-button"
                        onClick={() => openPetDetails(pet)}
                      >
                        Review profile <span>↗</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {!filteredPets.length && (
                <div className="ps-empty">
                  <span>⌕</span>
                  <h3>No matching pets</h3>
                  <p>
                    Try searching with a different name or breed.
                  </p>
                </div>
              )}
            </section>
          )}

          {/* HEALTH INFORMATION */}
          {(activeTab === "overview" || activeTab === "health") && (
            <section className="ps-health-section">
              <div className="ps-health-intro">
                <span className="ps-eyebrow">
                  HEALTH TRANSPARENCY
                </span>

                <h2>Know what you're reviewing.</h2>

                <p>
                  A health record is useful only when you understand its
                  source and verification status.
                </p>

                <button
                  type="button"
                  className="ps-primary-button"
                  onClick={() => setActiveTab("safety")}
                >
                  Open safety checklist ↗
                </button>
              </div>

              <div className="ps-health-cards">
                <article className="ps-health-card">
                  <span className="ps-health-icon">♡</span>

                  <h3>Vaccination records</h3>

                  <p>
                    Review vaccine names, dates, next due dates, and
                    supporting documents.
                  </p>

                  <span className="ps-record-label">
                    Document review required
                  </span>
                </article>

                <article className="ps-health-card">
                  <span className="ps-health-icon">✚</span>

                  <h3>Veterinary visits</h3>

                  <p>
                    Check visit dates, veterinary details, and available
                    examination records.
                  </p>

                  <span className="ps-record-label">
                    Veterinary confirmation recommended
                  </span>
                </article>

                <article className="ps-health-card">
                  <span className="ps-health-icon">▤</span>

                  <h3>Health documentation</h3>

                  <p>
                    Review available certificates and confirm their
                    authenticity with the issuing provider.
                  </p>

                  <span className="ps-record-label">
                    Authenticity not checked
                  </span>
                </article>
              </div>
            </section>
          )}

          {/* SAFETY CHECKLIST */}
          {(activeTab === "overview" || activeTab === "safety") && (
            <section className="ps-panel ps-safety-panel">
              <SectionHeading
                eyebrow="BEFORE YOU BUY"
                title="Your safety checklist"
                description="Practical steps that help you ask better questions before making a decision."
              />

              <div className="ps-checklist">
                {safetyChecks.map((check, index) => (
                  <label className="ps-check-item" key={check.title}>
                    <input type="checkbox" />

                    <span className="ps-custom-check">✓</span>

                    <span className="ps-check-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="ps-check-copy">
                      <strong>{check.title}</strong>
                      <small>{check.description}</small>
                    </span>
                  </label>
                ))}
              </div>

              <div className="ps-safety-footer">
                <span>
                  ⓘ Checking these boxes is a personal reminder, not an
                  official verification.
                </span>
              </div>
            </section>
          )}

          {/* PAWCARE BANNER */}
          <section className="ps-bottom-banner">
            <div className="ps-banner-icon">♧</div>

            <div>
              <span>YOUR PET DESERVES THE BEST</span>

              <h2>Trust is built on clear information.</h2>

              <p>
                Combine careful checks with advice from a qualified
                veterinarian.
              </p>
            </div>

            <Link to="/pawcare" className="ps-banner-button">
              Visit PawCare ↗
            </Link>
          </section>

          {/* FOOTER */}
          <footer className="ps-footer">
            <span>
              ♡ Built for safer, more informed pet decisions.
            </span>

            <span>PAWSURE · A PAWMART FEATURE</span>
          </footer>
        </div>
      </main>

      {/* PET PROFILE MODAL */}
      {selectedPet && (
        <div
          className="ps-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedPet(null);
            }
          }}
        >
          <section
            className="ps-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ps-modal-title"
          >
            <button
              type="button"
              className="ps-modal-close"
              onClick={() => setSelectedPet(null)}
              aria-label="Close profile"
            >
              ×
            </button>

            <SafeImage
              className="ps-modal-image"
              src={selectedPet.image}
              alt={selectedPet.name}
              fallbackHeight={240}
            />

            <span className="ps-eyebrow">PET TRUST PROFILE</span>

            <h2 id="ps-modal-title">{selectedPet.name}</h2>

            <p className="ps-modal-breed">
              {selectedPet.breed} · {selectedPet.age}
            </p>

            <div className="ps-modal-status-row">
              <span>Health information</span>
              <StatusBadge status={selectedPet.healthStatus} />
            </div>

            <div className="ps-modal-status-row">
              <span>Seller information</span>
              <StatusBadge status={selectedPet.sellerStatus} />
            </div>

            <div className="ps-modal-status-row">
              <span>Vaccination records</span>
              <strong>{selectedPet.vaccinations}</strong>
            </div>

            <p className="ps-modal-note">
              <strong>Source:</strong> {selectedPet.source}
            </p>

            <div className="ps-modal-warning">
              This profile does not confirm the pet's medical condition,
              vaccination status, or seller identity. Request supporting
              documentation and verify it with the appropriate provider.
            </div>

            <button
              type="button"
              className="ps-primary-button ps-modal-done"
              onClick={() => setSelectedPet(null)}
            >
              Close profile
            </button>
          </section>
        </div>
      )}
    </div>
  );
}