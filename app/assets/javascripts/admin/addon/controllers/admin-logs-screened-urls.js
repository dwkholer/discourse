import { action } from "@ember/object";
import Controller from "@ember/controller";
import ScreenedUrl from "admin/models/screened-url";
import { exportEntity } from "discourse/lib/export-csv";
import { outputExportResult } from "discourse/lib/export-result";

export default class AdminLogsScreenedUrlsController extends Controller {
  loading = false;

  show() {
    this.set("loading", true);
    ScreenedUrl.findAll().then((result) => {
      this.set("model", result);
      this.set("loading", false);
    });
  }

  @action
  exportScreenedUrlList() {
    exportEntity("screened_url").then(outputExportResult);
  }
}
