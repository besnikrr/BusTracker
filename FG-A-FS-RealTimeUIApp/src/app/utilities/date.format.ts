import { addMinutes, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export const DATE_FORMAT = "MM/dd/yyyy";
export const TIME_FORMAT = "HH:mm";
export const TIME_FORMAT_LONG = "HH:mm:ss";
export const TIME_FORMAT_MIN = "m";
export const TIME_FORMAT_SEC = "s";
export const DATE_TIME_FORMAT = `${DATE_FORMAT} 'at' ${TIME_FORMAT}`;

export function convertTimeToMinutes(value: string): number {
  const time = value.split(":");
  return +time[0] * 60 + +time[1];
}

export function formatTimeInHours(value: number): string {
  return format(addMinutes(utcToZonedTime(new Date(0), "UTC"), value), TIME_FORMAT);
}

export function formatTimeRange(start: Date, end: Date): string {
  return formatRange(start, end, TIME_FORMAT);
}

export function formatRange(start: Date, end: Date, pattern: string): string {
  return `${format(start, pattern)} - ${format(end, pattern)}`;
}
