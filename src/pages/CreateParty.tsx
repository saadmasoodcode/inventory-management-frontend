import {
  Autocomplete,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

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

interface Salesman {
  id: string;
  nameFull: string;
  nameShort: string;
  email1: string;
  email2: string;
  email3: string | null;
  phone1: string;
  phone2: string | null;
  phone3: string | null;
  address: string;
  areaID: string | null;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface Area {
  id: string;
  name: string;
}

interface PartyFormData {
  email1: string;
  email2: string;
  email3: string;
  phone1: string;
  phone2: string;
  phone3: string;
  nameFull: string;
  nameShort: string;
  address: string;
  salesmanID: string;
  areaID: string;
  areaName: string;
  type: string;
}

const CreateParty = () => {
  const [postData, setPostData] = useState<PartyFormData>({
    email1: "",
    email2: "",
    email3: "",
    phone1: "",
    phone2: "",
    phone3: "",
    nameFull: "",
    nameShort: "",
    address: "",
    salesmanID: "",
    areaID: "",
    areaName: "",
    type: "",
  });

  const [salesmen, setSalesmen] = useState<Salesman[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = location.state?.path;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salesmenResponse, areasResponse] = await Promise.all([
          axios.get("http://localhost:4000/api/v1/party/salesman"),
          axios.get("http://localhost:4000/api/v1/area"),
        ]);

        setSalesmen(salesmenResponse.data.parties);
        setAreas(areasResponse.data.areas);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostData({
      ...postData,
      [name]: value,
      type:
        prevPath === "companies"
          ? "3"
          : prevPath === "customers"
          ? "1"
          : prevPath === "salesman"
          ? "2"
          : "",
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setPostData({
      ...postData,
      [name as string]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/v1/party", postData);
      navigate(
        prevPath === "companies"
          ? "/companies"
          : prevPath === "customers"
          ? "/customers"
          : prevPath === "salesman"
          ? "/salesman"
          : "/"
      );
    } catch (err) {
      setError("Failed to create party. Please try again.");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper>
        <PageTitle variant="h4">
          Create{" "}
          {prevPath === "companies"
            ? "Company"
            : prevPath === "customers"
            ? "Customer"
            : prevPath === "salesman"
            ? "Salesman"
            : "Party"}
        </PageTitle>

        <form onSubmit={handleSubmit}>
          <FormGridContainer>
            <FormColumn>
              <TextField
                fullWidth
                label="Full Name"
                name="nameFull"
                value={postData.nameFull}
                onChange={handleInputChange}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Short Name"
                name="nameShort"
                value={postData.nameShort}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                label="Address"
                name="address"
                value={postData.address}
                onChange={handleInputChange}
                required
                multiline
                rows={3}
              />
            </FormColumn>

            <FormColumn>
              <TextField
                fullWidth
                label="Primary Email"
                type="email"
                name="email1"
                value={postData.email1}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                label="Secondary Email"
                type="email"
                name="email2"
                value={postData.email2}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                label="Primary Phone"
                type="tel"
                name="phone1"
                value={postData.phone1}
                onChange={handleInputChange}
                required
              />
            </FormColumn>

            {prevPath === "customers" && (
              <>
                <FormColumn>
                  <Autocomplete
                    freeSolo
                    options={areas.map((area) => area.name)}
                    value={postData.areaName}
                    onChange={(_, newValue) => {
                      setPostData({
                        ...postData,
                        areaName: newValue || "",
                      });
                    }}
                    onInputChange={(_, newInputValue) => {
                      setPostData({
                        ...postData,
                        areaName: newInputValue,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Area" fullWidth required />
                    )}
                  />
                </FormColumn>

                <FormColumn>
                  <FormControl fullWidth>
                    <InputLabel>Salesman</InputLabel>
                    <Select
                      value={postData.salesmanID}
                      name="salesmanID"
                      onChange={handleSelectChange}
                      label="Salesman"
                      required
                    >
                      {salesmen.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.nameFull}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </FormColumn>
              </>
            )}
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

export default CreateParty;
