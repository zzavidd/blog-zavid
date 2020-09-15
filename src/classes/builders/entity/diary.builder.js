const faker = require('faker');
const { zDate } = require('zavid-modules');

const Diary = require('../../static/diary.static');

/** The class for Diary objects and methods. */
class DiaryEntryBuilder {
  constructor() {
    this.entry = {};
  }

  withDate(date) {
    this.entry.date = date;
    return this;
  }

  withStatus(status) {
    this.entry.status = status;
    return this;
  }

  random() {
    this.entry = {
      content: faker.lorem.paragraphs().replace(/\n/g, '\n\n'),
      date: zDate.formatISODate(faker.date.past()),
      status: Diary.randomStatus()
    };
    return this;
  }

  /**
   * Builds the diary entry object.
   * @returns {object} The diary entry object.
   */
  build() {
    return this.entry;
  }
}

module.exports = DiaryEntryBuilder;
