import {
  Comment,
  DeleteForever,
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function AdminImage({
  originalDescription,
  handleUpdateImageDescription,
  handleMoveImage,
  handleDeleteImage,
  id,
  imageData,
  isDeleted,
  order,
}: {
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
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [description, setDescription] = useState(originalDescription);

  const hasDescription = description !== "";

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleSaveDialog = (id: string, description: string) => {
    handleUpdateImageDescription(id, description);
    handleDialogClose();
  };

  return (
    <div>
      <ImageListItem key={uuidv4()} sx={{ aspectRatio: "1", minHeight: 256 }}>
        <img
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
                onClick={handleDialogOpen}
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

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Description</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the description that will be displayed for this specific
            photo.
          </DialogContentText>
          <TextField
            fullWidth
            id="name"
            onChange={handleDialogInput}
            margin="dense"
            multiline
            rows={3}
            type="text"
            value={description}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={() => handleSaveDialog(id, description)}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
