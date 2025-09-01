import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

const FormGridContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1.5rem",
  marginTop: "1.5rem",
});

const FormColumn = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

const ActionButtons = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "2rem",
  gap: "1rem",
});

const SubmitButton = styled(Button)({
  paddingLeft: "2rem",
  paddingRight: "2rem",
});

const UpdateItem = () => {
  interface ItemData {
    companyID: string;
    nameFull: string;
    nameShort: string;
    purchasePrice: number;
    salePrice: number;
    unitsInCarton: number;
  }

  interface CompanyData {
    id: string;
    nameFull: string;
    nameShort: string;
    address: string;
    areaID: string | null;
    email1: string;
    email2: string;
    email3: string;
    phone1: string;
    phone2: string;
    phone3: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  }

  const [itemData, setItemData] = useState<ItemData>({
    companyID: "",
    nameFull: "",
    nameShort: "",
    purchasePrice: 0,
    salePrice: 0,
    unitsInCarton: 0,
  });

  const [companyData, setCompanyData] = useState<CompanyData[]>([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getItemData = async () => {
      try {
        const response1 = await axios.get(
          `http://localhost:4000/api/v1/item/${id}`
        );
        const response2 = await axios.get(
          `http://localhost:4000/api/v1/party/company`
        );
        setCompanyData(response2.data.parties);
        console.log(response1);
        console.log(response2);
        setItemData(response1.data.item);
      } catch (error) {
        console.log(error);
      }
    };
    getItemData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    axios.put(`http://localhost:4000/api/v1/item/${id}`, itemData);
    setIsSubmitting(true);
    navigate(-1);
  };

  return (
    <div>
      <StyledContainer maxWidth="md">
        <StyledPaper elevation={3}>
          <PageTitle variant="h4">Update Item</PageTitle>

          <form onSubmit={handleSubmit}>
            <FormGridContainer>
              <FormColumn>
                <FormControl>
                  <InputLabel>Company ID</InputLabel>
                  <Select
                    value={itemData.companyID}
                    label="Company ID"
                    onChange={handleSelectChange}
                    name="companyID"
                    required
                  >
                    {companyData.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.nameFull}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Full Name"
                  name="nameFull"
                  value={itemData.nameFull}
                  onChange={handleInputChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Short Name"
                  name="nameShort"
                  value={itemData.nameShort}
                  onChange={handleInputChange}
                  required
                />
              </FormColumn>

              <FormColumn>
                <TextField
                  fullWidth
                  label="Purchase Price"
                  name="purchasePrice"
                  value={itemData.purchasePrice}
                  onChange={handleInputChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Sale Price"
                  name="salePrice"
                  value={itemData.salePrice}
                  onChange={handleInputChange}
                />

                <TextField
                  fullWidth
                  label="Units in Carton"
                  name="unitsInCarton"
                  value={itemData.unitsInCarton}
                  onChange={handleInputChange}
                  required
                />
              </FormColumn>
            </FormGridContainer>

            <ActionButtons>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <SubmitButton
                variant="contained"
                type="submit"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </SubmitButton>
            </ActionButtons>
          </form>
        </StyledPaper>
      </StyledContainer>
    </div>
  );
};

export default UpdateItem;
