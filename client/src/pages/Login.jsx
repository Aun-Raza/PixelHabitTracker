import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/user';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, REGISTER_USER } from '../graphql/query';

const Login = () => {
  const [usernameState, setUsername] = useState('');
  const [passwordState, setPassword] = useState('');
  const [loginGraphQL, { data: loginData }] = useMutation(LOGIN_USER);
  const [registerGraphQL, { data: registerData }] = useMutation(REGISTER_USER);
  const dispatch = useDispatch();
  const [mode, setMode] = useState('Login');

  async function handleSubmit(ev) {
    ev.preventDefault();

    try {
      if (mode === 'Login') {
        await loginGraphQL({
          variables: {
            input: { username: usernameState, password: passwordState },
          },
        });
      } else {
        await registerGraphQL({
          variables: {
            input: { username: usernameState, password: passwordState },
          },
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  if (loginData) {
    const { username, points, token, habits } = loginData.login;
    localStorage.setItem('Authorization', token);
    dispatch(login({ username, points, habits }));
  }

  if (registerData) {
    const { username, points, token, habits } = registerData.register;
    localStorage.setItem('Authorization', token);
    dispatch(login({ username, points, habits }));
  }

  return (
    <div className='flex min-h-full flex-col justify-center p-6 lg:px-8'>
      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form
          onSubmit={handleSubmit}
          className='space-y-6'
          action='#'
          method='POST'
        >
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Username
            </label>
            <div className='mt-2'>
              <input
                id='username'
                name='username'
                type='username'
                value={usernameState}
                onChange={(ev) => setUsername(ev.target.value)}
                autoComplete='username'
                required
                className='block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='password'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Password
              </label>
            </div>
            <div className='mt-2'>
              <input
                id='password'
                name='password'
                type='password'
                value={passwordState}
                onChange={(ev) => setPassword(ev.target.value)}
                autoComplete='current-password'
                required
                className='px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              {mode}
            </button>
          </div>
          {mode === 'Login' && (
            <p
              className='text-sm cursor-pointer'
              onClick={() => setMode('Register')}
            >
              Don&apos;t have an account?{' '}
              <span className='text-lg font-mono uppercase underline text-blue-800'>
                Register
              </span>
            </p>
          )}
          {mode === 'Register' && (
            <p
              className='text-sm cursor-pointer'
              onClick={() => setMode('Login')}
            >
              Already have an account?{' '}
              <span className='text-lg font-mono uppercase underline text-blue-800'>
                Login
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
