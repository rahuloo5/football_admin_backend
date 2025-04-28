const express = require("express");
const {
    deleteContentData,
    updateContentData,
    addContentData,
    getContentData
} = require("./contentManagement.controller");
const { authMiddleware } = require("../middleware/authorization.middleware");

const router = express.Router();



//user API

router.get("/content", getContentData);
router.post("/content", addContentData);
router.put("/content/:id", updateContentData);
router.delete("/content/:id", deleteContentData);


module.exports = router;