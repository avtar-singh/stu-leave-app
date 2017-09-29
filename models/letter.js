var mongoose = require("mongoose");

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
        userName: String
    }, 
    requestedAt: String, 
    approvalStatus: String, 
    approvedAt: String, 
});

module.exports = mongoose.model("Letter", letterSchema);