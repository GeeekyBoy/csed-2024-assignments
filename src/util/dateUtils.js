export const timestampToDate = (timestamp) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  let month = date.getMonth() + 1;
  let dayOfMonth = date.getDate();
  const year = date.getFullYear();
  month = month < 10 ? "0" + month : month;
  dayOfMonth = dayOfMonth < 10 ? "0" + dayOfMonth : dayOfMonth;
  return year + "-" + month + "-" + dayOfMonth;
}

export const timestampToTime = (timestamp) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  return hour + ":" + minute;
}

export const dateToString = (date, showTime, beforeSection) => {
  const day = date.getDay();
  const month = date.getMonth() + 1;
  const dayOfMonth = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  minute = minute < 10 ? "0" + minute : minute;
  const strTime = hour + ":" + minute + " " + ampm;
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return (
    days[day] +
    " " +
    month +
    "/" +
    dayOfMonth +
    (showTime ? " @ " + strTime : "") +
    (beforeSection ? " before section" : "")
  );
}