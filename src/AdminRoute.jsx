import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { LoaderCircle, ShieldAlert } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminRoute({ children }) {
  const [access, setAccess] = useState("checking");

  useEffect(() => {
    const controller = new AbortController();

    async function verifyAdmin() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (response.status === 401) {
          setAccess("unauthenticated");
          return;
        }

        if (!response.ok) {
          setAccess("error");
          return;
        }

        const data = await response.json();

        if (controller.signal.aborted) return;

        if (!data.success || !data.user) {
          setAccess("unauthenticated");
          return;
        }

        const role = String(data.user.role || "").toLowerCase();

        if (role === "admin") {
          setAccess("admin");
        } else {
          setAccess("forbidden");
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Admin verification failed:", error);
          setAccess("error");
        }
      }
    }

    verifyAdmin();

    return () => {
      controller.abort();
    };
  }, []);

  // Show a loading screen while checking the user's role.
  if (access === "checking") {
    return (
      <div className="admin-route-message">
        <LoaderCircle
          size={36}
          className="admin-route-spinner"
        />

        <h2>Verifying administrator access</h2>

        <p>Please wait while we verify your account.</p>
      </div>
    );
  }

  // Unauthenticated users must log in.
  if (access === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  // Logged-in non-admin users cannot access this page.
  if (access === "forbidden") {
    return <Navigate to="/" replace />;
  }

  // Handle a failed backend request.
  if (access === "error") {
    return (
      <div className="admin-route-message">
        <ShieldAlert size={36} />

        <h2>Unable to verify access</h2>

        <p>
          Please make sure your PawMart backend is running and
          try again.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  // Only administrators can render the dashboard.
  return children;
}