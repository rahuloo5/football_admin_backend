const express = require("express");
const Community = require("../../db/models/user.model");


// Update request status
const updateRequest=async(req,res)=>{



  try {
    console.log(req,"updatecom")
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedRequest = await Community.findByIdAndUpdate(
      id,
      { requestStatus:status },
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
   
    const { status } = req.query;
    console.log(status,"status")
  
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
  
    try {
     
    
      const requests = await Community.find({ requestStatus:status });
      console.log(requests,"req")
  
      let newData = requests?.map(user => ({
        id: user._id,
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        gender: user.gender,
        age: user.age,
        level: user.level,
        position: user.position,
        subscriptionType:user.subscriptionType,
        subStatus: user.subStatus,
        height: user.height,
        weight: user.weight,
        expiry: user.expiry,
        address: user.address,
        createdAt: user.createdAt,
        foot:user.foot,
        idealPlayer:user.idealPlayer,
        description:user.description
      }));
      console.log(newData,"newdata")
      res.status(200).json({communityData:newData});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }

  
}

module.exports = {updateRequest,getRequest};
