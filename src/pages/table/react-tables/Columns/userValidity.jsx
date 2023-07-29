import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { Check, Close, Edit } from "@mui/icons-material";
import { Box, ListItemIcon, MenuItem } from "@mui/material";

import {useEffect} from "react";





export const userValidityColumn = [
    {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`, //accessorFn used to join multiple data into a single cell
        id: "user_name", //id is still required when using accessorFn instead of accessorKey
        header: "User Name",
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
        accessorKey: "email", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
        header: "User Email",
        size: 150,
    },
    {
        accessorKey: "userType",
        id: "userType",
        header: "Role",
        size: 100,
      },
      {
        accessorKey: "name",
        id: "name",
        header: "Org.Name",
        size: 150,
        Cell: ({ row }) =>  row.original.organization?.name || 'none'
      },
    

];

export const renderUserValidityAction = ({ closeMenu }) => {
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
          <Check />
        </ListItemIcon>
        review
      </MenuItem>
      </>
  
    )
    return menuItems
  }