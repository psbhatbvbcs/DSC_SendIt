import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Plus, PlusCircle, Share } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/axiosProvider";

const Posts = () => {
  const isNonMobile = !useMediaQuery(
    "(max-width:600px) or (max-height:600px) or (orientation: portrait)"
  );
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  const handleShareClick = async (uniqueId) => {
    try {
      // Get the specific URL you want to share
      const specificUrl = `${process.env.REACT_APP_FRONTEND_URL}/${uniqueId}`;

      // Copy the URL to the clipboard
      await navigator.clipboard.writeText(specificUrl);

      // Open the page in a new tab
      window.open(specificUrl, "_blank");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/getPost/getAllPostsForAdmin");
        setPosts(data.posts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Box
      m={isNonMobile ? "3rem 1rem" : "1rem 0rem"}
      display={"flex"}
      alignItems={"center"}
    >
      <Grid container spacing={8} padding={isNonMobile ? 1 : 3}>
        <Grid item xs={6} sm={4} md={2}>
          <Card
            sx={{
              backgroundColor: "#CDF5FD",
              padding: "5px",
              borderRadius: "8px",
              boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.4)",
              cursor: "pointer",
              height: isNonMobile ? "200px" : "150px",
              width: isNonMobile ? "200px" : "150px",
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "#C2D4F4",
              },
            }}
          >
            <CardActionArea
              sx={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                navigate(`/createPost`);
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <PlusCircle size={38} />
                <Typography
                  variant="h6"
                  fontFamily="Space Grotesk"
                  sx={{
                    lineHeight: "50px",
                    px: "10px",
                    borderRadius: "10px",
                    color: "black",
                  }}
                >
                  New Post
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {posts.map((item, index) => (
          <Grid item xs={6} sm={4} md={2} key={index}>
            <Card
              sx={{
                backgroundColor: "#CDF5FD",
                padding: "5px",
                borderRadius: "8px",
                boxShadow: "3px 3px 4px rgba(0, 0, 0, 0.4)",
                cursor: "pointer",
                height: isNonMobile ? "200px" : "150px",
                width: isNonMobile ? "200px" : "150px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#C2D4F4",
                },
              }}
            >
              <CardActionArea
                onClick={() => {
                  navigate(`/post/${item.id}`);
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontFamily="Space Grotesk"
                    sx={{
                      px: "10px",
                      borderRadius: "10px",
                      color: "black",
                    }}
                  >
                    Title: {item.uniqueId}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Share
                style={{
                  padding: "15px",
                  borderRadius: "50%",
                  backgroundColor: "#FFF",
                }}
                size={24}
                onClick={() => handleShareClick(item.uniqueId)}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Posts;
