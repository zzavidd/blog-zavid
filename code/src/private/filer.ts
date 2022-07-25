import async from 'async';
import Cloudinary from 'cloudinary';
import { zString } from 'zavid-modules';

import { PostService } from './api/service';
import { debug } from './error';

import { PostDAO, PostImage, PostStatic } from '../../classes';

const cloudinary = Cloudinary.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload post image cloudinary.
 * @param post - The post object.
 * @param options - The post image upload options.
 */
export const uploadImages = async (
  post: PostDAO,
  options: PostImageUploadOptions = {}
): Promise<PostDAO> => {
  const { isTest = false } = options;
  const { directory, filename, slug } = await generateSlugAndFilename(post);

  if (!PostStatic.isDraft(post)) {
    post.slug = slug;
  }

  const images = PostStatic.collateImages(post);

  // Discontinue if no images.
  if (!images.length) {
    delete post.image;
    delete post.contentImages;
    return post;
  }

  return new Promise((resolve, reject) => {
    async.transform<PostImage | string, string, Error>(
      images,
      function (acc, image, key, callback) {
        const { hasChanged, source, isCover } = image as PostImage;
        if (!hasChanged) {
          acc.push(source);
          return callback();
        }

        const uri = isTest
          ? `test/${filename}`
          : isCover
          ? `dynamic/${directory}/${filename}`
          : `dynamic/${directory}/content/${filename}`;

        const contentImageKey = key.toString().padStart(2, '0');
        const publicId = isCover ? uri : `${uri}-${contentImageKey}`;

        cloudinary.uploader.upload(
          source,
          {
            public_id: publicId,
            unique_filename: false
          },
          (err, result) => {
            if (err) return callback(err);
            const { version, public_id, format } = result!;
            acc.push(`v${version}/${public_id}.${format}`);
            callback();
          }
        );
      },
      function (err, results) {
        if (err) return reject(err);

        const contentImageRegex = new RegExp(/.*\-[0-9]{2}\.[a-z]+/);
        const contentImages: string[] = [];

        // Store return image information in post object.
        (results as string[]).forEach((result: string) => {
          if (contentImageRegex.test(result)) {
            contentImages.push(result);
          } else {
            post.image = result;
          }
        });

        if (contentImages.length) {
          post.contentImages = JSON.stringify(contentImages);
        }

        resolve(post);
      }
    );
  });
};

/**
 * Delete post image from cloudinary.
 * @param image The post image source.
 */
export const destroyImage = (image: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!image) return resolve();

    const regex = new RegExp(
      /(?:v[0-9]+\/)((?:dynamic|static|test)\/.*)(?:\.[a-z]+)/
    );
    if (!regex.test(image)) return resolve();

    const [, publicId] = image.match(regex)!;
    cloudinary.uploader.destroy(
      publicId,
      { invalidate: true },
      (err, { result }) => {
        if (err) return reject(err);
        if (result !== 'ok') {
          const error = `Attempt to delete Cloudinary image; result is '${result}'. Using public ID: ${publicId}`;
          return reject(new Error(error));
        }

        resolve();
      }
    );
  });
};

/**
 * Replaces image on the cloud.
 * @param id The ID of the post.
 * @param post The post object.
 * @param options Upload options.
 */
export const replaceImages = async (
  id: number,
  post: PostDAO,
  options: PostImageUploadOptions
) => {
  const { isTest = false } = options;

  const postInDatabase = await PostService.getSinglePost({
    id
  });
  const imagesFromClient = PostStatic.collateImages(post, {
    includeNulls: true
  }) as PostImage[];
  const imagesInDatabase = PostStatic.collateImages(postInDatabase);

  const promises: Promise<void>[] = [];

  // Delete images which have changed.
  imagesFromClient.forEach((image: PostImage, key: number) => {
    const shouldDeleteImage =
      image && image.hasChanged && key <= imagesInDatabase.length - 1;
    if (shouldDeleteImage) {
      const imageToDelete = imagesInDatabase[key] as string;
      promises.push(destroyImage(imageToDelete));
    }
  });
  await Promise.all(promises);

  return uploadImages(post, { isTest });
};

/**
 * Construct slug and filenames.
 * @param post The post details.
 */
async function generateSlugAndFilename(
  post: PostDAO
): Promise<GenerateSlugResponse> {
  const slug = generateSlug(post);
  const directory = PostStatic.getDirectory(post.type!);
  const filename = await generateFilename(post, slug);
  return { directory, filename, slug };
}

/**
 * Generate the slug using the post.
 * @param post The post to generate the slug for.
 */
function generateSlug(post: PostDAO): string {
  const title = PostStatic.getPostTitle(post);
  const slug = zString.constructCleanSlug(title);
  return slug;
}

/**
 * Generate the filename using the post.
 * @param post The post to generate the filename for.
 * @param slug The post slug.
 */
async function generateFilename(post: PostDAO, slug: string) {
  let filename = 'untitled';

  if (PostStatic.isPage(post)) {
    try {
      const postDomain = await PostService.getSinglePost({
        id: post.domainId!
      });
      filename = zString.constructCleanSlug(
        `${postDomain.title!} ${post.title}`
      );
    } catch (err) {
      debug(err as Error);
    }
  } else {
    const number = post.typeId?.toString().padStart(3, '0');
    filename = `${number}-${slug}`;
  }

  return filename;
}

type PostImageUploadOptions = {
  isTest?: boolean;
};

type GenerateSlugResponse = {
  directory: string;
  filename: string;
  slug: string;
};
