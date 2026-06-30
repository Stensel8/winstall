import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaMicrosoft } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import Modal from "react-modal";
import styles from "../styles/loginPanel.module.scss";

Modal.setAppElement("#__next");

const PROVIDERS = [
  { id: "google", label: "Continue with Google", icon: FcGoogle },
  { id: "github", label: "Continue with GitHub", icon: FaGithub },
  { id: "azure-ad", label: "Continue with Microsoft", icon: FaMicrosoft },
];

export function LoginButtons({ onLogin, className }) {
  return (
    <div className={className ?? styles.loginButtons}>
      {PROVIDERS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={styles.loginCard}
          onClick={() => onLogin(id)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </div>
  );
}

export default function LoginPanel({
  isOpen,
  onClose,
  onLogin,
  authError,
  title = "Login with your preferred provider",
  subtitle = "Create install packs and set up new PCs in minutes",
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
      contentLabel={title}
    >
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close"
      >
        <FiX />
      </button>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        {authError && <p className={styles.authError}>{authError}</p>}

        <LoginButtons onLogin={onLogin} />
      </div>
    </Modal>
  );
}
