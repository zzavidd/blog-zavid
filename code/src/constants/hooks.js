import { saveText } from 'lib/reducers.js';

module.exports = (hook, state) => {
  const module = {};
  /**
   * Handle changes to text input fields.
   * @param {Event} event - The text change DOM event.
   */
  module.handleText = (event) => {
    const { name, value } = event.target;
    hook(Object.assign({}, state, { [name]: value }));
  };

  module.handleTextSave = (event, dispatch) => {
    module.handleText(event);
    dispatch(saveText(event.target.value));
  };

  module.handleSelection = module.handleText;

  /**
   * Handles the selection of dates.
   * @param {string} date - The date value.
   * @param {string} [name] - The name of the element. Default is 'date'.
   */
  module.handleDate = (date, name = 'date') => {
    hook(Object.assign({}, state, { [name]: date }));
  };

  module.handleCheck = (event) => {
    const { name, checked } = event.target;
    hook(Object.assign({}, state, { [name]: checked }));
  };

  /**
   * Handles the upload of images with a file selector.
   * @param {string} file - The base64 string of the image.
   * @param {string} [name] - The name of the element. Default is 'image'.
   */
  module.handleFile = (file, name = 'image') => {
    hook(
      Object.assign({}, state, {
        [name]: {
          source: file,
          hasChanged: true
        }
      })
    );
  };

  module.handleContentImages = (file, i) => {
    const contentImages = state.contentImages || {};

    contentImages[`image${i}`] = {
      source: file,
      hasChanged: true
    };

    hook(
      Object.assign({}, state, {
        contentImages
      })
    );
  };

  return module;
};