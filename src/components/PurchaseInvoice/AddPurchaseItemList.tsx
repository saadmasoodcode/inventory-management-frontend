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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IPurchaseInvoiceItemForm } from "./AddPurchaseInvoiceItem";

export interface IItems {
  id: string;
  itemID: string;
  itemName: string;
  comQty: number;
  bonusQty: number;
  purchasePrice: number;
  salePrice: number;
}

interface AddPurchaseItemListProps {
  items: IItems[] | undefined;
  setShowAddItemForm: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<IItems>>;
  deleteItem: (item: IPurchaseInvoiceItemForm) => void;
}

const AddPurchaseItemList = (props: AddPurchaseItemListProps) => {
  const { items = [], setShowAddItemForm, setSelectedItem, deleteItem } = props;

  console.log(items);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items &&
              items.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.comQty}</TableCell>
                    <TableCell>
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
                          });
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          deleteItem(item);
                          setSelectedItem({
                            id: item.id,
                            itemID: item.itemID,
                            itemName: item.itemName,
                            comQty: item.comQty,
                            bonusQty: item.bonusQty,
                            purchasePrice: item.purchasePrice,
                            salePrice: item.salePrice,
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
    </div>
  );
};

export default AddPurchaseItemList;
