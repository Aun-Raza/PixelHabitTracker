import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/user';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/query';

const Login = () => {
  const [usernameState, setUsername] = useState('');
  const [passwordState, setPassword] = useState('');
  const [loginGraphQL, { data }] = useMutation(LOGIN_USER);
  const dispatch = useDispatch();

  async function handleSubmit(ev) {
    ev.preventDefault();

    try {
      await loginGraphQL({
        variables: {
          input: { username: usernameState, password: passwordState },
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  if (data) {
    const { username, points, token } = data.login;
    localStorage.setItem('Authorization', token);
    dispatch(login({ username, points }));
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
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
