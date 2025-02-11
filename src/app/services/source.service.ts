import { Injectable } from "@angular/core";
import { SourceModel } from "../models/source.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SourceService {
  allSources: SourceModel[];

  constructor(private http: HttpClient) {
    this.loadSourcesFromFile();
  }

  async loadSourcesFromFile() {
    this.allSources = await this.http
      .get<SourceModel[]>("/assets/data/sources.json")
      .toPromise();
    console.log("Sources:", this.allSources);
  }

  public getSourceById(id: string): SourceModel {
    return this.allSources.find((source) => source.id === id);
  }
}
