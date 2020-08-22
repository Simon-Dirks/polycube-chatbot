import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat/chat.component';
import {ChatModule} from './chat/chat.module';

const routes: Routes = [
    {
        path: 'chat',
        component: ChatComponent
    },
    {
        path: '',
        redirectTo: 'chat',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
        ChatModule
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
