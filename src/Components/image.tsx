import { ArrowBack, ArrowForward, Comment } from "@mui/icons-material";
import Backdrop from "@mui/material/Backdrop";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import ImageListItem from "@mui/material/ImageListItem";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function PortfolioImage({
  imageData,
  originalDescription,
  originalImageId,
}: {
  imageData: Array<{ id: string; order: number; description: string }>;
  originalDescription: string;
  originalImageId: string;
}) {
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [imageId, setImageId] = useState(originalImageId);
  const [description, setDescription] = useState(originalDescription);

  const openDesktopModal = () => {
    setIsDesktopModalOpen(true);
  };

  const closeDesktopModal = () => {
    setIsDesktopModalOpen(false);
    setImageId(originalImageId);
  };

  const openMobileModal = () => {
    setIsMobileModalOpen(true);
  };

  const closeMobileModal = () => {
    setIsMobileModalOpen(false);
  };

  const handleMove = (imageId: string, forward: boolean) => {
    const currentImagePosition = getImageIdPosition(imageId, imageData);
    const newImagePosition = currentImagePosition + (forward ? 1 : -1);
    const newImage = findImageAtPosition(newImagePosition, imageData);

    setDescription(newImage.description);
    setImageId(newImage.id);
  };

  const handleKeyDownMove = (event: React.KeyboardEvent, imageId: string) => {
    const currentImagePosition = getImageIdPosition(imageId, imageData);

    if (event.key === "ArrowLeft" && currentImagePosition !== 0) {
      handleMove(imageId, false);
    } else if (
      event.key === "ArrowRight" &&
      currentImagePosition !== imageData.length - 1
    ) {
      handleMove(imageId, true);
    }
  };

  const getImageIdPosition = (
    needleId: string,
    imageData: Array<{ id: string; order: number }>
  ): number => {
    return imageData.find(({ id: haystackId }) => needleId === haystackId)!
      .order;
  };

  const findImageAtPosition = (
    needlePosition: number,
    imageData: Array<{ id: string; order: number; description: string }>
  ): {
    description: string;
    id: string;
    order: number;
  } => {
    return imageData.find(
      ({ order: haystackPosition }) => needlePosition === haystackPosition
    )!;
  };
  const imagePosition = getImageIdPosition(imageId, imageData);
  const isMobile = window.innerWidth < 600; // Primitive, but it works for what I need
  const hasDescription = description !== "";

  return (
    <div>
      <ImageListItem
        key={uuidv4()}
        sx={{ aspectRatio: "1", p: 1, position: "relative", height: 256 }}
      >
        <Backdrop
          sx={{
            m: 1,
            position: "absolute",
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={isMobileModalOpen}
          onClick={closeMobileModal}
        >
          <Typography variant="caption">{description}</Typography>
        </Backdrop>
        <img
          onClick={() =>
            isMobile
              ? hasDescription
                ? openMobileModal()
                : null
              : openDesktopModal()
          }
          src={`https://backend.xsalazar.com/images/${originalImageId}`} // We always want this to be the original image
          style={{ objectFit: "cover" }}
          height={256}
          width={256}
          alt={description}
        />
        {isMobile && hasDescription && !isMobileModalOpen ? (
          <div
            style={{ position: "absolute", bottom: 15, right: 15 }}
            onClick={() =>
              isMobile
                ? hasDescription
                  ? openMobileModal()
                  : null
                : openDesktopModal()
            }
          >
            <IconButton size="small">
              <Comment sx={{ color: "#FFFFFFAA" }} />
            </IconButton>
          </div>
        ) : null}
      </ImageListItem>

      {/* Desktop Modal */}
      <Modal
        open={isDesktopModalOpen}
        onClose={closeDesktopModal}
        onKeyDown={(event) => handleKeyDownMove(event, imageId)}
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
              onClick={() => handleMove(imageId, false)}
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
              onClick={() => handleMove(imageId, true)}
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
