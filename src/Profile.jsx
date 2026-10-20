// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Profile.css";

// const API = "http://localhost:5000";

// const emptyProfile = {
//   name: "",
//   email: "",
//   phone: "",
//   location: "",
//   bio: "",
//   profilePhoto: "",
// };

// export default function Profile() {
//   const navigate = useNavigate();

//   // Profile states
//   const [profile, setProfile] = useState(emptyProfile);
//   const [form, setForm] = useState(emptyProfile);
//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");
//   const [loggingOut, setLoggingOut] = useState(false);

//   // Booking states
//   const [bookings, setBookings] = useState([]);
//   const [bookingsLoading, setBookingsLoading] = useState(true);
//   const [bookingError, setBookingError] = useState("");
//   const [cancellingBooking, setCancellingBooking] = useState("");
//   const [deletingBooking, setDeletingBooking] = useState("");

//   // Order tracking states
//   const [trackingBookingId, setTrackingBookingId] = useState("");
//   const [trackingLoading, setTrackingLoading] = useState(false);
//   const [trackingResult, setTrackingResult] = useState(null);
//   const [trackingError, setTrackingError] = useState("");

//   // Locally saved pets
//   const [pets, setPets] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("pawMartPets") || "[]");
//     } catch {
//       return [];
//     }
//   });

//   const [petForm, setPetForm] = useState({
//     name: "",
//     type: "Dog",
//     breed: "",
//     age: "",
//   });

//   // ========================================
//   // LOAD PROFILE
//   // ========================================

//   useEffect(() => {
//     async function loadProfile() {
//       try {
//         const response = await fetch(`${API}/api/auth/me`, {
//           credentials: "include",
//         });

//         if (!response.ok) {
//           const cached = JSON.parse(
//             localStorage.getItem("pawMartUser") || "null"
//           );

//           if (cached) {
//             setProfile({ ...emptyProfile, ...cached });
//             setForm({ ...emptyProfile, ...cached });
//           } else {
//             setMessage("Please log in to load your account details.");
//           }

//           return;
//         }

//         const data = await response.json();
//         const remoteUser = data.user || data;

//         const cachedUser = JSON.parse(
//           localStorage.getItem("pawMartUser") || "null"
//         );

//         const user = {
//           ...emptyProfile,
//           ...remoteUser,
//           profilePhoto:
//             remoteUser.profilePhoto ||
//             cachedUser?.profilePhoto ||
//             "",
//         };

//         setProfile(user);
//         setForm(user);

//         localStorage.setItem("pawMartUser", JSON.stringify(user));
//       } catch {
//         try {
//           const cached = JSON.parse(
//             localStorage.getItem("pawMartUser") || "null"
//           );

//           if (cached) {
//             setProfile({ ...emptyProfile, ...cached });
//             setForm({ ...emptyProfile, ...cached });
//           } else {
//             setMessage(
//               "Unable to connect to the server. Please check your connection."
//             );
//           }
//         } catch {
//           setMessage("Unable to load your profile.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadProfile();
//   }, []);

//   // ========================================
//   // LOAD BOOKINGS
//   // ========================================

//   async function loadBookings() {
//     setBookingsLoading(true);
//     setBookingError("");

//     try {
//       const response = await fetch(`${API}/api/bookings`, {
//         credentials: "include",
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Unable to load your booking requests."
//         );
//       }

//       setBookings(data.bookings || []);
//     } catch (error) {
//       setBookingError(
//         error.message || "Unable to connect to the booking service."
//       );
//     } finally {
//       setBookingsLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   // ========================================
//   // TRACK ORDER
//   // GET /api/bookings/track/:orderId
//   // ========================================

//   async function trackOrder(booking) {
//     const orderId = booking.orderId;

//     if (!orderId) {
//       setTrackingBookingId(booking._id);
//       setTrackingResult(null);
//       setTrackingError(
//         "This booking does not have an Order ID. Refresh your bookings or check the booking record in MongoDB."
//       );
//       return;
//     }

//     setTrackingBookingId(booking._id);
//     setTrackingLoading(true);
//     setTrackingResult(null);
//     setTrackingError("");

//     try {
//       const response = await fetch(
//         `${API}/api/bookings/track/${encodeURIComponent(orderId)}`,
//         {
//           method: "GET",
//           credentials: "include",
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Unable to track this order."
//         );
//       }

//       if (!data.booking) {
//         throw new Error("No tracking information was returned.");
//       }

//       setTrackingResult(data.booking);
//     } catch (error) {
//       setTrackingError(
//         error.message || "Unable to track this order."
//       );
//     } finally {
//       setTrackingLoading(false);
//     }
//   }

//   // ========================================
//   // COPY ORDER ID
//   // ========================================

//   async function copyOrderId(orderId) {
//     if (!orderId) {
//       setMessage("Order ID is unavailable.");
//       return;
//     }

//     try {
//       await navigator.clipboard.writeText(orderId);
//       setMessage(`Order ID ${orderId} copied successfully!`);
//     } catch {
//       setMessage(
//         "Unable to copy automatically. Please select and copy the Order ID."
//       );
//     }
//   }

//   // ========================================
//   // CANCEL BOOKING
//   // ========================================

//   async function cancelBooking(bookingId) {
//     const confirmed = window.confirm(
//       "Are you sure you want to cancel this booking?"
//     );

//     if (!confirmed) return;

//     setCancellingBooking(bookingId);
//     setBookingError("");
//     setMessage("");

//     try {
//       const response = await fetch(
//         `${API}/api/bookings/${bookingId}/cancel`,
//         {
//           method: "PATCH",
//           credentials: "include",
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Unable to cancel booking."
//         );
//       }

//       setBookings((currentBookings) =>
//         currentBookings.map((booking) =>
//           booking._id === bookingId
//             ? { ...booking, ...data.booking }
//             : booking
//         )
//       );

//       setTrackingResult(null);
//       setMessage("Booking cancelled successfully! 🐾");
//     } catch (error) {
//       setBookingError(
//         error.message || "Unable to cancel booking."
//       );
//     } finally {
//       setCancellingBooking("");
//     }
//   }

//   // ========================================
//   // DELETE BOOKING
//   // DELETE /api/bookings/:id
//   // ========================================

//   async function deleteBooking(bookingId) {
//     const confirmed = window.confirm(
//       "Delete this booking from your account? This action cannot be undone."
//     );

//     if (!confirmed) return;

//     setDeletingBooking(bookingId);
//     setBookingError("");
//     setMessage("");

//     try {
//       const response = await fetch(
//         `${API}/api/bookings/${bookingId}`,
//         {
//           method: "DELETE",
//           credentials: "include",
//         }
//       );

//       const data = await response.json().catch(() => ({}));

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Unable to delete this booking."
//         );
//       }

//       setBookings((currentBookings) =>
//         currentBookings.filter(
//           (booking) => booking._id !== bookingId
//         )
//       );

//       if (trackingBookingId === bookingId) {
//         setTrackingBookingId("");
//         setTrackingResult(null);
//         setTrackingError("");
//       }

//       setMessage(
//         data.message || "Booking deleted successfully! 🐾"
//       );
//     } catch (error) {
//       setBookingError(
//         error.message || "Unable to delete this booking."
//       );
//     } finally {
//       setDeletingBooking("");
//     }
//   }

//   // ========================================
//   // LOGOUT
//   // ========================================

//   async function handleLogout() {
//     const confirmed = window.confirm(
//       "Are you sure you want to log out?"
//     );

//     if (!confirmed) return;

//     setLoggingOut(true);
//     setMessage("");

//     try {
//       const response = await fetch(`${API}/api/auth/logout`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json().catch(() => ({}));

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Unable to log out. Please try again."
//         );
//       }

//       localStorage.removeItem("pawMartUser");

//       setProfile(emptyProfile);
//       setForm(emptyProfile);

//       navigate("/login", { replace: true });
//     } catch (error) {
//       setMessage(
//         error.message ||
//           "Unable to log out. Please check your connection."
//       );
//     } finally {
//       setLoggingOut(false);
//     }
//   }

//   // ========================================
//   // PROFILE PHOTO
//   // ========================================

//   function persistProfilePhoto(photoDataUrl) {
//     const updatedProfile = {
//       ...profile,
//       profilePhoto: photoDataUrl,
//     };

//     const updatedForm = {
//       ...form,
//       profilePhoto: photoDataUrl,
//     };

//     try {
//       localStorage.setItem(
//         "pawMartUser",
//         JSON.stringify(updatedProfile)
//       );

//       setProfile(updatedProfile);
//       setForm(updatedForm);

//       setMessage(
//         photoDataUrl
//           ? "Profile photo updated! 📸"
//           : "Profile photo removed."
//       );
//     } catch {
//       setMessage(
//         "Unable to save this photo in your browser. Try a smaller image."
//       );
//     }
//   }

//   function handlePhotoChange(event) {
//     const file = event.target.files?.[0];

//     // Allow choosing the same file again.
//     event.target.value = "";

//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       setMessage("Please choose an image file.");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setMessage("Please choose an image smaller than 5 MB.");
//       return;
//     }

//     const reader = new FileReader();

//     reader.onload = () => {
//       const image = new Image();

//       image.onload = () => {
//         const maxSide = 512;

//         const scale = Math.min(
//           1,
//           maxSide / Math.max(image.width, image.height)
//         );

//         const canvas = document.createElement("canvas");

//         canvas.width = Math.max(
//           1,
//           Math.round(image.width * scale)
//         );

//         canvas.height = Math.max(
//           1,
//           Math.round(image.height * scale)
//         );

//         const context = canvas.getContext("2d");

//         if (!context) {
//           setMessage(
//             "This image could not be processed. Please try another one."
//           );
//           return;
//         }

//         context.drawImage(
//           image,
//           0,
//           0,
//           canvas.width,
//           canvas.height
//         );

//         const compressedPhoto = canvas.toDataURL(
//           "image/jpeg",
//           0.82
//         );

//         persistProfilePhoto(compressedPhoto);
//       };

//       image.onerror = () => {
//         setMessage(
//           "Unable to read this image. Please try another one."
//         );
//       };

//       image.src = String(reader.result || "");
//     };

//     reader.onerror = () => {
//       setMessage("Unable to read this image. Please try again.");
//     };

//     reader.readAsDataURL(file);
//   }

//   function removeProfilePhoto() {
//     persistProfilePhoto("");
//   }

//   // ========================================
//   // EDIT PROFILE
//   // ========================================

//   function handleChange(event) {
//     setForm({
//       ...form,
//       [event.target.name]: event.target.value,
//     });
//   }

//   async function saveProfile(event) {
//     event.preventDefault();

//     setSaving(true);
//     setMessage("");

//     try {
//       const response = await fetch(`${API}/api/auth/profile`, {
//         method: "PUT",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: form.name,
//           phone: form.phone,
//           location: form.location,
//           bio: form.bio,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Unable to update profile."
//         );
//       }

//       const updated = {
//         ...form,
//         ...(data.user || {}),
//         profilePhoto:
//           (data.user || {}).profilePhoto ||
//           form.profilePhoto ||
//           profile.profilePhoto ||
//           "",
//       };

//       setProfile(updated);
//       setForm(updated);

//       localStorage.setItem(
//         "pawMartUser",
//         JSON.stringify(updated)
//       );

//       setEditing(false);
//       setMessage("Profile updated successfully! 🎉");
//     } catch (error) {
//       setMessage(
//         error.message ||
//           "Could not save changes. Check that the profile API is configured."
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   // ========================================
//   // MY PETS
//   // ========================================

//   function addPet(event) {
//     event.preventDefault();

//     if (!petForm.name.trim()) {
//       return;
//     }

//     const newPet = {
//       ...petForm,
//       name: petForm.name.trim(),
//       id: `${Date.now()}-${Math.random()}`,
//     };

//     const updatedPets = [...pets, newPet];

//     setPets(updatedPets);
//     localStorage.setItem(
//       "pawMartPets",
//       JSON.stringify(updatedPets)
//     );

//     setPetForm({
//       name: "",
//       type: "Dog",
//       breed: "",
//       age: "",
//     });

//     setMessage(
//       `${newPet.name} added to your pet family! 🐾`
//     );
//   }

//   function removePet(id) {
//     const updatedPets = pets.filter(
//       (pet) => pet.id !== id
//     );

//     setPets(updatedPets);

//     localStorage.setItem(
//       "pawMartPets",
//       JSON.stringify(updatedPets)
//     );
//   }

//   // ========================================
//   // PROFILE INITIAL
//   // ========================================

//   const initial = (
//     profile.name ||
//     profile.email ||
//     "P"
//   )
//     .charAt(0)
//     .toUpperCase();

//   if (loading) {
//     return (
//       <div className="profile-loading">
//         Loading your profile...
//       </div>
//     );
//   }

//   // ========================================
//   // RENDER PROFILE
//   // ========================================

//   return (
//     <main className="profile-page">
//       <div className="profile-container">

//         {/* HEADER */}
//         <header className="profile-header">
//           <Link to="/" className="profile-logo">
//             🐾 PawMart
//           </Link>

//           <div className="profile-header-actions">
//             <Link to="/" className="profile-home-link">
//               ← Back to Home
//             </Link>

//             {/* Only one Logout button */}
//             <button
//               type="button"
//               className="profile-button profile-logout-button"
//               onClick={handleLogout}
//               disabled={loggingOut}
//               aria-label="Log out of PawMart"
//             >
//               {loggingOut ? "Logging out..." : "↪ Logout"}
//             </button>
//           </div>
//         </header>

//         {/* BANNER */}
//         <section className="profile-banner">
//           <div>
//             <span className="profile-eyebrow">
//               YOUR PAWMART ACCOUNT
//             </span>

//             <h1>My Profile</h1>

//             <p>
//               Your account, your pets, your happy place. 💜
//             </p>
//           </div>

//           <div className="profile-banner-paw">🐾</div>
//         </section>

//         {/* GLOBAL MESSAGE */}
//         {message && (
//           <div className="profile-message" role="status">
//             {message}
//           </div>
//         )}

//         <div className="profile-layout">

//           {/* ========================================
//               SIDEBAR
//           ======================================== */}
//           <aside className="profile-sidebar">
//             <div
//               className="profile-avatar"
//               style={{
//                 overflow: "hidden",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: 0,
//               }}
//             >
//               {profile.profilePhoto ? (
//                 <img
//                   src={profile.profilePhoto}
//                   alt="Your profile"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />
//               ) : (
//                 initial
//               )}
//             </div>

//             {/* PROFILE PHOTO CONTROLS */}
//             <div className="profile-photo-actions">
//               <label
//                 className="profile-photo-upload"
//                 style={{
//                   cursor: "pointer",
//                   display: "inline-block",
//                   marginTop: 10,
//                 }}
//               >
//                 📷{" "}
//                 {profile.profilePhoto
//                   ? "Change photo"
//                   : "Add profile photo"}

//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handlePhotoChange}
//                   aria-label="Choose a profile photo"
//                   style={{ display: "none" }}
//                 />
//               </label>

//               {profile.profilePhoto && (
//                 <button
//                   type="button"
//                   onClick={removeProfilePhoto}
//                   className="profile-photo-remove"
//                   style={{
//                     display: "block",
//                     margin: "7px auto 0",
//                     border: "none",
//                     background: "transparent",
//                     color: "#dc2626",
//                     cursor: "pointer",
//                     fontSize: 12,
//                   }}
//                 >
//                   Remove photo
//                 </button>
//               )}
//             </div>

//             <h2>{profile.name || "Pet Parent"}</h2>

//             <p className="profile-email">
//               {profile.email || "Email not available"}
//             </p>

//             <span className="profile-badge">
//               🐶 PawMart Member
//             </span>

//             <nav className="profile-navigation">
//               <a href="#personal">👤 Personal Details</a>
//               <a href="#pets">🐕 My Pets</a>
//               <a href="#favorites">❤️ Favorites</a>
//               <a href="#orders">📦 My Bookings</a>
//               <a href="#security">🔐 Security</a>
//             </nav>
//           </aside>

//           <div className="profile-main">

//             {/* ========================================
//                 PERSONAL DETAILS
//             ======================================== */}
//             <section className="profile-card" id="personal">
//               <div className="profile-card-heading">
//                 <div>
//                   <h2>Personal Details</h2>
//                   <p>Manage your personal information.</p>
//                 </div>

//                 {!editing && (
//                   <button
//                     type="button"
//                     className="profile-button profile-button-light"
//                     onClick={() => {
//                       setForm(profile);
//                       setEditing(true);
//                     }}
//                   >
//                     ✏️ Edit Profile
//                   </button>
//                 )}
//               </div>

//               {editing ? (
//                 <form
//                   className="profile-form"
//                   onSubmit={saveProfile}
//                 >
//                   <label>
//                     Full Name
//                     <input
//                       name="name"
//                       value={form.name}
//                       onChange={handleChange}
//                       required
//                       maxLength={80}
//                     />
//                   </label>

//                   <label>
//                     Email Address
//                     <input
//                       type="email"
//                       name="email"
//                       value={form.email}
//                       onChange={handleChange}
//                       required
//                     />
//                   </label>

//                   <label>
//                     Phone Number
//                     <input
//                       name="phone"
//                       value={form.phone}
//                       onChange={handleChange}
//                       placeholder="Enter phone number"
//                       maxLength={25}
//                     />
//                   </label>

//                   <label>
//                     Location
//                     <input
//                       name="location"
//                       value={form.location}
//                       onChange={handleChange}
//                       placeholder="City, State"
//                       maxLength={100}
//                     />
//                   </label>

//                   <label className="profile-full-width">
//                     About Me
//                     <textarea
//                       name="bio"
//                       value={form.bio}
//                       onChange={handleChange}
//                       placeholder="Tell us about yourself..."
//                       rows="3"
//                       maxLength={300}
//                     />
//                   </label>

//                   <div className="profile-form-actions profile-full-width">
//                     <button
//                       type="button"
//                       className="profile-button profile-button-light"
//                       onClick={() => {
//                         setForm(profile);
//                         setEditing(false);
//                       }}
//                     >
//                       Cancel
//                     </button>

//                     <button
//                       type="submit"
//                       className="profile-button"
//                       disabled={saving}
//                     >
//                       {saving ? "Saving..." : "Save Changes"}
//                     </button>
//                   </div>
//                 </form>
//               ) : (
//                 <div className="profile-details">
//                   <div>
//                     <span>Full Name</span>
//                     <strong>
//                       {profile.name || "Not added yet"}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Email Address</span>
//                     <strong>
//                       {profile.email || "Not available"}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Phone Number</span>
//                     <strong>
//                       {profile.phone || "Not added yet"}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Location</span>
//                     <strong>
//                       {profile.location || "Not added yet"}
//                     </strong>
//                   </div>

//                   <div className="profile-full-width">
//                     <span>About Me</span>
//                     <strong>
//                       {profile.bio || "Tell us about yourself."}
//                     </strong>
//                   </div>
//                 </div>
//               )}
//             </section>

//             {/* ========================================
//                 MY PETS
//             ======================================== */}
//             <section className="profile-card" id="pets">
//               <div className="profile-card-heading">
//                 <div>
//                   <h2>My Pets 🐾</h2>
//                   <p>Your furry family members.</p>
//                 </div>

//                 <span className="profile-count">
//                   {pets.length} Pets
//                 </span>
//               </div>

//               <form className="pet-form" onSubmit={addPet}>
//                 <label>
//                   Pet Name
//                   <input
//                     value={petForm.name}
//                     onChange={(event) =>
//                       setPetForm({
//                         ...petForm,
//                         name: event.target.value,
//                       })
//                     }
//                     placeholder="e.g. Bruno"
//                     required
//                     maxLength={50}
//                   />
//                 </label>

//                 <label>
//                   Pet Type
//                   <select
//                     value={petForm.type}
//                     onChange={(event) =>
//                       setPetForm({
//                         ...petForm,
//                         type: event.target.value,
//                       })
//                     }
//                   >
//                     <option>Dog</option>
//                     <option>Cat</option>
//                     <option>Bird</option>
//                     <option>Rabbit</option>
//                     <option>Other</option>
//                   </select>
//                 </label>

//                 <label>
//                   Breed
//                   <input
//                     value={petForm.breed}
//                     onChange={(event) =>
//                       setPetForm({
//                         ...petForm,
//                         breed: event.target.value,
//                       })
//                     }
//                     placeholder="e.g. Labrador"
//                     maxLength={60}
//                   />
//                 </label>

//                 <label>
//                   Age
//                   <input
//                     value={petForm.age}
//                     onChange={(event) =>
//                       setPetForm({
//                         ...petForm,
//                         age: event.target.value,
//                       })
//                     }
//                     placeholder="e.g. 2 years"
//                     maxLength={30}
//                   />
//                 </label>

//                 <button
//                   className="profile-button"
//                   type="submit"
//                 >
//                   + Add Pet
//                 </button>
//               </form>

//               {pets.length === 0 ? (
//                 <div className="profile-empty">
//                   <span>🐕</span>
//                   <p>No pets added yet.</p>
//                   <small>
//                     Add your first pet using the form above.
//                   </small>
//                 </div>
//               ) : (
//                 <div className="pet-list">
//                   {pets.map((pet) => (
//                     <article
//                       className="pet-item"
//                       key={pet.id}
//                     >
//                       <div className="pet-icon">
//                         {pet.type === "Cat"
//                           ? "🐱"
//                           : pet.type === "Bird"
//                           ? "🐦"
//                           : pet.type === "Rabbit"
//                           ? "🐰"
//                           : pet.type === "Dog"
//                           ? "🐶"
//                           : "🐾"}
//                       </div>

//                       <div className="pet-information">
//                         <strong>{pet.name}</strong>
//                         <span>
//                           {[pet.type, pet.breed, pet.age]
//                             .filter(Boolean)
//                             .join(" · ")}
//                         </span>
//                       </div>

//                       <button
//                         className="pet-remove"
//                         type="button"
//                         onClick={() => removePet(pet.id)}
//                       >
//                         Remove
//                       </button>
//                     </article>
//                   ))}
//                 </div>
//               )}
//             </section>

//             {/* ========================================
//                 FAVORITES
//             ======================================== */}
//             <section
//               className="profile-card"
//               id="favorites"
//             >
//               <div className="profile-card-heading">
//                 <div>
//                   <h2>My Favorites ❤️</h2>
//                   <p>Your favorite pets and products.</p>
//                 </div>
//               </div>

//               <div className="profile-placeholder">
//                 <span>❤️</span>
//                 <p>Your favorites will appear here.</p>
//                 <small>
//                   Your existing favorites API can be connected
//                   to this section next.
//                 </small>
//               </div>
//             </section>

//             {/* ========================================
//                 MY BOOKINGS AND ORDER TRACKING
//             ======================================== */}
//             <section
//               className="profile-card"
//               id="orders"
//             >
//               <div className="profile-card-heading">
//                 <div>
//                   <h2>My Bookings 🐾</h2>
//                   <p>
//                     View your Order ID, track orders, and
//                     manage your booking requests.
//                   </p>
//                 </div>

//                 <button
//                   type="button"
//                   className="profile-button profile-button-light"
//                   onClick={loadBookings}
//                   disabled={bookingsLoading}
//                 >
//                   {bookingsLoading ? "Loading..." : "↻ Refresh"}
//                 </button>
//               </div>

//               {bookingError && (
//                 <div
//                   className="profile-message"
//                   role="alert"
//                 >
//                   {bookingError}
//                 </div>
//               )}

//               {bookingsLoading ? (
//                 <div className="profile-placeholder">
//                   <span>⏳</span>
//                   <p>Loading your bookings...</p>
//                 </div>
//               ) : bookings.length === 0 ? (
//                 <div className="profile-placeholder">
//                   <span>🐶</span>
//                   <p>No bookings yet.</p>
//                   <small>
//                     Your pet booking requests will appear
//                     here when you make them.
//                   </small>

//                   <Link
//                     to="/"
//                     className="profile-security-link"
//                   >
//                     Explore PawMart
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="booking-list">
//                   {bookings.map((booking) => (
//                     <article
//                       className="booking-item"
//                       key={booking._id}
//                     >
//                       {/* PET IMAGE */}
//                       {booking.dogImage ? (
//                         <img
//                           className="booking-image"
//                           src={booking.dogImage}
//                           alt={booking.dogName || "Pet"}
//                           onError={(event) => {
//                             event.currentTarget.style.display =
//                               "none";
//                           }}
//                         />
//                       ) : (
//                         <div className="booking-image-placeholder">
//                           🐕
//                         </div>
//                       )}

//                       <div className="booking-information">
//                         <h3>
//                           {booking.dogName || booking.breed}
//                         </h3>

//                         <p>
//                           <strong>Breed:</strong>{" "}
//                           {booking.breed || "Not specified"}
//                         </p>

//                         <p>
//                           <strong>Price:</strong>{" "}
//                           {booking.price == null
//                             ? "Not specified"
//                             : `₹${Number(
//                                 booking.price
//                               ).toLocaleString("en-IN")}`}
//                         </p>

//                         <p>
//                           <strong>Requested:</strong>{" "}
//                           {booking.createdAt
//                             ? new Date(
//                                 booking.createdAt
//                               ).toLocaleDateString("en-IN")
//                             : "Date unavailable"}
//                         </p>

//                         {/* ORDER ID */}
//                         <div
//                           style={{
//                             margin: "12px 0",
//                             padding: "10px 12px",
//                             background: "#f5f3ff",
//                             border: "1px solid #ddd6fe",
//                             borderRadius: "8px",
//                             overflowWrap: "anywhere",
//                           }}
//                         >
//                           <strong
//                             style={{
//                               display: "block",
//                               marginBottom: "4px",
//                               color: "#4c1d95",
//                             }}
//                           >
//                             Order ID
//                           </strong>

//                           <span>
//                             {booking.orderId ||
//                               "Order ID unavailable"}
//                           </span>

//                           {booking.orderId && (
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 copyOrderId(booking.orderId)
//                               }
//                               style={{
//                                 display: "block",
//                                 marginTop: "8px",
//                                 padding: "5px 10px",
//                                 border: "1px solid #c4b5fd",
//                                 borderRadius: "6px",
//                                 background: "#ffffff",
//                                 cursor: "pointer",
//                               }}
//                             >
//                               📋 Copy Order ID
//                             </button>
//                           )}
//                         </div>

//                         {/* BOOKING STATUS */}
//                         <p>
//                           <strong>Booking Status:</strong>
//                         </p>

//                         <span
//                           className={`booking-status booking-status-${String(
//                             booking.status || "Pending"
//                           )
//                             .toLowerCase()
//                             .replace(/\s+/g, "-")}`}
//                         >
//                           {booking.status || "Pending"}
//                         </span>

//                         {/* PAYMENT STATUS */}
//                         <p style={{ marginTop: "10px" }}>
//                           <strong>Payment Status:</strong>{" "}
//                           {booking.paymentStatus || "Pending"}
//                         </p>

//                         {booking.paymentMethod && (
//                           <p>
//                             <strong>Payment Method:</strong>{" "}
//                             {booking.paymentMethod}
//                           </p>
//                         )}

//                         {/* TRACKING AND BOOKING ACTIONS */}
//                         <div
//                           className="booking-actions"
//                           style={{
//                             display: "flex",
//                             gap: "8px",
//                             flexWrap: "wrap",
//                             marginTop: "12px",
//                           }}
//                         >
//                           <button
//                             type="button"
//                             className="profile-button"
//                             onClick={() => trackOrder(booking)}
//                             disabled={
//                               trackingLoading &&
//                               trackingBookingId === booking._id
//                             }
//                           >
//                             {trackingLoading &&
//                             trackingBookingId === booking._id
//                               ? "Tracking..."
//                               : "📦 Track Order"}
//                           </button>

//                           {booking.status === "Pending" && (
//                             <button
//                               type="button"
//                               className="pet-remove"
//                               disabled={
//                                 cancellingBooking ===
//                                   booking._id ||
//                                 deletingBooking ===
//                                   booking._id
//                               }
//                               onClick={() =>
//                                 cancelBooking(booking._id)
//                               }
//                             >
//                               {cancellingBooking ===
//                               booking._id
//                                 ? "Cancelling..."
//                                 : "Cancel Booking"}
//                             </button>
//                           )}

//                           <button
//                             type="button"
//                             className="pet-remove booking-delete-button"
//                             style={{
//                               backgroundColor: "#dc2626",
//                               color: "#ffffff",
//                               border: "none",
//                               cursor:
//                                 deletingBooking === booking._id
//                                   ? "wait"
//                                   : "pointer",
//                               opacity:
//                                 deletingBooking === booking._id
//                                   ? 0.7
//                                   : 1,
//                             }}
//                             disabled={
//                               deletingBooking ===
//                                 booking._id ||
//                               cancellingBooking === booking._id
//                             }
//                             onClick={() =>
//                               deleteBooking(booking._id)
//                             }
//                           >
//                             {deletingBooking === booking._id
//                               ? "Deleting..."
//                               : "🗑️ Delete"}
//                           </button>
//                         </div>

//                         {/* LIVE TRACKING RESULT */}
//                         {trackingBookingId === booking._id && (
//                           <div
//                             style={{
//                               marginTop: "16px",
//                               padding: "14px",
//                               borderRadius: "10px",
//                               border: "1px solid #e5e7eb",
//                               background: "#ffffff",
//                             }}
//                           >
//                             <h4
//                               style={{
//                                 margin: "0 0 12px",
//                               }}
//                             >
//                               📦 Order Tracking
//                             </h4>

//                             {trackingLoading && (
//                               <p>
//                                 Fetching the latest order
//                                 information...
//                               </p>
//                             )}

//                             {!trackingLoading &&
//                               trackingError && (
//                                 <p
//                                   role="alert"
//                                   style={{
//                                     color: "#b91c1c",
//                                   }}
//                                 >
//                                   {trackingError}
//                                 </p>
//                               )}

//                             {!trackingLoading &&
//                               trackingResult && (
//                                 <>
//                                   <p>
//                                     <strong>Order ID:</strong>{" "}
//                                     {trackingResult.orderId ||
//                                       booking.orderId ||
//                                       "Unavailable"}
//                                   </p>

//                                   <p>
//                                     <strong>Booking Status:</strong>{" "}
//                                     {trackingResult.status ||
//                                       "Pending"}
//                                   </p>

//                                   <p>
//                                     <strong>Payment Status:</strong>{" "}
//                                     {trackingResult.paymentStatus ||
//                                       "Pending"}
//                                   </p>

//                                   <p>
//                                     <strong>Last Updated:</strong>{" "}
//                                     {trackingResult.updatedAt
//                                       ? new Date(
//                                           trackingResult.updatedAt
//                                         ).toLocaleString("en-IN")
//                                       : "Unavailable"}
//                                   </p>

//                                   <small
//                                     style={{
//                                       display: "block",
//                                       marginTop: "8px",
//                                       color: "#6b7280",
//                                     }}
//                                   >
//                                     This information comes
//                                     from your booking record.
//                                     Updates appear when the
//                                     booking status is changed
//                                     in PawMart.
//                                   </small>
//                                 </>
//                               )}
//                           </div>
//                         )}
//                       </div>
//                     </article>
//                   ))}
//                 </div>
//               )}
//             </section>

//             {/* ========================================
//                 ACCOUNT SECURITY
//             ======================================== */}
//             <section
//               className="profile-card"
//               id="security"
//             >
//               <div className="profile-card-heading">
//                 <div>
//                   <h2>Account Security 🔐</h2>
//                   <p>Keep your account protected.</p>
//                 </div>
//               </div>

//               <div className="profile-security">
//                 <div className="security-icon">🔒</div>

//                 <div>
//                   <strong>Password Protection</strong>
//                   <p>
//                     Forgot your password? Use the password
//                     recovery feature to securely reset it.
//                   </p>
//                 </div>

//                 <Link
//                   to="/login"
//                   className="profile-security-link"
//                 >
//                   Login Page
//                 </Link>
//               </div>
//             </section>
//           </div>
//         </div>

//         {/* FOOTER */}
//         <footer className="profile-footer">
//           Made with 💜 for pet parents everywhere.
//         </footer>
//       </div>
//     </main>
//   );
// }



import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const API = "http://localhost:5000";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  profilePhoto: "",
};

// Safely escape text before inserting it into the invoice HTML.
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function formatCurrency(value) {
  if (value == null || value === "") {
    return "Not specified";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Not specified";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-IN");
}

export default function Profile() {
  const navigate = useNavigate();

  // ========================================
  // PROFILE STATES
  // ========================================

  const [profile, setProfile] = useState(emptyProfile);
  const [form, setForm] = useState(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  // ========================================
  // BOOKING STATES
  // ========================================

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingError, setBookingError] = useState("");
  const [cancellingBooking, setCancellingBooking] = useState("");
  const [deletingBooking, setDeletingBooking] = useState("");
  const [invoiceBookingId, setInvoiceBookingId] = useState("");

  // ========================================
  // ORDER TRACKING STATES
  // ========================================

  const [trackingBookingId, setTrackingBookingId] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState("");

  // ========================================
  // MY PETS
  // ========================================

  const [pets, setPets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pawMartPets") || "[]");
    } catch {
      return [];
    }
  });

  const [petForm, setPetForm] = useState({
    name: "",
    type: "Dog",
    breed: "",
    age: "",
  });

  // ========================================
  // LOAD PROFILE
  // ========================================

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(`${API}/api/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          const cached = JSON.parse(
            localStorage.getItem("pawMartUser") || "null"
          );

          if (cached) {
            setProfile({ ...emptyProfile, ...cached });
            setForm({ ...emptyProfile, ...cached });
          } else {
            setMessage(
              "Please log in to load your account details."
            );
          }

          return;
        }

        const data = await response.json();
        const remoteUser = data.user || data;

        const cachedUser = JSON.parse(
          localStorage.getItem("pawMartUser") || "null"
        );

        const user = {
          ...emptyProfile,
          ...remoteUser,
          profilePhoto:
            remoteUser.profilePhoto ||
            cachedUser?.profilePhoto ||
            "",
        };

        setProfile(user);
        setForm(user);

        localStorage.setItem(
          "pawMartUser",
          JSON.stringify(user)
        );
      } catch {
        try {
          const cached = JSON.parse(
            localStorage.getItem("pawMartUser") || "null"
          );

          if (cached) {
            setProfile({ ...emptyProfile, ...cached });
            setForm({ ...emptyProfile, ...cached });
          } else {
            setMessage(
              "Unable to connect to the server. Please check your connection."
            );
          }
        } catch {
          setMessage("Unable to load your profile.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // ========================================
  // LOAD BOOKINGS
  // ========================================

  async function loadBookings() {
    setBookingsLoading(true);
    setBookingError("");

    try {
      const response = await fetch(`${API}/api/bookings`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load your booking requests."
        );
      }

      setBookings(data.bookings || []);
    } catch (error) {
      setBookingError(
        error.message ||
          "Unable to connect to the booking service."
      );
    } finally {
      setBookingsLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  // ========================================
  // DOWNLOAD / PRINT INVOICE
  //
  // Uses the actual booking details returned by MongoDB.
  // The browser print dialog allows saving as PDF.
  // ========================================

  function downloadInvoice(booking) {
    setInvoiceBookingId(booking._id);
    setMessage("");

    let invoiceWindow = null;

    try {
      // Open a printable invoice window.
      invoiceWindow = window.open(
        "",
        "_blank",
        "width=900,height=750"
      );

      if (!invoiceWindow) {
        setMessage(
          "Invoice popup blocked. Allow popups for localhost and try again."
        );
        return;
      }

      const invoiceNumber =
        booking.orderId || `PM-${booking._id}`;

      const invoiceDate = new Date();

      const customerName =
        profile.name || "PawMart Customer";

      const customerEmail =
        profile.email || "Not provided";

      const customerPhone =
        profile.phone || "Not provided";

      const petName =
        booking.dogName || "Pet";

      const petBreed =
        booking.breed || "Not specified";

      const price = formatCurrency(booking.price);

      const paymentMethod =
        booking.paymentMethod || "Not specified";

      const paymentStatus =
        booking.paymentStatus || "Pending";

      const bookingStatus =
        booking.status || "Pending";

      const createdDate = formatDate(booking.createdAt);

      const paidDate = booking.paidAt
        ? formatDateTime(booking.paidAt)
        : "";

      const codCollectedDate = booking.codCollectedAt
        ? formatDateTime(booking.codCollectedAt)
        : "";

      const notes =
        booking.notes || "No additional notes.";

      const paymentStatusLower =
        String(paymentStatus).toLowerCase();

      const paymentIsConfirmed =
        paymentStatusLower === "paid";

      const paymentNotice = paymentIsConfirmed
        ? `
          <div class="payment-success">
            <strong>Payment status: PAID</strong>
            <p>
              The booking record indicates that payment
              has been recorded.
            </p>
          </div>
        `
        : `
          <div class="payment-pending">
            <strong>Payment status: ${escapeHtml(
              paymentStatus.toUpperCase()
            )}</strong>
            <p>
              This document is an order summary and is not
              proof of payment. Please complete payment if
              payment is still pending.
            </p>
          </div>
        `;

      // Do not invent GST details, tax amounts, or a seller
      // address that is not available in the booking record.
      const invoiceHtml = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />

            <title>${escapeHtml(invoiceNumber)} - PawMart</title>

            <style>
              * {
                box-sizing: border-box;
              }

              body {
                margin: 0;
                padding: 32px;
                background: #f3f4f6;
                color: #1f2937;
                font-family: Arial, Helvetica, sans-serif;
                line-height: 1.6;
              }

              .invoice {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px;
                background: white;
                border-radius: 14px;
                box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
              }

              .top {
                display: flex;
                justify-content: space-between;
                gap: 24px;
                align-items: flex-start;
                padding-bottom: 24px;
                border-bottom: 2px solid #e9d5ff;
              }

              .brand {
                color: #7c3aed;
                font-size: 30px;
                font-weight: 800;
                letter-spacing: -1px;
              }

              .subtitle {
                margin-top: 4px;
                color: #6b7280;
                font-size: 13px;
              }

              .invoice-title {
                text-align: right;
              }

              .invoice-title h1 {
                margin: 0;
                color: #4c1d95;
                font-size: 25px;
              }

              .invoice-title p {
                margin: 4px 0;
                overflow-wrap: anywhere;
              }

              .section {
                margin-top: 28px;
              }

              .section h2 {
                margin: 0 0 12px;
                padding-bottom: 8px;
                color: #4c1d95;
                font-size: 16px;
                border-bottom: 1px solid #e5e7eb;
              }

              .details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 18px;
              }

              .detail {
                min-width: 0;
              }

              .label {
                display: block;
                margin-bottom: 4px;
                color: #6b7280;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.4px;
              }

              .value {
                display: block;
                color: #111827;
                font-size: 14px;
                font-weight: 600;
                overflow-wrap: anywhere;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 12px;
              }

              th, td {
                padding: 13px 10px;
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
                font-size: 13px;
                vertical-align: top;
              }

              th {
                background: #f5f3ff;
                color: #4c1d95;
              }

              .amount {
                text-align: right;
                font-weight: 700;
                white-space: nowrap;
              }

              .total {
                display: flex;
                justify-content: space-between;
                gap: 16px;
                margin-top: 18px;
                padding: 18px;
                background: #f5f3ff;
                border-radius: 10px;
                font-weight: 800;
                font-size: 18px;
              }

              .payment-success,
              .payment-pending {
                margin-top: 22px;
                padding: 14px 16px;
                border-radius: 9px;
                font-size: 13px;
              }

              .payment-success {
                background: #ecfdf5;
                border: 1px solid #a7f3d0;
                color: #065f46;
              }

              .payment-pending {
                background: #fffbeb;
                border: 1px solid #fde68a;
                color: #92400e;
              }

              .payment-success p,
              .payment-pending p {
                margin: 4px 0 0;
              }

              .notes {
                white-space: pre-wrap;
                overflow-wrap: anywhere;
              }

              .footer {
                margin-top: 35px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                text-align: center;
                font-size: 12px;
              }

              .print-actions {
                display: flex;
                justify-content: center;
                margin-top: 24px;
              }

              .print-button {
                padding: 12px 22px;
                border: none;
                border-radius: 8px;
                background: #7c3aed;
                color: white;
                cursor: pointer;
                font-size: 14px;
                font-weight: 700;
              }

              @media (max-width: 600px) {
                body {
                  padding: 10px;
                }

                .invoice {
                  padding: 22px;
                }

                .top {
                  flex-direction: column;
                }

                .invoice-title {
                  text-align: left;
                }

                .details {
                  grid-template-columns: 1fr;
                }

                th, td {
                  padding: 9px 5px;
                  font-size: 12px;
                }
              }

              @media print {
                @page {
                  size: A4;
                  margin: 14mm;
                }

                body {
                  padding: 0;
                  background: white;
                }

                .invoice {
                  max-width: none;
                  padding: 0;
                  box-shadow: none;
                  border-radius: 0;
                }

                .print-actions {
                  display: none !important;
                }

                .payment-success,
                .payment-pending {
                  print-color-adjust: exact;
                  -webkit-print-color-adjust: exact;
                }

                th,
                .total {
                  print-color-adjust: exact;
                  -webkit-print-color-adjust: exact;
                }
              }
            </style>
          </head>

          <body>
            <main class="invoice">
              <header class="top">
                <div>
                  <div class="brand">🐾 PawMart</div>
                  <div class="subtitle">
                    Your account, your pets, your happy place.
                  </div>
                </div>

                <div class="invoice-title">
                  <h1>ORDER INVOICE</h1>
                  <p>
                    <strong>Invoice reference:</strong><br />
                    ${escapeHtml(invoiceNumber)}
                  </p>
                  <p>
                    <strong>Generated:</strong>
                    ${escapeHtml(
                      invoiceDate.toLocaleDateString("en-IN")
                    )}
                  </p>
                </div>
              </header>

              <section class="section">
                <h2>Customer Details</h2>

                <div class="details">
                  <div class="detail">
                    <span class="label">Customer Name</span>
                    <span class="value">
                      ${escapeHtml(customerName)}
                    </span>
                  </div>

                  <div class="detail">
                    <span class="label">Email Address</span>
                    <span class="value">
                      ${escapeHtml(customerEmail)}
                    </span>
                  </div>

                  <div class="detail">
                    <span class="label">Phone Number</span>
                    <span class="value">
                      ${escapeHtml(customerPhone)}
                    </span>
                  </div>

                  <div class="detail">
                    <span class="label">Order ID</span>
                    <span class="value">
                      ${escapeHtml(invoiceNumber)}
                    </span>
                  </div>
                </div>
              </section>

              <section class="section">
                <h2>Order Details</h2>

                <div class="details">
                  <div class="detail">
                    <span class="label">Booking Date</span>
                    <span class="value">
                      ${escapeHtml(createdDate)}
                    </span>
                  </div>

                  <div class="detail">
                    <span class="label">Booking Status</span>
                    <span class="value">
                      ${escapeHtml(bookingStatus)}
                    </span>
                  </div>

                  <div class="detail">
                    <span class="label">Payment Method</span>
                    <span class="value">
                      ${escapeHtml(paymentMethod)}
                    </span>
                  </div>

                  <div class="detail">
                    <span class="label">Payment Status</span>
                    <span class="value">
                      ${escapeHtml(paymentStatus)}
                    </span>
                  </div>
                </div>
              </section>

              <section class="section">
                <h2>Pet / Product Summary</h2>

                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Breed</th>
                      <th class="amount">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>${escapeHtml(petName)}</td>
                      <td>${escapeHtml(petBreed)}</td>
                      <td class="amount">${escapeHtml(price)}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="total">
                  <span>Total Amount</span>
                  <span>${escapeHtml(price)}</span>
                </div>
              </section>

              ${paymentNotice}

              ${
                paidDate
                  ? `
                    <section class="section">
                      <h2>Payment Details</h2>
                      <p>
                        <strong>Payment recorded:</strong>
                        ${escapeHtml(paidDate)}
                      </p>
                    </section>
                  `
                  : ""
              }

              ${
                codCollectedDate
                  ? `
                    <section class="section">
                      <h2>Cash on Delivery Details</h2>
                      <p>
                        <strong>Cash collection recorded:</strong>
                        ${escapeHtml(codCollectedDate)}
                      </p>
                    </section>
                  `
                  : ""
              }

              <section class="section">
                <h2>Additional Notes</h2>
                <p class="notes">${escapeHtml(notes)}</p>
              </section>

              <footer class="footer">
                <p>
                  Thank you for choosing PawMart! 🐾
                </p>
                <p>
                  This document is generated from the booking
                  information currently available in PawMart.
                </p>
                <p>
                  It is an order summary and is not a GST tax
                  invoice or proof of payment unless the
                  payment status confirms that payment has
                  been recorded.
                </p>
              </footer>

              <div class="print-actions">
                <button
                  class="print-button"
                  onclick="window.print()"
                >
                  🖨️ Print / Save as PDF
                </button>
              </div>
            </main>
          </body>
        </html>
      `;

      invoiceWindow.document.open();
      invoiceWindow.document.write(invoiceHtml);
      invoiceWindow.document.close();
      invoiceWindow.focus();

      // Open the print dialog after the invoice has rendered.
      window.setTimeout(() => {
        if (!invoiceWindow.closed) {
          invoiceWindow.focus();
          invoiceWindow.print();
        }
      }, 500);
    } catch (error) {
      console.error("Invoice generation error:", error);

      if (invoiceWindow && !invoiceWindow.closed) {
        invoiceWindow.close();
      }

      setMessage(
        "Unable to generate the invoice. Please try again."
      );
    } finally {
      setInvoiceBookingId("");
    }
  }

  // ========================================
  // TRACK ORDER
  // GET /api/bookings/track/:orderId
  // ========================================

  async function trackOrder(booking) {
    const orderId = booking.orderId;

    if (!orderId) {
      setTrackingBookingId(booking._id);
      setTrackingResult(null);
      setTrackingError(
        "This booking does not have an Order ID. Refresh your bookings or check the booking record in MongoDB."
      );
      return;
    }

    setTrackingBookingId(booking._id);
    setTrackingLoading(true);
    setTrackingResult(null);
    setTrackingError("");

    try {
      const response = await fetch(
        `${API}/api/bookings/track/${encodeURIComponent(orderId)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to track this order."
        );
      }

      if (!data.booking) {
        throw new Error("No tracking information was returned.");
      }

      setTrackingResult(data.booking);
    } catch (error) {
      setTrackingError(
        error.message || "Unable to track this order."
      );
    } finally {
      setTrackingLoading(false);
    }
  }

  // ========================================
  // COPY ORDER ID
  // ========================================

  async function copyOrderId(orderId) {
    if (!orderId) {
      setMessage("Order ID is unavailable.");
      return;
    }

    try {
      await navigator.clipboard.writeText(orderId);

      setMessage(
        `Order ID ${orderId} copied successfully!`
      );
    } catch {
      setMessage(
        "Unable to copy automatically. Please select and copy the Order ID."
      );
    }
  }

  // ========================================
  // CANCEL BOOKING
  // ========================================

  async function cancelBooking(bookingId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    setCancellingBooking(bookingId);
    setBookingError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API}/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to cancel booking."
        );
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, ...data.booking }
            : booking
        )
      );

      if (trackingBookingId === bookingId) {
        setTrackingResult(null);
      }

      setMessage("Booking cancelled successfully! 🐾");
    } catch (error) {
      setBookingError(
        error.message || "Unable to cancel booking."
      );
    } finally {
      setCancellingBooking("");
    }
  }

  // ========================================
  // DELETE BOOKING
  // DELETE /api/bookings/:id
  // ========================================

  async function deleteBooking(bookingId) {
    const confirmed = window.confirm(
      "Delete this booking from your account? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingBooking(bookingId);
    setBookingError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API}/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete this booking."
        );
      }

      setBookings((currentBookings) =>
        currentBookings.filter(
          (booking) => booking._id !== bookingId
        )
      );

      if (trackingBookingId === bookingId) {
        setTrackingBookingId("");
        setTrackingResult(null);
        setTrackingError("");
      }

      setMessage(
        data.message || "Booking deleted successfully! 🐾"
      );
    } catch (error) {
      setBookingError(
        error.message || "Unable to delete this booking."
      );
    } finally {
      setDeletingBooking("");
    }
  }

  // ========================================
  // LOGOUT
  // ========================================

  async function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) return;

    setLoggingOut(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to log out. Please try again."
        );
      }

      localStorage.removeItem("pawMartUser");

      setProfile(emptyProfile);
      setForm(emptyProfile);

      navigate("/login", { replace: true });
    } catch (error) {
      setMessage(
        error.message ||
          "Unable to log out. Please check your connection."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  // ========================================
  // PROFILE PHOTO
  // ========================================

  function persistProfilePhoto(photoDataUrl) {
    const updatedProfile = {
      ...profile,
      profilePhoto: photoDataUrl,
    };

    const updatedForm = {
      ...form,
      profilePhoto: photoDataUrl,
    };

    try {
      localStorage.setItem(
        "pawMartUser",
        JSON.stringify(updatedProfile)
      );

      setProfile(updatedProfile);
      setForm(updatedForm);

      setMessage(
        photoDataUrl
          ? "Profile photo updated! 📸"
          : "Profile photo removed."
      );
    } catch {
      setMessage(
        "Unable to save this photo in your browser. Try a smaller image."
      );
    }
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    // Allow choosing the same file again.
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Please choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxSide = 512;

        const scale = Math.min(
          1,
          maxSide / Math.max(image.width, image.height)
        );

        const canvas = document.createElement("canvas");

        canvas.width = Math.max(
          1,
          Math.round(image.width * scale)
        );

        canvas.height = Math.max(
          1,
          Math.round(image.height * scale)
        );

        const context = canvas.getContext("2d");

        if (!context) {
          setMessage(
            "This image could not be processed. Please try another one."
          );
          return;
        }

        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const compressedPhoto = canvas.toDataURL(
          "image/jpeg",
          0.82
        );

        persistProfilePhoto(compressedPhoto);
      };

      image.onerror = () => {
        setMessage(
          "Unable to read this image. Please try another one."
        );
      };

      image.src = String(reader.result || "");
    };

    reader.onerror = () => {
      setMessage("Unable to read this image. Please try again.");
    };

    reader.readAsDataURL(file);
  }

  function removeProfilePhoto() {
    persistProfilePhoto("");
  }

  // ========================================
  // EDIT PROFILE
  // ========================================

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function saveProfile(event) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/api/auth/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          location: form.location,
          bio: form.bio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update profile."
        );
      }

      const updated = {
        ...form,
        ...(data.user || {}),
        profilePhoto:
          (data.user || {}).profilePhoto ||
          form.profilePhoto ||
          profile.profilePhoto ||
          "",
      };

      setProfile(updated);
      setForm(updated);

      localStorage.setItem(
        "pawMartUser",
        JSON.stringify(updated)
      );

      setEditing(false);
      setMessage("Profile updated successfully! 🎉");
    } catch (error) {
      setMessage(
        error.message ||
          "Could not save changes. Check that the profile API is configured."
      );
    } finally {
      setSaving(false);
    }
  }

  // ========================================
  // MY PETS
  // ========================================

  function addPet(event) {
    event.preventDefault();

    if (!petForm.name.trim()) {
      return;
    }

    const newPet = {
      ...petForm,
      name: petForm.name.trim(),
      id: `${Date.now()}-${Math.random()}`,
    };

    const updatedPets = [...pets, newPet];

    setPets(updatedPets);

    localStorage.setItem(
      "pawMartPets",
      JSON.stringify(updatedPets)
    );

    setPetForm({
      name: "",
      type: "Dog",
      breed: "",
      age: "",
    });

    setMessage(
      `${newPet.name} added to your pet family! 🐾`
    );
  }

  function removePet(id) {
    const updatedPets = pets.filter(
      (pet) => pet.id !== id
    );

    setPets(updatedPets);

    localStorage.setItem(
      "pawMartPets",
      JSON.stringify(updatedPets)
    );
  }

  // ========================================
  // PROFILE INITIAL
  // ========================================

  const initial = (
    profile.name ||
    profile.email ||
    "P"
  )
    .charAt(0)
    .toUpperCase();

  if (loading) {
    return (
      <div className="profile-loading">
        Loading your profile...
      </div>
    );
  }

  // ========================================
  // RENDER PROFILE
  // ========================================

  return (
    <main className="profile-page">
      <div className="profile-container">

        {/* HEADER */}
        <header className="profile-header">
          <Link to="/" className="profile-logo">
            🐾 PawMart
          </Link>

          <div className="profile-header-actions">
            <Link to="/" className="profile-home-link">
              ← Back to Home
            </Link>

            {/* Only one Logout button */}
            <button
              type="button"
              className="profile-button profile-logout-button"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="Log out of PawMart"
            >
              {loggingOut ? "Logging out..." : "↪ Logout"}
            </button>
          </div>
        </header>

        {/* PROFILE BANNER */}
        <section className="profile-banner">
          <div>
            <span className="profile-eyebrow">
              YOUR PAWMART ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Your account, your pets, your happy place. 💜
            </p>
          </div>

          <div className="profile-banner-paw">🐾</div>
        </section>

        {/* GLOBAL MESSAGE */}
        {message && (
          <div className="profile-message" role="status">
            {message}
          </div>
        )}

        <div className="profile-layout">

          {/* SIDEBAR */}
          <aside className="profile-sidebar">
            <div
              className="profile-avatar"
              style={{
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt="Your profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                initial
              )}
            </div>

            {/* PROFILE PHOTO CONTROLS */}
            <div className="profile-photo-actions">
              <label
                className="profile-photo-upload"
                style={{
                  cursor: "pointer",
                  display: "inline-block",
                  marginTop: 10,
                }}
              >
                📷{" "}
                {profile.profilePhoto
                  ? "Change photo"
                  : "Add profile photo"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  aria-label="Choose a profile photo"
                  style={{ display: "none" }}
                />
              </label>

              {profile.profilePhoto && (
                <button
                  type="button"
                  onClick={removeProfilePhoto}
                  className="profile-photo-remove"
                  style={{
                    display: "block",
                    margin: "7px auto 0",
                    border: "none",
                    background: "transparent",
                    color: "#dc2626",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Remove photo
                </button>
              )}
            </div>

            <h2>{profile.name || "Pet Parent"}</h2>

            <p className="profile-email">
              {profile.email || "Email not available"}
            </p>

            <span className="profile-badge">
              🐶 PawMart Member
            </span>

            <nav className="profile-navigation">
              <a href="#personal">👤 Personal Details</a>
              <a href="#pets">🐕 My Pets</a>
              <a href="#favorites">❤️ Favorites</a>
              <a href="#orders">📦 My Bookings</a>
              <a href="#security">🔐 Security</a>
            </nav>
          </aside>

          <div className="profile-main">

            {/* PERSONAL DETAILS */}
            <section className="profile-card" id="personal">
              <div className="profile-card-heading">
                <div>
                  <h2>Personal Details</h2>
                  <p>Manage your personal information.</p>
                </div>

                {!editing && (
                  <button
                    type="button"
                    className="profile-button profile-button-light"
                    onClick={() => {
                      setForm(profile);
                      setEditing(true);
                    }}
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>

              {editing ? (
                <form
                  className="profile-form"
                  onSubmit={saveProfile}
                >
                  <label>
                    Full Name
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      maxLength={80}
                    />
                  </label>

                  <label>
                    Email Address
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    Phone Number
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      maxLength={25}
                    />
                  </label>

                  <label>
                    Location
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="City, State"
                      maxLength={100}
                    />
                  </label>

                  <label className="profile-full-width">
                    About Me
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      rows="3"
                      maxLength={300}
                    />
                  </label>

                  <div className="profile-form-actions profile-full-width">
                    <button
                      type="button"
                      className="profile-button profile-button-light"
                      onClick={() => {
                        setForm(profile);
                        setEditing(false);
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="profile-button"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-details">
                  <div>
                    <span>Full Name</span>
                    <strong>
                      {profile.name || "Not added yet"}
                    </strong>
                  </div>

                  <div>
                    <span>Email Address</span>
                    <strong>
                      {profile.email || "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>Phone Number</span>
                    <strong>
                      {profile.phone || "Not added yet"}
                    </strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>
                      {profile.location || "Not added yet"}
                    </strong>
                  </div>

                  <div className="profile-full-width">
                    <span>About Me</span>
                    <strong>
                      {profile.bio || "Tell us about yourself."}
                    </strong>
                  </div>
                </div>
              )}
            </section>

            {/* MY PETS */}
            <section className="profile-card" id="pets">
              <div className="profile-card-heading">
                <div>
                  <h2>My Pets 🐾</h2>
                  <p>Your furry family members.</p>
                </div>

                <span className="profile-count">
                  {pets.length} Pets
                </span>
              </div>

              <form className="pet-form" onSubmit={addPet}>
                <label>
                  Pet Name
                  <input
                    value={petForm.name}
                    onChange={(event) =>
                      setPetForm({
                        ...petForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="e.g. Bruno"
                    required
                    maxLength={50}
                  />
                </label>

                <label>
                  Pet Type
                  <select
                    value={petForm.type}
                    onChange={(event) =>
                      setPetForm({
                        ...petForm,
                        type: event.target.value,
                      })
                    }
                  >
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Bird</option>
                    <option>Rabbit</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Breed
                  <input
                    value={petForm.breed}
                    onChange={(event) =>
                      setPetForm({
                        ...petForm,
                        breed: event.target.value,
                      })
                    }
                    placeholder="e.g. Labrador"
                    maxLength={60}
                  />
                </label>

                <label>
                  Age
                  <input
                    value={petForm.age}
                    onChange={(event) =>
                      setPetForm({
                        ...petForm,
                        age: event.target.value,
                      })
                    }
                    placeholder="e.g. 2 years"
                    maxLength={30}
                  />
                </label>

                <button
                  className="profile-button"
                  type="submit"
                >
                  + Add Pet
                </button>
              </form>

              {pets.length === 0 ? (
                <div className="profile-empty">
                  <span>🐕</span>
                  <p>No pets added yet.</p>
                  <small>
                    Add your first pet using the form above.
                  </small>
                </div>
              ) : (
                <div className="pet-list">
                  {pets.map((pet) => (
                    <article
                      className="pet-item"
                      key={pet.id}
                    >
                      <div className="pet-icon">
                        {pet.type === "Cat"
                          ? "🐱"
                          : pet.type === "Bird"
                          ? "🐦"
                          : pet.type === "Rabbit"
                          ? "🐰"
                          : pet.type === "Dog"
                          ? "🐶"
                          : "🐾"}
                      </div>

                      <div className="pet-information">
                        <strong>{pet.name}</strong>
                        <span>
                          {[pet.type, pet.breed, pet.age]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </div>

                      <button
                        className="pet-remove"
                        type="button"
                        onClick={() => removePet(pet.id)}
                      >
                        Remove
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* FAVORITES */}
            <section
              className="profile-card"
              id="favorites"
            >
              <div className="profile-card-heading">
                <div>
                  <h2>My Favorites ❤️</h2>
                  <p>Your favorite pets and products.</p>
                </div>
              </div>

              <div className="profile-placeholder">
                <span>❤️</span>
                <p>Your favorites will appear here.</p>
                <small>
                  Your existing favorites API can be connected
                  to this section next.
                </small>
              </div>
            </section>

            {/* MY BOOKINGS */}
            <section
              className="profile-card"
              id="orders"
            >
              <div className="profile-card-heading">
                <div>
                  <h2>My Bookings 🐾</h2>
                  <p>
                    Track orders, view payment status, and
                    download your invoice.
                  </p>
                </div>

                <button
                  type="button"
                  className="profile-button profile-button-light"
                  onClick={loadBookings}
                  disabled={bookingsLoading}
                >
                  {bookingsLoading ? "Loading..." : "↻ Refresh"}
                </button>
              </div>

              {bookingError && (
                <div
                  className="profile-message"
                  role="alert"
                >
                  {bookingError}
                </div>
              )}

              {bookingsLoading ? (
                <div className="profile-placeholder">
                  <span>⏳</span>
                  <p>Loading your bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="profile-placeholder">
                  <span>🐶</span>
                  <p>No bookings yet.</p>
                  <small>
                    Your pet booking requests will appear
                    here when you make them.
                  </small>

                  <Link
                    to="/"
                    className="profile-security-link"
                  >
                    Explore PawMart
                  </Link>
                </div>
              ) : (
                <div className="booking-list">
                  {bookings.map((booking) => (
                    <article
                      className="booking-item"
                      key={booking._id}
                    >
                      {/* PET IMAGE */}
                      {booking.dogImage ? (
                        <img
                          className="booking-image"
                          src={booking.dogImage}
                          alt={booking.dogName || "Pet"}
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="booking-image-placeholder">
                          🐕
                        </div>
                      )}

                      <div className="booking-information">
                        <h3>
                          {booking.dogName || booking.breed}
                        </h3>

                        <p>
                          <strong>Breed:</strong>{" "}
                          {booking.breed || "Not specified"}
                        </p>

                        <p>
                          <strong>Price:</strong>{" "}
                          {formatCurrency(booking.price)}
                        </p>

                        <p>
                          <strong>Requested:</strong>{" "}
                          {formatDate(booking.createdAt)}
                        </p>

                        {/* ORDER ID */}
                        <div
                          style={{
                            margin: "12px 0",
                            padding: "10px 12px",
                            background: "#f5f3ff",
                            border: "1px solid #ddd6fe",
                            borderRadius: "8px",
                            overflowWrap: "anywhere",
                          }}
                        >
                          <strong
                            style={{
                              display: "block",
                              marginBottom: "4px",
                              color: "#4c1d95",
                            }}
                          >
                            Order ID
                          </strong>

                          <span>
                            {booking.orderId ||
                              "Order ID unavailable"}
                          </span>

                          {booking.orderId && (
                            <button
                              type="button"
                              onClick={() =>
                                copyOrderId(booking.orderId)
                              }
                              style={{
                                display: "block",
                                marginTop: "8px",
                                padding: "5px 10px",
                                border: "1px solid #c4b5fd",
                                borderRadius: "6px",
                                background: "#ffffff",
                                cursor: "pointer",
                              }}
                            >
                              📋 Copy Order ID
                            </button>
                          )}
                        </div>

                        {/* BOOKING STATUS */}
                        <p>
                          <strong>Booking Status:</strong>
                        </p>

                        <span
                          className={`booking-status booking-status-${String(
                            booking.status || "Pending"
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {booking.status || "Pending"}
                        </span>

                        {/* PAYMENT STATUS */}
                        <p style={{ marginTop: "10px" }}>
                          <strong>Payment Status:</strong>{" "}
                          {booking.paymentStatus || "Pending"}
                        </p>

                        {booking.paymentMethod && (
                          <p>
                            <strong>Payment Method:</strong>{" "}
                            {booking.paymentMethod}
                          </p>
                        )}

                        {/* BOOKING ACTIONS */}
                        <div
                          className="booking-actions"
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                            marginTop: "12px",
                          }}
                        >
                          {/* TRACK ORDER */}
                          <button
                            type="button"
                            className="profile-button"
                            onClick={() => trackOrder(booking)}
                            disabled={
                              trackingLoading &&
                              trackingBookingId === booking._id
                            }
                          >
                            {trackingLoading &&
                            trackingBookingId === booking._id
                              ? "Tracking..."
                              : "📦 Track Order"}
                          </button>

                          {/* DOWNLOAD INVOICE */}
                          <button
                            type="button"
                            className="profile-button profile-button-light"
                            onClick={() => downloadInvoice(booking)}
                            disabled={invoiceBookingId === booking._id}
                          >
                            {invoiceBookingId === booking._id
                              ? "Preparing..."
                              : "🧾 Download Invoice"}
                          </button>

                          {/* CANCEL BOOKING */}
                          {booking.status === "Pending" && (
                            <button
                              type="button"
                              className="pet-remove"
                              disabled={
                                cancellingBooking === booking._id ||
                                deletingBooking === booking._id
                              }
                              onClick={() =>
                                cancelBooking(booking._id)
                              }
                            >
                              {cancellingBooking === booking._id
                                ? "Cancelling..."
                                : "Cancel Booking"}
                            </button>
                          )}

                          {/* DELETE BOOKING */}
                          <button
                            type="button"
                            className="pet-remove booking-delete-button"
                            style={{
                              backgroundColor: "#dc2626",
                              color: "#ffffff",
                              border: "none",
                              cursor:
                                deletingBooking === booking._id
                                  ? "wait"
                                  : "pointer",
                              opacity:
                                deletingBooking === booking._id
                                  ? 0.7
                                  : 1,
                            }}
                            disabled={
                              deletingBooking === booking._id ||
                              cancellingBooking === booking._id
                            }
                            onClick={() =>
                              deleteBooking(booking._id)
                            }
                          >
                            {deletingBooking === booking._id
                              ? "Deleting..."
                              : "🗑️ Delete"}
                          </button>
                        </div>

                        {/* TRACKING RESULT */}
                        {trackingBookingId === booking._id && (
                          <div
                            style={{
                              marginTop: "16px",
                              padding: "14px",
                              borderRadius: "10px",
                              border: "1px solid #e5e7eb",
                              background: "#ffffff",
                            }}
                          >
                            <h4
                              style={{
                                margin: "0 0 12px",
                              }}
                            >
                              📦 Order Tracking
                            </h4>

                            {trackingLoading && (
                              <p>
                                Fetching the latest order
                                information...
                              </p>
                            )}

                            {!trackingLoading &&
                              trackingError && (
                                <p
                                  role="alert"
                                  style={{ color: "#b91c1c" }}
                                >
                                  {trackingError}
                                </p>
                              )}

                            {!trackingLoading &&
                              trackingResult && (
                                <>
                                  <p>
                                    <strong>Order ID:</strong>{" "}
                                    {trackingResult.orderId ||
                                      booking.orderId ||
                                      "Unavailable"}
                                  </p>

                                  <p>
                                    <strong>Booking Status:</strong>{" "}
                                    {trackingResult.status ||
                                      "Pending"}
                                  </p>

                                  <p>
                                    <strong>Payment Status:</strong>{" "}
                                    {trackingResult.paymentStatus ||
                                      "Pending"}
                                  </p>

                                  <p>
                                    <strong>Last Updated:</strong>{" "}
                                    {formatDateTime(
                                      trackingResult.updatedAt
                                    )}
                                  </p>

                                  <small
                                    style={{
                                      display: "block",
                                      marginTop: "8px",
                                      color: "#6b7280",
                                    }}
                                  >
                                    Tracking details come from
                                    your booking record in PawMart.
                                  </small>
                                </>
                              )}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* ACCOUNT SECURITY */}
            <section
              className="profile-card"
              id="security"
            >
              <div className="profile-card-heading">
                <div>
                  <h2>Account Security 🔐</h2>
                  <p>Keep your account protected.</p>
                </div>
              </div>

              <div className="profile-security">
                <div className="security-icon">🔒</div>

                <div>
                  <strong>Password Protection</strong>
                  <p>
                    Forgot your password? Use the password
                    recovery feature to securely reset it.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="profile-security-link"
                >
                  Login Page
                </Link>
              </div>
            </section>

          </div>
        </div>

        {/* FOOTER */}
        <footer className="profile-footer">
          Made with 💜 for pet parents everywhere.
        </footer>

      </div>
    </main>
  );
}