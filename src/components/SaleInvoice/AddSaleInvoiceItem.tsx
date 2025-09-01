import {
  Alert,
  Box,
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
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ICustomer, IItems } from "../../pages/CreateSaleInvoice";
import axios from "axios";

interface AddSaleInvoiceItemProps {
  show: boolean;
  setShowAddItemForm: React.Dispatch<React.SetStateAction<boolean>>;
  itemsByCompany: ICustomer[];
  selectedItem: IItems;
  items: any[];
  addData: (data: IItems) => void;
  updateData: (data: IItems) => void;
}

interface ISaleInvoiceItemForm {
  id?: string;
  itemID: string;
  itemName: string;
  bonusQty: number;
  comQty: number;
  purchasePrice: number;
  salePrice: number;
  price?: number;
}

const AddSaleInvoiceItem = (props: AddSaleInvoiceItemProps) => {
  const {
    show,
    setShowAddItemForm,
    itemsByCompany,
    selectedItem,
    items,
    addData,
    updateData,
  } = props;

  const [itemPrice, setItemPrice] = useState<number>(0);

  const formDefaultValues: ISaleInvoiceItemForm = {
    id: "",
    itemID: "",
    itemName: "",
    bonusQty: 0,
    comQty: 0,
    purchasePrice: 0,
    salePrice: 0,
    price: 0,
  };

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
    // price: yup.number(),
  });

  const {
    register,
    watch,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ISaleInvoiceItemForm>({
    defaultValues: formDefaultValues,
    resolver: yupResolver(schema),
  });

  const id = watch("id");
  const itemID = watch("itemID");

  const [openDublicateItemErrorStackbar, setOpenDublicateItemErrorStackbar] =
    useState<boolean>(false);

  useEffect(() => {
    setValue("id", selectedItem.id);
    setValue("itemID", selectedItem.itemID);
    setValue("itemName", selectedItem.itemName);
    setValue("comQty", selectedItem.comQty);
    setValue("purchasePrice", selectedItem.purchasePrice);
    setValue("salePrice", selectedItem.salePrice);
    console.log(selectedItem);
  }, [selectedItem]);

  useEffect(() => {
    try {
      const getItemPrice = async () => {
        const response = await axios.get(
          `http://localhost:4000/api/v1/stock?itemID=${itemID}`
        );
        setItemPrice(response.data.itemStock.salePrice);
        console.log(itemID);
        console.log(response.data);
        console.log(response.data.itemStock.salePrice);
      };
      getItemPrice();
    } catch (error) {
      console.log(error);
    }
  }, [itemID]);

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

  const onSubmitForm = (data: FieldValues) => {
    const itemFound = items.find((itemm) => itemm.itemID == data.itemID);
    console.log(itemFound?.itemID);
    console.log(items);
    console.log(data.itemID);

    if (itemFound?.itemID !== data.itemID) {
      if (id) {
        updateData({
          id: id,
          itemID: data.itemID,
          itemName: data.itemName,
          comQty: data.comQty,
          bonusQty: data.bonusQty,
          purchasePrice: data.purchasePrice,
          salePrice: data.salePrice,
          price: itemPrice,
        });
      } else {
        addData({
          id: generateID(),
          itemID: data.itemID,
          itemName: data.itemName,
          comQty: data.comQty,
          bonusQty: data.bonusQty,
          purchasePrice: data.purchasePrice,
          salePrice: data.salePrice,
          price: itemPrice,
        });
      }
      reset(formDefaultValues);
      setShowAddItemForm(false);
    } else if (id && itemFound?.itemID == data.itemID) {
      updateData({
        id: id,
        itemID: data.itemID,
        itemName: data.itemName,
        comQty: data.comQty,
        bonusQty: data.bonusQty,
        purchasePrice: data.purchasePrice,
        salePrice: data.salePrice,
        price: itemPrice,
      });
      reset(formDefaultValues);
      setShowAddItemForm(false);
    } else {
      setOpenDublicateItemErrorStackbar(true);
    }
  };

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
      <Modal open={show}>
        <StyledFormContainer>
          <Typography sx={{ fontSize: "20px", marginBottom: "10px" }}>
            Add Item
          </Typography>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid container spacing={3}>
              <Grid size={6}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel>Item</InputLabel>
                  <StyledSelect
                    label="Item"
                    value={watch("itemID")}
                    onChange={(e) => {
                      const selectedItem = itemsByCompany.find(
                        (item) => item.id === e.target.value
                      );
                      if (selectedItem) {
                        setValue("itemID", selectedItem.id);
                        setValue("itemName", selectedItem.nameFull);
                      }
                    }}
                  >
                    {!itemsByCompany
                      ? "Loading"
                      : itemsByCompany.map((item, index) => {
                          return (
                            <MenuItem value={item.id} key={index}>
                              {item.nameFull}
                            </MenuItem>
                          );
                        })}
                  </StyledSelect>
                  <ErrorMsg>{errors.itemID?.message}</ErrorMsg>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <TextField
                  type="number"
                  {...register("comQty")}
                  label="Quantity"
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  type="number"
                  {...register("purchasePrice")}
                  label="Purchase Price"
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  type="number"
                  {...register("salePrice")}
                  label="Sale Price"
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                marginTop: "20px",
                gap: "10px",
              }}
            >
              <Button
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
            </Box>
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

export default AddSaleInvoiceItem;

const StyledFormContainer = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: white;
  padding: 20px;
`;

const StyledSelect = styled(Select)`
  width: 100%;
`;

const ErrorMsg = styled("p")`
  color: red;
  font-weight: 900;
  font-size: 12px;
`;
