import { Container, ImageList, ImageListItem, Typography } from "@mui/material";
import Image from "mui-image";
import React from "react";

export default class Body extends React.Component {
  render() {
    return (
      <div style={{ height: "calc(100vh - 200px)" }}>
        <Container
          maxWidth="lg"
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h2" sx={{ marginRight: "auto" }}>
            Xavier Salazar
          </Typography>
          <Typography variant="caption" sx={{ marginRight: "auto" }}>
            Digital and film portfolio
          </Typography>
          <ImageList cols={1} gap={32} sx={{ height: "100%" }}>
            <ImageListItem>
              <Image
                src={`https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`}
              />
            </ImageListItem>

            <ImageListItem>
              <Image
                src={`https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`}
              />
            </ImageListItem>

            <ImageListItem>
              <Image
                src={`https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`}
              />
            </ImageListItem>

            <ImageListItem>
              <Image
                src={`https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`}
              />
            </ImageListItem>
          </ImageList>
        </Container>
      </div>
    );
  }
}
