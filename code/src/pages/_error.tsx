import type { NextPageContext } from 'next';
import React from 'react';

import type { CustomError } from 'classes';
import css from 'styles/Partials.module.scss';

export default function ErrorPage({ message }: CustomError) {
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
}

function DefaultErrorMessage() {
  return (
    <React.Fragment>
      <div className={css['error-message']}>
        Oops. We seem to have a problem.
      </div>
      <div>
        Try refreshing the page. If that didn&#39;t work, please bear with me
        and try again later.
      </div>
    </React.Fragment>
  );
}

function CustomErrorMessage({ message }: Record<string, string>) {
  return (
    <React.Fragment>
      <div className={css['error-message']}>{message}</div>
      <div>
        <a href={'/'}>Go to Home</a>
      </div>
    </React.Fragment>
  );
}

ErrorPage.getInitialProps = ({ res, err, query }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode, ...query };
};
