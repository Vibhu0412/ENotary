import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { Edit } from "@mui/icons-material";
import { Box, ListItemIcon, MenuItem } from "@mui/material";

export const appointmentColumn = [
  {
    accessorKey: "appointment_date",
    id: "appointment_date",
    header: " Date",
    size: 100,
  },
  {
    accessorKey: "appointment_time",
    id: "appointment_time",
    header: "Time",
    size: 100,
  },
  {
    accessorFn: (row) => `${row.signee_firstName} ${row.signee_lastName}`, //accessorFn used to join multiple data into a single cell
    id: "signee_name", //id is still required when using accessorFn instead of accessorKey
    header: "Signee Name",
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
    accessorKey: "signee_email", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
    header: "Signee Email",
    size: 150,
  },
  {
    accessorFn: (row) => `${row.notary_firstName} ${row.notary_lastName}`, //accessorFn used to join multiple data into a single cell
    id: "notary_name", //id is still required when using accessorFn instead of accessorKey
    header: "Notary Name",
    size: 150,
    Cell: ({ renderedCellValue }) => (
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
    accessorKey: "notary_email", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
    header: "Notary Email",
    size: 150,
  },
  {
    accessorKey: "notarization_for", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
    header: "Notarization For",
    size: 100,
  },
  {
    accessorKey: "documents",
    id: "documents",
    header: "Documents",
    size: 100,
  },
  {
    accessorKey: "status",
    id: "status",
    header: "Status",
    size: 100,
  },

];
export const renderAppointmentAction = ({ closeMenu }) => {
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