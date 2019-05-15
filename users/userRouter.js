const express = require("express");
const users = require("../users/userDb.js");
const post = require("../posts/postDb");
const router = express.Router();

// const USERPOSTCHECK = [validateUserId, validatePost];

router.post("/", validateUser, async (req, res) => {
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

router.post("/:id/posts", async (req, res) => {
  const userInfo = { ...req.body, user_id: req.params.id };
  try {
    const posts = await post.insert(userInfo);
    res.status(201).json(posts);
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
  try {
    const { id } = await users.getById(req.params.id);
    if (id) {
      res.status(200).json(req.user);
    } else {
      res.status(400).json({ message: "user with this ID could not be found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "couldnt retrieve that user with that specified ID" });
  }
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

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    const count = await users.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "The user has been nuked" });
    } else {
      res.status(404).json({ message: "The user could not be found" });
    }
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "Error removing the user"
    });
  }
});

router.put("/:id", validateUserId, async (req, res) => {
  try {
    const updatedUser = await users.update(req.params.id, req.body);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "error updating user" });
    }
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "could not update user"
    });
  }
});

//custom middleware
async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const userId = await users.getById(id);
    if (userId) {
      req.user = userId;
      next();
    } else {
      res.status(404).json({ message: "invalid user id" });
      next();
    }
  } catch (err) {
    res.status(500).json({ message: "error validating user" });
  }
}

function validateUser(req, res, next) {
  const name = req.body;
  if (req.body && Object.keys(req.body).length) {
    next();
  } else {
    res.status(404).json({ message: "please let me use my name field" });
  }
}

module.exports = router;
