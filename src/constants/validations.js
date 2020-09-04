const { Post } = require('classes');
const { alert } = require('components/alert.js');

/**
 * Validation of post submission or update.
 * @param {object} post - Post information to be validated.
 * @returns {boolean} True if valid. False with error message if invalid.
 */
exports.isValidPost = (post) => {
  if (!ifExists(post.title, 'Enter the post title.')) return false;
  if (!ifExists(post.type, "Select the post's type.")) return false;

  if (Post.isPage(post)) {
    if (!ifExists(post.domainId, "Select this page's domain post."))
      return false;
  }

  if (Post.isPublish(post)) {
    if (
      !isValidImage(post.image.source, 'post', {
        mustExist: Post.isReverie(post)
      })
    )
      return false;
    if (!ifExists(post.content, 'Write out the content of this post.'))
      return false;
    if (Post.isReverie(post)) {
      if (!ifExists(post.excerpt, "Enter the post's excerpt.")) return false;
    }
  }

  return true;
};

/**
 * Ensure submitted file meets requirements.
 * @param {string} file - Base64 string of file to be uploaded.
 * @param {string} entity - The entity this file represents.
 * @param {object} [options] - Options for image validation.
 * @param {boolean} [options.mustExist] - Specifies if the image must exist. Defaults to true.
 * @returns {boolean} True if meets requirements. If not, false.
 */
const isValidImage = (file, entity, options = {}) => {
  const { mustExist = true } = options;

  if (mustExist) {
    if (!ifExists(file, `Please select an image for the ${entity}.`))
      return false;
  }

  if (!isUnderFileSizeLimit(file)) return false;
  return true;
};

/**
 * Ensure file size is within limit.
 * @param {string} file - Base64 string of file to be uploaded.
 * @param {object} [options] - Options for validating file size.
 * @param {number} [options.limit] - The upper size limit in MB. Defaults to 2MB.
 * @param {string} [options.reference] - A string reference to the file.
 * @returns {boolean} True if within limit. False if not.
 */
const isUnderFileSizeLimit = (file, options = {}) => {
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

/**
 * Check for presence of a value.
 * @param {any} value - Value to be checked.
 * @param {string} message - Error message to be returned if value is absent.
 * @returns {boolean} True if value exists. False if not.
 */
const ifExists = (value, message) => {
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

/**
 * Check if condition is wrongly true.
 * @param {boolean} condition - Condition to be evaluated.
 * @param {string} message - Error message to be returned if value is true.
 * @returns {boolean} True if condition resolves to true. False if not.
 */
const ifTrue = (condition, message) => {
  if (condition === true) {
    alert.error(message);
    return true;
  } else {
    return false;
  }
};
