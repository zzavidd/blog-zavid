import { alert } from '~/components/alert.js';

module.exports = {

  /**
   * Validation of post submission or update.
   * @param {string} post - Post details to be validated.
   * @returns {Boolean} True if valid. False with error message if invalid.
   */
  isValidPost: (post) => {
    if (!ifExists(post.title.trim(), 'Enter the title of the post.')) return false;
    if (!ifExists(post.type.trim(), 'Select the post type.')) return false;
    if (!ifExists(post.description, 'Enter the post description.')) return false;
    if (!isUnderFileSizeLimit(post.image)) return false;
    return true;
  },

  /**
   * Ensure submitted file meets requirements.
   * @param {string} file - Base64 string of file to be uploaded.
   * @param {string} entity - The entity this file represents.
   * @returns {Boolean} True if meets requirements. If not: false.
   */
  isValidFile: (file, entity) => {
    if (!ifExists(file, `Please select an image for the ${entity}.`)) return false;
    if (!isUnderFileSizeLimit(file)) return false;
    return true;
  }
}


/**
 * Ensure file size is within limit.
 * @param {string} file - Base64 string of file to be uploaded.
 * @returns {Boolean} True if within limit. False if not.
 */
const isUnderFileSizeLimit = (file) => {
  if (!file) return true;
  const size = Buffer.from(file.substring(file.indexOf(',') + 1)).length;
  if (ifTrue(size > 2 * 1024 * 1024, 'The image you selected is larger than 2MB. Please compress this image or use a smaller one.')) return false;
  return true;
}

/**
 * Check for presence of a value.
 * @param {string} value - Value to be checked.
 * @param {string} message - Error message to be returned if value is absent.
 * @returns {Boolean} True if value exists. False if not.
 */
const ifExists = (value, message) => {
  if (!value || value.length == 0){
    // alert.error(message);
    return false;
  } else {
    return true;
  }
}

/**
 * Check if condition is wrongly true.
 * @param {Boolean} condition - Condition to be evaluated.
 * @param {string} message - Error message to be returned if value is true.
 * @returns {Boolean} True if condition resolves to true. False if not.
 */
const ifTrue = (condition, message) => {
  if (condition === true){
    alert.error(message)
    return true;
  } else {
    return false;
  }
}