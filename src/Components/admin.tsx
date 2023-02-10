import {
  Button,
  Container,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
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
import { Save, Visibility, VisibilityOff } from "@mui/icons-material";

interface AdminProps {}

interface AdminState {
  apiKey: string;
  imageURLs: Array<string>;
  showApiKey: boolean;
}

export default class Admin extends React.Component<AdminProps, AdminState> {
  constructor(props: AdminProps) {
    super(props);

    this.state = {
      apiKey: "",
      imageURLs: [],
      showApiKey: false,
    };

    this.handleApiKeyInput = this.handleApiKeyInput.bind(this);
    this.handleShowApiKey = this.handleShowApiKey.bind(this);
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
    const { apiKey, imageURLs, showApiKey } = this.state;
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
            <Button
              disabled={!hasApiKey}
              variant="contained"
              startIcon={<UploadIcon />}
              color="secondary"
            >
              Upload Image
            </Button>
            <Button
              disabled={!hasApiKey}
              variant="contained"
              startIcon={<Save />}
            >
              Save Changes
            </Button>
          </Stack>
          <ImageList cols={3} gap={16} sx={{ height: "100%", width: "100%" }}>
            {imageURLs.map((imageURL: string) => {
              return (
                <ImageListItem key={uuidv4()} sx={{ aspectRatio: "1" }}>
                  <img
                    src={`https://backend.xsalazar.com/?image=${imageURL}`}
                    style={{ objectFit: "cover" }}
                    height={256}
                    alt="description"
                  />
                  <ImageListItemBar
                    title="Title"
                    actionIcon={
                      <div>
                        <IconButton sx={{ color: "rgba(255, 255, 255, 0.54)" }}>
                          <ChevronUpIcon />
                        </IconButton>
                        <IconButton sx={{ color: "rgba(255, 255, 255, 0.54)" }}>
                          <ChevronDownIcon />
                        </IconButton>
                        <IconButton sx={{ color: "rgba(255, 255, 255, 0.54)" }}>
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
}
