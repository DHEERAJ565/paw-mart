const Favorite = require("../models/Favorite");
const Breed = require("../models/Breed");
const jwt = require("jsonwebtoken");

// Get authenticated user from the existing login cookie
function getUserId(req) {
  try {
    const token = req.cookies?.pawMartToken;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// GET /api/favorites
exports.getFavorites = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please log in to view your favorites.",
      });
    }

    const favorites = await Favorite.find({ userId })
      .populate("breed")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch favorites.",
    });
  }
};

// POST /api/favorites/:breedId
exports.addFavorite = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please log in to save favorites.",
      });
    }

    const { breedId } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(breedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid breed ID.",
      });
    }

    const breed = await Breed.findById(breedId);

    if (!breed) {
      return res.status(404).json({
        success: false,
        message: "Breed not found.",
      });
    }

    const favorite = await Favorite.findOneAndUpdate(
      { userId, breed: breedId },
      { $setOnInsert: { userId, breed: breedId } },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: "Breed added to favorites.",
      favorite,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This breed is already in your favorites.",
      });
    }

    console.error("Add favorite error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to add favorite.",
    });
  }
};

// DELETE /api/favorites/:breedId
exports.removeFavorite = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please log in to remove favorites.",
      });
    }

    const { breedId } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(breedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid breed ID.",
      });
    }

    const favorite = await Favorite.findOneAndDelete({
      userId,
      breed: breedId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found.",
      });
    }

    res.json({
      success: true,
      message: "Breed removed from favorites.",
    });
  } catch (error) {
    console.error("Remove favorite error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to remove favorite.",
    });
  }
};