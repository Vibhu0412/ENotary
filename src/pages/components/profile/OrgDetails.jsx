import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputGroup from '@/components/ui/InputGroup';
import Flatpickr from 'react-flatpickr';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { useLocation, useNavigate } from 'react-router-dom';
import Textinput from '@/components/ui/Textinput';
import Checkbox from '@/components/ui/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
// import { handleRegister } from "./store";
import Textarea from '@/components/ui/Textarea';
import Fileinput from '@/components/ui/Fileinput';
import FlatpickerPage from '../../forms/date-time-picker';
import { getUserById } from '../../../services/user.services';
import Card from '../../../components/ui/Card';
import SelectField from '../../../components/ui/SelectField';
import { approveUserDetails } from '../../../services/user.services';
import { useUserInfoMutation } from '../../../services/commonService';
import { Check, Close } from '@mui/icons-material';
import { useOrganizationIdMutation } from '../../../services/organizationServices';
import { fileUpload } from '../../../share/utils';

const Country = [
  { value: 'USA', label: 'USA' },
  { value: 'UK', label: 'UK' },
  { value: 'CANADA', label: 'CANADA' },
  { value: 'USA', label: 'USA' },
  { value: 'UK', label: 'UK' },
  { value: 'CANADA', label: 'CANADA' },
];
const State = [
  { value: 'CALIFORNIYA', label: 'CALIFORNIYA' },
  { value: 'UK', label: 'UK' },
  { value: 'CANADA', label: 'CANADA' },
  { value: 'CALIFORNIYA', label: 'CALIFORNIYA' },
  { value: 'UK', label: 'UK' },
  { value: 'CANADA', label: 'CANADA' },
];
const City = [
  { value: 'San Jose', label: 'San Jose' },
  { value: 'UK', label: 'UK' },
  { value: 'CANADA', label: 'CANADA' },
];
const organizationtype = [
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Legal Practices', label: 'Legal Practices' },
  { value: 'Human Resource Dept', label: 'Human Resource Dept' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Legal Practices', label: 'Legal Practices' },
  { value: 'Human Resource Dept', label: 'Human Resource Dept' },
];
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
    name: yup.string(),
    contactPersonFirstName: yup.string(),
    contactPersonLastName: yup.string(),
    emailAddress: yup.string(),
    phoneNumber: yup.string(),
    zipCode: yup.string(),
    address: yup.string(),
    comments:yup.string().required('Approve/Reject Note is Required')
  })
  .nullable();

const OrgDetails = ({ detailformsSteps, userId }) => {
  const [getProfile] = useUserInfoMutation();
  const [updateProfile] = useOrganizationIdMutation();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [documentStatus, setDocumentStatus] = useState({
    registrationDocumentStatus: 'REJECTED',
  });
  const [comment, setComment] = useState('');
  const [checked, setChecked] = useState(false);
  const [picker, setPicker] = useState(new Date());
  const [userDetails, setUserDetails] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOrganizationregiFile, setSelectedOrganizationregiFile] =
    useState(null);
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
      const response = await getProfile(userId);
      setUserDetails(response?.data?.data);
      setValue('comments', response?.data?.data?.userApprovalEvent?.comments);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error.message);
    }
  };
  useEffect(() => {
    if (userId) getUser();
    else getUserDetails();
  }, []);

  const {
    register,
    formState: { errors,isSubmitting,setSubmitting },
    handleSubmit,
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const handleFileChange = async e => {
    setSelectedOrganizationregiFile(e.target.files[0]);
    setValue('registrationDocument', 'sample');
    await trigger('registrationDocument');
  };

  const onSubmit = async data => {
    console.log('in');
    documentStatus['comments'] = comment;
    documentStatus['id'] = userDetails?.organization?.id;
    const orgId = userDetails?.organization?.id;
    try {
      if (userId) {
        const approvalRes = await approveUserDetails(
          comments= data?.comments,
          documentStatus,
          'organization'
         
        );
        toast.success(`Mail has been sent successfully`);
        navigate('/admin/approval');
      } else {
        if (!selectedOrganizationregiFile) {
          toast.error(`Please select organization registration document`);
          return;
        }
        const OrganizationregiFileResponsee = await fileUpload(
          selectedOrganizationregiFile,
          `/OrganizationregiFileFolder/${selectedOrganizationregiFile.name}`
        );
        const payload = {
          ...userDetails,
          ...userDetails?.organization,
          ...userDetails?.organization?.address,
          address: userDetails?.organization?.address?.addressLine1,
          registrationDocument: OrganizationregiFileResponsee?.getUrl,
        };

        const approvalRes = await updateProfile(payload);
        // navigate('/');
        if (approvalRes && !approvalRes.error) {
          toast.success(`Registration resubmission successfully`);
          setTimeout(() => {
            navigate('/org-login');
          }, 2000);
        }
      }
    } catch (e) {
      toast.error(e);
      setSubmitting(false)
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`space-y-5 ${!userId ? 'p-[4rem]' : ''}`}
      >
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
          className={`shadow-xl bg-white w-[100%] `}
        >
          {(detailformsSteps == 1 || detailformsSteps == 3) && (
            <>
              <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
                <Textinput
                  name="name"
                  register={register}
                  label="Organization Name"
                  type="text"
                  readonly
                  placeholder="Organization Name"
                  value={userDetails?.organization?.name}
                  className="h-[52px]"
                  error={errors?.name}
                />
                {(detailformsSteps == 2 || detailformsSteps == 3) && (
                  <div>
                    <InputGroup
                      id="idDocumentType"
                      name="idDocumentType"
                      label="Organization Type"
                      type="text"
                      placeholder="OrganizationType"
                      register={register}
                      error={errors?.idDocumentType}
                      readonly
                      className="h-[52px]"
                      value={userDetails?.organization?.type}
                      merged
                    />
                  </div>
                )}

                <Textinput
                  name="personfn"
                  register={register}
                  label="Contact Person’s First Name"
                  type="text"
                  placeholder="Contact Person’s First Name"
                  className="h-[52px]"
                  readonly
                  value={userDetails?.organization?.contactPersonFirstName}
                  error={errors.firstName}
                />
                <Textinput
                  name="personln"
                  register={register}
                  label="Contact Person’s Last Name"
                  type="text"
                  readonly
                  value={userDetails?.organization?.contactPersonLastName}
                  placeholder="Contact Person’s Last Name"
                  className="h-[52px]"
                  error={errors.lastName}
                />

                <Textinput
                  label="E-mail Address"
                  name="email"
                  type="email"
                  readonly
                  register={register}
                  error={errors.email}
                  value={userDetails?.organization?.emailAddress}
                  placeholder="E-mail Address"
                  className="h-[52px]"
                />
                <InputGroup
                  label="Phone Number"
                  name="phonenumber"
                  prepend="+1"
                  readonly
                  placeholder="Phone Number"
                  id="phoneNumber"
                  value={userDetails?.organization?.phoneNumber}
                  register={register}
                  error={errors.phonenumber}
                  options={{ phone: true, phoneRegionCode: 'US' }}
                  isMask
                  className="h-[52px]"
                />
                <Textarea
                  label="Address"
                  name="address"
                  id="pn4"
                  readonly
                  error={errors.address}
                  value={userDetails?.organization?.address?.addressLine1}
                  register={register}
                  placeholder="Address"
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
                      value={userDetails?.organization?.address?.country}
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
                      value={userDetails?.organization?.address?.state}
                      merged
                    />
                  </div>
                </div>

                <Textinput
                  name="addInformation"
                  register={register}
                  readonly
                  label="Additional Information"
                  type="text"
                  placeholder=" Additional Information"
                  className="h-[52px]"
                  // error={errors.addInformation}
                  value={userDetails?.organization?.additionalInformation}
                />
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
                      value={userDetails?.organization?.address?.city}
                      merged
                    />
                  </div>
                  <Textinput
                    name="zipCode"
                    register={register}
                    label="Zip Code"
                    type="text"
                    value={userDetails?.organization?.address?.zipCode}
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
                {/* <div>
                  <InputGroup
                    id="idDocumentType"
                    name="idDocumentType"
                    label="Organization Type"
                    type="text"
                    placeholder="OrganizationType"
                    register={register}
                    error={errors?.idDocumentType}
                    readonly
                    className="h-[52px]"
                    value={userDetails?.organization?.type}
                    merged
                  />
                </div> */}
                {userId ? (
                  <>
                    <div className="flex gap-[1rem] items-end">
                      <div className="w-[100%]">
                        <label className="form-label mb-[1.8rem]">
                          Organization Registration Document{' '}
                        </label>
                        <a
                          href={userDetails?.organization?.registrationDocument}
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
                          documentStatus?.registrationDocumentStatus ===
                          'APPROVED'
                            ? 'btn-success w-[10%]'
                            : 'btn-outline-success w-[10%]'
                        }
                        onClick={() =>
                          setDocumentStatus({
                            ...documentStatus,
                            registrationDocumentStatus: 'APPROVED',
                          })
                        }
                      />
                      <Button
                        icon="heroicons-outline:x"
                        className={
                          documentStatus?.registrationDocumentStatus ===
                          'REJECTED'
                            ? 'btn-danger w-[10%]'
                            : 'btn-outline-danger w-[10%]'
                        }
                        onClick={() =>
                          setDocumentStatus({
                            ...documentStatus,
                            registrationDocumentStatus: 'REJECTED',
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="form-label" for="inline-picker">
                      Organization Registration Document
                    </label>
                    <div
                      className={`flex gap-[1rem] items-start ${
                        userDetails?.organization?.status === 'REJECTED'
                          ? 'text-danger-500'
                          : 'text-success-500'
                      }`}
                    >
                      <Fileinput
                        name="registrationDocument"
                        id="registrationDocument"
                        selectedFile={selectedOrganizationregiFile}
                        error={errors.registrationDocument}
                        onChange={handleFileChange}
                        className="h-[52px] w-[80%]"
                      />
                      {userDetails?.organization?.status === 'REJECTED' ? (
                        <Close />
                      ) : (
                        <Check />
                      )}
                      <a
                        href={userDetails?.organization?.registrationDocument}
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
                onChange={e => {
                  setValue('comments', e.target.value);
                }}
                readonly={!userId}
                placeholder="Approve/Reject Note"
                error={errors.comments}
                row="1"
                className="h-[52px] "
              />
              <div className="flex justify-center mt-[1.5rem]">
                <Button
                  text={userId ? 'Submit' : 'Save'}
                  type="submit"
                  className="btn-slate px-[3rem]"
                  isLoading={isSubmitting}
                />
              </div>
            </>
          )}
        </Card>
      </form>
    </>
  );
};

export default OrgDetails;
