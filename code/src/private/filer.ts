// import Cloudinary from 'cloudinary';

// import { PostStatic } from 'classes/posts/PostStatic';
// import ZString from 'utils/lib/string';
// import Logger from 'utils/logger';

// import PostAPI from './api/posts';

// const cloudinary = Cloudinary.v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const CONTENT_IMAGE_REGEX = new RegExp(/.*\-[0-9]{2}\.[a-z]+/);
// const isDev = process.env.NEXT_PUBLIC_APP_ENV !== 'production';

// namespace Filer {
//   /**
//    * Upload post image cloudinary.
//    * @param post - The post object.
//    */
//   export async function uploadImages(post: PostDAO): Promise<PostDAO> {
//     const { directory, filename, slug } = await generateSlugAndFilename(post);

//     if (!PostStatic.isDraft(post)) {
//       post.slug = slug;
//     }

//     // Discontinue if no images.
//     const images = PostStatic.collateImages(post);
//     if (!images.length) {
//       post.image = null;
//       post.contentImages = [];
//       return post;
//     }

//     const promises = images.map(async (image, key) => {
//       const { hasChanged, source, isCover } = image as PostImage;
//       if (!hasChanged) {
//         return source;
//       }

//       const uri = isDev
//         ? `test/${filename}`
//         : isCover
//         ? `dynamic/${directory}/${filename}`
//         : `dynamic/${directory}/content/${filename}`;

//       const contentImageKey = key.toString().padStart(2, '0');
//       const publicId = isCover ? uri : `${uri}-${contentImageKey}`;

//       const { version, public_id, format } = await cloudinary.uploader.upload(
//         source,
//         {
//           public_id: publicId,
//           unique_filename: false,
//         },
//       );
//       return `v${version}/${public_id}.${format}`;
//     });

//     const results = await Promise.all(promises);
//     const contentImages: string[] = [];

//     // Store return image information in post object.
//     results.forEach((result: string) => {
//       if (CONTENT_IMAGE_REGEX.test(result)) {
//         contentImages.push(result);
//       } else {
//         post.image = result;
//       }
//     });

//     if (contentImages.length) {
//       post.contentImages = JSON.stringify(contentImages);
//     }

//     return post;
//   }

//   /**
//    * Delete post image from cloudinary.
//    * @param image The post image source.
//    */
//   export async function destroyImage(image: string | PostImage): Promise<void> {
//     const path = image as string;
//     try {
//       if (!path) return;
//       const regex = new RegExp(
//         /(?:v[0-9]+\/)((?:dynamic|static|test)\/.*)(?:\.[a-z]+)/,
//       );
//       if (!regex.test(path)) return;

//       const [, publicId] = path.match(regex)!;
//       const { result } = await cloudinary.uploader.destroy(publicId, {
//         invalidate: true,
//       });
//       if (result !== 'ok') {
//         const error = `Attempt to delete Cloudinary image; result is '${result}'. Using public ID: ${publicId}`;
//         throw new Error(error);
//       }
//     } catch (e: any) {
//       throw new Error(e.message);
//     }
//   }

//   /**
//    * Replaces image on the cloud.
//    * @param id The ID of the post.
//    * @param post The post object.
//    */
//   export async function replaceImages(
//     id: number,
//     post: PostDAO,
//   ): Promise<PostDAO> {
//     const postInDatabase = await PostAPI.getById(id);
//     const imagesFromClient = PostStatic.collateImages(post, {
//       includeNulls: true,
//     }) as PostImage[];
//     const imagesInDatabase = PostStatic.collateImages(postInDatabase);

//     // Delete images which have changed.
//     const promises = imagesFromClient.map((image, key) => {
//       const shouldDeleteImage =
//         image && image.hasChanged && key <= imagesInDatabase.length - 1;
//       if (shouldDeleteImage) {
//         const imageToDelete = imagesInDatabase[key];
//         return destroyImage(imageToDelete);
//       }
//     });
//     await Promise.all(promises);
//     return uploadImages(post);
//   }
// }

// /**
//  * Construct slug and filenames.
//  * @param post The post details.
//  */
// async function generateSlugAndFilename(
//   post: PostDAO,
// ): Promise<GenerateSlugResponse> {
//   const slug = generateSlug(post);
//   const directory = PostStatic.getDirectory(post.type!);
//   const filename = await generateFilename(post, slug);
//   return { directory, filename, slug };
// }

// /**
//  * Generate the slug using the post.
//  * @param post The post to generate the slug for.
//  */
// function generateSlug(post: PostDAO): string {
//   const title = PostStatic.getPostTitle(post);
//   const slug = ZString.constructCleanSlug(title);
//   return slug;
// }

// /**
//  * Generate the filename using the post.
//  * @param post The post to generate the filename for.
//  * @param slug The post slug.
//  */
// async function generateFilename(post: PostDAO, slug: string): Promise<string> {
//   let filename = 'untitled';

//   if (PostStatic.isPage(post)) {
//     try {
//       const postDomain = await PostAPI.getById(post.domainId!);
//       filename = ZString.constructCleanSlug(
//         `${postDomain.title!} ${post.title}`,
//       );
//     } catch (err) {
//       Logger.error(err);
//     }
//   } else {
//     const number = post.typeId?.toString().padStart(3, '0');
//     filename = `${number}-${slug}`;
//   }

//   return filename;
// }

// export default Filer;

// interface GenerateSlugResponse {
//   directory: string;
//   filename: string;
//   slug: string;
// }
