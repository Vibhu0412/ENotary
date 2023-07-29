import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { Edit } from "@mui/icons-material";
import { Box, ListItemIcon, MenuItem } from "@mui/material";

export const notaryValidityColumn = [
    {
        accessorFn: (row) => `${row.user_firstName} ${row.user_lastName}`, //accessorFn used to join multiple data into a single cell
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
        accessorKey: "user_email", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
        header: "User Email",
        size: 150,
    },
    {
        accessorKey: "org_name",
        id: "org_name", //id is still required when using accessorFn instead of accessorKey
        header: "ORG. Name",
        size: 150,
      },
      {
        accessorKey: "documents_type1",
        id: "documents_type1",
        header: "Documents Type-I",
        size: 100,
      },
      {
        accessorKey: "documents_pdf_type1",
        id: "documents_pdf_type1",
        header: "Documents PDF-I",
        size: 100,
      },
    {
        accessorKey: "valid_till",
        id: "valid_date",
        header: "Valid Till",
        size: 100,
    },
      {
        accessorKey: "documents_type2",
        id: "documents_type2",
        header: "Documents Type-II",
        size: 100,
      },
      {
        accessorKey: "documents_pdf_type2",
        id: "documents_pdf_type2",
        header: "Documents PDF-II",
        size: 100,
      },
    {
        accessorKey: "valid_till",
        id: "valid_date",
        header: "Valid Till",
        size: 100,
    },
      {
        accessorKey: "documents_type3",
        id: "documents_type3",
        header: "Documents Type-III",
        size: 100,
      },
      {
        accessorKey: "documents_pdf_type3",
        id: "documents_pdf_type3",
        header: "Documents PDF-III",
        size: 100,
      },
    {
        accessorKey: "valid_till",
        id: "valid_date",
        header: "Valid Till",
        size: 100,
    },
   

];
export const renderNotaryValidityAction = ({ closeMenu }) => {
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