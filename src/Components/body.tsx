import { v4 as uuidv4 } from "uuid";
import { Box, Container, Typography } from "@mui/material";
import { imageListItemClasses } from "@mui/material/ImageListItem";
import axios from "axios";
import React from "react";
import PortfolioImage from "./image";

interface PortfolioProps {}

interface PortfolioState {
  imageData: Array<{ id: string; order: number; description: string }>;
}

export default class Body extends React.Component<
  PortfolioProps,
  PortfolioState
> {
  constructor(props: PortfolioProps) {
    super(props);

    this.state = {
      imageData: [],
    };
  }

  async componentDidMount(): Promise<void> {
    const result = (
      await axios.get(`https://backend.xsalazar.com/`, {
        params: { allImages: true },
      })
    ).data;

    this.setState({
      imageData: result.data,
    });
  }

  render() {
    const { imageData } = this.state;

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
          overflowY: "scroll",
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
}
