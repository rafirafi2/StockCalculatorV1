import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StockdataService } from '../stockdata.service';

@Component({
  selector: 'app-sip',
  templateUrl: './sip.component.html',
  styleUrl: './sip.component.css'
})
export class SipComponent implements OnInit {


  sipSimpleForm: FormGroup

  sipComplexForm: FormGroup

  formButton:boolean = true;
  simpleReturns

  constructor(private formBuilder: FormBuilder, private stockService:StockdataService) {}


  ngOnInit(): void {
    
    this.sipSimpleForm = new FormGroup(
      {
        investment:new FormControl(null,[Validators.required]),
        percentage:new FormControl(null,[Validators.required]),
        months:new FormControl(null,(Validators.required))
      }
    );


    //formbuilder easier for form array creation
    this.sipComplexForm = this.formBuilder.group(
      {
        investment:['', Validators.required],
        months: ['', Validators.required],
        percentages: this.formBuilder.array([]),
        additionalinvestments: this.formBuilder.array([]),
        customInvest: [''],
        double: this.formBuilder.array([])
      }
    )
    
  }

  switchForms(formType:string){
    if(formType=='simple'){
      this.formButton=true;
    }else{
      this.formButton=false;
    }
  }

  onSubmitSimple(){
    const invest = this.sipSimpleForm.get('investment').value;
    const percentage = this.sipSimpleForm.get('percentage').value/100;
    const months = this.sipSimpleForm.get('months').value;

    let returns = invest;
    for(let i=1;i<=months;i++){
      let curr = returns*percentage;
      let fin = curr+returns;
      returns = fin+invest;
      console.log(returns)
    }
    returns = returns-invest;
    this.simpleReturns = "Total Returns: "+returns.toFixed(2)+"\n\n"
    +"Total Invested: "+invest*months;
  }


  intialInvestment = 0

  onInvestChange(event){
    console.log(event);
    this.intialInvestment = event.target.value;
    console.log(this.intialInvestment)
  }

  currentStyle = 'none'

  onCustomChange(event){
    console.log(event.target.value)
    this.currentStyle = event.target.value;
  }

  // handles month change
  onMonthsChange(event) {
    console.log(event)
    const percentages = this.sipComplexForm.get('percentages') as FormArray;
    const investments = this.sipComplexForm.get('additionalinvestments') as FormArray;
    const double = this.sipComplexForm.get('double') as FormArray;
    console.log(investments)
    percentages.clear();
    investments.clear();
    for (let i = 0; i < event.target.value; i++) {
      percentages.push(this.formBuilder.control('',Validators.required))
      if(this.currentStyle=='custom'){
        investments.push(this.formBuilder.control(this.intialInvestment,Validators.required));
        
      }

      const newControl = this.formBuilder.group({
        initialValue: 100,
        test: 20
      });
      (this.sipComplexForm.get('double') as FormArray).push(newControl)
    }
  }

  get percentages(): FormArray | null {
    return this.sipComplexForm.get('percentages') as FormArray | null;
  }

  get additionalinvestments(): FormArray | null {
    return this.sipComplexForm.get('additionalinvestments') as FormArray | null;
  }

  get double(): FormArray|null{
    return this.sipComplexForm.get('double') as FormArray | null;
  }


  complexReturns

  onSubmitComplex(){

    const percentages = this.sipComplexForm.get('percentages').value;
    const invest = this.sipComplexForm.get('investment').value;
    const months = this.sipComplexForm.get('months').value;
    const additional = this.sipComplexForm.get('additionalinvestments').value;
    
    let totalAddition = 0;

    let returns = invest;
    console.log(percentages)
    for(let i=0;i<percentages.length;i++){

      let currentPercent = percentages[i]/100;

      let curr = returns*currentPercent;
      let fin = curr+returns;
      if(this.currentStyle=='continous'){
        returns = fin+invest;
      }else if(this.currentStyle=='custom'){
        returns = fin+parseInt(additional[i]);
        totalAddition+=additional[i];
      }else{
        returns = fin;
      }
      
      console.log(returns)
    }
    //offset extra investment
    if(this.currentStyle=='continous'){
    returns = returns-invest;
    this.complexReturns = "Total Returns: "+returns.toFixed(2)+"\n\n"
    +"Total Invested: "+invest*months;
    }else if(this.currentStyle=='custom'){

      let returnTotal = parseInt(invest)+totalAddition
      console.log("return Total Custom:"+ returnTotal)

      this.complexReturns = "Total Returns: "+returns.toFixed(2)+"\n\n"
    +"Total Invested: "+returnTotal;
    }else{
      this.complexReturns = "Total Returns: "+returns.toFixed(2)+"\n\n"
    +"Total Invested: "+invest;
    }

    console.log(this.complexReturns)

  }






}
