import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CompanyList = () => {
  const [companies, setCompanies] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getAllCompanies = async function () {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/party/company"
        );
        console.log(response);

        setCompanies(response.data.parties);
      } catch (error) {
        console.log(error);
      }
    };

    getAllCompanies();
  }, []);

  function handleDelete(itemID: any) {
    const confirm = window.confirm("Do you want to delete?");
    if (confirm) {
      try {
        axios.delete(`http://localhost:4000/api/v1/party/${itemID}`);
        navigate("/companies");
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone No</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.nameFull}</TableCell>
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
                  <IconButton
                    onClick={() => handleDelete(item.id)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CompanyList;
