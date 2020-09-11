const faker = require('faker');
const { zDate } = require('zavid-modules');

const Diary = require('../../static/diary.static');

/** The class for Diary objects and methods. */
class DiaryEntryBuilder {
  constructor() {
    this.entry = {};
  }

  random() {
    this.entry = {
      content: faker.lorem.paragraphs(),
      date: zDate.formatISODate(faker.date.past()),
      status: Diary.randomStatus(),
    };
    return this;
  }

  /**
   * Builds the diary entry object.
   * @returns {object} The diary entry object.
   */
  build() {
    return this.post;
  }
}

module.exports = DiaryEntryBuilder;