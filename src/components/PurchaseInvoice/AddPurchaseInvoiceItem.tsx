import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  SnackbarCloseReason,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

import { FieldValues, useForm } from "react-hook-form";
import { IItems } from "./AddPurchaseItemList";

const StyledSelect = styled(Select)`
  width: 100%;
`;

const StyledButtonsContainer = styled("div")`
  margin-bottom: 10px;
  margin-top: 10px;
  display: flex;
  align-items: end;
  justify-content: end;
  gap: 10px;
`;

const StyledFormContainer = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: white;
  padding: 20px;
`;

const ErrorMsg = styled("p")`
  color: red;
  font-weight: 900;
  font-size: 10px;
  margin-top: 5px;
`;

export interface IItem {
  id: string;
  nameFull: string;
}

export interface IPurchaseInvoiceItemForm {
  id?: string;
  itemID: string;
  itemName: string;
  comQty: number;
  bonusQty: number;
  purchasePrice: number;
  salePrice: number;
}

interface AddPurchaseInvoiceItemProps {
  show: boolean;
  items: IItem[];
  setShowAddItemForm: React.Dispatch<React.SetStateAction<boolean>>;
  addItem: (item: IPurchaseInvoiceItemForm) => void;
  selectedItem: IItems;
  editItem: (item: IPurchaseInvoiceItemForm) => void;
  invoiceItems: IItems[] | undefined;
}

const formDefaultValues: IPurchaseInvoiceItemForm = {
  id: "",
  itemID: "",
  itemName: "",
  comQty: 0,
  bonusQty: 0,
  purchasePrice: 0,
  salePrice: 0,
};

const AddPurchaseInvoiceItem = (props: AddPurchaseInvoiceItemProps) => {
  const {
    setShowAddItemForm,
    invoiceItems = [],
    items = [],
    show,
    addItem,
    selectedItem,
    editItem,
  } = props;

  const [openDublicateItemErrorStackbar, setOpenDublicateItemErrorStackbar] =
    useState<boolean>(false);

  const schema = yup.object().shape({
    itemID: yup.string().required("Item is required"),
    itemName: yup.string().required(),
    comQty: yup
      .number()
      .min(1, "Qty must be greater than 0")
      .required("Quantity is required"),
    bonusQty: yup.number().required(),
    purchasePrice: yup
      .number()
      .min(1, "Purchase Price must be greater than 0")
      .required("Purchase Price is required"),
    salePrice: yup
      .number()
      .min(1, "Sale Price must be greater than 0")
      .required("Sale Price is required"),
  });

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IPurchaseInvoiceItemForm>({
    defaultValues: formDefaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("id", selectedItem.id);
    setValue("itemID", selectedItem.itemID);
    setValue("itemName", selectedItem.itemName);
    setValue("comQty", selectedItem.comQty);
    setValue("purchasePrice", selectedItem.purchasePrice);
    setValue("salePrice", selectedItem.salePrice);
    console.log(selectedItem);
  }, [selectedItem]);

  const onSubmit = (data: FieldValues) => {
    const itemFound = invoiceItems.find((itemm) => itemm.itemID == data.itemID);
    console.log(itemFound?.itemID);
    console.log(items);
    console.log(invoiceItems);
    console.log(data.itemID);

    if (itemFound?.itemID !== data.itemID) {
      if (id) {
        editItem({
          id: id,
          itemID: data.itemID,
          itemName: data.itemName,
          comQty: data.comQty,
          bonusQty: data.bonusQty,
          purchasePrice: data.purchasePrice,
          salePrice: data.salePrice,
        });
      } else {
        addItem({
          id: generateID(),
          itemID: data.itemID,
          itemName: data.itemName,
          comQty: data.comQty,
          bonusQty: data.bonusQty,
          purchasePrice: data.purchasePrice,
          salePrice: data.salePrice,
        });
      }
      reset(formDefaultValues);
      setShowAddItemForm(false);
    } else if (id && itemFound?.itemID == data.itemID) {
      editItem({
        id: id,
        itemID: data.itemID,
        itemName: data.itemName,
        comQty: data.comQty,
        bonusQty: data.bonusQty,
        purchasePrice: data.purchasePrice,
        salePrice: data.salePrice,
      });
      reset(formDefaultValues);
      setShowAddItemForm(false);
    } else {
      setOpenDublicateItemErrorStackbar(true);
    }
  };

  const generateID = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const miliSeconds = date.getMilliseconds();
    const newID = `ITEM-${hours}-${minutes}-${seconds}-${miliSeconds}`;
    console.log(newID);
    return newID;
  };

  const id = watch("id");

  console.log(id);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenDublicateItemErrorStackbar(false);
  };

  return (
    <>
      <Modal
        open={show}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledFormContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h5">Add Item</Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Item</InputLabel>
                  <StyledSelect
                    label="Item"
                    value={watch("itemID")}
                    onChange={(e) => {
                      const selectedItem = items.find(
                        (item) => item.id === e.target.value
                      );
                      if (selectedItem) {
                        setValue("itemID", selectedItem.id);
                        setValue("itemName", selectedItem.nameFull);
                      }
                    }}
                  >
                    {items.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.nameFull}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
                <ErrorMsg>{errors.itemID?.message}</ErrorMsg>
              </Grid>

              <Grid size={6}>
                <TextField
                  {...register("comQty")}
                  fullWidth
                  label="Qty"
                  type="number"
                />
                <ErrorMsg>{errors.comQty?.message}</ErrorMsg>
              </Grid>
              <Grid size={6}>
                <TextField
                  {...register("purchasePrice")}
                  fullWidth
                  label="Purchase Price"
                  type="number"
                />
                <ErrorMsg>{errors.purchasePrice?.message}</ErrorMsg>
              </Grid>
              <Grid size={6}>
                <TextField
                  {...register("salePrice")}
                  fullWidth
                  label="Sale Price"
                  type="number"
                />
                <ErrorMsg>{errors.salePrice?.message}</ErrorMsg>
              </Grid>
            </Grid>
            <StyledButtonsContainer>
              <Button
                type="button"
                variant="contained"
                onClick={() => {
                  reset(formDefaultValues);
                  setShowAddItemForm(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {id ? "Edit" : "Add"}
              </Button>
            </StyledButtonsContainer>
          </form>
        </StyledFormContainer>
      </Modal>
      <Snackbar
        open={openDublicateItemErrorStackbar}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" variant="filled">
          This item already added
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddPurchaseInvoiceItem;
