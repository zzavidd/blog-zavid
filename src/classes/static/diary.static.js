/** The map of post statuses. */
const DIARY_STATUSES = {
  PRIVATE: 'PRIVATE',
  PUBLISHED: 'PUBLISHED'
};

const statusList = Object.values(DIARY_STATUSES);

class DiaryEntry {
  constructor() {
    this.entry = {};
  }

  /**
   * Builds the diary entry object.
   * @returns {object} The diary entry object.
   */
  build() {
    return this.entry;
  }

  static STATUSES = DIARY_STATUSES;
  static statusList = statusList;

  /**
   * Checks if submission operation is going to be published.
   * @param {object} entry - The diary entry object.
   * @returns {boolean} True if the selected status is PUBLISHED.
   */
  static isPublish(entry) {
    return entry === this.STATUSES.PUBLISHED;
  }
}

export default DiaryEntry;
