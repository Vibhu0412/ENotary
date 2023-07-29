import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/ui/Button';
import InputGroup from '@/components/ui/InputGroup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useForgotPasswordMutation } from '../../../services/authService';

const schema = yup
  .object({
    email: yup.string().email('Invalid email').required('Email is Required'),
  })
  .required();

const ForgotPasswordForm = () => {
  const [forgotPasswordUrl] = useForgotPasswordMutation();

  const {
    register,
    formState: { errors,isSubmitting,setSubmitting  },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: 'all',
  });
  const onSubmit = async data => {
    try {
      const response = await forgotPasswordUrl(data);
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
      setSubmitting(false)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <InputGroup
        label="Email Address"
        name="email"
        id="hi_email1"
        type="email"
        register={register}
        error={errors.email}
        placeholder=" Email Address"
        className="h-[52px]"
        merged
      />

      <Button
        text="Reset Password"
        className="btn-dark block-btn"
        type="submit"
        isLoading={isSubmitting}
      />
    </form>
  );
};

export default ForgotPasswordForm;
