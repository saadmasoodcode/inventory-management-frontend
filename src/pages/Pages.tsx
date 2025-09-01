import { Route, Routes, useLocation } from "react-router-dom";
import Companies from "./Companies";
import LoginPage from "./LoginPage";
import PartyDetails from "./PartyDetails";
import CreateParty from "./CreateParty";
import UpdateCompany from "./UpdateCompany";
import NavBar from "../components/NavBar";
import { useState } from "react";
import SideBar from "../components/SideBar";
import { styled } from "@mui/material";
import Dashboard from "./Dashboard";
import Customers from "./Customers";
import Salesman from "./Salesman";
import Item from "./Item";
import ViewItem from "./ViewItem";
import CreateItem from "./CreateItem";
import UpdateItem from "./UpdateItem";
import PurchaseItem from "./PurchaseItem";
import CreatePurchaseInvoice from "./CreatePurchaseInvoice";
import SaleItem from "./SaleItem";
import CreateSaleInvoice from "./CreateSaleInvoice";
import ItemInvoicesReport from "./ItemInvoicesReport";

const Container = styled("div")`
  display: flex;
`;

const RoutesContainer = styled("div")`
  flex-grow: 1;
  // padding: 20px;
  background-color: #eee;
  height: cal(100vh - 60px);
`;

const Pages = () => {
  const [open, setOpen] = useState<boolean>(true);
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  return (
    <div>
      {!isLoginPage && <NavBar open={open} setOpen={setOpen} />}
      <Container>
        {!isLoginPage && open && <SideBar />}
        <RoutesContainer>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/company/:id" element={<PartyDetails />} />
            <Route path="/create-company" element={<CreateParty />} />
            <Route path="/create-customer" element={<CreateParty />} />
            <Route path="/create-salesman" element={<CreateParty />} />
            <Route path="/update-company/:id" element={<UpdateCompany />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/salesman" element={<Salesman />} />
            <Route path="/item" element={<Item />} />
            <Route path="/item/:id" element={<ViewItem />} />
            <Route path="/create-item" element={<CreateItem />} />
            <Route path="/update-item/:id" element={<UpdateItem />} />
            <Route path="/purchase-item" element={<PurchaseItem />} />
            <Route
              path="/create-purchase-invoice"
              element={<CreatePurchaseInvoice />}
            />
            <Route path="/sale-item" element={<SaleItem />} />
            <Route
              path="/create-sale-invoice"
              element={<CreateSaleInvoice />}
            />
            <Route
              path="/item-invoices-report"
              element={<ItemInvoicesReport />}
            />
          </Routes>
        </RoutesContainer>
      </Container>
    </div>
  );
};

export default Pages;
