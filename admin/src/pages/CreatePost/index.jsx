import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import JoditEditor from "jodit-react";
import { api } from "../../utils/axiosProvider";
import { CaretDown, Plus, Trash } from "@phosphor-icons/react";
import { nanoid } from "nanoid";
const CustomButton = ({
  backgroundColor,
  color,
  buttonIcon,
  buttonText,
  heroBtn,
  guideBtn,
  onClickFun,
  type,
}) => {
  const CustomStyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: backgroundColor,
    color: color,
    fontWeight: "700",
    marginTop: "15px",
    fontSize: "14px",
    cursor: "pointer",
    padding: "0.5rem 1.25rem",
    borderRadius: "7px",
    textTransform: "none",
    display: "flex", // Display as flex to align icon and text horizontally
    alignItems: "center", // Align icon and text vertically within the button
    gap: theme.spacing(1), // Add some gap between icon and text
    border: "2px solid transparent",
    width: "90%",
    "&:hover": {
      backgroundColor: color,
      color: backgroundColor,
      borderColor: backgroundColor,
    },
    [theme.breakpoints.down("md")]: {
      margin: (heroBtn || guideBtn) && theme.spacing(0, "auto", 3, "auto"),
      width: (heroBtn || guideBtn) && "90%",
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: guideBtn && theme.spacing(3),
      width: guideBtn && "90%",
    },
  }));

  return (
    <CustomStyledButton onClick={onClickFun} type={type}>
      {buttonIcon}
      {buttonText}
    </CustomStyledButton>
  );
};

const TextFieldWrapper = ({ customSx, ...props }) => {
  const defaultSx = {
    paddingLeft: "10px",
    alignItems: "center",
    "& .MuiInputLabel-root": {
      background: "transparent",
      color: "grey",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "grey", // Change the focused label color as needed
    },
    "& .MuiFilledInput-underline": {
      "&:before, &:after, &:hover:before, &:hover:after, &:focus:before, &:focus:after, &:active:before, &:active:after,":
        {
          color: "black",
        },
    },
    "& .MuiFilledInput-root": {
      background: "transparent",
      color: "black",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "black",
    },
  };

  return <TextField sx={{ ...defaultSx, ...customSx }} {...props} />;
};

const CreatePost = () => {
  const user = localStorage.getItem("user");

  const [postTitle, setPostTitle] = useState("");
  const [description, setDescription] = useState("");

  const [type, setType] = useState("");
  const [file, setFile] = useState(null);

  const editor = useRef(null);
  const [content, setContent] = useState("");

  const [uniqueId, setUniqueId] = useState("");

  const handleUniqueId = () => {
    setUniqueId(nanoid());
  };

  const [pages, setPages] = useState(0);

  const [posts, setPosts] = useState([]);
  const [types, setTypes] = useState(
    Array.from({ length: pages + 1 }, () => "")
  );

  const handleTypeChange = (selectedType, pageIndex) => {
    setTypes((prevTypes) => {
      const updatedTypes = [...prevTypes];
      updatedTypes[pageIndex] = selectedType;
      return updatedTypes;
    });
  };

  const handleNewPage = () => {
    setFile(null);
    setContent("");
    setPages((prevPage) => prevPage + 1);
  };

  const handleDeletePage = (pageIndex) => {
    if (pageIndex === 0) {
      return;
    }
    setPosts((prevPosts) => {
      const updatedPosts = [...prevPosts];
      const deletedPageNo = updatedPosts[pageIndex]?.pageNo;

      // Remove the post of the clicked pageNo
      updatedPosts.splice(pageIndex, 1);

      // Update remaining page numbers
      updatedPosts.forEach((post, index) => {
        if (post.pageNo > deletedPageNo) {
          updatedPosts[index].pageNo = index + 1;
        }
      });

      return updatedPosts;
    });

    setPages((prevPages) => (prevPages <= 0 ? prevPages : prevPages - 1));
  };

  const handleSubmit = async (index, event) => {
    event.preventDefault();

    if (type === "Image" && file === null) {
      toast.error("Please enter content");
      return;
    } else if (type === "Text" && content === "") {
      toast.error("Please enter content");
      return;
    }

    const pageData = {
      pageFile: file,
      pageNo: index + 1,
      pageContent: content,
      contentType: types[index],
    };

    // Check if a post with the same pageNo already exists
    const existingPostIndex = posts.findIndex(
      (post) => post.pageNo === pageData.pageNo
    );

    if (existingPostIndex !== -1) {
      // If exists, update the existing post
      const updatedPosts = [...posts];
      updatedPosts[existingPostIndex] = pageData;
      setPosts(updatedPosts);
    } else {
      // If doesn't exist, push the new post
      setPosts((prevPosts) => [...prevPosts, pageData]);
    }
  };

  const submitPostWithFile = async (post) => {
    const formData = new FormData();
    formData.append("uniqueId", uniqueId);
    formData.append("postTitle", postTitle);
    formData.append("postDescription", description);
    formData.append("pageNo", post.pageNo);
    formData.append("contentType", post.contentType);
    formData.append("cdnFile", post.pageFile);

    try {
      const response = await api.post("/cdn/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
    } catch (error) {
      handleUploadError(error);
    }
  };

  const submitPostWithoutFile = async (post) => {
    const postData = {
      uniqueId,
      postTitle,
      postDescription: description,
      pageNo: post.pageNo,
      contentType: post.contentType,
      pageContent: post.pageContent,
    };

    try {
      const response = await api.post("/cdn/uploadWithoutFile", postData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    } catch (error) {
      handleUploadError(error);
    }
  };

  const submitPost = async (post) => {
    if (post.contentType === "Image") {
      await submitPostWithFile(post);
    } else {
      await submitPostWithoutFile(post);
    }

    // Add a delay of 2 seconds (2000 milliseconds) before the next iteration
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const handleFinalSubmit = async (event) => {
    event.preventDefault();

    if (uniqueId === "") {
      toast.error("Please enter unique id");
      return;
    } else if (postTitle === "") {
      toast.error("Please enter post title");
      return;
    } else if (description === "") {
      toast.error("Please enter description");
      return;
    } else if (posts.length === 0) {
      toast.error("Please enter content");
      return;
    } else if (posts.length < pages) {
      toast.error("Please enter content for all pages");
      return;
    }

    for (const post of posts) {
      await submitPost(post);

      // Add a delay of 2 seconds (2000 milliseconds) before the next iteration
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    toast.success("Successfully uploaded!");
  };

  const handleUploadError = (error) => {
    if (error.response) {
      toast.error(error.response.data.message);
    } else if (error.request) {
      toast.error(
        "Network Error. The backend server is offline. Contact the admins or try again later."
      );
    } else {
      toast.error("Unknown Error. Contact the admins or try again later.");
    }
  };

  const generateRangeArray = (n) => {
    return Array.from({ length: n + 1 }, (_, index) => index + 1);
  };

  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", gap: "1rem", pb: "5rem" }}
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          backgroundColor: "#F5FAFE",
          borderRadius: "10px",
          height: "auto",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
          margin: "20px 0px",
        }}
      >
        <Box
          padding="20px"
          width="95%"
          display="flex"
          flexDirection="column"
          gap="1rem"
        >
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="outlined"
              sx={{ display: "flex", alignItems: "center", gap: "5px" }}
              onClick={handleUniqueId}
            >
              <Plus color="blue" weight="bold" />
              Generate Unique Id
            </Button>
            <Typography
              variant="body1"
              fontFamily="Space Grotesk"
              fontWeight={500}
            >
              Unique Id: {uniqueId === "" ? "Not yet generate" : uniqueId}
            </Typography>
          </Box>
          <InputLabel
            id="author-label"
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
              mb: "-15px",
              fontWeight: 600,
            }}
          >
            Enter Posts's Title:
          </InputLabel>
          <TextFieldWrapper
            label="Post Title"
            variant="filled"
            id="title"
            name="title"
            value={postTitle}
            fullWidth
            required
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <InputLabel
            id="author-label"
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
              mb: "-15px",
              fontWeight: 600,
            }}
          >
            Enter Description:
          </InputLabel>
          <TextFieldWrapper
            label="Post Description"
            variant="filled"
            id="description"
            name="description"
            value={description}
            fullWidth
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
      </Box>
      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          variant="contained"
          sx={{ display: "flex", alignItems: "center", gap: "5px" }}
          onClick={handleFinalSubmit}
        >
          <Plus color="#fff" weight="bold" />
          FINAL SUBMIT
        </Button>
        <Button
          variant="outlined"
          sx={{ display: "flex", alignItems: "center", gap: "5px" }}
          onClick={handleNewPage}
        >
          <Plus color="blue" weight="bold" />
          New Page
        </Button>
      </Box>
      {generateRangeArray(pages).map((page, index) => (
        <Accordion key={page} sx={{ width: "100%" }}>
          <AccordionSummary
            expandIcon={<CaretDown />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              padding="10px"
              width="100%"
            >
              Page {page}
              <Trash
                onClick={() => handleDeletePage(index)}
                weight="fill"
                size="18"
                color="red"
                style={{
                  padding: "5px",
                  backgroundColor: "rgba(0,0,0,0.15)",
                  borderRadius: "50%",
                  cursor: "crosshair",
                }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              onSubmit={(event) => handleSubmit(index, event)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                alignItems: "center",
                justifyContent: "center",
                width: "90%",
                maxWidth: "auto",
                backgroundColor: "#F5FAFE",
                borderRadius: "10px",
                height: "auto",
                padding: "20px",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
                margin: "20px 0px",
              }}
            >
              <InputLabel
                id="category-label"
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "100%",
                  mb: "-15px",
                  fontWeight: 600,
                }}
              >
                Select Type of page:
              </InputLabel>
              <Select
                labelId="category-label"
                label="Select Type"
                value={types[index]}
                fullWidth
                sx={{ height: "40px" }}
                required
                onChange={(e) => handleTypeChange(e.target.value, index)}
              >
                <MenuItem value={""} disabled>
                  Select Type
                </MenuItem>
                <MenuItem key={"1"} value={"Image"}>
                  Image
                </MenuItem>
                <MenuItem key={"2"} value={"Markdown"}>
                  Markdown
                </MenuItem>
                <MenuItem key={"3"} value={"Vote"}>
                  Vote
                </MenuItem>
              </Select>
              {types[index] === "Image" ? (
                <>
                  <InputLabel
                    id="profilepic-label"
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      width: "100%",
                      mb: "-15px",
                      fontWeight: 600,
                    }}
                  >
                    Upload Pic of senior:
                  </InputLabel>
                  <input
                    type="file"
                    name="file"
                    style={{
                      margin: "10px",
                      backgroundColor: "transparent",
                      color: "black",
                      border: "1px solid black",
                      borderRadius: "10px",
                      width: "80%",
                      display: "inline-block",
                      background: "#C2D4F4",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      padding: "8px 16px",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    required
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </>
              ) : types[index] === "Markdown" ? (
                <>
                  <InputLabel
                    id="content-label"
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      width: "100%",
                      mb: "-15px",
                      fontWeight: 600,
                    }}
                  >
                    Enter Content:
                  </InputLabel>
                  <JoditEditor
                    ref={editor}
                    value={posts[index]?.pageContent}
                    onChange={(newContent) => setContent(newContent)}
                  />
                </>
              ) : (
                <>Vote counter will be added on frontend</>
              )}

              <CustomButton
                backgroundColor="#0F1B4C"
                color="#fff"
                buttonText="Add Papers"
                heroBtn={true}
                type="submit"
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default CreatePost;
