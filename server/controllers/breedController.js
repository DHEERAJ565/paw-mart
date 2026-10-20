const Breed = require("../models/Breed");
const DogBreed = require("../models/DogBreed");
// GET /api/breeds
exports.getBreeds = async (req, res) => {
  try {
    const {
      search,
      size,
      energy,
      coat,
      apartment,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    if (search && search.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (size) {
      filter.size = size;
    }

    if (energy) {
      filter.energy = energy;
    }

    if (coat) {
      filter.coat = {
        $regex: coat,
        $options: "i",
      };
    }

    if (apartment === "true") {
      filter.apartment = true;
    }

    const sortOptions = {
      name: { name: 1 },
      newest: { createdAt: -1 },
      featured: { featured: -1, name: 1 },
    };

    const sortBy = sortOptions[sort] || { name: 1 };

    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(limit) || 12));

    const [breeds, total] = await Promise.all([
      Breed.find(filter)
        .sort(sortBy)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      Breed.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: currentPage,
      pages: Math.ceil(total / pageSize),
      breeds,
    });
  } catch (error) {
    console.error("Get breeds error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch dog breeds.",
    });
  }
};

// GET /api/breeds/stats
exports.getBreedStats = async (req, res) => {
  try {
    const [totalBreeds, sizes, energyLevels, featuredBreeds] =
      await Promise.all([
        Breed.countDocuments(),

        Breed.aggregate([
          {
            $group: {
              _id: "$size",
              count: { $sum: 1 },
            },
          },
        ]),

        Breed.aggregate([
          {
            $group: {
              _id: "$energy",
              count: { $sum: 1 },
            },
          },
        ]),

        Breed.countDocuments({ featured: true }),
      ]);

    res.json({
      success: true,
      totalBreeds,
      featuredBreeds,
      sizes,
      energyLevels,
    });
  } catch (error) {
    console.error("Breed stats error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch breed statistics.",
    });
  }
};

// GET /api/breeds/:id
exports.getBreedById = async (req, res) => {
  try {
    const breed = await Breed.findById(req.params.id);

    if (!breed) {
      return res.status(404).json({
        success: false,
        message: "Breed not found.",
      });
    }

    res.json({
      success: true,
      breed,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid breed ID.",
      });
    }

    console.error("Get breed error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch breed details.",
    });
  }
};

// GET /api/breeds/catalog
// Returns the 171 breed catalog records from MongoDB.
exports.getBreedCatalog = async (req, res) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(req.query.limit) || 12)
    );

    const filter = {};

    if (search) {
      filter.breed = {
        $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    const [breeds, total] = await Promise.all([
      DogBreed.find(filter)
        .sort({ breed: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      DogBreed.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      breeds,
    });
  } catch (error) {
    console.error("Breed catalog error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch the breed catalog.",
    });
  }
};