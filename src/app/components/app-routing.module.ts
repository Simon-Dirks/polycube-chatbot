import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat/chat.component';
import {ChatModule} from './chat/chat.module';
import {ObjectRecognitionComponent} from './object-recognition/object-recognition.component';
import {ObjectRecognitionModule} from './object-recognition/object-recognition.module';

const routes: Routes = [
    {
        path: 'chat',
        component: ChatComponent
    },
    {
        path: 'objects',
        component: ObjectRecognitionComponent
    },
    {
        path: '',
        redirectTo: 'objects',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
        ChatModule,
        ObjectRecognitionModule
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
