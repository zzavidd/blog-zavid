import React, { useEffect, useState } from 'react';

import { Fader } from 'components/transitioner';
import css from 'styles/components/Form.module.scss';

const PostForm = (props) => {
  const { post, handleText } = props;
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  return (
    <Fader determinant={isLoaded} duration={500}>
      <div>
        <label>Title:</label>
        <input
          name={'title'}
          type={'text'}
          value={post.title}
          onChange={handleText}
          className={css['input']}
          autoComplete={'off'}
          placeholder={'Enter the title'}
        />
      </div>
    </Fader>
  );
};

export default PostForm;
