import {
  Box,
  Container,
  ImageList,
  ImageListItem,
  Modal,
  Typography,
} from "@mui/material";
import React from "react";
import { v4 as uuidv4 } from "uuid";

interface PortfolioProps {}

interface PortfolioState {
  imageURLs: Array<string>;
  isModalOpen: boolean;
  selectedImage: string;
}

export default class Body extends React.Component<
  PortfolioProps,
  PortfolioState
> {
  constructor(props: PortfolioProps) {
    super(props);

    this.state = {
      imageURLs: [],
      isModalOpen: false,
      selectedImage: "",
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount(): void {
    this.setState({
      imageURLs: [
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
        `https://upload.wikimedia.org/wikipedia/commons/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg`,
      ],
    });
  }

  render() {
    const { imageURLs, isModalOpen, selectedImage } = this.state;

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
          <ImageList cols={3} gap={16} rowHeight={256} sx={{ height: "100%" }}>
            {imageURLs.map((imageURL: string) => {
              return (
                <ImageListItem
                  onClick={() => this.openModal(imageURL)}
                  key={uuidv4()}
                >
                  <img
                    src={imageURL}
                    style={{ objectFit: "cover" }}
                    height={256}
                    alt="description"
                  />
                </ImageListItem>
              );
            })}
          </ImageList>

          {/* Modal */}
          <Modal open={isModalOpen} onClose={this.closeModal}>
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70%",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <img width="100%" src={selectedImage} alt="description" />
            </Box>
          </Modal>
        </Container>
      </div>
    );
  }

  openModal(imageURL: string) {
    this.setState({
      isModalOpen: true,
      selectedImage: imageURL,
    });
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
    });
  }
}
