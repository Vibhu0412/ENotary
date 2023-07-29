import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { Archive, Check, Close } from "@mui/icons-material";
import { Box, Button, IconButton, ListItemIcon, MenuItem, Switch } from "@mui/material";
import { useState } from "react";

export const notificationsColumn = [
  {
    accessorKey: "notification_date",
    id: "notification_date",
    header: "Date",
    size: 200,
  },
  {
    accessorKey: "notification_time",
    id: "notification_time",
    header: "Time",
    size: 200,
  },
  {
    accessorKey: "notification_for",
    id: "notification_for",
    header: "Notification For",
    size: 200,
  },
  {
    accessorKey: "sender_name",
    id: "sender_name",
    header: "Sender",
    size: 200,
  },
  {
    accessorKey: "subject",
    id: "subject",
    header: "Subject",
    size: 200,
  },
  {
    accessorKey: "type",
    id: "type",
    header: "Type",
    size: 200,
  },

];

export const renderTopToolbarActions = ({ table }) => {
  const [isRead, setIsRead] = useState(false);
  const handleDeactivate = () => {
    table.getSelectedRowModel().flatRows.map((row) => {
      alert('deactivating ' + row.getValue('notification_date'));
    });
  };
  const handleSwitchChange = (event) => {
    setIsRead(event.target.checked);

  };
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <IconButton
        color="error"
        disabled={!table.getIsSomeRowsSelected()}
        onClick={handleDeactivate}
        variant="contained"
      >
        <Archive />
      </IconButton>
      <Switch checked={isRead} onChange={handleSwitchChange} />
      {isRead ? <span> Read </span> : <span> Unread </span>}
    </div>
  );
};

export const renderNotificationAction = ({ closeMenu }) => {
  let menuItems = []
    menuItems.push(
      <>
        <MenuItem
          key={2}
          onClick={() => {
            closeMenu();
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            <Check />
          </ListItemIcon>
          Approve
        </MenuItem>
        <MenuItem
          key={2}
          onClick={() => {
            closeMenu();
          }}
          sx={{ m: 0 }}
        >
          <ListItemIcon>
            <Close />
          </ListItemIcon>
          Reject
        </MenuItem>

      </>
    )
    return menuItems

}
