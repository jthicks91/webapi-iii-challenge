const express = require("express");
const post = require("./postDb.js");
const router = express.Router();

router.get("/", async (req, res) => {
  const allPosts = await post.get();
  res.status(200).json(allPosts);
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.validId);
});

router.delete("/:id", validatePostId, async (req, res) => {
  try {
    const { id } = req.params;
    const deletePost = await post.remove(id);
    res.status(200).json(deletePost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "something went wrong deleting this post" });
  }
});

router.put("/:id", validatePostId, validatePost, async (req, res) => {
  try {
    const { id } = req.params;
    const editPost = await post.update(id, req.body);
    res.status(200).json(editPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "something went wrong with updating the post" });
  }
});

// custom middleware

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
    next();
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
    next();
  }
}

async function validatePostId(req, res, next) {
  const { id } = req.params;
  const validId = await post.getById(id);
  if (validId) {
    req.validId = validId;
    next();
  } else {
    res.status(404).json({ message: "Invalid id" });
  }
}

module.exports = router;
