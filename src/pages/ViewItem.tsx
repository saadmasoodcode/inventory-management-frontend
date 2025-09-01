import { Container, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";

const DetailContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const DetailPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: theme.spacing(4),
  marginTop: theme.spacing(2),
}));

const DetailSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

const DetailTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

const DetailValue = styled(Typography)({
  fontWeight: 400,
});

const LoadingText = styled(Typography)({
  textAlign: "center",
  margin: "2rem",
});

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  textAlign: "center",
}));

interface ItemData {
  companyID: string;
  nameFull: string;
  nameShort: string;
  id: string;
  purchasePrice: number;
  salePrice: number;
  unitsInCarton: number;
  createdAt: string;
  updatedAt: string;
}

const ViewItem = () => {
  const [itemData, setItemData] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/v1/item/${id}`
        );
        setItemData(response.data.item);
        console.log(response);
      } catch (err) {
        setError("Failed to fetch item details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [id]);

  if (loading) return <LoadingText>Loading...</LoadingText>;
  if (error) return <LoadingText>{error}</LoadingText>;
  if (!itemData) return <LoadingText>No data found</LoadingText>;

  return (
    <DetailContainer maxWidth="lg">
      <PageTitle variant="h4">Item Details</PageTitle>

      <DetailPaper elevation={3}>
        <DetailSection>
          <div>
            <DetailTitle variant="subtitle1">ID</DetailTitle>
            <DetailValue>{itemData.id || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Full Name</DetailTitle>
            <DetailValue>{itemData.nameFull || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Short Name</DetailTitle>
            <DetailValue>{itemData.nameShort || "-"}</DetailValue>
          </div>
          <div>
            <DetailTitle variant="subtitle1">Company ID</DetailTitle>
            <DetailValue>{itemData.companyID || "-"}</DetailValue>
          </div>
        </DetailSection>

        <DetailSection>
          <div>
            <DetailTitle variant="subtitle1">Purchase Price</DetailTitle>
            <DetailValue>{itemData.purchasePrice || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Sale Price</DetailTitle>
            <DetailValue>{itemData.salePrice || "-"}</DetailValue>
          </div>
          <div>
            <DetailTitle variant="subtitle1">Units in Carton</DetailTitle>
            <DetailValue>{itemData.unitsInCarton || "-"}</DetailValue>
          </div>
        </DetailSection>

        <DetailSection>
          <div>
            <DetailTitle variant="subtitle1">Created At</DetailTitle>
            <DetailValue>
              {new Date(itemData.createdAt).toLocaleString()}
            </DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Updated At</DetailTitle>
            <DetailValue>
              {new Date(itemData.updatedAt).toLocaleString()}
            </DetailValue>
          </div>
        </DetailSection>
      </DetailPaper>
    </DetailContainer>
  );
};

export default ViewItem;
