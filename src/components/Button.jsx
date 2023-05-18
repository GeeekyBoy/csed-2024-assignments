import * as styles from "./Button.module.scss";

function Button({
  children,
  label,
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
      aria-label={label}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
