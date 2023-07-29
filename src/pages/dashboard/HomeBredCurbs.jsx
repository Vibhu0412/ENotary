import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/ui/Modal';
import OrganizationForm from '../auth/common/OrganizationSignupForm';
import Button from '@/components/ui/Button';
import OrganisationInviteUserForm from '../auth/common/OrganisationInviteUserForm';
import AddAdminUserForm from '../auth/common/AddAdminUserForm';

const HomeBredCurbs = ({ title }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);

  const location = useLocation();
  const isOrgPage = location.pathname.startsWith('/admin/orgadmin');
  const isUserPage = location.pathname.startsWith('/user');
  const organisationPage = location.pathname.startsWith('/organization/user');
  const adminUserPage = location.pathname.startsWith('/admin/user');

  const handleModalClose = () => {
    setAdminModalOpen(false);
  };

  return (
    <div className="flex justify-between flex-wrap items-center mb-6">
      <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
        {title}
      </h4>
      {/* <div className="flex sm:space-x-4 space-x-2 sm:justify-end items-center rtl:space-x-reverse">
        <div className="date-range-custom relative">
          <Datepicker
            value={value}
            inputClassName="input-class"
            containerClassName="container-class"
            onChange={handleValueChange}
          />
        </div>
       
      
      </div> */}

      <div className="flex sm:space-x-4 space-x-2 sm:justify-end items-center rtl:space-x-reverse">
        {/* <div className="grid xl:grid-cols-2 grid-cols-1 gap-5"> */}
        {isOrgPage ? (
          <Modal
            title="Add Organization"
            label="Add Organization"
            labelClass="btn-outline-dark"
            className="max-w-3xl"
            uncontrol
            scrollContent
            footerContent={
              <Button
                text="Save"
                className="btn-dark shadow-base2 px-[3.5rem]"
                onClick={() => {
                  alert('Organization Save Successfully');
                }}
              />
            }
          >
            <OrganizationForm />
          </Modal>
        ) : organisationPage ? (
          <div>
            <button
              className="btn btn-outline-dark"
              onClick={() => {
                setAdminModalOpen(true);
              }}
            >
              Invite User
            </button>
            <Modal
              title="Invite User"
              label="Invite User"
              labelClass="btn-outline-dark"
              className="max-w-3xl"
              onClose={handleModalClose}
              activeModal={isAdminModalOpen}
              scrollContent
            >
              <OrganisationInviteUserForm onCloseModal={handleModalClose} />
            </Modal>
          </div>
        ) : adminUserPage ? (
          <div>
            <button
              className="btn btn-outline-dark"
              onClick={() => {
                setAdminModalOpen(true);
              }}
            >
              add admin
            </button>
            <Modal
              title="add admin"
              label="add admin"
              labelClass="btn-outline-dark"
              className="max-w-3xl"
              onClose={handleModalClose}
              activeModal={isAdminModalOpen}
            >
              <AddAdminUserForm onCloseModal={handleModalClose} />
            </Modal>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HomeBredCurbs;
