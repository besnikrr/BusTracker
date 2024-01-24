import { Pipe, PipeTransform } from "@angular/core";
import { getDirection } from "../../vehicleDirection";

@Pipe({ name: "direction", standalone: true })
export class DirectionPipe implements PipeTransform {
  transform(heading: number): string {
    return getDirection(heading);
  }
}
