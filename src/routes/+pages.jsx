import { enableNotifications, $notificationsState } from "../util/firebase";
import confetti from 'canvas-confetti';
import AssignmentForm from "../components/AssignmentForm";
import Banner from "../components/Banner";
import FAB from "../components/FAB";
import Checkbox from "../components/Checkbox";
import CheckmarkIcon from "jsx:@fluentui/svg-icons/icons/checkmark_24_regular.svg";
import DeleteIcon from "jsx:@fluentui/svg-icons/icons/delete_24_regular.svg";
import AddIcon from "jsx:@fluentui/svg-icons/icons/add_24_regular.svg";
import EditIcon from "jsx:@fluentui/svg-icons/icons/edit_24_regular.svg";
import { getFirestore, onSnapshot, collection } from "firebase/firestore";
import * as dateUtils from "../util/dateUtils.js";
import * as pendingAssignments from "../util/pendingAssignments.js";
import * as finishedAssignments from "../util/finishedAssignments.js";
import * as styles from "./styles.module.scss";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(new URL("../workbox-sw.js", import.meta.url), { type: "module" });
  });
}

function App() {
  let $isModalActive = false;
  let $activeAssignment = [];
  let $pending = pendingAssignments.load();
  let $finished = finishedAssignments.load();
  let $isEditMode = false;
  let $showTodo = true;
  let $showPending = true;
  let $showFinished = true;
  let $loading = true;
  let $data = [];
  let $tadaCanvas = null;
  const teamsCodes = [
    ["Graphics", "n5oc9r2"],
    ["Critical thinking", "6ek7ulb"],
    ["Embedded Systems", "ljtiab1"],
    ["Architecture", "mr064u5"],
  ];
  const driveLink = "https://drive.google.com/drive/folders/1QrC56oFyDboBWRCpjoFI7PedFU3ffilf";
  const db = getFirestore();
  onSnapshot(collection(db, "assignments"), (snapshot) => {
    $data = snapshot.docs.map((item) => {
      const data = item.data();
      return [
        item.id,
        data.subject,
        data.assignment,
        data.dueDate,
        data.link,
        data.showTime,
        data.beforeSection
      ];
    }).sort((a, b) => a[3] - b[3]);
    $loading = false;
  });
  const handleFabClick = async () => {
    if (!$isEditMode) {
      if (!localStorage.getItem("token")) {
        localStorage.setItem("token", prompt("Please enter your password"));
      }
      const res = await fetch(`/api/verify-password`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        }
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        alert("Invalid password");
      } else {
        $isEditMode = true;
      }
    } else {
      $activeAssignment = [];
      $isModalActive = true;
    }
  }
  const handleExitEditMode = () => {
    $isEditMode = false;
  }
  const handleChangeStatus = (id) => {
    if ($pending.includes(id)) {
      $pending = pendingAssignments.toggle(id);
      $finished = finishedAssignments.toggle(id);
    } else if ($finished.includes(id)) {
      $finished = finishedAssignments.toggle(id);
    } else {
      $pending = pendingAssignments.toggle(id);
    }
  }
  const handleDelete = async (id, subject, assignment) => {
    if (!confirm(`Are you sure you want to delete the assignment "${subject} - ${assignment}"?`)) return;
    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", prompt("Please enter your password"));
    }
    const res = await fetch(`/api/assignments/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    if (res.status === 401) {
      localStorage.removeItem("token");
      alert("Invalid password");
    }
  }
  const handleEditAssignment = (assignment) => {
    if ($isEditMode) {
      $activeAssignment = assignment;
      $isModalActive = true;
    }
  }
  confetti({
    particleCount: 400,
    spread: 100,
    resize: true,
    origin: { y: 0.6 }
  });
  return (
    <div class={styles.root}>
      <head>
        <title>CSED 2024 Assignments</title>
        <meta
          name="description"
          content="All the assignments for CSED 2024 in one place."
        />
      </head>
      <center>
        <header>
          <h1 font-size="1.5rem" margin-bottom={0}>
            CSED 2024 Assignments
            <a href="https://github.com/GeeekyBoy/csed-2024-assignments" target="_blank">
              <img
                width={76}
                height={20}
                alt="GitHub stars"
                src="https://img.shields.io/github/stars/GeeekyBoy/csed-2024-assignments.svg?style=social&label=Star"
              />
            </a>
          </h1>
          <span font-size="0.9rem">
            A service powered by
            <a href="https://mangojs.geeekyboy.com/">Mango</a>!
          </span>
        </header>
        <br />
        <div class={styles.viewport}>
          {$isEditMode ? (
            <Banner
              variant="critical"
              onClick={handleExitEditMode}
              style:position="relative"
              style:top="-40px"
              style:left="-30px"
              style:width="calc(100% + 20px)"
            >
              Tap to exit edit mode!
            </Banner>
          ) : $notificationsState === "default" ? (
            <Banner
              variant="caution"
              onClick={enableNotifications}
              style:position="relative"
              style:top="-40px"
              style:left="-30px"
              style:width="calc(100% + 20px)"
            >
              Tap to enable notifications to get notified when an assignment is due!
            </Banner>
          ) : $notificationsState === "denied" ? (
            <Banner
              variant="critical"
              style:position="relative"
              style:top="-40px"
              style:left="-30px"
              style:width="calc(100% + 20px)"
            >
              Notifications are disabled. Please enable them in your browser settings.
            </Banner>
          ) : null}
          {$loading ? (
            <p>Loading...</p>
          ) : (
            <div>
          <div className={styles.filters}>
            <Checkbox label="Todo" $value={$showTodo} />
            <Checkbox label="Pending" $value={$showPending} />
            <Checkbox label="Finished" $value={$showFinished} />
          </div>
          <table>
            <tr>
              <th>
                <center>Assignment</center>
              </th>
              <th>
                <center>Date</center>
              </th>
            </tr>
            {$data.map((item) => (
              (($showTodo && !$pending.includes(item[0]) && !$finished.includes(item[0])) ||
              ($showPending && $pending.includes(item[0])) ||
              ($showFinished && $finished.includes(item[0]))) && (
                <tr onClick={() => handleEditAssignment(item)}>
                  <td
                    class={!$isEditMode && $pending.includes(item[0]) && styles.pending}
                    class={!$isEditMode && $finished.includes(item[0]) && styles.done}
                  >
                    {item[1]} → {item[4] ? (
                      <a href={item[4]} target="_blank" onClick={(e) => e.stopPropagation()}>
                        {item[2]}
                      </a>
                    ) : (
                      item[2]
                    )}
                    {$isEditMode ? (
                      <button
                        class={styles.DeleteButton}
                        aria-label="delete assignment"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item[0], item[1], item[2]);
                        }}
                      >
                        <DeleteIcon style:fill="#ff0000" style:width={24} style:height={24} />
                      </button>
                    ) : (
                      <button
                        class={styles.StatusToggle}
                        class={$pending.includes(item[0]) && styles.pending}
                        class={$finished.includes(item[0]) && styles.done}
                        aria-label="toggle assignment status"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChangeStatus(item[0]);
                        }}
                      >
                        {$finished.includes(item[0]) && (
                          <CheckmarkIcon style:fill="#ffffff" style:width={24} style:height={24} />
                        )}
                      </button>
                    )}
                  </td>
                  <td
                    class={!$isEditMode && $pending.includes(item[0]) && styles.pending}
                    class={!$isEditMode && $finished.includes(item[0]) && styles.done}
                  >
                    {dateUtils.dateToString(new Date(item[3]), item[5], item[6])}
                  </td>
                </tr>
              )
            ))}
          </table>
          <br />
          <br />
          <div text-align="left">
            <h1 color="#ff0000" font-size="1.7rem">
              Teams Codes :
            </h1>
            <ul margin-top="-10px">
              {teamsCodes.map((item) => (
                <li>
                  {item[0]} → {item[1]}
                </li>
              ))}
            </ul>
            <br />
            <h1 color="#ff0000" font-size="1.7rem" display="inline-block">
              Drive :
            </h1>
            <b font-size="1.4rem" margin-left="10px">
              <a href={driveLink}>CSED 2024</a>
            </b>
          </div>
        </div>
          )}
        </div>
        <footer>
          <p>
            Made with ❤️ by <a href="https://github.com/GeeekyBoy" target="_blank">GeeekyBoy</a> in Egypt
            <br />
            Copyright © {new Date().getFullYear()} GeeekyBoy
          </p>
        </footer>
      </center>
      <FAB label={$isEditMode ? "add new assignment" : "enter edit mode"} onClick={handleFabClick}>
        {$isEditMode ? (
          <AddIcon style:fill="#ffffff" style:width={24} style:height={24} />
        ) : (
          <EditIcon style:fill="#ffffff" style:width={24} style:height={24} />
        )}
      </FAB>
      <AssignmentForm $active={$isModalActive} currData={$activeAssignment} />
    </div>
  );
}

export default App;
