import axios from "axios";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Button,
  CircularProgress,
  Container,
  IconButton,
  styled,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledHeading = styled("div")`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Customers = () => {
  const [customers, setCustomers] = useState<any>();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  console.log(path);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/party/customer"
        );
        setCustomers(response.data.parties);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getCustomers();
  }, []);

  return (
    <Container>
      <StyledHeading>
        <h1>Customer</h1>
        <Button
          variant="contained"
          onClick={() => {
            if (path === "companies") {
              navigate(`/create-company`, { state: { path: path } });
            } else if (path === "customers") {
              navigate(`/create-customer`, { state: { path: path } });
            } else if (path === "salesman") {
              navigate(`/create-salesman`, { state: { path: path } });
            }
          }}
        >
          Create
        </Button>
      </StyledHeading>
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
            {!customers ? (
              <CircularProgress />
            ) : (
              customers.map((item: any) => {
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

export default Customers;
