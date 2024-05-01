import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SipComponent } from './sip/sip.component';
import { LumpsumComponent } from './lumpsum/lumpsum.component';
import { SimulatorComponent } from './simulator/simulator.component';


const routes: Routes = [
    { path: 'sip', component: SipComponent },
    { path: 'lumpsum', component: LumpsumComponent },
    { path: 'simulator', component: SimulatorComponent}
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }