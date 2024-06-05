import { Button, Paper, IconButton } from "@material-ui/core";
import { AxiosError } from "axios";
import Router from "next/router";
import React, {
  Component,
  ChangeEvent,
  ClipboardEvent,
  DragEvent,
} from "react";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import SaveIcon from "@material-ui/icons/Save";
import PublishIcon from "@material-ui/icons/Publish";
import DeleteIcon from "@material-ui/icons/Delete";
import {throttle, DebouncedFunc, debounce} from "lodash";

import { Protected } from "@/utility/http";
import { AlertData, ErrorAlert, SuccessAlert } from "../alert";
import { Roles } from "../auth";
import Login from "../auth/login";
import Notebook from "../notebook";
import styles from "./editor.module.scss";


const ImageMIMERegex = /^image\/(p?jpeg|gif|png)$/i;
const LoadingText = "![](Uploading...)";

interface Asset {
  post_id: string;
  name: string;
  url: string;
}

interface BlogEditorProps {
  auth: boolean;
  id: string;
  draft: boolean;
  mdx: string;
}

interface BlogEditorState {
  assets: Array<Asset>;
  key: number;
  mdx: string;
  saved: Date | null;
  mobile: boolean;
  showAssets: boolean;
  errorAlert: AlertData;
  successAlert: AlertData;
}

class BlogEditor extends Component<BlogEditorProps, BlogEditorState> {
  articleRef: React.RefObject<HTMLElement>;
  debouncedAutoSaveDraft:  DebouncedFunc<() => Promise<void>>

  constructor(props: BlogEditorProps) {
    super(props);
    this.state = {
      assets: [],
      key: new Date().getTime(),
      mdx: props.mdx,
      saved: null,
      mobile: false,
      showAssets: false,
      errorAlert: {
        open: false,
        message: "",
      },
      successAlert: {
        open: false,
        message: "",
      },
    };

    this.articleRef = React.createRef();
    this.debouncedAutoSaveDraft = debounce(this.autoSaveDraft, 250);

    this.checkIfMobile = this.checkIfMobile.bind(this);
    this.closeErrorAlert = this.closeErrorAlert.bind(this);
    this.closeSuccessAlert = this.closeSuccessAlert.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.getAssets = this.getAssets.bind(this);
    this.getTitle = this.getTitle.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.deleteDraft = this.deleteDraft.bind(this);
    this.saveDraft = this.saveDraft.bind(this);
    this.publishDraft = this.publishDraft.bind(this);
    this.revisePost = this.revisePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.toggleAssets = this.toggleAssets.bind(this);
  }

  componentDidMount() {
    this.checkIfMobile();
    window.addEventListener("resize", this.checkIfMobile);
    this.getAssets();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkIfMobile);
  }

  checkIfMobile() {
    if (window.innerWidth < 600) {
      this.setState({
        mobile: true,
      });
    } else {
      this.setState({
        mobile: false,
      });
    }
  }

  closeSuccessAlert() {
    this.setState({
      successAlert: {
        open: false,
        message: "",
      },
    });
  }

  closeErrorAlert() {
    this.setState({
      errorAlert: {
        open: false,
        message: "",
      },
    });
  }

  containsImage(dtItems: DataTransferItemList) {
    let containsImage = false;
    for (let i = 0; i < dtItems.length; i++) {
      if (ImageMIMERegex.test(dtItems[i].type)) {
        containsImage = true;
        break;
      }
    }
    return containsImage;
  }

  copyToClipboard(url: string) {
    if (!navigator.clipboard) {
      return;
    }
    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.setState({
          successAlert: {
            open: true,
            message: "asset URL copied to clipboard",
          },
        });
      })
      .catch((err) => {
        this.setState({
          errorAlert: {
            open: true,
            message: `could not copy asset URL to clipboard: ${err}`,
          },
        });
      });
  }

  getAssets() {
    const { id } = this.props;
    Protected.Client.Get(`/blog/assets/${id}`)
      .then((response) => {
        this.setState({
          assets: response.data || [],
        });
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: `Could not get assets: ${error.response?.data}`,
          },
        });
      });
  }

  getTitle(): string {
    const { articleRef } = this;
    const heading1 = articleRef.current?.querySelector("h1");
    let title: string;
    if (heading1) {
      title = heading1.innerText;
    } else {
      title = `Untitled ${Math.random()}`;
    }
    return title;
  }

  handleDrop(e: DragEvent<HTMLTextAreaElement>) {
    const items = e.dataTransfer.items;
    this.handleImageUpload(e, items);
  }

  handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData.items;
    this.handleImageUpload(e, items);
  }

  handleImageUpload(
    e: DragEvent<HTMLTextAreaElement> | ClipboardEvent<HTMLTextAreaElement>,
    items: DataTransferItemList
  ) {
    const { id } = this.props;
    e.persist();
    // store selection start/end positions, original value
    // @ts-ignore
    const start = e.target.selectionStart;
    // @ts-ignore
    const end = e.target.selectionEnd;
    // @ts-ignore
    const originalValue = e.target.value;

    let blob;
    if (this.containsImage(items)) {
      e.preventDefault();
      for (let i = 0; i < items.length; i++) {
        if (ImageMIMERegex.test(items[i].type)) {
          blob = items[i].getAsFile();
          break;
        }
      }
      // Set uploading message in textarea
      this.insertAtCursor(start, end, LoadingText, e.target);
      // upload file
      // upload file
      const data = new FormData();
      if (blob instanceof Blob) {
        // Check if blob is a Blob instance
        data.append("photo", blob);
      } else {
        // Handle the case where blob is undefined or null
        console.error("No valid blob found");
        return;
      }
      Protected.Client.Post(`/blog/asset/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          // remove loading message
          this.setState(
            {
              mdx: originalValue,
            },
            () => {
              // add new image as markdown
              this.insertAtCursor(
                start,
                end,
                `![write descriptor here](${response.data.url})`,
                e.target,
                true
              );
              // update asset drawer
              this.getAssets();
            }
          );
        })
        .catch((error: AxiosError) => {
          this.setState(
            {
              mdx: originalValue,
            },
            () => {
              this.insertAtCursor(
                start,
                end,
                `Failed to upload image: ${error.response?.data}`,
                e.target,
                true
              );
            }
          );
        });
    }
  }

  deleteAsset(name: string) {
    const { id } = this.props;
    Protected.Client.Delete(`/blog/asset/${id}`, {
      params: {
        name,
      },
    })
      .then(() => {
        this.setState(
          {
            successAlert: {
              open: true,
              message: `asset ${name} deleted`,
            },
          },
          () => {
            this.getAssets();
          }
        );
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: `asset delete failure: ${error.response?.data}`,
          },
        });
      });
  }

  handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      mdx: e.target.value,
    }, this.debouncedAutoSaveDraft);
  }

  insertAtCursor(
    start: any,
    end: any,
    textToInsert: string | any[],
    input: EventTarget,
    lastInsert = false
  ) {
    // get current text of the input
    const value = (input as HTMLInputElement).value;
    // update the value with new text
    this.setState(
      {
        key: new Date().getTime(),
        mdx: value.slice(0, start) + textToInsert + value.slice(end),
      },
      () => {
        if (lastInsert) {
          // Update cursor position
          (input as HTMLInputElement).selectionStart = (
            input as HTMLInputElement
          ).selectionEnd = start + textToInsert.length;
        }
      }
    );
  }

  deleteDraft() {
    const { id } = this.props;
    Protected.Client.Delete(`/blog/draft/${id}`)
      .then(() => {
        this.setState(
          {
            successAlert: {
              open: true,
              message: "draft successfully deleted",
            },
          },
          () => {
            Router.push("/blog/edit");
          }
        );
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: error.response?.data,
          },
        });
      });
  }

  async autoSaveDraft() {
    const { id } = this.props;
    const { mdx } = this.state;
    const { getTitle } = this;

    const title = getTitle();
    Protected.Client.Patch(`/blog/draft/${id}`, {
      title: title,
      markdown: mdx,
    })
        .then(() => {
          this.setState({
            saved: new Date()
          });
        })
        .catch((error: AxiosError) => {
          this.setState({
            errorAlert: {
              open: true,
              message: error.response?.data,
            }
          });
        });
  }

  async saveDraft() {
    const { id } = this.props;
    const { mdx } = this.state;
    const { getTitle } = this;

    const title = getTitle();
    Protected.Client.Patch(`/blog/draft/${id}`, {
      title: title,
      markdown: mdx,
    })
      .then(() => {
        this.setState({
          successAlert: {
            open: true,
            message: "draft successfully saved",
          },
        });
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: error.response?.data,
          },
        });
      });
  }

  publishDraft() {
    const { id } = this.props;
    const { mdx } = this.state;
    const { getTitle } = this;

    const title = getTitle();
    Protected.Client.Post(`/blog/post/${id}`, {
      title,
      markdown: mdx,
    })
      .then((response) => {
        this.setState(
          {
            successAlert: {
              open: true,
              message: "post successfully published",
            },
          },
          () => {
            Router.push(`/blog/edit/post/${response.data.slug}`);
          }
        );
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: `unable to publish post: ${error.response!!.data}`,
          },
        });
      });
  }

  deletePost() {
    const { id } = this.props;
    Protected.Client.Delete(`/blog/post/${id}`)
      .then(() => {
        this.setState(
          {
            successAlert: {
              open: true,
              message: "post successfully deleted",
            },
          },
          () => {
            Router.push("/blog/edit");
          }
        );
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: `unable to delete post: ${error.response!!.data}`,
          },
        });
      });
  }

  revisePost() {
    const { id } = this.props;
    const { mdx } = this.state;
    const { getTitle } = this;

    const title = getTitle();
    Protected.Client.Patch(`/blog/post/${id}`, {
      title,
      markdown: mdx,
    })
      .then(() => {
        this.setState({
          successAlert: {
            open: true,
            message: "post successfully revised",
          },
        });
      })
      .catch((error: AxiosError) => {
        this.setState({
          errorAlert: {
            open: true,
            message: `unable to revise post: ${error.response!!.data}`,
          },
        });
      });
  }

  toggleAssets() {
    const { showAssets } = this.state;
    this.setState({
      showAssets: !showAssets,
    });
  }

  render() {
    const { auth, draft } = this.props;
    const { assets, key, mdx, mobile, showAssets, errorAlert, successAlert } =
      this.state;
    const {
      articleRef,
      closeErrorAlert,
      closeSuccessAlert,
      copyToClipboard,
      handleDrop,
      handlePaste,
      handleTextareaChange,
      deleteAsset,
      saveDraft,
      publishDraft,
      deleteDraft,
      deletePost,
      revisePost,
      toggleAssets
    } = this;
    if (auth) {
      return (
        <div className={styles.draft}>
          <div className={styles.toolbar}>
            <div className={styles.controls}>
              <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<PhotoLibraryIcon />}
                  onClick={toggleAssets}
              >
                {showAssets ? "Hide" : "Show"}
              </Button>
              {draft && (
                  <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      startIcon={<SaveIcon />}
                      onClick={saveDraft}
                  >
                    Save
                  </Button>
              )}
              <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={draft ? deleteDraft : deletePost}
              >
                Delete
              </Button>
              <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<PublishIcon />}
                  onClick={draft ? publishDraft : revisePost}
              >
                {draft ? "Publish" : "Revise"}
              </Button>
            </div>
            { this.state.saved && <div className={styles.savedMessage}><p>{`draft last saved at ${this.state.saved.toLocaleTimeString()}`}</p></div> }
          </div>
          <div
            className={`${styles.assets} ${
              showAssets ? styles.assets_show : styles.assets_hidden
            }`}
          >
            {assets.map((asset) => {
              return (
                <Paper
                  key={asset.name}
                  elevation={5}
                  className={styles.assets_preview}
                  onClick={() => copyToClipboard(asset.url)}
                >
                  <img src={asset.url} />
                  <IconButton
                    size="medium"
                    className={styles.assets_delete}
                    onClick={() => deleteAsset(asset.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              );
            })}
          </div>
          <Notebook
            articleRef={articleRef}
            key={key}
            splitPane={!mobile}
            scroll={false}
            mdx={mdx}
            handleDrop={handleDrop}
            handlePaste={handlePaste}
            handleTextareaChange={handleTextareaChange}
          />
          {errorAlert.open && (
            <ErrorAlert open={errorAlert.open} onClose={closeErrorAlert}>
              {errorAlert.message}
            </ErrorAlert>
          )}
          {successAlert.open && (
            <SuccessAlert open={successAlert.open} onClose={closeSuccessAlert}>
              {successAlert.message}
            </SuccessAlert>
          )}
        </div>
      );
    } else {
      return <Login role={Roles.BlogOwner} />;
    }
  }
}

export default BlogEditor;
