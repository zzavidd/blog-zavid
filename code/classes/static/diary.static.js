const { zDate } = require('zavid-modules');

const { Publishable } = require('./super');

/** The map of post statuses. */
const DIARY_STATUSES = {
  PRIVATE: 'PRIVATE',
  PUBLISHED: 'PUBLISHED'
};

const statusList = Object.values(DIARY_STATUSES);

class Diary extends Publishable {
  static STATUSES = DIARY_STATUSES;
  static statusList = statusList;

  static generateSlug(diaryEntry){
    return zDate.formatISODate(diaryEntry.date);
  }

  /**
   * Checks if submission operation is going to be published.
   * @param {object} entry - The diary entry object.
   * @returns {boolean} True if the selected status is PUBLISHED.
   */
  static isPublish(entry) {
    return entry === this.STATUSES.PUBLISHED;
  }
}

module.exports = Diary;
