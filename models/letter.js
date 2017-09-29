var mongoose = require("mongoose");

var letterSchema = mongoose.Schema({
    startDate: String,
    endDate: String,
    leaveType: String, 
    reason: String, 
    requestBy: String, 
    requestedAt: String, 
    approvalStatus: String, 
    approvedAt: String, 
    student: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    userName: String
  }
});

module.exports = mongoose.model("Letter", commentSchema);