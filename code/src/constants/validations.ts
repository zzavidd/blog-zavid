import { validate as validateEmail } from 'email-validator';

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import type { PageDAO } from 'classes/pages/PageDAO';
import type { PostDAO, PostImage } from 'classes/posts/PostDAO';
import { PostStatic } from 'classes/posts/PostStatic';
import type { SubscriberDAO } from 'classes/subscribers/SubscriberDAO';

import { UIError } from './errors';

export function validatePost(post: PostDAO): void {
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

export function validateDiaryEntry(entry: DiaryDAO): void {
  checkIfExists(entry.content, 'Write out the content of this diary entry.');
  checkIfExists(entry.entryNumber, 'Set the entry number for the diary entry.');
}

/**
 * Check if a subscriber entry is valid.
 * @param subscriber The subscriber to check.
 * @param isAdminOp True if an admin operation.
 */
export function checkValidSubscriber(
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

  checkValidEmail(subscriber.email!, INVALID_EMAIL);

  if (subscriber.lastname!.trim()) {
    checkIfExists(subscriber.firstname, ONLY_LASTNAME);
  }
}

export function validatePage(page: PageDAO): void {
  checkIfExists(page.title, 'Enter the page\'s title.');
  checkIfExists(page.slug, 'Enter the page\'s title.');
}

export function checkValidEmail(
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

function checkIfUnderFileSizeLimit(
  file: string,
  options: FileSizeLimitOptions = {},
): void {
  if (!file) {
    throw new UIError('File does not exist');
  }

  const { reference = 'The file', limit = 2 } = options;
  const size = Buffer.from(file.substring(file.indexOf(',') + 1)).length;

  checkIfTrue(
    size > limit * 1024 * 1024,
    `${reference} you selected is larger than ${limit}MB. Please compress this file or use a smaller one.`,
  );
}

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

function checkIfTrue(condition: boolean, message: string): void {
  if (condition === true) {
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
