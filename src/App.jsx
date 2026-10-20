// import React, { useState } from "react";
// import { motion } from "framer-motion";

// import {
//   ArrowRight,
//   Heart,
//   ShieldCheck,
//   Truck,
//   Star,
//   Menu,
//   X,
//   PawPrint,
//   Search,
//   CheckCircle,
// } from "lucide-react";

// import { Link } from "react-router-dom";
// import "./App.css";

// const breeds = [
//   {
//     name: "Golden Retriever",
//     description: "Friendly, loyal & loving",
//     image:
//       "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=700&q=85",
//     price: "₹18,000",
//   },
//   {
//     name: "Labrador",
//     description: "Playful, gentle & smart",
//     image:
//       "https://tse2.mm.bing.net/th/id/OIP.HJiDCoiN_-ql0IdJCHZIywHaEo?r=0&pid=Api&h=220&P=0",
//     price: "₹15,000",
//   },
//   {
//     name: "German Shepherd",
//     description: "Brave, intelligent & loyal",
//     image:
//       "https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=700&q=85",
//     price: "₹22,000",
//   },
//   {
//     name: "Shih Tzu",
//     description: "Cute, affectionate & calm",
//     image:
//       "https://images2.alphacoders.com/139/thumb-1920-1395411.png",
//     price: "₹20,000",
//   },
// ];

// const benefits = [
//   {
//     icon: <ShieldCheck />,
//     title: "Trusted Breeders",
//     description:
//       "Connect with responsible breeders who prioritize the health and happiness of every puppy.",
//   },
//   {
//     icon: <Heart />,
//     title: "Health Comes First",
//     description:
//       "Learn about vaccination, health records, and the care your new companion needs.",
//   },
//   {
//     icon: <Truck />,
//     title: "Easy Experience",
//     description:
//       "Discover your ideal companion with a simple, convenient browsing experience.",
//   },
// ];

// const steps = [
//   {
//     number: "01",
//     title: "Explore",
//     description: "Browse adorable dogs and discover different breeds.",
//   },
//   {
//     number: "02",
//     title: "Connect",
//     description: "Find out more about the dog and connect with the seller.",
//   },
//   {
//     number: "03",
//     title: "Welcome Home",
//     description: "Prepare your home for your new best friend.",
//   },
// ];

// function App() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   const scrollTo = (id) => {
//     document.getElementById(id)?.scrollIntoView({
//       behavior: "smooth",
//     });

//     setMobileMenuOpen(false);
//   };

//   const handleSearch = (event) => {
//     event.preventDefault();

//     const query = searchTerm.trim();

//     if (query) {
//       window.location.href = `/dogs?search=${encodeURIComponent(query)}`;
//     } else {
//       window.location.href = "/dogs";
//     }
//   };

//   return (
//     <div className="pawmart">
//       {/* Announcement bar */}
//       <div className="announcement-bar">
//         <PawPrint size={15} />

//         <span>Every dog deserves a loving home.</span>

//         <span className="announcement-divider">|</span>

//         <span>Find your new best friend today!</span>
//       </div>

//       {/* Navigation */}
//       <header className="site-header">
//         <Link to="/" className="brand">
//           <span className="brand-icon">
//             <PawPrint size={25} />
//           </span>

//           <span className="brand-name">
//             paw<span>mart</span>
//             <small>YOUR BEST FRIEND STARTS HERE</small>
//           </span>
//         </Link>

//         <nav className={`nav-links ${mobileMenuOpen ? "nav-open" : ""}`}>
//           <Link to="/" onClick={() => setMobileMenuOpen(false)}>
//             Home
//           </Link>

//           <Link to="/dogs" onClick={() => setMobileMenuOpen(false)}>
//             Find a Dog
//           </Link>

//           <Link to="/adoption" onClick={() => setMobileMenuOpen(false)}>
//             Adoption
//           </Link>

//           {/* Order Tracking */}
//           <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)}>
//             Track Orders
//           </Link>

//           <button onClick={() => scrollTo("about")}>About Us</button>

//           <button onClick={() => scrollTo("how-it-works")}>
//             How It Works
//           </button>

//           {/* Mobile authentication links */}
//           <div className="mobile-auth">
//             <Link
//               to="/profile"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               👤 My Profile
//             </Link>

//             <Link
//               to="/login"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Log In
//             </Link>

//             <Link
//               to="/register"
//               className="nav-register"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Get Started
//             </Link>
//           </div>
//         </nav>

//         {/* Desktop authentication links */}
//         <div className="header-actions">
//           <Link to="/profile" className="login-link">
//             👤 My Profile
//           </Link>

//           <Link to="/pawsure" className="pawsure-home-button">
//   <span>🛡️</span>
//   Explore PawSure
//   <span>↗</span>
// </Link>

//           <Link to="/login" className="login-link">
//             Log In
//           </Link>

//           <Link to="/register" className="header-cta">
//             Get Started <ArrowRight size={16} />
//           </Link>
//         </div>

//         {/* Mobile menu button */}
//         <button
//           className="mobile-menu-button"
//           aria-label="Toggle navigation"
//           aria-expanded={mobileMenuOpen}
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//         >
//           {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
//         </button>
//       </header>

//       <main>
//         {/* Hero section */}
//         <section className="hero">
//           <div className="hero-video-background" aria-hidden="true">
//             <video
//               autoPlay
//               muted
//               loop
//               playsInline
//               preload="auto"
//               poster="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1800&q=85"
//             >
//               <source
//                 src="https://videos.pexels.com/video-files/9085858/9085858-hd_1920_1080_30fps.mp4"
//                 type="video/mp4"
//               />

//               Your browser does not support HTML video.
//             </video>
//           </div>

//           <div className="hero-video-overlay" />

//           <div className="hero-inner">
//             <motion.div
//               className="hero-content"
//               initial={{ opacity: 0, y: 25 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//             >
//               <div className="hero-eyebrow">
//                 <PawPrint size={16} />
//                 <span>MORE THAN PETS. THEY'RE FAMILY.</span>
//               </div>

//               <h1>
//                 Your forever
//                 <br />
//                 friend is <span>waiting.</span>
//               </h1>

//               <p className="hero-description">
//                 Big paws, little paws, and everything in between. Discover
//                 your perfect companion and start a beautiful friendship
//                 that lasts a lifetime.
//               </p>

//               <form className="hero-search" onSubmit={handleSearch}>
//                 <Search size={21} />

//                 <input
//                   type="text"
//                   placeholder="Search breeds, e.g. Golden Retriever"
//                   value={searchTerm}
//                   onChange={(event) => setSearchTerm(event.target.value)}
//                   aria-label="Search dog breeds"
//                 />

//                 <button type="submit">
//                   Find My Dog <ArrowRight size={17} />
//                 </button>
//               </form>

//               <div className="hero-trust">
//                 <div className="trust-avatars">
//                   <img
//                     src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
//                     alt=""
//                   />

//                   <img
//                     src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
//                     alt=""
//                   />

//                   <img
//                     src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&q=80"
//                     alt=""
//                   />
//                 </div>

//                 <div>
//                   <div className="trust-stars">
//                     <Star size={14} fill="currentColor" />
//                     <Star size={14} fill="currentColor" />
//                     <Star size={14} fill="currentColor" />
//                     <Star size={14} fill="currentColor" />
//                     <Star size={14} fill="currentColor" />
//                   </div>

//                   <p>
//                     Loved by <strong>1,200+</strong> happy pet parents
//                   </p>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div
//               className="hero-visual"
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 1, delay: 0.2 }}
//             >
//               <div className="hero-floating-card">
//                 <div className="floating-card-icon">
//                   <Heart size={21} fill="currentColor" />
//                 </div>

//                 <div>
//                   <strong>Unconditional love</strong>
//                   <span>Starts with one little paw.</span>
//                 </div>
//               </div>

//               <div className="hero-photo-badge">
//                 <PawPrint size={18} />
//                 <span>Find your happiness</span>
//               </div>
//             </motion.div>
//           </div>

//           <div className="hero-bottom-note">
//             <span className="hero-note-line" />
//             <span>YOUR NEXT CHAPTER STARTS WITH A PAW</span>
//             <span className="hero-note-line" />
//           </div>
//         </section>

//         {/* Popular breeds */}
//         <section className="breeds-section section-padding" id="breeds">
//           <div className="section-heading">
//             <div>
//               <span className="section-eyebrow">MEET YOUR MATCH</span>

//               <h2>
//                 A little love, a lot of <span>paw-sitivity.</span>
//               </h2>

//               <p>
//                 Meet some of the wonderful companions waiting to make your
//                 everyday extraordinary.
//               </p>
//             </div>

//             <Link to="/dogs" className="text-link">
//               Explore All Dogs <ArrowRight size={17} />
//             </Link>
//           </div>

//           <div className="breed-grid">
//             {breeds.map((breed, index) => (
//               <motion.article
//                 className="breed-card"
//                 key={breed.name}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4, delay: index * 0.1 }}
//               >
//                 <div className="breed-image-wrap">
//                   <img
//                     src={breed.image}
//                     alt={breed.name}
//                     loading="lazy"
//                   />

//                   <span className="breed-badge">
//                     <CheckCircle size={13} /> Popular
//                   </span>

//                   <button
//                     className="breed-heart"
//                     aria-label={`Learn about ${breed.name}`}
//                     onClick={() =>
//                       (window.location.href = `/dogs?search=${encodeURIComponent(
//                         breed.name
//                       )}`)
//                     }
//                   >
//                     <Heart size={19} />
//                   </button>
//                 </div>

//                 <div className="breed-info">
//                   <h3>{breed.name}</h3>

//                   <p>{breed.description}</p>

//                   <div className="breed-card-bottom">
//                     <div>
//                       <span className="price-label">Starting from</span>
//                       <strong>{breed.price}</strong>
//                     </div>

//                     <Link
//                       to={`/dogs?search=${encodeURIComponent(breed.name)}`}
//                       className="breed-arrow"
//                       aria-label={`Explore ${breed.name}`}
//                     >
//                       <ArrowRight size={19} />
//                     </Link>
//                   </div>
//                 </div>
//               </motion.article>
//             ))}
//           </div>
//         </section>

//         {/* About section */}
//         <section className="about-section section-padding" id="about">
//           <div className="about-image">
//             <img
//               src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=85"
//               alt="Two happy dogs enjoying time together"
//               loading="lazy"
//             />

//             <div className="about-image-card">
//               <Heart size={22} fill="currentColor" />

//               <div>
//                 <strong>Love at first paw</strong>
//                 <span>Friendships that last forever</span>
//               </div>
//             </div>
//           </div>

//           <div className="about-content">
//             <span className="section-eyebrow">A LITTLE ABOUT US</span>

//             <h2>
//               We believe every dog deserves a <span>loving home.</span>
//             </h2>

//             <p>
//               At PawMart, we believe finding your four-legged best friend
//               should be a joyful, transparent, and memorable experience.
//               We're here to help you discover the companion who makes your
//               house feel more like home.
//             </p>

//             <div className="about-checks">
//               <div>
//                 <CheckCircle size={19} />
//                 <span>Discover different dog breeds</span>
//               </div>

//               <div>
//                 <CheckCircle size={19} />
//                 <span>Learn about responsible pet ownership</span>
//               </div>

//               <div>
//                 <CheckCircle size={19} />
//                 <span>Explore adoption opportunities</span>
//               </div>
//             </div>

//             <Link to="/dogs" className="primary-button">
//               Find Your Companion <ArrowRight size={17} />
//             </Link>
//           </div>
//         </section>

//         {/* Benefits */}
//         <section className="benefits-section section-padding">
//           <div className="center-heading">
//             <span className="section-eyebrow">THE PAWMART PROMISE</span>

//             <h2>
//               Good dogs. Good people. <span>Good beginnings.</span>
//             </h2>

//             <p>
//               Because bringing a new best friend home should feel wonderful.
//             </p>
//           </div>

//           <div className="benefits-grid">
//             {benefits.map((benefit, index) => (
//               <motion.article
//                 className="benefit-card"
//                 key={benefit.title}
//                 initial={{ opacity: 0, y: 18 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.12 }}
//               >
//                 <div className="benefit-icon">{benefit.icon}</div>
//                 <h3>{benefit.title}</h3>
//                 <p>{benefit.description}</p>
//               </motion.article>
//             ))}
//           </div>
//         </section>

//         {/* How it works */}
//         <section
//           className="how-section section-padding"
//           id="how-it-works"
//         >
//           <div className="center-heading">
//             <span className="section-eyebrow">
//               SIMPLE AS ONE, TWO, WOOF
//             </span>

//             <h2>
//               Three little steps to <span>big love.</span>
//             </h2>

//             <p>Your new best friend is closer than you think.</p>
//           </div>

//           <div className="steps-grid">
//             {steps.map((step, index) => (
//               <motion.article
//                 className="step-card"
//                 key={step.number}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.15 }}
//               >
//                 <span className="step-number">{step.number}</span>
//                 <h3>{step.title}</h3>
//                 <p>{step.description}</p>
//               </motion.article>
//             ))}
//           </div>
//         </section>

//         {/* Adoption section */}
//         <section className="adoption-section section-padding">
//           <div className="adoption-content">
//             <span className="section-eyebrow">OPEN YOUR HEART</span>

//             <h2>
//               The best things in life are <span>rescued.</span>
//             </h2>

//             <p>
//               Your perfect companion may be waiting at a shelter for someone
//               just like you. Give a deserving dog a second chance at
//               happiness.
//             </p>

//             <Link to="/adoption" className="adoption-button">
//               Explore Adoption <Heart size={17} />
//             </Link>
//           </div>

//           <div className="adoption-image">
//             <img
//               src="https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=1000&q=85"
//               alt="Happy dogs playing together"
//               loading="lazy"
//             />
//           </div>
//         </section>

//         {/* Final call to action */}
//         <section className="final-cta section-padding">
//           <div className="cta-paw">
//             <PawPrint size={35} />
//           </div>

//           <span className="section-eyebrow">
//             YOUR BEST FRIEND IS OUT THERE
//           </span>

//           <h2>
//             Ready for a little more <span>love?</span>
//           </h2>

//           <p>
//             Start your journey toward a lifetime of wagging tails and happy
//             memories.
//           </p>

//           <div className="cta-actions">
//             <Link to="/dogs" className="primary-button">
//               Find Your Best Friend <ArrowRight size={17} />
//             </Link>

//             <Link to="/register" className="secondary-button">
//               Join PawMart
//             </Link>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="site-footer">
//         <div className="footer-main">
//           <div className="footer-brand-column">
//             <Link to="/" className="brand footer-brand">
//               <span className="brand-icon">
//                 <PawPrint size={24} />
//               </span>

//               <span className="brand-name">
//                 paw<span>mart</span>
//                 <small>YOUR BEST FRIEND STARTS HERE</small>
//               </span>
//             </Link>

//             <p>
//               Bringing paws and people together, one beautiful friendship
//               at a time.
//             </p>
//           </div>

//           <div className="footer-column">
//             <h4>Explore</h4>

//             <Link to="/dogs">Find a Dog</Link>
//             <Link to="/adoption">Adoption</Link>
//             <Link to="/my-orders">Track Orders</Link>

//             <button onClick={() => scrollTo("about")}>About Us</button>
//           </div>

//           <div className="footer-column">
//             <h4>Get Started</h4>

//             <Link to="/login">Log In</Link>
//             <Link to="/register">Create Account</Link>

//             <button onClick={() => scrollTo("how-it-works")}>
//               How It Works
//             </button>
//           </div>

//           <div className="footer-column">
//             <h4>Our Promise</h4>

//             <span>Responsible pet ownership</span>
//             <span>Happy homes</span>
//             <span>More wagging tails</span>
//           </div>
//         </div>

//         <div className="footer-bottom">
//           <span>
//             © {new Date().getFullYear()} PawMart. Made with love.
//           </span>

//           <span className="footer-love">
//             Made for paws and people <Heart size={14} fill="currentColor" />
//           </span>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;


// import React, { useState } from "react";
// import { motion } from "framer-motion";

// import {
//   ArrowRight,
//   Heart,
//   ShieldCheck,
//   Truck,
//   Star,
//   Menu,
//   X,
//   PawPrint,
//   Search,
//   CheckCircle,
// } from "lucide-react";

// import { Link } from "react-router-dom";
// import "./App.css";

// const breeds = [
//   {
//     name: "Golden Retriever",
//     description: "Friendly, loyal & loving",
//     image:
//       "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=700&q=85",
//     price: "₹18,000",
//   },
//   {
//     name: "Labrador",
//     description: "Playful, gentle & smart",
//     image:
//       "https://tse2.mm.bing.net/th/id/OIP.HJiDCoiN_-ql0IdJCHZIywHaEo?r=0&pid=Api&h=220&P=0",
//     price: "₹15,000",
//   },
//   {
//     name: "German Shepherd",
//     description: "Brave, intelligent & loyal",
//     image:
//       "https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=700&q=85",
//     price: "₹22,000",
//   },
//   {
//     name: "Shih Tzu",
//     description: "Cute, affectionate & calm",
//     image:
//       "https://images2.alphacoders.com/139/thumb-1920-1395411.png",
//     price: "₹20,000",
//   },
// ];

// const benefits = [
//   {
//     icon: <ShieldCheck />,
//     title: "Trusted Breeders",
//     description:
//       "Connect with responsible breeders who prioritize the health and happiness of every puppy.",
//   },
//   {
//     icon: <Heart />,
//     title: "Health Comes First",
//     description:
//       "Learn about vaccination, health records, and the care your new companion needs.",
//   },
//   {
//     icon: <Truck />,
//     title: "Easy Experience",
//     description:
//       "Discover your ideal companion with a simple, convenient browsing experience.",
//   },
// ];

// const steps = [
//   {
//     number: "01",
//     title: "Explore",
//     description:
//       "Browse adorable dogs and discover different breeds.",
//   },
//   {
//     number: "02",
//     title: "Connect",
//     description:
//       "Find out more about the dog and connect with the seller.",
//   },
//   {
//     number: "03",
//     title: "Welcome Home",
//     description:
//       "Prepare your home for your new best friend.",
//   },
// ];

// function App() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   const scrollTo = (id) => {
//     document.getElementById(id)?.scrollIntoView({
//       behavior: "smooth",
//     });

//     setMobileMenuOpen(false);
//   };

//   const handleSearch = (event) => {
//     event.preventDefault();

//     const query = searchTerm.trim();

//     if (query) {
//       window.location.href = `/dogs?search=${encodeURIComponent(
//         query
//       )}`;
//     } else {
//       window.location.href = "/dogs";
//     }
//   };

//   return (
//     <div className="pawmart">
//       {/* ========================================
//           ANNOUNCEMENT BAR
//       ======================================== */}

//       <div className="announcement-bar">
//         <PawPrint size={15} />

//         <span>Every dog deserves a loving home.</span>

//         <span className="announcement-divider">|</span>

//         <span>Find your new best friend today!</span>
//       </div>

//       {/* ========================================
//           NAVIGATION
//       ======================================== */}

//       <header className="site-header">
//         <Link to="/" className="brand">
//           <span className="brand-icon">
//             <PawPrint size={25} />
//           </span>

//           <span className="brand-name">
//             paw<span>mart</span>
//             <small>YOUR BEST FRIEND STARTS HERE</small>
//           </span>
//         </Link>

//         <nav
//           className={`nav-links ${
//             mobileMenuOpen ? "nav-open" : ""
//           }`}
//         >
//           <Link
//             to="/"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Home
//           </Link>

//           <Link
//             to="/dogs"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Find a Dog
//           </Link>

//           <Link
//             to="/adoption"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Adoption
//           </Link>

//           <Link
//             to="/pet-cost-predictor"
//             className="cost-predictor-nav-link"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             💰 Pet Cost Predictor
//           </Link>

//           <Link
//             to="/my-orders"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             Track Orders
//           </Link>

//           <button onClick={() => scrollTo("about")}>
//             About Us
//           </button>

//           <button
//             onClick={() => scrollTo("how-it-works")}
//           >
//             How It Works
//           </button>

//           {/* MOBILE AUTHENTICATION LINKS */}

//           <div className="mobile-auth">
//             <Link
//               to="/profile"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               👤 My Profile
//             </Link>

//             <Link
//               to="/login"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Log In
//             </Link>

//             <Link
//               to="/register"
//               className="nav-register"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Get Started
//             </Link>
//           </div>
//         </nav>

//         {/* DESKTOP AUTHENTICATION LINKS */}

//         <div className="header-actions">
//           <Link to="/profile" className="login-link">
//             👤 My Profile
//           </Link>

//           <Link
//             to="/pawsure"
//             className="pawsure-home-button"
//           >
//             <span>🛡️</span>
//             Explore PawSure
//             <span>↗</span>
//           </Link>

//           <Link to="/login" className="login-link">
//             Log In
//           </Link>

//           <Link to="/register" className="header-cta">
//             Get Started <ArrowRight size={16} />
//           </Link>
//         </div>

//         {/* MOBILE MENU BUTTON */}

//         <button
//           type="button"
//           className="mobile-menu-button"
//           aria-label="Toggle navigation"
//           aria-expanded={mobileMenuOpen}
//           onClick={() =>
//             setMobileMenuOpen(!mobileMenuOpen)
//           }
//         >
//           {mobileMenuOpen ? (
//             <X size={25} />
//           ) : (
//             <Menu size={25} />
//           )}
//         </button>
//       </header>

//       <main>
//         {/* ========================================
//             HERO SECTION
//         ======================================== */}

//         <section className="hero">
//           <div
//             className="hero-video-background"
//             aria-hidden="true"
//           >
//             <video
//               autoPlay
//               muted
//               loop
//               playsInline
//               preload="auto"
//               poster="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1800&q=85"
//             >
//               <source
//                 src="https://videos.pexels.com/video-files/9085858/9085858-hd_1920_1080_30fps.mp4"
//                 type="video/mp4"
//               />

//               Your browser does not support HTML video.
//             </video>
//           </div>

//           <div className="hero-video-overlay" />

//           <div className="hero-inner">
//             <motion.div
//               className="hero-content"
//               initial={{ opacity: 0, y: 25 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//             >
//               <div className="hero-eyebrow">
//                 <PawPrint size={16} />
//                 <span>
//                   MORE THAN PETS. THEY&apos;RE FAMILY.
//                 </span>
//               </div>

//               <h1>
//                 Your forever
//                 <br />
//                 friend is <span>waiting.</span>
//               </h1>

//               <p className="hero-description">
//                 Big paws, little paws, and everything in
//                 between. Discover your perfect companion and
//                 start a beautiful friendship that lasts a
//                 lifetime.
//               </p>

//               <form
//                 className="hero-search"
//                 onSubmit={handleSearch}
//               >
//                 <Search size={21} />

//                 <input
//                   type="text"
//                   placeholder="Search breeds, e.g. Golden Retriever"
//                   value={searchTerm}
//                   onChange={(event) =>
//                     setSearchTerm(event.target.value)
//                   }
//                   aria-label="Search dog breeds"
//                 />

//                 <button type="submit">
//                   Find My Dog <ArrowRight size={17} />
//                 </button>
//               </form>

//               <div className="hero-trust">
//                 <div className="trust-avatars">
//                   <img
//                     src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
//                     alt=""
//                   />

//                   <img
//                     src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
//                     alt=""
//                   />

//                   <img
//                     src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&q=80"
//                     alt=""
//                   />
//                 </div>

//                 <div>
//                   <div className="trust-stars">
//                     <Star
//                       size={14}
//                       fill="currentColor"
//                     />
//                     <Star
//                       size={14}
//                       fill="currentColor"
//                     />
//                     <Star
//                       size={14}
//                       fill="currentColor"
//                     />
//                     <Star
//                       size={14}
//                       fill="currentColor"
//                     />
//                     <Star
//                       size={14}
//                       fill="currentColor"
//                     />
//                   </div>

//                   <p>
//                     Loved by <strong>1,200+</strong> happy
//                     pet parents
//                   </p>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div
//               className="hero-visual"
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{
//                 duration: 1,
//                 delay: 0.2,
//               }}
//             >
//               <div className="hero-floating-card">
//                 <div className="floating-card-icon">
//                   <Heart
//                     size={21}
//                     fill="currentColor"
//                   />
//                 </div>

//                 <div>
//                   <strong>Unconditional love</strong>
//                   <span>Starts with one little paw.</span>
//                 </div>
//               </div>

//               <div className="hero-photo-badge">
//                 <PawPrint size={18} />
//                 <span>Find your happiness</span>
//               </div>
//             </motion.div>
//           </div>

//           <div className="hero-bottom-note">
//             <span className="hero-note-line" />

//             <span>
//               YOUR NEXT CHAPTER STARTS WITH A PAW
//             </span>

//             <span className="hero-note-line" />
//           </div>
//         </section>

//         {/* ========================================
//             POPULAR BREEDS
//         ======================================== */}

//         <section
//           className="breeds-section section-padding"
//           id="breeds"
//         >
//           <div className="section-heading">
//             <div>
//               <span className="section-eyebrow">
//                 MEET YOUR MATCH
//               </span>

//               <h2>
//                 A little love, a lot of{" "}
//                 <span>paw-sitivity.</span>
//               </h2>

//               <p>
//                 Meet some of the wonderful companions waiting
//                 to make your everyday extraordinary.
//               </p>
//             </div>

//             <Link to="/dogs" className="text-link">
//               Explore All Dogs <ArrowRight size={17} />
//             </Link>
//           </div>

//           <div className="breed-grid">
//             {breeds.map((breed, index) => (
//               <motion.article
//                 className="breed-card"
//                 key={breed.name}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{
//                   duration: 0.4,
//                   delay: index * 0.1,
//                 }}
//               >
//                 <div className="breed-image-wrap">
//                   <img
//                     src={breed.image}
//                     alt={breed.name}
//                     loading="lazy"
//                   />

//                   <span className="breed-badge">
//                     <CheckCircle size={13} />
//                     Popular
//                   </span>

//                   <button
//                     type="button"
//                     className="breed-heart"
//                     aria-label={`Learn about ${breed.name}`}
//                     onClick={() => {
//                       window.location.href = `/dogs?search=${encodeURIComponent(
//                         breed.name
//                       )}`;
//                     }}
//                   >
//                     <Heart size={19} />
//                   </button>
//                 </div>

//                 <div className="breed-info">
//                   <h3>{breed.name}</h3>

//                   <p>{breed.description}</p>

//                   <div className="breed-card-bottom">
//                     <div>
//                       <span className="price-label">
//                         Starting from
//                       </span>

//                       <strong>{breed.price}</strong>
//                     </div>

//                     <Link
//                       to={`/dogs?search=${encodeURIComponent(
//                         breed.name
//                       )}`}
//                       className="breed-arrow"
//                       aria-label={`Explore ${breed.name}`}
//                     >
//                       <ArrowRight size={19} />
//                     </Link>
//                   </div>
//                 </div>
//               </motion.article>
//             ))}
//           </div>
//         </section>

//         {/* ========================================
//             NEW FEATURE: PET COST PREDICTOR
//         ======================================== */}

//         <section
//           className="cost-predictor-home"
//           id="pet-cost-predictor"
//         >
//           <motion.div
//             className="cost-predictor-content"
//             initial={{ opacity: 0, x: -25 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <span className="cost-predictor-badge">
//               💰 SMART PET PLANNING
//             </span>

//             <h2>
//               Planning for a pet?
//               <br />
//               <span>
//                 Know the cost before you commit.
//               </span>
//             </h2>

//             <p>
//               Bringing a pet home is a big responsibility.
//               Understand the estimated costs of food,
//               grooming, veterinary care, initial supplies,
//               and everyday essentials before making your
//               decision.
//             </p>

//             <div className="cost-predictor-benefits">
//               <div>
//                 <span>💵</span>
//                 <strong>Monthly Budget</strong>
//               </div>

//               <div>
//                 <span>🩺</span>
//                 <strong>Care Expenses</strong>
//               </div>

//               <div>
//                 <span>📊</span>
//                 <strong>Yearly Estimate</strong>
//               </div>
//             </div>

//             <Link
//               to="/pet-cost-predictor"
//               className="cost-predictor-home-button"
//             >
//               Calculate Pet Costs
//               <ArrowRight size={19} />
//             </Link>

//             <small>
//               Enter your own estimated expenses to create
//               a personalized budget. Actual costs may vary.
//             </small>
//           </motion.div>

//           <motion.div
//             className="cost-predictor-visual"
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{
//               duration: 0.7,
//               delay: 0.15,
//             }}
//           >
//             <div className="cost-predictor-circle">
//               <span>🐶</span>
//             </div>

//             <div className="cost-predictor-floating-card">
//               <span>🧾</span>

//               <div>
//                 <strong>Plan smarter</strong>
//                 <small>
//                   Prepare for pet ownership
//                 </small>
//               </div>
//             </div>

//             <div className="cost-predictor-small-card">
//               <span>❤️</span>
//               <strong>Responsible pet care</strong>
//             </div>
//           </motion.div>
//         </section>

//         {/* ========================================
//             ABOUT SECTION
//         ======================================== */}

//         <section
//           className="about-section section-padding"
//           id="about"
//         >
//           <div className="about-image">
//             <img
//               src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=85"
//               alt="Two happy dogs enjoying time together"
//               loading="lazy"
//             />

//             <div className="about-image-card">
//               <Heart size={22} fill="currentColor" />

//               <div>
//                 <strong>Love at first paw</strong>
//                 <span>
//                   Friendships that last forever
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="about-content">
//             <span className="section-eyebrow">
//               A LITTLE ABOUT US
//             </span>

//             <h2>
//               We believe every dog deserves a{" "}
//               <span>loving home.</span>
//             </h2>

//             <p>
//               At PawMart, we believe finding your four-legged
//               best friend should be a joyful, transparent,
//               and memorable experience. We&apos;re here to
//               help you discover the companion who makes your
//               house feel more like home.
//             </p>

//             <div className="about-checks">
//               <div>
//                 <CheckCircle size={19} />
//                 <span>
//                   Discover different dog breeds
//                 </span>
//               </div>

//               <div>
//                 <CheckCircle size={19} />
//                 <span>
//                   Learn about responsible pet ownership
//                 </span>
//               </div>

//               <div>
//                 <CheckCircle size={19} />
//                 <span>
//                   Explore adoption opportunities
//                 </span>
//               </div>
//             </div>

//             <Link to="/dogs" className="primary-button">
//               Find Your Companion
//               <ArrowRight size={17} />
//             </Link>
//           </div>
//         </section>

//         {/* ========================================
//             BENEFITS
//         ======================================== */}

//         <section className="benefits-section section-padding">
//           <div className="center-heading">
//             <span className="section-eyebrow">
//               THE PAWMART PROMISE
//             </span>

//             <h2>
//               Good dogs. Good people.{" "}
//               <span>Good beginnings.</span>
//             </h2>

//             <p>
//               Because bringing a new best friend home
//               should feel wonderful.
//             </p>
//           </div>

//           <div className="benefits-grid">
//             {benefits.map((benefit, index) => (
//               <motion.article
//                 className="benefit-card"
//                 key={benefit.title}
//                 initial={{ opacity: 0, y: 18 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{
//                   delay: index * 0.12,
//                 }}
//               >
//                 <div className="benefit-icon">
//                   {benefit.icon}
//                 </div>

//                 <h3>{benefit.title}</h3>

//                 <p>{benefit.description}</p>
//               </motion.article>
//             ))}
//           </div>
//         </section>

//         {/* ========================================
//             HOW IT WORKS
//         ======================================== */}

//         <section
//           className="how-section section-padding"
//           id="how-it-works"
//         >
//           <div className="center-heading">
//             <span className="section-eyebrow">
//               SIMPLE AS ONE, TWO, WOOF
//             </span>

//             <h2>
//               Three little steps to{" "}
//               <span>big love.</span>
//             </h2>

//             <p>
//               Your new best friend is closer than you think.
//             </p>
//           </div>

//           <div className="steps-grid">
//             {steps.map((step, index) => (
//               <motion.article
//                 className="step-card"
//                 key={step.number}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{
//                   delay: index * 0.15,
//                 }}
//               >
//                 <span className="step-number">
//                   {step.number}
//                 </span>

//                 <h3>{step.title}</h3>

//                 <p>{step.description}</p>
//               </motion.article>
//             ))}
//           </div>
//         </section>

//         {/* ========================================
//             ADOPTION SECTION
//         ======================================== */}

//         <section className="adoption-section section-padding">
//           <div className="adoption-content">
//             <span className="section-eyebrow">
//               OPEN YOUR HEART
//             </span>

//             <h2>
//               The best things in life are{" "}
//               <span>rescued.</span>
//             </h2>

//             <p>
//               Your perfect companion may be waiting at a
//               shelter for someone just like you. Give a
//               deserving dog a second chance at happiness.
//             </p>

//             <Link
//               to="/adoption"
//               className="adoption-button"
//             >
//               Explore Adoption <Heart size={17} />
//             </Link>
//           </div>

//           <div className="adoption-image">
//             <img
//               src="https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=1000&q=85"
//               alt="Happy dogs playing together"
//               loading="lazy"
//             />
//           </div>
//         </section>

//         {/* ========================================
//             FINAL CALL TO ACTION
//         ======================================== */}

//         <section className="final-cta section-padding">
//           <div className="cta-paw">
//             <PawPrint size={35} />
//           </div>

//           <span className="section-eyebrow">
//             YOUR BEST FRIEND IS OUT THERE
//           </span>

//           <h2>
//             Ready for a little more{" "}
//             <span>love?</span>
//           </h2>

//           <p>
//             Start your journey toward a lifetime of
//             wagging tails and happy memories.
//           </p>

//           <div className="cta-actions">
//             <Link to="/dogs" className="primary-button">
//               Find Your Best Friend
//               <ArrowRight size={17} />
//             </Link>

//             <Link
//               to="/register"
//               className="secondary-button"
//             >
//               Join PawMart
//             </Link>
//           </div>
//         </section>
//       </main>

//       {/* ========================================
//           FOOTER
//       ======================================== */}

//       <footer className="site-footer">
//         <div className="footer-main">
//           <div className="footer-brand-column">
//             <Link to="/" className="brand footer-brand">
//               <span className="brand-icon">
//                 <PawPrint size={24} />
//               </span>

//               <span className="brand-name">
//                 paw<span>mart</span>
//                 <small>
//                   YOUR BEST FRIEND STARTS HERE
//                 </small>
//               </span>
//             </Link>

//             <p>
//               Bringing paws and people together, one
//               beautiful friendship at a time.
//             </p>
//           </div>

//           <div className="footer-column">
//             <h4>Explore</h4>

//             <Link to="/dogs">Find a Dog</Link>

//             <Link to="/adoption">Adoption</Link>

//             <Link to="/my-orders">Track Orders</Link>

//             <Link to="/pet-cost-predictor">
//               💰 Pet Cost Predictor
//             </Link>

//             <button onClick={() => scrollTo("about")}>
//               About Us
//             </button>
//           </div>

//           <div className="footer-column">
//             <h4>Get Started</h4>

//             <Link to="/login">Log In</Link>

//             <Link to="/register">
//               Create Account
//             </Link>

//             <Link to="/profile">My Profile</Link>

//             <button
//               onClick={() => scrollTo("how-it-works")}
//             >
//               How It Works
//             </button>
//           </div>

//           <div className="footer-column">
//             <h4>Our Promise</h4>

//             <span>Responsible pet ownership</span>

//             <span>Happy homes</span>

//             <span>More wagging tails</span>
//           </div>
//         </div>

//         <div className="footer-bottom">
//           <span>
//             © {new Date().getFullYear()} PawMart.
//             Made with love.
//           </span>

//           <span className="footer-love">
//             Made for paws and people
//             <Heart size={14} fill="currentColor" />
//           </span>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  ArrowRight,
  Heart,
  ShieldCheck,
  Truck,
  Star,
  Menu,
  X,
  PawPrint,
  Search,
  CheckCircle,
  LayoutDashboard,
} from "lucide-react";

import { Link } from "react-router-dom";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const breeds = [
  {
    name: "Golden Retriever",
    description: "Friendly, loyal & loving",
    image:
      "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=700&q=85",
    price: "₹18,000",
  },
  {
    name: "Labrador",
    description: "Playful, gentle & smart",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.HJiDCoiN_-ql0IdJCHZIywHaEo?r=0&pid=Api&h=220&P=0",
    price: "₹15,000",
  },
  {
    name: "German Shepherd",
    description: "Brave, intelligent & loyal",
    image:
      "https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=700&q=85",
    price: "₹22,000",
  },
  {
    name: "Shih Tzu",
    description: "Cute, affectionate & calm",
    image:
      "https://images2.alphacoders.com/139/thumb-1920-1395411.png",
    price: "₹20,000",
  },
];

const benefits = [
  {
    icon: <ShieldCheck />,
    title: "Trusted Breeders",
    description:
      "Connect with responsible breeders who prioritize the health and happiness of every puppy.",
  },
  {
    icon: <Heart />,
    title: "Health Comes First",
    description:
      "Learn about vaccination, health records, and the care your new companion needs.",
  },
  {
    icon: <Truck />,
    title: "Easy Experience",
    description:
      "Discover your ideal companion with a simple, convenient browsing experience.",
  },
];

const steps = [
  {
    number: "01",
    title: "Explore",
    description:
      "Browse adorable dogs and discover different breeds.",
  },
  {
    number: "02",
    title: "Connect",
    description:
      "Find out more about the dog and connect with the seller.",
  },
  {
    number: "03",
    title: "Welcome Home",
    description:
      "Prepare your home for your new best friend.",
  },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Admin link is hidden until the backend confirms the user's role.
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  // ========================================
  // CHECK USER ROLE FROM THE BACKEND
  // ========================================

  useEffect(() => {
    const controller = new AbortController();

    async function checkUserRole() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        if (!response.ok) {
          setIsAdmin(false);
          return;
        }

        const data = await response.json();

        const role = String(
          data?.user?.role || ""
        ).toLowerCase();

        setIsAdmin(
          data?.success === true && role === "admin"
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to verify user role.");
          setIsAdmin(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCheckingRole(false);
        }
      }
    }

    checkUserRole();

    return () => {
      controller.abort();
    };
  }, []);

  // ========================================
  // SCROLL TO SECTION
  // ========================================

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMobileMenuOpen(false);
  };

  // ========================================
  // DOG SEARCH
  // ========================================

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchTerm.trim();

    if (query) {
      window.location.href = `/dogs?search=${encodeURIComponent(
        query
      )}`;
    } else {
      window.location.href = "/dogs";
    }
  };

  return (
    <div className="pawmart">
      {/* ========================================
          ANNOUNCEMENT BAR
      ======================================== */}

      <div className="announcement-bar">
        <PawPrint size={15} />

        <span>Every dog deserves a loving home.</span>

        <span className="announcement-divider">|</span>

        <span>Find your new best friend today!</span>
      </div>

      {/* ========================================
          NAVIGATION
      ======================================== */}

      <header className="site-header">
        <Link
          to="/"
          className="brand"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="brand-icon">
            <PawPrint size={25} />
          </span>

          <span className="brand-name">
            paw<span>mart</span>
            <small>YOUR BEST FRIEND STARTS HERE</small>
          </span>
        </Link>

        <nav
          className={`nav-links ${
            mobileMenuOpen ? "nav-open" : ""
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

          <Link
            to="/adoption"
            onClick={() => setMobileMenuOpen(false)}
          >
            Adoption
          </Link>

          <Link
            to="/pet-cost-predictor"
            className="cost-predictor-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            💰 Pet Cost Predictor
          </Link>

          <Link
            to="/my-orders"
            onClick={() => setMobileMenuOpen(false)}
          >
            Track Orders
          </Link>

          <button
            type="button"
            onClick={() => scrollTo("about")}
          >
            About Us
          </button>

          <button
            type="button"
            onClick={() => scrollTo("how-it-works")}
          >
            How It Works
          </button>

          {/* ========================================
              ADMIN DASHBOARD
              Displayed only when the backend confirms
              that the logged-in user has role "admin".
          ======================================== */}

          {!checkingRole && isAdmin && (
            <Link
              to="/admin/adoption-enquiries"
              className="admin-dashboard-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={17} />
              <span>Admin Dashboard</span>
            </Link>
          )}

          {/* MOBILE AUTHENTICATION LINKS */}

          <div className="mobile-auth">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
            >
              👤 My Profile
            </Link>

            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>

            <Link
              to="/register"
              className="nav-register"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* DESKTOP AUTHENTICATION LINKS */}

        <div className="header-actions">
          <Link to="/profile" className="login-link">
            👤 My Profile
          </Link>

          <Link
            to="/pawsure"
            className="pawsure-home-button"
          >
            <span>🛡️</span>
            Explore PawSure
            <span>↗</span>
          </Link>

          <Link to="/login" className="login-link">
            Log In
          </Link>

          <Link to="/register" className="header-cta">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
        >
          {mobileMenuOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}
        </button>
      </header>

      <main>
        {/* ========================================
            HERO SECTION
        ======================================== */}

        <section className="hero">
          <div
            className="hero-video-background"
            aria-hidden="true"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1800&q=85"
            >
              <source
                src="https://videos.pexels.com/video-files/9085858/9085858-hd_1920_1080_30fps.mp4"
                type="video/mp4"
              />

              Your browser does not support HTML video.
            </video>
          </div>

          <div className="hero-video-overlay" />

          <div className="hero-inner">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="hero-eyebrow">
                <PawPrint size={16} />

                <span>
                  MORE THAN PETS. THEY&apos;RE FAMILY.
                </span>
              </div>

              <h1>
                Your forever
                <br />
                friend is <span>waiting.</span>
              </h1>

              <p className="hero-description">
                Big paws, little paws, and everything in
                between. Discover your perfect companion and
                start a beautiful friendship that lasts a
                lifetime.
              </p>

              <form
                className="hero-search"
                onSubmit={handleSearch}
              >
                <Search size={21} />

                <input
                  type="text"
                  placeholder="Search breeds, e.g. Golden Retriever"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  aria-label="Search dog breeds"
                />

                <button type="submit">
                  Find My Dog <ArrowRight size={17} />
                </button>
              </form>

              <div className="hero-trust">
                <div className="trust-avatars">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                    alt=""
                  />

                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                    alt=""
                  />

                  <img
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&q=80"
                    alt=""
                  />
                </div>

                <div>
                  <div className="trust-stars">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>

                  <p>
                    Loved by <strong>1,200+</strong> happy
                    pet parents
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1,
                delay: 0.2,
              }}
            >
              <div className="hero-floating-card">
                <div className="floating-card-icon">
                  <Heart size={21} fill="currentColor" />
                </div>

                <div>
                  <strong>Unconditional love</strong>
                  <span>Starts with one little paw.</span>
                </div>
              </div>

              <div className="hero-photo-badge">
                <PawPrint size={18} />
                <span>Find your happiness</span>
              </div>
            </motion.div>
          </div>

          <div className="hero-bottom-note">
            <span className="hero-note-line" />

            <span>
              YOUR NEXT CHAPTER STARTS WITH A PAW
            </span>

            <span className="hero-note-line" />
          </div>
        </section>

        {/* ========================================
            POPULAR BREEDS
        ======================================== */}

        <section
          className="breeds-section section-padding"
          id="breeds"
        >
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                MEET YOUR MATCH
              </span>

              <h2>
                A little love, a lot of{" "}
                <span>paw-sitivity.</span>
              </h2>

              <p>
                Meet some of the wonderful companions waiting
                to make your everyday extraordinary.
              </p>
            </div>

            <Link to="/dogs" className="text-link">
              Explore All Dogs <ArrowRight size={17} />
            </Link>
          </div>

          <div className="breed-grid">
            {breeds.map((breed, index) => (
              <motion.article
                className="breed-card"
                key={breed.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
              >
                <div className="breed-image-wrap">
                  <img
                    src={breed.image}
                    alt={breed.name}
                    loading="lazy"
                  />

                  <span className="breed-badge">
                    <CheckCircle size={13} />
                    Popular
                  </span>

                  <button
                    type="button"
                    className="breed-heart"
                    aria-label={`Learn about ${breed.name}`}
                    onClick={() => {
                      window.location.href = `/dogs?search=${encodeURIComponent(
                        breed.name
                      )}`;
                    }}
                  >
                    <Heart size={19} />
                  </button>
                </div>

                <div className="breed-info">
                  <h3>{breed.name}</h3>

                  <p>{breed.description}</p>

                  <div className="breed-card-bottom">
                    <div>
                      <span className="price-label">
                        Starting from
                      </span>

                      <strong>{breed.price}</strong>
                    </div>

                    <Link
                      to={`/dogs?search=${encodeURIComponent(
                        breed.name
                      )}`}
                      className="breed-arrow"
                      aria-label={`Explore ${breed.name}`}
                    >
                      <ArrowRight size={19} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ========================================
            PET COST PREDICTOR
        ======================================== */}

        <section
          className="cost-predictor-home"
          id="pet-cost-predictor"
        >
          <motion.div
            className="cost-predictor-content"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="cost-predictor-badge">
              💰 SMART PET PLANNING
            </span>

            <h2>
              Planning for a pet?
              <br />
              <span>
                Know the cost before you commit.
              </span>
            </h2>

            <p>
              Bringing a pet home is a big responsibility.
              Understand the estimated costs of food,
              grooming, veterinary care, initial supplies,
              and everyday essentials before making your
              decision.
            </p>

            <div className="cost-predictor-benefits">
              <div>
                <span>💵</span>
                <strong>Monthly Budget</strong>
              </div>

              <div>
                <span>🩺</span>
                <strong>Care Expenses</strong>
              </div>

              <div>
                <span>📊</span>
                <strong>Yearly Estimate</strong>
              </div>
            </div>

            <Link
              to="/pet-cost-predictor"
              className="cost-predictor-home-button"
            >
              Calculate Pet Costs
              <ArrowRight size={19} />
            </Link>

            <small>
              Enter your own estimated expenses to create
              a personalized budget. Actual costs may vary.
            </small>
          </motion.div>

          <motion.div
            className="cost-predictor-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
          >
            <div className="cost-predictor-circle">
              <span>🐶</span>
            </div>

            <div className="cost-predictor-floating-card">
              <span>🧾</span>

              <div>
                <strong>Plan smarter</strong>
                <small>Prepare for pet ownership</small>
              </div>
            </div>

            <div className="cost-predictor-small-card">
              <span>❤️</span>
              <strong>Responsible pet care</strong>
            </div>
          </motion.div>
        </section>

        {/* ========================================
            ABOUT SECTION
        ======================================== */}

        <section
          className="about-section section-padding"
          id="about"
        >
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=85"
              alt="Two happy dogs enjoying time together"
              loading="lazy"
            />

            <div className="about-image-card">
              <Heart size={22} fill="currentColor" />

              <div>
                <strong>Love at first paw</strong>
                <span>Friendships that last forever</span>
              </div>
            </div>
          </div>

          <div className="about-content">
            <span className="section-eyebrow">
              A LITTLE ABOUT US
            </span>

            <h2>
              We believe every dog deserves a{" "}
              <span>loving home.</span>
            </h2>

            <p>
              At PawMart, we believe finding your four-legged
              best friend should be a joyful, transparent,
              and memorable experience. We&apos;re here to
              help you discover the companion who makes your
              house feel more like home.
            </p>

            <div className="about-checks">
              <div>
                <CheckCircle size={19} />
                <span>Discover different dog breeds</span>
              </div>

              <div>
                <CheckCircle size={19} />
                <span>
                  Learn about responsible pet ownership
                </span>
              </div>

              <div>
                <CheckCircle size={19} />
                <span>Explore adoption opportunities</span>
              </div>
            </div>

            <Link to="/dogs" className="primary-button">
              Find Your Companion
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* ========================================
            BENEFITS
        ======================================== */}

        <section className="benefits-section section-padding">
          <div className="center-heading">
            <span className="section-eyebrow">
              THE PAWMART PROMISE
            </span>

            <h2>
              Good dogs. Good people.{" "}
              <span>Good beginnings.</span>
            </h2>

            <p>
              Because bringing a new best friend home
              should feel wonderful.
            </p>
          </div>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <motion.article
                className="benefit-card"
                key={benefit.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.12,
                }}
              >
                <div className="benefit-icon">
                  {benefit.icon}
                </div>

                <h3>{benefit.title}</h3>

                <p>{benefit.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ========================================
            HOW IT WORKS
        ======================================== */}

        <section
          className="how-section section-padding"
          id="how-it-works"
        >
          <div className="center-heading">
            <span className="section-eyebrow">
              SIMPLE AS ONE, TWO, WOOF
            </span>

            <h2>
              Three little steps to{" "}
              <span>big love.</span>
            </h2>

            <p>
              Your new best friend is closer than you think.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <motion.article
                className="step-card"
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                }}
              >
                <span className="step-number">
                  {step.number}
                </span>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ========================================
            ADOPTION SECTION
        ======================================== */}

        <section className="adoption-section section-padding">
          <div className="adoption-content">
            <span className="section-eyebrow">
              OPEN YOUR HEART
            </span>

            <h2>
              The best things in life are{" "}
              <span>rescued.</span>
            </h2>

            <p>
              Your perfect companion may be waiting at a
              shelter for someone just like you. Give a
              deserving dog a second chance at happiness.
            </p>

            <Link
              to="/adoption"
              className="adoption-button"
            >
              Explore Adoption <Heart size={17} />
            </Link>
          </div>

          <div className="adoption-image">
            <img
              src="https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=1000&q=85"
              alt="Happy dogs playing together"
              loading="lazy"
            />
          </div>
        </section>

        {/* ========================================
            FINAL CALL TO ACTION
        ======================================== */}

        <section className="final-cta section-padding">
          <div className="cta-paw">
            <PawPrint size={35} />
          </div>

          <span className="section-eyebrow">
            YOUR BEST FRIEND IS OUT THERE
          </span>

          <h2>
            Ready for a little more{" "}
            <span>love?</span>
          </h2>

          <p>
            Start your journey toward a lifetime of
            wagging tails and happy memories.
          </p>

          <div className="cta-actions">
            <Link to="/dogs" className="primary-button">
              Find Your Best Friend
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/register"
              className="secondary-button"
            >
              Join PawMart
            </Link>
          </div>
        </section>
      </main>

      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand-column">
            <Link to="/" className="brand footer-brand">
              <span className="brand-icon">
                <PawPrint size={24} />
              </span>

              <span className="brand-name">
                paw<span>mart</span>
                <small>
                  YOUR BEST FRIEND STARTS HERE
                </small>
              </span>
            </Link>

            <p>
              Bringing paws and people together, one
              beautiful friendship at a time.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>

            <Link to="/dogs">Find a Dog</Link>

            <Link to="/adoption">Adoption</Link>

            <Link to="/my-orders">Track Orders</Link>

            <Link to="/pet-cost-predictor">
              💰 Pet Cost Predictor
            </Link>

            <button
              type="button"
              onClick={() => scrollTo("about")}
            >
              About Us
            </button>
          </div>

          <div className="footer-column">
            <h4>Get Started</h4>

            <Link to="/login">Log In</Link>

            <Link to="/register">Create Account</Link>

            <Link to="/profile">My Profile</Link>

            <button
              type="button"
              onClick={() => scrollTo("how-it-works")}
            >
              How It Works
            </button>

            {/* Admin footer link is also admin-only. */}

            {!checkingRole && isAdmin && (
              <Link
                to="/admin/adoption-enquiries"
                className="admin-footer-link"
              >
                <LayoutDashboard size={15} />
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="footer-column">
            <h4>Our Promise</h4>

            <span>Responsible pet ownership</span>

            <span>Happy homes</span>

            <span>More wagging tails</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} PawMart.
            Made with love.
          </span>

          <span className="footer-love">
            Made for paws and people
            <Heart size={14} fill="currentColor" />
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;