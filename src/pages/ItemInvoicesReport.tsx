import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const StyledHeading = styled("div")`
  margin: 20px 0;
`;

interface IItems {
  id: string;
  nameFull: string;
}

interface IBody {
  item: string;
  invoiceType: string;
  withDate: boolean;
  fromDate: string;
  toDate: string;
}

interface IInvoices {
  nameFull: string;
  id: string;
  transactionAmount: number;
  party: { nameFull: string };
}

const ItemInvoicesReport = () => {
  const [items, setItems] = useState<IItems[]>([]);
  const [showWithDate, setShowWithDate] = useState<boolean>(false);
  const [invoices, setInvoices] = useState<IInvoices[]>([]);

  const formDefaultValues = {
    item: "",
    invoiceType: "both",
    withDate: false,
    fromDate: "",
    toDate: "",
  };

  const { register, handleSubmit, watch } = useForm({
    defaultValues: formDefaultValues,
  });

  const item = watch("item");

  useEffect(() => {
    try {
      const getData = async () => {
        const response = await axios.get(`http://localhost:4000/api/v1/item`);
        setItems(response.data.items);
        console.log(response.data.items);
      };
      getData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onWithDateChange = () => {
    setShowWithDate((prev) => !prev);
  };

  const onFormSubmit = async (data: IBody) => {
    console.log(data);
    const response = await axios.get(
      `http://localhost:4000/api/v1/inventoryTransaction/item?itemID=${data.item}&invoiceType=${data.invoiceType}&withDate=${data.withDate}&dateFrom=${data.fromDate}&dateTo=${data.toDate}`
    );
    console.log(response);
    setInvoices(response.data.invoices);
  };

  return (
    <Container>
      <StyledHeading>
        <h1>Item Invoices Report</h1>
      </StyledHeading>
      <Box sx={{ padding: "30px" }} component={Paper}>
        <form
          onSubmit={handleSubmit((data) => onFormSubmit(data))}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <FormControl>
            <InputLabel>Item</InputLabel>
            <Select sx={{ width: "150px" }} {...register("item")} label="Item">
              {items &&
                items.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nameFull}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>Invoice Type</InputLabel>
            <Select
              sx={{ width: "150px" }}
              {...register("invoiceType")}
              label="Invoice Type"
              defaultValue={"both"}
            >
              <MenuItem value="both">Both</MenuItem>
              <MenuItem value="purchase">Purchase</MenuItem>
              <MenuItem value="sales">Sales</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={<Checkbox />}
            label="Add Date"
            checked={showWithDate}
            {...register("withDate")}
            onChange={onWithDateChange}
          />

          {showWithDate && (
            <>
              <h4>From</h4>
              <TextField {...register("fromDate")} type="date" />
              <h4>To</h4>
              <TextField {...register("toDate")} type="date" />
            </>
          )}

          <Button
            variant="contained"
            type="submit"
            disabled={item ? false : true}
          >
            Search
          </Button>
        </form>

        <TableContainer sx={{ marginTop: "20px" }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.party.nameFull}</TableCell>
                    <TableCell>{item.transactionAmount}</TableCell>
                    <TableCell align="center">
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ItemInvoicesReport;
