export const load = () => {
  return (localStorage.getItem("finished") || "").split(",");
};

export const toggle = (id) => {
  const finished = load();
  const index = finished.indexOf(id);
  if (index == -1) {
    finished.push(id);
  } else {
    finished.splice(index, 1);
  }
  localStorage.setItem("finished", finished.join(","));
  return finished;
};

export const sync = (assignments) => {
  const ids = assignments.map((assignment) => assignment[0]);
  const finished = load().filter((id) => ids.includes(id));
  localStorage.setItem("finished", finished.join(","));
  return finished;
};
