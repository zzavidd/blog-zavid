const faker = require('faker');
const { zDate, zString } = require('zavid-modules');

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

  withContent(content){
    this.entry.content = content;
    return this;
  }

  random() {
    this.entry = {
      title: zString.toTitleCase(faker.company.catchPhraseNoun()),
      content: faker.lorem.paragraphs().replace(/\n/g, '\n\n'),
      date: zDate.formatISODate(faker.date.past()),
      status: Diary.randomStatus(),
      entryNumber: faker.random.number(),
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