import { SourceModel } from "./source.model";

export interface ChatMessageModel {
  messageText: string;
  sentByBot?: boolean;
  imageUrl?: string;
  sourceId?: string;
  polycubeFile?: string;
  source?: SourceModel;
}
