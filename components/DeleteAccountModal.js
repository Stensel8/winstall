import { useState } from "react";
import Modal from "react-modal";
import { FiAlertCircle } from "react-icons/fi";

import styles from "../styles/deleteAccountModal.module.scss";

Modal.setAppElement("#__next");

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  deleting,
}) {
  const [error, setError] = useState("");

  const handleClose = () => {
    if (deleting) return;
    setError("");
    onClose();
  };

  const handleConfirm = async () => {
    setError("");
    const result = await onConfirm?.();
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
      contentLabel="Delete account"
    >
      <div className={styles.iconWrap}>
        <FiAlertCircle aria-hidden="true" />
      </div>

      <h2 className={styles.title}>Delete account?</h2>
      <p className={styles.description}>
        This will permanently delete your account and all associated data. This
        action cannot be undone.
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleClose}
          disabled={deleting}
        >
          Cancel
        </button>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleConfirm}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
