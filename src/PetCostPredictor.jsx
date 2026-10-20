import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./PetCostPredictor.css";

const initialCosts = {
  purchasePrice: 0,
  initialSupplies: 3000,
  initialVet: 2000,
  food: 1500,
  grooming: 500,
  veterinarySavings: 500,
  toysAndSupplies: 300,
  trainingAndBoarding: 0,
  insurance: 0,
};

const initialForm = {
  petType: "Dog",
  breed: "",
  monthlyBudget: 3000,
  location: "",
};

const expenseGroups = [
  {
    title: "Initial Expenses",
    description: "One-time expenses when bringing your pet home.",
    items: [
      {
        key: "purchasePrice",
        label: "Pet purchase or adoption cost",
        description: "Enter your expected cost. Use ₹0 for adoption at no charge.",
        icon: "🐕",
      },
      {
        key: "initialSupplies",
        label: "Initial supplies",
        description: "Bed, bowls, leash, carrier, litter tray, and similar items.",
        icon: "🛍️",
      },
      {
        key: "initialVet",
        label: "Initial veterinary expenses",
        description: "Initial examination and any applicable vaccinations.",
        icon: "🩺",
      },
    ],
  },
  {
    title: "Monthly Expenses",
    description: "Recurring expenses for caring for your pet.",
    items: [
      {
        key: "food",
        label: "Food",
        description: "Regular food and treats.",
        icon: "🍖",
      },
      {
        key: "grooming",
        label: "Grooming",
        description: "Bathing, brushing, nail trimming, and professional grooming.",
        icon: "🛁",
      },
      {
        key: "veterinarySavings",
        label: "Veterinary care budget",
        description: "Money set aside for routine care and unexpected needs.",
        icon: "🏥",
      },
      {
        key: "toysAndSupplies",
        label: "Toys and other supplies",
        description: "Toys, hygiene products, replacement equipment, and accessories.",
        icon: "🧸",
      },
      {
        key: "trainingAndBoarding",
        label: "Training and boarding",
        description: "Training sessions, pet sitting, or boarding.",
        icon: "🎓",
      },
      {
        key: "insurance",
        label: "Pet insurance",
        description: "Enter your quoted monthly premium, or leave at ₹0.",
        icon: "🛡️",
      },
    ],
  },
];

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function safeAmount(value) {
  const number = Number(value);

  return Number.isFinite(number) && number > 0
    ? number
    : 0;
}

export default function PetCostPredictor() {
  const [form, setForm] = useState(initialForm);
  const [costs, setCosts] = useState(initialCosts);
  const [showResults, setShowResults] = useState(false);

  const calculations = useMemo(() => {
    const purchasePrice = safeAmount(costs.purchasePrice);
    const initialSupplies = safeAmount(costs.initialSupplies);
    const initialVet = safeAmount(costs.initialVet);

    const monthlyFood = safeAmount(costs.food);
    const monthlyGrooming = safeAmount(costs.grooming);
    const monthlyVet = safeAmount(costs.veterinarySavings);
    const monthlySupplies = safeAmount(costs.toysAndSupplies);
    const monthlyTraining = safeAmount(costs.trainingAndBoarding);
    const monthlyInsurance = safeAmount(costs.insurance);

    const monthlyExpenses =
      monthlyFood +
      monthlyGrooming +
      monthlyVet +
      monthlySupplies +
      monthlyTraining +
      monthlyInsurance;

    const upfrontExpenses =
      purchasePrice +
      initialSupplies +
      initialVet;

    const firstMonthCost =
      upfrontExpenses + monthlyExpenses;

    const firstYearCost =
      upfrontExpenses + monthlyExpenses * 12;

    const budget = safeAmount(form.monthlyBudget);

    const remainingMonthlyBudget =
      budget - monthlyExpenses;

    return {
      monthlyExpenses,
      upfrontExpenses,
      firstMonthCost,
      firstYearCost,
      budget,
      remainingMonthlyBudget,
      budgetExceeded: monthlyExpenses > budget,
      purchasePrice,
    };
  }, [costs, form.monthlyBudget]);

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setShowResults(false);
  }

  function updateCost(key, value) {
    setCosts((previous) => ({
      ...previous,
      [key]: value === "" ? "" : Math.max(0, Number(value) || 0),
    }));

    setShowResults(false);
  }

  function calculateCosts(event) {
    event.preventDefault();
    setShowResults(true);

    window.setTimeout(() => {
      document
        .getElementById("pet-cost-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  function resetCalculator() {
    setForm(initialForm);
    setCosts(initialCosts);
    setShowResults(false);
  }

  return (
    <main className="pet-cost-page">
      <div className="pet-cost-container">
        {/* HEADER */}
        <header className="pet-cost-header no-print">
          <Link to="/" className="pet-cost-logo">
            <span className="pet-cost-logo-icon">🐾</span>
            PawMart
          </Link>

          <Link to="/" className="pet-cost-home-link">
            ← Back to Home
          </Link>
        </header>

        {/* HERO */}
        <section className="pet-cost-hero">
          <div className="pet-cost-hero-content">
            <span className="pet-cost-eyebrow">
              SMART PET PLANNING
            </span>

            <h1>
              Love your pet.
              <br />
              <span>Plan your budget.</span>
            </h1>

            <p>
              Discover what pet ownership could cost before
              bringing your new companion home. Plan your
              initial expenses, monthly care, and first-year
              budget in one place.
            </p>

            <a
              href="#pet-cost-calculator"
              className="pet-cost-primary-link"
            >
              Calculate my costs <span>→</span>
            </a>
          </div>

          <div
            className="pet-cost-hero-illustration"
            aria-hidden="true"
          >
            <div className="pet-cost-hero-circle">
              <span className="pet-cost-hero-emoji">🐶</span>
            </div>

            <div className="pet-cost-floating-card pet-cost-float-top">
              <span>💰</span>
              <div>
                <strong>Monthly budget</strong>
                <small>Plan ahead</small>
              </div>
            </div>

            <div className="pet-cost-floating-card pet-cost-float-bottom">
              <span>❤️</span>
              <div>
                <strong>Responsible care</strong>
                <small>Happy pets, prepared owners</small>
              </div>
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <div className="pet-cost-disclaimer">
          <span>💡</span>
          <p>
            <strong>Good to know:</strong> Starting amounts
            are examples for planning only. Enter your own
            expected expenses because costs depend on your
            location, pet, health, size, and care requirements.
          </p>
        </div>

        {/* CALCULATOR */}
        <section
          className="pet-cost-calculator-card"
          id="pet-cost-calculator"
        >
          <div className="pet-cost-section-heading">
            <span className="pet-cost-section-icon">🧮</span>

            <div>
              <h2>Build your pet budget</h2>
              <p>
                Fill in what you expect to spend.
                All amounts are editable.
              </p>
            </div>
          </div>

          <form onSubmit={calculateCosts}>
            {/* PET INFORMATION */}
            <div className="pet-cost-form-section">
              <h3>01. Tell us about your pet</h3>

              <div className="pet-cost-pet-grid">
                <label className="pet-cost-field">
                  <span>Pet type</span>

                  <select
                    name="petType"
                    value={form.petType}
                    onChange={updateForm}
                  >
                    <option value="Dog">🐶 Dog</option>
                    <option value="Cat">🐱 Cat</option>
                    <option value="Bird">🐦 Bird</option>
                    <option value="Rabbit">🐰 Rabbit</option>
                    <option value="Other">🐾 Other</option>
                  </select>
                </label>

                <label className="pet-cost-field">
                  <span>Breed or pet name</span>

                  <input
                    name="breed"
                    value={form.breed}
                    onChange={updateForm}
                    placeholder="e.g. Labrador Retriever"
                    maxLength={80}
                  />
                </label>

                <label className="pet-cost-field">
                  <span>Your monthly budget (₹)</span>

                  <input
                    type="number"
                    name="monthlyBudget"
                    min="0"
                    step="100"
                    value={form.monthlyBudget}
                    onChange={updateForm}
                    required
                  />

                  <small>
                    How much can you spend on recurring
                    pet care each month?
                  </small>
                </label>

                <label className="pet-cost-field">
                  <span>Your city or location</span>

                  <input
                    name="location"
                    value={form.location}
                    onChange={updateForm}
                    placeholder="e.g. Phagwara, Punjab"
                    maxLength={100}
                  />

                  <small>
                    Used as a planning note; it does not
                    automatically retrieve local prices.
                  </small>
                </label>
              </div>
            </div>

            {/* EXPENSE GROUPS */}
            {expenseGroups.map((group, groupIndex) => (
              <div
                className="pet-cost-form-section"
                key={group.title}
              >
                <div className="pet-cost-expense-heading">
                  <div>
                    <h3>
                      0{groupIndex + 2}. {group.title}
                    </h3>

                    <p>{group.description}</p>
                  </div>

                  <span>
                    {groupIndex === 0
                      ? "ONE-TIME"
                      : "RECURRING"}
                  </span>
                </div>

                <div className="pet-cost-expense-grid">
                  {group.items.map((item) => (
                    <label
                      className="pet-cost-expense-field"
                      key={item.key}
                    >
                      <span className="pet-cost-expense-icon">
                        {item.icon}
                      </span>

                      <span className="pet-cost-expense-copy">
                        <strong>{item.label}</strong>
                        <small>{item.description}</small>
                      </span>

                      <span className="pet-cost-input-wrap">
                        <span>₹</span>

                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={costs[item.key]}
                          onChange={(event) =>
                            updateCost(
                              item.key,
                              event.target.value
                            )
                          }
                          required
                          aria-label={item.label}
                        />
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* FORM BUTTONS */}
            <div className="pet-cost-form-actions no-print">
              <button
                type="button"
                className="pet-cost-reset-button"
                onClick={resetCalculator}
              >
                ↺ Reset
              </button>

              <button
                type="submit"
                className="pet-cost-calculate-button"
              >
                Calculate my costs <span>→</span>
              </button>
            </div>
          </form>
        </section>

        {/* RESULTS */}
        {showResults && (
          <section
            className="pet-cost-results"
            id="pet-cost-results"
          >
            <div className="pet-cost-results-heading">
              <span className="pet-cost-section-icon">
                📊
              </span>

              <div>
                <span className="pet-cost-eyebrow">
                  YOUR PERSONALIZED ESTIMATE
                </span>

                <h2>
                  Your {form.petType.toLowerCase()} budget
                  {form.breed.trim()
                    ? ` · ${form.breed.trim()}`
                    : ""}
                </h2>

                <p>
                  {form.location.trim()
                    ? `Planning location: ${form.location.trim()}`
                    : "Based on the expenses you entered"}
                </p>
              </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="pet-cost-summary-grid">
              <article className="pet-cost-summary-card">
                <span className="pet-cost-summary-icon">
                  📅
                </span>

                <span className="pet-cost-summary-label">
                  Monthly care
                </span>

                <strong>
                  {money(calculations.monthlyExpenses)}
                </strong>

                <small>Estimated recurring expenses</small>
              </article>

              <article className="pet-cost-summary-card">
                <span className="pet-cost-summary-icon">
                  🏡
                </span>

                <span className="pet-cost-summary-label">
                  Initial expenses
                </span>

                <strong>
                  {money(calculations.upfrontExpenses)}
                </strong>

                <small>Purchase and setup expenses</small>
              </article>

              <article className="pet-cost-summary-card pet-cost-summary-highlight">
                <span className="pet-cost-summary-icon">
                  🧾
                </span>

                <span className="pet-cost-summary-label">
                  First month
                </span>

                <strong>
                  {money(calculations.firstMonthCost)}
                </strong>

                <small>Initial + monthly expenses</small>
              </article>

              <article className="pet-cost-summary-card pet-cost-summary-year">
                <span className="pet-cost-summary-icon">
                  🎯
                </span>

                <span className="pet-cost-summary-label">
                  First-year estimate
                </span>

                <strong>
                  {money(calculations.firstYearCost)}
                </strong>

                <small>
                  Initial expenses + 12 months of care
                </small>
              </article>
            </div>

            {/* BUDGET COMPARISON */}
            <div
              className={`pet-cost-budget-status ${
                calculations.budgetExceeded
                  ? "pet-cost-budget-warning"
                  : "pet-cost-budget-good"
              }`}
            >
              <span className="pet-cost-budget-status-icon">
                {calculations.budgetExceeded ? "⚠️" : "✅"}
              </span>

              <div>
                <h3>
                  {calculations.budgetExceeded
                    ? "Your estimated monthly costs exceed your budget"
                    : "Your estimated monthly costs fit your budget"}
                </h3>

                <p>
                  Your monthly budget is{" "}
                  <strong>
                    {money(calculations.budget)}
                  </strong>
                  , while estimated recurring expenses are{" "}
                  <strong>
                    {money(calculations.monthlyExpenses)}
                  </strong>
                  .
                </p>

                <p>
                  {calculations.budgetExceeded
                    ? `You need approximately ${money(
                        Math.abs(
                          calculations.remainingMonthlyBudget
                        )
                      )} more each month, or you could review your estimates and care plan.`
                    : `You would have approximately ${money(
                        calculations.remainingMonthlyBudget
                      )} left each month for other expenses.`}
                </p>
              </div>
            </div>

            {/* COST BREAKDOWN */}
            <div className="pet-cost-breakdown">
              <div className="pet-cost-breakdown-heading">
                <div>
                  <h3>Where your money goes</h3>
                  <p>
                    Your estimated recurring monthly expenses.
                  </p>
                </div>
              </div>

              {[
                {
                  label: "Food",
                  value: safeAmount(costs.food),
                  icon: "🍖",
                },
                {
                  label: "Grooming",
                  value: safeAmount(costs.grooming),
                  icon: "🛁",
                },
                {
                  label: "Veterinary care budget",
                  value: safeAmount(costs.veterinarySavings),
                  icon: "🩺",
                },
                {
                  label: "Toys and supplies",
                  value: safeAmount(costs.toysAndSupplies),
                  icon: "🧸",
                },
                {
                  label: "Training and boarding",
                  value: safeAmount(costs.trainingAndBoarding),
                  icon: "🎓",
                },
                {
                  label: "Insurance",
                  value: safeAmount(costs.insurance),
                  icon: "🛡️",
                },
              ].map((item) => {
                const percentage =
                  calculations.monthlyExpenses > 0
                    ? (item.value /
                        calculations.monthlyExpenses) *
                      100
                    : 0;

                return (
                  <div
                    className="pet-cost-breakdown-row"
                    key={item.label}
                  >
                    <div className="pet-cost-breakdown-label">
                      <span>{item.icon}</span>

                      <strong>{item.label}</strong>
                    </div>

                    <div className="pet-cost-bar-container">
                      <div className="pet-cost-bar-track">
                        <div
                          className="pet-cost-bar-fill"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    <span className="pet-cost-breakdown-amount">
                      {money(item.value)}
                    </span>
                  </div>
                );
              })}

              <div className="pet-cost-breakdown-total">
                <strong>Total monthly expenses</strong>

                <strong>
                  {money(calculations.monthlyExpenses)}
                </strong>
              </div>
            </div>

            {/* IMPORTANT NOTE */}
            <div className="pet-cost-result-note">
              <span>💜</span>

              <p>
                <strong>Plan responsibly.</strong> Actual
                costs may be higher or lower than this estimate.
                Veterinary emergencies, medications, special
                diets, and other unexpected needs can increase
                expenses. Keep an emergency reserve when possible
                and consult a veterinarian about your pet's needs.
              </p>
            </div>

            {/* PRINT */}
            <div className="pet-cost-result-actions no-print">
              <button
                type="button"
                className="pet-cost-reset-button"
                onClick={() => {
                  document
                    .getElementById("pet-cost-calculator")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                ✏️ Edit estimates
              </button>

              <button
                type="button"
                className="pet-cost-calculate-button"
                onClick={() => window.print()}
              >
                🖨️ Print / Save as PDF
              </button>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="pet-cost-footer">
          <span>🐾</span>

          <p>
            PawMart Pet Cost Predictor — better planning for
            happier pets.
          </p>

          <small>
            This calculator provides estimates, not financial
            or veterinary advice.
          </small>
        </footer>
      </div>
    </main>
  );
}