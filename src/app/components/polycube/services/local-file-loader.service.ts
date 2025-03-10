import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";
import { environment } from "../../../../environments/environment";

@Injectable()
export class LocalFileLoaderService {
  data: any = null;

  constructor(public http: HttpClient) {}

  load = (fileUrl: string): Promise<any> => {
    console.log("Loading data for:", fileUrl);
    // const url = `https://script.google.com/macros/s/AKfycbzXuKsFGFhIBQWH8fG21Gi78FE_F-On1QMwtGOFIiqg8na_XA/exec?spreadsheetid=${fileUrl}`;

    // don't have the data yet
    return new Promise((resolve: any, reject: any) => {
      this.http.get(fileUrl).subscribe(
        (data: any) => {
          // console.log(data);
          data.forEach((item: any) => {
            // convert target_nodes to string
            const targetNodes = `${item.target_nodes}`; // forcing to string so that a single fileUrl does not get parsed as a number just yet
            item.date_time = moment(item.date_time).toDate();
            item.target_nodes = targetNodes.split(";").map(Number);
            item.category_1 =
              item.category_1 === "" ? "No Category" : item.category_1;
            // item.label = item.label.split(';').map(Number);
            // TODO: data.date_range, data.range
          });
          console.log("Data:", data);
          resolve(data);
        },
        (error: any) => {
          reject(error.message);
        }
      );
    });
  };
}
