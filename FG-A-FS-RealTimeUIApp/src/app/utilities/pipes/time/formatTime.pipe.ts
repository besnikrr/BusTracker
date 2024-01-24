import { Pipe, PipeTransform } from "@angular/core";
import { format, formatDistance } from "date-fns";
import { TIME_FORMAT, TIME_FORMAT_LONG } from "../../date.format";

@Pipe({ name: "formatTime", standalone: true })
export class FormatTimePipe implements PipeTransform {
  transform(value: string, formatLength: string): string {
    switch (formatLength) {
      case "short":
        return format(new Date(value), TIME_FORMAT);
      case "distance":
        return formatDistance(new Date(value), new Date(), {
          addSuffix: true,
        });
      default:
        return format(new Date(value), TIME_FORMAT_LONG);
    }
  }
}
