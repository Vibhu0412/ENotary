import React from 'react';
import { renderUserAction, usersColumn } from './react-tables/Columns/users';
import Table from './react-tables/Table';
import HomeBredCurbs from '../dashboard/HomeBredCurbs';
import { getAllUsers } from '../../services/user.services';

const UserTable = () => {
  const getUsers = (filters, pagination, sorting) => {
    try {
      return getAllUsers({
        status: 'APPROVED',
        filters,
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sort: sorting?.id,
        orderBy: sorting?.desc ? 'desc' : 'asc',
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" space-y-5">
      <HomeBredCurbs title="Users" />
      <Table
        getData={getUsers}
        col={usersColumn}
        renderRowActionMenuItems={renderUserAction}
      />
    </div>
  );
};

export default UserTable;
