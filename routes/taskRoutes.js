const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });
    res.json(task);
  } catch (err) {
    res.status(400).json({ msg: "Duplicate task title" });
  }
});


router.get("/", auth, async (req, res) => {
  let tasks;

  if (req.user.role === "admin") {
    tasks = await Task.find();
  } else {
    tasks = await Task.find({ userId: req.user.id });
  }

  res.json(tasks);
});


router.put("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});


router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});


router.patch("/:id/complete", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: "completed" },
    { new: true }
  );
  res.json(task);
});


router.get("/pending", auth, async (req, res) => {
  const tasks = await Task.find({
    userId: req.user.id,
    status: "pending"
  });
  res.json(tasks);
});

module.exports = router;
