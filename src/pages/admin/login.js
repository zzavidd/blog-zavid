import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setAlert, alert } from 'components/alert';
import { ConfirmButton } from 'components/button';
import { TextInput } from 'components/form';
import { Icon } from 'components/icon';
import { Container } from 'components/layout';
import { Fader } from 'components/transitioner';
import { setUser } from 'lib/reducers';
import css from 'styles/pages/Admin.module.scss';

const Login = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  const logIn = () => {
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: 'z', password }),
      credentials: "same-origin"
    }).then((res) => {
      if (res.status === 200) {
        alert.success("You've successfully authenticated.");
        dispatch(setUser({ isAuthenticated: true }));
        redirectToAdmin();
      } else {
        alert.error(`You shouldn't be here.`);
      }
    });
  };

  return (
    <Fader determinant={isLoaded} duration={800} className={css['login-page']}>
      <Container className={css['login-form']}>
        <TextInput
          value={password}
          placeholder={'Enter the key...'}
          leadingComponent={<Icon name={'lock'} />}
          onChange={(e) => setPassword(e.target.value)}
          className={css['login-input']}
        />
        <ConfirmButton onClick={logIn} className={css['login-button']}>
          Log In
        </ConfirmButton>
      </Container>
    </Fader>
  );
};

const redirectToAdmin = () => {
  setTimeout(() => {
    location.href = '/admin';
  }, 2000);
};

export default Login;
