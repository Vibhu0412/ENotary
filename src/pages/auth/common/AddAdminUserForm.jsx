import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/ui/Button';
import InputGroup from '@/components/ui/InputGroup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useAddAdminMutation } from '../../../services/adminServices';

const schema = yup
  .object({
    firstName: yup.string().required('First Name is Required'),
    lastName: yup.string().required('Last Name is Required'),
    email: yup.string().email('Invalid email').required('Email is Required'),
  })
  .required();

const AddAdminUserForm = ({ onCloseModal }) => {
  const [addAdminUrl] = useAddAdminMutation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: 'all',
  });
  const onSubmit = async data => {
    try {
      const response = await addAdminUrl(data);

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
      toast.error(error.message, {
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
    onCloseModal(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <InputGroup
        label="First Name"
        name="firstName"
        placeholder="First Name"
        id="firstName"
        type="text"
        register={register}
        error={errors.firstName}
        className="h-[52px]"
        merged
      />
      <InputGroup
        label="Last Name"
        name="lastName"
        type="text"
        placeholder="Last Name"
        className="h-[52px]"
        register={register}
        error={errors.lastName}
        merged
      />
      <InputGroup
        label="Email Address"
        name="email"
        id="hi_email1"
        type="email"
        register={register}
        error={errors.email}
        placeholder="Email Address"
        className="h-[52px]"
        merged
      />
      <Button text="Submit" className="btn-dark block-btn" type="submit" />
    </form>
  );
};

export default AddAdminUserForm;
