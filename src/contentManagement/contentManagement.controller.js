// routes/content.js
const express = require("express");
const router = express.Router();
const Content = require("../../db/config/contentManagement.model");

// 1. GET /api/content?type=position - Get all contents by type
const getContentData=async(req,res)=>{


  try {
 
    const contents = await Content.find({});
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contents", error });
  }
};

// 2. POST /api/content - Add new content
const addContentData= async(req,res)=>{

  try {
    const { type, label, value } = req.body;
    console.log("inside content")
    const newContent = new Content({ type, label, value });
    await newContent.save();
    res.status(201).json({ message: "Content added successfully", content: newContent });
  } catch (error) {
    res.status(500).json({ message: "Failed to add content", error });
  }
};

// 3. PUT /api/content/:id - Edit content

const updateContentData=async(req,res)=>{
  try {
    const { id } = req.params;
    const { label, value } = req.body;
    console.log(id,label,value,"ediiittt")
    const updatedContent = await Content.findByIdAndUpdate(
      id,
      { label, value },
      { new: true }
    );
    if (!updatedContent) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json({ message: "Content updated successfully", content: updatedContent });
  } catch (error) {
    res.status(500).json({ message: "Failed to update content", error });
  }
};

// 4. DELETE /api/content/:id - Delete content
const deleteContentData=async(req,res)=>{
  try {
    const { id } = req.params;
    const deletedContent = await Content.findByIdAndDelete(id);
    if (!deletedContent) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete content", error });
  }
};

module.exports = {
    deleteContentData,
    updateContentData,
    addContentData,
    getContentData
  };
