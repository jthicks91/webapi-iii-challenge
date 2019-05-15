const express = require("express");
const users = require("../users/userDb.js");

const router = express.Router();

const USERPOSTCHECK = [validateUserId, validatePost];

router.post("/", validatePost, async (req, res) => {
  try {
    const user = await users.insert(req.body);
    res.status(201).json(user);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "error adding post"
    });
  }
});

router.post("/:id/posts", USERPOSTCHECK, async (req, res) => {
  const userInfo = { ...req.body, user_id: req.params.id };
  try {
    const post = await users.insert(userInfo);
    res.status(201).json(post);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "Error"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await users.get(req.query);
    res.status(200).json(user);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "Error retrieving the users"
    });
  }
});

router.get("/:id", validateUserId, async (req, res) => {
  res.status(200).json(req.hub);
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const posts = await users.getUserPosts(req.params.id);
    res.status(200).json(posts);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "Error getting the posts for the user"
    });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {});

router.put("/:id", validateUserId, async (req, res) => {});

//custom middleware
async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const userId = await users.getById(id);
    if (userId) {
      req.user = userId;
      next();
    } else {
      next({ message: "user with id: ${id} could not be found" });
      // res.status(404).json({ message: "Hub not found; invalid id" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to validate user with that id" });
  }
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
    next();
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing name field is required" });
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
    next();
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  }
}

module.exports = router;
