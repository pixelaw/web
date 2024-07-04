import styles from './Loading.module.css';

const Loading = () => (
    <div className={styles.loadingContainer}>
        <span className={styles.loadingText}>Loading...</span>
    </div>
);

export default Loading;
