import React, { useState } from 'react';
import SigneeDetails from './components/profile/SIgneeDetails';
import NotaryDetails from './components/profile/NotaryDetails';
import { useLocation } from 'react-router';
import OrgDetails from './components/profile/OrgDetails';
import { ToastContainer } from 'react-toastify';

function ApprovalDetailsForm({ isUser }) {
  const [selectedUser, setSelectedUser] = useState();
  const [detailformsSteps, setDetailformSteps] = useState(3);
  const location = useLocation();
  const userId = location?.state?.userId;
  const userType = location?.state?.userType;

  return (
    <>
      <ToastContainer />
      {userType === 'signee' && (
        <SigneeDetails detailformsSteps={detailformsSteps} userId={userId} />
      )}
      {userType === 'notary' && (
        <NotaryDetails detailformsSteps={detailformsSteps} userId={userId} />
      )}
      {userType === 'admin' && (
        <OrgDetails detailformsSteps={detailformsSteps} userId={userId} />
      )}
    </>
  );
}

export default ApprovalDetailsForm;
