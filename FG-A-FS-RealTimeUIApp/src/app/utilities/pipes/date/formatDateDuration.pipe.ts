import { Pipe, PipeTransform } from "@angular/core";
import { differenceInSeconds } from "date-fns";

@Pipe({ name: "durationDate" })
export class DurationPipe implements PipeTransform {
  transform(actualDeparture: string, actualArrival: string): string {
    const difference = differenceInSeconds(new Date(actualDeparture), new Date(actualArrival));
    const hours = Math.floor(difference / 3600);
    const minutes = Math.floor((difference % 3600) / 60);
    const seconds = Math.round(difference % 60);
    //Handling the case to show the format to (h m s) if the differenceInSeconds is greater then 3600 sec (1 hour)
    if (difference >= 3600) {
      return `${hours} h ${minutes} m ${seconds} s`;
    }
    if (difference > 0) {
      return `${minutes} m ${seconds} s`;
    }
    return "";
  }
}
