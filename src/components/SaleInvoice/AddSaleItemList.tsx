import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IItems } from "../../pages/CreateSaleInvoice";

interface AddSaleItemListProps {
  items: IItems[];
  setSelectedItem: React.Dispatch<React.SetStateAction<IItems>>;
  setShowAddItemForm: React.Dispatch<React.SetStateAction<boolean>>;
  deleteItem: () => void;
}

const AddSaleItemList = (props: AddSaleItemListProps) => {
  const { items, setSelectedItem, setShowAddItemForm, deleteItem } = props;

  return (
    <TableContainer sx={{ marginTop: "20px" }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.No</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.comQty}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => {
                      setShowAddItemForm(true);
                      setSelectedItem({
                        id: item.id,
                        itemID: item.itemID,
                        itemName: item.itemName,
                        comQty: item.comQty,
                        bonusQty: item.bonusQty,
                        purchasePrice: item.purchasePrice,
                        salePrice: item.salePrice,
                        price: item.price,
                      });
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      deleteItem();
                      setSelectedItem({
                        id: item.id,
                        itemID: item.itemID,
                        itemName: item.itemName,
                        comQty: item.comQty,
                        bonusQty: item.bonusQty,
                        purchasePrice: item.purchasePrice,
                        salePrice: item.salePrice,
                        price: item.price,
                      });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AddSaleItemList;
