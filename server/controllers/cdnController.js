import { postsMetadata } from "../models/postsMetadata.js";
import { imageKit } from "../routes/cdnRouter.js";

export const cdnImageUploadController = async (req, res) => {
  try {
    const { uniqueId, postTitle, postDescription, pageNo, contentType } =
      req.body;
    const file = req.file;

    const response = await imageKit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "Developer_Student_Club",
    });

    const isPostExist = await postsMetadata.findOne({ uniqueId });

    if (isPostExist) {
      await postsMetadata.updateOne(
        { uniqueId },
        {
          $push: {
            postContent: { pageNo, contentType, pageContent: response.url },
          },
        }
      );
    } else {
      await postsMetadata.create({
        uniqueId,
        postTitle,
        postDescription,
        postContent: [{ pageNo, contentType, pageContent: response.url }],
      });
    }

    return res.status(200).json({ message: "Successfully Uploaded!" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const uploadWithoutFileController = async (req, res) => {
  try {
    const {
      uniqueId,
      postTitle,
      postDescription,
      pageNo,
      contentType,
      pageContent,
    } = req.body;

    const isPostExist = await postsMetadata.findOne({ uniqueId });

    if (isPostExist) {
      await postsMetadata.updateOne(
        { uniqueId },
        {
          $push: {
            postContent: { pageNo, contentType, pageContent },
          },
        }
      );
    } else {
      await postsMetadata.create({
        uniqueId,
        postTitle,
        postDescription,
        postContent: [{ pageNo, contentType, pageContent }],
      });
    }

    return res.status(200).json({ message: "Successfully Uploaded!" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
