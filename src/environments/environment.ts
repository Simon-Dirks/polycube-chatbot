// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    timeDelayPerKeystroke: 12, // ms
    minDelayForMessage: 250, // ms
    objectRecognitionApiUrl: 'https://fathomless-anchorage-97079.herokuapp.com',
    polycubeFile: '/assets/data/polycube/november-17th/dutch-anthropologist-exhibition-output.json',
    mapbox: {
        accessToken: 'pk.eyJ1Ijoic2ltb25kaXJrcyIsImEiOiJjazdkazBxeXYweDluM2RtcmVkZzVsMGFoIn0.6fDvUqYNALXv5wJtZjjxrQ',
        polycubeAccessToken: 'pk.eyJ1IjoidmVsaXRjaGtvIiwiYSI6ImNqdDZ6OGpvZjBrdjczenJ1NXh5MXViM3oifQ.OSGgBWaFk2qexD6LnCJUTg',
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
