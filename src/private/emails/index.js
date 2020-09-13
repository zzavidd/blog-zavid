const async = require('async');
const ejs = require('ejs');
const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');
const { zDate, zText } = require('zavid-modules');

const { Subscriber } = require('../../classes');
const {
  accounts,
  cloudinaryBaseUrl,
  copyright,
  domain
} = require('../../constants/settings.js');
const knex = require('../singleton/knex').getKnex();

const isDev = process.env.NODE_ENV !== 'production';

/** A map of variables used in all EJS emails */
const ejsLocals = {
  accounts,
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
  host: 'mail.privateemail.com',
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PWD
  }
});

/**
 * Send an email to all subscribers of new reverie.
 * @param {object} post - The post details.
 * @param {object} options - The callback options for this function.
 * @param {Function} [options.callback] - The callback function called on completion.
 * @param {object} [options.params] - The parameters sent via the callback.
 */
exports.notifyNewReverie = (post, options) => {
  const { title, content, datePublished, image, slug } = post;
  const subject = `New Reverie: "${title}"`;

  ejs.renderFile(
    __dirname + '/templates/reverie.ejs',
    {
      post: Object.assign({}, post, {
        content: zText.truncateText(content),
        slug: `${domain}/reveries/${slug}`,
        datePublished: zDate.formatDate(datePublished, true),
        image: `${cloudinaryBaseUrl}/w_768,c_lfill/${image}`
      }),
      ...ejsLocals
    },
    function (err, data) {
      sendMailToAllSubscribers(
        Subscriber.SUBSCRIPTIONS.REVERIES,
        subject,
        data,
        options
      );
    }
  );
};

/**
 * Send email to all subscribers.
 * @param {string} type - The type of subscription.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The content of the message.
 * @param {object} [options] - The callback options for this function.
 * @param {Function} [options.callback] - The callback function called on completion.
 * @param {object} [options.params] - The parameters sent via the callback.
 */
const sendMailToAllSubscribers = (type, subject, message, options = {}) => {
  const { callback, emailText, params } = options;

  const query = knex.select().from('subscribers');
  query.asCallback(function (err, results) {
    // Retrieve list of subscribers to corresponding type
    const mailList = isDev
      ? [testRecipient]
      : results.map((subscriber) => {
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
            text: htmlToText.fromString(
              message,
              Object.assign({}, htmlToTextOptions, emailText)
            )
          },
          function (err) {
            callback(err);
          }
        );
      },
      function (err) {
        console.info(
          `Emails: "${subject}" email sent to ${mailList.length} subscribers.`
        );
        if (callback) callback(err, params);
      }
    );
  });
};
