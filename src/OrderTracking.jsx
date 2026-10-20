import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Search,
  PawPrint,
  CalendarDays,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  RefreshCw,
  LogIn,
} from "lucide-react";
import "./OrderTracking.css";

const API_URL = "http://localhost:5000/api";

const STATUS_STEPS = [
  "Pending",
  "Approved",
  "Ready for Pickup",
  "Completed",
];

function formatDate(date) {
  if (!date) return "Not scheduled yet";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  const searchOrder = async (event) => {
    event.preventDefault();

    const trimmedOrderId = orderId.trim();

    if (!trimmedOrderId) {
      setError("Please enter your Order ID.");
      setBooking(null);
      setNeedsLogin(false);
      return;
    }

    setLoading(true);
    setError("");
    setBooking(null);
    setNeedsLogin(false);

    try {
      const response = await fetch(
        `${API_URL}/bookings/track/${encodeURIComponent(trimmedOrderId)}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        setNeedsLogin(true);
        throw new Error(
          "Please log in to the account used to create this booking."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "We couldn't find an order with that ID."
        );
      }

      const foundBooking = data.booking || data;

      if (!foundBooking || !foundBooking._id) {
        throw new Error("The server returned invalid booking details.");
      }

      setBooking(foundBooking);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to PawMart. Please check that the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = booking?.status || "Pending";
  const history = Array.isArray(booking?.statusHistory)
    ? booking.statusHistory
    : [];

  const isTerminal =
    currentStatus === "Rejected" || currentStatus === "Cancelled";

  const currentStepIndex = STATUS_STEPS.indexOf(currentStatus);

  const getStepCompleted = (step, index) => {
    if (isTerminal) return false;

    // Use status history when available, with the current status
    // as a fallback for older bookings without a complete history.
    const reachedStatuses = new Set(
      history.map((item) => item.status).filter(Boolean)
    );

    reachedStatuses.add(currentStatus);

    if (reachedStatuses.has(step)) {
      return true;
    }

    return currentStepIndex !== -1 && index < currentStepIndex;
  };

  const resetSearch = () => {
    setBooking(null);
    setError("");
    setNeedsLogin(false);
    setOrderId("");
  };

  return (
    <div className="tracking-page">
      <header className="tracking-header">
        <Link to="/" className="tracking-brand">
          <PawPrint size={27} />
          <span>
            paw<strong>mart</strong>
          </span>
        </Link>

        <Link to="/" className="tracking-back">
          <ArrowLeft size={17} />
          Back to Home
        </Link>
      </header>

      <main className="tracking-main">
        <section className="tracking-hero">
          <div className="tracking-icon">
            <Package size={32} />
          </div>

          <span className="tracking-eyebrow">
            PAWMART ORDER CENTER
          </span>

          <h1>
            Track your <span>order.</span>
          </h1>

          <p>
            Follow your booking and see the latest updates on your
            journey to welcoming your new best friend home.
          </p>

          <form className="tracking-search" onSubmit={searchOrder}>
            <Search size={21} />

            <input
              type="text"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Enter your Order ID"
              aria-label="Order ID"
              autoComplete="off"
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Track Order"}
            </button>
          </form>

          {error && (
            <div className="tracking-error" role="alert">
              <AlertCircle size={19} />
              <span>{error}</span>
            </div>
          )}

          {needsLogin && (
            <Link to="/login" className="tracking-login-button">
              <LogIn size={18} />
              Log In
            </Link>
          )}
        </section>

        {booking && (
          <section className="tracking-result">
            <div className="tracking-result-header">
              <div>
                <span className="tracking-eyebrow">
                  YOUR BOOKING
                </span>
                <h2>Order details</h2>
              </div>

              <span
                className={`tracking-status tracking-status-${currentStatus
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {currentStatus}
              </span>
            </div>

            <div className="tracking-order-id">
              <span>Order ID</span>
              <strong>{booking.orderId || "Unavailable"}</strong>
            </div>

            <div className="tracking-dog-card">
              {booking.dogImage ? (
                <img
                  src={booking.dogImage}
                  alt={booking.dogName || "Booked dog"}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="tracking-dog-placeholder">
                  <PawPrint size={35} />
                </div>
              )}

              <div className="tracking-dog-info">
                <h3>{booking.dogName || "Dog booking"}</h3>
                <p>{booking.breed || "Breed unavailable"}</p>

                {booking.price != null && (
                  <strong>
                    ₹{Number(booking.price).toLocaleString("en-IN")}
                  </strong>
                )}
              </div>
            </div>

            <div className="tracking-information">
              <div>
                <CalendarDays size={20} />
                <span>
                  <small>Pickup date</small>
                  <strong>{formatDate(booking.pickupDate)}</strong>
                </span>
              </div>

              <div>
                <Clock size={20} />
                <span>
                  <small>Booking created</small>
                  <strong>{formatDate(booking.createdAt)}</strong>
                </span>
              </div>
            </div>

            <div className="tracking-timeline">
              <h3>Order progress</h3>

              {isTerminal ? (
                <div className="tracking-error" role="status">
                  <AlertCircle size={20} />
                  <span>
                    This booking has been {currentStatus.toLowerCase()}.
                  </span>
                </div>
              ) : (
                STATUS_STEPS.map((status, index) => {
                  const completed = getStepCompleted(status, index);

                  return (
                    <div
                      className={`timeline-step ${
                        completed ? "completed" : ""
                      }`}
                      key={status}
                    >
                      <div className="timeline-marker">
                        {completed ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </div>

                      <div>
                        <strong>{status}</strong>
                        <p>
                          {completed
                            ? "Status reached"
                            : "Waiting for this step"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {history.length > 0 && (
              <div className="tracking-history">
                <h3>Status history</h3>

                {[...history]
                  .sort(
                    (a, b) =>
                      new Date(b.updatedAt || 0).getTime() -
                      new Date(a.updatedAt || 0).getTime()
                  )
                  .map((item, index) => (
                    <div className="history-item" key={index}>
                      <div>
                        <strong>{item.status || "Status update"}</strong>
                        {item.note && <p>{item.note}</p>}
                      </div>

                      <time>
                        {formatDateTime(item.updatedAt)}
                      </time>
                    </div>
                  ))}
              </div>
            )}

            <div className="tracking-actions">
              <Link to="/dogs" className="tracking-browse-button">
                Explore More Dogs
              </Link>

              <button
                type="button"
                className="tracking-refresh-button"
                onClick={searchOrder}
                disabled={loading}
                onMouseDown={(event) => event.preventDefault()}
              >
                <RefreshCw size={17} />
                Track Again
              </button>

              <button
                type="button"
                className="tracking-reset-button"
                onClick={resetSearch}
              >
                Search Another Order
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="tracking-footer">
        Made with love for paws and people <PawPrint size={16} />
      </footer>
    </div>
  );
}

export default OrderTracking;