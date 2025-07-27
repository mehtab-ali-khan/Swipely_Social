import { generatedApi } from "./generatedApi.ts";

export const enhancedApi = generatedApi.enhanceEndpoints({
  addTagTypes: [
    "Post",
    "Activity",
    "Comment",
    "User",
    "Poll",
    "PollOption",
    "Vote",
    "Friend",
    "FriendRequest",
    "SuggestedFriend",
    "FriendsChat",
  ],
  endpoints: {
    // Activities
    activitiesList: {
      providesTags: ["Activity"],
    },

    // Posts
    postsList: {
      providesTags: ["Post"],
    },
    searchPostsList: {
      providesTags: ["Post"],
    },
    postsCreate: {
      invalidatesTags: ["Post", "Activity"],
    },
    postsRetrieve: {
      providesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    },
    postsUpdate: {
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.id },
        "Post",
        "Activity",
      ],
    },
    postsDestroy: {
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.id },
        "Post",
        "Activity",
      ],
    },
    postsLikeCreate: {
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.postId },
        "Post",
        "Activity",
      ],
    },
    usersPostsList: {
      providesTags: (result, error, arg) => [
        { type: "Post", id: `USER_${arg.userId}` },
        "Post",
      ],
    },

    // Comments
    commentsRetrieve: {
      providesTags: (result, error, arg) => [{ type: "Comment", id: arg.id }],
    },
    commentsUpdate: {
      invalidatesTags: (result, error, arg) => [
        { type: "Comment", id: arg.id },
        "Post",
        "Activity",
      ],
    },
    commentsDestroy: {
      invalidatesTags: (result, error, arg) => [
        { type: "Comment", id: arg.id },
        "Post",
        "Activity",
      ],
    },
    postsCommentsList: {
      providesTags: (result, error, arg) => [
        { type: "Comment", id: `POST_${arg.postId}` },
        ...(result?.map((comment) => ({
          type: "Comment" as const,
          id: comment.id,
        })) || []),
      ],
    },
    postsCommentsCreate: {
      invalidatesTags: (result, error, arg) => [
        { type: "Comment", id: `POST_${arg.postId}` },
        { type: "Post", id: arg.postId },
        "Post",
        "Activity",
      ],
    },

    // Polls
    pollList: {
      providesTags: (result) => [
        "Poll",
        ...(result?.map((poll) => ({
          type: "Poll" as const,
          id: poll.id,
        })) || []),
      ],
    },
    pollCreate: {
      invalidatesTags: ["Poll", "Activity"],
    },

    // Votes
    voteCreate: {
      invalidatesTags: (result, error, arg) => [
        { type: "Vote", id: arg.optionId },
        { type: "PollOption", id: arg.optionId },
        "Poll",
        "Vote",
        "Activity",
      ],
    },

    // Users
    meRetrieve: {
      providesTags: ["User"],
    },
    meUpdate: {
      invalidatesTags: ["User", "Post", "Comment"],
    },
    mePartialUpdate: {
      invalidatesTags: ["User"],
    },

    // Friends
    friendsList: {
      providesTags: (result) => [
        "Friend",
        ...(result?.map((friend) => ({
          type: "Friend" as const,
          id: friend.id,
        })) || []),
      ],
    },
    friendSendRequestCreate: {
      invalidatesTags: (result, error, arg) => [
        "FriendRequest",
        "SuggestedFriend",
        { type: "User", id: arg.userId },
        "Activity",
      ],
    },

    // Friend Requests
    friendRequestsList: {
      providesTags: (result) => [
        "FriendRequest",
        ...(result?.map((request) => ({
          type: "FriendRequest" as const,
          id: request.sender,
        })) || []),
      ],
    },
    friendRequestCreate: {
      invalidatesTags: (result, error, arg) => [
        { type: "FriendRequest", id: arg.userId },
        "FriendRequest",
        "Friend",
        "SuggestedFriend",
        "Activity",
      ],
    },

    // Suggested Friends
    suggestedFriendsList: {
      providesTags: (result) => [
        "SuggestedFriend",
        ...(result?.map((friend) => ({
          type: "SuggestedFriend" as const,
          id: friend.id,
        })) || []),
      ],
    },
    friendsChatList: {
      providesTags: ["FriendsChat"],
    },
  },
});

export const {
  // Activities
  useActivitiesListQuery,

  // Comments
  useCommentsRetrieveQuery,
  useCommentsUpdateMutation,
  useCommentsDestroyMutation,

  // Authentication
  useLoginCreateMutation,
  useSignupCreateMutation,

  // User Profile
  useMeRetrieveQuery,
  useMeUpdateMutation,
  useMePartialUpdateMutation,

  // Posts
  usePostsListQuery,
  usePostsCreateMutation,
  usePostsRetrieveQuery,
  usePostsUpdateMutation,
  usePostsDestroyMutation,
  usePostsCommentsListQuery,
  usePostsCommentsCreateMutation,
  usePostsLikeCreateMutation,
  useSearchPostsListQuery,
  useUsersPostsListQuery,

  // Polls & Voting
  usePollListQuery,
  usePollCreateMutation,
  useVoteCreateMutation,

  // Friends & Social
  useFriendsListQuery,
  useFriendSendRequestCreateMutation,
  useFriendRequestsListQuery,
  useFriendRequestCreateMutation,
  useSuggestedFriendsListQuery,
  useFriendsChatListQuery,
} = enhancedApi;
