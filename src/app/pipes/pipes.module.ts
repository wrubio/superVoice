import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioFormatPipe } from './audio-format.pipe';

@NgModule({
  declarations: [AudioFormatPipe],
  imports: [
    CommonModule
  ],
  exports: [
    AudioFormatPipe
  ]
})
export class PipesModule { }
