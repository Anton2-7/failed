import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "dayjs/locale/ru";

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.locale("ru");

export default dayjs;
