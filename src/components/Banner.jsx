import * as styles from "./Banner.module.scss";

function Banner({ children, variant = "attention", onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <div
      className={styles.root}
      className={onClick && styles.clickable}
      className={variant === "attention" && styles.attention}
      className={variant === "success" && styles.success}
      className={variant === "caution" && styles.caution}
      className={variant === "critical" && styles.critical}
      onClick={handleClick}
    >
      <span>{children}</span>
    </div>
  );
}

export default Banner;
