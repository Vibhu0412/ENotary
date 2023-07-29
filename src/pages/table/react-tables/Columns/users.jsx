import Tooltip from "@/components/ui/Tooltip";
import { Box, Button, ListItemIcon, MenuItem } from "@mui/material";
import Icon from "@/components/ui/Icon";
import { Cancel, Check, Close, Edit } from "@mui/icons-material";

export const usersColumn = [
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`, //accessorFn used to join multiple data into a single cell
    id: "user_name", //id is still required when using accessorFn instead of accessorKey
    header: "Username",
    size: 150,
    Cell: ({ renderedCellValue, row }) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <span>{renderedCellValue}</span>
      </Box>
    ),
  },
  {
    accessorKey: "email",
    id: "email",
    header: "User Email",
    size: 150,
  },
  {
    accessorKey: "userType",
    id: "userType",
    header: "Role",
    size: 150,
  },
  {
    accessorKey: "name",
    id: "name",
    header: "Org.Name",
    size: 150,
    Cell: ({ row }) =>  row.original.organization?.name || 'none',
  },
 
];
export const renderUserAction = ({ closeMenu }) => {
  let menuItems = []
  menuItems.push(
    <>
    
      <MenuItem
        key={0}
        onClick={() => {
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Edit />
        </ListItemIcon>
        Edit
      </MenuItem>

    </>

  )
  return menuItems
}