import {Pipe, PipeTransform} from '@angular/core';

import {} from './timesheet.component';
import {TimeSheet} from '../common/common.object';


@Pipe({name: 'totalTs', pure: false})
export class TotalTsPipe implements PipeTransform {
  transform(ticketsToTs: Map<number, Map<string, TimeSheet>>, ticketIds: number[], strDate: string): number {
    let totalHours = 0;
    ticketIds.forEach(ticketId => {
      if (!isNaN(ticketsToTs.get(ticketId).get(strDate).LoggedTime)) {
        totalHours += ticketsToTs.get(ticketId).get(strDate).LoggedTime;
      }
    });
    return totalHours;
  }
}
