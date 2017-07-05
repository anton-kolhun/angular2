import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DashboardService} from "./dashboard.service";
import {Project, StatusIdToName, Ticket} from "../common/common.dto";
import {isNullOrUndefined} from "util";
import {AuthenticationService} from "../authentication/authentication.service";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {

  project: Project = new Project();
  tickets: Ticket[] = [];
  ticketsByStatusId: any = {}
  IdToName: Map<number, string> = StatusIdToName;
  allStatusIds: number[] = [];
  errorMessage: string;
  activeTicket: Ticket = new Ticket();

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.IdToName.forEach((value, key) => {
      this.allStatusIds.push(key);
    });
    this.route.params
      .subscribe(params => {
          let projectId = params['projectId']
          this.initDashboardState(projectId);
        }
      )
  }


  moveTicket(event: any, ticketStatusId: number) {
    this.errorMessage = null;
    let ticketToUpdate: Ticket = event.dragData[0];
    ticketToUpdate.StatusId = ticketStatusId;
    this.dashboardService.createOrUpdateTicket(ticketToUpdate)
      .subscribe(success => {
          this.ticketsByStatusId[ticketStatusId].push(event.dragData[0])
          let indexToRemove: number = -1;
          for (let i = 0; i < this.ticketsByStatusId[event.dragData[1]].length; i++) {
            let ticket: Ticket = this.ticketsByStatusId[event.dragData[1]][i];
            if (ticket.Id == event.dragData[0].Id) {
              indexToRemove = i;
              break;
            }
          }
          this.ticketsByStatusId[event.dragData[1]].splice(indexToRemove, 1);
        },
        error => {
          this.errorMessage = JSON.parse(error._body).Message;
        })
  }

  createOrUpdateTicket() {
    this.errorMessage = null;
    if (isNullOrUndefined(this.activeTicket.Id)) {
      this.activeTicket.ResponsibleId = this.authService.getLoggedUser().Id;
      this.activeTicket.TypeId = 1;
      this.activeTicket.ProjectId = this.project.Id;
      this.activeTicket.ReporterId = this.authService.getLoggedUser().Id;
      this.activeTicket.StatusId = 1;
    }

    this.dashboardService.createOrUpdateTicket(this.activeTicket)
      .subscribe(success => {
          this.initDashboardState(this.project.Id);
        },
        error => {
          this.errorMessage = JSON.parse(error._body).Message;
        })
  }

  initDashboardState(projectId: number) {
    this.dashboardService.getUser()
      .subscribe(user => {
          let matchingProject: Project[] = user.Projects
            .filter(proj => {
              return proj.Id == projectId
            });
          this.project = matchingProject[0];
          this.tickets = [];
          this.ticketsByStatusId = {};
          this.IdToName.forEach((value, key) => {
            this.ticketsByStatusId[key] = [];
          });
          this.project.Tickets.forEach(ticket => {
            this.tickets.push(ticket)
            this.ticketsByStatusId[ticket.StatusId].push(ticket);
          })
        }
      )

  }

  setTicketToModify(ticket: Ticket[]): void {
    this.activeTicket = JSON.parse(JSON.stringify(ticket));
  }

  deleteTicket(ticket: Ticket): void {
    this.dashboardService.deleteTicket(ticket)
      .subscribe(success => {
          this.initDashboardState(this.project.Id);
        },
        error => {
          this.errorMessage = JSON.parse(error._body).Message;
        })
  }

}
