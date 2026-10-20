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

        setAccess(role === "admin" ? "admin" : "forbidden");
      } catch (error) {
        if (error.name !== "AbortError") {
          setAccess("error");
        }
      }
    }

    verifyAdmin();

    return () => controller.abort();
  }, []);

  if (access === "checking") {
    return (
      <div className="admin-route-message">
        <LoaderCircle size={34} className="admin-route-spinner" />
        <h2>Verifying administrator access</h2>
        <p>Please wait while we check your account.</p>
      </div>
    );
  }

  if (access === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (access === "forbidden") {
    return <Navigate to="/" replace />;
  }

  if (access === "error") {
    return (
      <div className="admin-route-message">
        <ShieldAlert size={36} />

        <h2>Unable to verify access</h2>

        <p>
          Please check that the PawMart backend is running and try again.
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

  return children;
}