const express = require("express");
const router = express.Router();
const {
  fetchTags,
  addTag,
  editTag,
  removeTag,
} = require("../controllers/tags");

router.get("/", fetchTags);
router.post("/", /* auth, */ addTag);
router.patch("/:tag_id", /* auth, */ editTag);
router.delete("/:tag_id", /* auth, */ removeTag);

module.exports = router;
