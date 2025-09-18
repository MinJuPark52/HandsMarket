const {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
} = require("../models/tags");

async function fetchTags(req, res, next) {
  try {
    const tags = await getAllTags(req.pool);
    res.json(tags);
  } catch (error) {
    next(error);
  }
}

async function addTag(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const id = await createTag(req.pool, name);
    res.status(201).json({ message: "Tag created", id });
  } catch (error) {
    next(error);
  }
}

async function editTag(req, res, next) {
  try {
    const { tag_id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const affectedRows = await updateTag(req.pool, tag_id, name);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.json({ message: "Tag updated" });
  } catch (error) {
    next(error);
  }
}

async function removeTag(req, res, next) {
  try {
    const { tag_id } = req.params;

    const affectedRows = await deleteTag(req.pool, tag_id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.json({ message: "Tag deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  fetchTags,
  addTag,
  editTag,
  removeTag,
};
