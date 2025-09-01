import {
  Button,
  CircularProgress,
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
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AddPurchaseInvoiceItem, {
  IItem,
  IPurchaseInvoiceItemForm,
} from "../components/PurchaseInvoice/AddPurchaseInvoiceItem";
import AddPurchaseItemList, {
  IItems,
} from "../components/PurchaseInvoice/AddPurchaseItemList";

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
  width: 20vw;
  margin-right: 10px;
`;

const StyledNaration = styled(TextField)`
  width: 40vw;
  margin-top: 10px;
`;

const ErrorMsg = styled("p")`
  color: red;
  font-weight: 900;
`;

const StyledHeaderRow = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledActionsButtonContainer = styled("div")`
  display: flex;
  justify-content: end;
  align-items: end;
  margin-top: 10px;
`;

const CreatePurchaseInvoice = () => {
  // const [selectCompany, setSelectCompany] = useState<string>();
  const [companies, setCompanies] = useState<Company[]>();
  const [itemsByCompany, setItemsByCompany] = useState<IItem[]>([]);
  const [showAddItemForm, setShowAddItemForm] = useState<boolean>(false);
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] =
    useState<boolean>(false);

  const [netAmount, setNetAmount] = useState<number>(0);

  const [selectedItem, setSelectedItem] = useState<IItems>({
    id: "",
    itemID: "",
    itemName: "",
    comQty: 0,
    bonusQty: 0,
    purchasePrice: 0,
    salePrice: 0,
  });

  const schema = yup.object().shape({
    companyID: yup.string().required("Company is required"),
    narration: yup.string().required("Narration is required"),
    items: yup
      .array()
      .min(1, "Items should be added")
      .required("Items should be added"),
  });

  const formDefaultValues: CreatePurchaseInvoiceForm = {
    companyID: "",
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

  interface Company {
    id: string;
    nameFull: string;
  }

  interface CreatePurchaseInvoiceForm {
    companyID: string;
    narration: string;
    items: IItems[];
  }

  useEffect(() => {
    try {
      const getCompanies = async () => {
        const response = await axios.get(
          `http://localhost:4000/api/v1/party/company`
        );
        <CircularProgress />;
        setCompanies(response.data.parties);
      };
      getCompanies();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const companyID = watch("companyID");
  const items = watch("items");
  const narration = watch("narration");

  console.log(items);

  useEffect(() => {
    const calculatedNetAmount = items?.reduce(
      (total, item) => total + item.comQty * item.purchasePrice,
      0
    );
    setNetAmount(calculatedNetAmount);
  }, [items]);

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

  const addItem = (item: IPurchaseInvoiceItemForm) => {
    append(item);
  };

  const editItem = (item: IPurchaseInvoiceItemForm) => {
    if (!items || items.length == 0) {
      return;
    }
    const index = items.findIndex((item) => item.id == selectedItem.id);

    index > -1 && update(index, item);
    setSelectedItem({
      id: "",
      itemID: "",
      itemName: "",
      comQty: 0,
      bonusQty: 0,
      purchasePrice: 0,
      salePrice: 0,
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
    });
  };

  const handleClose = () => {
    setShowDeleteConfirmationDialog(false);
  };

  return (
    <StyledContainer>
      <AddPurchaseInvoiceItem
        show={showAddItemForm}
        setShowAddItemForm={setShowAddItemForm}
        items={itemsByCompany}
        addItem={addItem}
        selectedItem={selectedItem}
        editItem={editItem}
        invoiceItems={items}
      />
      <StyledPaper>
        <PageTitle variant="h4">Create Purchase Invoice</PageTitle>
        <form
          onSubmit={handleSubmit(async (_data: any) => {
            if (netAmount > 0) {
              try {
                await axios.post(
                  `http://localhost:4000/api/v1/inventoryTransaction/purchaseInvoice`,
                  {
                    paymentType: "ON_CASH",
                    date: new Date(),
                    companyID: companyID,
                    narration: narration,
                    lineItems: items,
                  }
                );
                console.log("Done submit");
              } catch (error) {
                console.log(error);
              }
            }
          })}
        >
          <StyledHeaderRow>
            <div>
              <FormControl>
                <InputLabel>Select Company</InputLabel>
                <StyledSelect
                  disabled={items && items.length > 0}
                  label="Select Company"
                  {...register("companyID")}
                >
                  {companies &&
                    companies.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.nameFull}
                        </MenuItem>
                      );
                    })}
                </StyledSelect>
                <ErrorMsg>{errors.companyID?.message}</ErrorMsg>
              </FormControl>
              <TextField
                type="number"
                value={netAmount}
                disabled
                label="Net Amount"
              />
            </div>
            <Button
              type="button"
              disabled={
                !companyID || (!!companyID && itemsByCompany.length <= 0)
              }
              variant="contained"
              onClick={() => setShowAddItemForm(true)}
            >
              Add Item
            </Button>
          </StyledHeaderRow>

          <AddPurchaseItemList
            setShowAddItemForm={setShowAddItemForm}
            items={items}
            setSelectedItem={setSelectedItem}
            deleteItem={deleteItem}
          />
          <ErrorMsg>{errors.items?.message}</ErrorMsg>
          <div>
            <StyledNaration
              multiline
              rows={2}
              {...register("narration")}
              label="Narration"
            />
            <ErrorMsg>{errors.narration?.message}</ErrorMsg>
          </div>

          <StyledActionsButtonContainer>
            <Button type="submit" variant="contained">
              Save Invoice
            </Button>
          </StyledActionsButtonContainer>
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

export default CreatePurchaseInvoice;
