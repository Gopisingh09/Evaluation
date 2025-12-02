import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingRoutingModule } from './landing-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LandingPageComponent  // Add LandingPageComponent here
  ],
  imports: [
    CommonModule,
    RouterModule,
    LandingRoutingModule,
    FormsModule
  ]
})
export class LandingModule { }
