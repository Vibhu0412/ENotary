import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Textinput from '@/components/ui/Textinput';
import { useSearchParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Country, State, City } from 'country-state-city';
import Flatpickr from 'react-flatpickr';
import Fileinput from '@/components/ui/Fileinput';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { country } from '@/constant/address';
import { state } from '@/constant/address';
import { city } from '@/constant/address';
import InputGroup from '@/components/ui/InputGroup';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Checkbox from '@/components/ui/Checkbox';
import Textarea from '@/components/ui/Textarea';
import { useDispatch } from 'react-redux';
import SelectField from '../../../components/ui/SelectField';
import { fileUpload } from '../../../share/utils';
import { useSigneeSignupMutation } from '../../../services/authService';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const idDocType = [
  {
    label: "State Issued Driver's License or Identification Card",
    value: 'STATE_LICENSE',
  },
  { label: 'Passport', value: 'PASSPORT' },
  { label: 'Other', value: 'OTHER' },
];

const getDefaultDate = (eighteenYearsAgo = '') => {
  if (eighteenYearsAgo == '') {
    eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  }

  const year = eighteenYearsAgo.getFullYear();
  const month = String(eighteenYearsAgo.getMonth() + 1).padStart(2, '0');
  const day = String(eighteenYearsAgo.getDate()).padStart(2, '0');
  return `${month}-${day}-${year}`;
};

const schema = yup
  .object({
    firstName: yup.string().required('First Name is Required'),
    lastName: yup.string().required('Last Name is Required'),
    email: yup.string().email('Invalid email').required('Email is Required'),
    idDocumentNumber: yup.string().required('Id Document Number is Required'),
    dob: yup.date().required('Date of Birth is Required'),
    idExpiryDate: yup
      .date()
      .required('Identification Expiration Date is Required'),
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
    address: yup.string().required('Address is Required'),
    idDocumentTypeOther: yup.string().when('idDocumentType', {
      is: idDocumentType => idDocumentType === 'OTHER',
      then: yup.string().required('Document Type Other is Required'),
      otherwise: yup.string().notRequired(),
    }),
    zipCode: yup
      .string()
      .required('Zip is Required')
      .matches(/^\d+$/, 'Zip Code must be a numeric value'),
    idDocument: yup
      .mixed()
      .required('Copy Of Identification Document is Required'),
    acceptTerms: yup
      .boolean()
      .oneOf([true], '')
      .required('Terms Of Service is Required'),
      city:yup.string().required('City is Required'),
      state:yup.string().required('State is Required'),
      country:yup.string().required('Country is Required'),
  })
  .shape({
    idDocumentType: yup.object().shape({
      label: yup.string().required('Document Type is Required'),
      value: yup.string().required('Document Type is Required'),
    }),
  })
  .required()
  .nullable();
const SigneeSignupForm = () => {
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();

  const [checked, setChecked] = useState(false);
  const [datePicker, setDatePicker] = useState();
  const [selectedIdDocType, setSelectedIdDocType] = useState('');
  const [signeeSignup, extra] = useSigneeSignupMutation();

  const [selectedIdentificationFile, setSelectedIdentificationFile] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [countries, setCountries] = useState([]);
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
    control,
    setValue,
    trigger,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const idDocumentTypeWatch = watch('idDocumentType');

  const handleFileChange = async e => {
    setSelectedIdentificationFile(e.target.files[0]);
    setValue('idDocument', 'sample');
    await trigger('idDocument');
  };
  const onSubmit = async data => {
    const isToken = queryParameters.get('jwt') ?? '';
    try {
      const awsFileUploadReturn = await fileUpload(
        selectedIdentificationFile,
        `/documentFolder/${selectedIdentificationFile.name}`
      );
      if (Object.hasOwn(data, 'confirmpass')) {
        delete data['confirmpass'];
      }
      if (isToken) {
        data['jwt'] = isToken;
      }
      data['city'] = data['city'].value;

      data['country'] = data['country'].value;
      data['state'] = data['state'].value;
      data['idDocumentType'] = data['idDocumentType'].value;
      data['idDocument'] = awsFileUploadReturn?.getUrl;
      await signeeSignup(data);
    } catch (error) {
      toast.error(error?.data?.error, {
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
  console.log('error', errors);

  useEffect(() => {
    let { isSuccess } = extra;
    if (isSuccess) {
      if (
        getValues('idDocumentType') &&
        getValues('idDocumentType').value === 'OTHER'
      ) {
        toast.success(
          'Signup successfully! You will receive confirmation mail soon.',
          {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          }
        );
      } else {
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
      }
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [extra]);
  useEffect(() => {
    const countryOptions = Country.getAllCountries().map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));
    setCountries(countryOptions);
  }, []);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 ">
          <InputGroup
            id="firstName"
            name="firstName"
            label="First name"
            type="text"
            placeholder="First name"
            register={register}
            error={errors.firstName}
            className="h-[52px]"
            merged
          />
          <InputGroup
            id="Lastnm"
            name="lastName"
            label="Last name"
            type="text"
            placeholder="Last name"
            register={register}
            error={errors.lastName}
            className="h-[52px]"
            merged
          />{' '}
          <InputGroup
            label="E-mail Address"
            name="email"
            id="hi_email1"
            type="email"
            register={register}
            error={errors.email}
            placeholder="E-mail Address"
            className="h-[52px]"
            merged
          />
          <div>
            <label className="form-label" for="inline-picker">
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
                  {...field}
                  placeholder="Select a date"
                  id="dob"
                  options={{
                    maxDate: eighteenYearsAgo,
                    dateFormat: 'm/d/Y',
                  }}
                  style={{ backgroundColor: 'transparent' }}
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
              <SelectField
                name="country"
                label="country"
                id="country"
                // onClick={e => {
                //   setValue('country', e);
                // }}
                // setValue={setValue}
                register={register}
                error={errors.country}
                control={control}
                options={countries}
                // value={selectedCountry}
                // getOptionLabel={(options) => {
                //   return options["name"];
                // }}
                // getOptionValue={(options) => {
                //   return options["name"];
                // }}
                value={selectedCountry}
                onChange={(item) => {
                  setSelectedCountry(item);
                }}
              />
            </div>
            <div>
              <SelectField
                name="state"
                label="state"
                id="state"
                setValue={setValue}
                register={register}
                error={errors.state}
                control={control}
                options={selectedCountry
                  ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
                      value: state.isoCode,
                      label: state.name,
                    }))
                  : []}
                // getOptionLabel={options => {
                //   return options['name'];
                // }}
                // getOptionValue={options => {
                //    return options['name'];
                // }}
                value={selectedState}
                onChange={(item) => setSelectedState(item)}
              />
            </div>
          </div>
          <div className=" grid grid-cols-2 gap-5">
            <div>
              <SelectField
                name="city"
                label="city"
                setValue={setValue}
                id="city"
                register={register}
                error={errors.city}
                control={control}
                options={selectedState
                  ? City.getCitiesOfState(
                      selectedCountry?.value,
                      selectedState?.value
                    ).map((city) => ({
                      value: city.name,
                      label: city.name,
                    }))
                  : []}
                // getOptionLabel={options => {
                //    return options['name'];
                // }}
                // getOptionValue={options => {
                //    return options['name'];
                // }}
                value={selectedCity}
                onChange={item => {
                  setSelectedCity(item);
                }}
              />
            </div>
            <Textinput
              name="zipCode"
              register={register}
              label="Zip Code"
              type="text"
              placeholder="Zip Code"
              className="h-[52px]"
              error={errors.zipCode}
            />
          </div>
          <div>
            <SelectField
              setValue={setValue}
              onChange={e => {
                setValue('idDocumentType', e);
                setSelectedIdDocType(e.value);
              }}
              className={`${errors.idDocumentType && 'border-danger-500'}`}
              name="idDocumentType"
              label="Identification Document Type"
              id="idDocumentType"
              register={register}
              errors={errors}
              control={control}
              options={idDocType}
            />
          </div>
          {idDocumentTypeWatch?.value === 'OTHER' && (
            <InputGroup
              id="idDocumentTypeOther"
              name="idDocumentTypeOther"
              label="Identification Document Type(other)"
              type="text"
              placeholder="Identification Document Type"
              register={register}
              error={errors.idDocumentTypeOther}
              className="h-[52px]"
              merged
            />
          )}
          <Textinput
            name="idDocumentNumber"
            register={register}
            label="Identification Document Number"
            type="text"
            placeholder=" Identification Document Number"
            className="h-[52px]"
            error={errors.idDocumentNumber}
            merged
          />
          <div>
            <label className="form-label" for="inline-picker">
              Identification Expiration Date
            </label>
            <Controller
              name="idExpiryDate"
              control={control}
              render={({ field }) => (
                <Flatpickr
                  className={`form-control h-[52px] ${
                    errors.idExpiryDate && 'border-danger-500'
                  }`}
                  placeholder="Select a date"
                  id="idExpiryDate"
                  options={{
                    dateFormat: 'm/d/Y',
                  }}
                  {...field}
                />
              )}
            />
            {errors.idExpiryDate && (
              <p className="text-danger-500 text-sm mt-[.5rem]">
                {errors.idExpiryDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="form-label" for="inline-picker">
              Copy of Identification Document
            </label>
            <Fileinput
              name="idDocument"
              id="idDocument"
              selectedFile={selectedIdentificationFile}
              error={errors.idDocument}
              onChange={handleFileChange}
              register={register}
              className={`h-[52px] ${errors.idDocument && 'border-danger-500'}`}
            />
          </div>
        </div>
        <Checkbox
          label="I agree with Terms of Service"
          value={checked}
          error={errors.acceptTerms}
          register={register}
          onChange={e => {
            setValue('acceptTerms', !checked);
            setChecked(!checked);
          }}
        />
        <Button
          text="Sign Up"
          className="btn-dark block-btn"
          style={{ display: 'flex' }}
          type="submit"
          isLoading={isSubmitting}
        />
      </form>
    </>
  );
};

export default SigneeSignupForm;
