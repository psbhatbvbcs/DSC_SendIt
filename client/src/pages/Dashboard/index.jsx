import { Box, Typography } from "@mui/material";
import { CaretLeft, CaretRight, SignIn, ThumbsUp } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { api } from "../../utils/axiosProvider";
import { ThumbsDown } from "@phosphor-icons/react/dist/ssr";
import { toastEnd, toastStart } from "../../utils/customToaster";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const { uniqueId } = useParams();
  const [postData, setPostData] = useState([]);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/getPost/getPostWithId/${uniqueId}`, {
          withCredentials: true,
        });
        // Sorting the postContent array based on pageNo
        const post = response.data.post;
        const sortedPostData = post?.postContent.sort(
          (a, b) => a.pageNo - b.pageNo
        );
        const newPostData = { ...post, postContent: sortedPostData };
        setPostData(newPostData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [uniqueId]);

  const handleUpvote = async () => {
    if (!downvoted) {
      toastStart("Loading...");
      try {
        const response = await api.post(
          `/actions/upvote/${uniqueId}`,
          { action: !downvoted ? (upvoted ? "-1" : "1") : "0" },
          { withCredentials: true }
        );
        toastEnd();
        toast.success(upvoted ? ":`(" : "Thank You!");
        setUpvoted((prev) => !prev);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDownvote = async () => {
    if (!upvoted) {
      toastStart("Loading...");
      try {
        const response = await api.post(
          `/actions/downvote/${uniqueId}`,
          { action: !upvoted ? (downvoted ? "-1" : "1") : "0" },
          { withCredentials: true }
        );
        toastEnd();
        toast.success(downvoted ? "Thank you!" : "We will try to improve!");
        setDownvoted((prev) => !prev);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      bgcolor="lightblue"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="1rem"
    >
      {currentPage === 0 ? (
        <>
          {" "}
          <Box
            padding="1rem"
            border="1px dashed grey"
            width="max-content"
            borderRadius="50%"
            boxShadow="0 4px 18px rgba(0, 0, 0, 0.4)"
            sx={{
              transition: "all 0.3s ease-in-out", // Move the transition property here
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "white",
              },
              animation: "pulse 2s infinite", // Name of the animation, duration, and iteration count
              "@keyframes pulse": {
                "0%": {
                  transform: "scale(1)",
                  opacity: 1,
                  bgcolor: "#fff",
                },
                "50%": {
                  transform: "scale(1.2)",
                  opacity: 0.6,
                },
                "100%": {
                  transform: "scale(1)",
                  opacity: 1,
                  bgcolor: "#fff",
                },
              },
            }}
            onClick={() => setCurrentPage(1)}
          >
            <SignIn size={100} color="black" />
          </Box>
          <Typography
            variant="h5"
            fontFamily="Space Grotesk"
            textAlign="center"
          >
            Enter the realm of
            <br />
            <b>Developer Student Club!</b>
          </Typography>
        </>
      ) : (
        <>
          {postData && Object.keys(postData)?.length ? (
            currentPage === 1 ? (
              <Box
                width="100%"
                height="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  variant="h4"
                  fontFamily="Space Grotesk"
                  textAlign="center"
                  sx={{
                    animation: "fadeIn 1s ease-in-out infinite",
                    "@keyframes fadeIn": {
                      "0%": {
                        transform: "scale(1)",
                        opacity: 1,
                        bgcolor: "#fff",
                      },
                      "50%": {
                        transform: "scale(1.2)",
                        opacity: 0.6,
                      },
                      "100%": {
                        transform: "scale(1)",
                        opacity: 1,
                        bgcolor: "#fff",
                      },
                    },
                  }}
                >
                  {String(postData?.postTitle).toLocaleUpperCase()}
                </Typography>
                <Typography
                  variant="h6"
                  fontFamily="Space Grotesk"
                  textAlign="center"
                  sx={{
                    animation: "fadeIn 1s ease-in-out infinite",
                    "@keyframes fadeIn": {
                      "0%": {
                        transform: "scale(1)",
                        opacity: 1,
                      },
                      "50%": {
                        transform: "scale(1.06)",
                        opacity: 0.7,
                      },
                      "100%": {
                        transform: "scale(1)",
                        opacity: 1,
                      },
                    },
                  }}
                >
                  {postData?.postDescription}
                </Typography>
                <Box
                  position="absolute"
                  sx={{
                    top: "auto",
                    bottom: 0,
                    right: 2,
                    left: "auto",
                    transform: "translateY(-150px)",
                    bgcolor: "rgba(255,255,255,0.8)",
                    borderRadius: "50%",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    m: "3px",
                  }}
                  onClick={() => setCurrentPage(2)}
                >
                  <CaretRight size={24} weight="bold" />
                </Box>
                <Box
                  position="absolute"
                  sx={{
                    top: "auto",
                    bottom: 0,
                    right: "auto",
                    left: 2,
                    transform: "translateY(-150px)",
                    bgcolor: "rgba(255,255,255,0.8)",
                    borderRadius: "50%",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    m: "3px",
                  }}
                  onClick={() => setCurrentPage(0)}
                >
                  <CaretLeft size={24} weight="bold" />
                </Box>
              </Box>
            ) : (
              <>
                {postData?.postContent && postData?.postContent?.length ? (
                  <>
                    {currentPage - 1 <= postData?.postContent?.length ? (
                      <>
                        {postData?.postContent &&
                        postData?.postContent.length ? (
                          postData?.postContent.map((post, index) => (
                            <React.Fragment key={index}>
                              {post.pageNo === currentPage - 1 && (
                                <Box
                                  width="100%"
                                  height="100%"
                                  display="flex"
                                  flexDirection="column"
                                  alignItems="flex-start"
                                  justifyContent="center"
                                >
                                  {post.contentType === "Image" ? (
                                    <img
                                      width="100%"
                                      src={post?.pageContent}
                                      alt={`Page ${post.pageNo}`}
                                    />
                                  ) : (
                                    <>
                                      <Box
                                        width="100%"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                      >
                                        <div
                                          style={{
                                            width: "95%",
                                            marginTop: "4.5rem",
                                            fontFamily: "Space Grotesk",
                                            overflow: "auto", // You can use "hidden", "scroll", "auto", etc.
                                            wordWrap: "break-word",
                                          }}
                                          dangerouslySetInnerHTML={{
                                            __html: post?.pageContent,
                                          }}
                                        ></div>
                                      </Box>
                                    </>
                                  )}
                                </Box>
                              )}
                              <Box
                                position="absolute"
                                sx={{
                                  top: "auto",
                                  bottom: 0,
                                  right: 2,
                                  left: "auto",
                                  transform: "translateY(-150px)",
                                  bgcolor: "rgba(255,255,255,0.8)",
                                  borderRadius: "50%",
                                  padding: "0.5rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  m: "3px",
                                }}
                                onClick={() =>
                                  setCurrentPage((prevPage) => prevPage + 1)
                                }
                              >
                                <CaretRight size={24} weight="bold" />
                              </Box>
                              <Box
                                position="absolute"
                                sx={{
                                  top: "auto",
                                  bottom: 0,
                                  right: "auto",
                                  left: 2,
                                  transform: "translateY(-150px)",
                                  bgcolor: "rgba(255,255,255,0.8)",
                                  borderRadius: "50%",
                                  padding: "0.5rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  m: "3px",
                                }}
                                onClick={() =>
                                  setCurrentPage((prevPage) =>
                                    Math.max(prevPage - 1, 0)
                                  )
                                }
                              >
                                <CaretLeft size={24} weight="bold" />
                              </Box>
                            </React.Fragment>
                          ))
                        ) : (
                          <>Loading...</>
                        )}
                      </>
                    ) : (
                      <>
                        <Box
                          width="100%"
                          display="flex"
                          justifyContent="space-evenly"
                          alignItems="center"
                        >
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            gap="5px"
                            onClick={handleUpvote}
                          >
                            <Typography
                              variant="subtitle1"
                              fontFamily="Space Grotesk"
                              fontWeight={500}
                            >
                              Great! :)
                            </Typography>
                            <ThumbsUp
                              size={38}
                              weight="bold"
                              style={{
                                backgroundColor: !upvoted
                                  ? "rgba(255,255,255,0.4)"
                                  : "lightgreen",
                                padding: "1rem",
                                borderRadius: "50%",
                              }}
                            />
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            gap="5px"
                            onClick={handleDownvote}
                          >
                            <ThumbsDown
                              size={38}
                              weight="bold"
                              style={{
                                backgroundColor: !downvoted
                                  ? "rgba(255,255,255,0.4)"
                                  : "lightgrey",
                                padding: "1rem",
                                borderRadius: "50%",
                              }}
                            />
                            <Typography
                              variant="subtitle1"
                              fontFamily="Space Grotesk"
                              fontWeight={500}
                            >
                              Next time :(
                            </Typography>
                          </Box>

                          <Box
                            position="absolute"
                            sx={{
                              top: "auto",
                              bottom: 0,
                              right: "auto",
                              left: 2,
                              transform: "translateY(-150px)",
                              bgcolor: "rgba(255,255,255,0.8)",
                              borderRadius: "50%",
                              padding: "0.5rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              m: "3px",
                            }}
                            onClick={() =>
                              setCurrentPage((prevPage) =>
                                Math.max(prevPage - 1, 0)
                              )
                            }
                          >
                            <CaretLeft size={24} weight="bold" />
                          </Box>
                        </Box>
                        <Typography
                          sx={{
                            bottom: "25px",
                            top: "auto",
                            position: "absolute",
                            textDecoration: "underline",
                          }}
                          onClick={() => setCurrentPage(0)}
                        >
                          Exit
                        </Typography>
                      </>
                    )}
                  </>
                ) : (
                  <>Hi</>
                )}
              </>
            )
          ) : (
            <>Error</>
          )}
        </>
      )}
    </Box>
  );
};

export default Dashboard;
