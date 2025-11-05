import moment from "moment";

/* ---------------- Format a date into a "time ago" string ---------------- */
export const timeAgo = (date) => {
  if (!date) return "";
  return moment(date).fromNow();
};
