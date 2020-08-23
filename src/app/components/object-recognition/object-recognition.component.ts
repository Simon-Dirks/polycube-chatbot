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
    loaded = false;

    constructor() {
    }

    ngOnInit() {
        this.loadModel().then(() => {
            // this.startClassifierLoop();
        });
    }


    ngAfterViewInit(): void {
        this.initWebcamStream();
    }

    async predict() {
        const webcam = await tf.data.webcam(this.webcamElem.nativeElement);

        if (this.classifier.getNumClasses() > 0) {
            const img = await webcam.capture();
            // console.log(img);

            // Get the activation from mobilenet from the webcam.
            const activation = this.mobileNet.infer(img, 'conv_preds');
            // Get the most likely class and confidence from the classifier module.
            const result = await this.classifier.predictClass(activation);

            const classes = ['Uke', 'Guitar'];
            document.getElementById('console').innerText = `
              prediction: ${classes[result.label]}\n
              probability: ${result.confidences[result.label]}
            `;

            // Dispose the tensor to release the memory.
            img.dispose();
        } else {
            console.warn('Can not predict without training data.');
        }
    }

    //
    // async startClassifierLoop() {
    //     const webcam = await tf.data.webcam(this.webcamElem.nativeElement);
    //
    //     while (true) {
    //         if (this.classifier.getNumClasses() > 0) {
    //             const img = await webcam.capture();
    //             // console.log(img);
    //
    //             // Get the activation from mobilenet from the webcam.
    //             const activation = this.mobileNet.infer(img, 'conv_preds');
    //             // Get the most likely class and confidence from the classifier module.
    //             const result = await this.classifier.predictClass(activation);
    //
    //             const classes = ['Uke', 'Guitar'];
    //             document.getElementById('console').innerText = `
    //       prediction: ${classes[result.label]}\n
    //       probability: ${result.confidences[result.label]}
    //     `;
    //
    //             // Dispose the tensor to release the memory.
    //             img.dispose();
    //         }
    //
    //         await tf.nextFrame();
    //     }
    // }

    initWebcamStream() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true})
                .then((stream) => {
                    this.webcamElem.nativeElement.srcObject = stream;
                })
                .catch((err) => {
                    console.log('Something went wrong!');
                });
        }
    }

    async loadModel() {
        tf.getBackend();
        this.mobileNet = await mobilenet.load();
        this.classifier = knnClassifier.create();
        this.loaded = true;
        console.log(this.mobileNet, this.classifier);
    }

    async addExample(classId: number) {
        // Capture an image from the web camera.
        const webcam = await tf.data.webcam(this.webcamElem.nativeElement);
        const img = await webcam.capture();

        // Get the intermediate activation of MobileNet 'conv_preds' and pass that
        // to the KNN classifier.
        const activation = this.mobileNet.infer(img, true);

        // Pass the intermediate activation to the classifier.
        this.classifier.addExample(activation, classId);

        // Dispose the tensor to release the memory.
        img.dispose();

        console.log('Successfully added example for class', classId);
    }
}
