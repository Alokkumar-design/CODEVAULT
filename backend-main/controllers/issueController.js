const Issue = require("../models/issueModel");

async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    if (!title) {
      return res.status(400).json({ error: "Title is required for an issue!" });
    }

    const issue = new Issue({
      title,
      description,
      repository: id,
    });

    const savedIssue = await issue.save();
    res.status(201).json(savedIssue);
  } catch (err) {
    console.error("Error during issue creation : ", err.message);
    res.status(500).json({ error: "Server error during issue creation." });
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;

    const updatedIssue = await issue.save();
    res.json({ message: "Issue updated successfully!", issue: updatedIssue });
  } catch (err) {
    console.error("Error during issue update : ", err.message);
    res.status(500).json({ error: "Server error during issue update." });
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }
    res.json({ message: "Issue deleted successfully!" });
  } catch (err) {
    console.error("Error during issue deletion : ", err.message);
    res.status(500).json({ error: "Server error during issue deletion." });
  }
}

async function getAllIssues(req, res) {
  const { id } = req.params;

  try {
    const issues = await Issue.find({ repository: id });
    res.status(200).json(issues);
  } catch (err) {
    console.error("Error fetching issues : ", err.message);
    res.status(500).json({ error: "Server error fetching issues." });
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }
    res.json(issue);
  } catch (err) {
    console.error("Error fetching issue : ", err.message);
    res.status(500).json({ error: "Server error fetching issue." });
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
