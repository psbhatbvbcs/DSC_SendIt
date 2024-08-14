import mongoose from "mongoose";

const postsMeta = new mongoose.Schema({
  postTitle: {
    type: String,
  },
  postDescription: {
    type: String,
  },
  uniqueId: {
    type: String,
  },
  postContent: [
    {
      pageNo: {
        type: Number,
      },
      contentType: {
        type: String,
      },
      pageContent: {
        type: String,
      },
    },
  ],
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
});

export const postsMetadata = mongoose.model("postsMetadata", postsMeta);
