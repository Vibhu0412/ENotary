import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    organizationColumn,
    renderOrgAction,
  } from "./react-tables/Columns/organization";

import Table from "./react-tables/Table";
import {org_data} from "./react-tables/makeData";
import HomeBredCurbs from "../dashboard/HomeBredCurbs";
import { useEffect } from "react";

const OrganizationTable = () => {
 
 
  const navigate = useNavigate();

  return (
      
        <>
    <div className=" space-y-5">
   
        <HomeBredCurbs title="Organizations " />
          <Table
            data={org_data}
            col={organizationColumn}
            renderRowActionMenuItems={renderOrgAction}
          />
     
    
    </div>
        </>
  );
};

export default OrganizationTable;
