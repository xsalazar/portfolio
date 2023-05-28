import React from "react";
import {
  ImageListItem,
  Modal,
  Container,
  Stack,
  IconButton,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

interface PortfolioImageProps {
  originalImageId: string;
  imageData: Array<{ id: string; order: number }>;
}

interface PortfolioImageState {
  imageId: string;
  isModalOpen: boolean;
}

export default class PortfolioImage extends React.Component<
  PortfolioImageProps,
  PortfolioImageState
> {
  constructor(props: PortfolioImageProps) {
    super(props);

    this.state = { imageId: props.originalImageId, isModalOpen: false };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleKeyDownMove = this.handleKeyDownMove.bind(this);
  }

  render() {
    const { imageData, originalImageId } = this.props;
    const { imageId, isModalOpen } = this.state;

    const imagePosition = this.getImageIdPosition(imageId, imageData);

    return (
      <div>
        <ImageListItem
          onClick={this.openModal}
          key={uuidv4()}
          sx={{ aspectRatio: "1", p: 1 }}
        >
          <img
            src={`https://backend.xsalazar.com/images/${originalImageId}`} // We always want this to be the original image
            style={{ objectFit: "cover" }}
            height={256}
            alt="description"
          />
        </ImageListItem>

        {/* Modal */}
        <Modal
          open={isModalOpen}
          onClose={this.closeModal}
          onKeyDown={(event) => this.handleKeyDownMove(event, imageId)}
        >
          <Container
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
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              useFlexGap
              spacing={2}
            >
              <IconButton
                onClick={() => this.handleMove(imageId, false)}
                disabled={imagePosition === 0}
              >
                <ArrowBack />
              </IconButton>
              <img
                width="90.5%"
                src={`https://backend.xsalazar.com/images/${imageId}`}
                alt="description"
                style={{ verticalAlign: "middle" }}
              />
              <IconButton
                onClick={() => this.handleMove(imageId, true)}
                disabled={imagePosition === imageData.length - 1}
              >
                <ArrowForward />
              </IconButton>
            </Stack>
          </Container>
        </Modal>
      </div>
    );
  }

  openModal() {
    this.setState({
      isModalOpen: true,
    });
  }

  closeModal() {
    this.setState({
      imageId: this.props.originalImageId, // Reset the modal to "forget" if we navigated away
      isModalOpen: false,
    });
  }

  handleMove(imageId: string, forward: boolean) {
    let { imageData } = this.props;

    const currentImagePosition = this.getImageIdPosition(imageId, imageData);
    const newImagePosition = currentImagePosition + (forward ? 1 : -1);
    const newImage = this.findImageAtPosition(newImagePosition, imageData);

    this.setState({
      imageId: newImage.id,
    });
  }

  handleKeyDownMove(event: React.KeyboardEvent, imageId: string) {
    let { imageData } = this.props;

    const currentImagePosition = this.getImageIdPosition(imageId, imageData);
    if (event.key === "ArrowLeft" && currentImagePosition !== 0) {
      this.handleMove(imageId, false);
    } else if (
      event.key === "ArrowRight" &&
      currentImagePosition !== imageData.length - 1
    ) {
      this.handleMove(imageId, true);
    }
  }

  private getImageIdPosition(
    needleId: string,
    imageData: Array<{ id: string; order: number }>
  ): number {
    return imageData.find(({ id: haystackId }) => needleId === haystackId)!
      .order;
  }

  private findImageAtPosition(
    needlePosition: number,
    imageData: Array<{ id: string; order: number }>
  ): {
    id: string;
    order: number;
  } {
    return imageData.find(
      ({ order: haystackPosition }) => needlePosition === haystackPosition
    )!;
  }
}
