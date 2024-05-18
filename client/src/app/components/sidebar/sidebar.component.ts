import { Component, OnInit, signal } from '@angular/core';
import { Server, ServerService } from '../../services/server.service';
import { NgFor } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { CreateServerFormComponent } from '../forms/create-server/create-server.component';
import { CircleComponent } from './components/circle.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgFor,
    RouterLink,
    CircleComponent,
    ModalComponent,
    CreateServerFormComponent,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  constructor(public serverService: ServerService, private router: Router) {}
  servers = signal<Server[]>([]);
  createServerModalOpen = signal(false);

  ngOnInit(): void {
    this.serverService.getServers().subscribe();
  }

  public getInitials(value: string) {
    return value.split(' ').reduce((prev, current) => {
      return `${prev} ${current.at(0)?.toUpperCase()}.`;
    }, '');
  }

  public onServerClick(id: string) {
    this.router.navigate(['server', id]);
  }

  public openCreateServerModal() {
    this.createServerModalOpen.set(true);
  }

  public closeCreateServerModal() {
    this.createServerModalOpen.set(false);
  }
}
