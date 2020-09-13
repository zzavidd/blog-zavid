const async = require('async');
const ejs = require('ejs');
const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');
const { zDate, zText } = require('zavid-modules');

const { Subscriber, SubscriberQueryBuilder } = require('../../classes');
const {
  accounts,
  cloudinaryBaseUrl,
  copyright,
  domain
} = require('../../constants/settings.js');
const { debug } = require('../error');
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
const testRecipient = process.env.ETHEREAL_EMAIL;

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
 * Send an email to all subscribers of new reverie.
 * @param {object} post - The post details.
 * @returns {Promise} A resolved Promise.
 */
exports.notifyNewPost = (post) => {
  return new Promise((resolve, reject) => {
    const { title, type, typeId, content, datePublished, image, slug } = post;
    const subject = `New ${type} (#${typeId}) "${title}"`;

    ejs.renderFile(
      __dirname + '/templates/post.ejs',
      {
        post: Object.assign({}, post, {
          content: zText.truncateText(content),
          slug: `${domain}/reveries/${slug}`,
          datePublished: zDate.formatDate(datePublished, true),
          image: `${cloudinaryBaseUrl}/w_768,c_lfill/${image}`
        }),
        ...ejsLocals
      },
      null,
      function (err, data) {
        if (err) return reject(err);
        Promise.resolve()
          .then(() => {
            return sendMailToAllSubscribers(
              Subscriber.SUBSCRIPTIONS[type],
              subject,
              data
            );
          })
          .then(() => resolve());
      }
    );
  });
};

/**
 * Send email to all subscribers.
 * @param {string} type - The type of subscription.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The content of the message.
 * @returns {Promise} A resolved Promise.
 */
const sendMailToAllSubscribers = (type, subject, message) => {
  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => new SubscriberQueryBuilder(knex).build())
      .then((subscribers) => {
        // Retrieve list of subscribers to corresponding type
        const mailList = isDev
          ? [testRecipient]
          : subscribers.map((subscriber) => {
              const subscriptions = JSON.parse(subscriber.subscriptions);
              const isSubscribed = subscriptions[type];
              if (isSubscribed) return subscriber.email;
            });

        // Send email to shortlisted subscribers on mailing list
        async.each(
          mailList,
          function (recipient, callback) {
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
                console.info(
                  `Preview URL: ${nodemailer.getTestMessageUrl(info)}`
                );
                callback(null);
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
