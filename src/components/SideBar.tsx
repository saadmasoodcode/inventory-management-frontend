import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SummarizeIcon from "@mui/icons-material/Summarize";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SideBarStyled = styled("div")`
  background-color: #eee;
  width: 250px;
  height: calc(100vh - 60px);
  padding: 16px;
  color: black;
  transition: width 0.5s ease;
  border-right: 1px solid silver;
`;

const ListItemStyled = styled(ListItemButton)`
  margin-bottom: 5px;
`;

const SideBar = () => {
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [open, setOpen] = useState(false);
  const [openReports, setOpenReports] = useState<boolean>(false);

  useEffect(() => {
    const storedIndex = localStorage.getItem("selectedSidebarIndex");
    if (storedIndex !== null && !isNaN(Number(storedIndex))) {
      setSelectedIndex(Number(storedIndex));
    }
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickOnReports = () => {
    setOpenReports(!openReports);
  };

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    path: string
  ) => {
    setSelectedIndex(index);
    localStorage.setItem("selectedSidebarIndex", index.toString());
    navigate(path);
  };

  return (
    <SideBarStyled>
      <ListItemStyled
        selected={selectedIndex === 0}
        onClick={(event) => handleListItemClick(event, 0, "/dashboard")}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemStyled>

      <ListItemStyled
        selected={selectedIndex === 5}
        onClick={(event) => handleListItemClick(event, 5, "/purchase-item")}
      >
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Purchase Item" />
      </ListItemStyled>

      <ListItemStyled
        selected={selectedIndex === 6}
        onClick={(event) => handleListItemClick(event, 6, "/sale-item")}
      >
        <ListItemIcon>
          <MonetizationOnIcon />
        </ListItemIcon>
        <ListItemText primary="Sale Item" />
      </ListItemStyled>

      <ListItemButton onClick={handleClickOnReports}>
        <ListItemIcon>
          <SummarizeIcon />
        </ListItemIcon>
        <ListItemText primary="Repots" />
        {openReports ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openReports} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemStyled
            sx={{ pl: 4 }}
            selected={selectedIndex === 7}
            onClick={(event) =>
              handleListItemClick(event, 7, "/item-invoices-report")
            }
          >
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Item Invoices" />
          </ListItemStyled>
        </List>
      </Collapse>

      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Setup" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemStyled
            sx={{ pl: 4 }}
            selected={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1, "/companies")}
          >
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            <ListItemText primary="Company" />
          </ListItemStyled>

          <ListItemStyled
            sx={{ pl: 4 }}
            selected={selectedIndex === 2}
            onClick={(event) => handleListItemClick(event, 2, "/customers")}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Customer" />
          </ListItemStyled>

          <ListItemStyled
            sx={{ pl: 4 }}
            selected={selectedIndex === 3}
            onClick={(event) => handleListItemClick(event, 3, "/salesman")}
          >
            <ListItemIcon>
              <SupervisedUserCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Salesman" />
          </ListItemStyled>

          <ListItemStyled
            sx={{ pl: 4 }}
            selected={selectedIndex === 4}
            onClick={(event) => handleListItemClick(event, 4, "/item")}
          >
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Item" />
          </ListItemStyled>
        </List>
      </Collapse>
    </SideBarStyled>
  );
};

export default SideBar;
