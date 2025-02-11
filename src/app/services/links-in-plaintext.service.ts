import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Injectable,
  Renderer2,
  ViewContainerRef,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { QuestionModel } from "../models/question.model";
import { QuestionLinkComponent } from "../components/shared/question-link/question-link.component";
import { UtilsService } from "./utils.service";
import { QuestionService } from "./question.service";

@Injectable({
  providedIn: "root",
})
export class LinksInPlaintextService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private utils: UtilsService,
    private http: HttpClient,
    private questions: QuestionService
  ) {}

  private appendNewTextElem(renderer: Renderer2, text: string, elem: any) {
    const textElem = renderer.createText(text);
    renderer.appendChild(elem, textElem);
  }

  private createClickableElem(vc: ViewContainerRef, linkText: string) {
    const linkFactory: ComponentFactory<QuestionLinkComponent> =
      this.componentFactoryResolver.resolveComponentFactory(
        QuestionLinkComponent
      );

    const linkComponent: ComponentRef<QuestionLinkComponent> =
      vc.createComponent(linkFactory);
    linkComponent.instance.linkText = linkText;

    const sourceElem: HTMLElement = linkComponent.location.nativeElement;
    return sourceElem;
  }

  private getKeywordIndices(
    plainText: string
  ): { idx: number; keyword: string; referencedQuestion: QuestionModel }[] {
    let allKeywordIndices = [];

    for (const keyword of this.questions.getAllAvailableKeywords()) {
      const keywordIndices = this.utils.getAllIndices(
        plainText.toLowerCase(),
        keyword.toLowerCase()
      );
      const keywordIndicesWithLinks = keywordIndices.map((index) => {
        return { idx: index, keyword };
      });

      allKeywordIndices = allKeywordIndices.concat(keywordIndicesWithLinks);
    }

    return allKeywordIndices.sort((a, b) => {
      return a.idx - b.idx;
    });
  }

  public replaceLinksInText(
    renderer: Renderer2,
    vc: ViewContainerRef,
    elRef: ElementRef,
    plainText: string
  ) {
    const keywordsToReplace = this.getKeywordIndices(plainText);

    let currentIdx = 0;
    for (const keywordToReplace of keywordsToReplace) {
      // Add text *before* keyword
      const textBeforeKeyword = plainText.substring(
        currentIdx,
        keywordToReplace.idx
      );
      this.appendNewTextElem(renderer, textBeforeKeyword, elRef.nativeElement);

      // Add keyword itself
      const keywordElem = this.createClickableElem(
        vc,
        keywordToReplace.keyword
      );
      renderer.appendChild(elRef.nativeElement, keywordElem);

      currentIdx = keywordToReplace.idx + keywordToReplace.keyword.length;
    }

    // Add remaining text after last found keyword
    const textAfterLastKeyword = plainText.substring(
      currentIdx,
      plainText.length
    );
    this.appendNewTextElem(renderer, textAfterLastKeyword, elRef.nativeElement);
  }
}
