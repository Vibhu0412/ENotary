import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Textinput from '@/components/ui/Textinput';
import { useForm } from 'react-hook-form';
import Flatpickr from 'react-flatpickr';
import Fileinput from '@/components/ui/Fileinput';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { country } from '@/constant/address';
import { state } from '@/constant/address';
import { city } from '@/constant/address';
import InputGroup from '@/components/ui/InputGroup';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@/components/ui/Checkbox';
import Textarea from '@/components/ui/Textarea';
import { useDispatch } from 'react-redux';
import Card from '@/components/ui/Card';
import {
  approveUserDetails,
  getUserById,
} from '../../../services/user.services';
import SelectField from '../../../components/ui/SelectField';
import { useUserInfoMutation } from '../../../services/commonService';
import { Check, Close } from '@mui/icons-material';
import { useSigneeStatusMutation } from '../../../services/commonService';
import { fileUpload } from '../../../share/utils';
const idDocType = [
  {
    value: "State Issued Driver's License or Identification Card",
    label: "State Issued Driver's License or Identification Card",
  },
  { value: 'Passport', label: 'Passport' },
  { value: 'Other', label: 'Other' },
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
    firstName: yup.string(),
    lastName: yup.string(),
    comments: yup.string().required('Approve/Reject Note is Required'),
    //     email: yup.string().email('Invalid email').required('Email is Required'),
    //     idDocumentNumber: yup.string().required('Id Document Number is Required'),
    //     dob: yup.string().default(getDefaultDate),
    //     address: yup.string().required('Address is Required'),
    //     idDocumentTypeOther: yup.string().required('Document Type Other is Required'),
    //     zipCode: yup
    //       .string()
    //       .required('Zip is Required')
    //       .matches(/^\d+$/, 'Zip Code must be a numeric value'),
    //   })
    //   .shape({
    //     city: yup.object().shape({
    //       label: yup.string().required('City is Required'),
    //       value: yup.string().required('City is Required'),
    //     }),
    //     state: yup.object().shape({
    //       label: yup.string().required('State is Required'),
    //       value: yup.string().required('State is Required'),
    //     }),
    //     country: yup.object().shape({
    //       label: yup.string().required('Country is Required'),
    //       value: yup.string().required('Country is Required'),
    //     }),
    //     idDocumentType: yup.object().shape({
    //       label: yup.string().required('Document Type is Required'),
    //       value: yup.string().required('Document Type is Required'),
    //     }),
  })
  .nullable();

const SigneeDetails = ({ detailformsSteps, userId }) => {
  const [userInfo] = useUserInfoMutation();
  const [updateProfile] = useSigneeStatusMutation();
  const [comments, setComment] = useState('');
  const [documentStatus, setDocumentStatus] = useState({
    idDocumentStatus: 'REJECTED',
  });
  const [showComments, setShowComments] = useState({});
  const dispatch = useDispatch();
  const [picker, setPicker] = useState(new Date());
  const [datePicker, setDatePicker] = useState(new Date());
  const [selectedIdDocType, setSelectedIdDocType] = useState('');
  const [selectedIdentificationFile, setSelectedIdentificationFile] =
    useState(null);
  const [userDetails, setUserDetails] = useState([]);
  const [resubmited, setResubmited] = useState(false);

  const getUser = async () => {
    try {
      const response = await getUserById(userId);
      setUserDetails(response?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await userInfo();
      setUserDetails(response?.data?.data);
      setValue('comments', response?.data?.data?.userApprovalEvent?.comments);
    } catch (error) {
    }
  };

  useEffect(() => {
    userId ? getUser() : fetchUserData();
  }, []);

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  const {
    register,
    formState: { errors, isSubmitting,setSubmitting },
    handleSubmit,
    trigger,
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const handleIdDocTypeChange = selectedOption => {
    setSelectedIdDocType(selectedOption.value);
  };
  const handleFileChange = async e => {
    setSelectedIdentificationFile(e.target.files[0]);

    setValue('idDocument', 'sample');
    await trigger('idDocument');
  };

  const navigate = useNavigate();

  const onSubmit = async data => {
    let userType = userDetails?.userType;
    const currentURL = window.location.href;
    const pathSegments = currentURL.split('/');
    try {
      if (userId) {
        const approvalRes = await approveUserDetails(
          {
            ...documentStatus,
            id: userDetails.id,
            comments: data?.comments,
          },
          userType
        );
        if (approvalRes && !approvalRes.error) {
          toast.success(`Mail has been sent successfully`);
        }

        navigate('/admin/approval');
      } else {
        if (!selectedIdentificationFile) {
          toast.error('Signee Registration Document is required');
          return;
        }
        setResubmited(true);
        const awsFileUploadReturn = await fileUpload(
          selectedIdentificationFile,
          `/documentFolder/${selectedIdentificationFile.name}`
        );
        const payload = {
          ...userDetails,
          ...userDetails?.address,
          address: userDetails?.address?.addressLine1,
          idDocument: awsFileUploadReturn?.getUrl,
        };

        const approvalRes = await updateProfile(payload);
        if (approvalRes && !approvalRes.error) {
          toast.success(`Registration resubmission successfully`);
          setTimeout(() => {
            navigate('/signee-login');
          }, 2000);
        }
      }
    } catch (e) {
      setResubmited(false);
      toast.error(e);
      setSubmitting(false)
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-5 ${!userId ? 'p-[4rem]' : ''}`}
    >
      <>
        <Card
          title={
            detailformsSteps == 3
              ? userId
                ? 'User Approval'
                : 'Resubmit Registration'
              : detailformsSteps == 1
              ? 'Personal Details'
              : 'Documents'
          }
          className="shadow-xl bg-white w-[100%]"
          title2={!userId ? 'Rejected' : ''}
        >
          {(detailformsSteps == 1 || detailformsSteps == 3) && (
            <>
              <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 ">
                <InputGroup
                  id="firstName"
                  name="firstName"
                  label="First name"
                  type="text"
                  placeholder="First name"
                  readonly
                  register={register}
                  error={errors?.firstName}
                  className="h-[52px]"
                  value={userDetails?.firstName}
                  merged
                />{' '}
                <InputGroup
                  id="lastName"
                  name="lastName"
                  label="Last name"
                  type="text"
                  placeholder="Last name"
                  register={register}
                  error={errors?.lastName}
                  readonly
                  className="h-[52px]"
                  value={userDetails?.lastName}
                  merged
                />{' '}
                <InputGroup
                  label="Email Address"
                  name="email"
                  id="email"
                  // defaultValue={users[0].email}
                  type="email"
                  register={register}
                  error={errors?.email}
                  placeholder="Email Address"
                  className="h-[52px]"
                  merged
                  readonly
                  value={userDetails?.email}
                />
                <div>
                  <label className="form-label" for="inline-picker">
                    Date of Birth
                  </label>
                  <Flatpickr
                    name="dob"
                    id="dob"
                    className="form-control bg-white h-[52px]"
                    register={register}
                    value={userDetails?.dob}
                    error={errors?.dob}
                    // readonly
                    options={{
                      maxDate: eighteenYearsAgo,
                      dateFormat: 'm/d/Y', // Set the date format as "mm/dd/yyyy"
                      defaultDate: getDefaultDate(),
                    }}
                    onChange={date => {
                      setValue('dob', getDefaultDate(new Date(date)));
                    }}
                  />
                </div>
                <InputGroup
                  label="Phone Number"
                  name="phoneNumber"
                  prepend="+1"
                  placeholder="Phone Number"
                  value={userDetails?.phoneNumber}
                  id="phoneNumber"
                  register={register}
                  error={errors?.phonenumber}
                  options={{ phone: true, phoneRegionCode: 'US' }}
                  isMask
                  readonly
                  className="h-[52px]"
                />
                <Textarea
                  label="Address"
                  name="address"
                  id="pn4"
                  error={errors?.address}
                  value={userDetails?.address?.addressLine1}
                  register={register}
                  placeholder="Address"
                  readonly
                  row="1"
                  className="h-[52px]"
                />
                <div className=" grid grid-cols-2 gap-5">
                  <div>
                    <InputGroup
                      id="country"
                      name="country"
                      label="Country"
                      type="text"
                      placeholder="Country"
                      register={register}
                      error={errors?.country}
                      readonly
                      className="h-[52px]"
                      value={userDetails?.address?.country}
                      merged
                    />
                  </div>
                  <div>
                    <InputGroup
                      id="state"
                      name="state"
                      label="state"
                      type="text"
                      placeholder="State"
                      register={register}
                      error={errors?.state}
                      readonly
                      className="h-[52px]"
                      value={userDetails?.address?.state}
                      merged
                    />
                  </div>
                </div>
                <div className=" grid grid-cols-2 gap-5">
                  <div>
                    <InputGroup
                      id="city"
                      name="city"
                      label="city"
                      type="text"
                      placeholder="City"
                      register={register}
                      error={errors?.city}
                      readonly
                      className="h-[52px]"
                      value={userDetails?.address?.city}
                      merged
                    />
                  </div>
                  <Textinput
                    name="zipCode"
                    register={register}
                    label="Zip Code"
                    type="text"
                    value={userDetails?.address?.zipCode}
                    placeholder="Zip Code"
                    className="h-[52px]"
                    readonly
                    error={errors?.zipCode}
                  />
                </div>
              </div>
              {detailformsSteps == 1 && (
                <div className="flex justify-center mt-[1.5rem]">
                  <Button text="Save" className="btn-slate px-[3rem]" />
                </div>
              )}
            </>
          )}
          {(detailformsSteps == 2 || detailformsSteps == 3) && (
            <>
              <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 my-[1rem]">
                <div>
                  <InputGroup
                    id="idDocumentType"
                    name="idDocumentType"
                    label="Identification Document Type"
                    type="text"
                    placeholder="idDocumentType"
                    register={register}
                    error={errors?.idDocumentType}
                    readonly
                    className="h-[52px]"
                    value={userDetails?.idDocumentType}
                    merged
                  />
                </div>
                <Textinput
                  name="idDocumentNumber"
                  value={userDetails?.idDocumentNumber}
                  register={register}
                  label="Identification Document Number"
                  type="text"
                  placeholder=" Identification Document Number"
                  className="h-[52px]"
                  readonly
                  error={errors?.idDocumentNumber}
                />
                <InputGroup
                  id="idDocumentTypeOther"
                  name="idDocumentTypeOther"
                  value={userDetails?.idDocumentTypeOther}
                  label="Identification Document Type(other)"
                  type="text"
                  placeholder="Identification Document Type"
                  register={register}
                  readonly
                  error={errors?.idDocumentTypeOther}
                  className="h-[52px]"
                  merged
                />

                {userId ? (
                  <div className="flex gap-[1rem] items-end">
                    <div className="w-[45%]">
                      <label className="form-label mb-[1.8rem]">
                        Copy of Identification Document
                      </label>
                      <a
                        href={userDetails?.idDocument}
                        target="_blank"
                        className="underline text-slate-500 font-semibold h-[52px]"
                      >
                        <p
                          className="form-label text-base "
                          for="inline-picker"
                        >
                          View File
                        </p>
                      </a>
                    </div>

                    <div className="w-[30%]">
                      <label className="form-label" for="inline-picker">
                        Valid Till Date
                      </label>
                      <Flatpickr
                        className="form-control h-[52px]"
                        value={datePicker || userDetails?.idDocumentExpiryDate}
                        onChange={date => setDatePicker(date)}
                        register={register}
                        readonly
                        id="default-picker"
                        options={{
                          dateFormat: 'm/d/Y', // Set the date format as "mm/dd/yyyy"
                        }}
                      />
                    </div>
                    <Button
                      icon="heroicons-outline:check"
                      className={
                        documentStatus?.idDocumentStatus === 'APPROVED'
                          ? 'btn-success w-[10%]'
                          : 'btn-outline-success w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          idDocumentStatus: 'APPROVED',
                        })
                      }
                    />
                    <Button
                      icon="heroicons-outline:x"
                      className={
                        documentStatus?.idDocumentStatus === 'REJECTED'
                          ? 'btn-danger w-[10%]'
                          : 'btn-outline-danger w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          idDocumentStatus: 'REJECTED',
                        })
                      }
                    />
                  </div>
                ) : (
                  <div>
                    {' '}
                    <label className="form-label" for="inline-picker">
                      Signee Registration Document{' '}
                    </label>{' '}
                    <div
                      className={`flex gap-[1rem] items-start ${
                        userDetails?.status === 'REJECTED'
                          ? 'text-danger-500'
                          : 'text-success-500'
                      }`}
                    >
                      <Fileinput
                        name="idDocument"
                        id="idDocument"
                        selectedFile={selectedIdentificationFile}
                        error={errors.idDocument}
                        onChange={handleFileChange}
                        className="h-[52px] w-[80%]"
                      />
                      {userDetails?.status === 'REJECTED' ? (
                        <Close />
                      ) : (
                        <Check />
                      )}
                      <a
                        href={userDetails?.idDocument}
                        target="_blank"
                        className="underline text-danger-500 font-semibold h-[52px]"
                      >
                        <p
                          className=" text-base text-danger-500"
                          for="inline-picker"
                        >
                          View File
                        </p>
                      </a>
                    </div>
                  </div>
                )}
              </div>
              {detailformsSteps == 2 && (
                <div className="flex justify-center mt-[1.5rem]">
                  <Button text="Save" className="btn-slate px-[3rem]" />
                </div>
              )}
            </>
          )}
          {detailformsSteps == 3 && (
            <>
              <Textarea
                label="Approve/Reject Note"
                name="comments"
                id="comments"
                register={register}
                placeholder="Approve/Reject Note"
                error={errors.comments}
                row="1"
                className="h-[52px] "
                onChange={e => {
                  setValue('comments', e.target.value);
                }}
                // onChange={e => {
                //   setComment(e.target.value);
                // }}
                readonly={!userId}
              />
              <div className="flex justify-center mt-[1.5rem]">
                <Button
                  disabled={resubmited}
                  text={userId ? 'Submit' : 'Resubmit'}
                  type="submit"
                  // onClick={() => onSubmit('')}
                  className="btn-slate px-[3rem]"
                  isLoading={isSubmitting}
                />
              </div>
            </>
          )}
        </Card>
      </>
    </form>
  );
};

export default SigneeDetails;
