const async = require('async');
const ejs = require('ejs');
const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { zDate, zText } = require('zavid-modules');

const { Subscriber, SubscriberQueryBuilder } = require('../../classes');
const {
  accounts,
  cloudinaryBaseUrl,
  copyright,
  domain
} = require('../../constants/settings.js');
const { debug } = require('../../private/error');
const knex = require('../singleton').getKnex();

const isDev = process.env.NODE_ENV !== 'production';

/** A map of variables used in all EJS emails */
const ejsLocals = {
  accounts,
  cloudinaryBaseUrl,
  copyright,
  domain
};

/** The common HTML-to-text options for all emails. */
const htmlToTextOptions = {
  hideLinkHrefIfSameAsText: true,
  ignoreImage: true,
  noLinkBrackets: true,
  preserveNewlines: true,
  uppercaseHeadings: false,
  wordwrap: 80
};
/** The email address of the recipient in development. */
const testRecipient = {
  email: process.env.ETHEREAL_EMAIL,
  token: uuidv4()
};

/** Initialise the mail transporter */
const transporter = nodemailer.createTransport({
  host: process.env[isDev ? 'ETHEREAL_HOST' : 'EMAIL_HOST'],
  port: process.env[isDev ? 'ETHEREAL_PORT' : 'EMAIL_PORT'],
  auth: {
    user: process.env[isDev ? 'ETHEREAL_EMAIL' : 'EMAIL_USER'],
    pass: process.env[isDev ? 'ETHEREAL_PWD' : 'EMAIL_PWD']
  }
});

/**
 * Send an email to all subscribers of new post.
 * @param {object} post - The post details.
 * @returns {Promise} A resolved Promise.
 */
exports.notifyNewPost = (post) => {
  const { title, type, typeId, content, datePublished, image, slug } = post;
  const subject = `New ${type} (#${typeId}) "${title}"`;

  const entity = {
    post: Object.assign({}, post, {
      content: zText.truncateText(content),
      slug: `${domain}/reveries/${slug}`,
      datePublished: zDate.formatDate(datePublished, true),
      image: `${cloudinaryBaseUrl}/w_768,c_lfill/${image}`
    })
  };

  return prepareEmail(entity, type, 'post', subject);
};

/**
 * Send an email to all subscribers of new diary entry.
 * @param {object} diaryEntry - The diary entry details.
 * @returns {Promise} A resolved Promise.
 */
exports.notifyNewDiaryEntry = (diaryEntry) => {
  let { date, content, slug } = diaryEntry;
  date = zDate.formatDate(date, true);
  const subject = `New Diary Entry.`;

  const entity = {
    diaryEntry: Object.assign({}, diaryEntry, {
      content,
      slug: `${domain}/diary/${slug}`,
      date
    })
  };

  return prepareEmail(entity, Subscriber.SUBSCRIPTIONS.DIARY, 'diary', subject);
};

/**
 * Prepare and process email content.
 * @param {object} entity The entity details to include in template.
 * @param {string} type The subscription type expected of subscribers.
 * @param {string} template The name of the template EJS file.
 * @param {string} subject The subject of the email.
 * @returns {Promise} A Promise to resolve.
 */
const prepareEmail = (entity, type, template, subject) => {
  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => new SubscriberQueryBuilder(knex).build())
      .then((subscribers) => {
        // Retrieve list of subscribers to corresponding type
        const mailList = isDev
          ? [testRecipient]
          : subscribers.filter((subscriber) => {
              const subscriptions = JSON.parse(subscriber.subscriptions);
              const isSubscribed = subscriptions[type];
              return isSubscribed;
            });

        // Send email to shortlisted subscribers on mailing list
        async.each(
          mailList,
          function (recipient, callback) {
            ejs.renderFile(
              __dirname + `/templates/${template}.ejs`,
              {
                ...entity,
                subscriber: recipient,
                ...ejsLocals
              },
              null,
              function (err, message) {
                if (err) return callback(err);
                sendMailToSubscriber(
                  recipient.email,
                  subject,
                  message,
                  callback
                );
              }
            );
          },
          function (err) {
            if (err) return reject(err);
            console.info(
              `Emails: "${subject}" email sent to ${mailList.length} subscribers.`
            );
            resolve();
          }
        );
      })
      .catch(debug);
  });
};

/**
 * Send the email to a subscriber.
 * @param {string} recipient The email address of the recipient.
 * @param {string} subject The subject of the email.
 * @param {string} message The content of the message.
 * @param {Function} callback The callback function.
 */
const sendMailToSubscriber = (recipient, subject, message, callback) => {
  transporter.sendMail(
    {
      from: `ZAVID <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject,
      html: message,
      text: htmlToText.fromString(message, htmlToTextOptions)
    },
    function (err, info) {
      if (err) return callback(err);
      console.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      callback(null);
    }
  );
};
