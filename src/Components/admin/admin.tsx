import { Close, Save, Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Snackbar from "@mui/material/Snackbar";
import { Stack } from "@mui/system";
import { UploadIcon } from "@primer/octicons-react";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AdminImage from "./image";

export default function Admin() {
  const [apiKey, setApiKey] = useState("");
  const [hasError, setHasError] = useState(false);
  const [imageData, setImageData] = useState<
    Array<{
      description: string;
      id: string;
      isDeleted: boolean;
      order: number;
    }>
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const fetchData = useCallback(async () => {
    const result = (
      await axios.get(`https://backend.xsalazar.com/`, {
        params: { allImages: true },
      })
    ).data;

    setImageData(
      result.data.map(
        (x: { id: string; order: number; description: string }) => {
          return { ...x, isDeleted: false, description: x.description ?? "" };
        }
      )
    );
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApiKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const handleUploadImage = async (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.files === null || apiKey === "") {
      return;
    }

    setIsUploading(true);

    const files = event.currentTarget.files;

    try {
      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        const result = (
          await axios.put(`https://backend.xsalazar.com/`, file, {
            params: { token: apiKey },
          })
        ).data;

        setImageData(
          result.data.map(
            (x: { id: string; order: number; description: string }) => {
              return {
                ...x,
                isDeleted: false,
                description: x.description ?? "",
              };
            }
          )
        );
      }

      setIsUploading(false);
    } catch (e) {
      setHasError(true);
      setIsUploading(false);
    }
  };

  const handleSaveImageData = async () => {
    setIsSaving(true);

    try {
      const res = (
        await axios.patch(
          `https://backend.xsalazar.com/`,
          {
            data: imageData.filter((x) => {
              return !x.isDeleted;
            }),
          },
          {
            params: { token: apiKey, updateImageData: true },
          }
        )
      ).data;

      setIsSaving(false);
      setImageData(res.data);
    } catch (e) {
      setIsSaving(false);
      setHasError(true);
    }
  };

  const handleUpdateImageDescription = (
    needleId: string,
    description: string
  ) => {
    const imagePosition = imageData.findIndex(
      ({ id: haystackId }) => needleId === haystackId
    );

    imageData[imagePosition].description = description;

    setImageData(imageData);
  };

  const handleMoveImage = (needleId: string, down: boolean, count?: number) => {
    const jump = count ?? 1;

    const oldPosition = imageData.findIndex(
      ({ id: haystackId }) => needleId === haystackId
    );

    const newPosition = oldPosition + (down ? jump : -1 * jump);

    const originalData = imageData[oldPosition];

    // Move image
    imageData.splice(oldPosition, 1);
    imageData.splice(newPosition, 0, originalData);

    // Normalize order and save state
    setImageData(normalizeImageOrder(imageData));
  };

  const handleDeleteImage = (needleId: string) => {
    const position = imageData.findIndex(
      ({ id: haystackId }) => needleId === haystackId
    );

    // Toggle deleted state
    imageData[position].isDeleted = !imageData[position].isDeleted;

    setImageData(normalizeImageOrder(imageData));
  };

  // Handler for closing error toast
  const handleErrorClose = () => {
    setHasError(false);
  };

  const normalizeImageOrder = (
    data: Array<{
      description: string;
      id: string;
      isDeleted: boolean;
      order: number;
    }>
  ) => {
    for (var i = 0; i < data.length; i++) {
      data[i].order = i;
    }

    return data;
  };

  const hasApiKey = apiKey !== "";

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
        {/* Top-level admin controls */}
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          width="100%"
        >
          {/* API Key */}
          <InputLabel>API Key</InputLabel>
          <Input
            size="small"
            sx={{ flex: 1 }}
            type={showApiKey ? "text" : "password"}
            onChange={handleApiKeyInput}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleShowApiKey}>
                  {showApiKey ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          {/* Upload Button */}
          <label htmlFor="contained-button-upload">
            <input
              accept="image/*"
              hidden
              multiple
              id="contained-button-upload"
              onChange={handleUploadImage}
              type="file"
            />
            <LoadingButton
              color="secondary"
              component="span"
              disabled={!hasApiKey}
              loading={isUploading}
              loadingPosition="start"
              startIcon={<UploadIcon />}
              variant="contained"
            >
              Upload Image
            </LoadingButton>
          </label>

          {/* Save Button */}
          <LoadingButton
            disabled={!hasApiKey}
            startIcon={<Save />}
            loading={isSaving}
            loadingPosition="start"
            onClick={handleSaveImageData}
            variant="contained"
          >
            Save Changes
          </LoadingButton>
        </Stack>

        {/* Images */}
        <ImageList cols={3} gap={16} sx={{ height: "100%", width: "100%" }}>
          {imageData.map(({ description, id, isDeleted, order }) => {
            return (
              <AdminImage
                originalDescription={description}
                handleDeleteImage={handleDeleteImage}
                handleMoveImage={handleMoveImage}
                handleUpdateImageDescription={handleUpdateImageDescription}
                key={uuidv4()}
                id={id}
                imageData={imageData}
                isDeleted={isDeleted}
                order={order}
              />
            );
          })}
        </ImageList>
      </Container>

      {/* Error Toast */}
      <Snackbar
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleErrorClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
        open={hasError}
        onClose={handleErrorClose}
        autoHideDuration={4000}
        message="🙈 Uh oh, something went wrong -- sorry! Try again soon"
      />
    </div>
  );
}
