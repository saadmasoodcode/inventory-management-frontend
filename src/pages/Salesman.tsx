import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const StyledHeading = styled("div")`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledSearchSelect = styled("div")`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 50%;
`;

const StyledSearch = styled("div")`
  position: relative;
  display: flex;
  gap: 10px;
  width: 300px;
`;

const StyledSearchIcon = styled(SearchIcon)`
  position: absolute;
  top: 30%;
  right: 5%;
`;

const StyledSearchInput = styled(TextField)`
  width: 100%;
  text-align: center;
  background-color: white;

  input {
    padding-right: 30%;
  }
`;

const StyledSelect = styled(Select)`
  width: 150px;
  background-color: white;
`;

const Salesman = () => {
  const [salesmans, setSalesmans] = useState<any>();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/")[1];
  const [search, setSearch] = useState<string>("");
  const [searchBy, setSearchBy] = useState<string>("byName");

  useEffect(() => {
    const getSalesmans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/party/salesman"
        );
        setSalesmans(response.data.parties);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getSalesmans();
  }, []);

  const onClickButton = () => {
    if (path === "companies") {
      navigate(`/create-company`, { state: { path: path } });
    } else if (path === "customer") {
      navigate(`/create-customer`, { state: { path: path } });
    } else if (path === "salesman") {
      navigate(`/create-salesman`, { state: { path: path } });
    }
  };

  let filteredSalesmans = salesmans;

  if (searchBy === "byName") {
    filteredSalesmans = search
      ? salesmans.filter((item: any) =>
          item.nameFull.toLowerCase().includes(search.toLowerCase())
        )
      : salesmans;
  } else if (searchBy === "byAddress") {
    filteredSalesmans = search
      ? salesmans.filter((item: any) =>
          item.address.toLowerCase().includes(search.toLowerCase())
        )
      : salesmans;
  } else {
    filteredSalesmans = search
      ? salesmans.filter((item: any) =>
          item.id.toLowerCase().includes(search.toLowerCase())
        )
      : salesmans;
  }

  return (
    <Container>
      <StyledHeading>
        <h1>Salesman</h1>
        <Button variant="contained" onClick={onClickButton}>
          Create
        </Button>
      </StyledHeading>

      <StyledSearchSelect>
        <StyledSearch>
          <StyledSearchInput
            label="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
          />
          <StyledSearchIcon onClick={() => console.log("hello")} />
        </StyledSearch>

        <FormControl>
          <InputLabel>Search By</InputLabel>

          <StyledSelect
            value={searchBy}
            onChange={(e: any) => setSearchBy(e.target.value)}
            variant="outlined"
            label="Search by"
          >
            <MenuItem value="byName">Name</MenuItem>
            <MenuItem value="byAddress">Address</MenuItem>
            <MenuItem value="byID">ID</MenuItem>
          </StyledSelect>
        </FormControl>
      </StyledSearchSelect>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!filteredSalesmans ? (
              <CircularProgress />
            ) : (
              filteredSalesmans.map((item: any) => {
                return (
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.nameFull}
                    </TableCell>
                    <TableCell>{item.email1}</TableCell>
                    <TableCell>{item.phone1}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          navigate(`/company/${item.id}`);
                        }}
                        size="small"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          navigate(`/update-company/${item.id}`);
                        }}
                        size="small"
                        color="success"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Salesman;
