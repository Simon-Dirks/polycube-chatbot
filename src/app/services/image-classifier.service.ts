import {Injectable} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ImageClassifierService {
    mobileNet;
    classifier;
    loadingModel = false;
    loadingModelStatus = 'Loading model...';
    lastPrediction = '';
    readonly CLASSES = ['De Peer', 'The Memory of the Woman-Child', 'Ontmoeting'];

    constructor(private http: HttpClient) {
        // this.loadModel();
    }

    async loadClassifier() {
        const tensorObj: any = await this.http.get('/assets/data/model.json').toPromise();
        Object.keys(tensorObj).forEach((key) => {
            tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024]);
        });
        this.classifier.setClassifierDataset(tensorObj);
    }

    async loadModel() {
        console.log('Loading model...');
        tf.getBackend();
        this.mobileNet = await mobilenet.load();
        console.log('Successfully loaded model, now loading classifier...');
        this.loadingModelStatus = 'Loading classifier...';
        this.classifier = knnClassifier.create();
        await this.loadClassifier();
        console.log('Successfully loaded classifier.');
        this.loadingModel = false;
    }

    async predictImageClass(imgUrl: string) {
        console.log('URL:', imgUrl);
        const imgTensor: tf.Tensor = await this.getTensorFromImageUrl(imgUrl);
        return this.predictImageClassFromTensor(imgTensor);
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

    async predictImageClassFromTensor(imgTensor): Promise<any> {
        if (!this.classifier || this.classifier.getNumClasses() <= 0) {
            return Promise.reject('Classifier not properly loaded.');
        }

        console.log('Predicting image class...');

        const activation = this.mobileNet.infer(imgTensor, 'conv_preds');
        imgTensor.dispose();
        const result = await this.classifier.predictClass(activation);
        const prediction = {
            prediction: this.CLASSES[result.label],
            probability: result.confidences[result.label]
        };
        this.lastPrediction = prediction.prediction;

        // console.log(`
        //                   prediction: ${this.CLASSES[result.label]}\n
        //                   probability: ${result.confidences[result.label]}
        //                 `);
        return Promise.resolve(prediction);
    }
}
