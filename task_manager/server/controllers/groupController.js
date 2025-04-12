import asyncHandler from "express-async-handler";
import Group from "../models/Group.js";
import User from "../models/userModel.js";

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;

  if (!name) {
    res.status(400);
    throw new Error("Group name is required");
  }

  const group = await Group.create({
    name,
    description,
    owner: userId,
    members: [userId],
  });

  if (group) {
    res.status(201).json(group);
  } else {
    res.status(400);
    throw new Error("Invalid group data");
  }
});

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
const getGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({}).populate("owner", "name").populate("members", "name");
  res.status(200).json(groups);
});

// @desc    Get a single group by ID
// @route   GET /api/groups/:id
// @access  Private
const getGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)
    .populate("owner", "name")
    .populate("members", "name");

  if (group) {
    res.status(200).json(group);
  } else {
    res.status(404);
    throw new Error("Group not found");
  }
});

// @desc    Update a group
// @route   PUT /api/groups/:id
// @access  Private
const updateGroup = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const group = await Group.findById(req.params.id);

  if (group) {
    group.name = name || group.name;
    group.description = description || group.description;

    const updatedGroup = await group.save();
    res.status(200).json(updatedGroup);
  } else {
    res.status(404);
    throw new Error("Group not found");
  }
});

// @desc    Delete a group
// @route   DELETE /api/groups/:id
// @access  Private
const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (group) {
    await Group.deleteOne({ _id: group._id });
    res.status(200).json({ message: "Group removed" });
  } else {
    res.status(404);
    throw new Error("Group not found");
  }
});

// @desc    Add a member to a group
// @route   POST /api/groups/:id/members
// @access  Private
const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const group = await Group.findById(req.params.id);
  const user = await User.findById(userId)

  if (group && user) {
    if (group.members.includes(userId)) {
      res.status(400);
      throw new Error("User is already a member of this group");
    }
    group.members.push(userId);
    await group.save();
    res.status(200).json({ message: "Member added successfully" });
  } else {
    res.status(404);
    throw new Error("Group or User not found");
  }
});

// @desc    Remove a member from a group
// @route   DELETE /api/groups/:id/members/:userId
// @access  Private
const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const group = await Group.findById(req.params.id);
  if (group) {
    group.members = group.members.filter((member) => member.toString() !== userId);
    await group.save();
    res.status(200).json({ message: "Member removed successfully" });
  } else {
    res.status(404);
    throw new Error("Group not found");
  }
});
export {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
};