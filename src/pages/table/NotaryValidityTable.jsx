import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from './react-tables/Table';
import { notary_validity_data } from './react-tables/makeData';
import HomeBredCurbs from '../dashboard/HomeBredCurbs';
import {
  notaryValidityColumn,
  renderNotaryValidityAction,
} from './react-tables/Columns/notaryValidity';

const NotaryValidityTable = () => {
  return (
    <>
      <div className=" space-y-5">
        <HomeBredCurbs title="Notary Validity " />
        <Table
          data={notary_validity_data}
          col={notaryValidityColumn}
          renderRowActionMenuItems={renderNotaryValidityAction}
        />
      </div>
    </>
  );
};

export default NotaryValidityTable;
