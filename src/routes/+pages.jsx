import "../util/firebase";
import AssignmentForm from "../components/AssignmentForm";
import FAB from "../components/FAB";
import CheckmarkIcon from "jsx:@fluentui/svg-icons/icons/checkmark_24_regular.svg";
import DeleteIcon from "jsx:@fluentui/svg-icons/icons/delete_24_regular.svg";
import AddIcon from "jsx:@fluentui/svg-icons/icons/add_24_regular.svg";
import EditIcon from "jsx:@fluentui/svg-icons/icons/edit_24_regular.svg";
import { getFirestore, onSnapshot, collection } from "firebase/firestore";
import { $routePath, navigate } from "@mango-js/router";
import * as dateUtils from "../util/dateUtils.js";
import * as pendingAssignments from "../util/pendingAssignments.js";
import * as finishedAssignments from "../util/finishedAssignments.js";
import * as styles from "./styles.module.scss";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    eval('navigator.serviceWorker.register("/workbox-sw.js");');
  });
}

function App() {
  let $isModalActive = false;
  let $activeAssignment = [];
  let $pending = pendingAssignments.load();
  let $finished = finishedAssignments.load();
  let $isEditMode;
  let $data = [];
  const teamsCodes = [
    ["Graphics", "n5oc9r2"],
    ["Critical thinking", "6ek7ulb"],
    ["Embedded Systems", "ljtiab1"],
    ["Architecture", "mr064u5"],
  ];
  const driveLink = "https://drive.google.com/drive/folders/1QrC56oFyDboBWRCpjoFI7PedFU3ffilf";
  $createIEffect(() => {
    $isEditMode = $routePath === "/edit";
  });
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
  });
  const handleFabClick = () => {
    if ($routePath !== "/edit") {
      navigate("/edit");
    } else {
      $activeAssignment = [];
      $isModalActive = true;
    }
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
    $activeAssignment = assignment;
    $isModalActive = true;
  }
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
        <footer>
          <p>
            Made with ❤️ by <a href="https://github.com/GeeekyBoy" target="_blank">GeeekyBoy</a> in Egypt
            <br />
            Copyright © {new Date().getFullYear()} GeeekyBoy
          </p>
        </footer>
      </center>
      <FAB onClick={handleFabClick}>
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

document.body.appendChild(App());
