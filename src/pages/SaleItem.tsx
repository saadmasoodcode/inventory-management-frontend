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

const SaleItem = () => {
  const navigate = useNavigate();
  const [saleInvoices, setSaleInvoices] = useState([]);

  useEffect(() => {
    const getAllSaleInvoices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/inventoryTransaction/salesInvoice`
        );
        setSaleInvoices(response.data.invoices);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    getAllSaleInvoices();
  }, []);

  return (
    <Container>
      <StyledHeading>
        <h1>Sale Item</h1>
        <Button
          variant="contained"
          onClick={() => navigate(`/create-sale-invoice`)}
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
            {!saleInvoices ? (
              <CircularProgress />
            ) : (
              saleInvoices.map((item: any) => {
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

export default SaleItem;
