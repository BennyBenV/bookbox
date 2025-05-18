const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const followCtrl = require("../controllers/followController");

router.post("/:username/follow", auth, followCtrl.followUser);
router.delete("/:username/unfollow", auth, followCtrl.unfollowUser);
router.get("/:username/followers", auth, followCtrl.getFollowers);
router.get("/:username/following", auth, followCtrl.getFollowing);
router.get("/:username/status", auth, followCtrl.isFollowing);

module.exports = router;