import CheckmarkIcon from "jsx:@fluentui/svg-icons/icons/checkmark_12_regular.svg";
import * as styles from "./Checkbox.module.scss";

function Checkbox({
  name,
  label,
  $value,
  readOnly,
  disabled,
}) {
  const handleToggle = () => {
    if (disabled || readOnly) return;
    $value = !$value;
  }
  return (
    <div
      class={styles.CheckboxShell}
      class={disabled && styles.disabled}
      class={readOnly && styles.readOnly}
    >
      <button
        class={styles.CheckToggle}
        class={$value && styles.checked}
        onClick={handleToggle}
      >
        {$value && <CheckmarkIcon style:fill="currentColor" style:width={14} style:height={14} />}
      </button>
      {label && (
        <label htmlFor={name} onClick={handleToggle}>
          {label}
        </label>
      )}
    </div>
  );
}

export default Checkbox;
