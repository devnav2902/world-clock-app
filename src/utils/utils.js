const timeZoneList = [
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Melbourne",
  "Australia/Sydney",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
];

function getCurrentTime(timeZone) {
  if (!timeZone) return "";
  return new Date().toLocaleTimeString("en-US", {
    timeZone,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeDiff(t1, t2) {
  const date1 = new Date(t1);
  const date2 = new Date(t2);

  const diff = date2.getTime() - date1.getTime();

  let msec = diff;
  const hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  const mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  const ss = Math.floor(msec / 1000);
  msec -= ss * 1000;

  // return hh + `${mm ? ": " + mm : ""}` + `${ss ? ": " + ss : ""}`;
  return hh;
}

export { timeZoneList, getCurrentTime, getTimeDiff };
