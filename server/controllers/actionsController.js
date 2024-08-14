import { postsMetadata } from "../models/postsMetadata.js";

export const upvoteController = async (req, res) => {
  try {
    const { action } = req.body;
    const { uniqueId } = req.params;

    const post = await postsMetadata.findOne({
      uniqueId,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.upvotes += Number(action);

    await post.save();

    return res.status(200).json({ messsage: "Thank You!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const downvoteController = async (req, res) => {
  try {
    const { action } = req.body;
    const { uniqueId } = req.params;

    const post = await postsMetadata.findOne({
      uniqueId,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.downvotes += Number(action);

    await post.save();

    return res.status(200).json({ messsage: "We will try to improve :(" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
