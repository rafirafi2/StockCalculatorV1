import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lumpsum',
  templateUrl: './lumpsum.component.html',
  styleUrl: './lumpsum.component.css'
})
export class LumpsumComponent implements OnInit {

  lumpsumForm:FormGroup
  displayHeader = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    

    this.lumpsumForm = this.formBuilder.group(
      {
        investment:['', Validators.required],
        months: ['', Validators.required],
        percentages: this.formBuilder.array([]),
        additional: this.formBuilder.array([])
      }
    )

  }


  onMonthsChange(event){

    this.displayHeader = true;
    const percentages = this.lumpsumForm.get('percentages') as FormArray;
    const additional = this.lumpsumForm.get('additional') as FormArray;
    additional.clear();
    percentages.clear();
    for (let i = 0; i < event.target.value; i++) {
      percentages.push(this.formBuilder.control('',Validators.required))
      additional.push(this.formBuilder.control('0',Validators.required))
    }

  }


  get percentages(): FormArray | null {
    return this.lumpsumForm.get('percentages') as FormArray | null;
  }

  get additional(): FormArray | null {
    return this.lumpsumForm.get('additional') as FormArray | null;
  }


  total
  chartOptions
  chartData = []
  displayChart = false

  onSubmit(){

    this.displayChart = true
    const percentages = this.lumpsumForm.get('percentages').value;
    const invest = this.lumpsumForm.get('investment').value;
    const months = this.lumpsumForm.get('months').value;
    const additional = this.lumpsumForm.get('additional').value;

    let returns = invest;
    let monthsIterator = 0;
    this.chartData.push({ x: monthsIterator , y: parseFloat(returns)});
    monthsIterator++;
    let addInvestments = 0;

    for(let i=0;i<percentages.length;i++){

      let currentPercent = percentages[i]/100;

      let curr = returns*currentPercent;
      let fin = curr+returns;
      returns = fin;
      this.chartData.push({ x: monthsIterator , y: parseFloat(returns)});
      let add = additional[i];
      if(parseInt(add)>0){
        returns = returns+add;
        addInvestments+=add;
      }
      console.log(returns)
      monthsIterator++;
    }

    let addedTotal = (invest)+addInvestments;

    this.total = "Total Returns: "+returns.toFixed(2)+"\n\n"
    +"Total Invested: "+addedTotal;


    this.chartOptions = {
      theme: "light2",
      animationEnabled: true,
      zoomEnabled: true,
      title: {
        text: "LumpSum Investment Chart"
      },
      toolTip:{
        content:"Month {x}, Investment Total: {y}" ,
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
        dataPoints: this.chartData
      }]
    }


  }





}
