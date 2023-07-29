import React, { useState, useContext, useEffect } from 'react';
// import Textinput from '@/components/ui/Textinput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/ui/Button';
import InputGroup from '@/components/ui/InputGroup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@/components/ui/Checkbox';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleLogin, setJwtToken } from './store';
import { toast } from 'react-toastify';
import { useSigneeLoginMutation } from '../../../services/authService';
import { useUserInfoMutation } from '../../../services/commonService';
import { useCookies } from 'react-cookie';

const schema = yup
  .object({
    email: yup.string().email('Invalid email').required('Email is Required'),
    password: yup.string().required('Password is Required'),
  })
  .required();

const LoginForm = () => {
  const [emailInCookies, setEmailInCookie] = useCookies(['email&password']);

  const navigate = useNavigate();
  const [
    userInfo,
    {
      isError: userInfoIsError,
      error: userInfoError,
      isLoading: userInfoIsLoading,
    },
  ] = useUserInfoMutation();

  const [signeeLogin, extra] = useSigneeLoginMutation();

  const dispatch = useDispatch();

  const {
    register,
    formState: { errors,isSubmitting ,setSubmitting},
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),

    mode: 'all',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const setCookies = data => {
    setEmailInCookie('email&password', data, { path: '/' });
  };

  const onSubmit = async data => {
    if (rememberMe) {
      console.log('my remember me is ', rememberMe);
      setCookies(data);
    }

    try {
      const loginData = await signeeLogin(data);
      const jwt = loginData?.data?.data?.jwtToken;
      if (jwt) {
        dispatch(setJwtToken({ jwt }));
        const meUserApiRes = await userInfo();
        const {
          email,
          userType,
          status,
          firstName,
          lastName,
          isSignupComplete,
          organization,
        } = meUserApiRes?.data?.data;
        const user = {
          email,
          userType,
          status,
          name: firstName + ' ' + lastName,
        };
        let isAuth = true;
        dispatch(handleLogin({ isAuth, user }));
        if (meUserApiRes?.data?.data?.status === 'APPROVED') {
          navigate(
            `/${
              userType === 'admin' && organization ? 'organization' : userType
            }/dashboard`
          );
        } else if (!isSignupComplete && userType === 'notary') {
          navigate(`/notaryform`);
        } else if (
          meUserApiRes?.data?.data?.status === 'REQUESTED_VERIFICATION'
        ) {
          toast.info(
            `Your account is currently being verified.
            Once your account has been verified, you will shortly receive an email.`,
            {
              position: 'top-right',
              autoClose: 5500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            }
          );
        } else {
          navigate(`/approvedetails`, {
            state: { userType: userType },
          });
        }
      }
    } catch (e) {
      let error = e?.message;
      if (error === undefined) {
        error = e?.data?.error;
      }
      toast.error(`${error}`, {
        position: 'top-right',
        autoClose: 5500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setSubmitting(false)
    } 
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <InputGroup
        label="Email Address"
        name="email"
        id="email1"
        type="email"
        register={register}
        error={errors.email}
        onChange={e => console.log(setValue('email', e?.target?.value))}
        placeholder="Email Address"
        className="h-[52px]"
        defaultValue={emailInCookies['email&password']?.email || ''}
        merged
      />
      <InputGroup
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        onChange={e => console.log(setValue('password', e?.target?.value))}
        register={register}
        hasicon
        error={errors.password}
        className={` ${errors.password ? 'error' : ''} h-[52px]`}
        defaultValue={emailInCookies['email&password']?.password || ''}
        merged
      />
      <div className="flex justify-between">
        <Checkbox
          value={rememberMe}
          onChange={() => {
            setRememberMe(!rememberMe);
          }}
          label="Remember Me"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-blue-500 dark:text-blue-400 leading-6 font-medium hover:underline"
        >
          Forgot Password?{' '}
        </Link>
      </div>
      <Button
          text="Login"
          className="btn-dark block-btn"

          type="submit"
          
          isLoading={isSubmitting === true? true :false}

        />
        
    </form>
  );
};

export default LoginForm;
