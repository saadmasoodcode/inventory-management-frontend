import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, styled } from "@mui/material";

const NavbarContainer = styled("div")`
  display: flex;
  align-items: center;
  height: 60px;
  background-color: #eee;
  padding: 0 16px;
  border-bottom: 1px solid silver;
`;

interface myProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar = ({ open, setOpen }: myProps) => {
  return (
    <div>
      <NavbarContainer>
        <IconButton onClick={() => setOpen(!open)}>
          <MenuIcon />
        </IconButton>
        <h3>Inventory Management</h3>
      </NavbarContainer>
    </div>
  );
};

export default NavBar;
