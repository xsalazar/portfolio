import {
  Container,
  ImageList,
  ImageListItem,
  Modal,
  Typography,
} from "@mui/material";
import axios from "axios";
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

  async componentDidMount(): Promise<void> {
    const result = await axios.get(`https://backend.xsalazar.com/`, {
      params: { allImages: true },
    });

    this.setState({
      imageURLs: result.data.images,
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
          <ImageList cols={3} gap={16} sx={{ height: "100%", width: "100%" }}>
            {imageURLs.map((imageURL: string) => {
              return (
                <ImageListItem
                  onClick={() => this.openModal(imageURL)}
                  key={uuidv4()}
                  sx={{ aspectRatio: "1" }}
                >
                  <img
                    src={`https://backend.xsalazar.com/?image=${imageURL}`}
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
            <Container
              maxWidth="lg"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 2,
              }}
            >
              <img
                width="100%"
                src={`https://backend.xsalazar.com/?image=${selectedImage}`}
                alt="description"
                style={{ verticalAlign: "middle" }}
              />
            </Container>
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
