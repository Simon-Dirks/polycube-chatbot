import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { WebcamImage, WebcamInitError } from "ngx-webcam";
import { ImageClassifierService } from "./image-classifier.service";
import { ModalController } from "@ionic/angular";
import { CameraModalComponent } from "../components/chat/camera-modal/camera-modal.component";

@Injectable({
  providedIn: "root",
})
export class CameraService {
  public trigger: Subject<void> = new Subject<void>();

  constructor(public imageClassifier: ImageClassifierService) {}

  async handleImage(image: WebcamImage) {
    // await this.imageClassifier.predictImageClass(image.imageAsDataUrl);
  }

  public handleInitError(error: WebcamInitError): void {
    // TODO: Hide app when no camera access has been given + give instructions on how to give it
    if (
      error.mediaStreamError &&
      error.mediaStreamError.name === "NotAllowedError"
    ) {
      alert(
        "Please allow camera access for this application to function properly."
      );
      return;
    }
    console.error(error);
    alert("Something went wrong while initializing the camera..");
  }
}
