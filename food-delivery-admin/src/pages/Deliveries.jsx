import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon, Visibility as ViewIcon } from "@mui/icons-material";
import {
  fetchDeliveries,
  fetchDelivery,
  updateDelivery,
} from "../store/slices/deliveriesSlice";

const deliveryStatuses = [
  "pending",
  "assigned",
  "picked_up",
  "in_transit",
  "delivered",
  "cancelled",
];

const Deliveries = () => {
  const dispatch = useDispatch();
  const { deliveries, loading, error } = useSelector(
    (state) => state.deliveries
  );
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(fetchDeliveries());
  }, [dispatch]);

  const handleView = async (deliveryId) => {
    await dispatch(fetchDelivery(deliveryId));
    setSelectedDelivery(deliveryId);
    setOpenDialog(true);
  };

  const handleStatusChange = async (deliveryId, newStatus) => {
    await dispatch(updateDelivery({ id: deliveryId, status: newStatus }));
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedDelivery(null);
    setStatus("");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      assigned: "info",
      picked_up: "primary",
      in_transit: "secondary",
      delivered: "success",
      cancelled: "error",
    };
    return colors[status] || "default";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Deliveries Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Delivery ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Delivery Person</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow key={delivery._id}>
                <TableCell>{delivery._id}</TableCell>
                <TableCell>{delivery.order?._id}</TableCell>
                <TableCell>{delivery.deliveryPerson?.name}</TableCell>
                <TableCell>
                  <Chip
                    label={delivery.status}
                    color={getStatusColor(delivery.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleView(delivery._id)}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleStatusChange(delivery._id, status)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Delivery Details</DialogTitle>
        <DialogContent>
          {selectedDelivery && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Delivery Information</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Field</TableCell>
                      <TableCell>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deliveries.find(
                      (delivery) => delivery._id === selectedDelivery
                    )?.order && (
                      <>
                        <TableRow>
                          <TableCell>Order ID</TableCell>
                          <TableCell>
                            {
                              deliveries.find(
                                (delivery) => delivery._id === selectedDelivery
                              )?.order._id
                            }
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Customer</TableCell>
                          <TableCell>
                            {
                              deliveries.find(
                                (delivery) => delivery._id === selectedDelivery
                              )?.order.customer?.name
                            }
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Delivery Address</TableCell>
                          <TableCell>
                            {
                              deliveries.find(
                                (delivery) => delivery._id === selectedDelivery
                              )?.order.deliveryAddress
                            }
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2 }}>
                <TextField
                  select
                  label="Update Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  fullWidth
                >
                  {deliveryStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={() => handleStatusChange(selectedDelivery, status)}
            variant="contained"
            disabled={!status}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Deliveries;
