import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as tf from '@tensorflow/tfjs';

@Component({
    selector: 'app-object-recognition',
    templateUrl: './object-recognition.component.html',
    styleUrls: ['./object-recognition.component.scss'],
})
export class ObjectRecognitionComponent implements OnInit, AfterViewInit {
    @ViewChild('webcam') webcamElem;
    mobileNet;
    classifier;
    loadingModel = true;
    readonly CLASSES = ['Uke', 'Guitar'];

    constructor() {
    }

    ngOnInit() {
        this.loadModel().then(() => {
            this.trainModel();
            this.startClassifierLoop();
        });
    }

    ngAfterViewInit(): void {
        this.initWebcamStream();
    }

    public isLoading() {
        return this.loadingModel;
    }

    async loadModel() {
        tf.getBackend();
        this.mobileNet = await mobilenet.load();
        this.classifier = knnClassifier.create();
        this.loadingModel = false;
    }

    trainModel() {
        const ukeDir = '/assets/img/classes/uke/';
        const guitarDir = '/assets/img/classes/guitar/';

        for (let i = 0; i <= 10; i++) {
            this.trainModelByImageUrl(0, ukeDir + i.toString() + '.jpeg');
            this.trainModelByImageUrl(1, guitarDir + i.toString() + '.jpeg');
        }
    }

    trainModelByImageUrl(classId: number, imgUrl: string) {
        // TODO: Load images from URL without adding them to the body?
        const img = new Image();
        img.src = imgUrl;
        document.body.appendChild(img);
        img.onload = () => {
            const imgTensor: tf.Tensor = tf.browser.fromPixels(img, 3);
            this.trainExample(classId, imgTensor);
        };
    }

    async predict(): Promise<boolean> {
        if (this.classifier.getNumClasses() > 0) {
            console.log('Predicting...');

            // Get webcam image
            const webcam = await tf.data.webcam(this.webcamElem.nativeElement);
            const img = await webcam.capture();

            // Get the activation from mobilenet from the webcam.
            const activation = this.mobileNet.infer(img, 'conv_preds');

            // Get the most likely class and confidence from the classifier module.
            const result = await this.classifier.predictClass(activation);

            document.getElementById('console').innerText = `
              prediction: ${this.CLASSES[result.label]}\n
              probability: ${result.confidences[result.label]}
            `;

            // Dispose the tensor to release the memory.
            img.dispose();
        } else {
            console.warn('Can not predict without training data.');
            return Promise.resolve(false);
        }

        return Promise.resolve(true);
    }

    initWebcamStream() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true})
                .then((stream) => {
                    this.webcamElem.nativeElement.srcObject = stream;
                })
                .catch((err) => {
                    console.error('Something went wrong while initializing the webcam stream.', err);
                });
        }
    }

    async trainExample(classId: number, imgTensor: tf.Tensor): Promise<boolean> {
        // Get the intermediate activation of MobileNet 'conv_preds' and pass that
        // to the KNN classifier.
        const activation = this.mobileNet.infer(imgTensor, true);

        // Pass the intermediate activation to the classifier.
        this.classifier.addExample(activation, classId);

        // Dispose the tensor to release the memory.
        imgTensor.dispose();

        console.log('Successfully added example for class', this.CLASSES[classId]);
        return Promise.resolve(true);
    }

    async startClassifierLoop() {
        setInterval(async () => {
            await this.predict();
            await tf.nextFrame();
        }, 500);
    }
}
