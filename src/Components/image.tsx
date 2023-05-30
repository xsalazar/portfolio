import React from "react";
import {
  ImageListItem,
  Modal,
  Container,
  Stack,
  IconButton,
  Typography,
  Backdrop,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { ArrowBack, ArrowForward, Comment } from "@mui/icons-material";

interface PortfolioImageProps {
  imageData: Array<{ id: string; order: number; description: string }>;
  originalDescription: string;
  originalImageId: string;
}

interface PortfolioImageState {
  description: string;
  imageId: string;
  isDesktopModalOpen: boolean;
  isMobileModalOpen: boolean;
}

export default class PortfolioImage extends React.Component<
  PortfolioImageProps,
  PortfolioImageState
> {
  constructor(props: PortfolioImageProps) {
    super(props);

    this.state = {
      description: props.originalDescription,
      imageId: props.originalImageId,
      isDesktopModalOpen: false,
      isMobileModalOpen: false,
    };

    this.openDesktopModal = this.openDesktopModal.bind(this);
    this.closeDesktopModal = this.closeDesktopModal.bind(this);
    this.openMobileModal = this.openMobileModal.bind(this);
    this.closeMobileModal = this.closeMobileModal.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleKeyDownMove = this.handleKeyDownMove.bind(this);
  }

  render() {
    const { imageData, originalImageId } = this.props;
    const { description, imageId, isDesktopModalOpen, isMobileModalOpen } =
      this.state;

    const imagePosition = this.getImageIdPosition(imageId, imageData);
    const isMobile = window.innerWidth < 600; // Primitive, but it works for what I need
    const hasDescription = description !== "";

    return (
      <div>
        <ImageListItem
          key={uuidv4()}
          sx={{ aspectRatio: "1", p: 1, position: "relative" }}
        >
          <Backdrop
            sx={{
              m: 1,
              position: "absolute",
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={isMobileModalOpen}
            onClick={this.closeMobileModal}
          >
            <Typography variant="caption">{description}</Typography>
          </Backdrop>
          <img
            onClick={() =>
              isMobile
                ? hasDescription
                  ? this.openMobileModal()
                  : null
                : this.openDesktopModal()
            }
            src={`https://backend.xsalazar.com/images/${originalImageId}`} // We always want this to be the original image
            style={{ objectFit: "cover" }}
            height={256}
            alt={description}
          />
          {isMobile && hasDescription && !isMobileModalOpen ? (
            <div
              style={{ position: "absolute", bottom: 10, right: 15 }}
              onClick={() =>
                isMobile
                  ? hasDescription
                    ? this.openMobileModal()
                    : null
                  : this.openDesktopModal()
              }
            >
              <Comment />
            </div>
          ) : null}
        </ImageListItem>

        {/* Desktop Modal */}
        <Modal
          open={isDesktopModalOpen}
          onClose={this.closeDesktopModal}
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
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              {/* Back button */}
              <IconButton
                onClick={() => this.handleMove(imageId, false)}
                disabled={imagePosition === 0}
              >
                <ArrowBack />
              </IconButton>
              {/* Image and description */}
              <Stack
                direction="column"
                justifyContent="center"
                alignContent="center"
                spacing={2}
              >
                <img
                  width="100%"
                  src={`https://backend.xsalazar.com/images/${imageId}`}
                  alt={description}
                  style={{ verticalAlign: "middle" }}
                />
                <Typography variant="caption">{description}</Typography>
              </Stack>
              {/* Forward button */}
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

  openDesktopModal() {
    this.setState({
      isDesktopModalOpen: true,
    });
  }

  closeDesktopModal() {
    this.setState({
      imageId: this.props.originalImageId, // Reset the modal to "forget" if we navigated away
      isDesktopModalOpen: false,
    });
  }

  openMobileModal() {
    this.setState({ isMobileModalOpen: true });
  }

  closeMobileModal() {
    this.setState({ isMobileModalOpen: false });
  }

  handleMove(imageId: string, forward: boolean) {
    let { imageData } = this.props;

    const currentImagePosition = this.getImageIdPosition(imageId, imageData);
    const newImagePosition = currentImagePosition + (forward ? 1 : -1);
    const newImage = this.findImageAtPosition(newImagePosition, imageData);

    this.setState({
      description: newImage.description,
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
    imageData: Array<{ id: string; order: number; description: string }>
  ): {
    description: string;
    id: string;
    order: number;
  } {
    return imageData.find(
      ({ order: haystackPosition }) => needlePosition === haystackPosition
    )!;
  }
}
