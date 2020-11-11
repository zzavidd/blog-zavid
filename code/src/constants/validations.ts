import { validate as validateEmail } from 'email-validator';

import {
  DiaryDAO,
  PostDAO,
  PostImage,
  PostStatic,
  SubscriberDAO
} from 'classes';
import { alert } from 'src/components/alert';

export const isValidPost = (post: PostDAO): boolean => {
  if (!ifExists(post.title, 'Enter the post title.')) return false;
  if (!ifExists(post.type, "Select the post's type.")) return false;

  // Ensure type ID if post is NOT a DRAFT nor a PAGE.
  if (!PostStatic.isDraft(post) && !PostStatic.isPage(post)) {
    if (!ifExists(post.typeId, "Set the post's type number.")) return false;
  }

  // Ensure page domain ID is set if post is PAGE.
  if (PostStatic.isPage(post)) {
    if (!ifExists(post.domainId, "Select this page's domain post."))
      return false;
  }

  // Ensure post image, content and excerpt is PUBLISHED.
  if (PostStatic.isPublish(post)) {
    if (
      !isValidImage((post.image as PostImage).source, 'post', {
        mustExist: PostStatic.isReverie(post)
      })
    )
      return false;
    if (!ifExists(post.content, 'Write out the content of this post.'))
      return false;
    if (PostStatic.isReverie(post)) {
      if (!ifExists(post.excerpt, "Enter the post's excerpt.")) return false;
    }
  }

  return true;
};

export const isValidDiaryEntry = (diaryEntry: DiaryDAO): boolean => {
  if (
    !ifExists(diaryEntry.content, 'Write out the content of this diary entry.')
  )
    return false;

  return true;
};

export const isValidSubscriber = (
  subscriber: SubscriberDAO,
  isAdminOp: boolean
): boolean => {
  let INVALID_EMAIL, ONLY_LASTNAME;

  if (isAdminOp) {
    INVALID_EMAIL = "Enter the subscriber's email address.";
    ONLY_LASTNAME = "Can't have a surname without a first name. ";
  } else {
    INVALID_EMAIL = 'Please enter your email address.';
    ONLY_LASTNAME = "I can't ONLY have your surname!";
  }

  if (!isValidEmail(subscriber.email!, INVALID_EMAIL)) return false;
  if (subscriber.lastname!.trim()) {
    if (!ifExists(subscriber.firstname, ONLY_LASTNAME)) return false;
  }

  return true;
};

// TODO: Use PageDAO
export const isValidPage = (page: any): boolean => {
  if (!ifExists(page.title, `Enter the page's title.`)) return false;
  if (!ifExists(page.slug, `Enter the page's title.`)) return false;

  return true;
};

export const isValidEmail = (
  email: string,
  message = 'Enter a valid email address.'
): boolean => {
  if (!email) {
    alert.error(message);
    return false;
  }

  if (!validateEmail(email)) {
    alert.error('The email address is invalid.');
    return false;
  }

  return true;
};

const isValidImage = (
  file: string,
  entity: string,
  options: ValidImageOptions = {}
): boolean => {
  const { mustExist = true } = options;

  if (mustExist) {
    if (!ifExists(file, `Please select an image for the ${entity}.`))
      return false;
  }

  if (!isUnderFileSizeLimit(file)) return false;
  return true;
};

const isUnderFileSizeLimit = (
  file: string,
  options: FileSizeLimitOptions = {}
): boolean => {
  if (!file) return true;

  const { reference = 'The file', limit = 2 } = options;
  const size = Buffer.from(file.substring(file.indexOf(',') + 1)).length;
  if (
    ifTrue(
      size > limit * 1024 * 1024,
      `${reference} you selected is larger than ${limit}MB. Please compress this file or use a smaller one.`
    )
  )
    return false;
  return true;
};

const ifExists = (value: any, message: string): boolean => {
  if (typeof value === 'string') {
    value = value.trim();
  }

  if (!value || value.length === 0) {
    alert.error(message);
    return false;
  } else {
    return true;
  }
};

const ifTrue = (condition: boolean, message: string) => {
  if (condition === true) {
    alert.error(message);
    return true;
  } else {
    return false;
  }
};

interface ValidImageOptions {
  mustExist?: boolean;
}

interface FileSizeLimitOptions {
  limit?: number;
  reference?: string;
}
