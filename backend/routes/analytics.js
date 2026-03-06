const express = require("express");
const User = require("../models/User");
const FeatureClick = require("../models/FeatureClick");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const { startDate, endDate, ageGroup, gender, feature } = req.query;

    const userFilter = {};

    if (gender) userFilter.gender = gender;

    if (ageGroup) {
      if (ageGroup === "<18") userFilter.age = { $lt: 18 };
      if (ageGroup === "18-40") userFilter.age = { $gte: 18, $lte: 40 };
      if (ageGroup === ">40") userFilter.age = { $gt: 40 };
    }

    const users = await User.find(userFilter).select("_id");

    const userIds = users.map((u) => u._id);

    const clickFilter = {};

    if (userIds.length > 0) {
      clickFilter.userId = { $in: userIds };
    }

    if (startDate || endDate) {
      clickFilter.timestamp = {};

      if (startDate) clickFilter.timestamp.$gte = new Date(startDate);
      if (endDate) clickFilter.timestamp.$lte = new Date(endDate);
    }

    if (feature) {
      clickFilter.featureName = feature;
    }

    // BAR CHART
    const barData = await FeatureClick.aggregate([
      { $match: clickFilter },
      {
        $group: {
          _id: "$featureName",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      {
        $project: {
          featureName: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // LINE CHART
    const lineMatch = { ...clickFilter };

    if (feature) {
      lineMatch.featureName = feature;
    }

    const lineData = await FeatureClick.aggregate([
      { $match: lineMatch },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      barData,
      lineData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;