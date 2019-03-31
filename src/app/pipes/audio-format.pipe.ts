import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'audioFormat'
})
export class AudioFormatPipe implements PipeTransform {

  transform(voice: string, args?: any): any {
    const fileExt = voice.split('.').pop();
    return `audio/${fileExt}`;
  }

}
