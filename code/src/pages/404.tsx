import React from 'react';

import css from 'src/styles/Partials.module.scss';

export default function Custom404Page() {
  return (
    <div className={css['error-page']}>
      <div className={css['error-message-container']}>
        <div className={css['error-message']}>
          Not gonna lie, I don&#39;t know who sent you here but the page
          you&#39;re looking for doesn&#39;t exist.
        </div>
        <div>
          <a className={css['error-link']} href={'/'}>
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}
