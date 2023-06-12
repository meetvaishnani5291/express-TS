import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

postSchema.index(
  { body: "text", title: "text" },
  {
    weights: {
      title: 10,
      body: 5,
    },
  }
);

export default mongoose.model("Post", postSchema);
