import Button from "./Button";
import * as styles from "./Modal.module.scss";

function Modal({
  title,
  children,
  submitLabel,
  cancelLabel,
  onSubmit,
  onCancel,
  disabled,
  $active,
}) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    $active = false;
  }
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  }
  return (
    <div class={styles.root} class={$active && styles.active}>
      <div class={styles.modalOverlay} onClick={handleCancel} />
      <div class={styles.modalContent}>
        <div class={styles.modalHeaderFooter}>
          <div class={styles.modalHeader}>{title}</div>
          <div>{children}</div>
        </div>
        <div class={styles.modalFooter}>
          <Button label="cancel" onClick={handleCancel} secondary fullWidth>
            {cancelLabel}
          </Button>
          <Button label="submit" onClick={handleSubmit} disabled={disabled} fullWidth>
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
