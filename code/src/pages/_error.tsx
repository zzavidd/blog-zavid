import { NextPageContext } from 'next';
import React from 'react';

import { CustomError } from 'classes';
import css from 'src/styles/Partials.module.scss';

const Error = ({ message }: CustomError) => {
  return (
    <div className={css['error-page']}>
      <div className={css['error-message-container']}>
        {message ? (
          <CustomErrorMessage message={message} />
        ) : (
          <DefaultErrorMessage />
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

const CustomErrorMessage = ({ message }: Record<string, string>) => {
  return (
    <>
      <div className={css['error-message']}>{message}</div>
      <div>
        <a href={'/'}>Go to Home</a>
      </div>
    </>
  );
};

Error.getInitialProps = ({ res, err, query }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode, ...query };
};

export default Error;
