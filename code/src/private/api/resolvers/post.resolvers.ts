import { PostService } from '../service';

/**
 * Retrieves all posts from database.
 */
const getAllPosts = (parent: unknown, args: PostService.GetAllPostOptions) =>
  PostService.getAllPosts(args);

/**
 * Retrieves a single post given a specified ID from the database.
 */
const getSinglePost = async (
  parent: unknown,
  args: PostService.GetOrDeletePostOptions
) => PostService.getSinglePost(args);

/**
 * Inserts a new post into the database.
 */
const createPost = (parent: unknown, args: PostService.CreatePostOptions) => {
  return PostService.createPost(args);
};

/**
 * Updates the fields of a post in the database.
 */
const updatePost = (parent: unknown, args: PostService.UpdatePostOptions) =>
  PostService.updatePost(args);

/**
 * Deletes a post from the database.
 */
const deletePost = (
  parent: unknown,
  args: PostService.GetOrDeletePostOptions
) => PostService.deletePost(args);

/**
 * Clears all data from  the posts table in the database.
 */
const clearPosts = () => PostService.clearPosts();

export default {
  Query: {
    getAllPosts,
    getSinglePost
  },
  Mutation: {
    createPost,
    updatePost,
    deletePost,
    clearPosts
  }
};
