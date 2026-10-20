import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PawPrint,
  LayoutDashboard,
  ClipboardList,
  Search,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  ShieldCheck,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Home,
  Heart,
  UserRound,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import "./AdminAdoptionDashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUSES = ["New", "Contacted", "Closed"];

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClass(status) {
  return String(status || "New").toLowerCase();
}

function getPetTypeLabel(type) {
  return type || "Pet";
}

export default function AdminAdoptionDashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    closed: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [updatingId, setUpdatingId] = useState("");

  // ========================================
  // LOAD ENQUIRIES
  // ========================================

  const loadEnquiries = useCallback(
    async (isRefresh = false) => {
      setLoading(!isRefresh);
      setRefreshing(isRefresh);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
          search: filters.search,
          status: filters.status,
        });

        const response = await fetch(
          `${API_URL}/api/adoption/enquiries?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
          if (response.status === 401) {
            throw new Error(
              "Please log in before accessing the admin dashboard."
            );
          }

          if (response.status === 403) {
            throw new Error(
              "Administrator access is required. Your account must have the admin role."
            );
          }

          throw new Error(
            data.message || "Unable to load adoption enquiries."
          );
        }

        setEnquiries(data.enquiries || []);
        setStats(
          data.stats || {
            total: 0,
            new: 0,
            contacted: 0,
            closed: 0,
          }
        );

        setPages(Math.max(1, data.pages || 1));

        setStatusDrafts((previous) => {
          const next = { ...previous };

          for (const enquiry of data.enquiries || []) {
            next[enquiry._id] = enquiry.status || "New";
          }

          return next;
        });
      } catch (err) {
        setError(
          err.message ||
            "Something went wrong while connecting to the backend."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, filters.search, filters.status]
  );

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  // ========================================
  // SEARCH AND FILTER
  // ========================================

  function handleSearch(event) {
    event.preventDefault();

    setPage(1);

    setFilters((previous) => ({
      ...previous,
      search: searchInput.trim(),
    }));
  }

  function handleStatusFilter(event) {
    setPage(1);

    setFilters((previous) => ({
      ...previous,
      status: event.target.value,
    }));
  }

  function clearFilters() {
    setSearchInput("");
    setPage(1);

    setFilters({
      search: "",
      status: "All",
    });
  }

  // ========================================
  // UPDATE STATUS
  // ========================================

  async function updateStatus(enquiry) {
    const newStatus = statusDrafts[enquiry._id] || enquiry.status;

    if (newStatus === enquiry.status) {
      setNotice("This enquiry already has that status.");
      return;
    }

    setUpdatingId(enquiry._id);
    setNotice("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/adoption/enquiries/${enquiry._id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update the enquiry status."
        );
      }

      setNotice(
        `${enquiry.petName || "Pet"} enquiry updated to ${newStatus}.`
      );

      await loadEnquiries(true);

      // Keep an open details modal synchronized.
      if (selectedEnquiry?._id === enquiry._id && data.enquiry) {
        setSelectedEnquiry(data.enquiry);
      }
    } catch (err) {
      setError(err.message || "Unable to update the enquiry.");
    } finally {
      setUpdatingId("");
    }
  }

  // ========================================
  // DETAILS MODAL
  // ========================================

  function openDetails(enquiry) {
    setSelectedEnquiry(enquiry);
  }

  function closeDetails() {
    setSelectedEnquiry(null);
  }

  useEffect(() => {
    if (!selectedEnquiry) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedEnquiry(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEnquiry]);

  // ========================================
  // DASHBOARD
  // ========================================

  return (
    <main className="paw-admin-page">
      <aside className="paw-admin-sidebar">
        <Link to="/" className="paw-admin-brand">
          <span className="paw-admin-brand-icon">
            <PawPrint size={25} />
          </span>

          <span>
            <strong>PawMart</strong>
            <small>ADMIN PORTAL</small>
          </span>
        </Link>

        <div className="paw-admin-sidebar-label">
          WORKSPACE
        </div>

        <div className="paw-admin-sidebar-link active">
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </div>

        <div className="paw-admin-sidebar-link">
          <ClipboardList size={19} />
          <span>Adoption enquiries</span>
        </div>

        <div className="paw-admin-sidebar-divider" />

        <Link to="/" className="paw-admin-sidebar-link">
          <Home size={19} />
          <span>Visit PawMart</span>
        </Link>

        <div className="paw-admin-sidebar-bottom">
          <div className="paw-admin-security">
            <ShieldCheck size={21} />

            <div>
              <strong>Protected workspace</strong>
              <span>Admin access required</span>
            </div>
          </div>

          <Link to="/" className="paw-admin-back-home">
            <ArrowLeft size={16} />
            Back to website
          </Link>
        </div>
      </aside>

      <section className="paw-admin-main">
        <header className="paw-admin-topbar">
          <div className="paw-admin-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>Adoption enquiries</strong>
          </div>

          <div className="paw-admin-topbar-right">
            <span className="paw-admin-secure-label">
              <ShieldCheck size={15} />
              Secure admin
            </span>

            <span className="paw-admin-avatar">
              <PawPrint size={20} />
            </span>
          </div>
        </header>

        <div className="paw-admin-content">
          <div className="paw-admin-page-heading">
            <div>
              <div className="paw-admin-eyebrow">
                PAWMART MANAGEMENT
              </div>

              <h1>Adoption Dashboard</h1>

              <p>
                Review applications, manage enquiries, and help
                pets find their forever homes.
              </p>
            </div>

            <button
              type="button"
              className="paw-admin-refresh-button"
              onClick={() => loadEnquiries(true)}
              disabled={loading || refreshing}
            >
              <RefreshCw
                size={17}
                className={refreshing ? "paw-admin-spinning" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="paw-admin-alert error" role="alert">
              <AlertCircle size={20} />

              <div>
                <strong>Unable to complete the request</strong>
                <p>{error}</p>

                {error.toLowerCase().includes("log in") && (
                  <Link to="/login" className="paw-admin-alert-link">
                    Go to login
                  </Link>
                )}
              </div>
            </div>
          )}

          {notice && !error && (
            <div className="paw-admin-alert success" role="status">
              <CheckCircle2 size={19} />
              <span>{notice}</span>

              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => setNotice("")}
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Statistics */}

          <section className="paw-admin-stats-grid">
            <article className="paw-admin-stat-card">
              <div className="paw-admin-stat-icon purple">
                <ClipboardList size={22} />
              </div>

              <div className="paw-admin-stat-info">
                <span>Total enquiries</span>
                <strong>{stats.total}</strong>
                <small>All applications received</small>
              </div>
            </article>

            <article className="paw-admin-stat-card">
              <div className="paw-admin-stat-icon amber">
                <Clock3 size={22} />
              </div>

              <div className="paw-admin-stat-info">
                <span>New enquiries</span>
                <strong>{stats.new}</strong>
                <small>Awaiting review</small>
              </div>
            </article>

            <article className="paw-admin-stat-card">
              <div className="paw-admin-stat-icon blue">
                <CheckCircle2 size={22} />
              </div>

              <div className="paw-admin-stat-info">
                <span>Contacted</span>
                <strong>{stats.contacted}</strong>
                <small>Applicants contacted</small>
              </div>
            </article>

            <article className="paw-admin-stat-card">
              <div className="paw-admin-stat-icon green">
                <Heart size={22} />
              </div>

              <div className="paw-admin-stat-info">
                <span>Closed enquiries</span>
                <strong>{stats.closed}</strong>
                <small>Marked as closed</small>
              </div>
            </article>
          </section>

          {/* Enquiry list */}

          <section className="paw-admin-panel">
            <div className="paw-admin-panel-heading">
              <div>
                <h2>Adoption applications</h2>

                <p>
                  View and manage the enquiries stored in MongoDB.
                </p>
              </div>

              <span className="paw-admin-total-pill">
                {loading ? "Loading..." : `${enquiries.length} shown`}
              </span>
            </div>

            <form
              className="paw-admin-filters"
              onSubmit={handleSearch}
            >
              <div className="paw-admin-search">
                <Search size={19} />

                <input
                  type="search"
                  placeholder="Search pet, applicant, email or phone..."
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  aria-label="Search adoption enquiries"
                />
              </div>

              <select
                value={filters.status}
                onChange={handleStatusFilter}
                aria-label="Filter enquiries by status"
              >
                <option value="All">All statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Closed">Closed</option>
              </select>

              <button type="submit" className="paw-admin-search-button">
                Search
              </button>

              <button
                type="button"
                className="paw-admin-clear-button"
                onClick={clearFilters}
              >
                Clear
              </button>
            </form>

            {loading ? (
              <div className="paw-admin-loading">
                <LoaderCircle
                  size={35}
                  className="paw-admin-spinning"
                />

                <strong>Loading adoption enquiries</strong>

                <span>Connecting to PawMart...</span>
              </div>
            ) : enquiries.length === 0 ? (
              <div className="paw-admin-empty">
                <span className="paw-admin-empty-icon">
                  <PawPrint size={34} />
                </span>

                <h3>No enquiries found</h3>

                <p>
                  Try another search or clear your filters.
                  New applications will appear here once submitted.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="paw-admin-search-button"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="paw-admin-enquiry-list">
                {enquiries.map((enquiry) => {
                  const currentStatus =
                    enquiry.status || "New";

                  const draftStatus =
                    statusDrafts[enquiry._id] || currentStatus;

                  const isUpdating =
                    updatingId === enquiry._id;

                  return (
                    <article
                      className="paw-admin-enquiry-card"
                      key={enquiry._id}
                    >
                      <div className="paw-admin-enquiry-main">
                        <div className="paw-admin-pet-icon">
                          <PawPrint size={23} />
                        </div>

                        <div className="paw-admin-enquiry-summary">
                          <div className="paw-admin-enquiry-title-row">
                            <h3>
                              {enquiry.petName || "Unnamed pet"}
                            </h3>

                            <span
                              className={`paw-admin-status ${statusClass(
                                currentStatus
                              )}`}
                            >
                              <span />
                              {currentStatus}
                            </span>
                          </div>

                          <p className="paw-admin-pet-description">
                            {enquiry.petBreed || "Breed not specified"}
                            {" · "}
                            {getPetTypeLabel(enquiry.petType)}
                            {enquiry.petAge
                              ? ` · ${enquiry.petAge}`
                              : ""}
                          </p>

                          <div className="paw-admin-applicant-info">
                            <span>
                              <UserRound size={15} />
                              {enquiry.name}
                            </span>

                            <span>
                              <Mail size={15} />
                              {enquiry.email}
                            </span>

                            <span>
                              <CalendarDays size={15} />
                              {formatDate(enquiry.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="paw-admin-enquiry-actions">
                        <button
                          type="button"
                          className="paw-admin-view-button"
                          onClick={() => openDetails(enquiry)}
                        >
                          <Eye size={17} />
                          View details
                        </button>

                        <div className="paw-admin-status-editor">
                          <select
                            value={draftStatus}
                            onChange={(event) =>
                              setStatusDrafts((previous) => ({
                                ...previous,
                                [enquiry._id]: event.target.value,
                              }))
                            }
                            aria-label={`Update status for ${enquiry.petName}`}
                            disabled={isUpdating}
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            className="paw-admin-save-status"
                            onClick={() => updateStatus(enquiry)}
                            disabled={
                              isUpdating ||
                              draftStatus === currentStatus
                            }
                          >
                            {isUpdating ? "Saving..." : "Update"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && pages > 1 && (
              <div className="paw-admin-pagination">
                <span>
                  Page {page} of {pages}
                </span>

                <div>
                  <button
                    type="button"
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    disabled={page <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={19} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((value) => Math.min(pages, value + 1))
                    }
                    disabled={page >= pages}
                    aria-label="Next page"
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              </div>
            )}
          </section>

          <footer className="paw-admin-footer">
            <span>
              <ShieldCheck size={16} />
              PawMart protected administration
            </span>

            <span>Adoption management</span>
          </footer>
        </div>
      </section>

      {/* Details modal */}

      {selectedEnquiry && (
        <div
          className="paw-admin-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDetails();
            }
          }}
        >
          <section
            className="paw-admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="paw-admin-modal-title"
          >
            <header className="paw-admin-modal-header">
              <div className="paw-admin-modal-pet-icon">
                <PawPrint size={25} />
              </div>

              <div>
                <span>ADOPTION APPLICATION</span>

                <h2 id="paw-admin-modal-title">
                  {selectedEnquiry.petName || "Pet enquiry"}
                </h2>
              </div>

              <button
                type="button"
                className="paw-admin-modal-close"
                onClick={closeDetails}
                aria-label="Close enquiry details"
              >
                <X size={21} />
              </button>
            </header>

            <div className="paw-admin-modal-body">
              <div className="paw-admin-modal-section-title">
                Pet information
              </div>

              <div className="paw-admin-detail-grid">
                <DetailItem
                  label="Pet name"
                  value={selectedEnquiry.petName}
                />

                <DetailItem
                  label="Breed"
                  value={selectedEnquiry.petBreed}
                />

                <DetailItem
                  label="Pet type"
                  value={selectedEnquiry.petType}
                />

                <DetailItem
                  label="Age"
                  value={selectedEnquiry.petAge}
                />

                <DetailItem
                  label="Gender"
                  value={selectedEnquiry.petGender}
                />

                <DetailItem
                  label="Location"
                  value={selectedEnquiry.petLocation}
                  icon={<MapPin size={15} />}
                />
              </div>

              <div className="paw-admin-modal-divider" />

              <div className="paw-admin-modal-section-title">
                Applicant information
              </div>

              <div className="paw-admin-detail-grid">
                <DetailItem
                  label="Full name"
                  value={selectedEnquiry.name}
                />

                <DetailItem
                  label="Email address"
                  value={selectedEnquiry.email}
                  icon={<Mail size={15} />}
                />

                <DetailItem
                  label="Phone number"
                  value={selectedEnquiry.phone}
                  icon={<Phone size={15} />}
                />

                <DetailItem
                  label="Submitted on"
                  value={formatDate(selectedEnquiry.createdAt)}
                  icon={<CalendarDays size={15} />}
                />
              </div>

              <div className="paw-admin-modal-divider" />

              <div className="paw-admin-modal-section-title">
                Living situation
              </div>

              <div className="paw-admin-message-box">
                {selectedEnquiry.livingSituation ||
                  "No living-situation information was provided."}
              </div>

              <div className="paw-admin-modal-section-title paw-admin-message-heading">
                Applicant message
              </div>

              <div className="paw-admin-message-box">
                {selectedEnquiry.message ||
                  "No additional message was provided."}
              </div>

              <div className="paw-admin-modal-status">
                <span>Current status</span>

                <span
                  className={`paw-admin-status ${statusClass(
                    selectedEnquiry.status
                  )}`}
                >
                  <span />
                  {selectedEnquiry.status || "New"}
                </span>
              </div>
            </div>

            <footer className="paw-admin-modal-footer">
              <button
                type="button"
                className="paw-admin-modal-done"
                onClick={closeDetails}
              >
                Close details
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}

// ========================================
// DETAIL ITEM COMPONENT
// ========================================

function DetailItem({ label, value, icon }) {
  return (
    <div className="paw-admin-detail-item">
      <span>
        {icon}
        {label}
      </span>

      <strong>{value || "Not provided"}</strong>
    </div>
  );
}