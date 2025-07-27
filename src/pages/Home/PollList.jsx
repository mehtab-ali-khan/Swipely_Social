import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Box,
  Button,
  Paper,
  Card,
  CardContent,
  Fade,
  Zoom,
  useTheme,
  alpha,
  LinearProgress,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Poll as PollIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as RadioIcon,
} from "@mui/icons-material";
import { formatDistanceToNow, parseISO } from "date-fns";
import { usePollListQuery, useVoteCreateMutation } from "../../store/api";
import { useLocation } from "react-router-dom";

function PollCard({ poll, index }) {
  const theme = useTheme();
  const [vote] = useVoteCreateMutation();
  const [isVoting, setIsVoting] = useState(false);

  // Find which option the user has voted for (if any)
  const getVotedOption = () => {
    return poll.options.find((option) => option.has_voted);
  };

  const votedOption = getVotedOption();
  const hasVoted = !!votedOption;

  // Calculate total votes
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  const handleVote = async (option) => {
    if (isVoting) return;

    setIsVoting(true);
    try {
      await vote({ optionId: option.id }).unwrap();
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const getVotePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const formatTimeAgo = (dateString) => {
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  return (
    <Zoom in timeout={300 + index * 100}>
      <Card
        id={`poll-${poll.id}`}
        sx={{
          mb: 3,
          borderRadius: 4,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.3)"
              : "0 8px 32px rgba(0,0,0,0.1)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          backdropFilter: "blur(20px)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 12px 48px rgba(0,0,0,0.4)"
                : "0 12px 48px rgba(0,0,0,0.15)",
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          {/* Poll Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              src={poll?.userPic}
              sx={{
                width: 48,
                height: 48,
                mr: 2,
                border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {poll.user?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ textTransform: "capitalize" }}
              >
                {poll.user || "Anonymous"}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
              >
                <TimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  {formatTimeAgo(poll.created_at)}
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={<PollIcon />}
              label="Poll"
              variant="outlined"
              sx={{
                borderColor: theme.palette.info.main,
                color: theme.palette.info.main,
                background: alpha(theme.palette.info.main, 0.1),
                fontWeight: 600,
                "&:hover": {
                  background: alpha(theme.palette.info.main, 0.2),
                },
              }}
            />
          </Box>

          {/* Poll Question */}
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{
              mb: 4,
              color: theme.palette.text.primary,
              lineHeight: 1.4,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PollIcon
              sx={{
                color: theme.palette.primary.main,
                fontSize: "1.2em",
              }}
            />
            {poll.question}
          </Typography>

          {/* Poll Options */}
          <Box sx={{ mb: 4 }}>
            {poll.options.map((option) => {
              const percentage = getVotePercentage(option.votes);
              const isSelected = option.has_voted;

              return (
                <Box key={option.id} sx={{ mb: 2 }}>
                  <Button
                    fullWidth
                    variant={hasVoted ? "outlined" : "text"}
                    onClick={() => handleVote(option)}
                    disabled={isVoting}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 500,
                      justifyContent: "flex-start",
                      position: "relative",
                      overflow: "hidden",
                      border: hasVoted
                        ? `2px solid ${
                            isSelected
                              ? theme.palette.primary.main
                              : alpha(theme.palette.divider, 0.3)
                          }`
                        : `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                      background: hasVoted
                        ? isSelected
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.action.hover, 0.02)
                        : alpha(theme.palette.action.hover, 0.02),
                      color: hasVoted
                        ? isSelected
                          ? theme.palette.primary.main
                          : theme.palette.text.primary
                        : theme.palette.text.primary,
                      "&:hover": {
                        background: hasVoted
                          ? isSelected
                            ? alpha(theme.palette.primary.main, 0.15)
                            : alpha(theme.palette.action.hover, 0.05)
                          : alpha(theme.palette.primary.main, 0.05),
                        borderColor: hasVoted
                          ? isSelected
                            ? theme.palette.primary.main
                            : theme.palette.primary.light
                          : theme.palette.primary.main,
                        transform: "translateY(-1px)",
                      },
                      "&:disabled": {
                        color: hasVoted
                          ? isSelected
                            ? theme.palette.primary.main
                            : theme.palette.text.primary
                          : theme.palette.text.disabled,
                        opacity: isVoting ? 0.7 : 1,
                      },
                    }}
                  >
                    {/* Progress Bar Background for voted options */}
                    {hasVoted && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          width: `${percentage}%`,
                          background: isSelected
                            ? `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.1)})`
                            : `linear-gradient(90deg, ${alpha(theme.palette.action.hover, 0.1)}, ${alpha(theme.palette.action.hover, 0.05)})`,
                          transition: "width 1s ease-in-out",
                          borderRadius: "10px",
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        {hasVoted ? (
                          isSelected ? (
                            <CheckIcon
                              sx={{
                                color: theme.palette.primary.main,
                                fontSize: 24,
                              }}
                            />
                          ) : (
                            <RadioIcon
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: 24,
                              }}
                            />
                          )
                        ) : (
                          <RadioIcon
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: 24,
                            }}
                          />
                        )}
                        <Typography
                          variant="body1"
                          fontWeight={isSelected ? 700 : 500}
                        >
                          {option.option}
                        </Typography>
                      </Box>

                      {hasVoted && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={600}
                          >
                            {option.votes} vote{option.votes !== 1 ? "s" : ""}
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="700"
                            color={isSelected ? "primary.main" : "text.primary"}
                          >
                            {percentage}%
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Button>
                </Box>
              );
            })}
          </Box>

          {/* Poll Stats */}
          {hasVoted && (
            <Fade in timeout={500}>
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 3,
                  background: alpha(theme.palette.info.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Total Votes
                  </Typography>
                  <Typography variant="h6" fontWeight="700" color="info.main">
                    {totalVotes}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: alpha(theme.palette.info.main, 0.1),
                    "& .MuiLinearProgress-bar": {
                      background: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.info.light})`,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Fade>
          )}

          {/* Vote Prompt */}
          {!hasVoted && !isVoting && (
            <Box
              sx={{
                textAlign: "center",
                mt: 3,
                p: 2,
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.05),
                border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Typography
                variant="body1"
                color="primary"
                fontWeight="600"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <PollIcon fontSize="small" />
                Click on an option to cast your vote!
              </Typography>
            </Box>
          )}

          {/* Voting indicator */}
          {isVoting && (
            <Box
              sx={{
                textAlign: "center",
                mt: 3,
                p: 2,
                borderRadius: 3,
                background: alpha(theme.palette.info.main, 0.05),
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
              }}
            >
              <Typography
                variant="body1"
                color="info.main"
                fontWeight="600"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <PollIcon fontSize="small" />
                Casting your vote...
              </Typography>
            </Box>
          )}

          {/* Re-vote prompt */}
          {hasVoted && !isVoting && (
            <Box
              sx={{
                textAlign: "center",
                mt: 2,
                p: 2,
                borderRadius: 3,
                background: alpha(theme.palette.success.main, 0.05),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              }}
            >
              <Typography
                variant="body2"
                color="success.main"
                fontWeight="500"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <CheckIcon fontSize="small" />
                You voted for "{votedOption?.option}". Click another option to
                change your vote.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Zoom>
  );
}

function PollList() {
  const theme = useTheme();
  const { data: polls, isLoading, error } = usePollListQuery();

  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;

    if (hash.startsWith("#poll-")) {
      const pollId = hash.replace("#poll-", "");
      const element = document.getElementById(`poll-${pollId}`);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      } else {
        const timer = setInterval(() => {
          const el = document.getElementById(`poll-${pollId}`);
          if (el) {
            el.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            clearInterval(timer);
          }
        }, 100);
        return () => clearInterval(timer);
      }
    }
  }, [location.hash]); // React to hash changes

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 680,
          mx: "auto",
          mt: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading polls...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 680,
          mx: "auto",
          mt: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="error">
          Failed to load polls
        </Typography>
      </Box>
    );
  }

  if (!polls?.length) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 680,
          mx: "auto",
          mt: 4,
        }}
      >
        <Fade in timeout={300}>
          <Card
            sx={{
              borderRadius: 4,
              textAlign: "center",
              py: 6,
              px: 4,
              background: alpha(theme.palette.action.hover, 0.02),
            }}
          >
            <CardContent>
              <PollIcon
                sx={{
                  fontSize: 64,
                  color: "text.secondary",
                  mb: 2,
                }}
              />
              <Typography
                variant="h5"
                color="text.secondary"
                fontWeight="600"
                gutterBottom
              >
                No polls available
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Be the first to create a poll and engage with the community!
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      </Box>
    );
  }

  return (
    <Box
      className="poll-container"
      sx={{
        width: "100%",
        maxWidth: 680,
        mx: "auto",
      }}
    >
      {/* Header */}
      <Zoom in timeout={300}>
        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "white",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1.5" fill="white" opacity="0.1"/></svg>\')',
            },
          }}
        >
          <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PollIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="800">
                  Community Polls
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                  Share your opinions and see what others think
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Zoom>

      {/* Polls List */}
      {polls?.map((poll, index) => (
        <PollCard key={`${poll.question}-${index}`} poll={poll} index={index} />
      ))}
    </Box>
  );
}

export default PollList;
