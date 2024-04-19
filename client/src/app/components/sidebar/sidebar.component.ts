import { Component, Input, OnInit, signal } from '@angular/core';
import { Server, ServerService } from '../../services/server.service';
import { NgFor } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  constructor(
    private serverService: ServerService,
    private router: Router,
  ) {}

  @Input() selectedServer?: string;

  servers = signal<Server[]>([]);

  ngOnInit(): void {
    this.serverService.getServers().subscribe((response) => {
      this.servers.set(response);
    });
  }

  public getInitials(value: string) {
    return value.split(' ').reduce((prev, current) => {
      return `${prev} ${current.at(0)?.toUpperCase()}.`;
    }, '');
  }

  public onServerClick(id: string) {
    this.router.navigate(['server', id]);
  }
}
