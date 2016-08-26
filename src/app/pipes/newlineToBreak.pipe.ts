import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'newlineToBreak'
})
export class NewlineToBreakPipe implements PipeTransform {
    transform(value: any, args: any[]): any {
        if(typeof(value) === 'string') {
            return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
        } else {
            return value;
        }
    }
}