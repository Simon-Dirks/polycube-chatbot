import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ObjectRecognitionService {
    mobileNet;
    classifier;
    loadingModel = true;
    amtTrainingExamplesBeingProcessed = 0;
    readonly CLASSES = ['De Peer', 'The Memory of the Woman-Child', 'Ontmoeting'];

    constructor() {
        this.loadModel().then(() => {
            this.loadingModel = false;
            this.trainModel();
        });
    }

    async loadModel() {
        tf.getBackend();
        this.mobileNet = await mobilenet.load();
        this.classifier = knnClassifier.create();
        this.loadingModel = false;
    }

    trainModel() {
        // Note: Has to match the order of CLASSES
        const trainingDirs = ['/assets/img/classes/de-peer/',
            '/assets/img/classes/the-memory-of-the-woman-child/',
            '/assets/img/classes/ontmoeting/'];

        for (let classId = 0; classId < 3; classId++) {
            for (let i = 1; i <= 49; i++) {
                this.amtTrainingExamplesBeingProcessed++;

                let fileName = i.toString();
                if (fileName.length < 2) {
                    fileName = '00' + fileName;
                } else if (fileName.length < 3) {
                    fileName = '0' + fileName;
                }
                fileName = trainingDirs[classId] + 'ezgif-frame-' + fileName + '.jpg';

                this.addTrainingExample(classId, fileName);
            }
        }

    }

    async addTrainingExample(classId: number, imgUrl: string): Promise<boolean> {
        const imgTensor: tf.Tensor = await this.getTensorFromImageUrl(imgUrl);
        const activation = this.mobileNet.infer(imgTensor, true);
        this.classifier.addExample(activation, classId);
        imgTensor.dispose();

        console.log('Successfully added example for class', this.CLASSES[classId]);
        this.amtTrainingExamplesBeingProcessed--;
        return Promise.resolve(true);
    }

    async getTensorFromImageUrl(imageUrl: string): Promise<tf.Tensor> {
        const img = new Image();
        img.src = imageUrl;

        return new Promise((resolve, reject) => {
            img.onload = () => {
                const imgTensor: tf.Tensor = tf.browser.fromPixels(img, 3);
                resolve(imgTensor);
            };
            img.onerror = reject;
        });
    }


    async predictImageClass(imgUrl: string): Promise<string> {
        if (this.classifier.getNumClasses() <= 0) {
            return Promise.reject('No training examples added yet.');
        }

        console.log('Predicting image class...');

        const imgTensor: tf.Tensor = await this.getTensorFromImageUrl(imgUrl);
        const activation = this.mobileNet.infer(imgTensor, 'conv_preds');
        const result = await this.classifier.predictClass(activation);

        imgTensor.dispose();

        alert(`
              prediction: ${this.CLASSES[result.label]}\n
              probability: ${result.confidences[result.label]}
            `);

        return Promise.resolve(this.CLASSES[result.label]);
    }
}
