import { api } from "./emptyApi.ts";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
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
    postsList: build.query<PostsListApiResponse, PostsListApiArg>({
      query: () => ({ url: `/posts/` }),
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
      query: (queryArg) => ({ url: `/search_posts/${queryArg.q}/` }),
    }),
    signupCreate: build.mutation<SignupCreateApiResponse, SignupCreateApiArg>({
      query: (queryArg) => ({
        url: `/signup/`,
        method: "POST",
        body: queryArg.signup,
      }),
    }),
    usersPostsList: build.query<
      UsersPostsListApiResponse,
      UsersPostsListApiArg
    >({
      query: (queryArg) => ({ url: `/users/${queryArg.userId}/posts/` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as generatedApi };
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
export type PostsListApiResponse = /** status 200  */ PostListRead[];
export type PostsListApiArg = void;
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
export type SearchPostsListApiResponse = /** status 200  */ PostListRead[];
export type SearchPostsListApiArg = {
  q: string;
};
export type SignupCreateApiResponse = /** status 201  */ Signup;
export type SignupCreateApiArg = {
  signup: SignupWrite;
};
export type UsersPostsListApiResponse = /** status 200  */ PostListRead[];
export type UsersPostsListApiArg = {
  userId: number;
};
export type CommentList = {
  content: string;
};
export type CommentListRead = {
  id: number;
  user: string;
  userId: string;
  userPic: string;
  content: string;
  created_at: string;
};
export type CommentCreateUpdate = {
  content: string;
};
export type Login = {
  email: string;
  password: string;
};
export type Me = {
  first_name?: string;
  last_name?: string;
  bio?: string | null;
  profile_pic?: string | null;
  cover_pic?: string | null;
};
export type MeRead = {
  id: number;
  first_name?: string;
  last_name?: string;
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
export type PostList = {
  content: string;
  image?: string | null;
};
export type PostListRead = {
  id: number;
  user: string;
  userId: string;
  userPic: string;
  content: string;
  image?: string | null;
  no_of_likes: number;
  created_at: string;
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
export const {
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
  useUsersPostsListQuery,
} = injectedRtkApi;
