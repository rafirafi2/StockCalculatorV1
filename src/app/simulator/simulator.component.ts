import { Component, OnInit } from '@angular/core';
import { StockdataService } from '../stockdata.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { stockData } from './stockData';
import { error } from 'console';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrl: './simulator.component.css'
})
export class SimulatorComponent implements OnInit {


  constructor(private formBuilder: FormBuilder, private stockService:StockdataService, private formbuilder:FormBuilder){}

  allStockData:stockData []=[];

  simulatorForm: FormGroup;

  chartOptions


  ngOnInit(): void {
    this.stockService.getStockData().subscribe(
      respose=>{
        console.log(respose['Time Series (5min)']);
        const jsonData = respose['Time Series (5min)'];
        for(const date in jsonData){
          //console.log(date);
          const item = jsonData[date];
          //console.log(item)
          //console.log(item['1. open'])
          const extract = new stockData(date,item['1. open'],item['2. high'],item['3. low'],item['4. close'],item['5. volume'],(item['4. close']-item['1. open']));
          // const extractedData = {
          //   time: date,
          //   openPrice: item['1. open'],
          //   highPrice: item['2. high'],
          //   lowPrice: item['3. low'],
          //   closePrice: item['4. close'],
          //   volume: item['5. volume'],
          // }
          this.allStockData.push(extract)
          console.log(extract)
        }
        console.log(this.allStockData)
        this.allStockData.reverse();
      },
      error=>{console.log(error)},
      ()=>{
        this.displayData();
      }
    )

    this.simulatorForm = this.formbuilder.group({
      startDate: ['',Validators.required],
      endDate: ['',Validators.required],
      amountOfStock: ['',Validators.required]
    })

    this.chartOptions = {
      theme: "light2",
      animationEnabled: true,
      zoomEnabled: true,
      title: {
        text: "IBM Prices"
      },
      toolTip:{
        content:"x: {x}, y: {y}" ,
      },
      axisY: {
        //used for values in the millions, thousands, billions, etc.
        labelFormatter: (e: any) => {
          var suffixes = ["", "K", "M", "B", "T"];
   
          var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
          if(order > suffixes.length - 1)
            order = suffixes.length - 1;
   
          var suffix = suffixes[order];
          return "$" + (e.value / Math.pow(1000, order)) + suffix;
        }
      },
      data: [{
        type: "line",
        dataPoints: this.getData()
      }]
    }


  }

  getData(){
    const data = this.allStockData;
    let returnData = []
    for(const stock of data) {
      let date = stock.time;
      let price = stock.open.toString();
      console.log(price);
      returnData.push({ x: new Date(date) , y: parseFloat(price)});
    }
    console.log(returnData);
    return returnData;
  }

  dataReady = false;


  displayData() {
    this.dataReady = true;
  }

  getStockData(date):stockData{

    for(const stock of this.allStockData){
      if(stock.time==date){
        return stock;
      }
    }

  }


  startStockPrice
  showStockPrice = false;
  startSelection(){
    this.showStockPrice = true
    const start = this.simulatorForm.get('startDate').value;
    const currentStock = this.getStockData(start)

    this.startStockPrice = currentStock.open;
  }

  amountOfStock
  showTotal = false

  amountChange(){

    this.showTotal = true;
    const amount = this.simulatorForm.get('amountOfStock').value;
    this.amountOfStock = amount;

  }

  showEnd = false;
  currStockPrice
  endSelection(){
    this.showEnd =true;
    const end = this.simulatorForm.get('endDate').value;
    const currentStock = this.getStockData(end)
    this.currStockPrice = currentStock.close

  }


  finish = false
  profit = false;
  loss = false;
  invalid = false;
  returnValue //should basically be the amount * end date stock price
  difference // difference of total invested between start and end
  percentDiff // percentage of difference between intial investment toal and end
  calculate(){

    const startDate = new Date(this.simulatorForm.get('startDate').value);
    const endDate = new Date(this.simulatorForm.get('endDate').value);
    if(startDate>endDate){
      this.invalid = true
      this.finish = false;
      this.profit = false;
      this.loss = false;
      return;
    }

    this.finish = true;
    this.invalid = false;

    const startInvestment = this.startStockPrice * this.amountOfStock;
    const endInvestment = this.currStockPrice * this.amountOfStock;
    this.returnValue = endInvestment;
    this.difference = endInvestment - startInvestment;
    this.percentDiff = ((endInvestment-startInvestment)/startInvestment) *100;

    if(startInvestment>endInvestment){
      this.loss = true;
      this.profit = false;
    }else{
      this.loss = false;
      this.profit = true;
    }



  }

}
