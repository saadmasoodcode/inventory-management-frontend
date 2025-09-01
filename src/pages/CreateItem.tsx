import {
  Button,
  CircularProgress,
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const CreateItem = () => {
  const [loading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState<CompanyData[]>([
    {
      id: "",
      email1: "",
      email2: "",
      email3: "",
      phone1: "",
      phone2: "",
      phone3: "",
      nameFull: "",
      nameShort: "",
      address: "",
      type: "",
    },
  ]);

  interface PostData {
    companyID: string;
    nameFull: string;
    nameShort: string;
    purchasePrice: number;
    salePrice: number;
    unitsInCarton: number;
  }

  interface CompanyData {
    id: string;
    email1: string;
    email2: string;
    email3: string;
    phone1: string;
    phone2: string;
    phone3: string;
    nameFull: string;
    nameShort: string;
    address: string;
    type: string;
  }

  const [postData, setPostData] = useState<PostData>({
    companyID: "",
    nameFull: "",
    nameShort: "",
    purchasePrice: 0,
    salePrice: 0,
    unitsInCarton: 0,
  });

  useEffect(() => {
    const getCompanyData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/party/company"
        );
        setCompanyData(response.data.parties);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getCompanyData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/v1/item", postData);
      navigate("/item");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper>
        <PageTitle variant="h4">Create Item</PageTitle>

        <form onSubmit={handleSubmit}>
          <FormGridContainer>
            <FormColumn>
              <FormControl>
                <InputLabel>Company</InputLabel>
                <Select
                  value={postData.companyID}
                  name="companyID"
                  onChange={handleSelectChange}
                  label="Company"
                  required
                >
                  {!companyData ? (
                    <CircularProgress />
                  ) : (
                    companyData.map((item: CompanyData) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.nameFull}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Full Name"
                name="nameFull"
                value={postData.nameFull}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                label="Short Name"
                name="nameShort"
                value={postData.nameShort}
                onChange={handleInputChange}
                required
              />
            </FormColumn>

            <FormColumn>
              <TextField
                fullWidth
                label="Purchase Price"
                name="purchasePrice"
                value={postData.purchasePrice}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                label="Sale Price"
                name="salePrice"
                value={postData.salePrice}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                label="Units in Carton"
                name="unitsInCarton"
                value={postData.unitsInCarton}
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
              disabled={loading}
            >
              {loading ? <CircularProgress /> : "Create"}
            </SubmitButton>
          </ActionButtons>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
};

export default CreateItem;
