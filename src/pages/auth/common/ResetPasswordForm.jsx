import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/ui/Button';
import InputGroup from '@/components/ui/InputGroup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useResetPasswordMutation } from '../../../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';

const schema = yup
  .object({
    password: yup
      .string()
      .required('Password is Required')
      .min(8, 'Your password is too short.')
      .matches(
        /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
        'Password must be at least 8 characters, including numbers and one uppercase letter'
      ),
    confirmpass: yup
      .string()
      .required('Confirm Password is Required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  })
  .required();

const ResetPasswordForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [resetPasswordUrl] = useResetPasswordMutation();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const onSubmit = async data => {
    try {
      const payload = { password: data.password, token };
      const response = await resetPasswordUrl(payload);
      if (response && !response.error) {
        const successMessage =
          response?.data?.message || 'Success! Please check your email.';
        toast.success(successMessage, {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          onClose: () => {
            navigate('/');
          },
        });
      }
    } catch (error) {
      toast.error(error?.data?.message, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <InputGroup
        label="Email Address"
        name="email"
        id="hi_email1"
        defaultValue={email}
        type="email"
        register={register}
        className="h-[52px]"
        disabled

        // merged
      />
      <InputGroup
        label="New Password"
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        hasicon
        register={register}
        error={errors.password}
        className={` ${errors.password ? 'error' : ''} h-[52px]`}
        merged
      />
      <InputGroup
        label="Confirm Password"
        id="confirm-password"
        name="confirmpass"
        type="password"
        placeholder="Password"
        hasicon
        register={register}
        error={errors.confirmpass}
        className={` ${errors.confirmpass ? 'error' : ''} h-[52px]`}
        merged
      />

      <Button text="Submit" className="btn-dark block-btn" type="submit" />
    </form>
  );
};

export default ResetPasswordForm;
