import {Injectable} from '@angular/core';
import {
    Plugins, CameraResultType, Capacitor, FilesystemDirectory,
    CameraPhoto, CameraSource
} from '@capacitor/core';
import {ChatService} from './chat.service';

const {Camera, Filesystem, Storage} = Plugins;

@Injectable({
    providedIn: 'root'
})
export class CameraService {

    constructor() {
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
