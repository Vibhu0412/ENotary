import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputGroup from '@/components/ui/InputGroup';
import { Country, State, City } from "country-state-city";
import Button from '@/components/ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { country } from '@/constant/address';
import { state } from '@/constant/address';
import { city } from '@/constant/address';
import Textinput from '@/components/ui/Textinput';
import Checkbox from '@/components/ui/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { handleRegister } from './store';
import Textarea from '@/components/ui/Textarea';
import Fileinput from '@/components/ui/Fileinput';
import FlatpickerPage from '../../forms/date-time-picker';
import { useOrganizationSignupMutation } from '../../../services/organizationServices';
import SelectField from '../../../components/ui/SelectField';
import { fileUpload } from '../../../share/utils';

const organizationtype = [
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Legal Practices', label: 'Legal Practices' },
  { value: 'Human Resource Dept.', label: 'Human Resource Dept.' },
  { value: 'Hospitals', label: 'Hospitals' },
  { value: 'Personal', label: 'Personal' },
  { value: 'Others', label: 'Others' },
];
const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: '14px',
  }),
};
const FILE_FORMATS = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const schema = yup
  .object({
    name: yup
      .string()
      .required('Organization Name is Required')
      .matches(/^[a-zA-Z]+$/, 'Must only consist of alphabetic characters'),
    contactPersonFirstName: yup
      .string()
      .required('Contact Person’s First Name is Required')
      .matches(/^[a-zA-Z]+$/, 'Must only consist of alphabetic characters'),
    contactPersonLastName: yup
      .string()
      .required('Contact Person’s Last Name is Required')
      .matches(/^[a-zA-Z]+$/, 'Must only consist of alphabetic characters'),
    emailAddress: yup
      .string()
      .email('Invalid email')
      .required('Email is Required'),
    acceptTerms: yup
      .boolean()
      .oneOf([true], '')
      .required('Terms Of Service is Required'),
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
    registrationDocument: yup
      .mixed()
      .required('Registration Document is Required'),
      city:yup.string().required('City is Required'),
      state:yup.string().required('State is Required'),
      country:yup.string().required('Country is Required'),
      type:yup.string().required('Organization Type is Required')
    // .test('fileFormat', 'Invalid file format', value => value && FILE_FORMATS.includes(value[0].type)),
    // additionalInformation: yup
    //   .string()
    //   .required('Additional Information is Required'),

    // acceptTerms: yup.boolean().oneOf([true], 'Accept Ts & Cs is required').required(),
  })
  // .shape({
  //   type: yup.object().shape({
  //     label: yup.string().required('Organization Type is Required'),
  //     value: yup.string().required('Organization Type is Required'),
  //   }),
  // })
  .required()
  .nullable();

const OrganizationSignupForm = () => {
  const location = useLocation();
  const showTermCondition = location.pathname.includes(
    '/organization-register'
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [picker, setPicker] = useState(new Date());
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedType, setSelectedType] = useState(organizationtype[0]); 

  const [selectedOrganizationregiFile, setSelectedOrganizationregiFile] =
    useState(null);
  const [organizationSignup, { isSuccess }] = useOrganizationSignupMutation();
  const {
    register,
    formState: { errors,isSubmitting,setSubmitting },
    handleSubmit,
    setValue,
    control,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const handleFileChange = async e => {
    setSelectedOrganizationregiFile(e.target.files[0]);
    setValue('registrationDocument', 'sample');
    await trigger('registrationDocument');
  };

  const onSubmit = async (data) => {
    console.log('Form data received on submit:', data);
    console.log('Selected Organization Type:', selectedType);
    console.log('Errors:', errors);
    try {
      const OrganizationregiFileResponsee = await fileUpload(
        selectedOrganizationregiFile,
        `/OrganizationregiFileFolder/${selectedOrganizationregiFile.name}`
      );
      data['city'] = selectedCity?.value || '';
      data['country'] = selectedCountry?.value || '';
      data['state'] = selectedState?.value || '';
      data['type'] = selectedType?.value;

      console.log("ORGANIZATION TYPE ---->", data['type'])
      data['registrationDocument'] = OrganizationregiFileResponsee?.getUrl;

      await trigger('type');
      await organizationSignup(data);
    } catch (e) {
      // toast.error('Error while Creating');
      console.error(e);
      setSubmitting(false)
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success('Organization registration successful');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [isSuccess]);
  useEffect(() => {
    const countryOptions = Country.getAllCountries().map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));
    setCountries(countryOptions);
  }, []);

  // New useEffect block to update states when selectedCountry changes
  useEffect(() => {
    if (selectedCountry) {
      const stateOptions = State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }));
      setStates(stateOptions);
      setSelectedState(null); // Reset selected state when country changes
      setSelectedCity(null); // Reset selected city when country changes
      trigger('country'); // Manually trigger validation for "country" field
    }
  }, [selectedCountry, trigger]);

  // New useEffect block to update cities when selectedState changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cityOptions = City.getCitiesOfState(selectedCountry.value, selectedState.value).map((city) => ({
        value: city.name,
        label: city.name,
      }));
      setCities(cityOptions);
      setSelectedCity(null); // Reset selected city when state changes
      trigger('state'); // Manually trigger validation for "state" field
    }
  }, [selectedCountry, selectedState, trigger]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
      <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
        <Textinput
          name="name"
          id="name"
          register={register}
          label="Organization Name"
          type="text"
          placeholder="Organization Name"
          className="h-[52px]"
          error={errors.name}
        />
        <div>
          <div className="h-[52px] react-select">
            <SelectField
              className="react-select"
              name="type"
              id="type"
              label="Organization Type"
              defaultValue={organizationtype[0]}
              // setValue={setValue}
              classNamePrefix="select"
              register={register}
              error={organizationtype ? null : errors.type}
              // error={errors.type}
              control={control}
              options={organizationtype}
              // value={selectedType} // Set the selected value
              onChange={(selectedOption) => {
                console.log('Selected Organization Type:', selectedOption?.value);
                setSelectedType(selectedOption); // Update the selected type
                setValue('type', selectedOption?.value);
              }}
            />
          </div>
        </div>
        <Textinput
          name="contactPersonFirstName"
          id="contactPersonFirstName"
          register={register}
          label="Contact Person’s First Name"
          type="text"
          placeholder="Contact Person’s First Name"
          className="h-[52px]"
          error={errors.contactPersonFirstName}
        />
        <Textinput
          name="contactPersonLastName"
          register={register}
          label="Contact Person’s Last Name"
          type="text"
          placeholder="Contact Person’s Last Name"
          className="h-[52px]"
          error={errors.contactPersonLastName}
        />
        <Textinput
          label="Email Address"
          name="emailAddress"
          type="emailAddress"
          register={register}
          error={errors.emailAddress}
          placeholder="Email Address"
          className="h-[52px]"
        />
        <InputGroup
          label="Phone Number"
          name="phoneNumber"
          prepend="+1"
          placeholder="Phone Number"
          id="phoneNumber"
          register={register}
          error={errors.phoneNumber}
          options={{ phone: true, phoneRegionCode: 'US' }}
          isMask
          className="h-[52px]"
          onChange={e => {
            setValue('phoneNumber', e.target.value.replaceAll(' ', ''));
          }}
        />
        {!showTermCondition ? (
          <>
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
              id="password"
              name="confirmpass"
              type="password"
              placeholder="Confirm Password"
              hasicon
              register={register}
              error={errors.confirmpass}
              className={` ${errors.confirmpass ? 'error' : ''} h-[52px]`}
              merged
            />{' '}
          </>
        ) : null}

<div className=' grid grid-cols-2 gap-5'>
            <div>
              <SelectField
                name='country'
                label='country'
                id='country'
                register={register}
                error={selectedCountry ? null : errors.country} // Disable error if country is selected
                control={control}
                options={countries}
                onChange={(selectedOption) => {
                  setSelectedCountry(selectedOption);
                  setValue('country', selectedOption?.value); // Set the selected country value to the form data
                }}
              />
            </div>
            <div>
              <SelectField
                name='state'
                label='state'
                id='state'
                // setValue={setValue}
                register={register}
                error={selectedState ? null : errors.state} // Disable error if state is selected
                control={control}
                options={states}
                onChange={(selectedOption) => {
                  setSelectedState(selectedOption);
                  setValue('state', selectedOption?.value); // Set the selected country value to the form data
                }}
              />
            </div>
          </div>
          <div className=' grid grid-cols-2 gap-5'>
            <div>
              <SelectField
                name='city'
                label='city'
                id='city'
                register={register}
                error={selectedCity ? null : errors.city} // Disable error if city is selected
                control={control}
                options={cities}
                onChange={(selectedOption) => {
                  setSelectedCity(selectedOption);
                  setValue('city', selectedOption?.value); // Set the selected country value to the form data
                }}
              />
            </div>
          <Textinput
            name="zipCode"
            id="zipCode"
            register={register}
            label="Zip Code"
            type="text"
            placeholder="Zip Code"
            className="h-[52px]"
            error={errors.zipCode}
          />
        </div>
        <Textarea
          label="Address"
          name="address"
          id="address"
          error={errors.address}
          register={register}
          placeholder="Address"
          row="1"
          className="h-[52px]"
        />
        <div>
          <label className="form-label" for="inline-picker">
            Organization Registration Document
          </label>
          <Fileinput
            name="registrationDocument"
            id="registrationDocument"
            selectedFile={selectedOrganizationregiFile}
            error={errors.registrationDocument}
            onChange={handleFileChange}
            className={`h-[52px] ${errors.registrationDocument && 'border-danger-500'}`}
          />
        </div>
        <Textinput
          name="additionalInformation"
          register={register}
          label="Additional Information"
          type="text"
          placeholder=" Additional Information"
          className="h-[52px]"
          error={errors.additionalInformation}
        />
        
      </div>
      {!showTermCondition ? (
        <>
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
        </>
      ) : null}
    </form>
  );
};

export default OrganizationSignupForm;