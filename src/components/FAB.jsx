import * as styles from "./FAB.module.scss";

function FAB({ children, onClick }) {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  }
  return (
    <button class={styles.root} onClick={handleClick}>
      {children}
    </button>
  );
}

export default FAB;
