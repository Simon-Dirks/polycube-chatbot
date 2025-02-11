import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  constructor() {}

  public getAllIndices(arr, val): number[] {
    const indices = [];
    let i = -1;
    while (true) {
      i = arr.indexOf(val, i + 1);
      if (i !== -1) {
        indices.push(i);
      } else {
        break;
      }
    }
    return indices;
  }
}
