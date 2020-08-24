import {Injectable} from '@angular/core';
import {
    Plugins, CameraResultType, Capacitor, FilesystemDirectory,
    CameraPhoto, CameraSource
} from '@capacitor/core';
import {ChatService} from './chat.service';
import {ObjectRecognitionService} from './object-recognition.service';

const {Camera, Filesystem, Storage} = Plugins;

@Injectable({
    providedIn: 'root'
})
export class CameraService {

    constructor(private chatService: ChatService,
                private objectRecognition: ObjectRecognitionService) {
    }

    async takePhoto(): Promise<CameraPhoto> {
        const photo: CameraPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        });

        return Promise.resolve(photo);
    }
}
