// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   CheckCircle,
//   CreditCard,
//   ShieldCheck,
//   Smartphone,
//   Wallet,
//   Banknote,
//   LoaderCircle,
//   AlertCircle,
// } from "lucide-react";
// import "./Payment.css";

// const API_BASE = "http://localhost:5000/api";

// /* =========================================
//    RAZORPAY SCRIPT
// ========================================= */

// function loadRazorpayScript() {
//   return new Promise((resolve) => {
//     if (window.Razorpay) {
//       resolve(true);
//       return;
//     }

//     const scriptUrl =
//       "https://checkout.razorpay.com/v1/checkout.js";

//     const existingScript = document.querySelector(
//       `script[src="${scriptUrl}"]`
//     );

//     if (existingScript) {
//       existingScript.addEventListener(
//         "load",
//         () => resolve(true),
//         { once: true }
//       );

//       existingScript.addEventListener(
//         "error",
//         () => resolve(false),
//         { once: true }
//       );

//       // Handle a script that has already loaded.
//       if (window.Razorpay) {
//         resolve(true);
//       }

//       return;
//     }

//     const script = document.createElement("script");

//     script.src = scriptUrl;
//     script.async = true;

//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);

//     document.body.appendChild(script);
//   });
// }

// /* =========================================
//    PET ID HELPERS
// ========================================= */

// function extractPetId(value) {
//   if (!value) return "";

//   if (typeof value === "string") {
//     return value.trim();
//   }

//   if (typeof value === "object") {
//     const possibleId =
//       value._id ??
//       value.id ??
//       value.petId ??
//       value.listingId;

//     if (typeof possibleId === "string") {
//       return possibleId.trim();
//     }

//     if (
//       possibleId &&
//       typeof possibleId === "object" &&
//       typeof possibleId.toString === "function"
//     ) {
//       return possibleId.toString();
//     }

//     if (
//       possibleId &&
//       typeof possibleId !== "object"
//     ) {
//       return String(possibleId);
//     }
//   }

//   return "";
// }

// /* =========================================
//    API ERROR HELPER
// ========================================= */

// function getApiErrorMessage(status, data) {
//   const backendMessage =
//     data?.message || data?.error;

//   if (status === 401) {
//     return (
//       backendMessage ||
//       "Your session is missing or expired. Please log in again."
//     );
//   }

//   if (status === 403) {
//     return (
//       backendMessage ||
//       "You are not authorized to perform this action."
//     );
//   }

//   return (
//     backendMessage ||
//     `Request failed with status ${status}.`
//   );
// }

// /* =========================================
//    PAYMENT COMPONENT
// ========================================= */

// export default function Payment() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Read booking information from the previous page.
//   const state = location.state || {};

//   const pet =
//     state.pet ||
//     state.listing ||
//     state.selectedPet ||
//     null;

//     const productType =
//   location.state?.productType ||
//   location.state?.pet?.productType ||
//   "PetListing";

// const catalogBreedId =
//   location.state?.catalogBreedId ||
//   (productType === "Breed"
//     ? location.state?.pet?._id || location.state?.pet?.id
//     : null);

//   const customer =
//     state.customer ||
//     state.bookingDetails ||
//     null;

//   // Support different navigation-state ID formats.
//   const petId =
//     extractPetId(pet) ||
//     extractPetId(state.petId) ||
//     extractPetId(state.listingId);

//   const [paymentMethod, setPaymentMethod] =
//     useState("razorpay");

//   const [paymentStatus, setPaymentStatus] =
//     useState("pending");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [bookingId, setBookingId] = useState("");
//   const [orderId, setOrderId] = useState("");

//   /* =========================================
//      API REQUEST
//   ========================================= */

//   async function apiRequest(path, options = {}) {
//     let response;

//     try {
//       response = await fetch(`${API_BASE}${path}`, {
//         ...options,
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           ...(options.headers || {}),
//         },
//       });
//     } catch (err) {
//       console.error("PawMart API connection error:", err);

//       throw new Error(
//         "Unable to connect to PawMart's server. Make sure the backend is running on port 5000."
//       );
//     }

//     const data = await response
//       .json()
//       .catch(() => ({}));

//     if (!response.ok) {
//       console.error("PawMart API error:", {
//         path,
//         status: response.status,
//         response: data,
//       });

//       throw new Error(
//         getApiErrorMessage(response.status, data)
//       );
//     }

//     return data;
//   }

//   /* =========================================
//      BOOKING NOTES
//   ========================================= */

//   function getBookingNotes() {
//     return [
//       customer?.name
//         ? `Contact name: ${customer.name}`
//         : "",
//       customer?.phone
//         ? `Phone: ${customer.phone}`
//         : "",
//       customer?.notes || "",
//     ]
//       .filter(Boolean)
//       .join("\n");
//   }

//   /* =========================================
//      RAZORPAY PAYMENT
//   ========================================= */

//   async function handleRazorpayPayment() {
//     if (!pet || !customer) {
//       setError(
//         "Booking details are missing. Please go back and select a pet again."
//       );
//       return;
//     }

//     if (!petId) {
//       setError(
//         "Pet listing ID is missing. Please return to the pet listing and try again."
//       );

//       console.error(
//         "PawMart: Missing pet listing ID.",
//         {
//           pet,
//           navigationState: state,
//         }
//       );

//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const scriptLoaded =
//         await loadRazorpayScript();

//       if (!scriptLoaded) {
//         throw new Error(
//           "Unable to load Razorpay checkout. Please check your internet connection."
//         );
//       }

//       // The backend must fetch the pet listing and
//       // calculate the amount from its trusted database data.
//       const orderData = await apiRequest(
//         "/bookings/create-payment-order",
//         {
//           method: "POST",
//          body: JSON.stringify({
//   productType,

//   ...(productType === "Breed"
//     ? { catalogBreedId }
//     : { petId }),

//   notes,
// }),
//         }
//       );

//       const createdBookingId =
//         orderData.bookingId ||
//         orderData.booking?._id ||
//         orderData.booking?.id;

//       const razorpayOrderId =
//         orderData.orderId ||
//         orderData.order?.id;

//       const keyId =
//         orderData.keyId ||
//         orderData.key;

//       if (
//         !createdBookingId ||
//         !razorpayOrderId
//       ) {
//         throw new Error(
//           "The server did not return a booking ID and Razorpay order ID."
//         );
//       }

//       if (!keyId) {
//         throw new Error(
//           "Razorpay key ID is missing from the backend response."
//         );
//       }

//       if (
//         !orderData.amount ||
//         Number(orderData.amount) <= 0
//       ) {
//         throw new Error(
//           "The backend returned an invalid payment amount."
//         );
//       }

//       setBookingId(String(createdBookingId));
//       setOrderId(String(razorpayOrderId));

//       const razorpay = new window.Razorpay({
//         key: keyId,
//         order_id: razorpayOrderId,
//         amount: orderData.amount,
//         currency: orderData.currency || "INR",

//         name: "PawMart",

//         description: `Booking for ${
//           pet.name || "selected pet"
//         }`,

//         prefill: {
//           name: customer.name || "",
//           contact: customer.phone || "",
//         },

//         theme: {
//           color: "#16a34a",
//         },

//         modal: {
//           ondismiss: () => {
//             setLoading(false);

//             setError(
//               "Checkout was closed. Your booking may remain pending. Check your booking status before trying again."
//             );
//           },
//         },

//         handler: async (razorpayResponse) => {
//           try {
//             setError("");

//             const verification = await apiRequest(
//               "/bookings/verify-payment",
//               {
//                 method: "POST",
//                 body: JSON.stringify({
//                   bookingId: String(
//                     createdBookingId
//                   ),

//                   razorpay_order_id:
//                     razorpayResponse.razorpay_order_id,

//                   razorpay_payment_id:
//                     razorpayResponse.razorpay_payment_id,

//                   razorpay_signature:
//                     razorpayResponse.razorpay_signature,
//                 }),
//               }
//             );

//             if (!verification.success) {
//               throw new Error(
//                 verification.message ||
//                   "The server could not verify your payment."
//               );
//             }

//             setPaymentStatus("success");
//           } catch (err) {
//             console.error(
//               "PawMart payment verification error:",
//               err
//             );

//             setError(
//               err.message ||
//                 "Payment verification failed. Check your booking status before retrying."
//             );
//           } finally {
//             setLoading(false);
//           }
//         },
//       });

//       razorpay.on(
//         "payment.failed",
//         (response) => {
//           setError(
//             response.error?.description ||
//               "Payment failed. Please try again."
//           );

//           setLoading(false);
//         }
//       );

//       razorpay.open();
//     } catch (err) {
//       console.error(
//         "PawMart payment initialization error:",
//         err
//       );

//       setError(
//         err.message ||
//           "Unable to start payment. Please try again."
//       );

//       setLoading(false);
//     }
//   }

//   /* =========================================
//      CASH ON DELIVERY
//   ========================================= */

//   async function handleCODPayment() {
//     if (!pet || !customer) {
//       setError(
//         "Booking details are missing. Please select a pet again."
//       );
//       return;
//     }

//     if (!petId) {
//       setError(
//         "Pet listing ID is missing. Return to the pet listing and try again."
//       );

//       console.error(
//         "PawMart: Missing pet listing ID.",
//         {
//           pet,
//           navigationState: state,
//         }
//       );

//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const data = await apiRequest(
//         "/bookings/cod",
//         {
//           method: "POST",
//           body: JSON.stringify({
//             petId,
//             notes: getBookingNotes(),
//           }),
//         }
//       );

//       const createdBookingId =
//         data.bookingId ||
//         data.booking?._id ||
//         data.booking?.id ||
//         data._id;

//       setBookingId(
//         createdBookingId
//           ? String(createdBookingId)
//           : ""
//       );

//       setOrderId(
//         data.orderId ||
//           data.booking?.orderId ||
//           ""
//       );

//       setPaymentStatus("cod-success");
//     } catch (err) {
//       console.error(
//         "PawMart COD booking error:",
//         err
//       );

//       setError(
//         err.message ||
//           "Unable to place your COD booking. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* =========================================
//      SUBMIT PAYMENT
//   ========================================= */

//   async function handleSubmitPayment() {
//     if (loading) return;

//     setError("");

//     if (paymentMethod === "cod") {
//       await handleCODPayment();
//     } else {
//       await handleRazorpayPayment();
//     }
//   }

//   /* =========================================
//      MISSING BOOKING DETAILS
//   ========================================= */

//   if (!pet || !customer) {
//     return (
//       <main className="pm-payment-page">
//         <section className="pm-payment-card">
//           <AlertCircle
//             size={48}
//             color="#dc2626"
//           />

//           <h1>Booking details not found</h1>

//           <p>
//             Please select a pet and enter your booking
//             details before proceeding to checkout.
//           </p>

//           <button
//             className="pm-pay-button"
//             onClick={() => navigate("/dogs")}
//           >
//             Browse Pets
//           </button>
//         </section>
//       </main>
//     );
//   }

//   /* =========================================
//      PAYMENT SUCCESS
//   ========================================= */

//   if (
//     paymentStatus === "success" ||
//     paymentStatus === "cod-success"
//   ) {
//     const isCOD =
//       paymentStatus === "cod-success";

//     return (
//       <main className="pm-payment-page">
//         <section className="pm-payment-card pm-payment-success">
//           <CheckCircle size={64} />

//           <h1>
//             {isCOD
//               ? "Booking Placed Successfully!"
//               : "Payment Successful!"}
//           </h1>

//           <p>
//             Your booking for{" "}
//             <strong>
//               {pet.name || "your selected pet"}
//             </strong>{" "}
//             has been recorded.
//           </p>

//           <div className="pm-success-details">
//             <p>
//               <strong>Pet:</strong>{" "}
//               {pet.name || "Not specified"}
//             </p>

//             <p>
//               <strong>Breed:</strong>{" "}
//               {pet.breed || "Not specified"}
//             </p>

//             <p>
//               <strong>Amount:</strong>{" "}
//               ₹
//               {Number(
//                 pet.price || 0
//               ).toLocaleString("en-IN")}
//             </p>

//             <p>
//               <strong>Payment method:</strong>{" "}
//               {isCOD
//                 ? "Cash on Delivery"
//                 : "Razorpay"}
//             </p>

//             <p>
//               <strong>Payment status:</strong>{" "}
//               {isCOD
//                 ? "Payment pending — pay the seller"
//                 : "Verified by the server"}
//             </p>

//             {bookingId && (
//               <p>
//                 <strong>Booking ID:</strong>{" "}
//                 {bookingId}
//               </p>
//             )}

//             {orderId && (
//               <p>
//                 <strong>Order ID:</strong>{" "}
//                 {orderId}
//               </p>
//             )}
//           </div>

//           {isCOD && (
//             <p className="pm-payment-disclaimer">
//               Please pay the seller when the pet is
//               handed over. Your payment has not been
//               collected yet.
//             </p>
//           )}

//           <button
//             className="pm-pay-button"
//             onClick={() => navigate("/profile")}
//           >
//             Go to My Profile
//           </button>

//           <button
//             className="pm-back-button"
//             onClick={() => navigate("/dogs")}
//           >
//             Browse More Pets
//           </button>
//         </section>
//       </main>
//     );
//   }

//   /* =========================================
//      CHECKOUT PAGE
//   ========================================= */

//   return (
//     <main className="pm-payment-page">
//       <div className="pm-payment-container">
//         <button
//           className="pm-back-button"
//           onClick={() => navigate(-1)}
//           disabled={loading}
//         >
//           <ArrowLeft size={18} />
//           Go Back
//         </button>

//         <header className="pm-payment-heading">
//           <span className="pm-payment-label">
//             PAWMART CHECKOUT
//           </span>

//           <h1>Complete your booking</h1>

//           <p>
//             Review your selected pet before continuing.
//           </p>
//         </header>

//         <section className="pm-payment-card">
//           <div className="pm-payment-notice">
//             <ShieldCheck size={22} />

//             <div>
//               <strong>
//                 Secure PawMart checkout
//               </strong>

//               <p>
//                 Online payments must be verified by
//                 the backend. COD bookings remain
//                 unpaid until cash is collected.
//               </p>
//             </div>
//           </div>

//           <div className="pm-order-summary">
//             {pet.image && (
//               <img
//                 src={pet.image}
//                 alt={pet.name || "Selected pet"}
//                 className="pm-order-image"
//               />
//             )}

//             <div>
//               <h2>
//                 {pet.name || "Selected pet"}
//               </h2>

//               <p>
//                 {pet.breed || "Breed not specified"}
//               </p>

//               <strong>
//                 ₹
//                 {Number(
//                   pet.price || 0
//                 ).toLocaleString("en-IN")}
//               </strong>
//             </div>
//           </div>

//           <div className="pm-customer-summary">
//             <h3>Booking details</h3>

//             <p>
//               <strong>Name:</strong>{" "}
//               {customer.name || "Not provided"}
//             </p>

//             <p>
//               <strong>Phone:</strong>{" "}
//               {customer.phone || "Not provided"}
//             </p>
//           </div>

//           <h2>Choose a payment method</h2>

//           <button
//             type="button"
//             className={`pm-payment-option ${
//               paymentMethod === "razorpay"
//                 ? "selected"
//                 : ""
//             }`}
//             onClick={() =>
//               setPaymentMethod("razorpay")
//             }
//             disabled={loading}
//           >
//             <CreditCard size={24} />

//             <span>
//               <strong>Online Payment</strong>

//               <small>
//                 UPI, credit cards, debit cards and
//                 supported methods
//               </small>
//             </span>

//             <span className="pm-radio">
//               {paymentMethod === "razorpay"
//                 ? "●"
//                 : "○"}
//             </span>
//           </button>

//           <button
//             type="button"
//             className={`pm-payment-option ${
//               paymentMethod === "cod"
//                 ? "selected"
//                 : ""
//             }`}
//             onClick={() =>
//               setPaymentMethod("cod")
//             }
//             disabled={loading}
//           >
//             <Banknote size={24} />

//             <span>
//               <strong>Cash on Delivery</strong>

//               <small>
//                 Pay the seller when you receive the pet
//               </small>
//             </span>

//             <span className="pm-radio">
//               {paymentMethod === "cod"
//                 ? "●"
//                 : "○"}
//             </span>
//           </button>

//           {error && (
//             <p
//               className="pm-payment-error"
//               role="alert"
//             >
//               {error}
//             </p>
//           )}

//           <button
//             type="button"
//             className="pm-pay-button"
//             onClick={handleSubmitPayment}
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <LoaderCircle
//                   size={18}
//                   className="pm-spinner"
//                 />

//                 {paymentMethod === "cod"
//                   ? "Placing Booking..."
//                   : "Processing Payment..."}
//               </>
//             ) : paymentMethod === "cod" ? (
//               <>
//                 <Wallet size={18} />
//                 Place COD Booking
//               </>
//             ) : (
//               <>
//                 <Smartphone size={18} />
//                 Pay ₹
//                 {Number(
//                   pet.price || 0
//                 ).toLocaleString("en-IN")}
//               </>
//             )}
//           </button>

//           <p className="pm-payment-disclaimer">
//             {paymentMethod === "cod"
//               ? "No payment is collected now. Pay the seller when you receive the pet."
//               : "Razorpay will open its secure checkout. The backend must verify your payment."}
//           </p>
//         </section>
//       </div>
//     </main>
//   );
// }


import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  Smartphone,
  Wallet,
  Banknote,
  LoaderCircle,
  AlertCircle,
  PawPrint,
  Info,
} from "lucide-react";
import "./Payment.css";

const API_BASE = "http://localhost:5000/api";

/* =========================================
   RAZORPAY SCRIPT
========================================= */

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const scriptUrl =
      "https://checkout.razorpay.com/v1/checkout.js";

    const existingScript = document.querySelector(
      `script[src="${scriptUrl}"]`
    );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => resolve(Boolean(window.Razorpay)),
        { once: true }
      );

      existingScript.addEventListener(
        "error",
        () => resolve(false),
        { once: true }
      );

      if (window.Razorpay) {
        resolve(true);
      }

      return;
    }

    const script = document.createElement("script");

    script.src = scriptUrl;
    script.async = true;

    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

/* =========================================
   ID HELPERS
========================================= */

function extractPetId(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object") {
    const possibleId =
      value._id ??
      value.id ??
      value.petId ??
      value.listingId;

    if (typeof possibleId === "string") {
      return possibleId.trim();
    }

    if (
      possibleId &&
      typeof possibleId.toString === "function"
    ) {
      return possibleId.toString();
    }

    if (
      possibleId !== undefined &&
      possibleId !== null
    ) {
      return String(possibleId);
    }
  }

  return "";
}

function isValidMongoId(id) {
  return /^[a-f\d]{24}$/i.test(String(id || ""));
}

/* =========================================
   API ERROR HELPER
========================================= */

function getApiErrorMessage(status, data) {
  const backendMessage =
    data?.message || data?.error;

  if (status === 401) {
    return (
      backendMessage ||
      "Your session is missing or expired. Please log in again."
    );
  }

  if (status === 403) {
    return (
      backendMessage ||
      "You are not authorized to perform this action."
    );
  }

  return (
    backendMessage ||
    `Request failed with status ${status}.`
  );
}

/* =========================================
   CURRENCY FORMATTER
========================================= */

function formatMoney(amount) {
  const value = Number(amount);

  if (!Number.isFinite(value) || value < 0) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

/* =========================================
   PAYMENT COMPONENT
========================================= */

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};

  const pet =
    state.pet ||
    state.listing ||
    state.selectedPet ||
    null;

  // Identify the selected product.
  const productType =
    state.productType ||
    pet?.productType ||
    "PetListing";

  const isBreedPurchase =
    productType === "Breed";

  // Breed purchases use catalogBreedId.
  // Individual pet purchases use petId.
  const catalogBreedId = isBreedPurchase
    ? extractPetId(
        state.catalogBreedId ||
          pet?._id ||
          pet?.id
      )
    : "";

  const extractedPetId =
    extractPetId(pet) ||
    extractPetId(state.petId) ||
    extractPetId(state.listingId);

  const petId = isBreedPurchase
    ? ""
    : extractedPetId;

  // Customer information from the previous page.
  const initialCustomer =
    state.customer ||
    state.bookingDetails ||
    {};

  const [customerName, setCustomerName] = useState(
    initialCustomer.name || ""
  );

  const [phone, setPhone] = useState(
    initialCustomer.phone || ""
  );

  const [notes, setNotes] = useState(
    initialCustomer.notes || ""
  );

  const [paymentMethod, setPaymentMethod] =
    useState("razorpay");

  const [paymentStatus, setPaymentStatus] =
    useState("pending");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [bookingId, setBookingId] = useState("");
  const [orderId, setOrderId] = useState("");

  const [confirmedPrice, setConfirmedPrice] =
    useState(null);

  /* =========================================
     CUSTOMER DETAILS
  ========================================= */

  function validateCustomerDetails() {
    if (customerName.trim().length < 2) {
      return "Please enter your full name.";
    }

    if (!/^[+]?[\d\s()-]{8,20}$/.test(phone.trim())) {
      return "Please enter a valid phone number.";
    }

    return "";
  }

  function getBookingNotes() {
    return [
      customerName.trim()
        ? `Contact name: ${customerName.trim()}`
        : "",

      phone.trim()
        ? `Phone: ${phone.trim()}`
        : "",

      notes.trim(),
    ]
      .filter(Boolean)
      .join("\n");
  }

  /* =========================================
     API REQUEST
  ========================================= */

  async function apiRequest(path, options = {}) {
    let response;

    try {
      response = await fetch(`${API_BASE}${path}`, {
        ...options,

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });
    } catch (err) {
      console.error(
        "PawMart API connection error:",
        err
      );

      throw new Error(
        "Unable to connect to PawMart's server. Make sure the backend is running on port 5000."
      );
    }

    const data = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      console.error("PawMart API error:", {
        path,
        status: response.status,
        response: data,
      });

      throw new Error(
        getApiErrorMessage(response.status, data)
      );
    }

    return data;
  }

  /* =========================================
     VALIDATE CHECKOUT
  ========================================= */

  function validateCheckout() {
    if (!pet) {
      return "Selected product details are missing. Please return to the catalogue and select a product again.";
    }

    if (isBreedPurchase) {
      if (!isValidMongoId(catalogBreedId)) {
        return "The breed's MongoDB ID is missing or invalid. Please return to the breed catalogue and try again.";
      }
    } else {
      if (!isValidMongoId(petId)) {
        return "The individual pet listing ID is missing or invalid. Please return to the pet listing and try again.";
      }
    }

    return validateCustomerDetails();
  }

  /* =========================================
     RAZORPAY PAYMENT
  ========================================= */

  async function handleRazorpayPayment() {
    const validationError = validateCheckout();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Unable to load Razorpay checkout. Please check your internet connection."
        );
      }

      // The backend obtains the price from MongoDB.
      const requestBody = {
        productType,

        ...(isBreedPurchase
          ? { catalogBreedId }
          : { petId }),

        notes: getBookingNotes(),
      };

      const orderData = await apiRequest(
        "/bookings/create-payment-order",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      if (orderData.success === false) {
        throw new Error(
          orderData.message ||
            "Unable to create a payment order."
        );
      }

      const createdBookingId =
        orderData.bookingId ||
        orderData.booking?._id ||
        orderData.booking?.id;

      const razorpayOrderId =
        orderData.orderId ||
        orderData.order?.id;

      const keyId =
        orderData.keyId ||
        orderData.key;

      const serverAmount = Number(orderData.amount);

      if (!createdBookingId || !razorpayOrderId) {
        throw new Error(
          "The server did not return a booking ID and Razorpay order ID."
        );
      }

      if (!keyId) {
        throw new Error(
          "Razorpay key ID is missing from the backend response."
        );
      }

      // Razorpay expects amounts in paise.
      if (
        !Number.isSafeInteger(serverAmount) ||
        serverAmount <= 0
      ) {
        throw new Error(
          "The backend returned an invalid payment amount."
        );
      }

      setBookingId(String(createdBookingId));
      setOrderId(String(razorpayOrderId));

      // Use the server's product price for the summary.
      const serverPrice =
        orderData.product?.price ??
        orderData.pet?.price;

      if (
        serverPrice !== undefined &&
        serverPrice !== null &&
        Number.isFinite(Number(serverPrice)) &&
        Number(serverPrice) >= 0
      ) {
        setConfirmedPrice(Number(serverPrice));
      } else {
        setConfirmedPrice(serverAmount / 100);
      }

      const productName =
        orderData.product?.name ||
        orderData.pet?.name ||
        pet.name ||
        pet.breed ||
        "Selected product";

      const razorpay = new window.Razorpay({
        key: keyId,

        order_id: razorpayOrderId,
        amount: serverAmount,
        currency: orderData.currency || "INR",

        name: "PawMart",

        description: isBreedPurchase
          ? `Breed catalogue product: ${productName}`
          : `Pet booking: ${productName}`,

        prefill: {
          name: customerName.trim(),
          contact: phone.trim(),
        },

        theme: {
          color: "#16a34a",
        },

        modal: {
          ondismiss: () => {
            setLoading(false);

            setError(
              "Checkout was closed. Your booking may remain pending. Check your booking status before trying again."
            );
          },
        },

        handler: async (razorpayResponse) => {
          try {
            setError("");

            const verification = await apiRequest(
              "/bookings/verify-payment",
              {
                method: "POST",

                body: JSON.stringify({
                  bookingId: String(createdBookingId),

                  razorpay_order_id:
                    razorpayResponse.razorpay_order_id,

                  razorpay_payment_id:
                    razorpayResponse.razorpay_payment_id,

                  razorpay_signature:
                    razorpayResponse.razorpay_signature,
                }),
              }
            );

            if (!verification.success) {
              throw new Error(
                verification.message ||
                  "The server could not verify your payment."
              );
            }

            if (verification.booking?.price != null) {
              setConfirmedPrice(
                Number(verification.booking.price)
              );
            }

            setPaymentStatus("success");
          } catch (err) {
            console.error(
              "PawMart payment verification error:",
              err
            );

            setError(
              err.message ||
                "Payment verification failed. Check your booking status before retrying."
            );
          } finally {
            setLoading(false);
          }
        },
      });

      razorpay.on("payment.failed", (response) => {
        setError(
          response.error?.description ||
            "Payment failed. Please try again."
        );

        setLoading(false);
      });

      razorpay.open();
    } catch (err) {
      console.error(
        "PawMart payment initialization error:",
        err
      );

      setError(
        err.message ||
          "Unable to start payment. Please try again."
      );

      setLoading(false);
    }
  }

  /* =========================================
     CASH ON DELIVERY
     Supports both breeds and individual pets
  ========================================= */

  async function handleCODPayment() {
    const validationError = validateCheckout();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * IMPORTANT:
       * A breed uses catalogBreedId.
       * An individual pet uses petId.
       *
       * The backend must support both product types
       * in POST /api/bookings/cod.
       */

      const requestBody = {
        productType,

        ...(isBreedPurchase
          ? { catalogBreedId }
          : { petId }),

        notes: getBookingNotes(),
      };

      const data = await apiRequest(
        "/bookings/cod",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      if (data.success === false) {
        throw new Error(
          data.message ||
            "Unable to create the COD order."
        );
      }

      const createdBookingId =
        data.bookingId ||
        data.booking?._id ||
        data.booking?.id ||
        data._id;

      setBookingId(
        createdBookingId
          ? String(createdBookingId)
          : ""
      );

      setOrderId(
        data.orderId ||
          data.booking?.orderId ||
          ""
      );

      // Prefer the database price returned by the server.
      if (
        data.price !== undefined &&
        data.price !== null
      ) {
        setConfirmedPrice(Number(data.price));
      } else if (data.booking?.price != null) {
        setConfirmedPrice(Number(data.booking.price));
      }

      setPaymentStatus("cod-success");
    } catch (err) {
      console.error(
        "PawMart COD booking error:",
        err
      );

      setError(
        err.message ||
          "Unable to place your COD order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================
     SUBMIT PAYMENT
  ========================================= */

  async function handleSubmitPayment() {
    if (loading) {
      return;
    }

    setError("");

    if (paymentMethod === "cod") {
      await handleCODPayment();
    } else {
      await handleRazorpayPayment();
    }
  }

  /* =========================================
     MISSING PRODUCT DETAILS
  ========================================= */

  if (!pet) {
    return (
      <main className="pm-payment-page">
        <section className="pm-payment-card">
          <AlertCircle
            size={48}
            color="#dc2626"
          />

          <h1>Product details not found</h1>

          <p>
            Please select a breed or an individual pet
            before proceeding to checkout.
          </p>

          <button
            className="pm-pay-button"
            onClick={() => navigate("/dogs")}
          >
            Browse Breeds and Pets
          </button>
        </section>
      </main>
    );
  }

  /* =========================================
     PAYMENT / COD SUCCESS
  ========================================= */

  if (
    paymentStatus === "success" ||
    paymentStatus === "cod-success"
  ) {
    const isCOD =
      paymentStatus === "cod-success";

    const displayedPrice =
      confirmedPrice != null
        ? confirmedPrice
        : Number(pet.price || 0);

    return (
      <main className="pm-payment-page">
        <section className="pm-payment-card pm-payment-success">
          <CheckCircle size={64} />

          <h1>
            {isCOD
              ? "COD Order Placed Successfully!"
              : "Payment Successful!"}
          </h1>

          <p>
            Your{" "}
            <strong>
              {isBreedPurchase
                ? "catalogue order"
                : "booking"}{" "}
              for{" "}
              {pet.name ||
                pet.breed ||
                "your selected product"}
            </strong>{" "}
            has been recorded.
          </p>

          <div className="pm-success-details">
            <p>
              <strong>
                {isBreedPurchase
                  ? "Catalogue product:"
                  : "Pet:"}
              </strong>{" "}
              {pet.name || "Not specified"}
            </p>

            <p>
              <strong>Breed:</strong>{" "}
              {pet.breed ||
                pet.name ||
                "Not specified"}
            </p>

            <p>
              <strong>Amount:</strong>{" "}
              {formatMoney(displayedPrice)}
            </p>

            <p>
              <strong>Payment method:</strong>{" "}
              {isCOD
                ? "Cash on Delivery"
                : "Razorpay"}
            </p>

            <p>
              <strong>Payment status:</strong>{" "}
              {isCOD
                ? "Pending — cash has not been collected"
                : "Verified by the server"}
            </p>

            {bookingId && (
              <p>
                <strong>Booking ID:</strong>{" "}
                {bookingId}
              </p>
            )}

            {orderId && (
              <p>
                <strong>Order ID:</strong>{" "}
                {orderId}
              </p>
            )}
          </div>

          {isCOD && isBreedPurchase && (
            <div
              className="pm-payment-disclaimer"
              role="note"
            >
              <Info size={17} />

              Your breed catalogue COD order has been
              recorded. Availability, fulfilment, delivery
              and cash-collection arrangements still need
              to be confirmed. No cash has been collected.
            </div>
          )}

          {isCOD && !isBreedPurchase && (
            <p className="pm-payment-disclaimer">
              Please pay the seller when the individual
              pet is handed over. Your payment has not
              been collected yet.
            </p>
          )}

          {!isCOD && isBreedPurchase && (
            <div
              className="pm-payment-disclaimer"
              role="note"
            >
              <Info size={17} />

              This payment is for a breed catalogue product.
              Payment confirmation does not independently
              verify that an individual dog is available
              for sale or delivery.
            </div>
          )}

          <button
            className="pm-pay-button"
            onClick={() => navigate("/profile")}
          >
            Go to My Profile
          </button>

          <button
            className="pm-back-button"
            onClick={() => navigate("/dogs")}
          >
            Browse More Breeds and Pets
          </button>
        </section>
      </main>
    );
  }

  /* =========================================
     CHECKOUT PAGE
  ========================================= */

  const displayedName =
    pet.name ||
    pet.breed ||
    "Selected product";

  const displayedBreed =
    pet.breed ||
    pet.name ||
    "Breed not specified";

  const displayedPrice =
    confirmedPrice != null
      ? confirmedPrice
      : Number(pet.price || 0);

  return (
    <main className="pm-payment-page">
      <div className="pm-payment-container">
        <button
          className="pm-back-button"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        <header className="pm-payment-heading">
          <span className="pm-payment-label">
            PAWMART CHECKOUT
          </span>

          <h1>Complete your order</h1>

          <p>
            Review your selected{" "}
            {isBreedPurchase
              ? "breed catalogue product"
              : "pet"}{" "}
            before continuing.
          </p>
        </header>

        <section className="pm-payment-card">
          {/* SECURITY NOTICE */}

          <div className="pm-payment-notice">
            <ShieldCheck size={22} />

            <div>
              <strong>
                Secure PawMart checkout
              </strong>

              <p>
                Online payments are verified by the backend.
                The final payment amount comes from the server.
              </p>
            </div>
          </div>

          {/* PRODUCT SUMMARY */}

          <div className="pm-order-summary">
            {pet.image && (
              <img
                src={pet.image}
                alt={displayedName}
                className="pm-order-image"
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
            )}

            <div>
              <h2>{displayedName}</h2>

              <p>{displayedBreed}</p>

              <strong>
                {formatMoney(displayedPrice)}
              </strong>

              <p>
                {isBreedPurchase
                  ? "Breed catalogue product"
                  : "Individual pet listing"}
              </p>
            </div>
          </div>

          {/* BREED NOTICE */}

          {isBreedPurchase && (
            <div
              className="pm-payment-disclaimer"
              role="note"
            >
              <PawPrint size={18} />

              This is a breed catalogue order, separate
              from the availability of an individual dog.
              Delivery arrangements must be confirmed.
            </div>
          )}

          {/* CUSTOMER DETAILS */}

          <div className="pm-customer-summary">
            <h3>Your contact details</h3>

            <label
              htmlFor="pm-customer-name"
              style={{
                display: "block",
                marginBottom: "12px",
              }}
            >
              Full name

              <input
                id="pm-customer-name"
                type="text"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(event.target.value)
                }
                autoComplete="name"
                minLength={2}
                required
                disabled={loading}
                placeholder="Enter your full name"
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 12px",
                  marginTop: "6px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
              />
            </label>

            <label
              htmlFor="pm-customer-phone"
              style={{
                display: "block",
                marginBottom: "12px",
              }}
            >
              Phone number

              <input
                id="pm-customer-phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                autoComplete="tel"
                required
                disabled={loading}
                placeholder="Enter your phone number"
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 12px",
                  marginTop: "6px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
              />
            </label>

            <label
              htmlFor="pm-customer-notes"
              style={{
                display: "block",
                marginBottom: "8px",
              }}
            >
              Notes (optional)

              <textarea
                id="pm-customer-notes"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows={3}
                disabled={loading}
                placeholder="Add any relevant information"
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 12px",
                  marginTop: "6px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  resize: "vertical",
                }}
              />
            </label>
          </div>

          {/* PAYMENT METHODS */}

          <h2>Choose a payment method</h2>

          {/* RAZORPAY */}

          <button
            type="button"
            className={`pm-payment-option ${
              paymentMethod === "razorpay"
                ? "selected"
                : ""
            }`}
            onClick={() => setPaymentMethod("razorpay")}
            disabled={loading}
          >
            <CreditCard size={24} />

            <span>
              <strong>Online Payment</strong>

              <small>
                UPI, credit cards, debit cards and
                supported payment methods
              </small>
            </span>

            <span className="pm-radio">
              {paymentMethod === "razorpay" ? "●" : "○"}
            </span>
          </button>

          {/* COD NOW ENABLED FOR BREEDS AND INDIVIDUAL PETS */}

          <button
            type="button"
            className={`pm-payment-option ${
              paymentMethod === "cod"
                ? "selected"
                : ""
            }`}
            onClick={() => setPaymentMethod("cod")}
            disabled={loading}
          >
            <Banknote size={24} />

            <span>
              <strong>Cash on Delivery</strong>

              <small>
                {isBreedPurchase
                  ? "Place a catalogue COD order; fulfilment must be confirmed"
                  : "Pay the seller when you receive the pet"}
              </small>
            </span>

            <span className="pm-radio">
              {paymentMethod === "cod" ? "●" : "○"}
            </span>
          </button>

          {/* ERROR MESSAGE */}

          {error && (
            <p
              className="pm-payment-error"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* SUBMIT */}

          <button
            type="button"
            className="pm-pay-button"
            onClick={handleSubmitPayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={18}
                  className="pm-spinner"
                />

                {paymentMethod === "cod"
                  ? "Placing COD Order..."
                  : "Processing Payment..."}
              </>
            ) : paymentMethod === "cod" ? (
              <>
                <Wallet size={18} />

                {isBreedPurchase
                  ? "Place COD Order"
                  : "Place COD Booking"}
              </>
            ) : (
              <>
                <Smartphone size={18} />

                Pay {formatMoney(displayedPrice)}
              </>
            )}
          </button>

          <p className="pm-payment-disclaimer">
            {paymentMethod === "cod"
              ? isBreedPurchase
                ? "No payment is collected now. Breed availability and fulfilment must be confirmed before delivery and cash collection."
                : "No payment is collected now. Pay the seller when the individual pet is handed over."
              : "Razorpay will open its secure checkout. Your payment must be verified by the backend."}
          </p>
        </section>
      </div>
    </main>
  );
}