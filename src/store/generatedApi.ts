import { api } from "./emptyApi.ts";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    activitiesList: build.query<
      ActivitiesListApiResponse,
      ActivitiesListApiArg
    >({
      query: () => ({ url: `/activities/` }),
    }),
    commentsRetrieve: build.query<
      CommentsRetrieveApiResponse,
      CommentsRetrieveApiArg
    >({
      query: (queryArg) => ({ url: `/comments/${queryArg.id}/` }),
    }),
    commentsUpdate: build.mutation<
      CommentsUpdateApiResponse,
      CommentsUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/comments/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.commentCreateUpdate,
      }),
    }),
    commentsDestroy: build.mutation<
      CommentsDestroyApiResponse,
      CommentsDestroyApiArg
    >({
      query: (queryArg) => ({
        url: `/comments/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    friendSendRequestCreate: build.mutation<
      FriendSendRequestCreateApiResponse,
      FriendSendRequestCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/friend/${queryArg.userId}/send_request/`,
        method: "POST",
      }),
    }),
    friendRequestCreate: build.mutation<
      FriendRequestCreateApiResponse,
      FriendRequestCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/friend_request/${queryArg.userId}/${queryArg.q}/`,
        method: "POST",
      }),
    }),
    friendRequestsList: build.query<
      FriendRequestsListApiResponse,
      FriendRequestsListApiArg
    >({
      query: () => ({ url: `/friend_requests/` }),
    }),
    friendsList: build.query<FriendsListApiResponse, FriendsListApiArg>({
      query: () => ({ url: `/friends/` }),
    }),
    friendsChatList: build.query<
      FriendsChatListApiResponse,
      FriendsChatListApiArg
    >({
      query: (queryArg) => ({ url: `/friends_chat/${queryArg.friendId}/` }),
    }),
    loginCreate: build.mutation<LoginCreateApiResponse, LoginCreateApiArg>({
      query: (queryArg) => ({
        url: `/login/`,
        method: "POST",
        body: queryArg.login,
      }),
    }),
    meRetrieve: build.query<MeRetrieveApiResponse, MeRetrieveApiArg>({
      query: () => ({ url: `/me/` }),
    }),
    meUpdate: build.mutation<MeUpdateApiResponse, MeUpdateApiArg>({
      query: (queryArg) => ({
        url: `/me/`,
        method: "PUT",
        body: queryArg.profileUpdate,
      }),
    }),
    mePartialUpdate: build.mutation<
      MePartialUpdateApiResponse,
      MePartialUpdateApiArg
    >({
      query: (queryArg) => ({
        url: `/me/`,
        method: "PATCH",
        body: queryArg.patchedProfileUpdate,
      }),
    }),
    pollList: build.query<PollListApiResponse, PollListApiArg>({
      query: () => ({ url: `/poll/` }),
    }),
    pollCreate: build.mutation<PollCreateApiResponse, PollCreateApiArg>({
      query: (queryArg) => ({
        url: `/poll/`,
        method: "POST",
        body: queryArg.pollListCreate,
      }),
    }),
    postsList: build.query<PostsListApiResponse, PostsListApiArg>({
      query: (queryArg) => ({
        url: `/posts/`,
        params: {
          page: queryArg.page,
          page_size: queryArg.pageSize,
        },
      }),
    }),
    postsCreate: build.mutation<PostsCreateApiResponse, PostsCreateApiArg>({
      query: (queryArg) => ({
        url: `/posts/`,
        method: "POST",
        body: queryArg.postCreateUpdate,
      }),
    }),
    postsRetrieve: build.query<PostsRetrieveApiResponse, PostsRetrieveApiArg>({
      query: (queryArg) => ({ url: `/posts/${queryArg.id}/` }),
    }),
    postsUpdate: build.mutation<PostsUpdateApiResponse, PostsUpdateApiArg>({
      query: (queryArg) => ({
        url: `/posts/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.postCreateUpdate,
      }),
    }),
    postsDestroy: build.mutation<PostsDestroyApiResponse, PostsDestroyApiArg>({
      query: (queryArg) => ({
        url: `/posts/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    postsCommentsList: build.query<
      PostsCommentsListApiResponse,
      PostsCommentsListApiArg
    >({
      query: (queryArg) => ({ url: `/posts/${queryArg.postId}/comments/` }),
    }),
    postsCommentsCreate: build.mutation<
      PostsCommentsCreateApiResponse,
      PostsCommentsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/posts/${queryArg.postId}/comments/`,
        method: "POST",
        body: queryArg.commentCreateUpdate,
      }),
    }),
    postsLikeCreate: build.mutation<
      PostsLikeCreateApiResponse,
      PostsLikeCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/posts/${queryArg.postId}/like/`,
        method: "POST",
      }),
    }),
    searchPostsList: build.query<
      SearchPostsListApiResponse,
      SearchPostsListApiArg
    >({
      query: (queryArg) => ({
        url: `/search_posts/${queryArg.q}/`,
        params: {
          page: queryArg.page,
          page_size: queryArg.pageSize,
        },
      }),
    }),
    signupCreate: build.mutation<SignupCreateApiResponse, SignupCreateApiArg>({
      query: (queryArg) => ({
        url: `/signup/`,
        method: "POST",
        body: queryArg.signup,
      }),
    }),
    suggestedFriendsList: build.query<
      SuggestedFriendsListApiResponse,
      SuggestedFriendsListApiArg
    >({
      query: () => ({ url: `/suggested_friends/` }),
    }),
    usersPostsList: build.query<
      UsersPostsListApiResponse,
      UsersPostsListApiArg
    >({
      query: (queryArg) => ({
        url: `/users/${queryArg.userId}/posts/`,
        params: {
          page: queryArg.page,
          page_size: queryArg.pageSize,
        },
      }),
    }),
    voteCreate: build.mutation<VoteCreateApiResponse, VoteCreateApiArg>({
      query: (queryArg) => ({
        url: `/vote/${queryArg.optionId}/`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as generatedApi };
export type ActivitiesListApiResponse = /** status 200  */ ActivitiesGetRead[];
export type ActivitiesListApiArg = void;
export type CommentsRetrieveApiResponse = /** status 200  */ CommentListRead;
export type CommentsRetrieveApiArg = {
  id: number;
};
export type CommentsUpdateApiResponse = /** status 200  */ CommentCreateUpdate;
export type CommentsUpdateApiArg = {
  id: number;
  commentCreateUpdate: CommentCreateUpdate;
};
export type CommentsDestroyApiResponse = unknown;
export type CommentsDestroyApiArg = {
  id: number;
};
export type FriendSendRequestCreateApiResponse = unknown;
export type FriendSendRequestCreateApiArg = {
  userId: number;
};
export type FriendRequestCreateApiResponse = unknown;
export type FriendRequestCreateApiArg = {
  q: string;
  userId: number;
};
export type FriendRequestsListApiResponse =
  /** status 200  */ RequestsGetRead[];
export type FriendRequestsListApiArg = void;
export type FriendsListApiResponse = /** status 200  */ FriendRead[];
export type FriendsListApiArg = void;
export type FriendsChatListApiResponse = /** status 200  */ FriendsChatRead[];
export type FriendsChatListApiArg = {
  friendId: number;
};
export type LoginCreateApiResponse = /** status 200  */ Login;
export type LoginCreateApiArg = {
  login: Login;
};
export type MeRetrieveApiResponse = /** status 200  */ MeRead;
export type MeRetrieveApiArg = void;
export type MeUpdateApiResponse = /** status 200  */ ProfileUpdate;
export type MeUpdateApiArg = {
  profileUpdate: ProfileUpdate;
};
export type MePartialUpdateApiResponse = /** status 200  */ ProfileUpdate;
export type MePartialUpdateApiArg = {
  patchedProfileUpdate: PatchedProfileUpdate;
};
export type PollListApiResponse = /** status 200  */ PollListCreateRead[];
export type PollListApiArg = void;
export type PollCreateApiResponse = /** status 201  */ PollListCreateRead;
export type PollCreateApiArg = {
  pollListCreate: PollListCreate;
};
export type PostsListApiResponse = /** status 200  */ PaginatedPostListListRead;
export type PostsListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
  /** Number of results to return per page. */
  pageSize?: number;
};
export type PostsCreateApiResponse = /** status 201  */ PostCreateUpdate;
export type PostsCreateApiArg = {
  postCreateUpdate: PostCreateUpdate;
};
export type PostsRetrieveApiResponse = /** status 200  */ PostListRead;
export type PostsRetrieveApiArg = {
  id: number;
};
export type PostsUpdateApiResponse = /** status 200  */ PostCreateUpdate;
export type PostsUpdateApiArg = {
  id: number;
  postCreateUpdate: PostCreateUpdate;
};
export type PostsDestroyApiResponse = unknown;
export type PostsDestroyApiArg = {
  id: number;
};
export type PostsCommentsListApiResponse = /** status 200  */ CommentListRead[];
export type PostsCommentsListApiArg = {
  postId: number;
};
export type PostsCommentsCreateApiResponse =
  /** status 201  */ CommentCreateUpdate;
export type PostsCommentsCreateApiArg = {
  postId: number;
  commentCreateUpdate: CommentCreateUpdate;
};
export type PostsLikeCreateApiResponse = unknown;
export type PostsLikeCreateApiArg = {
  postId: number;
};
export type SearchPostsListApiResponse =
  /** status 200  */ PaginatedPostListListRead;
export type SearchPostsListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
  /** Number of results to return per page. */
  pageSize?: number;
  q: string;
};
export type SignupCreateApiResponse = /** status 201  */ Signup;
export type SignupCreateApiArg = {
  signup: SignupWrite;
};
export type SuggestedFriendsListApiResponse =
  /** status 200  */ SuggestedFriendRead[];
export type SuggestedFriendsListApiArg = void;
export type UsersPostsListApiResponse =
  /** status 200  */ PaginatedPostListListRead;
export type UsersPostsListApiArg = {
  /** A page number within the paginated result set. */
  page?: number;
  /** Number of results to return per page. */
  pageSize?: number;
  userId: number;
};
export type VoteCreateApiResponse = unknown;
export type VoteCreateApiArg = {
  optionId: number;
};
export type ActivitiesGet = {
  post?: number | null;
  poll?: number | null;
  content: string;
};
export type ActivitiesGetRead = {
  id: number;
  user: string;
  userPic: string;
  post?: number | null;
  poll?: number | null;
  content: string;
  created_at: string;
};
export type CommentList = {
  user: number;
  content: string;
};
export type CommentListRead = {
  id: number;
  user: number;
  content: string;
  created_at: string;
};
export type CommentCreateUpdate = {
  content: string;
};
export type RequestsGet = {
  sender: number;
};
export type RequestsGetRead = {
  sender: number;
  created_at: string;
};
export type Friend = {
  email: string;
  bio?: string | null;
  profile_pic?: string | null;
};
export type FriendRead = {
  id: number;
  full_name: string;
  email: string;
  bio?: string | null;
  profile_pic?: string | null;
};
export type FriendsChat = {
  sender: number;
  receiver: number;
  message: string;
};
export type FriendsChatRead = {
  sender: number;
  receiver: number;
  message: string;
  timestamp: string;
};
export type Login = {
  email: string;
  password: string;
};
export type Me = {
  first_name?: string;
  last_name?: string;
  email: string;
  bio?: string | null;
  profile_pic?: string | null;
  cover_pic?: string | null;
};
export type MeRead = {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  bio?: string | null;
  profile_pic?: string | null;
  cover_pic?: string | null;
};
export type ProfileUpdate = {
  bio?: string | null;
  profile_pic?: string | null;
  cover_pic?: string | null;
};
export type PatchedProfileUpdate = {
  bio?: string | null;
  profile_pic?: string | null;
  cover_pic?: string | null;
};
export type PollOption = {
  option: string;
};
export type PollOptionRead = {
  id: number;
  option: string;
  has_voted: boolean;
  votes: number;
};
export type PollListCreate = {
  question: string;
  options: PollOption[];
};
export type PollListCreateRead = {
  id: number;
  user: number;
  question: string;
  created_at: string;
  options: PollOptionRead[];
};
export type PostList = {
  user: number;
  content: string;
  image?: string | null;
};
export type PostListRead = {
  id: number;
  user: number;
  content: string;
  image?: string | null;
  no_of_likes: number;
  no_of_comments: number;
  has_liked: boolean;
  created_at: string;
};
export type PaginatedPostListList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: PostList[];
};
export type PaginatedPostListListRead = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: PostListRead[];
};
export type PostCreateUpdate = {
  content: string;
  image?: string | null;
};
export type Signup = {
  first_name?: string;
  last_name?: string;
  email: string;
};
export type SignupWrite = {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
};
export type SuggestedFriend = {
  first_name?: string;
  last_name?: string;
  email: string;
  bio?: string | null;
  profile_pic?: string | null;
  cover_pic?: string | null;
};
export type SuggestedFriendRead = {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  bio?: string | null;
  profile_pic?: string | null;
  cover_pic?: string | null;
  status: boolean;
};
export const {
  useActivitiesListQuery,
  useCommentsRetrieveQuery,
  useCommentsUpdateMutation,
  useCommentsDestroyMutation,
  useFriendSendRequestCreateMutation,
  useFriendRequestCreateMutation,
  useFriendRequestsListQuery,
  useFriendsListQuery,
  useFriendsChatListQuery,
  useLoginCreateMutation,
  useMeRetrieveQuery,
  useMeUpdateMutation,
  useMePartialUpdateMutation,
  usePollListQuery,
  usePollCreateMutation,
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
  useSuggestedFriendsListQuery,
  useUsersPostsListQuery,
  useVoteCreateMutation,
} = injectedRtkApi;
