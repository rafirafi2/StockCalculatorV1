import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockdataService {

  constructor(private http: HttpClient) { }

  ibmStockDemoData = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo";

  getStockData(){
    return this.http.get(this.ibmStockDemoData);
  }


}
