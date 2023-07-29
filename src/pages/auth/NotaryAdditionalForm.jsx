import React, { useState } from 'react';

import Flatpickr from 'react-flatpickr';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputGroup from '@/components/ui/InputGroup';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { useNavigate } from 'react-router-dom';
import Textinput from '@/components/ui/Textinput';
import Fileinput from '@/components/ui/Fileinput';
import Textarea from '@/components/ui/Textarea';
import Card from '../../components/ui/Card';
import { useNotaryAdditionalSignupMutation } from '../../services/notaryService';
import SelectField from '../../components/ui/SelectField';
import { fileUpload } from '../../share/utils';
import { useUserInfoMutation } from '../../services/commonService';
import { useEffect } from 'react';
// import FlatpickerPage from "../../forms/date-time-picker";

const idDocType = [
  {
    value: 'STATE_LICENSE',
    label: "State Issued Driver's License or Identification Card",
  },
  { value: 'PASSPORT', label: 'Passport' },
];

const steps = [
  {
    id: 1,
    title: 'Initial Registration',
  },
  {
    id: 2,
    title: 'Remaining Registration',
  },
  {
    id: 3,
    title: 'Submitted',
  },
];
const NotaryAdditionalForm = () => {
  const [stepNumber, setStepNumber] = useState(0);
  const schema = yup
    .object({
      idDocumentNumber: yup
        .string()
        .required('Identification Document Number is Required')
        .matches(
          /^\d+$/,
          'Identification Document Number must be a numeric value'
        ),
      idDocumentExpiryDate: yup
        .date()
        .required('Identification Expiration Date is Required'),
      eoInsuranceExpiryDate: yup
        .date()
        .required('Errors & Omissions Insurance Expiration Date is Required'),
      backgroundCheckExpirationDate: yup
        .date()
        .required('Background Check Expiration Date is Required'),
      backgroundCheckCompanyName: yup
        .string()
        .required(' Background Check Company Name is Required'),
      // idDocType: yup.string().required(" Identification Document Type is Required"),
      eoInsuranceAmount: yup
        .string()
        .required('Errors & Omissions Insurance Amount is Required')
        .matches(
          /^\d+$/,
          'Errors & Omissions Insurance Amount must be a numeric value'
        ),
      eoInsuranceCompany: yup
        .string()
        .required('Errors & Omissions Insurance Company Name is Required'),
      idDocument: yup
        .mixed()
        .required('Government Issued Photo ID is Required'),
      // .test('fileFormat', 'Invalid file format', value => value && FILE_FORMATS.includes(value[0].type)),
      eoInsuranceDocument: yup
        .mixed()
        .required('Copy of E&O Policy is Required'),
      signedW9Document: yup.mixed().when('$stepNumber', {
        is: 1,
        then: yup.mixed().required('Signed W9 is Required'),
        otherwise: yup.mixed(),
      }),
      backgroundCheckDocument: yup
        .mixed()
        .required('Copy of Background Check is Required'),
      notaryStamp: yup
        .mixed()
        .required('Digital Notary Stamp Image is Required'),
    })
    .shape({
      idDocumentType: yup.object().shape({
        label: yup
          .string()
          .required('Identification Document Type is Required'),
        value: yup
          .string()
          .required('Identification Document Type is Required'),
      }),
    })
    .required()
    .nullable();

  const [checked, setChecked] = useState(false);
  const [prevUserDeails, setPrevUserDetails] = useState({});
  const [files, setFiles] = useState([]);
  const [notaryAdditionalSignup] = useNotaryAdditionalSignupMutation();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    control,
    trigger,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    context: {
      stepNumber,
    },
  });
  const handleFileChange = (event, index) => {
    const newFiles = Array.from(event.target.files);
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index] = newFiles[0];
      return updatedFiles;
    });
  };
  const handleIdDocumentChange = async e => {
    setValue('idDocument', e.target.files[0]);
    await trigger('idDocument');
  };
  const handleNotaryStampChange = async e => {
    setValue('notaryStamp', e.target.files[0]);
    await trigger('notaryStamp');
  };
  const handleeoInsuranceDocumentChange = async e => {
    setValue('eoInsuranceDocument', e.target.files[0]);
    await trigger('eoInsuranceDocument');
  };
  const handlesignedW9DocumentChange = async e => {
    setValue('signedW9Document', e.target.files[0]);
    await trigger('signedW9Document');
  };
  const handleBackgroundCheckFileChange = async e => {
    setValue('backgroundCheckDocument', e.target.files[0]);
    await trigger('backgroundCheckDocument');
  };
  const handlebondDocumentFileFileChange = async e => {
    setValue('bondDocument', e.target.files[0]);
    await trigger('bondDocument');
  };
  const handletitleProducerLicenseChange = async e => {
    setValue('titleProducerLicenseDocument', e.target.files[0]);
    await trigger('titleProducerLicenseDocument');
  };
  const navigate = useNavigate();
  const [userInfo] = useUserInfoMutation();
  const getUserDetail = async () => {
    const meUserApiRes = await userInfo();
    setPrevUserDetails(meUserApiRes?.data?.data);
  };
  useEffect(() => {
    getUserDetail();
  }, []);
  const onSubmit = async data => {
    console.log(data);
    try {
      let totalSteps = steps.length;
      const isLastStep = stepNumber === totalSteps - 1;
      if (isLastStep) {
      } else {
        setStepNumber(stepNumber + 1);
      }
      const fileUploadPromises = [];

      fileUploadPromises.push(
        fileUpload(
          data['idDocument'],
          `/IdDocumentFolder/${data['idDocument'].name}`
        )
      );
      fileUploadPromises.push(
        fileUpload(
          data['notaryStamp'],
          `/NotaryStampFolder/${data['notaryStamp'].name}`
        )
      );
      fileUploadPromises.push(
        fileUpload(
          data['eoInsuranceDocument'],
          `/eoInsuranceDocumentFolder/${data['eoInsuranceDocument'].name}`
        )
      );
      fileUploadPromises.push(
        fileUpload(
          data['signedW9Document'],
          `/signedW9DocumentFolder/${data['signedW9Document'].name}`
        )
      );
      fileUploadPromises.push(
        fileUpload(
          data['backgroundCheckDocument'],
          `/BackgroundCheckFolder/${data['backgroundCheckDocument'].name}`
        )
      );
      fileUploadPromises.push(
        fileUpload(
          data['bondDocument'],
          `/bondDocumentFolder/${data['bondDocument'].name}`
        )
      );
      fileUploadPromises.push(
        fileUpload(
          data['titleProducerLicenseDocument'],
          `/titleProducerLicenseFolder/${data['titleProducerLicenseDocument'].name}`
        )
      );
      const fileUploadResponses = await Promise.all(fileUploadPromises);

      data['idDocumentType'] = data['idDocumentType'].value;
      data['idDocument'] = fileUploadResponses[0]?.getUrl;
      data['notaryStamp'] = fileUploadResponses[1]?.getUrl;
      data['eoInsuranceDocument'] = fileUploadResponses[2]?.getUrl;
      data['signedW9Document'] = fileUploadResponses[3]?.getUrl;
      data['backgroundCheckDocument'] = fileUploadResponses[4]?.getUrl;
      data['bondDocument'] = fileUploadResponses[5]?.getUrl;
      data['titleProducerLicenseDocument'] = fileUploadResponses[6]?.getUrl;
      let payload = {
        ...prevUserDeails,
        ...prevUserDeails?.address,

        ...data,
        address: prevUserDeails?.address?.addressLine1,
        notaryCommissionNumber: prevUserDeails?.commissionNumber,
      };
      // Continue with the rest of the form submission
      const notaryAdditionalResponse = await notaryAdditionalSignup(payload);
      toast.success(notaryAdditionalResponse?.data?.data?.message);
      setStepNumber(2);
    } catch (e) {
      toast.error('Error while Creating');
      console.error(e);
    }
  };
  return (
    <div>
      <h4 style={{ textAlign: 'center', padding: '2rem' }}>
        Complete Your Notary Registration
      </h4>
      <div
        className="flex z-[5] items-center relative w-[60%] justify-center md:mx-8"
        style={{ margin: 'auto' }}
      >
        {steps.map((item, i) => (
          <div
            className="relative z-[1] items-center item flex flex-start flex-1 last:flex-none group"
            key={i}
          >
            <div
              className={`${
                stepNumber >= i
                  ? 'bg-slate-900 text-white ring-slate-900 ring-offset-2 dark:ring-offset-slate-500 dark:bg-slate-900 dark:ring-slate-900'
                  : 'bg-white ring-slate-900 ring-opacity-70  text-slate-900 dark:text-slate-300 dark:bg-slate-600 dark:ring-slate-600 text-opacity-70'
              }  transition duration-150 icon-box md:h-12 md:w-12 h-7 w-7 rounded-full flex flex-col items-center justify-center relative z-[66] ring-1 md:text-lg text-base font-medium`}
            >
              {stepNumber <= i ? (
                <span> {i + 1}</span>
              ) : (
                <span className="text-3xl">
                  <Icon icon="bx:check-double" />
                </span>
              )}
            </div>

            <div
              className={`${
                stepNumber >= i
                  ? 'bg-slate-900 dark:bg-slate-900'
                  : 'bg-[#E0EAFF] dark:bg-slate-700'
              } absolute top-1/2 h-[2px] w-full`}
            ></div>
            <div
              className={` ${
                stepNumber >= i
                  ? ' text-slate-900 dark:text-slate-300'
                  : 'text-slate-500 dark:text-slate-300 dark:text-opacity-40'
              } absolute top-full text-base md:leading-6 mt-3 transition duration-150 md:opacity-100 opacity-0 group-hover:opacity-100`}
              style={{ margin: '1rem 0rem 0rem -1rem' }}
            >
              <span className="w-max">{item.title}</span>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 "
        style={{ padding: '2rem 3rem', marginTop: '3rem' }}
      >
        {stepNumber === 0 && (
          <>
            <div className="justify-center flex">
              <Card className="w-[80%]  ">
                <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 ">
                  <Textinput
                    name="idDocumentNumber"
                    register={register}
                    label="Identification Document Number"
                    type="text"
                    placeholder=" Identification Document Number"
                    className="h-[52px]"
                    error={errors.idDocumentNumber}
                  />
                  <div>
                    <div className="h-[52px] react-select">
                      <SelectField
                        name="idDocumentType"
                        label=" Identification Document Type"
                        id="idDocumentType"
                        setValue={setValue}
                        className="react-select"
                        classNamePrefix="select"
                        register={register}
                        errors={errors}
                        control={control}
                        options={idDocType}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" for="inline-picker">
                      Government issued Photo ID
                    </label>
                    <Fileinput
                      name="idDocument"
                      register={register}
                      // value={files[0]}
                      selectedFile={getValues('idDocument')}
                      onChange={handleIdDocumentChange}
                      // onChange={event => handleFileChange(event, 0)}
                      className={`h-[52px] ${errors.idDocument && 'border-danger-500'}`}
                      error={errors.idDocument}
                    />
                  </div>
                  <div>
                    <label className="form-label" for="inline-picker">
                      Identification Expiration Date
                    </label>
                    <Controller
                      name="idDocumentExpiryDate"
                      control={control}
                      render={({ field }) => (
                        <Flatpickr
                        className={`h-[52px] form-control ${errors.idDocumentExpiryDate && 'border-danger-500'}`}
                          
                          placeholder="Select a date"
                          id="idDocumentExpiryDate"
                          options={{
                            dateFormat: 'm/d/Y',
                          }}
                          {...field}
                          style={{backgroundColor : 'transparent'}}
                        />
                      )}
                    />
                    {errors.idDocumentExpiryDate && (
                      <p className='text-danger-500 text-sm mt-[.5rem]'>
                        {errors.idDocumentExpiryDate.message}
                      </p>
                    )}
                  </div>
                  <InputGroup
                    label="Errors & Omissions Insurance Company Name"
                    id="eoInsuranceCompany"
                    name="eoInsuranceCompany"
                    type="text"
                    placeholder="Errors & Omissions Insurance Company Name"
                    register={register}
                    error={errors.eoInsuranceCompany}
                    className={` ${
                      errors.eoInsuranceCompany ? 'error' : ''
                    } h-[52px]`}
                    merged
                  />
                  <InputGroup
                    label="Errors & Omissions Insurance Amount"
                    id="eoInsuranceAmount"
                    name="eoInsuranceAmount"
                    type="text"
                    placeholder="Errors & Omissions Insurance Amount"
                    hasicon
                    register={register}
                    error={errors.eoInsuranceAmount}
                    className="h-[52px]"
                    merged
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                    }}
                  />

                  <div>
                    <label className="form-label" for="inline-picker">
                      Errors & Omissions Insurance Expiration Date
                    </label>
                    <Controller
                      name="eoInsuranceExpiryDate"
                      className="form-control  h-[52px]"
                      control={control}
                      render={({ field }) => (
                        <Flatpickr
                        className={`h-[52px] form-control ${errors.eoInsuranceExpiryDate && 'border-danger-500'}`}
                          {...field}
                        register={register}
                          placeholder="Select a date"
                          id="eoInsuranceExpiryDate"
                          options={{
                            dateFormat: 'm/d/Y',
                          }}
                          style={{backgroundColor : 'transparent'}}
                        />
                      )}
                    />
                    {errors.eoInsuranceExpiryDate && (
                      <p className='text-danger-500 text-sm mt-[.5rem]'>
                        {errors.eoInsuranceExpiryDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="form-label" htmlFor="inline-picker">
                      Copy of E&O Policy
                    </label>
                    <Fileinput
                      name="eoInsuranceDocument"
                      id="eoInsuranceDocument"
                      register={register}
                      selectedFile={getValues('eoInsuranceDocument')}
                      onChange={handleeoInsuranceDocumentChange}
                      // onChange={event => handleFileChange(event, 2)}
                      className={`h-[52px] ${errors.eoInsuranceDocument && 'border-danger-500'}`}
                      error={errors.eoInsuranceDocument}
                    />
                  </div>
                  <Textinput
                    name="backgroundCheckCompanyName"
                    id="backgroundCheckCompanyName"
                    register={register}
                    label="Background Check Company Name"
                    type="text"
                    placeholder=" Background Check Company Name"
                    className="h-[52px]"
                    error={errors.backgroundCheckCompanyName}
                  />
                  <div>
                    <label className="form-label" for="inline-picker">
                      Copy of Background Check
                    </label>
                    <Fileinput
                      name="backgroundCheckDocument"
                      selectedFile={getValues('backgroundCheckDocument')}
                      onChange={handleBackgroundCheckFileChange}
                      // onChange={event => handleFileChange(event, 4)}
                      className={`h-[52px] ${errors.backgroundCheckDocument && 'border-danger-500'}`}
                      error={errors.backgroundCheckDocument}
                    />
                  </div>
                  <div>
                    <label className="form-label" for="inline-picker">
                      Background Check Expiration Date
                    </label>
                    <Controller
                      name="backgroundCheckExpirationDate"
                      control={control}
                      render={({ field }) => (
                        <Flatpickr
                        className={`form-control h-[52px] ${errors.backgroundCheckExpirationDate && 'border-danger-500' }`}
                          {...field}
                          placeholder="Select a date"
                          id="backgroundCheckExpirationDate"
                          options={{
                            dateFormat: 'm/d/Y',
                          }}
                          style={{backgroundColor : 'transparent'}}
                        />
                      )}
                    />
                    {errors.backgroundCheckExpirationDate && (
                      <p className='text-danger-500 text-sm mt-[.5rem]'>
                        {errors.backgroundCheckExpirationDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="form-label" for="inline-picker">
                      Digital Notary Stamp Image
                    </label>
                    <Fileinput
                      name="notaryStamp"
                      selectedFile={getValues('notaryStamp')}
                      onChange={handleNotaryStampChange}
                      // onChange={event => handleFileChange(event, 1)}
                      className={`h-[52px] ${errors.notaryStamp && 'border-danger-500'}`}
                      error={errors.notaryStamp}
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-end w-[90%]">
              <Button
                text="Next"
                type="submit"
                className="btn-dark px-[3rem] py-[1rem]"
                onClick={() => {
                  if (!isValid) trigger();
                  else
                    Object.keys(errors).length && errors
                      ? setStepNumber(0)
                      : setStepNumber(1);
                  // setStepNumber(1);
                }}
              />
            </div>
          </>
        )}
        {stepNumber === 1 && (
          <>
            <div className="justify-center flex">
              <Card className="w-[80%]  ">
                <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 ">
                  <div>
                    <label className="form-label" for="inline-picker">
                      Signed W9
                    </label>
                    <Fileinput
                      name="signedW9Document"
                      id="signedW9Document"
                      register={register}
                      selectedFile={getValues('signedW9Document')}
                      onChange={handlesignedW9DocumentChange}
                      // onChange={event => handleFileChange(event, 3)}
                      className={`h-[52px] ${errors.signedW9Document && 'border-danger-500'}`}
                      error={errors.signedW9Document}
                    />
                  </div>
                  <Textinput
                    name="bondCompanyName"
                    id="bondCompanyName"
                    label="Bond Company Name"
                    type="text"
                    placeholder="Bond Company Name"
                    register={register}
                    className="h-[52px]"
                  />
                  <Textinput
                    label="Bond Number"
                    name="bondNumber"
                    id="bondNumber"
                    type="text"
                    register={register}
                    placeholder="Bond Number"
                    className="h-[52px]"
                  />
                  <InputGroup
                    label="Bond Amount"
                    id="bondAmount"
                    name="bondAmount"
                    type="text"
                    placeholder="Bond Amount"
                    hasicon
                    register={register}
                    error={errors.bondAmount}
                    className={` ${errors.bondAmount ? 'error' : ''} h-[52px]`}
                    merged
                  />
                  <div>
                    <label className="form-label" for="inline-picker">
                      Copy of Bond
                    </label>
                    <Fileinput
                      name="bondDocument"
                      id="bondDocument"
                      selectedFile={getValues('bondDocument')}
                      onChange={handlebondDocumentFileFileChange}
                      // onChange={event => handleFileChange(event, 5)}
                      className={`h-[52px] ${
                        errors.bondDocument ? 'border-danger-500' : ''
                      } `}
                    />
                  </div>
                  <div>
                    <label className="form-label" for="inline-picker">
                      Bond Expiration Date
                    </label>
                    <Controller
                      name="bondExpirationDate"
                      control={control}
                      render={({ field }) => (
                        <Flatpickr
                          className="form-control h-[52px]"
                          {...field}
                          placeholder="Select a date"
                          id="bondExpirationDate"
                          options={{
                            dateFormat: 'm/d/Y',
                          }}
                          onChange={date =>
                            setValue(
                              'bondExpirationDate',
                              date[0] ? date[0].toLocaleDateString() : ''
                            )
                          }
                          value={getValues('bondExpirationDate')}
                          style={{backgroundColor : 'transparent'}}
                        />
                      )}
                    />
                  </div>
                  <Textinput
                    name="titleProducerCompanyName"
                    id="titleProducerCompanyName"
                    label="Title Producer Company Name"
                    type="text"
                    placeholder="Title Producer Company Name"
                    register={register}
                    className="h-[52px]"
                  />
                  <Textinput
                    label="Title Producer’s License Number"
                    name="titleProducerLicenseNumber"
                    id="titleProducerLicenseNumber"
                    type="text"
                    register={register}
                    placeholder="Title Producer’s License Number"
                    className="h-[52px]"
                  />
                  <div>
                    <label className="form-label" for="inline-picker">
                      Title Producer’s License Expiration Date
                    </label>
                    <Controller
                      name="titleProducerLicenseExpirationDate"
                      control={control}
                      render={({ field }) => (
                        <Flatpickr
                          className="form-control h-[52px]"
                          {...field}
                          placeholder="Select a date"
                          id="titleProducerLicenseExpirationDate"
                          options={{
                            dateFormat: 'm/d/Y',
                          }}
                          onChange={date =>
                            setValue(
                              'titleProducerLicenseExpirationDate',
                              date[0] ? date[0].toLocaleDateString() : ''
                            )
                          }
                          value={getValues(
                            'titleProducerLicenseExpirationDate'
                          )}
                          style={{backgroundColor : 'transparent'}}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="form-label" for="inline-picker">
                      Copy of Title Producer’s License
                    </label>
                    <Fileinput
                      name="titleProducerLicenseDocument"
                      id="titleProducerLicenseDocument"
                      selectedFile={getValues('titleProducerLicenseDocument')}
                      onChange={handletitleProducerLicenseChange}
                      className="h-[52px]"
                    />
                  </div>
                  <Textarea
                    label="Additional Information:"
                    name="additionalInformation"
                    id="additionalInformation"
                    register={register}
                    error={errors.additionalInformation}
                    placeholder="Additional Information"
                    row="1"
                    className="h-[52px]"
                  />
                </div>
              </Card>
            </div>
            <div
              className="flex justify-between w-[80%]"
              style={{ margin: 'auto', marginTop: '2rem' }}
            >
              <Button
                text="Previous"
                className="btn-dark px-[3rem] py-[1rem]"
                onClick={() => setStepNumber(0)}
              />
              <Button
                text="Submit"
                className="btn-dark px-[3rem] py-[1rem]"
                type="submit"
              />
            </div>
          </>
        )}
        {stepNumber === 2 && (
          <div>
            <div className="grid grid-cols-1 gap-5">
              <h3 style={{ textAlign: 'center', padding: '2rem' }}>
                Thank You!
              </h3>
              <h5 style={{ textAlign: 'center', padding: '0.5rem' }}>
                Your registration request has been successfully submitted and is
                under review.
              </h5>
              <div style={{ textAlign: 'center' }}>
                You will receive an email when a decision is made.
              </div>
            </div>
          </div>
        )}
        <div
          className={`${
            stepNumber > 0 ? 'flex justify-between' : ' text-right'
          } mt-10`}
        >
          {stepNumber !== 0 && (
            <div className="flex justify-start ml-[9rem]"></div>
          )}
        </div>
      </form>
    </div>
  );
};

export default NotaryAdditionalForm;
