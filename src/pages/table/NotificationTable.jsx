import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    notificationsColumn,
    renderNotificationAction,
    renderTopToolbarActions,
  } from "./react-tables/Columns/notifications";

import Table from "./react-tables/Table";
import {notification_data} from "./react-tables/makeData";
import HomeBredCurbs from "../dashboard/HomeBredCurbs";
import { useEffect } from "react";

const NotificationTable = () => {
 
 
  const navigate = useNavigate();

  return (
    <div className=" space-y-5">
   
      
        <>
        <HomeBredCurbs title=" Notifications" />
          <Table
            data={notification_data}
            col={notificationsColumn}
            renderTopToolbarActions={renderTopToolbarActions}
            renderRowActionMenuItems={renderNotificationAction}
          />
        </>
     
    
    </div>
  );
};

export default NotificationTable;
