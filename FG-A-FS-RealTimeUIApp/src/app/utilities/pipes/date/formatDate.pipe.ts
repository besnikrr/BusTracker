import { Pipe, PipeTransform } from "@angular/core";
import { format } from "date-fns";
import { DATE_FORMAT } from "../../date.format";

@Pipe({ name: "formatDate", standalone: true })
export class FormatDatePipe implements PipeTransform {
  transform(value: Date): string {
    return format(value, DATE_FORMAT);
  }
}
