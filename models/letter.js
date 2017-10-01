// REQUIRING DEPENDENCIES
var mongoose = require("mongoose");

// CREATING NEW SCHEMA
var letterSchema = mongoose.Schema({
    startDate: String,
    endDate: String,
    leaveType: String, 
    reason: String, 
    author: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username: String
    }, 
    requestedAt: String, 
    approvalStatus: {
        teacher_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username: String,
        status: Boolean
    },
    approvedAt: String
});

// EXPORTING REQUIRED MODEL
module.exports = mongoose.model("Letter", letterSchema);