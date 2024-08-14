import { postsMetadata } from "../models/postsMetadata.js";

export const getPostWithIdController = async (req, res) => {
  try {
    const { uniqueId } = req.params;

    const post = await postsMetadata.findOne({ uniqueId });

    return res.status(200).json({ post });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getAllPostsForAdminController = async (req, res) => {
  try {
    const posts = await postsMetadata.find();
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getRandomFiveController = async (req, res) => {
  try {
    const posts = await postsMetadata.aggregate([{ $sample: { size: 5 } }]);
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
