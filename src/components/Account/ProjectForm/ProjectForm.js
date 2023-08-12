import React, { useRef, useState } from "react";
import { X } from "react-feather";
import Modal from "../../Modal/Modal";
import InputControl from "../../InputControl/InputControl";

import {
  addProjectInDatabase,
  updateProjectInDatabase,
  uploadImage,
} from "../../../Firebase";

import styles from "./ProjectForm.module.css";

function ProjectForm(props) {
  const fileInputRef = useRef();
  const isEdit = props.isEdit ? true : false;
  const defaults = props.default;
  const userDetails = props.userDetails;

  const initialValues = {
    thumbnail: "",
    title: "",
    author: "",
    overview: "",
    link: "",
    description: "",
  };

  const [values, setValues] = useState(
    isEdit ? { ...defaults } : { ...initialValues }
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUploadStarted, setImageUploadStarted] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [submitButtonDisabled, setSetSubmitButtonDisabled] = useState(false);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageUploadStarted(true);
    uploadImage(
      file,
      (progress) => {
        setImageUploadProgress(progress);
      },
      (url) => {
        setImageUploadStarted(false);
        setImageUploadProgress(0);
        setValues((prev) => ({ ...prev, thumbnail: url }));
      },
      (error) => {
        setImageUploadStarted(false);
        setErrorMessage(error);
      }
    );
  };

  const validateForm = () => {
    let isValid = true;

    if (!values.thumbnail) {
      isValid = false;
      setErrorMessage("Thumbnail for project is required");
    } else if (!values.title) {
      isValid = false;
      setErrorMessage("Project's Title required");
    } else if (!values.author) {
      isValid = false;
      setErrorMessage("Project's Author required");
    } else if (!values.overview) {
      isValid = false;
      setErrorMessage("Project's Overview required");
    } else if (!values.description) {
      isValid = false;
      setErrorMessage("Project's Description required");
    } else {
      setErrorMessage("");
    }

    return isValid;
  };

  const handleSubmission = async () => {
    if (!validateForm()) return;

    setSetSubmitButtonDisabled(true);
    if (isEdit)
      await updateProjectInDatabase(
        { ...values, refUser: props.uid },
        defaults.pid
      );
    else await addProjectInDatabase({ ...values, refUser: props.uid });
    setSetSubmitButtonDisabled(false);
    if (props.onSubmission) props.onSubmission();
    if (props.onClose) props.onClose();
  };

  return (
    <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
      <div className={styles.container}>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
        <div className={styles.inner}>
          <div className={styles.image}>
            <img
              src={
                values.thumbnail ||
                "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png"
              }
              alt="Thumbnail"
              onClick={() => fileInputRef.current.click()}
            />
            {imageUploadStarted && (
              <p>
                <span>{imageUploadProgress.toFixed(2)}% Uploaded</span>
              </p>
            )}
          </div>

          <InputControl
            label="Blog Title"
            placeholder="Enter blog title"
            value={values.title}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                title: event.target.value,
              }))
            }
          />

          <InputControl
            label="Blog Author"
            placeholder="Enter blog author"
            value={values.author}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                author: event.target.value,
              }))
            }
          />

          <InputControl
            label="Blog Overview"
            placeholder="Blog's brief overview"
            value={values.overview}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                overview: event.target.value,
              }))
            }
          />

          <InputControl
            label="Blog Description"
            placeholder="Blog's description"
            value={values.description}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
          />

          <InputControl
            label="Reference link"
            placeholder="Enter any reference link"
            value={values.link}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                link: event.target.value,
              }))
            }
          />
        </div>
        <p className={styles.error}>{errorMessage}</p>
        <div className={styles.footer}>
          <p
            className={styles.cancel}
            onClick={() => (props.onClose ? props.onClose() : "")}
          >
            Cancel
          </p>
          <button
            className={styles.button}
            onClick={handleSubmission}
            disabled={submitButtonDisabled}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ProjectForm;
