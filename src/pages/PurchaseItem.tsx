import {
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledHeading = styled("div")`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PurchaseItem = () => {
  const [purchaseInvoices, setPurchaseInvoices] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    const getAllPurchaseInvoices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/inventoryTransaction/purchaseInvoice`
        );
        setPurchaseInvoices(response.data.invoices);
        console.log(response);
      } catch (error) {}
    };

    getAllPurchaseInvoices();
  }, []);

  return (
    <Container>
      <StyledHeading>
        <h1>Purchase Item</h1>
        <Button
          variant="contained"
          onClick={() => navigate(`/create-purchase-invoice`)}
        >
          Create
        </Button>
      </StyledHeading>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!purchaseInvoices ? (
              <CircularProgress />
            ) : (
              purchaseInvoices.map((item: any) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.party.nameFull}</TableCell>
                    <TableCell>{item.netAmount}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="success">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PurchaseItem;
