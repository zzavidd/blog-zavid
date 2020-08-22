import React from 'react';

import css from 'styles/Partials.module.scss';

const Error = ({ message }) => {
  return (
    <div className={css['error-page']}>
      <div className={css['error-message-container']}>
        {message ? (
          <CustomErrorMessage message={message} />
        ) : (
          <DefaultErrorMessage message={message} />
        )}
      </div>
    </div>
  );
};

const DefaultErrorMessage = () => {
  return (
    <>
      <div className={css['error-message']}>
        Oops. We seem to have a problem.
      </div>
      <div>
        Try refreshing the page. If that didn&#39;t work, please bear with me
        and try again later.
      </div>
    </>
  );
};

const CustomErrorMessage = ({ message }) => {
  return (
    <>
      <div className={css['error-message']}>{message}</div>
      <div>
        <a href={'/'}>Go to Home</a>
      </div>
    </>
  );
};

Error.getInitialProps = ({ res, err, query }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode, ...query };
};

export default Error;
