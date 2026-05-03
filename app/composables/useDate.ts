import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const useDate = () => {
  const formatToLocal = (dateInput: string, format = "DD.MM.YYYY HH:mm") => {
    if (!dateInput) return "";
    return dayjs.utc(dateInput).local().format(format);
  };

  return {
    formatToLocal,
    dayjs,
  };
};
