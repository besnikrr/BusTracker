import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "driverFullName", standalone: true })
export class DriverFullNamePipe implements PipeTransform {
  transform(driver: any): string {
    const middleName = driver?.middleName ? driver?.middleName?.charAt(0) + ". " : " ";
    return driver?.lastName + ", " + driver?.firstName + " " + middleName;
  }
}
