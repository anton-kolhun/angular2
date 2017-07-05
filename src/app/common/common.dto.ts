export class User {
  Id: number;
  First: string;
  Last: string;
  Projects: Project[]
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

export class Project {
  Id: number;
  Name: string;
  Tickets: Ticket[];
}

export const StatusIdToName: Map<number, string> = new Map([[1, 'Open'], [2, 'Development'], [3, 'Ready for QA'], [4, 'Test'], [5, 'Closed']])
