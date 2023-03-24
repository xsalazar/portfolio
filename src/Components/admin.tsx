import {
  Container,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Input,
  InputAdornment,
  InputLabel,
  Snackbar,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  UploadIcon,
} from "@primer/octicons-react";
import { Stack } from "@mui/system";
import { Close, Save, Visibility, VisibilityOff } from "@mui/icons-material";

interface AdminProps {}

interface AdminState {
  apiKey: string;
  hasError: boolean;
  imageData: Array<{ id: string; order: number; isDeleted: boolean }>;
  isSaving: boolean;
  isUploading: boolean;
  showApiKey: boolean;
}

export default class Admin extends React.Component<AdminProps, AdminState> {
  constructor(props: AdminProps) {
    super(props);

    this.state = {
      apiKey: "",
      hasError: false,
      imageData: [],
      isSaving: false,
      isUploading: false,
      showApiKey: false,
    };

    this.handleApiKeyInput = this.handleApiKeyInput.bind(this);
    this.handleShowApiKey = this.handleShowApiKey.bind(this);
    this.handleMoveImage = this.handleMoveImage.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleSaveImageData = this.handleSaveImageData.bind(this);
    this.handleErrorClose = this.handleErrorClose.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const result = (
      await axios.get(`https://backend.xsalazar.com/`, {
        params: { allImages: true },
      })
    ).data;

    this.setState({
      imageData: result.data.map((x: { id: string; order: number }) => {
        return { ...x, isDeleted: false };
      }),
    });
  }

  render() {
    const { apiKey, hasError, imageData, isSaving, isUploading, showApiKey } =
      this.state;
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
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            width="100%"
          >
            <InputLabel>API Key</InputLabel>
            <Input
              size="small"
              sx={{ flex: 1 }}
              type={showApiKey ? "text" : "password"}
              onChange={this.handleApiKeyInput}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={this.handleShowApiKey}>
                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <label htmlFor="contained-button-upload">
              <input
                accept="image/*"
                hidden
                id="contained-button-upload"
                onChange={this.handleUploadImage}
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
            <LoadingButton
              disabled={!hasApiKey}
              startIcon={<Save />}
              loading={isSaving}
              loadingPosition="start"
              onClick={this.handleSaveImageData}
              variant="contained"
            >
              Save Changes
            </LoadingButton>
          </Stack>
          <ImageList cols={3} gap={16} sx={{ height: "100%", width: "100%" }}>
            {imageData.map(({ id, order, isDeleted }) => {
              return (
                <ImageListItem key={uuidv4()} sx={{ aspectRatio: "1" }}>
                  <img
                    src={`https://backend.xsalazar.com/?image=${id}`}
                    style={{ objectFit: "cover", opacity: isDeleted ? 0.6 : 1 }}
                    height={256}
                    alt="description"
                  />
                  <ImageListItemBar
                    actionIcon={
                      <div>
                        <IconButton
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          disabled={order === 0}
                          onClick={() => this.handleMoveImage(id, false)}
                        >
                          <ChevronUpIcon />
                        </IconButton>
                        <IconButton
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          disabled={order === imageData.length - 1}
                          onClick={() => this.handleMoveImage(id, true)}
                        >
                          <ChevronDownIcon />
                        </IconButton>
                        <IconButton
                          sx={{
                            color: isDeleted
                              ? "rgba(255, 50, 0, 0.54)"
                              : "rgba(255, 255, 255, 0.54)",
                          }}
                          onClick={() => this.handleDeleteImage(id)}
                        >
                          <TrashIcon />
                        </IconButton>
                      </div>
                    }
                  />
                </ImageListItem>
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
              onClick={this.handleErrorClose}
            >
              <Close fontSize="small" />
            </IconButton>
          }
          open={hasError}
          onClose={this.handleErrorClose}
          autoHideDuration={4000}
          message="🙈 Uh oh, something went wrong -- sorry! Try again soon"
        />
      </div>
    );
  }

  handleApiKeyInput(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ apiKey: e.target.value });
  }

  handleShowApiKey() {
    const { showApiKey } = this.state;
    this.setState({ showApiKey: !showApiKey });
  }

  async handleUploadImage(event: React.FormEvent<HTMLInputElement>) {
    const { apiKey } = this.state;

    if (event.currentTarget.files === null || apiKey === "") {
      return;
    }

    this.setState({
      isUploading: true,
    });

    try {
      const result = (
        await axios.put(
          `https://backend.xsalazar.com/`,
          event.currentTarget.files[0],
          { params: { token: apiKey } }
        )
      ).data;

      this.setState({
        imageData: result.data,
        isUploading: false,
      });
    } catch (e) {
      this.setState({
        hasError: true,
        isUploading: false,
      });
    }
  }

  async handleSaveImageData() {
    const { apiKey, imageData } = this.state;

    this.setState({ isSaving: true });

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

      this.setState({ isSaving: false, imageData: res.data });
    } catch (e) {
      this.setState({ hasError: true, isSaving: false });
    }
  }

  handleMoveImage(needleId: string, down: boolean) {
    let { imageData } = this.state;

    const oldPosition = imageData.findIndex(
      ({ id: haystackId }) => needleId === haystackId
    );

    const newPosition = oldPosition + (down ? 1 : -1);

    // Swap images
    [imageData[oldPosition], imageData[newPosition]] = [
      imageData[newPosition],
      imageData[oldPosition],
    ];

    // Normalize order and save state
    this.setState({ imageData: this.normalizeImageOrder(imageData) });
  }

  handleDeleteImage(needleId: string) {
    let { imageData } = this.state;

    const position = imageData.findIndex(
      ({ id: haystackId }) => needleId === haystackId
    );

    // Toggle deleted state
    imageData[position].isDeleted = !imageData[position].isDeleted;

    this.setState({ imageData: this.normalizeImageOrder(imageData) });
  }

  // Handler for closing error toast
  handleErrorClose() {
    this.setState({
      hasError: false,
    });
  }

  private normalizeImageOrder(
    data: Array<{ id: string; order: number; isDeleted: boolean }>
  ) {
    for (var i = 0; i < data.length; i++) {
      data[i].order = i;
    }

    return data;
  }
}
