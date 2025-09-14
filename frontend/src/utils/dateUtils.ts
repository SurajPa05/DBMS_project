import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

export const formatEventDate = (date: string) => {
  return dayjs(date).format("MMM DD, YYYY at h:mm A")
}

export const formatRelativeDate = (date: string) => {
  return dayjs(date).fromNow()
}

export const isEventUpcoming = (date: string) => {
  return dayjs(date).isAfter(dayjs())
}

export const isEventToday = (date: string) => {
  return dayjs(date).isSame(dayjs(), "day")
}

export const getEventStatus = (date: string) => {
  const eventDate = dayjs(date)
  const now = dayjs()

  if (eventDate.isBefore(now)) {
    return "past"
  } else if (eventDate.isSame(now, "day")) {
    return "today"
  } else {
    return "upcoming"
  }
}
