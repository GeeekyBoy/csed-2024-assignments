export const load = () => {
  return (localStorage.getItem("pending") || "").split(",");
};

export const toggle = (id) => {
  const pending = load();
  const index = pending.indexOf(id);
  if (index == -1) {
    pending.push(id);
  } else {
    pending.splice(index, 1);
  }
  localStorage.setItem("pending", pending.join(","));
  return pending;
};

export const sync = (assignments) => {
  const ids = assignments.map((assignment) => assignment[0]);
  const pending = load().filter((id) => ids.includes(id));
  localStorage.setItem("pending", pending.join(","));
  return pending;
};
