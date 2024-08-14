import React, { useEffect } from "react";
import { api } from "../../utils/axiosProvider";
import toast from "react-hot-toast";
import { Box, Typography } from "@mui/material";
import { ArrowSquareOut } from "@phosphor-icons/react";

const DashboardWithoutId = () => {
  const [posts, setPosts] = React.useState([]);

  useEffect(() => {
    const fetchRandomFive = async () => {
      try {
        const response = await api.get("/getPost/getRandomFive");
        setPosts(response.data.posts);
      } catch (error) {
        toast.error("Oops! Open a valid URL");
      }
    };
    fetchRandomFive();
  }, []);
  return (
    <Box
      width="95vw"
      height="100dvh"
      justifyContent="center"
      alignItems="center"
      mt="5rem"
    >
      <Typography
        variant="h6"
        textAlign="center"
        fontFamily="Space Grotesk"
        color="blue"
      >
        Random Topics!
      </Typography>
      {posts && posts.length > 0 ? (
        posts.map((post, index) => (
          <Box
            display="flex"
            padding="15px"
            justifyContent="space-between"
            alignItems="center"
            key={index}
          >
            <Typography
              sx={{ padding: "1rem" }}
              key={post._id}
              variant="body1"
              fontFamily="Space Grotesk"
              width="70%"
            >
              Post {index + 1} :{" "}
              <b>{String(post.postTitle).toLocaleUpperCase()}</b> :{" "}
              {post.postDescription}
            </Typography>
            <ArrowSquareOut
              size={25}
              style={{
                padding: "0.75rem",
                backgroundColor: "lightblue",
                borderRadius: "50%",
              }}
              onClick={() => window.open(`/${post.uniqueId}`, "_blank")}
            />
            <Typography
              variant="subtitle1"
              fontFamily="Space Grotesk"
              position="absolute"
              bottom="50px"
              textAlign="center"
              color="grey"
              width="95%"
            >
              (You haven't opened a valid URL.)
              <p />
              (But here are few random published articles)
            </Typography>
          </Box>
        ))
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default DashboardWithoutId;
