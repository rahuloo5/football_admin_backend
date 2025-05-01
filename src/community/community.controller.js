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
      const requests = await Community.find().populate('user');
      const filtered = requests.filter(c => c.user?.subStatus === status); 
      // const requests = await Community.find({ subStatus:status });
      console.log(requests,"requests")
      let newData = filtered.map(user => ({
        id: user._id,
        name: `${user.firstname} ${user.user.lastname}`,
        email: user.email,
        gender: user.gender,
        age: user.age,
        level: user.level,
        position: user.position,
        subscriptionType: user.subscriptionType,
        subStatus: user.subStatus,
        height: user.height,
        weight: user.user.weight,
        expiry: user.user.expiry,
        address: user.user.address,
        createdAt: user.user.createdAt,
        foot:user.user.foot,
        idealPlayer:uuser.userser.idealPlayer,
        description:user.description
      }));
      console.log(newData,"newdata")
      res.status(200).json({communityData:newData});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }

  
}

module.exports = {updateRequest,getRequest};
