import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ChatMessageModel} from '../../../models/chat-message.model';
import {SourceService} from '../../../services/source.service';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-chat-message-bubble',
    templateUrl: './chat-message-bubble.component.html',
    styleUrls: ['./chat-message-bubble.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatMessageBubbleComponent implements OnInit {
    @Input() messageIdx: number;
    @Input() message: ChatMessageModel;
    environment = environment;

    constructor(private sources: SourceService) {
    }

    ngOnInit() {
        if (this.message.sourceId && !this.message.source) {
            this.message.source = this.sources.getSourceById(this.message.sourceId);
        }
    }

}
