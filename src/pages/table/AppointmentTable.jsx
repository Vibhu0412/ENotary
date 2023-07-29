import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  appointmentColumn,
  renderAppointmentAction,
} from "./react-tables/Columns/appointments";

import Table from "./react-tables/Table";
import {data} from "./react-tables/makeData";
import HomeBredCurbs from "../dashboard/HomeBredCurbs";
import { useEffect } from "react";

const AppointmentTable = () => {
 
 
  const navigate = useNavigate();

  return (
    <div className=" space-y-5">
   
      
        <>
          <HomeBredCurbs title="Appointment " />
          <Table
            data={data}
            col={appointmentColumn}
            renderRowActionMenuItems={renderAppointmentAction}
            onRowClick={({ index, original }) => {
              navigate("/notary/tagging", {
                state: { index: index, original: original },
              });
            }}
          />
        </>
     
    
    </div>
  );
};

export default AppointmentTable;
