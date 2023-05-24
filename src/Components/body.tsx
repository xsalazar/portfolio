import { v4 as uuidv4 } from "uuid";
import { Container, ImageList, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import PortfolioImage from "./image";

interface PortfolioProps {}

interface PortfolioState {
  imageData: Array<{ id: string; order: number }>;
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
      <div style={{ height: "calc(100vh - 200px)" }}>
        <Container
          maxWidth="md"
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h3" sx={{ marginRight: "auto" }}>
            Xavier Salazar
          </Typography>
          <Typography variant="caption" sx={{ marginRight: "auto" }}>
            Digital and film photography
          </Typography>
          <ImageList cols={3} gap={16} sx={{ height: "100%", width: "100%" }}>
            {imageData.map(({ id }) => {
              return (
                <PortfolioImage
                  originalImageId={id}
                  imageData={imageData}
                  key={uuidv4()}
                />
              );
            })}
          </ImageList>
        </Container>
      </div>
    );
  }
}
