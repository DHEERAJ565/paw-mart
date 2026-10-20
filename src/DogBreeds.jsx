// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./DogBreeds.css";

// import {
//   ArrowDown,
//   ArrowRight,
//   ArrowUpRight,
//   Check,
//   ChevronDown,
//   Heart,
//   PawPrint,
//   Search,
//   SlidersHorizontal,
//   Sparkles,
//   X,
//   Zap,
//   Ruler,
//   Scissors,
//   House,
//   ShieldCheck,
//   RotateCcw,
// } from "lucide-react";

// const API_BASE = "http://localhost:5000/api";
// const DOG_API = "https://dog.ceo/api/breeds/list/all";

// const FALLBACK =
//   "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg";

// /* -------------------------------------------------------
//    BREED INFORMATION
// ------------------------------------------------------- */

// const BREED_MODELS = [
//   {
//     name: "Golden Retriever",
//     key: "retriever/golden",
//     tag: "Family Favorite",
//     size: "Large",
//     energy: "High",
//     coat: "Long",
//     care: "Regular brushing",
//     apartment: "Needs space",
//     image:
//       "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg",
//     description:
//       "Friendly, intelligent, and affectionate companions.",
//     about:
//       "Golden Retrievers are social dogs known for their gentle temperament, intelligence, and eagerness to learn.",
//   },
//   {
//     name: "Siberian Husky",
//     key: "husky",
//     tag: "Adventure Buddy",
//     size: "Medium",
//     energy: "Very High",
//     coat: "Thick double coat",
//     care: "Frequent brushing",
//     apartment: "Needs exercise",
//     image: "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg",
//     description: "Energetic, independent dogs with striking looks.",
//     about:
//       "Siberian Huskies are active and social dogs that need regular exercise, secure spaces, and consistent training.",
//   },
//   {
//     name: "Poodle",
//     key: "poodle",
//     tag: "Smart Companion",
//     size: "Varies",
//     energy: "High",
//     coat: "Curly",
//     care: "Professional grooming",
//     apartment: "Often suitable",
//     image:
//       "https://images.dog.ceo/breeds/poodle-standard/n02113799_2280.jpg",
//     description: "Highly trainable dogs with distinctive curly coats.",
//     about:
//       "Poodles are intelligent, active, and responsive to training. They come in different sizes and require coat maintenance.",
//   },
//   {
//     name: "Beagle",
//     key: "hound",
//     tag: "Playful Explorer",
//     size: "Small–Medium",
//     energy: "High",
//     coat: "Short",
//     care: "Low maintenance",
//     apartment: "Can adapt",
//     image: "https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg",
//     description: "Curious, cheerful dogs with an excellent sense of smell.",
//     about:
//       "Beagles are friendly, curious, and scent-driven. They benefit from daily activity and positive training.",
//   },
//   {
//     name: "German Shepherd",
//     key: "germanshepherd",
//     tag: "Loyal Guardian",
//     size: "Large",
//     energy: "High",
//     coat: "Double coat",
//     care: "Regular brushing",
//     apartment: "Needs activity",
//     image:
//       "https://images.dog.ceo/breeds/germanshepherd/n02106662_10253.jpg",
//     description: "Loyal, intelligent dogs that thrive with training.",
//     about:
//       "German Shepherds need socialization, training, and physical and mental stimulation.",
//   },
//   {
//     name: "Corgi",
//     key: "corgi",
//     tag: "Little Charmer",
//     size: "Small",
//     energy: "Medium–High",
//     coat: "Double coat",
//     care: "Regular brushing",
//     apartment: "Can adapt",
//     image: "https://images.dog.ceo/breeds/corgi-cardigan/n02113186_1030.jpg",
//     description:
//       "Confident, playful dogs with short legs and big personalities.",
//     about:
//       "Corgis are intelligent, lively dogs that enjoy learning and play.",
//   },
//   {
//     name: "Labrador Retriever",
//     key: "retriever/labrador",
//     tag: "Friendly All-Rounder",
//     size: "Large",
//     energy: "High",
//     coat: "Short",
//     care: "Occasional brushing",
//     apartment: "Needs exercise",
//     image: "https://images.dog.ceo/breeds/labrador/n02099712_7415.jpg",
//     description: "Outgoing, affectionate, and eager-to-please companions.",
//     about:
//       "Labrador Retrievers are social dogs that often enjoy training, swimming, and outdoor play.",
//   },
//   {
//     name: "Dachshund",
//     key: "dachshund",
//     tag: "Bold Personality",
//     size: "Small",
//     energy: "Medium",
//     coat: "Varies",
//     care: "Depends on coat",
//     apartment: "Often suitable",
//     image: "https://images.dog.ceo/breeds/dachshund/dachshund_6.jpg",
//     description: "Curious, confident dogs with a distinctive long body.",
//     about:
//       "Dachshunds are curious and brave. Protecting their backs from excessive jumping is important.",
//   },
//   {
//     name: "Australian Shepherd",
//     key: "australian",
//     tag: "Active Partner",
//     size: "Medium",
//     energy: "Very High",
//     coat: "Medium",
//     care: "Regular brushing",
//     apartment: "Needs activity",
//     image: "https://images.dog.ceo/breeds/australian-shepherd/leroy.jpg",
//     description: "Intelligent working dogs that enjoy having a job to do.",
//     about:
//       "Australian Shepherds are energetic and trainable, and need exercise and mental challenges.",
//   },
//   {
//     name: "French Bulldog",
//     key: "bulldog/french",
//     tag: "City Companion",
//     size: "Small",
//     energy: "Low–Medium",
//     coat: "Short",
//     care: "Low maintenance",
//     apartment: "Often suitable",
//     image: "https://images.dog.ceo/breeds/bulldog-french/n02108915_100.jpg",
//     description: "Affectionate companions with a compact build.",
//     about:
//       "French Bulldogs often enjoy indoor companionship. Their short muzzles can make them vulnerable to heat and breathing problems.",
//   },
//   {
//     name: "Border Collie",
//     key: "collie",
//     tag: "Training Champion",
//     size: "Medium",
//     energy: "Very High",
//     coat: "Medium",
//     care: "Regular brushing",
//     apartment: "Needs activity",
//     image: "https://images.dog.ceo/breeds/collie-border/n02106166_1008.jpg",
//     description: "Highly intelligent dogs that thrive on mental challenges.",
//     about:
//       "Border Collies are active herding dogs that benefit from training, games, and purposeful activities.",
//   },
//   {
//     name: "Pomeranian",
//     key: "pomeranian",
//     tag: "Tiny Companion",
//     size: "Small",
//     energy: "Medium",
//     coat: "Long double coat",
//     care: "Frequent brushing",
//     apartment: "Often suitable",
//     image: "https://images.dog.ceo/breeds/pomeranian/n02112018_1003.jpg",
//     description: "Small, alert companions with fluffy coats.",
//     about:
//       "Pomeranians are lively, alert, and affectionate. Their coats need maintenance and their small size requires gentle handling.",
//   },
// ];

// /* -------------------------------------------------------
//    HELPERS
// ------------------------------------------------------- */

// function pretty(value = "") {
//   return String(value)
//     .split(/[-_ ]/)
//     .filter(Boolean)
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// }

// function formatApiBreedName(mainBreed, subBreed = "") {
//   return pretty(subBreed ? `${subBreed} ${mainBreed}` : mainBreed);
// }

// function isMongoId(id) {
//   return /^[a-fA-F0-9]{24}$/.test(String(id || ""));
// }

// function normalizeBreedName(value = "") {
//   return String(value)
//     .toLowerCase()
//     .replace(/[_-]/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// /*
//  * Matches pet listings to breed cards.
//  * The alias table handles common breed-name differences.
//  */
// function getBreedAliases(breedName) {
//   const name = normalizeBreedName(breedName);

//   const aliases = {
//     "labrador": ["labrador", "labrador retriever"],
//     "labrador retriever": ["labrador", "labrador retriever"],
//     "german shepherd": ["german shepherd", "germanshepherd"],
//     germanshepherd: ["german shepherd", "germanshepherd"],
//     "golden retriever": ["golden retriever", "golden"],
//     husky: ["husky", "siberian husky"],
//     "siberian husky": ["husky", "siberian husky"],
//     "french bulldog": ["french bulldog", "french bulldog"],
//     "border collie": ["border collie"],
//     "australian shepherd": ["australian shepherd"],
//     poodle: ["poodle", "standard poodle", "miniature poodle", "toy poodle"],
//     beagle: ["beagle"],
//     corgi: ["corgi", "cardigan corgi", "pembroke welsh corgi"],
//     dachshund: ["dachshund"],
//     pomeranian: ["pomeranian"],
//   };

//   return aliases[name] || [name];
// }

// function petsForBreed(breedName, pets) {
//   const aliases = getBreedAliases(breedName);

//   return pets.filter((pet) => {
//     if (!isMongoId(pet._id)) return false;

//     const petBreed = normalizeBreedName(pet.breed);

//     return aliases.some(
//       (alias) =>
//         petBreed === alias ||
//         petBreed.startsWith(`${alias} `) ||
//         alias.startsWith(`${petBreed} `)
//     );
//   });
// }

// function getDetails(name) {
//   return (
//     BREED_MODELS.find(
//       (breed) =>
//         normalizeBreedName(breed.name) === normalizeBreedName(name)
//     ) || {
//       name,
//       key: normalizeBreedName(name).replaceAll(" ", "/"),
//       tag: "Lovely Companion",
//       size: "Varies",
//       energy: "Varies",
//       coat: "Varies",
//       care: "Regular care",
//       apartment: "Depends on lifestyle",
//       image: FALLBACK,
//       description: `Discover the personality and care needs of ${name}.`,
//       about: `${name} may make a wonderful companion. Research its exercise, grooming, training, and health requirements before choosing a dog.`,
//     }
//   );
// }

// function formatPrice(price) {
//   if (price === null || price === undefined || price === "") {
//     return "Price to be confirmed";
//   }

//   const amount = Number(price);

//   if (!Number.isFinite(amount)) {
//     return "Price to be confirmed";
//   }

//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(amount);
// }

// function normalizeBreed(breed) {
//   if (typeof breed === "string") {
//     return { name: pretty(breed), image: FALLBACK };
//   }

//   return {
//     ...breed,
//     name: breed.name || breed.breed || "Unknown Breed",
//     image: breed.image || breed.imageUrl || FALLBACK,
//   };
// }

// function normalizePet(pet) {
//   const id = pet?._id || pet?.id || pet?.petId || "";

//   return {
//     ...pet,
//     _id: pet?._id || (isMongoId(id) ? id : undefined),
//     name: pet?.name || pet?.dogName || "Unnamed Pet",
//     breed: pet?.breed || "Unknown Breed",
//     price: pet?.price ?? pet?.amount ?? null,
//     image:
//       pet?.image ||
//       pet?.imageUrl ||
//       pet?.dogImage ||
//       pet?.photo ||
//       FALLBACK,
//     age: pet?.age || "Age not specified",
//     gender: pet?.gender || "Not specified",
//     location: pet?.location || pet?.city || "Location not specified",
//   };
// }

// /* -------------------------------------------------------
//    DATA FETCHING
// ------------------------------------------------------- */

// async function fetchBreedsFromBackend() {
//   try {
//     const response = await fetch(`${API_BASE}/breeds?limit=500`);

//     if (!response.ok) return [];

//     const data = await response.json();

//     const breeds = Array.isArray(data)
//       ? data
//       : data.breeds || data.data || [];

//     return breeds.map(normalizeBreed);
//   } catch (error) {
//     console.warn("Could not load breeds from backend:", error);
//     return [];
//   }
// }

// async function fetchBreedsFromDogApi() {
//   try {
//     const response = await fetch(DOG_API);

//     if (!response.ok) {
//       throw new Error("Unable to load breeds.");
//     }

//     const data = await response.json();
//     const breedMap = data.message || {};

//     const entries = Object.entries(breedMap).flatMap(
//       ([mainBreed, subBreeds]) => {
//         if (!subBreeds.length) {
//           return [{
//             name: formatApiBreedName(mainBreed),
//             apiPath: mainBreed,
//           }];
//         }

//         return subBreeds.map((subBreed) => ({
//           name: formatApiBreedName(mainBreed, subBreed),
//           apiPath: `${mainBreed}/${subBreed}`,
//         }));
//       }
//     );

//     const results = new Array(entries.length);
//     let nextIndex = 0;

//     async function imageWorker() {
//       while (nextIndex < entries.length) {
//         const index = nextIndex++;
//         const breed = entries[index];

//         try {
//           const imageResponse = await fetch(
//             `https://dog.ceo/api/breed/${breed.apiPath}/images/random`
//           );

//           const imageData = imageResponse.ok
//             ? await imageResponse.json()
//             : null;

//           results[index] = {
//             name: breed.name,
//             image:
//               imageData?.status === "success"
//                 ? imageData.message
//                 : FALLBACK,
//           };
//         } catch {
//           results[index] = {
//             name: breed.name,
//             image: FALLBACK,
//           };
//         }
//       }
//     }

//     await Promise.all(
//       Array.from(
//         { length: Math.min(8, entries.length) },
//         () => imageWorker()
//       )
//     );

//     return results;
//   } catch (error) {
//     console.warn("Could not load Dog CEO breeds:", error);
//     return [];
//   }
// }

// async function fetchPetsFromBackend() {
//   const configuredEndpoint =
//     import.meta.env.VITE_PET_LISTINGS_ENDPOINT || "/pets";

//   const endpoint = configuredEndpoint.startsWith("http")
//     ? configuredEndpoint
//     : `${API_BASE}${
//         configuredEndpoint.startsWith("/")
//           ? configuredEndpoint
//           : `/${configuredEndpoint}`
//       }`;

//   const response = await fetch(endpoint, {
//     headers: { Accept: "application/json" },
//   });

//   if (!response.ok) {
//     throw new Error(`Unable to load pet listings (HTTP ${response.status}).`);
//   }

//   const data = await response.json();

//   const petList = Array.isArray(data)
//     ? data
//     : data.pets ||
//       data.listings ||
//       data.data?.pets ||
//       data.data?.listings ||
//       data.data ||
//       [];

//   if (!Array.isArray(petList)) {
//     throw new Error("The pet listings API returned an unexpected response.");
//   }

//   return petList.map(normalizePet);
// }

// /* -------------------------------------------------------
//    MAIN COMPONENT
// ------------------------------------------------------- */

// export default function DogBreeds() {
//   const navigate = useNavigate();

//   const [breeds, setBreeds] = useState(BREED_MODELS);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState("");

//   const [pets, setPets] = useState([]);
//   const [petsLoading, setPetsLoading] = useState(true);
//   const [petsError, setPetsError] = useState("");

//   const [search, setSearch] = useState("");
//   const [sizeFilter, setSizeFilter] = useState("All");
//   const [energyFilter, setEnergyFilter] = useState("All");
//   const [sortBy, setSortBy] = useState("name");

//   const [favoriteIds, setFavoriteIds] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("pawMartFavorites") || "[]");
//     } catch {
//       return [];
//     }
//   });

//   const [selected, setSelected] = useState(null);
//   const [breedPetsSelection, setBreedPetsSelection] = useState(null);

//   const [bookingTarget, setBookingTarget] = useState(null);
//   const [bookingName, setBookingName] = useState("");
//   const [bookingPhone, setBookingPhone] = useState("");
//   const [bookingNotes, setBookingNotes] = useState("");
//   const [bookingError, setBookingError] = useState("");

//   const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

//   /* Load breed directory. */

//   useEffect(() => {
//     let active = true;

//     async function loadBreeds() {
//       setLoading(true);

//       const [backendBreeds, apiBreeds] = await Promise.all([
//         fetchBreedsFromBackend(),
//         fetchBreedsFromDogApi(),
//       ]);

//       if (!active) return;

//       const merged = new Map();

//       [...apiBreeds, ...backendBreeds, ...BREED_MODELS].forEach((item) => {
//         const breed = normalizeBreed(item);
//         const key = normalizeBreedName(breed.name);
//         const existing = merged.get(key);

//         merged.set(key, {
//           ...existing,
//           ...breed,
//           ...getDetails(breed.name),
//           ...breed,
//           image:
//             breed.image && breed.image !== FALLBACK
//               ? breed.image
//               : existing?.image || FALLBACK,
//         });
//       });

//       setBreeds(Array.from(merged.values()));
//       setLoading(false);

//       if (!backendBreeds.length && !apiBreeds.length) {
//         setLoadError(
//           "Showing built-in breed information because breed services are unavailable."
//         );
//       }
//     }

//     loadBreeds();

//     return () => {
//       active = false;
//     };
//   }, []);

//   /* Load real pets from the backend. */

//   useEffect(() => {
//     let active = true;

//     async function loadPets() {
//       setPetsLoading(true);
//       setPetsError("");

//       try {
//         const results = await fetchPetsFromBackend();

//         if (!active) return;

//         const validPets = results.filter((pet) => isMongoId(pet._id));

//         setPets(validPets);

//         if (!validPets.length) {
//           setPetsError(
//             "No database-backed pet listings were found. Add real pet listings to MongoDB or check your API endpoint."
//           );
//         }
//       } catch (error) {
//         if (!active) return;

//         console.error("Failed to load pet listings:", error);
//         setPets([]);
//         setPetsError(error.message);
//       } finally {
//         if (active) setPetsLoading(false);
//       }
//     }

//     loadPets();

//     return () => {
//       active = false;
//     };
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("pawMartFavorites", JSON.stringify(favoriteIds));
//   }, [favoriteIds]);

//   const filteredBreeds = useMemo(() => {
//     let result = breeds.map((breed) => ({
//       ...getDetails(breed.name),
//       ...breed,
//     }));

//     if (search.trim()) {
//       const query = search.toLowerCase();

//       result = result.filter((breed) =>
//         [
//           breed.name,
//           breed.description,
//           breed.tag,
//           breed.size,
//           breed.energy,
//         ]
//           .filter(Boolean)
//           .some((value) => String(value).toLowerCase().includes(query))
//       );
//     }

//     if (sizeFilter !== "All") {
//       result = result.filter((breed) =>
//         String(breed.size).toLowerCase().includes(sizeFilter.toLowerCase())
//       );
//     }

//     if (energyFilter !== "All") {
//       result = result.filter((breed) =>
//         String(breed.energy).toLowerCase().includes(energyFilter.toLowerCase())
//       );
//     }

//     if (showFavoritesOnly) {
//       result = result.filter((breed) => favoriteIds.includes(breed.name));
//     }

//     result.sort((a, b) => {
//       if (sortBy === "name") return a.name.localeCompare(b.name);
//       if (sortBy === "energy") {
//         return String(a.energy).localeCompare(String(b.energy));
//       }
//       if (sortBy === "size") {
//         return String(a.size).localeCompare(String(b.size));
//       }
//       return 0;
//     });

//     return result;
//   }, [
//     breeds,
//     search,
//     sizeFilter,
//     energyFilter,
//     sortBy,
//     showFavoritesOnly,
//     favoriteIds,
//   ]);

//   function toggleFavorite(name) {
//     setFavoriteIds((current) =>
//       current.includes(name)
//         ? current.filter((item) => item !== name)
//         : [...current, name]
//     );
//   }

//   function resetFilters() {
//     setSearch("");
//     setSizeFilter("All");
//     setEnergyFilter("All");
//     setSortBy("name");
//     setShowFavoritesOnly(false);
//   }

//   function openBreedBooking(breed) {
//     setBookingError("");
//     setBookingTarget({
//       type: "breed",
//       name: `${breed.name} Breed Inquiry`,
//       breed: breed.name,
//       image: breed.image || FALLBACK,
//       price: null,
//     });
//   }

//   function openPetBooking(pet) {
//     setBookingError("");

//     if (!isMongoId(pet?._id)) {
//       setBookingError("This pet does not have a valid database listing ID.");
//       return;
//     }

//     if (pet.price == null || !Number.isFinite(Number(pet.price))) {
//       setBookingError(
//         "This pet does not have a valid price. Please contact the seller."
//       );
//       return;
//     }

//     setBreedPetsSelection(null);

//     setBookingTarget({
//       ...pet,
//       type: "pet",
//       _id: pet._id,
//     });
//   }

//   function handleBreedBuy(breed) {
//     const matchingPets = petsForBreed(breed.name, pets);

//     if (matchingPets.length === 0) {
//       openBreedBooking(breed);
//       return;
//     }

//     if (matchingPets.length === 1) {
//       openPetBooking(matchingPets[0]);
//       return;
//     }

//     setBreedPetsSelection({
//       breed,
//       pets: matchingPets,
//     });
//   }

//   function closeBooking() {
//     setBookingTarget(null);
//     setBookingError("");
//   }

//   function submitBooking(event) {
//     event.preventDefault();

//     if (!bookingTarget) return;

//     if (!bookingName.trim()) {
//       setBookingError("Please enter your name.");
//       return;
//     }

//     if (!bookingPhone.trim()) {
//       setBookingError("Please enter your phone number.");
//       return;
//     }

//     if (bookingTarget.type === "breed") {
//       setBookingError(
//         "No individual pet listing is linked to this breed yet. Please choose an available pet from the database."
//       );
//       return;
//     }

//     if (!isMongoId(bookingTarget._id)) {
//       setBookingError("A valid MongoDB pet listing ID is required.");
//       return;
//     }

//     if (
//       bookingTarget.price == null ||
//       !Number.isFinite(Number(bookingTarget.price))
//     ) {
//       setBookingError("A valid pet price is required before checkout.");
//       return;
//     }

//     setBookingError("");

//     navigate("/payment", {
//       state: {
//         pet: {
//           ...bookingTarget,
//           _id: bookingTarget._id,
//         },
//         petId: bookingTarget._id,
//         customer: {
//           name: bookingName.trim(),
//           phone: bookingPhone.trim(),
//           notes: bookingNotes.trim(),
//         },
//       },
//     });
//   }

//   return (
//     <main className="pb-breeds-page">
//       {/* HERO */}

//       <section className="pb-breeds-hero">
//         <div className="pb-breeds-hero-content">
//           <span className="pb-eyebrow">
//             <Sparkles size={15} />
//             FIND YOUR PERFECT COMPANION
//           </span>

//           <h1>
//             Every dog has a story.
//             <br />
//             <span>Find yours.</span>
//           </h1>

//           <p>
//             Explore different breeds, discover their personalities, and find
//             a companion that fits your lifestyle.
//           </p>

//           <a href="#breed-explorer" className="pb-primary-button">
//             Explore Breeds <ArrowRight size={18} />
//           </a>
//         </div>

//         <div className="pb-breeds-hero-image">
//           <img
//             src={FALLBACK}
//             alt="Golden Retriever"
//             onError={(event) => {
//               event.currentTarget.src = FALLBACK;
//             }}
//           />

//           <div className="pb-hero-image-badge">
//             <PawPrint size={20} />
//             <div>
//               <strong>Your next best friend</strong>
//               <span>Starts with a little discovery.</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* BREED EXPLORER */}

//       <section id="breed-explorer" className="pb-breed-explorer">
//         <div className="pb-section-heading">
//           <div>
//             <span className="pb-eyebrow">
//               <PawPrint size={15} />
//               THE BREED DIRECTORY
//             </span>

//             <h2>Meet the breeds</h2>
//             <p>Find a breed that matches your home, energy, and lifestyle.</p>
//           </div>

//           <div className="pb-breed-count">
//             <strong>{filteredBreeds.length}</strong>
//             <span>breeds found</span>
//           </div>
//         </div>

//         <div className="pb-breed-toolbar">
//           <label className="pb-search-box">
//             <Search size={19} />

//             <input
//               type="search"
//               placeholder="Search breeds..."
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//             />

//             {search && (
//               <button
//                 type="button"
//                 onClick={() => setSearch("")}
//                 aria-label="Clear search"
//               >
//                 <X size={17} />
//               </button>
//             )}
//           </label>

//           <label className="pb-filter-control">
//             <SlidersHorizontal size={17} />
//             <span>Size</span>

//             <select
//               value={sizeFilter}
//               onChange={(event) => setSizeFilter(event.target.value)}
//             >
//               <option value="All">All sizes</option>
//               <option value="Small">Small</option>
//               <option value="Medium">Medium</option>
//               <option value="Large">Large</option>
//             </select>

//             <ChevronDown size={15} />
//           </label>

//           <label className="pb-filter-control">
//             <Zap size={17} />
//             <span>Energy</span>

//             <select
//               value={energyFilter}
//               onChange={(event) => setEnergyFilter(event.target.value)}
//             >
//               <option value="All">All levels</option>
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//               <option value="Very High">Very High</option>
//             </select>

//             <ChevronDown size={15} />
//           </label>

//           <label className="pb-filter-control">
//             <ArrowDown size={17} />
//             <span>Sort</span>

//             <select
//               value={sortBy}
//               onChange={(event) => setSortBy(event.target.value)}
//             >
//               <option value="name">Name</option>
//               <option value="size">Size</option>
//               <option value="energy">Energy</option>
//             </select>

//             <ChevronDown size={15} />
//           </label>

//           <button
//             type="button"
//             className={`pb-favorites-filter ${
//               showFavoritesOnly ? "active" : ""
//             }`}
//             onClick={() => setShowFavoritesOnly((value) => !value)}
//           >
//             <Heart
//               size={17}
//               fill={showFavoritesOnly ? "currentColor" : "none"}
//             />
//             Favorites
//           </button>

//           <button
//             type="button"
//             className="pb-reset-button"
//             onClick={resetFilters}
//             title="Reset filters"
//           >
//             <RotateCcw size={17} />
//           </button>
//         </div>

//         {loadError && <p className="pb-inline-notice">{loadError}</p>}

//         {loading ? (
//           <div className="pb-loading-state">
//             <div className="pb-loading-spinner" />
//             <p>Finding your future best friend...</p>
//           </div>
//         ) : filteredBreeds.length === 0 ? (
//           <div className="pb-empty-state">
//             <PawPrint size={38} />
//             <h3>No breeds found</h3>
//             <p>Try changing your search or filters.</p>

//             <button
//               type="button"
//               className="pb-primary-button"
//               onClick={resetFilters}
//             >
//               Reset filters
//             </button>
//           </div>
//         ) : (
//           <div className="pb-breed-grid">
//             {filteredBreeds.map((breed) => {
//               const matchingPets = petsForBreed(breed.name, pets);
//               const hasPets = matchingPets.length > 0;

//               return (
//                 <article className="pb-breed-card" key={breed.name}>
//                   <div className="pb-breed-card-image">
//                     <img
//                       src={breed.image || FALLBACK}
//                       alt={breed.name}
//                       loading="lazy"
//                       onError={(event) => {
//                         event.currentTarget.src = FALLBACK;
//                       }}
//                     />

//                     <span className="pb-breed-tag">
//                       {breed.tag || "Lovely Companion"}
//                     </span>

//                     <button
//                       type="button"
//                       className={`pb-favorite-button ${
//                         favoriteIds.includes(breed.name) ? "is-favorite" : ""
//                       }`}
//                       onClick={() => toggleFavorite(breed.name)}
//                       aria-label={`Toggle ${breed.name} favorite`}
//                     >
//                       <Heart
//                         size={19}
//                         fill={
//                           favoriteIds.includes(breed.name)
//                             ? "currentColor"
//                             : "none"
//                         }
//                       />
//                     </button>
//                   </div>

//                   <div className="pb-breed-card-content">
//                     <h3>{breed.name}</h3>

//                     <p>
//                       {breed.description ||
//                         `Discover what makes the ${breed.name} special.`}
//                     </p>

//                     <div className="pb-breed-quick-facts">
//                       <span>
//                         <Ruler size={15} />
//                         {breed.size}
//                       </span>

//                       <span>
//                         <Zap size={15} />
//                         {breed.energy}
//                       </span>
//                     </div>

//                     <div className="pb-breed-card-actions">
//                       <button
//                         type="button"
//                         className="pb-breed-details-button"
//                         onClick={() => setSelected(breed)}
//                       >
//                         Explore Breed <ArrowUpRight size={17} />
//                       </button>

//                       <button
//                         type="button"
//                         className="pb-primary-button pb-breed-buy-button"
//                         onClick={() => handleBreedBuy(breed)}
//                       >
//                         {petsLoading
//                           ? "Loading..."
//                           : hasPets
//                             ? "Buy Now"
//                             : "Ask About Breed"}
//                         <ArrowRight size={16} />
//                       </button>
//                     </div>

//                     {!petsLoading && hasPets && (
//                       <p className="pb-breed-availability">
//                         {matchingPets.length} pet
//                         {matchingPets.length === 1 ? "" : "s"} available
//                       </p>
//                     )}
//                   </div>
//                 </article>
//               );
//             })}
//           </div>
//         )}
//       </section>

//       {/* REAL DATABASE PET LISTINGS */}

//       <section className="pb-pet-market">
//         <div className="pb-section-heading">
//           <div>
//             <span className="pb-eyebrow">
//               <PawPrint size={15} />
//               MEET YOUR MATCH
//             </span>

//             <h2>Pets looking for a home</h2>
//             <p>Choose an individual pet and continue to checkout.</p>
//           </div>
//         </div>

//         <div className="pb-demo-disclaimer">
//           <ShieldCheck size={19} />

//           <p>
//             <strong>Verified listing IDs required:</strong> Only pets returned
//             by the database-backed API are shown here. Demo IDs are not
//             purchasable.
//           </p>
//         </div>

//         {petsLoading ? (
//           <div className="pb-loading-state">
//             <div className="pb-loading-spinner" />
//             <p>Loading available pets...</p>
//           </div>
//         ) : petsError ? (
//           <div className="pb-empty-state">
//             <PawPrint size={38} />
//             <h3>Pet listings unavailable</h3>
//             <p>{petsError}</p>
//             <p>
//               Check the endpoint configured in
//               VITE_PET_LISTINGS_ENDPOINT.
//             </p>
//           </div>
//         ) : pets.length === 0 ? (
//           <div className="pb-empty-state">
//             <PawPrint size={38} />
//             <h3>No pets available yet</h3>
//             <p>Add real pet listings to MongoDB and ensure the backend returns
//               their MongoDB IDs.</p>
//           </div>
//         ) : (
//           <div className="pb-pet-grid">
//             {pets.map((pet) => (
//               <article className="pb-pet-card" key={pet._id}>
//                 <div className="pb-pet-card-image">
//                   <img
//                     src={pet.image}
//                     alt={`${pet.name}, ${pet.breed}`}
//                     loading="lazy"
//                     onError={(event) => {
//                       event.currentTarget.src = FALLBACK;
//                     }}
//                   />

//                   <span className="pb-pet-listing-label">
//                     Available listing
//                   </span>
//                 </div>

//                 <div className="pb-pet-card-content">
//                   <div className="pb-pet-title-row">
//                     <div>
//                       <h3>{pet.name}</h3>
//                       <p>{pet.breed}</p>
//                     </div>

//                     <strong className="pb-pet-price">
//                       {formatPrice(pet.price)}
//                     </strong>
//                   </div>

//                   <div className="pb-pet-details">
//                     <span>{pet.age}</span>
//                     <span>{pet.gender}</span>
//                   </div>

//                   <p className="pb-pet-location">{pet.location}</p>

//                   <button
//                     type="button"
//                     className="pb-primary-button pb-pet-book-button"
//                     onClick={() => openPetBooking(pet)}
//                   >
//                     Buy Now <ArrowRight size={17} />
//                   </button>
//                 </div>
//               </article>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* MULTIPLE PETS MATCHING A BREED */}

//       {breedPetsSelection && (
//         <div
//           className="pb-modal-backdrop"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) {
//               setBreedPetsSelection(null);
//             }
//           }}
//         >
//           <section
//             className="pb-booking-modal pb-breed-pets-modal"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="pb-breed-pets-title"
//           >
//             <button
//               type="button"
//               className="pb-modal-close"
//               onClick={() => setBreedPetsSelection(null)}
//               aria-label="Close available pets"
//             >
//               <X size={21} />
//             </button>

//             <span className="pb-eyebrow">
//               <PawPrint size={15} />
//               AVAILABLE PETS
//             </span>

//             <h2 id="pb-breed-pets-title">
//               Choose your {breedPetsSelection.breed.name}
//             </h2>

//             <p>Select an individual listing to continue to payment.</p>

//             <div className="pb-available-pets-list">
//               {breedPetsSelection.pets.map((pet) => (
//                 <article className="pb-available-pet-item" key={pet._id}>
//                   <img
//                     src={pet.image || FALLBACK}
//                     alt={pet.name}
//                     onError={(event) => {
//                       event.currentTarget.src = FALLBACK;
//                     }}
//                   />

//                   <div className="pb-available-pet-info">
//                     <strong>{pet.name}</strong>
//                     <span>
//                       {pet.breed} · {pet.age}
//                     </span>
//                     <strong>{formatPrice(pet.price)}</strong>
//                   </div>

//                   <button
//                     type="button"
//                     className="pb-primary-button"
//                     onClick={() => openPetBooking(pet)}
//                   >
//                     Select <ArrowRight size={16} />
//                   </button>
//                 </article>
//               ))}
//             </div>
//           </section>
//         </div>
//       )}

//       {/* BREED DETAILS MODAL */}

//       {selected && (
//         <div
//           className="pb-modal-backdrop"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) {
//               setSelected(null);
//             }
//           }}
//         >
//           <section
//             className="pb-breed-modal"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="pb-breed-modal-title"
//           >
//             <button
//               type="button"
//               className="pb-modal-close"
//               onClick={() => setSelected(null)}
//               aria-label="Close breed details"
//             >
//               <X size={21} />
//             </button>

//             <div className="pb-breed-modal-image">
//               <img
//                 src={selected.image || FALLBACK}
//                 alt={selected.name}
//                 onError={(event) => {
//                   event.currentTarget.src = FALLBACK;
//                 }}
//               />
//             </div>

//             <div className="pb-breed-modal-content">
//               <span className="pb-eyebrow">
//                 <PawPrint size={15} />
//                 {selected.tag || "BREED PROFILE"}
//               </span>

//               <h2 id="pb-breed-modal-title">{selected.name}</h2>

//               <p className="pb-modal-description">
//                 {selected.about || selected.description}
//               </p>

//               <div className="pb-breed-fact-grid">
//                 <div>
//                   <Ruler size={19} />
//                   <span>Size</span>
//                   <strong>{selected.size}</strong>
//                 </div>

//                 <div>
//                   <Zap size={19} />
//                   <span>Energy</span>
//                   <strong>{selected.energy}</strong>
//                 </div>

//                 <div>
//                   <Scissors size={19} />
//                   <span>Coat</span>
//                   <strong>{selected.coat}</strong>
//                 </div>

//                 <div>
//                   <House size={19} />
//                   <span>Living</span>
//                   <strong>{selected.apartment}</strong>
//                 </div>
//               </div>

//               <div className="pb-breed-care-note">
//                 <ShieldCheck size={19} />

//                 <div>
//                   <strong>Care tip</strong>
//                   <p>{selected.care}</p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 className="pb-primary-button pb-modal-book-button"
//                 onClick={() => {
//                   setSelected(null);
//                   handleBreedBuy(selected);
//                 }}
//               >
//                 {petsForBreed(selected.name, pets).length
//                   ? "View Available Pets"
//                   : "Ask About This Breed"}
//                 <ArrowRight size={18} />
//               </button>

//               <p className="pb-modal-footnote">
//                 A breed inquiry does not guarantee availability or complete a
//                 purchase.
//               </p>
//             </div>
//           </section>
//         </div>
//       )}

//       {/* BOOKING / CHECKOUT FORM */}

//       {bookingTarget && (
//         <div
//           className="pb-modal-backdrop pb-booking-backdrop"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) {
//               closeBooking();
//             }
//           }}
//         >
//           <section
//             className="pb-booking-modal"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="pb-booking-title"
//           >
//             <button
//               type="button"
//               className="pb-modal-close"
//               onClick={closeBooking}
//               aria-label="Close booking form"
//             >
//               <X size={21} />
//             </button>

//             <div className="pb-booking-modal-heading">
//               <span className="pb-eyebrow">
//                 <PawPrint size={15} />
//                 PAWMART BOOKING
//               </span>

//               <h2 id="pb-booking-title">
//                 {bookingTarget.type === "breed"
//                   ? "Ask about this breed"
//                   : "Book your new friend"}
//               </h2>

//               <p>
//                 {bookingTarget.type === "breed"
//                   ? "Send an inquiry about this breed. This does not start a payment."
//                   : "Enter your contact details to continue to payment."}
//               </p>
//             </div>

//             <div className="pb-booking-summary">
//               <img
//                 src={bookingTarget.image || FALLBACK}
//                 alt={bookingTarget.breed}
//                 onError={(event) => {
//                   event.currentTarget.src = FALLBACK;
//                 }}
//               />

//               <div>
//                 <strong>{bookingTarget.name}</strong>
//                 <span>{bookingTarget.breed}</span>

//                 {bookingTarget.price != null && (
//                   <strong className="pb-booking-summary-price">
//                     {formatPrice(bookingTarget.price)}
//                   </strong>
//                 )}
//               </div>
//             </div>

//             {bookingError && (
//               <div
//                 className="pb-booking-alert pb-booking-error"
//                 role="alert"
//               >
//                 {bookingError}
//               </div>
//             )}

//             <form className="pb-booking-form" onSubmit={submitBooking}>
//               <label>
//                 Your name <span>*</span>
//                 <input
//                   type="text"
//                   value={bookingName}
//                   onChange={(event) => setBookingName(event.target.value)}
//                   placeholder="Enter your full name"
//                   autoComplete="name"
//                   required
//                 />
//               </label>

//               <label>
//                 Phone number <span>*</span>
//                 <input
//                   type="tel"
//                   value={bookingPhone}
//                   onChange={(event) => setBookingPhone(event.target.value)}
//                   placeholder="Enter your phone number"
//                   autoComplete="tel"
//                   required
//                 />
//               </label>

//               <label>
//                 Additional message
//                 <textarea
//                   value={bookingNotes}
//                   onChange={(event) => setBookingNotes(event.target.value)}
//                   placeholder="Any questions or preferences?"
//                   rows={3}
//                 />
//               </label>

//               <button
//                 type="submit"
//                 className="pb-primary-button pb-submit-booking"
//               >
//                 {bookingTarget.type === "breed"
//                   ? "Submit Breed Inquiry"
//                   : "Continue to Payment"}
//                 <ArrowRight size={18} />
//               </button>

//               <p className="pb-booking-privacy-note">
//                 Final availability and price must be validated by the backend.
//               </p>
//             </form>
//           </section>
//         </div>
//       )}
//     </main>
//   );
// }


// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowRight, Heart, PawPrint, Search, SlidersHorizontal, X, Ruler, Zap,
//   Scissors, House, ShieldCheck, RotateCcw, MapPin, Info, ChevronLeft,
//   ChevronRight, Dog, CheckCircle2, Sparkles
// } from "lucide-react";
// import "./DogBreeds.css";

// const API = "http://localhost:5000/api";
// const FALLBACK = "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg";
// const PER_PAGE = 12;

// const PROFILES = [
//   ["Golden Retriever","Family Favorite","Large","High","Long","Regular brushing","Needs space","https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg","Friendly, affectionate and intelligent family companions."],
//   ["Siberian Husky","Adventure Buddy","Large","Very High","Thick double coat","Frequent brushing","Needs exercise","https://images.dog.ceo/breeds/husky/n02110185_10047.jpg","Active, social dogs that need exercise, secure spaces and enrichment."],
//   ["Poodle","Smart Companion","Varies","High","Curly","Professional grooming","Often suitable","https://images.dog.ceo/breeds/poodle-standard/n02113799_2280.jpg","Clever, trainable companions with regular coat-care needs."],
//   ["Beagle","Playful Explorer","Medium","High","Short","Low maintenance","Can adapt","https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg","Curious scent hounds that enjoy sniffing, play and company."],
//   ["German Shepherd","Loyal Guardian","Large","High","Double coat","Regular brushing","Needs activity","https://images.dog.ceo/breeds/germanshepherd/n02106662_10253.jpg","Attentive, versatile dogs that benefit from training and activity."],
//   ["Corgi","Little Charmer","Small","Medium-High","Double coat","Regular brushing","Can adapt","https://images.dog.ceo/breeds/corgi-cardigan/n02113186_1030.jpg","Small, sturdy herding dogs with lively personalities."],
//   ["Labrador Retriever","Friendly All-Rounder","Large","High","Short","Occasional brushing","Needs exercise","https://images.dog.ceo/breeds/labrador/n02099712_7415.jpg","Outgoing, playful companions that often enjoy active households."],
//   ["Dachshund","Bold Personality","Small","Medium","Varies","Depends on coat","Often suitable","https://images.dog.ceo/breeds/dachshund/dachshund_6.jpg","Curious small dogs with bold personalities and different coat types."],
//   ["Australian Shepherd","Active Partner","Medium","Very High","Medium","Regular brushing","Needs activity","https://images.dog.ceo/breeds/australian-shepherd/leroy.jpg","Bright, energetic herding dogs needing physical and mental challenges."],
//   ["French Bulldog","City Companion","Small","Low-Medium","Short","Low maintenance","Often suitable","https://images.dog.ceo/breeds/bulldog-french/n02108915_100.jpg","Compact companions; heat and breathing risks need special consideration."],
//   ["Border Collie","Training Champion","Medium","Very High","Medium","Regular brushing","Needs activity","https://images.dog.ceo/breeds/collie-border/n02106166_1008.jpg","Highly intelligent dogs that need meaningful work and enrichment."],
//   ["Pomeranian","Tiny Companion","Small","Medium","Long double coat","Frequent brushing","Often suitable","https://images.dog.ceo/breeds/pomeranian/n02112018_1003.jpg","Small, alert companions with fluffy coats and lively personalities."]
// ].map(([name,tag,size,energy,coat,care,apartment,image,description])=>({name,tag,size,energy,coat,care,apartment,image,description,about:`Learn about ${name}'s exercise, grooming, training and health needs before choosing a dog.`}));

// const pretty = s => String(s||"").replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/\b\w/g,c=>c.toUpperCase());
// const norm = s => String(s||"").toLowerCase().replace(/[_-]+/g," ").replace(/\s+/g," ").trim();
// const validId = id => /^[a-f\d]{24}$/i.test(String(id||""));
// const detailsFor = name => PROFILES.find(p => norm(p.name)===norm(name) || (p.name==="Corgi" && norm(name).includes("corgi"))) || {
//   name:pretty(name),tag:"Lovely Companion",size:"Varies",energy:"Varies",coat:"Varies",care:"Regular care",apartment:"Depends on lifestyle",image:FALLBACK,
//   description:`Learn about the traits and care needs of ${pretty(name)} before deciding if this breed suits your home.`,
//   about:`Research ${pretty(name)}'s exercise, grooming, training and health needs. Individual dogs can differ in temperament and care requirements.`
// };
// const money = n => Number.isFinite(Number(n)) && Number(n)>=0 ? new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(n)) : "Price to be confirmed";

// async function fetchAllBreeds() {
//   let page=1, pages=1, all=[];
//   do {
//     const url=new URL(`${API}/breeds/catalog`);
//     url.searchParams.set("page",String(page));
//     url.searchParams.set("limit","50");
//     const response=await fetch(url,{headers:{Accept:"application/json"}});
//     if(!response.ok) throw new Error(`Breed API returned HTTP ${response.status}`);
//     const data=await response.json();
//     if(!data.success || !Array.isArray(data.breeds)) throw new Error("Unexpected breed API response");
//     pages=Math.max(1,Number(data.pages)||1);
//     all.push(...data.breeds.map(item=>{
//       const name=pretty(item.name||item.breed);
//       return {...detailsFor(name),...item,name,image:item.image||detailsFor(name).image||FALLBACK};
//     }));
//     page++;
//   } while(page<=pages);
//   return [...new Map(all.filter(x=>x.name).map(x=>[norm(x.name),x])).values()].sort((a,b)=>a.name.localeCompare(b.name));
// }
// async function fetchPets() {
//   const configured=import.meta.env.VITE_PET_LISTINGS_ENDPOINT||"/pets";
//   const endpoint=configured.startsWith("http")?configured:`${API}${configured.startsWith("/")?configured:`/${configured}`}`;
//   const response=await fetch(endpoint,{headers:{Accept:"application/json"}});
//   if(!response.ok) throw new Error(`Pet listings API returned HTTP ${response.status}`);
//   const data=await response.json();
//   const list=Array.isArray(data)?data:data?.pets||data?.listings||data?.data?.pets||data?.data?.listings||data?.data||[];
//   if(!Array.isArray(list)) throw new Error("Unexpected pet listings response");
//   return list.map(p=>({...p,_id:validId(p._id||p.id||p.petId)?String(p._id||p.id||p.petId):undefined,name:p.name||p.petName||"Pet",breed:pretty(p.breed||p.breedName||"Mixed breed"),price:Number(p.price),image:p.image||p.imageUrl||p.photos?.[0]||FALLBACK,age:p.age||"Not specified",gender:p.gender||"Not specified",location:p.location||p.city||"Location not specified",status:norm(p.status||p.listingStatus||"available")}));
// }

// export default function DogBreeds() {
//   const navigate=useNavigate();
//   const [breeds,setBreeds]=useState([]),[loading,setLoading]=useState(true),[loadError,setLoadError]=useState("");
//   const [pets,setPets]=useState([]),[petsLoading,setPetsLoading]=useState(true),[petsError,setPetsError]=useState("");
//   const [search,setSearch]=useState(""),[size,setSize]=useState("All"),[energy,setEnergy]=useState("All"),[sort,setSort]=useState("name"),[page,setPage]=useState(1);
//   const [favorites,setFavorites]=useState(()=>{try{return JSON.parse(localStorage.getItem("pawMartFavorites")||"[]")}catch{return[]}});
//   const [favoritesOnly,setFavoritesOnly]=useState(false),[selected,setSelected]=useState(null),[choices,setChoices]=useState(null);
//   const [target,setTarget]=useState(null),[customerName,setCustomerName]=useState(""),[phone,setPhone]=useState(""),[notes,setNotes]=useState(""),[formError,setFormError]=useState("");
//   const [notice,setNotice]=useState("");

//   useEffect(()=>{let live=true;(async()=>{try{const list=await fetchAllBreeds();if(live)setBreeds(list)}catch(e){if(live){setLoadError(e.message);setBreeds(PROFILES.map(p=>({...p,demo:true,listingStatus:"demo"})))}}finally{if(live)setLoading(false)}})();return()=>{live=false}},[]);
//   useEffect(()=>{let live=true;(async()=>{try{const list=await fetchPets();if(live){const valid=list.filter(p=>validId(p._id)&&Number.isFinite(p.price)&&p.price>=0);setPets(valid);if(list.length&&!valid.length)setPetsError("No listings with valid IDs and prices were returned.")}}catch(e){if(live)setPetsError(e.message)}finally{if(live)setPetsLoading(false)}})();return()=>{live=false}},[]);
//   useEffect(()=>{try{localStorage.setItem("pawMartFavorites",JSON.stringify(favorites))}catch{}},[favorites]);
//   useEffect(()=>setPage(1),[search,size,energy,sort,favoritesOnly]);

//   const filtered=useMemo(()=>breeds.filter(b=>{
//     const q=norm(search),d=detailsFor(b.name);
//     const text=[b.name,b.description,b.tag,b.size,b.energy,b.coat].some(v=>norm(v).includes(q));
//     return (!q||text)&&(size==="All"||norm(b.size).includes(norm(size)))&&(energy==="All"||norm(b.energy).includes(norm(energy)))&&(!favoritesOnly||favorites.includes(norm(b.name)))&&d;
//   }).sort((a,b)=>sort==="size"?String(a.size).localeCompare(String(b.size)):sort==="energy"?String(a.energy).localeCompare(String(b.energy)):a.name.localeCompare(b.name)),[breeds,search,size,energy,sort,favoritesOnly,favorites]);
//   const pages=Math.max(1,Math.ceil(filtered.length/PER_PAGE)),safePage=Math.min(page,pages),shown=filtered.slice((safePage-1)*PER_PAGE,safePage*PER_PAGE);
//   const matchingPets=name=>pets.filter(p=>validId(p._id)&&Number.isFinite(p.price)&&!["sold","unavailable","inactive"].includes(p.status)&&(norm(p.breed)===norm(name)||norm(p.breed).includes(norm(name))||norm(name).includes(norm(p.breed))));
//   const toggleFavorite=b=>setFavorites(old=>old.includes(norm(b.name))?old.filter(x=>x!==norm(b.name)):[...old,norm(b.name)]);
//   const reset=()=>{setSearch("");setSize("All");setEnergy("All");setSort("name");setFavoritesOnly(false)};
//   const openInquiry=b=>{setSelected(null);setChoices(null);setFormError("");setTarget({type:"breed",name:b.name,image:b.image||FALLBACK})};
//   const openPet=p=>{if(!validId(p._id)||!Number.isFinite(p.price)){setNotice("This listing has an invalid ID or price; checkout is unavailable.");return}setChoices(null);setSelected(null);setFormError("");setTarget({type:"pet",...p})};
//   const buyBreed=b=>{const matches=matchingPets(b.name);if(matches.length===1)openPet(matches[0]);else if(matches.length>1)setChoices({breed:b,pets:matches});else openInquiry(b)};
//   const submit=e=>{e.preventDefault();setFormError("");if(customerName.trim().length<2)return setFormError("Enter your full name.");if(!/^[+]?[\d\s()-]{8,20}$/.test(phone.trim()))return setFormError("Enter a valid phone number.");if(target?.type==="breed")return setFormError("This is a breed catalogue inquiry, not an individual pet listing. Payment is not available for breed records.");if(!target||!validId(target._id)||!Number.isFinite(Number(target.price)))return setFormError("This listing is missing a valid ID or price.");navigate("/payment",{state:{pet:{...target,_id:target._id,price:Number(target.price)},petId:target._id,customer:{name:customerName.trim(),phone:phone.trim(),notes:notes.trim()}}})};
//   const closeForm=()=>{setTarget(null);setFormError("")};

//   return <main className="pb-breeds-page">
//     <header className="pb-header">
//       <a className="pb-brand" href="/"><span className="pb-mark"><PawPrint size={29}/></span><span><strong>Paw<span>Mart</span></strong><small>FIND YOUR FOREVER FRIEND</small></span></a>
//       <nav className="pb-nav"><a href="/">Home</a><a className="active" href="#breed-explorer">Dog Breeds</a><a href="#individual-pets">Available Pets</a><a href="#responsible-care">Responsible Care</a></nav>
//       <button className="pb-favnav" onClick={()=>{setFavoritesOnly(true);document.getElementById("breed-explorer")?.scrollIntoView({behavior:"smooth"})}}><Heart size={15}/> Favorites <b>{favorites.length}</b></button>
//     </header>

//     <section className="pb-breeds-hero">
//       <div className="pb-breeds-hero-content"><div className="pb-eyebrow"><Sparkles size={15}/> FIND YOUR PERFECT COMPANION</div><h1>Every dog has a story. <span>Find yours.</span></h1><p>Explore the PawMart breed catalogue, compare care needs, and learn what kind of companion may fit your lifestyle.</p><a className="pb-primary-button" href="#breed-explorer">Explore dog breeds <ArrowRight size={16}/></a></div>
//       <div className="pb-breeds-hero-image"><img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=85" alt="Golden retriever outdoors" onError={e=>e.currentTarget.src=FALLBACK}/><div className="pb-hero-image-badge"><PawPrint size={25}/><div><strong>A thoughtful match starts here</strong><span>Learn first. Choose responsibly.</span></div></div></div>
//     </section>

//     {notice&&<div className="pb-booking-alert pb-booking-error" role="status"><Info size={18}/><span>{notice}</span><button onClick={()=>setNotice("")} aria-label="Dismiss"><X size={17}/></button></div>}

//     <section className="pb-breed-explorer" id="breed-explorer">
//       <div className="pb-section-heading"><div><div className="pb-eyebrow"><PawPrint size={14}/> THE BREED LIBRARY</div><h2>Meet the <span>breeds</span></h2><p>Search and filter the catalogue to explore size, energy, coat, and general care needs.</p></div><div className="pb-breed-count"><strong>{filtered.length}</strong><span>breeds in results</span></div></div>
//       <div className="pb-breed-toolbar">
//         <div className="pb-search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dog breeds..." aria-label="Search breeds"/>{search&&<button onClick={()=>setSearch("")} aria-label="Clear search"><X size={15}/></button>}</div>
//         <label className="pb-filter-control"><Ruler size={15}/><span>Size</span><select value={size} onChange={e=>setSize(e.target.value)}><option>All</option><option>Small</option><option>Medium</option><option>Large</option></select></label>
//         <label className="pb-filter-control"><Zap size={15}/><span>Energy</span><select value={energy} onChange={e=>setEnergy(e.target.value)}><option>All</option><option>Low</option><option>Medium</option><option>High</option><option>Very High</option></select></label>
//         <label className="pb-filter-control"><SlidersHorizontal size={15}/><span>Sort</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="name">Name</option><option value="size">Size</option><option value="energy">Energy</option></select></label>
//         <button className={`pb-favorites-filter ${favoritesOnly?"active":""}`} onClick={()=>setFavoritesOnly(v=>!v)}><Heart size={15}/> Favorites</button><button className="pb-reset-button" onClick={reset} title="Reset filters" aria-label="Reset filters"><RotateCcw size={16}/></button>
//       </div>
//       {loadError&&<div className="pb-inline-notice">Could not load the server catalogue: {loadError}. Showing 12 built-in sample profiles instead.</div>}
//       {loading?<div className="pb-loading-state"><div className="pb-loading-spinner"/><p>Loading all catalogue pages…</p></div>:shown.length?<><div className="pb-breed-grid">{shown.map(b=>{const d=detailsFor(b.name),image=b.image||d.image||FALLBACK,isFav=favorites.includes(norm(b.name)),count=matchingPets(b.name).length;return <article className="pb-breed-card" key={b._id||b.breedId||norm(b.name)}><div className="pb-breed-card-image"><img src={image} alt={b.name} loading="lazy" onError={e=>{if(e.currentTarget.src!==FALLBACK)e.currentTarget.src=FALLBACK}}/><span className="pb-breed-tag">{b.tag||d.tag}</span><button className={`pb-favorite-button ${isFav?"is-favorite":""}`} onClick={()=>toggleFavorite(b)} aria-label={isFav?"Remove favorite":"Add favorite"}><Heart size={17} fill={isFav?"currentColor":"none"}/></button></div><div className="pb-breed-card-content"><h3>{b.name}</h3><p>{b.description||d.description}</p><div className="pb-breed-quick-facts"><span><Ruler size={13}/>{b.size||d.size}</span><span><Zap size={13}/>{b.energy||d.energy}</span></div><div className="pb-breed-card-actions"><button className="pb-breed-details-button" onClick={()=>setSelected({...d,...b,image})}>Explore breed <ArrowRight size={15}/></button><button className="pb-breed-details-button pb-breed-buy-button" onClick={()=>buyBreed(b)}>Buy <ArrowRight size={15}/></button></div></div></article>})}</div>
//       <div className="pb-pagination"><button disabled={safePage<=1} onClick={()=>{setPage(p=>Math.max(1,p-1));document.getElementById("breed-explorer")?.scrollIntoView({behavior:"smooth"})}}><ChevronLeft size={16}/> Previous</button><span>Page {safePage} of {pages}</span><button disabled={safePage>=pages} onClick={()=>{setPage(p=>Math.min(pages,p+1));document.getElementById("breed-explorer")?.scrollIntoView({behavior:"smooth"})}}>Next <ChevronRight size={16}/></button></div><p className="pb-pagination-summary">Showing {(safePage-1)*PER_PAGE+1}–{Math.min(safePage*PER_PAGE,filtered.length)} of {filtered.length} breeds</p></>:<div className="pb-empty-state"><PawPrint size={35}/><h3>No breeds found</h3><p>Try another search or reset the filters.</p><button className="pb-primary-button" onClick={reset}>Reset filters</button></div>}
//     </section>

//     <section className="pb-pet-market" id="individual-pets">
//       <div className="pb-section-heading"><div><div className="pb-eyebrow"><PawPrint size={14}/> INDIVIDUAL LISTINGS</div><h2>Pets looking for a <span>home</span></h2><p>Only individual pet listings are eligible for checkout—not catalogue breed records.</p></div><div className="pb-breed-count"><strong>{pets.length}</strong><span>valid listings</span></div></div>
//       <div className="pb-demo-disclaimer"><ShieldCheck size={19}/><p><strong>Responsible ownership:</strong> breed catalogue entries are informational demo records, not individual dogs for sale. Verify the pet, seller, health information and listing availability before a transaction.</p></div>
//       {petsLoading?<div className="pb-loading-state"><div className="pb-loading-spinner"/><p>Loading individual listings…</p></div>:petsError?<div className="pb-inline-notice">{petsError}</div>:!pets.length?<div className="pb-empty-state"><Dog size={35}/><h3>No individual listings yet</h3><p>Verified pet listings will appear here when available.</p></div>:<div className="pb-pet-grid">{pets.filter(p=>!["sold","unavailable","inactive"].includes(p.status)).map(p=><article className="pb-pet-card" key={p._id}><div className="pb-pet-card-image"><img src={p.image} alt={p.name} loading="lazy" onError={e=>e.currentTarget.src=FALLBACK}/><span className="pb-pet-listing-label">Individual listing</span></div><div className="pb-pet-card-content"><div className="pb-pet-title-row"><div><h3>{p.name}</h3><p>{p.breed}</p></div><strong className="pb-pet-price">{money(p.price)}</strong></div><div className="pb-pet-details"><span>Age: {p.age}</span><span>{p.gender}</span></div><p className="pb-pet-location"><MapPin size={13}/> {p.location}</p><button className="pb-primary-button pb-pet-book-button" onClick={()=>openPet(p)}>Continue <ArrowRight size={15}/></button></div></article>)}</div>}
//     </section>

//     <section className="pb-promise" id="responsible-care"><div className="pb-promise-copy"><div className="pb-eyebrow"><ShieldCheck size={15}/> A LIFETIME COMMITMENT</div><h2>Choose with care. <em>Love for life.</em></h2><p>Every breed has individual needs, and every dog is an individual. Consider your time, space, budget, activity level and ability to provide veterinary care before bringing a companion home.</p><ul><li><CheckCircle2 size={16}/> Research breed health and care needs.</li><li><CheckCircle2 size={16}/> Meet and verify the individual dog and seller.</li><li><CheckCircle2 size={16}/> Plan for training, exercise, grooming and vet care.</li></ul></div><div className="pb-promise-art"><img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=85" alt="A dog looking at the camera" onError={e=>e.currentTarget.src=FALLBACK}/><div><ShieldCheck size={23}/><span><strong>Responsible choices matter</strong><small>A safe, caring home comes first.</small></span></div></div></section>
//     <footer className="pb-footer"><a className="pb-brand" href="/"><span className="pb-mark"><PawPrint size={25}/></span><span><strong>Paw<span>Mart</span></strong><small>FIND YOUR FOREVER FRIEND</small></span></a><p>Learn about breeds. Choose responsibly. Care for life.</p><span>© {new Date().getFullYear()} PawMart</span></footer>

//     {selected&&<div className="pb-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><section className="pb-breed-modal" role="dialog" aria-modal="true" aria-labelledby="breed-modal-title"><button className="pb-modal-close" onClick={()=>setSelected(null)} aria-label="Close"><X size={19}/></button><div className="pb-breed-modal-image"><img src={selected.image||FALLBACK} alt={selected.name} onError={e=>e.currentTarget.src=FALLBACK}/></div><div className="pb-breed-modal-content"><div className="pb-eyebrow"><PawPrint size={14}/> BREED PROFILE</div><h2 id="breed-modal-title">{selected.name}</h2><p className="pb-modal-description">{selected.about||selected.description}</p><div className="pb-breed-fact-grid"><div><Ruler size={18}/><span>Typical size</span><strong>{selected.size}</strong></div><div><Zap size={18}/><span>Energy level</span><strong>{selected.energy}</strong></div><div><Scissors size={18}/><span>Coat</span><strong>{selected.coat}</strong></div><div><House size={18}/><span>Living fit</span><strong>{selected.apartment}</strong></div></div><div className="pb-breed-care-note"><ShieldCheck size={19}/><div><strong>Care reminder</strong><p>{selected.care}. Ask a qualified veterinarian about individual health needs.</p></div></div><button className="pb-primary-button pb-modal-book-button" onClick={()=>openInquiry(selected)}>Ask about this breed <ArrowRight size={16}/></button><p className="pb-modal-footnote">This profile is informational and is not an individual dog listing.</p></div></section></div>}

//     {choices&&<div className="pb-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setChoices(null)}}><section className="pb-booking-modal" role="dialog" aria-modal="true"><button className="pb-modal-close" onClick={()=>setChoices(null)} aria-label="Close"><X size={19}/></button><div className="pb-booking-modal-heading"><div className="pb-eyebrow"><PawPrint size={14}/> INDIVIDUAL LISTINGS</div><h2>Choose a {choices.breed.name}</h2><p>Select an individual pet listing to continue.</p></div><div className="pb-available-pets-list">{choices.pets.map(p=><button key={p._id} onClick={()=>openPet(p)}><strong>{p.name}</strong><span>{p.breed} · {money(p.price)} · {p.location}</span><ArrowRight size={16}/></button>)}</div></section></div>}

//     {target&&<div className="pb-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)closeForm()}}><section className="pb-booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="pb-modal-close" onClick={closeForm} aria-label="Close"><X size={19}/></button><div className="pb-booking-modal-heading"><div className="pb-eyebrow"><PawPrint size={14}/> PAWMART CONTACT FORM</div><h2 id="booking-title">{target.type==="pet"?"Continue with this pet":`Ask about ${target.name}`}</h2><p>{target.type==="pet"?"Enter your details to continue to the payment step.":"Send an inquiry. This does not reserve a dog or initiate payment."}</p></div><div className="pb-booking-summary"><img src={target.image||FALLBACK} alt=""/><div><strong>{target.name}</strong><span>{target.type==="pet"?target.breed:"Breed catalogue inquiry"}</span>{target.type==="pet"&&<strong className="pb-booking-summary-price">{money(target.price)}</strong>}</div></div><form className="pb-booking-form" onSubmit={submit}><label>Full name <span>*</span><input value={customerName} onChange={e=>setCustomerName(e.target.value)} autoComplete="name" minLength={2} required placeholder="Enter your full name"/></label><label>Phone number <span>*</span><input value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" required placeholder="Enter your phone number"/></label><label>Message or notes<textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder="Optional"/></label>{formError&&<div className="pb-booking-alert pb-booking-error" role="alert"><Info size={17}/>{formError}</div>}<button className="pb-primary-button pb-submit-booking" type="submit">{target.type==="pet"?"Continue to payment":"Submit inquiry"} <ArrowRight size={16}/></button><p className="pb-booking-privacy-note">Never share passwords or banking PINs. Verify seller and listing details before paying.</p></form></section></div>}
//   </main>;
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  PawPrint,
  Search,
  SlidersHorizontal,
  X,
  Ruler,
  Zap,
  Scissors,
  House,
  ShieldCheck,
  RotateCcw,
  MapPin,
  Info,
  ChevronLeft,
  ChevronRight,
  Dog,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import "./DogBreeds.css";

const API = "http://localhost:5000/api";
const DOG_CEO_API = "https://dog.ceo/api";

const FALLBACK =
  "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg";

const PER_PAGE = 12;

// ========================================
// BUILT-IN BREED PROFILES
// ========================================

const PROFILES = [
  [
    "Golden Retriever",
    "Family Favorite",
    "Large",
    "High",
    "Long",
    "Regular brushing",
    "Needs space",
    "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg",
    "Friendly, affectionate and intelligent family companions.",
  ],
  [
    "Siberian Husky",
    "Adventure Buddy",
    "Large",
    "Very High",
    "Thick double coat",
    "Frequent brushing",
    "Needs exercise",
    "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg",
    "Active, social dogs that need exercise, secure spaces and enrichment.",
  ],
  [
    "Poodle",
    "Smart Companion",
    "Varies",
    "High",
    "Curly",
    "Professional grooming",
    "Often suitable",
    "https://images.dog.ceo/breeds/poodle-standard/n02113799_2280.jpg",
    "Clever, trainable companions with regular coat-care needs.",
  ],
  [
    "Beagle",
    "Playful Explorer",
    "Medium",
    "High",
    "Short",
    "Low maintenance",
    "Can adapt",
    "https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg",
    "Curious scent hounds that enjoy sniffing, play and company.",
  ],
  [
    "German Shepherd",
    "Loyal Guardian",
    "Large",
    "High",
    "Double coat",
    "Regular brushing",
    "Needs activity",
    "https://images.dog.ceo/breeds/germanshepherd/n02106662_10253.jpg",
    "Attentive, versatile dogs that benefit from training and activity.",
  ],
  [
    "Corgi",
    "Little Charmer",
    "Small",
    "Medium-High",
    "Double coat",
    "Regular brushing",
    "Can adapt",
    "https://images.dog.ceo/breeds/corgi-cardigan/n02113186_1030.jpg",
    "Small, sturdy herding dogs with lively personalities.",
  ],
  [
    "Labrador Retriever",
    "Friendly All-Rounder",
    "Large",
    "High",
    "Short",
    "Occasional brushing",
    "Needs exercise",
    "https://images.dog.ceo/breeds/labrador/n02099712_7415.jpg",
    "Outgoing, playful companions that often enjoy active households.",
  ],
  [
    "Dachshund",
    "Bold Personality",
    "Small",
    "Medium",
    "Varies",
    "Depends on coat",
    "Often suitable",
    "https://images.dog.ceo/breeds/dachshund/dachshund_6.jpg",
    "Curious small dogs with bold personalities and different coat types.",
  ],
  [
    "Australian Shepherd",
    "Active Partner",
    "Medium",
    "Very High",
    "Medium",
    "Regular brushing",
    "Needs activity",
    "https://images.dog.ceo/breeds/australian-shepherd/leroy.jpg",
    "Bright, energetic herding dogs needing physical and mental challenges.",
  ],
  [
    "French Bulldog",
    "City Companion",
    "Small",
    "Low-Medium",
    "Short",
    "Low maintenance",
    "Often suitable",
    "https://images.dog.ceo/breeds/bulldog-french/n02108915_100.jpg",
    "Compact companions; heat and breathing risks need special consideration.",
  ],
  [
    "Border Collie",
    "Training Champion",
    "Medium",
    "Very High",
    "Medium",
    "Regular brushing",
    "Needs activity",
    "https://images.dog.ceo/breeds/collie-border/n02106166_1008.jpg",
    "Highly intelligent dogs that need meaningful work and enrichment.",
  ],
  [
    "Pomeranian",
    "Tiny Companion",
    "Small",
    "Medium",
    "Long double coat",
    "Frequent brushing",
    "Often suitable",
    "https://images.dog.ceo/breeds/pomeranian/n02112018_1003.jpg",
    "Small, alert companions with fluffy coats and lively personalities.",
  ],
].map(
  ([
    name,
    tag,
    size,
    energy,
    coat,
    care,
    apartment,
    image,
    description,
  ]) => ({
    name,
    tag,
    size,
    energy,
    coat,
    care,
    apartment,
    image,
    description,
    about: `Learn about ${name}'s exercise, grooming, training and health needs before choosing a dog.`,
  })
);

// ========================================
// GLOBAL IMAGE CACHES
// ========================================

// Built-in profile images are reserved so another breed
// will not reuse these images through the random API.

const usedBreedImageUrls = new Set(
  PROFILES.map((profile) => profile.image).filter(Boolean)
);

// Cache resolved images by normalized breed name.
const breedImageCache = new Map();

// Cache the Dog CEO breed list.
let dogCeoBreedListPromise = null;

// Cache image lists for each Dog CEO breed endpoint.
const dogCeoImageListCache = new Map();

// ========================================
// GENERAL HELPERS
// ========================================

const pretty = (s) =>
  String(s || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const compact = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const validId = (id) => /^[a-f\d]{24}$/i.test(String(id || ""));

const profileFor = (name) =>
  PROFILES.find(
    (profile) =>
      norm(profile.name) === norm(name) ||
      (profile.name === "Corgi" && norm(name).includes("corgi"))
  );

const detailsFor = (name) =>
  profileFor(name) || {
    name: pretty(name),
    tag: "Lovely Companion",
    size: "Varies",
    energy: "Varies",
    coat: "Varies",
    care: "Regular care",

    apartment: "Depends on lifestyle",

    // Do not use the same Golden Retriever fallback for every breed.
    // Images for unknown breeds will be resolved dynamically.
    image: "",

    description: `Learn about the traits and care needs of ${pretty(
      name
    )} before deciding if this breed suits your home.`,

    about: `Research ${pretty(
      name
    )}'s exercise, grooming, training and health needs. Individual dogs can differ in temperament and care requirements.`,
  };

const money = (n) =>
  Number.isFinite(Number(n)) && Number(n) >= 0
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(n))
    : "Price to be confirmed";

// ========================================
// DOG CEO BREED LIST
// ========================================

async function getDogCeoBreedList() {
  if (!dogCeoBreedListPromise) {
    dogCeoBreedListPromise = fetch(
      `${DOG_CEO_API}/breeds/list/all`
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load the dog breed list.");
        }

        const data = await response.json();

        if (
          data.status !== "success" ||
          !data.message ||
          typeof data.message !== "object"
        ) {
          throw new Error("Invalid Dog CEO API response.");
        }

        return data.message;
      })
      .catch((error) => {
        // Permit another attempt if the service temporarily fails.
        dogCeoBreedListPromise = null;
        throw error;
      });
  }

  return dogCeoBreedListPromise;
}

// ========================================
// MATCH CATALOGUE NAMES TO DOG CEO BREEDS
// ========================================

function findDogCeoBreedPath(breedName, breedMap) {
  const target = compact(breedName);

  if (!target) {
    return "";
  }

  // Common alternate names.
  const aliases = {
    siberianhusky: "husky",
    shibainu: "shiba",
    akitainu: "akita",
    pembrokewelshcorgi: "corgi/pembroke",
    cardigancorgi: "corgi/cardigan",
    goldenretriever: "retriever/golden",
    labradorretriever: "retriever/labrador",
    bordercollie: "collie/border",
    frenchbulldog: "bulldog/french",
    englishbulldog: "bulldog/english",
   australianshepherd: "australian/shepherd",
  };

  const aliasPath = aliases[target];

  if (aliasPath) {
    const parts = aliasPath.split("/");

    if (
      breedMap[parts[0]] &&
      (parts.length === 1 ||
        breedMap[parts[0]].includes(parts[1]))
    ) {
      return aliasPath;
    }
  }

  // Match exact combinations such as:
  // Golden Retriever -> retriever/golden
  // Labrador Retriever -> retriever/labrador
  // French Bulldog -> bulldog/french
  // Border Collie -> collie/border

  for (const [mainBreed, subBreeds] of Object.entries(breedMap)) {
    for (const subBreed of subBreeds || []) {
      const combination1 = compact(`${subBreed} ${mainBreed}`);
      const combination2 = compact(`${mainBreed} ${subBreed}`);

      if (
        target === combination1 ||
        target === combination2
      ) {
        return `${mainBreed}/${subBreed}`;
      }
    }
  }

  // Exact main-breed match.
  for (const mainBreed of Object.keys(breedMap)) {
    if (compact(mainBreed) === target) {
      return mainBreed;
    }
  }

  // No exact API match. The resolver will try a unique general
  // dog photo instead of falsely labelling a different breed.
  return "";
}

// ========================================
// FETCH AND CACHE AN IMAGE LIST
// ========================================

async function getDogCeoImageList(breedPath) {
  if (!breedPath) {
    return [];
  }

  if (!dogCeoImageListCache.has(breedPath)) {
    const request = fetch(
      `${DOG_CEO_API}/breed/${breedPath}/images`
    )
      .then(async (response) => {
        if (!response.ok) {
          return [];
        }

        const data = await response.json();

        if (
          data.status === "success" &&
          Array.isArray(data.message)
        ) {
          return data.message.filter(
            (url) => typeof url === "string" && url
          );
        }

        return [];
      })
      .catch((error) => {
        console.error(
          `Failed to load images for ${breedPath}:`,
          error
        );

        return [];
      });

    dogCeoImageListCache.set(breedPath, request);
  }

  return dogCeoImageListCache.get(breedPath);
}

// ========================================
// SELECT AN UNUSED IMAGE
// ========================================

function selectUnusedImage(imageUrls) {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return "";
  }

  // Start at a random image, then check the other images
  // until we find one that another displayed breed is not using.
  const start = Math.floor(Math.random() * imageUrls.length);

  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl =
      imageUrls[(start + i) % imageUrls.length];

    if (!usedBreedImageUrls.has(imageUrl)) {
      usedBreedImageUrls.add(imageUrl);
      return imageUrl;
    }
  }

  return "";
}

// ========================================
// FETCH A UNIQUE GENERAL DOG PHOTO
// Used when the requested breed is unsupported by Dog CEO.
// ========================================

async function fetchUniqueGeneralDogImage() {
  // First try getting a batch of images.
  try {
    const response = await fetch(
      `${DOG_CEO_API}/breeds/image/random/20`
    );

    if (response.ok) {
      const data = await response.json();

      if (
        data.status === "success" &&
        Array.isArray(data.message)
      ) {
        const selected = selectUnusedImage(data.message);

        if (selected) {
          return selected;
        }
      } else if (
        data.status === "success" &&
        typeof data.message === "string" &&
        !usedBreedImageUrls.has(data.message)
      ) {
        usedBreedImageUrls.add(data.message);
        return data.message;
      }
    }
  } catch (error) {
    console.error("Unable to fetch general dog images:", error);
  }

  // Try a single random image several times.
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      const response = await fetch(
        `${DOG_CEO_API}/breeds/image/random`
      );

      if (!response.ok) {
        break;
      }

      const data = await response.json();

      const imageUrl =
        data.status === "success" &&
        typeof data.message === "string"
          ? data.message
          : "";

      if (
        imageUrl &&
        !usedBreedImageUrls.has(imageUrl)
      ) {
        usedBreedImageUrls.add(imageUrl);
        return imageUrl;
      }
    } catch (error) {
      console.error(
        "General dog image request failed:",
        error
      );

      break;
    }
  }

  return "";
}

// ========================================
// RESOLVE IMAGE FOR A SPECIFIC BREED
// ========================================

async function resolveBreedImage(breedName) {
  const cacheKey = compact(breedName);

  if (!cacheKey) {
    return "";
  }

  // Reuse the result if this breed was already resolved.
  if (breedImageCache.has(cacheKey)) {
    return breedImageCache.get(cacheKey);
  }

  // Store the promise immediately, preventing duplicate requests
  // when multiple components ask for the same breed.
  const request = (async () => {
    try {
      const breedMap = await getDogCeoBreedList();

      const breedPath = findDogCeoBreedPath(
        breedName,
        breedMap
      );

      // First try an image from the actual matching breed endpoint.
      if (breedPath) {
        const breedImages =
          await getDogCeoImageList(breedPath);

        const matchingImage =
          selectUnusedImage(breedImages);

        if (matchingImage) {
          return matchingImage;
        }
      }

      // Unsupported breed or no unused breed-specific images:
      // try a unique general dog image rather than recycling
      // the Golden Retriever fallback.
      return await fetchUniqueGeneralDogImage();
    } catch (error) {
      console.error(
        `Unable to resolve an image for ${breedName}:`,
        error
      );

      return "";
    }
  })();

  breedImageCache.set(cacheKey, request);

  return request;
}

// ========================================
// BREED IMAGE COMPONENT
// ========================================

function BreedCardImage({ breedName, initialImage = "" }) {
  const [imageUrl, setImageUrl] = useState(
    initialImage || ""
  );

  useEffect(() => {
    let cancelled = false;

    if (initialImage) {
      setImageUrl(initialImage);

      return () => {
        cancelled = true;
      };
    }

    setImageUrl("");

    resolveBreedImage(breedName).then((url) => {
      if (!cancelled && url) {
        setImageUrl(url);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [breedName, initialImage]);

  if (!imageUrl) {
    return (
      <div
        className="pb-breed-image-placeholder"
        aria-label={`Loading image for ${breedName}`}
        role="img"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #f6efe4, #e8ddcd)",
          color: "#927b5b",
        }}
      >
        <PawPrint size={42} />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={breedName}
      loading="lazy"
      onError={() => {
        // Do not replace every failed breed image with the same photo.
        setImageUrl("");
      }}
    />
  );
}

// ========================================
// FETCH ALL BREED CATALOGUE RECORDS
// ========================================

async function fetchAllBreeds() {
  let page = 1;
  let pages = 1;

  const all = [];

  do {
    const url = new URL(`${API}/breeds/catalog`);

    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", "50");

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Breed API returned HTTP ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.breeds)) {
      throw new Error("Unexpected breed API response");
    }

    pages = Math.max(1, Number(data.pages) || 1);

    all.push(...data.breeds);

    page++;
  } while (page <= pages);

  // Count repeated image URLs in MongoDB.
  const imageCounts = new Map();

  for (const item of all) {
    const image =
      typeof item.image === "string"
        ? item.image.trim()
        : "";

    if (image) {
      const key = image.toLowerCase();

      imageCounts.set(
        key,
        (imageCounts.get(key) || 0) + 1
      );
    }
  }

  // Remove duplicate breed records.
  const uniqueBreeds = [
    ...new Map(
      all
        .filter((item) => item.name || item.breed)
        .map((item) => [
          norm(item.name || item.breed),
          item,
        ])
    ).values(),
  ];

  return uniqueBreeds
    .map((item) => {
      const name = pretty(item.name || item.breed);

      const details = detailsFor(name);
      const profile = profileFor(name);

      const rawImage =
        typeof item.image === "string"
          ? item.image.trim()
          : "";

      const isRepeatedDatabaseImage =
        rawImage &&
        (imageCounts.get(rawImage.toLowerCase()) || 0) > 1;

      let image = "";

      // Use the dedicated profile image when one exists.
      if (profile?.image) {
        image = profile.image;
      } else if (
        rawImage &&
        !isRepeatedDatabaseImage &&
        !usedBreedImageUrls.has(rawImage)
      ) {
        // Preserve an existing unique MongoDB image.
        image = rawImage;
        usedBreedImageUrls.add(rawImage);
      }

      return {
        ...details,
        ...item,

        name,

        // Use the real MongoDB ID for checkout.
        _id: item._id,

        // Preserve the MongoDB price.
        price: Number(item.price),

        // Leave blank when an image must be resolved dynamically.
        image,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ========================================
// FETCH INDIVIDUAL PET LISTINGS
// ========================================

async function fetchPets() {
  const configured =
    import.meta.env.VITE_PET_LISTINGS_ENDPOINT || "/pets";

  const endpoint = configured.startsWith("http")
    ? configured
    : `${API}${
        configured.startsWith("/")
          ? configured
          : `/${configured}`
      }`;

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Pet listings API returned HTTP ${response.status}`
    );
  }

  const data = await response.json();

  const list = Array.isArray(data)
    ? data
    : data?.pets ||
      data?.listings ||
      data?.data?.pets ||
      data?.data?.listings ||
      data?.data ||
      [];

  if (!Array.isArray(list)) {
    throw new Error("Unexpected pet listings response");
  }

  return list.map((p) => {
    const id = p._id || p.id || p.petId;

    return {
      ...p,

      _id: validId(id) ? String(id) : undefined,

      name: p.name || p.petName || "Pet",

      breed: pretty(p.breed || p.breedName || "Mixed breed"),

      price: Number(p.price),

      image:
        p.image ||
        p.imageUrl ||
        p.photos?.[0] ||
        "",

      age: p.age || "Not specified",

      gender: p.gender || "Not specified",

      location:
        p.location ||
        p.city ||
        "Location not specified",

      status: norm(p.status || p.listingStatus || "available"),
    };
  });
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function DogBreeds() {
  const navigate = useNavigate();

  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [pets, setPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState("");

  const [search, setSearch] = useState("");
  const [size, setSize] = useState("All");
  const [energy, setEnergy] = useState("All");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("pawMartFavorites") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState(null);

  const [target, setTarget] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  const [notice, setNotice] = useState("");

  // ========================================
  // LOAD BREED CATALOGUE
  // ========================================

  useEffect(() => {
    let live = true;

    (async () => {
      try {
        const list = await fetchAllBreeds();

        if (live) {
          setBreeds(list);
        }
      } catch (error) {
        if (live) {
          setLoadError(error.message);

          // Built-in profiles are visual fallbacks only.
          // They do not have MongoDB IDs, so Buy Now
          // will not treat them as real catalogue products.
          setBreeds(
            PROFILES.map((profile) => ({
              ...profile,
              demo: true,
              listingStatus: "demo",
            }))
          );
        }
      } finally {
        if (live) {
          setLoading(false);
        }
      }
    })();

    return () => {
      live = false;
    };
  }, []);

  // ========================================
  // LOAD INDIVIDUAL PET LISTINGS
  // ========================================

  useEffect(() => {
    let live = true;

    (async () => {
      try {
        const list = await fetchPets();

        if (live) {
          const valid = list.filter(
            (pet) =>
              validId(pet._id) &&
              Number.isFinite(pet.price) &&
              pet.price >= 0
          );

          setPets(valid);

          if (list.length && !valid.length) {
            setPetsError(
              "No listings with valid IDs and prices were returned."
            );
          }
        }
      } catch (error) {
        if (live) {
          setPetsError(error.message);
        }
      } finally {
        if (live) {
          setPetsLoading(false);
        }
      }
    })();

    return () => {
      live = false;
    };
  }, []);

  // ========================================
  // SAVE FAVOURITES
  // ========================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "pawMartFavorites",
        JSON.stringify(favorites)
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, [favorites]);

  // ========================================
  // RESET PAGINATION ON FILTER CHANGE
  // ========================================

  useEffect(() => {
    setPage(1);
  }, [search, size, energy, sort, favoritesOnly]);

  // ========================================
  // FILTER AND SORT BREEDS
  // ========================================

  const filtered = useMemo(
    () =>
      breeds
        .filter((breed) => {
          const query = norm(search);

          const text = [
            breed.name,
            breed.description,
            breed.tag,
            breed.size,
            breed.energy,
            breed.coat,
          ].some((value) => norm(value).includes(query));

          return (
            (!query || text) &&
            (size === "All" ||
              norm(breed.size).includes(norm(size))) &&
            (energy === "All" ||
              norm(breed.energy).includes(norm(energy))) &&
            (!favoritesOnly ||
              favorites.includes(norm(breed.name)))
          );
        })
        .sort((a, b) =>
          sort === "size"
            ? String(a.size).localeCompare(String(b.size))
            : sort === "energy"
              ? String(a.energy).localeCompare(String(b.energy))
              : a.name.localeCompare(b.name)
        ),
    [breeds, search, size, energy, sort, favoritesOnly, favorites]
  );

  const pages = Math.max(
    1,
    Math.ceil(filtered.length / PER_PAGE)
  );

  const safePage = Math.min(page, pages);

  const shown = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  );

  // ========================================
  // TOGGLE FAVOURITE
  // ========================================

  const toggleFavorite = (breed) => {
    setFavorites((old) =>
      old.includes(norm(breed.name))
        ? old.filter((name) => name !== norm(breed.name))
        : [...old, norm(breed.name)]
    );
  };

  // ========================================
  // RESET FILTERS
  // ========================================

  const reset = () => {
    setSearch("");
    setSize("All");
    setEnergy("All");
    setSort("name");
    setFavoritesOnly(false);
  };

  // ========================================
  // BUY BREED CATALOGUE PRODUCT
  // ========================================

  const buyBreed = (breed) => {
    if (!validId(breed?._id)) {
      setNotice(
        "This breed does not have a valid MongoDB ID. Please check the catalogue API."
      );
      return;
    }

    if (
      !Number.isFinite(Number(breed.price)) ||
      Number(breed.price) < 1
    ) {
      setNotice(
        "This breed does not have a valid price. Please update its price in MongoDB."
      );
      return;
    }

    setNotice("");

    navigate("/payment", {
      state: {
        productType: "Breed",

        catalogBreedId: breed._id,

        pet: {
          _id: breed._id,
          name: breed.name || breed.breed,
          breed: breed.breed || breed.name,
          image: breed.image || "",
          price: Number(breed.price),
          productType: "Breed",
        },
      },
    });
  };

  // ========================================
  // OPEN INDIVIDUAL PET
  // ========================================

  const openPet = (pet) => {
    if (
      !validId(pet._id) ||
      !Number.isFinite(Number(pet.price))
    ) {
      setNotice(
        "This listing has an invalid ID or price; checkout is unavailable."
      );
      return;
    }

    setNotice("");
    setFormError("");

    setTarget({
      type: "pet",
      ...pet,
    });
  };

  // ========================================
  // OPEN BREED INQUIRY
  // ========================================

  const openInquiry = (breed) => {
    setSelected(null);
    setFormError("");

    setTarget({
      type: "breed",
      name: breed.name,
      image: breed.image || "",
    });
  };

  // ========================================
  // SUBMIT INDIVIDUAL PET CONTACT FORM
  // ========================================

  const submit = (event) => {
    event.preventDefault();

    setFormError("");

    if (customerName.trim().length < 2) {
      return setFormError("Enter your full name.");
    }

    if (!/^[+]?[\d\s()-]{8,20}$/.test(phone.trim())) {
      return setFormError("Enter a valid phone number.");
    }

    if (target?.type === "breed") {
      return setFormError(
        "This is a breed catalogue inquiry. Use Buy Now on a breed card to purchase a catalogue product."
      );
    }

    if (
      !target ||
      !validId(target._id) ||
      !Number.isFinite(Number(target.price))
    ) {
      return setFormError(
        "This listing is missing a valid ID or price."
      );
    }

    navigate("/payment", {
      state: {
        productType: "PetListing",

        pet: {
          ...target,
          _id: target._id,
          price: Number(target.price),
          productType: "PetListing",
        },

        petId: target._id,

        customer: {
          name: customerName.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
        },
      },
    });
  };

  const closeForm = () => {
    setTarget(null);
    setFormError("");
  };

  // ========================================
  // RENDER PAGE
  // ========================================

  return (
    <main className="pb-breeds-page">
      {/* HEADER */}

      <header className="pb-header">
        <a className="pb-brand" href="/">
          <span className="pb-mark">
            <PawPrint size={29} />
          </span>

          <span>
            <strong>
              Paw<span>Mart</span>
            </strong>
            <small>FIND YOUR FOREVER FRIEND</small>
          </span>
        </a>

        <nav className="pb-nav">
          <a href="/">Home</a>

          <a className="active" href="#breed-explorer">
            Dog Breeds
          </a>

          <a href="#individual-pets">Available Pets</a>

          <a href="#responsible-care">Responsible Care</a>
        </nav>

        <button
          className="pb-favnav"
          onClick={() => {
            setFavoritesOnly(true);

            document
              .getElementById("breed-explorer")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Heart size={15} />
          Favorites
          <b>{favorites.length}</b>
        </button>
      </header>

      {/* HERO */}

      <section className="pb-breeds-hero">
        <div className="pb-breeds-hero-content">
          <div className="pb-eyebrow">
            <Sparkles size={15} />
            FIND YOUR PERFECT COMPANION
          </div>

          <h1>
            Every dog has a story. <span>Find yours.</span>
          </h1>

          <p>
            Explore the PawMart breed catalogue, compare care needs,
            and learn what kind of companion may fit your lifestyle.
          </p>

          <a
            className="pb-primary-button"
            href="#breed-explorer"
          >
            Explore dog breeds <ArrowRight size={16} />
          </a>
        </div>

        <div className="pb-breeds-hero-image">
          <img
            src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=85"
            alt="Golden retriever outdoors"
            onError={(event) => {
              event.currentTarget.src = FALLBACK;
            }}
          />

          <div className="pb-hero-image-badge">
            <PawPrint size={25} />

            <div>
              <strong>A thoughtful match starts here</strong>
              <span>Learn first. Choose responsibly.</span>
            </div>
          </div>
        </div>
      </section>

      {/* NOTICE */}

      {notice && (
        <div
          className="pb-booking-alert pb-booking-error"
          role="status"
        >
          <Info size={18} />

          <span>{notice}</span>

          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* BREED EXPLORER */}

      <section
        className="pb-breed-explorer"
        id="breed-explorer"
      >
        <div className="pb-section-heading">
          <div>
            <div className="pb-eyebrow">
              <PawPrint size={14} />
              THE BREED LIBRARY
            </div>

            <h2>
              Meet the <span>breeds</span>
            </h2>

            <p>
              Search and filter the catalogue to explore size,
              energy, coat, and general care needs.
            </p>
          </div>

          <div className="pb-breed-count">
            <strong>{filtered.length}</strong>
            <span>breeds in results</span>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}

        <div className="pb-breed-toolbar">
          <div className="pb-search-box">
            <Search size={17} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search dog breeds..."
              aria-label="Search breeds"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <label className="pb-filter-control">
            <Ruler size={15} />
            <span>Size</span>

            <select
              value={size}
              onChange={(event) => setSize(event.target.value)}
            >
              <option>All</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </label>

          <label className="pb-filter-control">
            <Zap size={15} />
            <span>Energy</span>

            <select
              value={energy}
              onChange={(event) => setEnergy(event.target.value)}
            >
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Very High</option>
            </select>
          </label>

          <label className="pb-filter-control">
            <SlidersHorizontal size={15} />
            <span>Sort</span>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="energy">Energy</option>
            </select>
          </label>

          <button
            className={`pb-favorites-filter ${
              favoritesOnly ? "active" : ""
            }`}
            onClick={() => setFavoritesOnly((value) => !value)}
          >
            <Heart size={15} />
            Favorites
          </button>

          <button
            className="pb-reset-button"
            onClick={reset}
            title="Reset filters"
            aria-label="Reset filters"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {loadError && (
          <div className="pb-inline-notice">
            Could not load the server catalogue: {loadError}.
            Showing 12 built-in sample profiles instead. Sample
            profiles cannot be purchased until the MongoDB catalogue
            loads successfully.
          </div>
        )}

        {loading ? (
          <div className="pb-loading-state">
            <div className="pb-loading-spinner" />
            <p>Loading all catalogue pages…</p>
          </div>
        ) : shown.length ? (
          <>
            <div className="pb-breed-grid">
              {shown.map((breed) => {
                const details = detailsFor(breed.name);

                const image = breed.image || "";

                const isFav = favorites.includes(
                  norm(breed.name)
                );

                const priceIsValid =
                  Number.isFinite(Number(breed.price)) &&
                  Number(breed.price) >= 1;

                return (
                  <article
                    className="pb-breed-card"
                    key={
                      breed._id ||
                      breed.breedId ||
                      norm(breed.name)
                    }
                  >
                    <div className="pb-breed-card-image">
                      <BreedCardImage
                        breedName={breed.name}
                        initialImage={image}
                      />

                      <span className="pb-breed-tag">
                        {breed.tag || details.tag}
                      </span>

                      <button
                        className={`pb-favorite-button ${
                          isFav ? "is-favorite" : ""
                        }`}
                        onClick={() => toggleFavorite(breed)}
                        aria-label={
                          isFav
                            ? "Remove favorite"
                            : "Add favorite"
                        }
                      >
                        <Heart
                          size={17}
                          fill={
                            isFav ? "currentColor" : "none"
                          }
                        />
                      </button>
                    </div>

                    <div className="pb-breed-card-content">
                      <h3>{breed.name}</h3>

                      <p>
                        {breed.description || details.description}
                      </p>

                      <div className="pb-breed-quick-facts">
                        <span>
                          <Ruler size={13} />
                          {breed.size || details.size}
                        </span>

                        <span>
                          <Zap size={13} />
                          {breed.energy || details.energy}
                        </span>
                      </div>

                      {/* BREED PRICE */}

                      <div className="pb-breed-price-row">
                        <span>Catalogue price</span>

                        <strong className="pb-pet-price">
                          {money(breed.price)}
                        </strong>
                      </div>

                      {/* BREED ACTIONS */}

                      <div className="pb-breed-card-actions">
                        <button
                          className="pb-breed-details-button"
                          onClick={() =>
                            setSelected({
                              ...details,
                              ...breed,
                              image,
                            })
                          }
                        >
                          Explore breed <ArrowRight size={15} />
                        </button>

                        <button
                          className="pb-breed-details-button pb-breed-buy-button"
                          onClick={() => buyBreed(breed)}
                          disabled={
                            !validId(breed._id) ||
                            !priceIsValid
                          }
                          title={
                            !validId(breed._id)
                              ? "This breed is not connected to MongoDB"
                              : !priceIsValid
                                ? "This breed needs a valid MongoDB price"
                                : "Continue to checkout"
                          }
                        >
                          Buy Now <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* PAGINATION */}

            <div className="pb-pagination">
              <button
                disabled={safePage <= 1}
                onClick={() => {
                  setPage((value) => Math.max(1, value - 1));

                  document
                    .getElementById("breed-explorer")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span>
                Page {safePage} of {pages}
              </span>

              <button
                disabled={safePage >= pages}
                onClick={() => {
                  setPage((value) =>
                    Math.min(pages, value + 1)
                  );

                  document
                    .getElementById("breed-explorer")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>

            <p className="pb-pagination-summary">
              Showing {(safePage - 1) * PER_PAGE + 1}–
              {Math.min(
                safePage * PER_PAGE,
                filtered.length
              )}{" "}
              of {filtered.length} breeds
            </p>
          </>
        ) : (
          <div className="pb-empty-state">
            <PawPrint size={35} />

            <h3>No breeds found</h3>

            <p>Try another search or reset the filters.</p>

            <button
              className="pb-primary-button"
              onClick={reset}
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* INDIVIDUAL PET LISTINGS */}

      <section
        className="pb-pet-market"
        id="individual-pets"
      >
        <div className="pb-section-heading">
          <div>
            <div className="pb-eyebrow">
              <PawPrint size={14} />
              INDIVIDUAL LISTINGS
            </div>

            <h2>
              Pets looking for a <span>home</span>
            </h2>

            <p>
              Individual pet listings use their own listing IDs
              and prices.
            </p>
          </div>

          <div className="pb-breed-count">
            <strong>{pets.length}</strong>
            <span>valid listings</span>
          </div>
        </div>

        <div className="pb-demo-disclaimer">
          <ShieldCheck size={19} />

          <p>
            <strong>Responsible ownership:</strong> breed catalogue
            entries are not verified individual dogs. Verify any
            individual pet, seller, health information and listing
            availability before a transaction.
          </p>
        </div>

        {petsLoading ? (
          <div className="pb-loading-state">
            <div className="pb-loading-spinner" />
            <p>Loading individual listings…</p>
          </div>
        ) : petsError ? (
          <div className="pb-inline-notice">{petsError}</div>
        ) : !pets.length ? (
          <div className="pb-empty-state">
            <Dog size={35} />

            <h3>No individual listings yet</h3>

            <p>
              Individual pet listings will appear here when available.
            </p>
          </div>
        ) : (
          <div className="pb-pet-grid">
            {pets
              .filter(
                (pet) =>
                  ![
                    "sold",
                    "unavailable",
                    "inactive",
                  ].includes(pet.status)
              )
              .map((pet) => (
                <article
                  className="pb-pet-card"
                  key={pet._id}
                >
                  <div className="pb-pet-card-image">
                    {pet.image ? (
                      <img
                        src={pet.image}
                        alt={pet.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.visibility =
                            "hidden";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          minHeight: "180px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f4eee5",
                          color: "#927b5b",
                        }}
                      >
                        <PawPrint size={38} />
                      </div>
                    )}

                    <span className="pb-pet-listing-label">
                      Individual listing
                    </span>
                  </div>

                  <div className="pb-pet-card-content">
                    <div className="pb-pet-title-row">
                      <div>
                        <h3>{pet.name}</h3>
                        <p>{pet.breed}</p>
                      </div>

                      <strong className="pb-pet-price">
                        {money(pet.price)}
                      </strong>
                    </div>

                    <div className="pb-pet-details">
                      <span>Age: {pet.age}</span>
                      <span>{pet.gender}</span>
                    </div>

                    <p className="pb-pet-location">
                      <MapPin size={13} />
                      {pet.location}
                    </p>

                    <button
                      className="pb-primary-button pb-pet-book-button"
                      onClick={() => openPet(pet)}
                    >
                      Continue <ArrowRight size={15} />
                    </button>
                  </div>
                </article>
              ))}
          </div>
        )}
      </section>

      {/* RESPONSIBLE CARE */}

      <section
        className="pb-promise"
        id="responsible-care"
      >
        <div className="pb-promise-copy">
          <div className="pb-eyebrow">
            <ShieldCheck size={15} />
            A LIFETIME COMMITMENT
          </div>

          <h2>
            Choose with care. <em>Love for life.</em>
          </h2>

          <p>
            Every breed has individual needs, and every dog is an
            individual. Consider your time, space, budget, activity
            level and ability to provide veterinary care before
            bringing a companion home.
          </p>

          <ul>
            <li>
              <CheckCircle2 size={16} />
              Research breed health and care needs.
            </li>

            <li>
              <CheckCircle2 size={16} />
              Meet and verify the individual dog and seller.
            </li>

            <li>
              <CheckCircle2 size={16} />
              Plan for training, exercise, grooming and vet care.
            </li>
          </ul>
        </div>

        <div className="pb-promise-art">
          <img
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=85"
            alt="A dog looking at the camera"
            onError={(event) => {
              event.currentTarget.src = FALLBACK;
            }}
          />

          <div>
            <ShieldCheck size={23} />

            <span>
              <strong>Responsible choices matter</strong>
              <small>A safe, caring home comes first.</small>
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="pb-footer">
        <a className="pb-brand" href="/">
          <span className="pb-mark">
            <PawPrint size={25} />
          </span>

          <span>
            <strong>
              Paw<span>Mart</span>
            </strong>
            <small>FIND YOUR FOREVER FRIEND</small>
          </span>
        </a>

        <p>Learn about breeds. Choose responsibly. Care for life.</p>

        <span>© {new Date().getFullYear()} PawMart</span>
      </footer>

      {/* BREED DETAILS MODAL */}

      {selected && (
        <div
          className="pb-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <section
            className="pb-breed-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="breed-modal-title"
          >
            <button
              className="pb-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X size={19} />
            </button>

            <div className="pb-breed-modal-image">
              <BreedCardImage
                breedName={selected.name}
                initialImage={selected.image || ""}
              />
            </div>

            <div className="pb-breed-modal-content">
              <div className="pb-eyebrow">
                <PawPrint size={14} />
                BREED PROFILE
              </div>

              <h2 id="breed-modal-title">
                {selected.name}
              </h2>

              <p className="pb-modal-description">
                {selected.about || selected.description}
              </p>

              <div className="pb-breed-fact-grid">
                <div>
                  <Ruler size={18} />
                  <span>Typical size</span>
                  <strong>{selected.size}</strong>
                </div>

                <div>
                  <Zap size={18} />
                  <span>Energy level</span>
                  <strong>{selected.energy}</strong>
                </div>

                <div>
                  <Scissors size={18} />
                  <span>Coat</span>
                  <strong>{selected.coat}</strong>
                </div>

                <div>
                  <House size={18} />
                  <span>Living fit</span>
                  <strong>{selected.apartment}</strong>
                </div>
              </div>

              <div className="pb-breed-care-note">
                <ShieldCheck size={19} />

                <div>
                  <strong>Care reminder</strong>

                  <p>
                    {selected.care}. Ask a qualified veterinarian
                    about individual health needs.
                  </p>
                </div>
              </div>

              <button
                className="pb-primary-button pb-modal-book-button"
                onClick={() => openInquiry(selected)}
              >
                Ask about this breed <ArrowRight size={16} />
              </button>

              <p className="pb-modal-footnote">
                This profile provides breed information and is not
                a verified individual dog listing.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* CONTACT / INQUIRY MODAL */}

      {target && (
        <div
          className="pb-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <section
            className="pb-booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
          >
            <button
              className="pb-modal-close"
              onClick={closeForm}
              aria-label="Close"
            >
              <X size={19} />
            </button>

            <div className="pb-booking-modal-heading">
              <div className="pb-eyebrow">
                <PawPrint size={14} />
                PAWMART CONTACT FORM
              </div>

              <h2 id="booking-title">
                {target.type === "pet"
                  ? "Continue with this pet"
                  : `Ask about ${target.name}`}
              </h2>

              <p>
                {target.type === "pet"
                  ? "Enter your details to continue to the payment step."
                  : "Send an inquiry. This does not reserve a dog or initiate payment."}
              </p>
            </div>

            <div className="pb-booking-summary">
              {target.image ? (
                <img
                  src={target.image}
                  alt={target.name}
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f4eee5",
                    color: "#927b5b",
                    borderRadius: "10px",
                  }}
                >
                  <PawPrint size={25} />
                </div>
              )}

              <div>
                <strong>{target.name}</strong>

                <span>
                  {target.type === "pet"
                    ? target.breed
                    : "Breed catalogue inquiry"}
                </span>

                {target.type === "pet" && (
                  <strong className="pb-booking-summary-price">
                    {money(target.price)}
                  </strong>
                )}
              </div>
            </div>

            <form
              className="pb-booking-form"
              onSubmit={submit}
            >
              <label>
                Full name <span>*</span>

                <input
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  autoComplete="name"
                  minLength={2}
                  required
                  placeholder="Enter your full name"
                />
              </label>

              <label>
                Phone number <span>*</span>

                <input
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  autoComplete="tel"
                  required
                  placeholder="Enter your phone number"
                />
              </label>

              <label>
                Message or notes

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  rows={3}
                  placeholder="Optional"
                />
              </label>

              {formError && (
                <div
                  className="pb-booking-alert pb-booking-error"
                  role="alert"
                >
                  <Info size={17} />
                  {formError}
                </div>
              )}

              <button
                className="pb-primary-button pb-submit-booking"
                type="submit"
              >
                {target.type === "pet"
                  ? "Continue to payment"
                  : "Submit inquiry"}

                <ArrowRight size={16} />
              </button>

              <p className="pb-booking-privacy-note">
                Never share passwords or banking PINs. Verify seller
                and listing details before paying.
              </p>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}