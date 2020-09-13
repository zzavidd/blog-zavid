const async = require('async');
const ejs = require('ejs');
const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { zDate, zText } = require('zavid-modules');

const { SubscriberQueryBuilder } = require('../../classes');
const {
  accounts,
  cloudinaryBaseUrl,
  copyright,
  domain
} = require('../../constants/settings.js');
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
 * Send an email to all subscribers of new reverie.
 * @param {object} post - The post details.
 * @returns {Promise} A resolved Promise.
 */
exports.notifyNewPost = (post) => {
  const { title, type, typeId, content, datePublished, image, slug } = post;
  const subject = `New ${type} (#${typeId}) "${title}"`;

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
              if (isSubscribed) return subscriber;
            });

        // Send email to shortlisted subscribers on mailing list
        async.each(
          mailList,
          function (recipient, callback) {
            ejs.renderFile(
              __dirname + '/templates/post.ejs',
              {
                post: Object.assign({}, post, {
                  content: zText.truncateText(content),
                  slug: `${domain}/reveries/${slug}`,
                  datePublished: zDate.formatDate(datePublished, true),
                  image: `${cloudinaryBaseUrl}/w_768,c_lfill/${image}`
                }),
                subscriber: recipient,
                ...ejsLocals
              },
              null,
              function (err, message) {
                if (err) return callback(err);
                sendMailToSubscriber(recipient, subject, message, callback);
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
      });
  });
};

const sendMailToSubscriber = (recipient, subject, message, callback) => {
  transporter.sendMail(
    {
      from: `ZAVID <${process.env.EMAIL_USER}>`,
      to: recipient.email,
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
