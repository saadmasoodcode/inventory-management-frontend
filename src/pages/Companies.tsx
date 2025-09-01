import { Button, Container, styled } from "@mui/material";
import CompanyList from "../components/CompanyList";
import { useLocation, useNavigate } from "react-router-dom";

const StyledContainer = styled(Container)`
  background: #eee;
`;

const StyledDiv = styled("div")`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 0;
  margin: 20px 0;
  height: 38px;
`;

const Companies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  return (
    <>
      <StyledContainer>
        <StyledDiv>
          <h1>Company</h1>
          <Button
            onClick={() => {
              if (path === "companies") {
                navigate(`/create-company`, { state: { path: path } });
              } else if (path === "customer") {
                navigate(`/create-customer`);
              } else if (path === "salesman") {
                navigate(`/create-salesman`);
              }
            }}
            variant="contained"
          >
            Create
          </Button>
        </StyledDiv>
        <CompanyList />
      </StyledContainer>
    </>
  );
};

export default Companies;
