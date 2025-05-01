const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getMe, updateProfile, deleteAccount, uploadAvatar } = require("../controllers/userController");
const upload = require("../middleware/upload");

router.get("/me", auth, getMe);
router.put("/me", auth, updateProfile);
router.delete("/me", auth, deleteAccount);
router.post("/avatar", auth, upload.single("avatar"), uploadAvatar);

module.exports = router;