import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { Edit } from "@mui/icons-material";
import { Box, Button, ListItemIcon, MenuItem } from "@mui/material";
export const organizationColumn = [
  {
    accessorKey: "org_name",
    id: "org_name", //id is still required when using accessorFn instead of accessorKey
    header: "ORG. Name",
    size: 150,
  },
  {
    accessorKey: "org_type",
    id: "org_type",
    header: "ORG. Type",
    size: 100,
  },
  {
    accessorKey: "contact_person",
    id: "contact_person",
    header: "Contact Person",
    size: 100,
  },
  {
    accessorKey: "email",
    id: "email",
    header: "Email",
    size: 200,
  },
  {
    accessorKey: "phone",
    id: "phone",
    header: "Phone",
    size: 100,
  },
  {
    accessorKey: "city",
    id: "city",
    header: "City",
    size: 100,
  },
  {
    accessorKey: "reg_start_date",
    id: "reg_start_date",
    header: "Registration Start Date",
    size: 100,
  },
  {
    accessorKey: "reg_end_date",
    id: "reg_end_date",
    header: "Registration End Date",
    size: 100,
  },
  {
    accessorKey: "status",
    id: "status",
    header: "Status",
    size: 100,
    Cell: ({ row }) => {
      return (
        <Box>
          <Button
            sx={{
              borderRadius: "20px",
              backgroundColor:
                row.original.status === "active"
                  ? "#d3f1e4"
                  : row.original.status === "inactive"
                  ? "#fee3da"
                  : "#fbd5d6",
              color:
                row.original.status === "active"
                  ? "#50cab5"
                  : row.original.status === "inactive"
                  ? "#fcb47d"
                  : "#f16393",
              fontWeight: "400",
              textTransform: "capitalize",
            }}
            variant="outlined"
            id={row.id}
          >
            {row.original.status}
          </Button>
        </Box>
      );
    },
  },
];
export const renderOrgAction = ({ closeMenu }) => {
  let menuItems = [];
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
  );
  return menuItems;
};
