import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  type: string;
}

const UpdateCompany = () => {
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
    type: "",
  });

  const [salesmen, setSalesmen] = useState<Salesman[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [partyResponse, areasResponse, salesmenResponse] =
          await Promise.all([
            axios.get(`http://localhost:4000/api/v1/party/${id}`),
            axios.get("http://localhost:4000/api/v1/area"),
            axios.get("http://localhost:4000/api/v1/party/salesman"),
          ]);

        setPostData(partyResponse.data.party);
        setAreas(areasResponse.data.areas);
        setSalesmen(salesmenResponse.data.parties);
      } catch (err) {
        setApiError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/party/${id}`,
        postData
      );

      if (response.status === 200) {
        setSuccessMessage(`${getPartyType()} updated successfully!`);
        setTimeout(() => {
          navigate(
            postData.type === "1"
              ? "/customers"
              : postData.type === "2"
              ? "/salesman"
              : postData.type === "3"
              ? "/companies"
              : "/"
          );
        }, 1500);
      }
    } catch (err: any) {
      console.error("Update error:", err.response?.data);
      setApiError(
        err.response?.data?.message ||
          "Failed to update. Please check your data and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPartyType = () => {
    switch (postData.type) {
      case "1":
        return "Customer";
      case "2":
        return "Salesman";
      case "3":
        return "Company";
      default:
        return "Party";
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <StyledContainer maxWidth="md">
      {/* Success/Error notifications */}
      <Snackbar
        open={!!apiError}
        autoHideDuration={6000}
        onClose={() => setApiError("")}
      >
        <Alert severity="error" onClose={() => setApiError("")}>
          {apiError}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert severity="success" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>

      <StyledPaper elevation={3}>
        <PageTitle variant="h4">Update {getPartyType()}</PageTitle>

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

            {postData.type === "1" && (
              <>
                <FormColumn>
                  <FormControl fullWidth>
                    <InputLabel>Area</InputLabel>
                    <Select
                      value={postData.areaID}
                      name="areaID"
                      onChange={handleSelectChange}
                      label="Area"
                      required
                    >
                      {areas.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </SubmitButton>
          </ActionButtons>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
};

export default UpdateCompany;
