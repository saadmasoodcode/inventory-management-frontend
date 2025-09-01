import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import AddSaleInvoiceItem from "../components/SaleInvoice/AddSaleInvoiceItem";
import AddSaleItemList from "../components/SaleInvoice/AddSaleItemList";

export interface ICustomer {
  id: string;
  nameFull: string;
}

interface ICompany {
  id: string;
  nameFull: string;
}

interface ISalesman {
  id: string;
  nameFull: string;
}

interface CreateSaleInvoiceForm {
  companyID: string;
  customerID: string;
  salesmansID: string;
  narration: string;
  items: IItems[];
}

export interface IItems {
  id: string;
  itemID: string;
  itemName: string;
  comQty: number;
  bonusQty: number;
  purchasePrice: number;
  salePrice: number;
  price: number;
}

const CreateSaleInvoice = () => {
  const schema = yup.object().shape({
    companyID: yup.string().required("Company is required"),
    customerID: yup.string().required("Customer is required"),
    salesmansID: yup.string().required("Salesman is required"),
    narration: yup.string().required("Narration is required"),
    items: yup.array().required("Items are required"),
  });

  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [salesmans, setSalesmans] = useState<ISalesman[]>([]);
  const [itemsByCompany, setItemsByCompany] = useState<ICustomer[]>([]);
  const [showAddItemForm, setShowAddItemForm] = useState<boolean>(false);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] =
    useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<IItems>({
    id: "",
    itemID: "",
    itemName: "",
    comQty: 0,
    bonusQty: 0,
    purchasePrice: 0,
    salePrice: 0,
    price: 0,
  });

  const formDefaultValues: CreateSaleInvoiceForm = {
    companyID: "",
    customerID: "",
    salesmansID: "",
    narration: "",
    items: [],
  };

  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: formDefaultValues,
    resolver: yupResolver(schema),
  });

  const { append, update, remove } = useFieldArray({
    control,
    name: "items",
  });

  const companyID = watch("companyID");
  const items = watch("items");
  const narration = watch("narration");
  const customerID = watch("customerID");
  const salesmansID = watch("salesmansID");

  useEffect(() => {
    const calculateNetAmount = items?.reduce((total, item) => {
      return total + item.comQty * item.salePrice;
    }, 0);

    console.log(items);

    setNetAmount(calculateNetAmount);
  }, [items]);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const response1 = await axios.get(
          `http://localhost:4000/api/v1/party/customer`
        );
        const response2 = await axios.get(
          `http://localhost:4000/api/v1/party/company`
        );
        const response3 = await axios.get(
          `http://localhost:4000/api/v1/party/salesman`
        );
        setCustomers(response1.data.parties);
        setCompanies(response2.data.parties);
        setSalesmans(response3.data.parties);
        console.log(response1);
        console.log(response2);
        console.log(response3);
      } catch (error) {
        console.log(error);
      }
    };
    getCustomers();
  }, []);

  useEffect(() => {
    try {
      const getItemsByCompany = async () => {
        const response = await axios.get(
          `http://localhost:4000/api/v1//item?companyID=${companyID}`
        );
        setItemsByCompany(response.data.items);
        console.log(response);
      };
      getItemsByCompany();
    } catch (error) {
      console.log(error);
    }
  }, [companyID]);

  const addData = (data: IItems) => {
    append(data);
  };

  const updateData = (data: IItems) => {
    if (!items || items.length == 0) {
      return;
    }
    const index = items.findIndex((item) => item.id == selectedItem.id);

    index > -1 && update(index, data);
    setSelectedItem({
      id: "",
      itemID: "",
      itemName: "",
      comQty: 0,
      bonusQty: 0,
      purchasePrice: 0,
      salePrice: 0,
      price: 0,
    });
  };

  const deleteItem = () => {
    setShowDeleteConfirmationDialog(true);
  };

  const handleCLickYes = () => {
    if (!items || items.length == 0) {
      return;
    }
    const index = items?.findIndex((itemm) => itemm.id == selectedItem.id);
    remove(index);
    setShowDeleteConfirmationDialog(false);
    setSelectedItem({
      id: "",
      itemID: "",
      itemName: "",
      comQty: 0,
      bonusQty: 0,
      purchasePrice: 0,
      salePrice: 0,
      price: 0,
    });
  };

  const handleClose = () => {
    setShowDeleteConfirmationDialog(false);
  };

  return (
    <StyledContainer>
      <AddSaleInvoiceItem
        itemsByCompany={itemsByCompany}
        show={showAddItemForm}
        setShowAddItemForm={setShowAddItemForm}
        selectedItem={selectedItem}
        items={items}
        addData={addData}
        updateData={updateData}
      />
      <StyledPaper>
        <PageTitle variant="h4">Create Sale Invoice</PageTitle>
        <form
          onSubmit={handleSubmit(async (data) => {
            console.log(data);
            try {
              await axios.post(
                `http://localhost:4000/api/v1/inventoryTransaction/salesInvoice`,
                {
                  paymentType: "ON_CASH",
                  date: new Date(),
                  customerID: customerID,
                  salesmanID: salesmansID,
                  narration: narration,
                  lineItems: items,
                }
              );
              console.log("Done submit");
            } catch (error) {
              console.log(error);
            }
          })}
        >
          <StyledHeaderRow>
            <Box>
              <FormControl>
                <InputLabel>Customer</InputLabel>
                <StyledSelect label="Customer" {...register("customerID")}>
                  {!customers
                    ? "Loading"
                    : customers.map((item, index) => {
                        return (
                          <MenuItem value={item.id} key={index}>
                            {item.nameFull}
                          </MenuItem>
                        );
                      })}
                </StyledSelect>
                <ErrorMsg>{errors.customerID?.message}</ErrorMsg>
              </FormControl>
              <FormControl>
                <InputLabel>Company</InputLabel>
                <StyledSelect label="Company" {...register("companyID")}>
                  {!companies
                    ? "Loading"
                    : companies.map((item, index) => {
                        return (
                          <MenuItem value={item.id} key={index}>
                            {item.nameFull}
                          </MenuItem>
                        );
                      })}
                </StyledSelect>
                <ErrorMsg>{errors.customerID?.message}</ErrorMsg>
              </FormControl>
              <FormControl>
                <InputLabel>Salesmans</InputLabel>
                <StyledSelect label="Salesmans" {...register("salesmansID")}>
                  {!salesmans
                    ? "Loading"
                    : salesmans.map((item, index) => {
                        return (
                          <MenuItem value={item.id} key={index}>
                            {item.nameFull}
                          </MenuItem>
                        );
                      })}
                </StyledSelect>
                <ErrorMsg>{errors.customerID?.message}</ErrorMsg>
              </FormControl>
              <TextField
                type="number"
                value={netAmount}
                disabled
                label="Net Amount"
              />
            </Box>
            <Button
              variant="contained"
              onClick={() => setShowAddItemForm(true)}
              disabled={!customerID || !companyID ? true : false}
            >
              Add Item
            </Button>
          </StyledHeaderRow>
          <AddSaleItemList
            setShowAddItemForm={setShowAddItemForm}
            setSelectedItem={setSelectedItem}
            items={items}
            deleteItem={deleteItem}
          />
          <TextField
            label="Narration"
            sx={{ width: "500px", marginTop: "20px" }}
            multiline
            {...register("narration")}
            rows={2}
          />
          <ErrorMsg>{errors.narration?.message}</ErrorMsg>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              type="submit"
              sx={{ marginTop: "20px" }}
              variant="contained"
            >
              Save Invoice
            </Button>
          </Box>
        </form>
      </StyledPaper>

      <Dialog
        open={showDeleteConfirmationDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCLickYes}>Yes</Button>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default CreateSaleInvoice;

const StyledContainer = styled(Container)({
  padding: "2rem",
});

const StyledPaper = styled(Paper)({
  padding: "2.5rem",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
});

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: "2rem",
  textAlign: "center",
}));

const StyledSelect = styled(Select)`
  width: 200px;
`;

const StyledHeaderRow = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ErrorMsg = styled("p")`
  color: red;
  font-weight: 900;
  font-size: 12px;
`;
