export class User {
  Id: number;
  First: string;
  Last: string;
  Projects: Project[];
}

export class TimeSheet {
  Id: number;
  TicketId: number;
  LoggedTime: number;
  Date: string;
  Comment: string;
  Dirty: boolean;
}


export class Ticket {
  Id: number;
  Name: string;
  TimeSheets: TimeSheet[];
  StatusId: number;
  ResponsibleId: number;
  TypeId: number;
  ProjectId: number;
  ReporterId: number;
}

export interface Project {
  Id: number;
  Name: string;
  Tickets: Ticket[];
}

export const StatusIdToName: Map<number, string> = new Map([[1, 'Open'], [2, 'Development'],
  [3, 'Ready for QA'], [4, 'Test'], [5, 'Closed']]);

export function isNullOrUndefined(object: any): boolean {
  return (object === null || object === undefined );
}

export function extractServerErrorMessage(serverError: any): string {
  try {
    return JSON.parse(serverError._body).Message;
  } catch (e) {
    return 'Something went wrong on server side...';
  }
}
