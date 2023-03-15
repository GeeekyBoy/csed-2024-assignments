import * as styles from "./Button.module.scss";

function Button({
  children,
  fullWidth = false,
  secondary = false,
  disabled = false,
  onClick,
}) {
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  }
  return (
    <button
      class={styles.root}
      class={fullWidth && styles.fullWidth}
      class={secondary && styles.secondary}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
