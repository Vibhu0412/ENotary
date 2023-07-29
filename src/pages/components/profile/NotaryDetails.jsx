import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputGroup from '@/components/ui/InputGroup';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { useNavigate } from 'react-router-dom';
import Textinput from '@/components/ui/Textinput';
import Checkbox from '@/components/ui/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import Textarea from '@/components/ui/Textarea';
import Card from '../../../components/ui/Card';
import { getUserById } from '../../../services/user.services';
import { approveUserDetails } from '../../../services/user.services';
import { useUserInfoMutation } from '../../../services/commonService';
import Fileinput from '../../../components/ui/Fileinput';
import { fileUpload } from '../../../share/utils';
import { Check, Close } from '@mui/icons-material';
import { useNotaryAdditionalSignupMutation } from '../../../services/notaryService';

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

const schema = yup
  .object({
    firstName: yup.string(),
    lastName: yup.string(),
    comments:yup.string().required('Approve/Reject Note is Required')
  })
  .nullable();

const NotaryDetails = ({ detailformsSteps, userId }) => {
  const navigate = useNavigate();
  const [getProfile] = useUserInfoMutation();
  const [updateProfile] = useNotaryAdditionalSignupMutation();
  const [comment, setComment] = useState('');
  const [documentStatus, setDocumentStatus] = useState({
    id: '',
    idDocumentStatus: 'REJECTED',
    notaryCommissionDocumentStatus: 'REJECTED',
    eoInsuranceDocumentStatus: 'REJECTED',
    backgroundCheckDocumentStatus: 'REJECTED',
    bondDocumentStatus: 'REJECTED',
    titleProducerLicenseDocumentStatus: 'REJECTED',
    notaryStampStatus: 'REJECTED',
    signedW9DocumentStatus: 'REJECTED',
  });

  const [picker, setPicker] = useState(new Date());
  const [datePicker, setDatePicker] = useState(new Date());
  const [userDetails, setUserDetails] = useState([]);
  const [resubmited, setResubmited] = useState(false);
  const [selectedOrganizationregiFile, setSelectedOrganizationregiFile] =
    useState(null);
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  const getUser = async () => {
    try {
      const response = await getUserById(userId);
      setUserDetails(response?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error.message);
    }
  };
  const getUserDetails = async () => {
    try {
      const response = await getProfile();
      setUserDetails(response?.data?.data);
      setValue('comments', response?.data?.data?.userApprovalEvent?.comments);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error.message);
    }
  };
  useEffect(() => {
    setPicker(eighteenYearsAgo);
    userId ? getUser() : getUserDetails();
  }, []);

  const {
    register,
    formState: { errors ,isSubmitting,setSubmitting},
    handleSubmit,
    control,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const handleIdDocumentChange = async e => {
    setValue('idDocument', e.target.files[0]);
    await trigger('idDocument');
  };
  const handlenotaryCommissionDocumentChange = async e => {
    setValue('notaryCommissionDocument', e.target.files[0]);
    await trigger('notaryCommissionDocument');
  };
  const handleeoInsuranceDocumentChange = async e => {
    setValue('eoInsuranceDocument', e.target.files[0]);
    await trigger('eoInsuranceDocument');
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
  const handleNotaryStampChange = async e => {
    setValue('notaryStamp', e.target.files[0]);
    await trigger('notaryStamp');
  };
  const handlesignedW9DocumentChange = async e => {
    setValue('signedW9Document', e.target.files[0]);
    await trigger('signedW9Document');
  };
  const onSubmit = async data => {
    let userType = userDetails?.userType;
    const currentURL = window.location.href;
    const pathSegments = currentURL.split('/');
    try {
      if (userId) {
        const approvalRes = await approveUserDetails(
          { ...documentStatus, id: userDetails.id ,comments: data?.comments,},
          userType
        );
        if (approvalRes && !approvalRes.error) {
          toast.success(`Mail has been sent successfully`);
        }
        navigate('/admin/approval');
      } else {
        // Check for errors in all documents before proceeding with file upload
        const errors = [];

        if (!data?.idDocument && userDetails?.idDocumentStatus === 'REJECTED') {
          errors.push({
            documentType: 'Government issued Photo ID',
            field: 'idDocument',
          });
        }

        if (
          !data?.notaryCommissionDocument &&
          userDetails?.notaryCommissionDocumentStatus === 'REJECTED'
        ) {
          errors.push({
            documentType: 'Copy of Notary Commission',
            field: 'notaryCommissionDocument',
          });
        }

        if (
          !data?.eoInsuranceDocument &&
          userDetails?.eoInsuranceDocumentStatus === 'REJECTED'
        ) {
          errors.push({
            documentType: 'Copy of E&O Policy',
            field: 'eoInsuranceDocument',
          });
        }

        if (
          !data?.backgroundCheckDocument &&
          userDetails?.backgroundCheckDocumentStatus === 'REJECTED'
        ) {
          errors.push({
            documentType: 'Copy of Background Check',
            field: 'backgroundCheckDocument',
          });
        }

        if (
          !data?.bondDocument &&
          userDetails?.bondDocumentStatus === 'REJECTED'
        ) {
          errors.push({ documentType: 'Copy of Bond', field: 'bondDocument' });
        }

        if (
          !data?.titleProducerLicenseDocument &&
          userDetails?.titleProducerLicenseDocumentStatus === 'REJECTED'
        ) {
          errors.push({
            documentType: "Copy of Title Producer's License",
            field: 'titleProducerLicenseDocument',
          });
        }

        if (
          !data?.notaryStamp &&
          userDetails?.notaryStampStatus === 'REJECTED'
        ) {
          errors.push({
            documentType: 'Digital Notary Stamp Image',
            field: 'notaryStamp',
          });
        }

        if (
          !data?.signedW9Document &&
          userDetails?.signedW9DocumentStatus === 'REJECTED'
        ) {
          errors.push({ documentType: 'Signed W9', field: 'signedW9Document' });
        }
        if (errors.length > 0) {
          errors.forEach(({ documentType }) =>
            toast.error(`${documentType} is required`)
          );
          return;
        }

        let fileUploadPromises = [];
        if (data?.idDocument) {
          fileUploadPromises.push(
            fileUpload(
              data.idDocument,
              `/documentFolder/${data.idDocument.name}`
            )
          );
        }

        if (data?.notaryCommissionDocument) {
          fileUploadPromises.push(
            fileUpload(
              data.notaryCommissionDocument,
              `/documentFolder/${data.notaryCommissionDocument.name}`
            )
          );
        }

        if (data?.eoInsuranceDocument) {
          fileUploadPromises.push(
            fileUpload(
              data.eoInsuranceDocument,
              `/documentFolder/${data.eoInsuranceDocument.name}`
            )
          );
        }

        if (data?.backgroundCheckDocument) {
          fileUploadPromises.push(
            fileUpload(
              data.backgroundCheckDocument,
              `/documentFolder/${data.backgroundCheckDocument.name}`
            )
          );
        }

        if (data?.bondDocument) {
          fileUploadPromises.push(
            fileUpload(
              data.bondDocument,
              `/documentFolder/${data.bondDocument.name}`
            )
          );
        }

        if (data?.titleProducerLicenseDocument) {
          fileUploadPromises.push(
            fileUpload(
              data.titleProducerLicenseDocument,
              `/documentFolder/${data.titleProducerLicenseDocument.name}`
            )
          );
        }

        if (data?.notaryStamp) {
          fileUploadPromises.push(
            fileUpload(
              data.notaryStamp,
              `/documentFolder/${data.notaryStamp.name}`
            )
          );
        }

        if (data?.signedW9Document) {
          fileUploadPromises.push(
            fileUpload(
              data.signedW9Document,
              `/documentFolder/${data.signedW9Document.name}`
            )
          );
        }

        // Perform file uploads in parallel and wait for all to complete
        const [
          IdDocumentChange,
          NotaryCommisionChange,
          eoInsuranceChange,
          backgroundCheckChange,
          bondDocumentCheckChange,
          titleProducerLicenseChange,
          notaryStampChange,
          signedW9DocumentChange,
        ] = await Promise.all(fileUploadPromises);
        setResubmited(true);

        const approvalRes = await updateProfile({
          ...userDetails,
          ...userDetails?.address,
          address: userDetails?.address?.addressLine1,
          notaryCommissionNumber: userDetails?.commissionNumber,
          idDocument: IdDocumentChange?.getUrl ?? userDetails?.idDocument,
          notaryCommissionDocument:
            NotaryCommisionChange?.getUrl ??
            userDetails?.notaryCommissionDocument,
          eoInsuranceDocument:
            eoInsuranceChange?.getUrl ?? userDetails?.eoInsuranceDocument,
          backgroundCheckDocument:
            backgroundCheckChange?.getUrl ??
            userDetails?.backgroundCheckDocument,
          bondDocument:
            bondDocumentCheckChange?.getUrl ?? userDetails?.bondDocument,
          titleProducerLicenseDocument:
            titleProducerLicenseChange?.getUrl ??
            userDetails?.titleProducerLicenseDocument,
          notaryStamp: notaryStampChange?.getUrl ?? userDetails?.notaryStamp,
          signedW9Document:
            signedW9DocumentChange?.getUrl ?? userDetails?.signedW9Document,
        });
        if (approvalRes && !approvalRes.error) {
          toast.success(`Registration resubmission successfully`);
          setTimeout(() => {
            navigate('/notary-login');
          }, 2000);
        }
      }
    } catch (e) {
      setResubmited(false);
      toast.error(e);
      setSubmitting(false)
    }
  };

  useEffect(() => {
    setPicker(eighteenYearsAgo);
  }, []);
  return (
    <form onSubmit={handleSubmit(onSubmit)}        
    className={`space-y-5 ${!userId ? 'p-[4rem]' : ''}`} >
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
      >
        {(detailformsSteps == 1 || detailformsSteps == 3) && (
          <>
            <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
              <Textinput
                name="firstName"
                register={register}
                label="First name"
                type="text"
                placeholder=" Enter your First name"
                className="h-[52px]"
                readonly
                value={userDetails?.firstName}
                error={errors?.firstName}
              />
              <Textinput
                name="lname"
                label="Last name"
                type="text"
                placeholder=" Enter your Last name"
                readonly
                register={register}
                error={errors?.lastName}
                className="h-[52px]"
                value={userDetails?.lastName}
              />
              <Textinput
                label="E-mail Address"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                readonly
                placeholder="E-mail Address"
                className="h-[52px]"
                value={userDetails?.email}
              />

              <div>
                <label className="form-label" for="inline-picker">
                  Date of Birth
                </label>
                <Flatpickr
                  className="form-control  h-[52px]"
                  value={picker || userDetails?.dob}
                  options={{
                    maxDate: eighteenYearsAgo,
                    dateFormat: 'm/d/Y', // Set the date format as "mm/dd/yyyy"
                  }}
                  onChange={date => setPicker(date)}
                  readOnly
                  id="default-picker"
                />
              </div>
              <InputGroup
                label="Phone Number"
                name="phonenumber"
                prepend="+1"
                placeholder="Phone Number"
                id="phoneNumber"
                readonly
                register={register}
                error={errors.phonenumber}
                options={{ phone: true, phoneRegionCode: 'USA' }}
                isMask
                className="h-[52px]"
                value={userDetails?.phoneNumber}
              />
              <Textarea
                label="Address"
                name="address"
                id="pn4"
                error={errors.address}
                register={register}
                placeholder="Address"
                row="1"
                readonly
                className="h-[52px]"
                value={userDetails?.address?.addressLine1}
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
            <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6 my-[1rem]">
              <Textinput
                name="IdDocnumber"
                register={register}
                label="Identification Document Number"
                type="text"
                readonly
                placeholder=" Identification Document Number"
                className="h-[52px]"
                error={errors.IdDocnumber}
                value={userDetails?.idDocumentNumber}
              />
              <div>
                <div className="h-[52px] react-select">
                  <InputGroup
                    id="idDocumentType"
                    name="idDocumentType"
                    label="Id Document Type"
                    type="text"
                    placeholder="Id Document Type"
                    register={register}
                    error={errors?.idDocumentType}
                    readonly
                    className="h-[52px]"
                    value={userDetails?.idDocumentType}
                    merged
                  />
                </div>
              </div>
              {userId ? (
                <>
                  <div className="flex gap-[1rem] items-end">
                    <div className="w-[45%]">
                      <label className="form-label mb-[1.8rem]">
                        Government issued Photo ID
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
                    <div>
                      <label className="form-label" for="inline-picker">
                        Valid Till Date
                      </label>
                      <Flatpickr
                        className="form-control  h-[52px]"
                        value={picker}
                        readOnly
                        onChange={date => setPicker(date)}
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
                </>
              ) : (
                <div>
                  <label className="form-label" for="inline-picker">
                    Government issued Photo ID
                  </label>
                  <div
                    className={`flex gap-[1rem] items-start ${
                      userDetails?.idDocumentStatus === 'REJECTED'
                        ? 'text-danger-500'
                        : 'text-success-500'
                    }`}
                  >
                    <Fileinput
                      name="idDocument"
                      id="idDocument"
                      selectedFile={getValues('idDocument')}
                      error={errors.idDocument}
                      onChange={handleIdDocumentChange}
                      className="h-[52px] w-[80%]"
                    />
                    {userDetails?.idDocumentStatus === 'REJECTED' ? (
                      <Close />
                    ) : (
                      <Check />
                    )}
                    <a
                      href={userDetails?.idDocument}
                      target="_blank"
                      className={`underline ${
                        userDetails?.idDocumentStatus === 'REJECTED'
                          ? 'text-danger-500'
                          : 'text-success-500'
                      } font-semibold h-[52px]`}
                    >
                      <p
                        className={`text-base ${
                          userDetails?.idDocumentStatus === 'REJECTED'
                            ? 'text-danger-500'
                            : 'text-success-500'
                        }`}
                        for="inline-picker"
                      >
                        View File
                      </p>
                    </a>
                  </div>
                </div>
              )}
              <Textinput
                label="State Of Notary Commission"
                name="notarycommision"
                type="text"
                register={register}
                readonly
                error={errors?.stateOfNotaryCommission}
                value={userDetails?.stateOfNotaryCommission}
                placeholder="State Of Notary Commission"
                className="h-[52px]"
              />
              <Textinput
                label="Notary Commission Number"
                name="notaryCommissionNumber"
                type="text"
                register={register}
                readonly
                error={errors.notaryCommissionNumber}
                value={userDetails?.commissionNumber}
                placeholder="Notary Commission Number"
                className="h-[52px]"
              />
              {userId ? (
                <>
                  <div className="flex gap-[1rem] items-end">
                    <div className="w-[45%]">
                      <label className="form-label mb-[1.8rem]">
                        Copy of Notary Commission
                      </label>
                      <a
                        href={userDetails?.notaryCommissionDocument}
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
                        className="form-control  h-[52px]"
                        value={
                          datePicker || userDetails?.notaryCommissionExpiryDate
                        }
                        onChange={date => setDatePicker(date)}
                        readOnly
                        id="default-picker"
                        options={{
                          dateFormat: 'm/d/Y', // Set the date format as "mm/dd/yyyy"
                        }}
                      />
                    </div>
                    <Button
                      icon="heroicons-outline:check"
                      className={
                        documentStatus?.notaryCommissionDocumentStatus ===
                        'APPROVED'
                          ? 'btn-success w-[10%]'
                          : 'btn-outline-success w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          notaryCommissionDocumentStatus: 'APPROVED',
                        })
                      }
                    />
                    <Button
                      icon="heroicons-outline:x"
                      className={
                        documentStatus?.notaryCommissionDocumentStatus ===
                        'REJECTED'
                          ? 'btn-danger w-[10%]'
                          : 'btn-outline-danger w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          notaryCommissionDocumentStatus: 'REJECTED',
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="form-label" for="inline-picker">
                    Copy of Notary Commission
                  </label>
                  <div
                    className={`flex gap-[1rem] items-start ${
                      userDetails?.notaryCommissionDocumentStatus === 'REJECTED'
                        ? 'text-danger-500'
                        : 'text-success-500'
                    }`}
                  >
                    <Fileinput
                      name="notaryCommissionDocument"
                      id="notaryCommissionDocument"
                      selectedFile={getValues('notaryCommissionDocument')}
                      error={errors.notaryCommissionDocument}
                      onChange={handlenotaryCommissionDocumentChange}
                      className="h-[52px] w-[80%]"
                    />
                    {userDetails?.notaryCommissionDocumentStatus ===
                    'REJECTED' ? (
                      <Close />
                    ) : (
                      <Check />
                    )}
                    <a
                      href={userDetails?.notaryCommissionDocument}
                      target="_blank"
                      className={`underline ${
                        userDetails?.notaryCommissionDocumentStatus ===
                        'REJECTED'
                          ? 'text-danger-500'
                          : 'text-success-500'
                      } font-semibold h-[52px]`}
                    >
                      <p
                        className={` text-base ${
                          userDetails?.notaryCommissionDocumentStatus ===
                          'REJECTED'
                            ? 'text-danger-500'
                            : 'text-success-500'
                        }`}
                        for="inline-picker"
                      >
                        View File
                      </p>
                    </a>
                  </div>
                </div>
              )}
              <InputGroup
                label="Errors & Omissions Insurance Company Name"
                id="InsCompany"
                name="InsCompany"
                type="text"
                value={userDetails?.eoInsuranceCompany}
                readonly
                placeholder="Errors & Omissions Insurance Company Name"
                register={register}
                error={errors.eoInsuranceCompany}
                className={` ${errors.InsCompany ? 'error' : ''} h-[52px]`}
                merged
              />
              <InputGroup
                label="Errors & Omissions Insurance Amount"
                id="InsuranceAmount"
                name="InsuranceAmount"
                type="text"
                placeholder="Errors & Omissions Insurance Amount"
                hasicon
                readonly
                value={userDetails?.eoInsuranceAmount}
                register={register}
                error={errors.eoInsuranceAmount}
                className={` ${errors.InsuranceAmount ? 'error' : ''} h-[52px]`}
                merged
              />
              {userId ? (
                <>
                  <div className="flex gap-[1rem] items-end">
                    <div className="w-[45%]">
                      <label className="form-label mb-[1.8rem]">
                        Copy of E&O Policy
                      </label>
                      <a
                        href={userDetails?.eoInsuranceDocument}
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

                    <div>
                      <label className="form-label" for="inline-picker">
                        Valid Till Date
                      </label>
                      <Flatpickr
                        className="form-control  h-[52px]"
                        value={datePicker || userDetails?.eoInsuranceExpiryDate}
                        readOnly
                        onChange={date => setDatePicker(date)}
                        id="default-picker"
                        options={{
                          dateFormat: 'm/d/Y', // Set the date format as "mm/dd/yyyy"
                        }}
                      />
                    </div>

                    <Button
                      icon="heroicons-outline:check"
                      className={
                        documentStatus?.eoInsuranceDocumentStatus === 'APPROVED'
                          ? 'btn-success w-[10%]'
                          : 'btn-outline-success w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          eoInsuranceDocumentStatus: 'APPROVED',
                        })
                      }
                    />
                    <Button
                      icon="heroicons-outline:x"
                      className={
                        documentStatus?.eoInsuranceDocumentStatus === 'REJECTED'
                          ? 'btn-danger w-[10%]'
                          : 'btn-outline-danger w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          eoInsuranceDocumentStatus: 'REJECTED',
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="form-label" for="inline-picker">
                    Copy of E&O Policy
                  </label>
                  <div
                    className={`flex gap-[1rem] items-start ${
                      userDetails?.eoInsuranceDocumentStatus === 'REJECTED'
                        ? 'text-danger-500'
                        : 'text-success-500'
                    }`}
                  >
                    <Fileinput
                      name="eoInsuranceDocument"
                      id="eoInsuranceDocument"
                      selectedFile={getValues('eoInsuranceDocument')}
                      error={errors.eoInsuranceDocument}
                      onChange={handleeoInsuranceDocumentChange}
                      className="h-[52px] w-[80%]"
                    />
                    {userDetails?.eoInsuranceDocumentStatus === 'REJECTED' ? (
                      <Close />
                    ) : (
                      <Check />
                    )}
                    <a
                      href={userDetails?.eoInsuranceDocument}
                      target="_blank"
                      className={`underline ${
                        userDetails?.eoInsuranceDocumentStatus === 'REJECTED'
                          ? 'text-danger-500'
                          : 'text-success-500'
                      } font-semibold h-[52px]`}
                    >
                      <p
                        className={` text-base ${
                          userDetails?.eoInsuranceDocumentStatus === 'REJECTED'
                            ? 'text-danger-500'
                            : 'text-success-500'
                        }`}
                        for="inline-picker"
                      >
                        View File
                      </p>
                    </a>
                  </div>
                </div>
              )}
              <Textinput
                name="bgcompnm"
                register={register}
                label="Background Check Company Name"
                type="text"
                readonly
                placeholder=" Background Check Company Name"
                className="h-[52px]"
                error={errors.backgroundCheckCompanyName}
                value={userDetails?.backgroundCheckCompanyName}
              />
              {userId ? (
                <>
                  <div className="flex gap-[1rem] items-end">
                    <div className="w-[45%]">
                      <label className="form-label mb-[1.8rem]">
                        Copy of Background Check
                      </label>
                      <a
                        href={userDetails?.backgroundCheckDocument}
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
                    <div>
                      <label className="form-label" for="inline-picker">
                        Valid Till Date
                      </label>
                      <Flatpickr
                        className="form-control  h-[52px]"
                        value={
                          datePicker ||
                          userDetails?.backgroundCheckExpirationDate
                        }
                        readOnly
                        onChange={date => setDatePicker(date)}
                        id="default-picker"
                        options={{
                          dateFormat: 'm/d/Y', // Set the date format as "mm/dd/yyyy"
                        }}
                      />
                    </div>
                    <Button
                      icon="heroicons-outline:check"
                      className={
                        documentStatus?.backgroundCheckDocumentStatus ===
                        'APPROVED'
                          ? 'btn-success w-[10%]'
                          : 'btn-outline-success w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          backgroundCheckDocumentStatus: 'APPROVED',
                        })
                      }
                    />
                    <Button
                      icon="heroicons-outline:x"
                      className={
                        documentStatus?.backgroundCheckDocumentStatus ===
                        'REJECTED'
                          ? 'btn-danger w-[10%]'
                          : 'btn-outline-danger w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          backgroundCheckDocumentStatus: 'REJECTED',
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="form-label" for="inline-picker">
                    Copy of Background Check
                  </label>
                  <div
                    className={`flex gap-[1rem] items-start ${
                      userDetails?.backgroundCheckDocumentStatus === 'REJECTED'
                        ? 'text-danger-500'
                        : 'text-success-500'
                    }`}
                  >
                    <Fileinput
                      name="backgroundCheckDocument"
                      id="backgroundCheckDocument"
                      selectedFile={getValues('backgroundCheckDocument')}
                      error={errors.backgroundCheckDocument}
                      onChange={handleBackgroundCheckFileChange}
                      className="h-[52px] w-[80%]"
                    />
                    {userDetails?.backgroundCheckDocumentStatus ===
                    'REJECTED' ? (
                      <Close />
                    ) : (
                      <Check />
                    )}
                    <a
                      href={userDetails?.backgroundCheckDocument}
                      target="_blank"
                      className={`underline  ${
                        userDetails?.backgroundCheckDocumentStatus ===
                        'REJECTED'
                          ? 'text-danger-500'
                          : 'text-success-500'
                      } font-semibold h-[52px]`}
                    >
                      <p
                        className={` text-base ${
                          userDetails?.backgroundCheckDocumentStatus ===
                          'REJECTED'
                            ? 'text-danger-500'
                            : 'text-success-500'
                        }`}
                        for="inline-picker"
                      >
                        View File
                      </p>
                    </a>
                  </div>
                </div>
              )}
              <Textinput
                name="Bondcompanynm"
                label="Bond Company Name"
                type="text"
                placeholder="Bond Company Name"
                register={register}
                error={errors.bondCompanyName}
                className="h-[52px]"
                readonly
                value={userDetails?.bondCompanyName}
              />
              <Textinput
                label="Bond Number"
                name="boundnum"
                type="text"
                register={register}
                error={errors.bondNumber}
                readonly
                placeholder="Bond Number"
                className="h-[52px]"
                value={userDetails?.bondNumber}
              />
              <InputGroup
                label="Bond Amount"
                id="bondamount"
                name="bondamount"
                type="text"
                placeholder="Bond Amount"
                readonly
                hasicon
                register={register}
                error={errors.bondAmount}
                className={` ${errors.bondamount ? 'error' : ''} h-[52px]`}
                merged
                value={userDetails?.bondAmount}
              />

              {userId ? (
                <>
                  <div className="flex gap-[1rem] items-end">
                    <div className="w-[45%]">
                      <label className="form-label mb-[1.8rem]">
                        Copy of Bond
                      </label>
                      <a
                        href={userDetails?.bondDocument}
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
                    <div>
                      <label className="form-label" for="inline-picker">
                        Valid Till Date
                      </label>
                      <Flatpickr
                        className="form-control  h-[52px]"
                        value={datePicker || userDetails?.bondExpirationDate}
                        onChange={date => setDatePicker(date)}
                        readOnly
                        id="default-picker"
                        options={{
                          dateFormat: 'm/d/Y', // Set the date format as "mm/dd/yyyy"
                        }}
                      />
                    </div>
                    <Button
                      icon="heroicons-outline:check"
                      className={
                        documentStatus?.bondDocumentStatus === 'APPROVED'
                          ? 'btn-success w-[10%]'
                          : 'btn-outline-success w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          bondDocumentStatus: 'APPROVED',
                        })
                      }
                    />
                    <Button
                      icon="heroicons-outline:x"
                      className={
                        documentStatus?.bondDocumentStatus === 'REJECTED'
                          ? 'btn-danger w-[10%]'
                          : 'btn-outline-danger w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          bondDocumentStatus: 'REJECTED',
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="form-label" for="inline-picker">
                    Copy of Bond{' '}
                  </label>
                  <div
                    className={`flex gap-[1rem] items-start ${
                      userDetails?.bondDocumentStatus === 'REJECTED'
                        ? 'text-danger-500'
                        : 'text-success-500'
                    }`}
                  >
                    <Fileinput
                      name="bondDocument"
                      id="bondDocument"
                      selectedFile={getValues('bondDocument')}
                      error={errors.bondDocument}
                      onChange={handlebondDocumentFileFileChange}
                      className="h-[52px] w-[80%]"
                    />
                    {userDetails?.bondDocumentStatus === 'REJECTED' ? (
                      <Close />
                    ) : (
                      <Check />
                    )}
                    <a
                      href={userDetails?.bondDocument}
                      target="_blank"
                      className={`underline ${
                        userDetails?.bondDocumentStatus === 'REJECTED'
                          ? 'text-danger-500'
                          : 'text-success-500'
                      } font-semibold h-[52px]`}
                    >
                      <p
                        className={` text-base ${
                          userDetails?.bondDocumentStatus === 'REJECTED'
                            ? 'text-danger-500'
                            : 'text-success-500'
                        }`}
                        for="inline-picker"
                      >
                        View File
                      </p>
                    </a>
                  </div>
                </div>
              )}
              <Textinput
                name="TitleProducerCompanyName"
                label="Title Producer Company Name"
                type="text"
                placeholder="Title Producer Company Name"
                register={register}
                error={errors.titleProducerCompanyName}
                className="h-[52px]"
                readonly
                value={userDetails?.titleProducerCompanyName}
              />
              <Textinput
                label="Title Producer’s License Number"
                name="TitleProducerLicenseNumber"
                type="text"
                readonly
                register={register}
                error={errors.titleProducerLicenseNumber}
                placeholder="Title Producer’s License Number"
                className="h-[52px]"
                value={userDetails?.titleProducerLicenseNumber}
              />

              {userId ? (
                <>
                  <div className="flex gap-[1rem] items-end">
                    <div className="w-[45%]">
                      <label className="form-label mb-[1.8rem]">
                        Copy of Title Producer’s License
                      </label>
                      <a
                        href={userDetails?.titleProducerLicenseDocument}
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
                    <div>
                      <label className="form-label" for="inline-picker">
                        Valid Till Date
                      </label>
                      <Flatpickr
                        className="form-control  h-[52px]"
                        readOnly
                        value={
                          datePicker ||
                          userDetails?.titleProducerLicenseExpirationDate
                        }
                        onChange={date => setDatePicker(date)}
                        id="default-picker"
                        options={{
                          dateFormat: 'm/d/Y', // Set the date format as "mm/dd/yyyy"
                        }}
                      />
                    </div>
                    <Button
                      icon="heroicons-outline:check"
                      className={
                        documentStatus?.titleProducerLicenseDocumentStatus ===
                        'APPROVED'
                          ? 'btn-success w-[10%]'
                          : 'btn-outline-success w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          titleProducerLicenseDocumentStatus: 'APPROVED',
                        })
                      }
                    />
                    <Button
                      icon="heroicons-outline:x"
                      className={
                        documentStatus?.titleProducerLicenseDocumentStatus ===
                        'REJECTED'
                          ? 'btn-danger w-[10%]'
                          : 'btn-outline-danger w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          titleProducerLicenseDocumentStatus: 'REJECTED',
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="form-label" for="inline-picker">
                    Copy of Title Producer’s License
                  </label>
                  <div
                    className={`flex gap-[1rem] items-start ${
                      userDetails?.titleProducerLicenseDocumentStatus ===
                      'REJECTED'
                        ? 'text-danger-500'
                        : 'text-success-500'
                    }`}
                  >
                    <Fileinput
                      name="titleProducerLicenseDocument"
                      id="titleProducerLicenseDocument"
                      selectedFile={getValues('titleProducerLicenseDocument')}
                      error={errors.titleProducerLicenseDocument}
                      onChange={handletitleProducerLicenseChange}
                      className="h-[52px] w-[80%]"
                    />
                    {userDetails?.titleProducerLicenseDocumentStatus ===
                    'REJECTED' ? (
                      <Close />
                    ) : (
                      <Check />
                    )}
                    <a
                      href={userDetails?.titleProducerLicenseDocument}
                      target="_blank"
                      className={`underline ${
                        userDetails?.titleProducerLicenseDocumentStatus ===
                        'REJECTED'
                          ? 'text-danger-500'
                          : 'text-success-500'
                      } font-semibold h-[52px]`}
                    >
                      <p
                        className={` text-base ${
                          userDetails?.titleProducerLicenseDocumentStatus ===
                          'REJECTED'
                            ? 'text-danger-500'
                            : 'text-success-500'
                        }`}
                        for="inline-picker"
                      >
                        View File
                      </p>
                    </a>
                  </div>
                </div>
              )}
              {userId ? (
                <>
                  <div className="flex gap-[1rem] items-end">
                    <div className="w-[40%]">
                      <label className="form-label mb-[1.8rem]">
                        Digital Notary Stamp Image
                      </label>
                      <a
                        href={userDetails?.notaryStamp}
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
                    <Button
                      icon="heroicons-outline:check"
                      className={
                        documentStatus?.notaryStampStatus === 'APPROVED'
                          ? 'btn-success w-[10%]'
                          : 'btn-outline-success w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          notaryStampStatus: 'APPROVED',
                        })
                      }
                    />
                    <Button
                      icon="heroicons-outline:x"
                      className={
                        documentStatus?.notaryStampStatus === 'REJECTED'
                          ? 'btn-danger w-[10%]'
                          : 'btn-outline-danger w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          notaryStampStatus: 'REJECTED',
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="form-label" for="inline-picker">
                    Digital Notary Stamp Image
                  </label>
                  <div
                    className={`flex gap-[1rem] items-start ${
                      userDetails?.notaryStampStatus === 'REJECTED'
                        ? 'text-danger-500'
                        : 'text-success-500'
                    }`}
                  >
                    <Fileinput
                      name="notaryStamp"
                      id="notaryStamp"
                      selectedFile={getValues('notaryStamp')}
                      error={errors.notaryStamp}
                      onChange={handleNotaryStampChange}
                      className="h-[52px] w-[80%]"
                    />
                    {userDetails?.notaryStampStatus === 'REJECTED' ? (
                      <Close />
                    ) : (
                      <Check />
                    )}
                    <a
                      href={userDetails?.notaryStamp}
                      target="_blank"
                      className={`underline  ${
                        userDetails?.notaryStampStatus === 'REJECTED'
                          ? 'text-danger-500'
                          : 'text-success-500'
                      } font-semibold h-[52px]`}
                    >
                      <p
                        className={` text-base  ${
                          userDetails?.notaryStampStatus === 'REJECTED'
                            ? 'text-danger-500'
                            : 'text-success-500'
                        }`}
                        for="inline-picker"
                      >
                        View File
                      </p>
                    </a>
                  </div>
                </div>
              )}
              {userId ? (
                <>
                  <div className="flex gap-[1rem] items-end">
                    <div className="w-[15%]">
                      <label className="form-label mb-[1.8rem]">
                        Signed W9
                      </label>
                      <a
                        href={userDetails?.signedW9Document}
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
                    <Button
                      icon="heroicons-outline:check"
                      className={
                        documentStatus?.signedW9DocumentStatus === 'APPROVED'
                          ? 'btn-success w-[10%]'
                          : 'btn-outline-success w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          signedW9DocumentStatus: 'APPROVED',
                        })
                      }
                    />
                    <Button
                      icon="heroicons-outline:x"
                      className={
                        documentStatus?.signedW9DocumentStatus === 'REJECTED'
                          ? 'btn-danger w-[10%]'
                          : 'btn-outline-danger w-[10%]'
                      }
                      onClick={() =>
                        setDocumentStatus({
                          ...documentStatus,
                          signedW9DocumentStatus: 'REJECTED',
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="form-label" for="inline-picker">
                    Signed W9
                  </label>
                  <div
                    className={`flex gap-[1rem] items-start ${
                      userDetails?.signedW9DocumentStatus === 'REJECTED'
                        ? 'text-danger-500'
                        : 'text-success-500'
                    }`}
                  >
                    <Fileinput
                      name="signedW9Document"
                      id="signedW9Document"
                      selectedFile={getValues('signedW9Document')}
                      error={errors.signedW9Document}
                      onChange={handlesignedW9DocumentChange}
                      className="h-[52px] w-[80%]"
                    />
                    {userDetails?.signedW9DocumentStatus === 'REJECTED' ? (
                      <Close />
                    ) : (
                      <Check />
                    )}
                    <a
                      href={userDetails?.signedW9Document}
                      target="_blank"
                      className={`underline  ${
                        userDetails?.signedW9DocumentStatus === 'REJECTED'
                          ? 'text-danger-500'
                          : 'text-success-500'
                      } font-semibold h-[52px]`}
                    >
                      <p
                        className={` text-base  ${
                          userDetails?.signedW9DocumentStatus === 'REJECTED'
                            ? 'text-danger-500'
                            : 'text-success-500'
                        }`}
                        for="inline-picker"
                      >
                        View File
                      </p>
                    </a>
                  </div>
                </div>
              )}
            </div>
            <Textarea
              label="Additional Information:"
              name="additionalInfo"
              id="pn4"
              readonly
              register={register}
              placeholder="Additional Information:"
              row="1"
              className="h-[52px] mb-[1rem]"
              value={userDetails?.additionalInformation}
            />
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
              onChange={e => {
                setValue('comments', e.target.value);
              }}
              placeholder="Approve/Reject Note"
              error={errors.comments}
              row="1"
              className="h-[52px] "
              readonly={!userId}
            />
            <div className="flex justify-center mt-[1.5rem]">
              <Button
                disabled={resubmited}
                text={userId ? 'Submit' : 'Resubmit'}
                type="submit"
                className="btn-slate px-[3rem]"
                isLoading={isSubmitting}
              />
            </div>
          </>
        )}
      </Card>
    </form>
  );
};

export default NotaryDetails;
