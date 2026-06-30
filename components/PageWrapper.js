import Footer from "./Footer";
import styles from "../styles/pageWrapper.module.scss";

function PageWrapper({ children }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>{children}</div>
      <Footer />
    </div>
  );
}

export default PageWrapper;