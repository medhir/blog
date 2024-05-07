import React, { Component } from "react";
import styles from "./uploader.module.scss";
import http, { Protected } from "../../utility/http";

interface FilesProps {
  files: FileList;
}

const Files = ({ files }: FilesProps) => {
  if (files) {
    const fileArray = Array.from(files);
    return (
      <div className="files">
        <p>Photos to save:</p>
        <ul>
          {fileArray.map((file, i) => (
            <li key={`file-${i}`}>{file.name}</li>
          ))}
        </ul>
      </div>
    );
  } else {
    return null;
  }
};

const SuccessMessage = () => {
  return (
    <div className={styles.locations}>
      <p>Photos saved!</p>
    </div>
  );
};

interface UploaderState {
  progress: string | null;
  success: boolean | null;
  files: FileList | null;
  error: boolean | null;
}

class Uploader extends Component<{}, UploaderState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
       progress: null,
      success: null,
      files: null,
      error: null,
    };
  }

  handleFileStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      files: e.target.files,
    });
  };

  handleProgressEvent = (e: ProgressEvent) => {
    if (e.lengthComputable) {
      const percentage = Math.round((e.loaded * 100) / e.total);
      this.setState({
        progress: `${percentage}%`,
      });
    }
  };

  handleUpload = (e: any) => {
    e.preventDefault();
    if (this.state.files) {
      const formData = new FormData();
      for (let i = 0; i < this.state.files.length; i++) {
        formData.append("photo", this.state.files[i]);
      }
      Protected.Client.Post("/photos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: this.handleProgressEvent,
      })
        .then(() => {
          this.setState({
            success: true,
          });
        })
        .catch(() => {
          this.setState({
            error: true,
          });
        });
    }
  };

  render() {
    const { files, progress, success } = this.state;
    return (
      <div className={styles.uploader}>
        <form className={styles.imageForm}>
          <input
            type="file"
            accept="image/*"
            id="imagesInput"
            className={styles.imagesInput}
            multiple
            onChange={this.handleFileStateChange}
          />
          <label htmlFor="imagesInput">Choose Images</label>
          <button
            className={styles.uploadButton}
            onClick={(e) => {
              this.handleUpload(e);
            }}
          >
            Upload
          </button>
        </form>
        <div className={styles.progressIndicator}>
          <div style={{ width: progress ? progress : 1 }} />
        </div>
        {success && <SuccessMessage />}
        {files && <Files files={files} />}
      </div>
    );
  }
}

export default Uploader;
