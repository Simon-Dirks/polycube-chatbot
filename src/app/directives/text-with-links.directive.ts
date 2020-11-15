import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {LinksInPlaintextService} from '../services/links-in-plaintext.service';

@Directive({
    selector: '[appTextWithLinks]',
})
export class TextWithLinksDirective implements OnInit {
    @Input('appTextWithLinks') plainTextWithLinks: string;

    constructor(
        private linksInPlaintext: LinksInPlaintextService,
        private elRef: ElementRef,
        private renderer: Renderer2,
        private vc: ViewContainerRef,
    ) {
    }

    ngOnInit() {
        this.replaceLinksInText();
    }

    private async replaceLinksInText() {
        this.linksInPlaintext.replaceLinksInText(this.renderer,
            this.vc,
            this.elRef,
            this.plainTextWithLinks
        );
    }
}
