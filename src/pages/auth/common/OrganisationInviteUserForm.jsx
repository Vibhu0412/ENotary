import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/ui/Button';
import InputGroup from '@/components/ui/InputGroup';
import Radio from '@/components/ui/Radio';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useInviteUsersMutation } from '../../../services/organizationService';

const schema = yup
  .object({
    email: yup.string().email('Invalid email').required('Email is Required'),
    userType: yup.string().required('Please select a User'),
  })
  .required();

const OrganisationInviteUserForm = ({ onCloseModal }) => {
  const [inviteUserUrl] = useInviteUsersMutation();

  const {
    watch,
    register,
    setValue,
    msgTooltip,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const userType = [
    { value: 'signee', label: 'Signee' },
    { value: 'notary', label: 'Notary' },
  ];

  const onSubmit = async data => {
    try {
      const response = await inviteUserUrl(data);
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
      onCloseModal(false);
    } catch (error) {
      toast.error(error, {
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
        type="email"
        register={register}
        error={errors.email}
        placeholder="Email Address"
        className="h-[52px]"
        merged
      />

      <div className="space-y-2">
        <label className="form-label">User Type</label>

        <div className="flex justify-evenly w-[100%]">
          {userType.map((item, index) => (
            // <div class=" w-[50%]">
            <Radio
              key={index}
              label={item.label}
              name="userType"
              className="h-4 w-4"
              value={item.value}
              onChange={() => setValue('userType', item.value)}
              checked={watch('userType') === item.value}
            />
            // </div>
          ))}
        </div>
        {/* error and success message*/}
        {errors?.userType && (
          <div
            className={` mt-2 ${
              msgTooltip
                ? ' inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded'
                : ' text-danger-500 block text-sm'
            }`}
          >
            {errors?.userType?.message}
          </div>
        )}
      </div>

      <Button text="Invite" className="btn-dark block-btn" type="submit" />
    </form>
  );
};

export default OrganisationInviteUserForm;
