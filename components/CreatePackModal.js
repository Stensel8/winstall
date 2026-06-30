import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Modal from "react-modal";

import { createPack, updatePack } from "../utils/fetchPackAPI";
import styles from "../styles/createPackModal.module.scss";

Modal.setAppElement("#__next");

const defaultValues = {
  title: "",
  description: "",
  isUnlisted: true,
};

function toVisibility(isUnlisted) {
  return isUnlisted ? "unlisted" : "public";
}

function packToFormValues(pack) {
  return {
    title: pack.name || "",
    description: pack.description || "",
    isUnlisted: pack.visibility !== "public",
  };
}

export default function CreatePackModal({ isOpen, onClose, user, onCreated, pack }) {
  const isEditMode = Boolean(pack);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (pack) {
      reset(packToFormValues(pack));
    } else {
      reset(defaultValues);
    }

    setError("");
  }, [isOpen, pack, reset]);

  const handleClose = () => {
    if (submitting) return;
    reset(defaultValues);
    setError("");
    onClose();
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    setError("");

    const payload = {
      name: values.title,
      description: values.description,
      visibility: toVisibility(values.isUnlisted),
    };

    const { response, error: apiError } = isEditMode
      ? await updatePack(pack._id, payload)
      : await createPack(payload);

    setSubmitting(false);

    if (apiError) {
      setError(apiError);
      return;
    }

    if (response) {
      localStorage.removeItem("ownPacks");
      reset(defaultValues);
      setError("");
      onCreated(response);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
      contentLabel={isEditMode ? "Edit pack" : "Create a pack"}
    >
      <div className={styles.header}>
        <h2>{isEditMode ? "Edit pack" : "Create a pack"}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label className={styles.field}>
          Pack title
          <input
            type="text"
            placeholder="Give your pack a name"
            autoComplete="off"
            {...register("title", {
              required: true,
              validate: (value) =>
                value.replace(/\s/g, "").length > 0 || false,
            })}
          />
          {errors.title && (
            <span className={styles.fieldError}>
              Please enter a name for your pack.
            </span>
          )}
        </label>

        <label className={styles.field}>
          Pack description
          <textarea
            placeholder="Give your pack a short description"
            autoComplete="off"
            {...register("description", {
              required: true,
              validate: (value) =>
                value.replace(/\s/g, "").length > 0 || false,
            })}
          />
          {errors.description && (
            <span className={styles.fieldError}>
              Please enter a description for your pack.
            </span>
          )}
        </label>

        <div className={styles.checkboxContainer}>
          <label>
            <input type="checkbox" {...register("isUnlisted")} />
            <p>Hide this pack from the public directory on winstall.</p>
          </label>
          <em>
            Your pack will still be accessible to anyone with a direct link.
          </em>
        </div>

        {error && <p className={styles.apiError}>{error}</p>}

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update"
                : "Create Pack"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
