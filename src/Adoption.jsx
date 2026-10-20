import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  PawPrint,
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  HandHeart,
  X,
  CheckCircle2,
  Sparkles,
  Menu,
} from "lucide-react";

import "./Adoption.css";

const API = "http://localhost:5000";

const adoptionPets = [
  {
    id: 1,
    name: "Bella",
    type: "Dog",
    breed: "Indie / Mixed Breed",
    age: "2 years",
    gender: "Female",
    size: "Medium",
    location: "Phagwara, Punjab",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85",
    badge: "Gentle Soul",
    color: "purple",
    description:
      "Bella is a friendly demonstration profile for a dog who enjoys companionship, gentle walks, and spending time with people.",
    personality: ["Friendly", "Loving", "Playful"],
  },
  {
    id: 2,
    name: "Charlie",
    type: "Dog",
    breed: "Golden Retriever",
    age: "1 year",
    gender: "Male",
    size: "Large",
    location: "Jalandhar, Punjab",
    image:
      "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=900&q=85",
    badge: "Happy Explorer",
    color: "orange",
    description:
      "Charlie is a sample adoption profile representing an energetic companion who enjoys outdoor activities and interactive play.",
    personality: ["Energetic", "Curious", "Affectionate"],
  },
  {
    id: 3,
    name: "Milo",
    type: "Cat",
    breed: "Domestic Short Hair",
    age: "8 months",
    gender: "Male",
    size: "Small",
    location: "Ludhiana, Punjab",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85",
    badge: "Little Charmer",
    color: "blue",
    description:
      "Milo is a demonstration cat profile for people interested in a curious companion and learning about responsible cat care.",
    personality: ["Curious", "Gentle", "Independent"],
  },
  {
    id: 4,
    name: "Daisy",
    type: "Dog",
    breed: "Labrador Retriever",
    age: "3 years",
    gender: "Female",
    size: "Large",
    location: "Amritsar, Punjab",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=85",
    badge: "Sweet Companion",
    color: "pink",
    description:
      "Daisy is a sample listing for a companion who could suit a family prepared to provide regular exercise, training, and care.",
    personality: ["Social", "Loyal", "Active"],
  },
  {
    id: 5,
    name: "Luna",
    type: "Cat",
    breed: "Domestic Long Hair",
    age: "1 year",
    gender: "Female",
    size: "Small",
    location: "Phagwara, Punjab",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=85",
    badge: "Quiet Companion",
    color: "purple",
    description:
      "Luna is a demonstration profile for an affectionate cat. Potential adopters should confirm her needs and temperament with a real shelter.",
    personality: ["Calm", "Observant", "Affectionate"],
  },
  {
    id: 6,
    name: "Rocky",
    type: "Dog",
    breed: "Indie / Mixed Breed",
    age: "1 year",
    gender: "Male",
    size: "Medium",
    location: "Patiala, Punjab",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=85",
    badge: "Adventure Buddy",
    color: "green",
    description:
      "Rocky is an example listing representing an active dog whose future family should be ready for daily exercise and enrichment.",
    personality: ["Active", "Playful", "Alert"],
  },
];

const adoptionSteps = [
  {
    number: "01",
    icon: Search,
    title: "Find your match",
    description:
      "Explore pet profiles and learn about the responsibilities of welcoming a companion.",
  },
  {
    number: "02",
    icon: HandHeart,
    title: "Get acquainted",
    description:
      "Contact the responsible shelter or rescuer and ask questions about the pet's needs.",
  },
  {
    number: "03",
    icon: Heart,
    title: "Welcome home",
    description:
      "Complete the shelter's adoption process and prepare a safe, loving home.",
  },
];

function Adoption() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [enquiry, setEnquiry] = useState({
    name: "",
    email: "",
    phone: "",
    livingSituation: "Independent house",
    message: "",
  });

  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryReference, setEnquiryReference] = useState("");

  // ========================================
  // FILTER PETS
  // ========================================

  const filteredPets = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return adoptionPets.filter((pet) => {
      const matchesType =
        activeFilter === "All" || pet.type === activeFilter;

      const matchesSearch =
        !query ||
        [
          pet.name,
          pet.breed,
          pet.type,
          pet.location,
          pet.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesType && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  // ========================================
  // MODAL SCROLL MANAGEMENT
  // ========================================

  useEffect(() => {
    if (!selectedPet) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPet]);

  // ========================================
  // OPEN ENQUIRY
  // ========================================

  function openEnquiry(pet) {
    setSelectedPet(pet);

    setEnquiryMessage("");
    setEnquirySuccess(false);
    setEnquiryReference("");

    setEnquiry((previous) => ({
      ...previous,
      message: pet
        ? `I would like to learn more about ${pet.name}.`
        : "",
    }));
  }

  // ========================================
  // CLOSE ENQUIRY
  // ========================================

  function closeEnquiry() {
    if (enquirySubmitting) {
      return;
    }

    setSelectedPet(null);
    setEnquiryMessage("");
    setEnquirySuccess(false);
    setEnquiryReference("");
  }

  // ========================================
  // HANDLE FORM INPUTS
  // ========================================

  function handleEnquiryChange(event) {
    const { name, value } = event.target;

    setEnquiry((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove the previous status when the user edits the form.
    setEnquiryMessage("");
    setEnquirySuccess(false);
    setEnquiryReference("");
  }

  // ========================================
  // SUBMIT ADOPTION ENQUIRY
  // POST /api/adoption/enquiries
  // ========================================

  async function submitEnquiry(event) {
    event.preventDefault();

    if (enquirySubmitting) {
      return;
    }

    if (!selectedPet) {
      setEnquiryMessage(
        "Please select a pet before submitting an enquiry."
      );
      setEnquirySuccess(false);
      return;
    }

    const name = enquiry.name.trim();
    const email = enquiry.email.trim();
    const phone = enquiry.phone.trim();
    const message = enquiry.message.trim();

    if (!name || !email || !phone || !message) {
      setEnquiryMessage(
        "Please complete all required fields."
      );
      setEnquirySuccess(false);
      return;
    }

    setEnquirySubmitting(true);
    setEnquiryMessage("");
    setEnquirySuccess(false);
    setEnquiryReference("");

    try {
      const response = await fetch(
        `${API}/api/adoption/enquiries`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            petId: String(selectedPet.id),
            petName: selectedPet.name,
            petBreed: selectedPet.breed,
            petType: selectedPet.type,
            petAge: selectedPet.age,
            petGender: selectedPet.gender,
            petLocation: selectedPet.location,

            name,
            email,
            phone,
            livingSituation: enquiry.livingSituation,
            message,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to submit your enquiry. Please try again."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || "The enquiry could not be saved."
        );
      }

      const reference =
        data.reference ||
        (data.enquiryId
          ? `AD-${String(data.enquiryId).slice(-8).toUpperCase()}`
          : "");

      setEnquiryReference(reference);
      setEnquirySuccess(true);

      setEnquiryMessage(
        data.message ||
          "Your adoption enquiry was saved successfully in PawMart."
      );

      // Clear the form after successful submission.
      setEnquiry({
        name: "",
        email: "",
        phone: "",
        livingSituation: "Independent house",
        message: "",
      });
    } catch (error) {
      console.error("Adoption enquiry submission error:", error);

      setEnquirySuccess(false);

      setEnquiryMessage(
        error.message ||
          "Unable to submit your enquiry. Please check your connection and try again."
      );
    } finally {
      setEnquirySubmitting(false);
    }
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <main className="adoption-page">
      {/* TOP NAVIGATION */}
      <header className="adoption-header">
        <div className="adoption-nav-inner">
          <Link to="/" className="adoption-brand">
            <span className="adoption-brand-icon">
              <PawPrint size={25} />
            </span>

            <span>
              paw<span>mart</span>
              <small>ADOPT. LOVE. REPEAT.</small>
            </span>
          </Link>

          <nav
            className={`adoption-nav ${
              mobileMenuOpen ? "adoption-nav-open" : ""
            }`}
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/dogs"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find a Dog
            </Link>

            <a
              href="#adoption-pets"
              onClick={() => setMobileMenuOpen(false)}
            >
              Adopt a Pet
            </a>

            <a
              href="#adoption-process"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
          </nav>

          <Link
            to="/profile"
            className="adoption-profile-link"
          >
            My Profile <ArrowRight size={15} />
          </Link>

          <button
            type="button"
            className="adoption-mobile-menu"
            onClick={() =>
              setMobileMenuOpen((open) => !open)
            }
            aria-label="Toggle adoption navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="adoption-hero">
        <div className="adoption-hero-content">
          <span className="adoption-eyebrow">
            <Heart size={15} fill="currentColor" />
            A LITTLE LOVE CHANGES EVERYTHING
          </span>

          <h1>
            Their next chapter
            <br />
            starts <span>with you.</span>
          </h1>

          <p>
            Somewhere out there is a companion waiting for
            kindness, patience, and a place to call home.
            Discover responsible adoption and give a deserving
            animal a chance at a beautiful new beginning.
          </p>

          <div className="adoption-hero-actions">
            <a
              href="#adoption-pets"
              className="adoption-primary-btn"
            >
              Find your companion
              <ArrowRight size={18} />
            </a>

            <a
              href="#adoption-process"
              className="adoption-secondary-btn"
            >
              How adoption works
            </a>
          </div>

          <div className="adoption-hero-note">
            <HandHeart size={19} />

            <span>
              Adoption is a commitment to lifelong care.
            </span>
          </div>
        </div>

        <div className="adoption-hero-visual">
          <div className="adoption-hero-image-main">
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85"
              alt="Dog enjoying time outdoors"
            />
          </div>

          <div className="adoption-hero-image-small">
            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=85"
              alt="Cat looking curious"
            />
          </div>

          <div className="adoption-floating-note">
            <span className="adoption-floating-heart">
              <Heart size={23} fill="currentColor" />
            </span>

            <div>
              <strong>A home full of love</strong>
              <small>Start your adoption journey</small>
            </div>
          </div>

          <div className="adoption-hero-decoration">
            <PawPrint size={34} />
          </div>
        </div>
      </section>

      {/* DEMO DATA NOTICE */}
      <div className="adoption-demo-notice">
        <ShieldCheck size={21} />

        <p>
          <strong>Demonstration listings:</strong> The animals
          shown below are sample profiles for the website
          frontend. They are not verified shelter listings or
          confirmed available pets.
        </p>
      </div>

      {/* PET LISTINGS */}
      <section
        className="adoption-listings"
        id="adoption-pets"
      >
        <div className="adoption-section-heading">
          <span className="adoption-eyebrow">
            MEET YOUR NEW BEST FRIEND
          </span>

          <h2>
            Every paw deserves
            <br />
            <span>a place to belong.</span>
          </h2>

          <p>
            Explore example pet profiles and discover the
            kinds of information to look for when adopting.
          </p>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="adoption-discovery-bar">
          <div className="adoption-search">
            <Search size={19} />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search name, breed, or location..."
              aria-label="Search adoption pets"
            />
          </div>

          <div
            className="adoption-filters"
            aria-label="Filter by pet type"
          >
            {["All", "Dog", "Cat"].map((filter) => (
              <button
                type="button"
                key={filter}
                className={
                  activeFilter === filter
                    ? "adoption-filter-active"
                    : ""
                }
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter === "All"
                  ? "All pets"
                  : filter === "Dog"
                  ? "🐶 Dogs"
                  : "🐱 Cats"}
              </button>
            ))}
          </div>
        </div>

        {/* PET CARDS */}
        {filteredPets.length > 0 ? (
          <div className="adoption-pet-grid">
            {filteredPets.map((pet) => (
              <article
                className="adoption-pet-card"
                key={pet.id}
              >
                <div className="adoption-pet-image">
                  <img
                    src={pet.image}
                    alt={`${pet.name} demonstration profile`}
                    loading="lazy"
                  />

                  <span
                    className={`adoption-pet-badge ${pet.color}`}
                  >
                    <Sparkles size={13} />
                    {pet.badge}
                  </span>

                  <span className="adoption-type-badge">
                    {pet.type === "Dog" ? "🐶 Dog" : "🐱 Cat"}
                  </span>
                </div>

                <div className="adoption-pet-content">
                  <div className="adoption-pet-title">
                    <div>
                      <h3>{pet.name}</h3>
                      <p>{pet.breed}</p>
                    </div>

                    <span className="adoption-pet-gender">
                      {pet.gender === "Female" ? "♀" : "♂"}
                    </span>
                  </div>

                  <div className="adoption-pet-details">
                    <span>
                      <Clock size={15} />
                      {pet.age}
                    </span>

                    <span>
                      <MapPin size={15} />
                      {pet.location}
                    </span>
                  </div>

                  <div className="adoption-personality">
                    {pet.personality.slice(0, 3).map((trait) => (
                      <span key={trait}>{trait}</span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="adoption-card-btn"
                    onClick={() => openEnquiry(pet)}
                  >
                    View pet details
                    <ArrowRight size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="adoption-no-results">
            <span>🐾</span>

            <h3>No matching pets found</h3>

            <p>
              Try another name, breed, location, or pet type.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* RESPONSIBLE ADOPTION */}
      <section className="adoption-values">
        <div className="adoption-values-image">
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=85"
            alt="Two dogs spending time together"
            loading="lazy"
          />

          <div className="adoption-values-image-caption">
            <Heart size={20} fill="currentColor" />

            <span>
              A friend for life, not just a moment.
            </span>
          </div>
        </div>

        <div className="adoption-values-content">
          <span className="adoption-eyebrow">
            LOVE MEANS RESPONSIBILITY
          </span>

          <h2>
            Adoption is more than
            <br />
            <span>bringing a pet home.</span>
          </h2>

          <p>
            Every animal deserves time to settle in, appropriate
            food, preventive veterinary care, exercise, patience,
            and a safe environment. Make sure you are ready for
            the long-term commitment before adopting.
          </p>

          <div className="adoption-value-point">
            <span>
              <CheckCircle2 size={19} />
            </span>

            <div>
              <strong>Ask about health and behaviour</strong>

              <p>
                Request available veterinary records and
                ask the shelter about the animal's needs.
              </p>
            </div>
          </div>

          <div className="adoption-value-point">
            <span>
              <CheckCircle2 size={19} />
            </span>

            <div>
              <strong>Prepare your home</strong>

              <p>
                Arrange food, bedding, safe spaces,
                identification, and suitable supplies.
              </p>
            </div>
          </div>

          <div className="adoption-value-point">
            <span>
              <CheckCircle2 size={19} />
            </span>

            <div>
              <strong>Plan for lifelong care</strong>

              <p>
                Consider daily time, veterinary expenses,
                training, and your future circumstances.
              </p>
            </div>
          </div>

          <Link
            to="/pet-cost-predictor"
            className="adoption-cost-link"
          >
            Plan your pet-care budget
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ADOPTION PROCESS */}
      <section
        className="adoption-process"
        id="adoption-process"
      >
        <div className="adoption-section-heading">
          <span className="adoption-eyebrow">
            A SIMPLE PATH TO A NEW BEGINNING
          </span>

          <h2>
            Three steps.
            <br />
            <span>A lifetime of love.</span>
          </h2>

          <p>
            A responsible adoption begins with thoughtful
            questions and a commitment to the animal's wellbeing.
          </p>
        </div>

        <div className="adoption-steps-grid">
          {adoptionSteps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                className="adoption-step-card"
                key={step.number}
              >
                <span className="adoption-step-number">
                  {step.number}
                </span>

                <div className="adoption-step-icon">
                  <Icon size={25} />
                </div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="adoption-final-cta">
        <div className="adoption-cta-paw">
          <PawPrint size={35} />
        </div>

        <span className="adoption-eyebrow">
          EVERY COMPANION MATTERS
        </span>

        <h2>
          Make room for
          <br />
          <span>a little more love.</span>
        </h2>

        <p>
          Explore PawMart and learn how to prepare for
          responsible pet ownership.
        </p>

        <div className="adoption-cta-actions">
          <Link
            to="/dogs"
            className="adoption-primary-btn"
          >
            Explore dogs
            <ArrowRight size={17} />
          </Link>

          <Link
            to="/pet-cost-predictor"
            className="adoption-secondary-btn"
          >
            Plan pet expenses
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="adoption-footer">
        <Link to="/" className="adoption-brand">
          <span className="adoption-brand-icon">
            <PawPrint size={24} />
          </span>

          <span>
            paw<span>mart</span>
            <small>YOUR BEST FRIEND STARTS HERE</small>
          </span>
        </Link>

        <div className="adoption-footer-links">
          <Link to="/">Home</Link>
          <Link to="/dogs">Find a Dog</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/pet-cost-predictor">
            Pet Cost Predictor
          </Link>
        </div>

        <p>
          Made with <Heart size={14} fill="currentColor" /> for
          pets and the people who love them.
        </p>
      </footer>

      {/* PET DETAILS AND ENQUIRY MODAL */}
      {selectedPet && (
        <div
          className="adoption-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEnquiry();
            }
          }}
        >
          <section
            className="adoption-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="adoption-modal-title"
          >
            <button
              type="button"
              className="adoption-modal-close"
              onClick={closeEnquiry}
              disabled={enquirySubmitting}
              aria-label="Close pet details"
            >
              <X size={22} />
            </button>

            <img
              className="adoption-modal-image"
              src={selectedPet.image}
              alt={`${selectedPet.name} demonstration profile`}
            />

            <div className="adoption-modal-content">
              <span className="adoption-eyebrow">
                DEMONSTRATION PET PROFILE
              </span>

              <h2 id="adoption-modal-title">
                Meet {selectedPet.name}
              </h2>

              <p className="adoption-modal-breed">
                {selectedPet.breed}
              </p>

              <div className="adoption-modal-detail-grid">
                <div>
                  <span>Age</span>
                  <strong>{selectedPet.age}</strong>
                </div>

                <div>
                  <span>Gender</span>
                  <strong>{selectedPet.gender}</strong>
                </div>

                <div>
                  <span>Size</span>
                  <strong>{selectedPet.size}</strong>
                </div>

                <div>
                  <span>Example location</span>
                  <strong>{selectedPet.location}</strong>
                </div>
              </div>

              <p className="adoption-modal-description">
                {selectedPet.description}
              </p>

              <div className="adoption-modal-traits">
                {selectedPet.personality.map((trait) => (
                  <span key={trait}>{trait}</span>
                ))}
              </div>

              <div className="adoption-modal-notice">
                <ShieldCheck size={19} />

                <p>
                  This is a sample pet profile. Confirm real
                  availability, identity, health records, and
                  adoption requirements directly with a legitimate
                  shelter or rescue organization. Submitting an
                  enquiry does not reserve or adopt the animal.
                </p>
              </div>

              <h3>Submit an adoption enquiry</h3>

              <form
                className="adoption-enquiry-form"
                onSubmit={submitEnquiry}
              >
                <label>
                  Your full name

                  <input
                    name="name"
                    value={enquiry.name}
                    onChange={handleEnquiryChange}
                    placeholder="Enter your name"
                    required
                    maxLength={100}
                    disabled={enquirySubmitting}
                  />
                </label>

                <label>
                  Email address

                  <input
                    type="email"
                    name="email"
                    value={enquiry.email}
                    onChange={handleEnquiryChange}
                    placeholder="you@example.com"
                    required
                    maxLength={150}
                    disabled={enquirySubmitting}
                  />
                </label>

                <label>
                  Phone number

                  <input
                    type="tel"
                    name="phone"
                    value={enquiry.phone}
                    onChange={handleEnquiryChange}
                    placeholder="Enter your phone number"
                    required
                    maxLength={25}
                    disabled={enquirySubmitting}
                  />
                </label>

                <label>
                  Living situation

                  <select
                    name="livingSituation"
                    value={enquiry.livingSituation}
                    onChange={handleEnquiryChange}
                    disabled={enquirySubmitting}
                  >
                    <option>Independent house</option>
                    <option>Apartment</option>
                    <option>Shared accommodation</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="adoption-enquiry-full">
                  Why are you interested in adopting?

                  <textarea
                    name="message"
                    value={enquiry.message}
                    onChange={handleEnquiryChange}
                    rows={3}
                    placeholder="Tell us about your home and pet-care plans."
                    required
                    maxLength={1000}
                    disabled={enquirySubmitting}
                  />
                </label>

                <button
                  type="submit"
                  className="adoption-primary-btn adoption-enquiry-submit adoption-enquiry-full"
                  disabled={enquirySubmitting || enquirySuccess}
                >
                  {enquirySubmitting
                    ? "Submitting enquiry..."
                    : enquirySuccess
                    ? "✓ Enquiry submitted"
                    : "Submit Adoption Enquiry"}

                  {!enquirySubmitting &&
                    !enquirySuccess && (
                      <ArrowRight size={17} />
                    )}
                </button>
              </form>

              {/* SUCCESS OR ERROR MESSAGE */}
              {enquiryMessage && (
                <div
                  className="adoption-enquiry-message"
                  role="status"
                  aria-live="polite"
                  style={{
                    marginTop: "15px",
                    padding: "14px",
                    borderRadius: "10px",
                    lineHeight: 1.8,
                    overflowWrap: "anywhere",
                    background: enquirySuccess
                      ? "#ecfdf5"
                      : "#fff7ed",
                    border: enquirySuccess
                      ? "1px solid #a7f3d0"
                      : "1px solid #fed7aa",
                    color: enquirySuccess
                      ? "#065f46"
                      : "#9a3412",
                  }}
                >
                  {enquirySuccess ? (
                    <>
                      <strong>
                        ✅ Enquiry saved successfully!
                      </strong>

                      <p style={{ margin: "7px 0 0" }}>
                        {enquiryMessage}
                      </p>

                      {enquiryReference && (
                        <p style={{ margin: "7px 0 0" }}>
                          <strong>Reference:</strong>{" "}
                          {enquiryReference}
                        </p>
                      )}

                      <p style={{ margin: "7px 0 0" }}>
                        Remember: this is a demonstration pet
                        profile. Your enquiry has been saved
                        in PawMart, but no real shelter has
                        been notified.
                      </p>
                    </>
                  ) : (
                    <>
                      <strong>
                        Unable to submit enquiry
                      </strong>

                      <p style={{ margin: "7px 0 0" }}>
                        {enquiryMessage}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Adoption;