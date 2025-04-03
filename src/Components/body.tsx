import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { imageListItemClasses } from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PortfolioImage from "./image";

export default function Body() {
  const [imageData, setImageData] = useState<
    Array<{
      description: string;
      id: string;
      isDeleted: boolean;
      order: number;
    }>
  >([]);

  const fetchData = useCallback(async () => {
    const result = (
      await axios.get(`https://backend.xsalazar.com/`, {
        params: { allImages: true },
      })
    ).data;

    setImageData(
      result.data.map(
        (x: { id: string; order: number; description: string }) => {
          return { ...x, isDeleted: false, description: x.description ?? "" };
        }
      )
    );
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container
      maxWidth="md"
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
        justifyContent: "center",
        mt: 1,
        overflowY: "auto",
      }}
    >
      <Typography variant="h3" sx={{ marginRight: "auto", pl: 1 }}>
        Xavier Salazar
      </Typography>
      <Typography variant="caption" sx={{ marginRight: "auto", pl: 1 }}>
        Digital and film photography
      </Typography>
      <Box
        sx={{
          mt: 2,
          flexGrow: "1",
          overflowY: "scroll",
          justifyItems: "center",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(3, 1fr)",
            },
            [`& .${imageListItemClasses.root}`]: {
              display: "flex",
            },
          }}
        >
          {imageData.map(({ id, description }) => {
            return (
              <PortfolioImage
                originalImageId={id}
                originalDescription={description}
                imageData={imageData}
                key={uuidv4()}
              />
            );
          })}
        </Box>
      </Box>
    </Container>
  );
}
