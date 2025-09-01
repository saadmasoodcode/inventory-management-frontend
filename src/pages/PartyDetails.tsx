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


interface PartyData {
  id: string;
  nameFull: string;
  nameShort: string;
  address: string;
  area?: {
    name: string;
  };
  areaID: string;
  phone1: string;
  phone2: string | null;
  phone3: string | null;
  email1: string;
  email2: string;
  email3: string | null;
  type: string;
  createdAt: string;
  updatedAt: string;
}

const PartyDetails = () => {
  const [partyData, setPartyData] = useState<PartyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/v1/party/${id}`
        );
        setPartyData(response.data.party);
      } catch (err) {
        setError("Failed to fetch party details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartyData();
  }, [id]);

  const getPartyType = (type: string) => {
    switch (type) {
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

  if (loading) return <LoadingText>Loading...</LoadingText>;
  if (error) return <LoadingText>{error}</LoadingText>;
  if (!partyData) return <LoadingText>No data found</LoadingText>;

  return (
    <DetailContainer maxWidth="lg">
      <PageTitle variant="h4">{getPartyType(partyData.type)} Details</PageTitle>

      <DetailPaper elevation={3}>
        <DetailSection>
          <div>
            <DetailTitle variant="subtitle1">ID</DetailTitle>
            <DetailValue>{partyData.id || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Full Name</DetailTitle>
            <DetailValue>{partyData.nameFull || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Short Name</DetailTitle>
            <DetailValue>{partyData.nameShort || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Address</DetailTitle>
            <DetailValue>{partyData.address || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Area Name</DetailTitle>
            <DetailValue>{partyData.area?.name || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Area ID</DetailTitle>
            <DetailValue>{partyData.areaID || "-"}</DetailValue>
          </div>
        </DetailSection>

        <DetailSection>
          <div>
            <DetailTitle variant="subtitle1">Phone No. 1</DetailTitle>
            <DetailValue>{partyData.phone1 || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Phone No. 2</DetailTitle>
            <DetailValue>{partyData.phone2 || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Phone No. 3</DetailTitle>
            <DetailValue>{partyData.phone3 || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Email 1</DetailTitle>
            <DetailValue>{partyData.email1 || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Email 2</DetailTitle>
            <DetailValue>{partyData.email2 || "-"}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Email 3</DetailTitle>
            <DetailValue>{partyData.email3 || "-"}</DetailValue>
          </div>
        </DetailSection>

        <DetailSection>
          <div>
            <DetailTitle variant="subtitle1">Type</DetailTitle>
            <DetailValue>{getPartyType(partyData.type)}</DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Created At</DetailTitle>
            <DetailValue>
              {new Date(partyData.createdAt).toLocaleString()}
            </DetailValue>
          </div>

          <div>
            <DetailTitle variant="subtitle1">Updated At</DetailTitle>
            <DetailValue>
              {new Date(partyData.updatedAt).toLocaleString()}
            </DetailValue>
          </div>
        </DetailSection>
      </DetailPaper>
    </DetailContainer>
  );
};

export default PartyDetails;
