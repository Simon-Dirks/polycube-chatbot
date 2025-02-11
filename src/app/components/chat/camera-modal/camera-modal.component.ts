import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { CameraService } from "../../../services/camera.service";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-camera-modal",
  templateUrl: "./camera-modal.component.html",
  styleUrls: ["./camera-modal.component.scss"],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CameraModalComponent implements OnInit {
  @Input() controller: ModalController;

  constructor(public camera: CameraService) {}

  ngOnInit() {
    this.camera.trigger.asObservable().subscribe(() => {
      this.controller.dismiss();
    });
  }

  closeModal() {
    this.controller.dismiss();
  }
}
