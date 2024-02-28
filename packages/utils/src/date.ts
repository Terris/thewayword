import dayjs from "dayjs";

type DateProp = Date | number | string;

export function formatDate(date: DateProp, format = "MMM D, YYYY"): string {
  return dayjs(date).format(format);
}
