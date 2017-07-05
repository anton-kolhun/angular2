import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DashboardService} from './dashboard.service';
import {extractServerErrorMessage, isNullOrUndefined, Project, StatusIdToName, Ticket} from '../common/common.object';
import {AuthenticationService} from '../authentication/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {

  project: Project;
  tickets: Ticket[] = [];
  ticketsByStatusId: any = {};
  IdToName: Map<number, string> = StatusIdToName;
  allStatusIds: number[] = [];
  errorMessage: string;
  activeTicket: Ticket;

  @ViewChild('ticketModal') ticketModal: any;

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.activeTicket = new Ticket();
    this.IdToName.forEach((value, key) => {
      this.allStatusIds.push(key);
    });
    this.route.params
      .subscribe(params => {
          const projectId = +params['projectId'];
          this.initDashboardState(projectId);
        }
      );
  }


  moveTicket(event: any, ticketStatusId: number) {
    this.errorMessage = null;
    const ticketToUpdate: Ticket = event.dragData[0];
    ticketToUpdate.StatusId = ticketStatusId;
    this.dashboardService.createOrUpdateTicket(ticketToUpdate)
      .subscribe(success => {
          this.ticketsByStatusId[ticketStatusId].push(event.dragData[0]);
          let indexToRemove: number = -1;
          for (let i = 0; i < this.ticketsByStatusId[event.dragData[1]].length; i++) {
            const ticket: Ticket = this.ticketsByStatusId[event.dragData[1]][i];
            if (ticket.Id === event.dragData[0].Id) {
              indexToRemove = i;
              break;
            }
          }
          this.ticketsByStatusId[event.dragData[1]].splice(indexToRemove, 1);
        },
        error => {
          this.errorMessage = extractServerErrorMessage(error);
        });
  }

  createOrUpdateTicket() {
    this.errorMessage = null;
    if (isNullOrUndefined(this.activeTicket.Id)) {
      this.activeTicket.ResponsibleId = this.authService.loggedUser.Id;
      this.activeTicket.TypeId = 1;
      this.activeTicket.ProjectId = this.project.Id;
      this.activeTicket.ReporterId = this.authService.loggedUser.Id;
      this.activeTicket.StatusId = 1;
    }

    this.dashboardService.createOrUpdateTicket(this.activeTicket)
      .subscribe(success => {
          this.initDashboardState(this.project.Id);
          this.ticketModal.close();
        },
        error => {
          this.errorMessage = extractServerErrorMessage(error);
        });
  }

  initDashboardState(projectId: number) {
    this.dashboardService.getUser()
      .subscribe(user => {
          const matchingProject: Project[] = user.Projects
            .filter(proj => {
              return proj.Id === projectId;
            });
          this.project = matchingProject[0];
          this.tickets = [];
          this.ticketsByStatusId = {};
          this.IdToName.forEach((value, key) => {
            this.ticketsByStatusId[key] = [];
          });
          this.project.Tickets.forEach(ticket => {
            this.tickets.push(ticket);
            this.ticketsByStatusId[ticket.StatusId].push(ticket);
          });
        }
      );

  }

  setTicketToModify(ticket: Ticket): void {
    this.activeTicket = JSON.parse(JSON.stringify(ticket));
  }

  deleteTicket(ticket: Ticket): void {
    this.dashboardService.deleteTicket(ticket)
      .subscribe(success => {
          this.initDashboardState(this.project.Id);
        },
        error => {
          this.errorMessage = extractServerErrorMessage(error);
        });
  }

  openModalWindow(): void {
    this.activeTicket = new Ticket();
    this.ticketModal.open();
  }

  editTicket(ticket: Ticket): void {
    this.setTicketToModify(ticket);
    this.ticketModal.open();
  }

  closeTicketModalWindow(form: any) {
    this.activeTicket = new Ticket();
    form.reset();
  }

}
