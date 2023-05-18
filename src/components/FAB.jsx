import * as styles from "./FAB.module.scss";

function FAB({ children, label, onClick }) {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  }
  return (
    <button class={styles.root} aria-label={label} onClick={handleClick}>
      {children}
    </button>
  );
}

export default FAB;
