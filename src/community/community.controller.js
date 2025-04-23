const express = require("express");
const router = express.Router();
const Community = require("../../db/config/community.model");

// Update request status
const updateRequest=async(req,res)=>{


// router.patch("/requests/:id/status", async (req, res) => {
  try {
    console.log(req,"updatecom")
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedRequest = await Community.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({
      message: "Status updated successfully",
      data: updatedRequest,
    });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Internal server error" });
  }

}

const getRequest = async(req,res)=>{
    // GET /api/requests?status=pending
    const { status } = req.query;
    console.log(status,"status")
  
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
  
    try {
      const requests = await Community.find({ status });
      res.status(200).json({communityData:requests});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }

  
}

module.exports = {updateRequest,getRequest};
