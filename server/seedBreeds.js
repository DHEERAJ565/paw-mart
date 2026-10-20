const mongoose = require("mongoose");
require("dotenv").config();

const Breed = require("./models/Breed");

const breeds = [
  {
    name: "Golden Retriever",
    slug: "golden-retriever",
    description: "Friendly, intelligent, and affectionate family companion.",
    about: "Golden Retrievers are sociable dogs that generally enjoy training, play, and spending time with their families.",
    size: "Large",
    energy: "High",
    coat: "Long",
    care: "Regular brushing and exercise",
    apartment: false,
    image: "https://images.dog.ceo/breeds/retriever-golden/n02099601_100.jpg",
    tag: "Family Favorite",
    featured: true,
  },
  {
    name: "Siberian Husky",
    slug: "siberian-husky",
    description: "Energetic, independent, and adventurous.",
    about: "Siberian Huskies are active dogs that need substantial exercise and secure spaces.",
    size: "Large",
    energy: "High",
    coat: "Thick double coat",
    care: "Frequent brushing and daily exercise",
    apartment: false,
    image: "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg",
    tag: "Adventure Buddy",
    featured: true,
  },
  {
    name: "Poodle",
    slug: "poodle",
    description: "Intelligent, trainable, and elegant.",
    about: "Poodles are intelligent dogs that benefit from mental stimulation, training, and regular coat care.",
    size: "Medium",
    energy: "High",
    coat: "Curly",
    care: "Regular professional grooming",
    apartment: true,
    image: "https://images.dog.ceo/breeds/poodle-standard/n02113799_2280.jpg",
    tag: "Smart Companion",
    featured: true,
  },
  {
    name: "Beagle",
    slug: "beagle",
    description: "Curious, cheerful, and scent-driven.",
    about: "Beagles are sociable hounds with a strong sense of smell. They benefit from regular activity and supervised exploration.",
    size: "Small",
    energy: "High",
    coat: "Short",
    care: "Weekly brushing and daily walks",
    apartment: true,
    image: "https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg",
    tag: "Curious Explorer",
    featured: true,
  },
  {
    name: "German Shepherd",
    slug: "german-shepherd",
    description: "Loyal, capable, and highly trainable.",
    about: "German Shepherds are intelligent working dogs that need consistent training, exercise, and socialization.",
    size: "Large",
    energy: "High",
    coat: "Double coat",
    care: "Regular brushing and structured exercise",
    apartment: false,
    image: "https://images.dog.ceo/breeds/germanshepherd/n02106662_100.jpg",
    tag: "Loyal Guardian",
    featured: true,
  },
  {
    name: "Corgi",
    slug: "corgi",
    description: "Confident, playful, and full of personality.",
    about: "Corgis are active herding dogs with short legs and strong personalities. They benefit from training and daily activity.",
    size: "Small",
    energy: "High",
    coat: "Double coat",
    care: "Regular brushing and exercise",
    apartment: true,
    image: "https://images.dog.ceo/breeds/corgi-cardigan/n02113186_1000.jpg",
    tag: "Little Dynamo",
    featured: true,
  },
  {
    name: "Labrador Retriever",
    slug: "labrador-retriever",
    description: "Outgoing, affectionate, and enthusiastic.",
    about: "Labrador Retrievers are popular companions that often enjoy play, swimming, training, and family activities.",
    size: "Large",
    energy: "High",
    coat: "Short",
    care: "Weekly brushing and daily exercise",
    apartment: false,
    image: "https://images.dog.ceo/breeds/labrador/n02099712_100.jpg",
    tag: "Playful Companion",
    featured: true,
  },
  {
    name: "Dachshund",
    slug: "dachshund",
    description: "Curious, bold, and unmistakable.",
    about: "Dachshunds are small scent hounds with long bodies. Care should include protecting their backs from repeated jumping.",
    size: "Small",
    energy: "Moderate",
    coat: "Short",
    care: "Regular activity and back-conscious handling",
    apartment: true,
    image: "https://images.dog.ceo/breeds/dachshund/dachshund_9.jpg",
    tag: "Tiny Adventurer",
    featured: false,
  },
  {
    name: "Australian Shepherd",
    slug: "australian-shepherd",
    description: "Athletic, clever, and eager to work.",
    about: "Australian Shepherds are energetic herding dogs that benefit from training and plenty of physical and mental activity.",
    size: "Medium",
    energy: "High",
    coat: "Medium double coat",
    care: "Regular brushing and enrichment",
    apartment: false,
    image: "https://images.dog.ceo/breeds/australian-shepherd/forest.jpg",
    tag: "Active Partner",
    featured: false,
  },
  {
    name: "French Bulldog",
    slug: "french-bulldog",
    description: "Compact, affectionate, and playful.",
    about: "French Bulldogs often enjoy companionship and moderate activity. Because of their flat faces, heat and strenuous exercise require particular care.",
    size: "Small",
    energy: "Moderate",
    coat: "Short",
    care: "Routine skin-fold care and heat precautions",
    apartment: true,
    image: "https://images.dog.ceo/breeds/bulldog-french/n02108915_100.jpg",
    tag: "City Companion",
    featured: true,
  },
  {
    name: "Border Collie",
    slug: "border-collie",
    description: "Exceptionally attentive and energetic.",
    about: "Border Collies are working dogs that typically need extensive exercise, training, and mental challenges.",
    size: "Medium",
    energy: "High",
    coat: "Medium",
    care: "Regular brushing and substantial enrichment",
    apartment: false,
    image: "https://images.dog.ceo/breeds/collie-border/n02106166_100.jpg",
    tag: "Brainy Athlete",
    featured: false,
  },
  {
    name: "Pomeranian",
    slug: "pomeranian",
    description: "Small, lively, and confident.",
    about: "Pomeranians are small companion dogs with abundant coats that need regular grooming.",
    size: "Small",
    energy: "Moderate",
    coat: "Long double coat",
    care: "Frequent brushing and routine dental care",
    apartment: true,
    image: "https://images.dog.ceo/breeds/pomeranian/n02112018_100.jpg",
    tag: "Pocket Companion",
    featured: false,
  },
];

async function seedBreeds() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB.");

    for (const breed of breeds) {
      await Breed.findOneAndUpdate(
        { slug: breed.slug },
        { $set: breed },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );
    }

    console.log(`Successfully seeded ${breeds.length} dog breeds.`);
  } catch (error) {
    console.error("Failed to seed breeds:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedBreeds();