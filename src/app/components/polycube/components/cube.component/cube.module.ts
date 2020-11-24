import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CubeComponent} from './cube.component';
import {SidebarModule} from 'ng-sidebar';
import {GoogleDriveProvider} from '../../services/google.drive.service';
import {GraphPositionService} from '../../services/graph.position.service';
import {DataManager} from '../../classes/datamanager';
import {TimeSliderComponent} from '../timeslider.component/timeslider';
import {ForceDirectedComponent} from '../../util/forceDirectedSimulation/forceDirectedSimulation';
import {LocalFileLoaderService} from '../../services/local-file-loader.service';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        SidebarModule.forRoot(),
    ],
    exports: [
        CubeComponent
    ],
    declarations: [
        CubeComponent,
        TimeSliderComponent,
        ForceDirectedComponent
    ],
    providers: [GoogleDriveProvider, LocalFileLoaderService, GraphPositionService, DataManager]
})
export class CubeModule {
}
