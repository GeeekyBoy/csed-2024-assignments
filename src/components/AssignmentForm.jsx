import Modal from "./Modal";
import Checkbox from "./Checkbox";
import * as dateUtils from "../util/dateUtils";
import * as styles from "./AssignmentForm.module.scss";

function AssignmentForm({ $active, currData = [] }) {
  let $isBusy = false;
  let $id,
    $subject,
    $assignment,
    $dueDate,
    $dueTime,
    $link,
    $showTime,
    $beforeSection;
  $createIEffect(() => {
    $id = currData[0] !== undefined ? currData[0] : null;
    $subject = currData[1] || "";
    $assignment = currData[2] || "";
    $dueDate = dateUtils.timestampToDate(currData[3]);
    $dueTime = dateUtils.timestampToTime(currData[3]);
    $link = currData[4] || "";
    $showTime = currData[5] || false;
    $beforeSection = currData[6] || false;
  }, [currData]);
  async function handleSubmit() {
    $isBusy = true;
    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", prompt("Please enter your password"));
    }
    const id = $id;
    const subject = $subject;
    const assignment = $assignment;
    const dueDate = new Date($dueDate + " " + $dueTime).getTime();
    const link = $link;
    const showTime = $showTime;
    const beforeSection = $beforeSection;
    if ($id !== null) {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          subject,
          assignment,
          dueDate,
          link,
          showTime,
          beforeSection,
        })
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        alert("Invalid password");
      } else {
        $active = false;
      }
    } else {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          subject,
          assignment,
          dueDate,
          link,
          showTime,
          beforeSection,
        })
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        alert("Invalid password");
      } else {
        $active = false;
      }
    }
    $isBusy = false;
  }
  return (
    <Modal
      title={$id !== null ? "Edit Assignment" : "Add Assignment"}
      submitLabel="Submit"
      cancelLabel="Cancel"
      onSubmit={handleSubmit}
      $active={$active}
      disabled={$subject === "" || $assignment === "" || $isBusy}
    >
      <form class={styles.modalForm} onSubmit={(e) => e.preventDefault()}>
        <div>
          <label for="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            disabled={$id !== null}
            bind:value={$subject}
          />
        </div>
        <div>
          <label for="assignment">Assignment</label>
          <input
            type="text"
            id="assignment"
            name="assignment"
            disabled={$id !== null}
            bind:value={$assignment}
          />
        </div>
        <div>
          <label for="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            bind:value={$dueDate}
          />
        </div>
        <div>
          <label for="dueTime">Due Time</label>
          <input
            type="time"
            id="dueTime"
            name="dueTime"
            bind:value={$dueTime}
          />
        </div>
        <div style:grid-area="3 / 1 / 4 / 3">
          <label for="dueTime">Submission URL</label>
          <input
            type="url"
            id="link"
            name="link"
            bind:value={$link}
          />
        </div>
        <Checkbox label="Show Time" name="showTime" $value={$showTime} />
        <Checkbox
          label="Before Section"
          name="beforeSection"
          $value={$beforeSection}
        />
      </form>
    </Modal>
  );
}

export default AssignmentForm;
