import {
  Comment,
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
  KeyboardArrowUp,
  KeyboardArrowDown,
  DeleteForever,
} from "@mui/icons-material";
import {
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React from "react";

interface AdminImageProps {
  originalDescription: string;
  handleUpdateImageDescription: (id: string, description: string) => void;
  handleMoveImage: (id: string, down: boolean, count?: number) => void;
  handleDeleteImage: (id: string) => void;
  id: string;
  imageData: Array<{
    description: string;
    id: string;
    isDeleted: boolean;
    order: number;
  }>;
  isDeleted: boolean;
  order: number;
}

interface AdminImageState {
  description: string;
  isDialogOpen: boolean;
}

export default class AdminImage extends React.Component<
  AdminImageProps,
  AdminImageState
> {
  constructor(props: AdminImageProps) {
    super(props);
    this.state = {
      isDialogOpen: false,
      description: props.originalDescription,
    };

    this.handleDialogInput = this.handleDialogInput.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleSaveDialog = this.handleSaveDialog.bind(this);
  }

  render() {
    const {
      handleDeleteImage,
      handleMoveImage,
      id,
      imageData,
      isDeleted,
      order,
    } = this.props;

    const { description, isDialogOpen } = this.state;

    const hasDescription = description !== "";

    return (
      <div>
        <ImageListItem key={uuidv4()} sx={{ aspectRatio: "1", minHeight: 256 }}>
          <img
            loading="lazy"
            src={`https://backend.xsalazar.com/images/${id}`}
            style={{ objectFit: "cover", opacity: isDeleted ? 0.6 : 1 }}
            height={256}
            width={256}
            alt={description}
          />
          <ImageListItemBar
            actionIcon={
              <div>
                {/* Add description */}
                <IconButton
                  sx={{
                    color: hasDescription
                      ? "rgba(186, 104, 200, 0.54)"
                      : "rgba(255, 255, 255, 0.54)",
                  }}
                  onClick={this.handleDialogOpen}
                >
                  <Comment />
                </IconButton>

                {/* Jump up */}
                <IconButton
                  sx={{
                    color: "rgba(255, 255, 255, 0.54)",
                  }}
                  disabled={order === 0}
                  onClick={() => handleMoveImage(id, false, 3)}
                >
                  <KeyboardDoubleArrowUp />
                </IconButton>

                {/* Move up */}
                <IconButton
                  sx={{
                    color: "rgba(255, 255, 255, 0.54)",
                  }}
                  disabled={order === 0}
                  onClick={() => handleMoveImage(id, false)}
                >
                  <KeyboardArrowUp />
                </IconButton>

                {/* Move down */}
                <IconButton
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                  disabled={order === imageData.length - 1}
                  onClick={() => handleMoveImage(id, true)}
                >
                  <KeyboardArrowDown />
                </IconButton>

                {/* Jump down */}
                <IconButton
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                  disabled={order === imageData.length - 1}
                  onClick={() => handleMoveImage(id, true, 3)}
                >
                  <KeyboardDoubleArrowDown />
                </IconButton>

                {/* Delete */}
                <IconButton
                  sx={{
                    color: isDeleted
                      ? "rgba(255, 50, 0, 0.54)"
                      : "rgba(255, 255, 255, 0.54)",
                  }}
                  onClick={() => handleDeleteImage(id)}
                >
                  <DeleteForever />
                </IconButton>
              </div>
            }
          />
        </ImageListItem>

        <Dialog open={isDialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>Description</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the description that will be displayed for this specific
              photo.
            </DialogContentText>
            <TextField
              fullWidth
              id="name"
              onChange={this.handleDialogInput}
              margin="dense"
              multiline
              rows={3}
              type="text"
              value={description}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose}>Cancel</Button>
            <Button
              onClick={() => this.handleSaveDialog(id, description)}
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleDialogOpen() {
    this.setState({ isDialogOpen: true });
  }

  handleDialogClose() {
    this.setState({ isDialogOpen: false });
  }

  handleDialogInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      description: event.target.value,
    });
  }

  handleSaveDialog(id: string, description: string) {
    this.props.handleUpdateImageDescription(id, description);
    this.handleDialogClose();
  }
}
