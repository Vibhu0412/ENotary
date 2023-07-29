import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputGroup from '@/components/ui/InputGroup';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { useNavigate } from 'react-router-dom';
import Textinput from '@/components/ui/Textinput';
import { country } from '@/constant/address';
import { state } from '@/constant/address';
import { city } from '@/constant/address';
import Fileinput from '@/components/ui/Fileinput';
import Checkbox from '@/components/ui/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { handleRegister } from './store';
import Textarea from '@/components/ui/Textarea';
import FlatpickerPage from '../../forms/date-time-picker';
import { Link } from 'react-router-dom/dist';
import SelectField from '../../../components/ui/SelectField';
import { useNotarySignupMutation } from '../../../services/notaryService';
import { fileUpload } from '../../../share/utils';

const idDocType = [
  {
    value: "State Issued Driver's License or Identification Card",
    label: "State Issued Driver's License or Identification Card",
  },
  { value: 'Passport', label: 'Passport' },
  { value: 'Other', label: 'Other' },
];
const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: '14px',
  }),
};
const getDefaultDate = (eighteenYearsAgo = '') => {
  if (eighteenYearsAgo == '') {
    eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  }

  const year = eighteenYearsAgo.getFullYear();
  const month = String(eighteenYearsAgo.getMonth() + 1).padStart(2, '0');
  const day = String(eighteenYearsAgo.getDate()).padStart(2, '0');
  return `${month}/${day}/${year}`;
};
const FILE_FORMATS = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const schema = yup
  .object({
    firstName: yup.string().required('First Name is Required'),
    lastName: yup.string().required('Last Name is Required'),
    email: yup.string().email('Invalid email').required('Email is Required'),
    dob: yup.date().required('Date of Birth is Required'),
    notaryCommissionExpiryDate: yup
      .date()
      .required('Notary Commission Expiration Date is Required'),
    password: yup
      .string()
      .required('Password is Required')
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must be at least 8 characters, including numbers, one uppercase letter, and one special character'
      ),
    confirmpass: yup
      .string()
      .required('Confirm Password is Required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    phoneNumber: yup
      .string()
      .required('Phone Number is Required')
      .matches(/^[0-9]+$/, 'Phone Number must be numeric')
      .min(10, 'Phone Number must be at least 10 characters'),
    zipCode: yup
      .string()
      .required('Zip is Required')
      .matches(/^\d+$/, 'Zip Code must be a numeric value'),
    address: yup.string().required('Address is Required'),
    notaryCommissionDocument: yup
      .mixed()
      .required('Copy Of Notary Commission is Required'),
    // .test('fileFormat', 'Invalid file format', value => value && FILE_FORMATS.includes(value[0].type)),
    acceptTerms: yup
      .boolean()
      .oneOf([true], '')
      .required('Terms Of Service is Required'),
    notaryCommissionNumber: yup
      .string()
      .required('Notary Commission Number is Required'),
    // notarycommisionImage : yup.object().shape({
    //   file: yup.object().shape({
    //     name: yup.string().required()
    // }).required('File is Required')
    // }),
    // identificationImage :  yup.mixed()
    // .required("File is Required")
    // .test("fileType", "Invalid file type", (value) => {
    //   if (value) {
    //     const acceptedFileTypes = ["image/jpeg", "image/png"];
    //     return acceptedFileTypes.includes(value.type);
    //   }
    //   return true;
    // }),
  })
  .shape({
    city: yup.object().shape({
      label: yup.string().required('City is Required'),
      value: yup.string().required('City is Required'),
    }),
    state: yup.object().shape({
      label: yup.string().required('State is Required'),
      value: yup.string().required('State is Required'),
    }),
    country: yup.object().shape({
      label: yup.string().required('Country is Required'),
      value: yup.string().required('Country is Required'),
    }),
    stateOfNotaryCommission: yup.object().shape({
      label: yup.string().required('State Of Notary Commission is Required'),
      value: yup.string().required('State Of Notary Commission is Required'),
    }),
  })
  .required()
  .nullable();

const NotarySignupForm = () => {
  const dispatch = useDispatch();

  const [checked, setChecked] = useState(false);
  const [selectedCommisionFile, setSelectedCommisionFile] = useState(null);
  const [selectedIdentificationFile, setSelectedIdentificationFile] =
    useState(null);
  const [notaryFile, setNotaryFileFile] = useState(null);
  const [picker, setPicker] = useState(new Date());
  const [datePicker, setDatePicker] = useState();
  const [notarySignup, extra] = useNotarySignupMutation();

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const {
    register,
    formState: { errors,isSubmitting,setSubmitting },
    handleSubmit,
    control,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const handleFileChange = async e => {
    setSelectedCommisionFile(e.target.files[0]);
    setValue('notaryCommissionDocument', 'sample');
    await trigger('notaryCommissionDocument');
  };
  const handleIdentificationChange = e => {
    setSelectedIdentificationFile(e.target.files[0]);
    setNotaryFileFile(e.target.files[0]);
  };
  const navigate = useNavigate();

  const onSubmit = async data => {
    try {
      const commisionFileResponsee = await fileUpload(
        selectedCommisionFile,
        `/commisionFolder/${selectedCommisionFile.name}`
      );
      data['city'] = data['city'].value;
      data['country'] = data['country'].value;
      data['state'] = data['state'].value;
      data['stateOfNotaryCommission'] = data['stateOfNotaryCommission'].value;
      data['notaryCommissionDocument'] = commisionFileResponsee?.getUrl;
      await notarySignup(data);
    } catch (error) {
      toast.error('Error while Creating');
      console.error(error);
      setSubmitting(false)
    }
  };
  useEffect(() => {
    setPicker(eighteenYearsAgo);
    let { isSuccess, data } = extra;
    if (isSuccess) {
      toast.success('Signup successfully!', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [extra]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
      <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
        <Textinput
          name="firstName"
          register={register}
          label="First name"
          type="text"
          placeholder=" Enter your First name"
          className="h-[52px]"
          error={errors.firstName}
        />
        <Textinput
          name="lastName"
          label="Last name"
          type="text"
          placeholder=" Enter your Last name"
          register={register}
          error={errors.lastName}
          className="h-[52px]"
        />
        <Textinput
          label="Email Address"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="Email Address"
          className="h-[52px]"
        />
        <div>
          <label className="form-label" htmlFor="inline-picker">
            Date of Birth
          </label>
          <Controller
            name="dob"
            control={control}
            className="form-control  h-[52px]"
            render={({ field }) => (
              <Flatpickr
                register={register}
                className={`form-control h-[52px] ${
                  errors.dob && 'border-danger-500'
                }`}
                placeholder="Select a date"
                id="dob"
                options={{
                  maxDate: eighteenYearsAgo,
                  dateFormat: 'm/d/Y',
                }}
                {...field}
              />
            )}
          />
          {errors.dob && (
            <p className="text-danger-500 text-sm mt-[.5rem]">
              {errors.dob.message}
            </p>
          )}
        </div>
        <InputGroup
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          // defaultValue={users[0].password}
          hasicon
          register={register}
          error={errors.password}
          className={` ${errors.password ? 'error' : ''} h-[52px]`}
          merged
        />
        <InputGroup
          label="Confirm Password"
          id="password"
          name="confirmpass"
          type="password"
          placeholder="Password"
          hasicon
          register={register}
          error={errors.confirmpass}
          className={` ${errors.confirmpass ? 'error' : ''} h-[52px]`}
          merged
        />
        <InputGroup
          label="Phone Number"
          name="phoneNumber"
          prepend="+1"
          placeholder="Phone Number"
          id="phoneNumber"
          register={register}
          error={errors.phoneNumber}
          onChange={e => {
            setValue('phoneNumber', e.target.value.replaceAll(' ', ''));
          }}
          options={{ phone: true, phoneRegionCode: 'US' }}
          isMask
          className="h-[52px]"
        />
        <Textarea
          label="Address"
          name="address"
          id="pn4"
          error={errors.address}
          register={register}
          placeholder="Address"
          row="1"
          className="h-[52px]"
        />
        <div className=" grid grid-cols-2 gap-5">
          <div>
            <div className="h-[52px] react-select">
              <SelectField
                name="country"
                label="Country"
                id="country"
                onChange={e => {
                  setValue('country', e);
                }}
                setValue={setValue}
                register={register}
                errors={errors}
                control={control}
                options={country}
              />
            </div>
          </div>
          <div>
            <SelectField
              name="state"
              label="state"
              id="state"
              setValue={setValue}
              register={register}
              errors={errors}
              control={control}
              options={state}
            />
          </div>
        </div>
        <div className=" grid grid-cols-2 gap-5">
          <div>
            <div className="h-[52px] react-select">
              <SelectField
                name="city"
                label="city"
                setValue={setValue}
                id="city"
                register={register}
                errors={errors}
                control={control}
                options={city}
              />
            </div>
          </div>
          <Textinput
            name="zipCode"
            register={register}
            label="Zip Code"
            placeholder="Zip Code"
            className="h-[52px]"
            error={errors.zipCode}
          />
        </div>
        <div>
          <div className="h-[52px] react-select">
            <SelectField
              label="State Of Notary Commission"
              name="stateOfNotaryCommission"
              type="text"
              id="stateOfNotaryCommission"
              register={register}
              setValue={setValue}
              errors={errors}
              control={control}
              options={state}
              className="h-[52px]"
            />
          </div>
        </div>
        <Textinput
          label="Notary Commission Number"
          name="notaryCommissionNumber"
          type="text"
          register={register}
          error={errors.notaryCommissionNumber}
          placeholder="Notary Commission Number"
          className="h-[52px]"
        />
        <div>
          <label className="form-label" for="inline-picker">
            Notary Commission Expiration Date
          </label>
          <Controller
            name="notaryCommissionExpiryDate"
            control={control}
            render={({ field }) => (
              <Flatpickr
                className={`form-control h-[52px] ${
                  errors.notaryCommissionExpiryDate && 'border-danger-500'
                }`}
                register={register}
                placeholder="Select a date"
                id="notaryCommissionExpiryDate"
                options={{
                  dateFormat: 'm/d/Y',
                }}
                {...field}
                // onChange={date =>
                //   setValue(
                //     'notaryCommissionExpiryDate',
                //     date[0] ? date[0].toLocaleDateString() : ''
                //     )
                // }
                // value={datePicker}
              />
            )}
          />
          {errors.notaryCommissionExpiryDate && (
            <p className="text-danger-500 text-sm mt-[.5rem]">
              {errors.notaryCommissionExpiryDate.message}
            </p>
          )}
          {/* <Flatpickr
            name="notaryCommissionExpiryDate"
            error={errors.notaryCommissionExpiryDate}
            className="form-control  h-[52px]"
            value={datePicker}
            onChange={date => setDatePicker(date)}
            id="notaryCommissionExpiryDate"
            options={{
              dateFormat: 'm/d/Y', // Set the date format as "mm/dd/yyyy"
            }}
          /> */}
        </div>
        <div>
          <label className="form-label" for="inline-picker">
            Copy of Notary Commission
          </label>
          <Fileinput
            name="notaryCommissionDocument"
            id="notaryCommissionDocument"
            selectedFile={selectedCommisionFile}
            onChange={handleFileChange}
            className={`h-[52px] ${
              errors.notaryCommissionDocument && 'border-danger-500'
            }`}
            error={errors.notaryCommissionDocument}
          />
        </div>
      </div>
      <Checkbox
        label={
          <span>
            I agree with{' '}
            <Link to="/termsandcondition" className="text-primary-800">
              Terms of Service
            </Link>
          </span>
        }
        value={checked}
        error={errors.acceptTerms}
        register={register}
        onChange={e => {
          setValue('acceptTerms', !checked);
          setChecked(!checked);
        }}
      />

      <Button text="Sign Up" className="btn-dark block-btn" type="submit" isLoading={isSubmitting}/>
    </form>
  );
};

export default NotarySignupForm;
