import { generatedApi } from "./generatedApi.ts";

export const enhancedApi = generatedApi.enhanceEndpoints({
  addTagTypes: ["Post", "Activity", "Comment", "User"],
  endpoints: {
    activitiesList: {
      providesTags: ["Activity"],
    },
    activitiesCreate: {
      invalidatesTags: ["Activity"],
    },
    postsList: {
      providesTags: ["Post"],
    },
    searchPostsList: {
      providesTags: ["Post"],
    },
    postsCreate: {
      invalidatesTags: ["Post", "Activity"],
    },
    postsUpdate: {
      invalidatesTags: ["Post", "Activity"],
    },
    postsDestroy: {
      invalidatesTags: ["Post", "Activity"],
    },
    postsLikeCreate: {
      invalidatesTags: ["Post", "Activity"],
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
    meRetrieve: {
      providesTags: ["User"],
    },
    meUpdate: {
      invalidatesTags: ["User", "Activity", "Post", "Comment"],
    },
    mePartialUpdate: {
      invalidatesTags: ["User"],
    },
    usersList: {
      providesTags: ["User"],
    },
  },
});

export const {
  useActivitiesListQuery,
  useActivitiesCreateMutation,
  useCommentsRetrieveQuery,
  useCommentsUpdateMutation,
  useCommentsDestroyMutation,
  useLoginCreateMutation,
  useMeRetrieveQuery,
  useMeUpdateMutation,
  useMePartialUpdateMutation,
  usePostsListQuery,
  usePostsCreateMutation,
  usePostsRetrieveQuery,
  usePostsUpdateMutation,
  usePostsDestroyMutation,
  usePostsCommentsListQuery,
  usePostsCommentsCreateMutation,
  usePostsLikeCreateMutation,
  useSearchPostsListQuery,
  useSignupCreateMutation,
  useUsersListQuery,
  useUsersPostsListQuery,
} = enhancedApi;
