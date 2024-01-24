import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppConfig } from "src/app/app-config";
import { AppModule } from "src/app/app.module";

AppConfig.configure();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
