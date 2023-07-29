import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from './react-tables/Table';

import {
  renderUserValidityAction,
  userValidityColumn,
} from './react-tables/Columns/userValidity';

import { useEffect } from 'react';
import HomeBredCurbs from '../dashboard/HomeBredCurbs';
import { getAllUsers } from '../../services/user.services';

const ApprovalTable = () => {
  const navigate = useNavigate();

  const getUsers = (filters, pagination, sorting) => {
    try {
      return getAllUsers({
        status: 'REQUESTED_VERIFICATION',
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sort: sorting?.id,
        orderBy: sorting?.desc ? 'desc' : 'asc',
        filters,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className=" space-y-5">
      <>
        <HomeBredCurbs title="Approvals " />
        <Table
          getData={getUsers}
          col={userValidityColumn}
          renderRowActionMenuItems={renderUserValidityAction}
          onRowClick={({ original }) => {
            navigate(`/admin/approvedetails/${original?.id}`, {
              state: { userId: original?.id, userType: original?.userType },
            });
          }}
        />
      </>
    </div>
  );
};

export default ApprovalTable;
