const emailsOn =
  process.env.NODE_ENV === 'production' || process.argv.includes('--emails');
console.warn(`Emails are turned ${emailsOn ? 'on' : 'off'}.`);

module.exports = {
  emailsOn
};
