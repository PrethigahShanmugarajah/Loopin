/* ---------------- Format a date into a "time ago" string ---------------- */

import moment from "moment";

export const timeAgo = (date) => {
  if (!date) return "";
  return moment(date).fromNow();
};
