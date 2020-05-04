import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventGroupBy'
})
export class EventGroupByPipe implements PipeTransform {

  transform(value: Array<any>, field: string): Array<any> {
    if (value) {
    const groupedObj = value.reduce((prev, cur) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});

    return Object.keys(groupedObj).map(key => ({ ikey: key, value: groupedObj[key] }));
  }
}
} // EOF

