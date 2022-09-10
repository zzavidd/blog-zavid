import { validate as validateEmail } from 'email-validator';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import type { PageDAO } from 'classes/pages/PageDAO';
import type { PostDAO, PostImage } from 'classes/posts/PostDAO';
import { PostStatic } from 'classes/posts/PostStatic';
import type { SubscriberDAO } from 'classes/subscribers/SubscriberDAO';

import { UIError } from './errors';

namespace Validate {
  /**
   * Validate post submission.
   * @param post The post to validate.
   */
  export function post(post: PostDAO): void {
    checkIfExists(post.title, 'Enter the post title.');
    checkIfExists(post.type, "Select the post's type.");

    // Ensure type ID if post is NOT a DRAFT nor a PAGE.
    if (!PostStatic.isDraft(post) && !PostStatic.isPage(post)) {
      checkIfExists(post.typeId, "Set the post's type number.");
    }

    // Ensure page domain ID is set if post is PAGE.
    if (PostStatic.isPage(post)) {
      checkIfExists(post.domainId, "Select this page's domain post.");
    }

    // Ensure post image, content and excerpt is PUBLISHED.
    if (PostStatic.isPublished(post)) {
      isValidImage((post.image as PostImage).source, 'post', {
        mustExist: PostStatic.isReverie(post),
      });

      checkIfExists(post.content, 'Write out the content of this post.');
      if (PostStatic.isReverie(post)) {
        checkIfExists(post.excerpt, "Enter the post's excerpt.");
      }
    }
  }

  /**
   * Validate diary entry submission.
   * @param entry The diary entry to validate.
   */
  export function diaryEntry(entry: DiaryDAO): void {
    checkIfExists(entry.content, 'Write out the content of this diary entry.');
    checkIfExists(
      entry.entryNumber,
      'Set the entry number for the diary entry.',
    );
  }

  /**
   * Validate subscriber submission.
   * @param subscriber The subscriber to validate.
   * @param isAdminOp True if an admin operation.
   */
  export function subscriber(
    subscriber: SubscriberDAO,
    isAdminOp?: boolean,
  ): void {
    let INVALID_EMAIL, ONLY_LASTNAME;

    if (isAdminOp) {
      INVALID_EMAIL = "Enter the subscriber's email address.";
      ONLY_LASTNAME = "Can't have a surname without a first name. ";
    } else {
      INVALID_EMAIL = 'Please enter your email address.';
      ONLY_LASTNAME = "I can't ONLY have your surname!";
    }

    Validate.email(subscriber.email!, INVALID_EMAIL);

    if (subscriber.lastname!.trim()) {
      checkIfExists(subscriber.firstname, ONLY_LASTNAME);
    }
  }

  /**
   * Validate page submission,
   * @param page The page to validate.
   */
  export function page(page: PageDAO): void {
    checkIfExists(page.title, "Enter the page's title.");
    checkIfExists(page.slug, "Enter the page's title.");
  }

  /**
   * Validate an email.
   * @param email The email to validate.
   * @param message The error message.
   */
  export function email(
    email: string,
    message = 'Enter a valid email address.',
  ): void {
    if (!email) {
      throw new UIError(message);
    }

    if (!validateEmail(email)) {
      throw new UIError('The email address is invalid.');
    }
  }
}

export default Validate;

/**
 * Validate an image.
 * @param file The base64 data of the image.
 * @param entity The name of the entity.
 * @param options The options.
 */
function isValidImage(
  file: string,
  entity: string,
  options: ValidImageOptions = {},
): void {
  const { mustExist = true } = options;

  if (mustExist) {
    checkIfExists(file, `Please select an image for the ${entity}.`);
  }

  checkIfUnderFileSizeLimit(file);
}

/**
 * Validates if a file is under the size limit.
 * @param file The file to validate.
 * @param options The options.
 */
function checkIfUnderFileSizeLimit(
  file: string,
  options: FileSizeLimitOptions = {},
): void {
  if (!file) {
    throw new UIError('File does not exist');
  }

  const { reference = 'The file', limit = 2 } = options;
  const size = Buffer.from(file.substring(file.indexOf(',') + 1)).length;

  if (size > limit * 1024 * 1024) {
    throw new UIError(
      `${reference} you selected is larger than ${limit}MB. Please compress this file or use a smaller one.`,
    );
  }
}

/**
 * Validates if a value exists.
 * @param value The value to validate.
 * @param message The error message.
 */
function checkIfExists(value: unknown, message: string): void {
  if (typeof value === 'string') {
    value = value.trim();
    if (!(value as string).length) {
      throw new UIError(message);
    }
  }

  if (!value) {
    throw new UIError(message);
  }
}

interface ValidImageOptions {
  mustExist?: boolean;
}

interface FileSizeLimitOptions {
  limit?: number;
  reference?: string;
}
