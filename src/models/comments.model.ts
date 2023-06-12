import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Comment", commentSchema);
