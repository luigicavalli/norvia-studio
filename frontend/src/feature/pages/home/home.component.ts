import { Component, computed, inject } from '@angular/core';
import { DecimalPipe }                 from '@angular/common';
import { RouterLink }                  from '@angular/router';

import { AuthService }     from '../../../services/auth.service';
import { ProjectService }  from '../../../services/project.service';
import { ClientService }   from '../../../services/client.service';
import { InvoiceService }  from '../../../services/invoice.service';
import { QuoteService }    from '../../../services/quote.service';
import { BadgeComponent }  from '../../components/shared/badge/badge.component';
import { BadgeVariant }    from '../../components/shared/badge/badge.component';
import type { InvoiceStatus } from '../../../models/invoice.model';
import type { QuoteStatus }   from '../../../models/quote.model';


@Component({
  selector:    'app-home',
  standalone:  true,
  imports:     [DecimalPipe, RouterLink, BadgeComponent],
  templateUrl: './home.component.html',
  styleUrl:    './home.component.scss',
})
export class HomeComponent {

  private readonly auth           = inject(AuthService);
  private readonly projectService = inject(ProjectService);
  private readonly clientService  = inject(ClientService);
  protected readonly invoiceService = inject(InvoiceService);
  protected readonly quoteService   = inject(QuoteService);

  protected readonly firstName = computed(() => this.auth.user()?.firstName ?? '');

  protected readonly today = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  }).format(new Date());

  protected readonly loading = computed(() =>
    !this.projectService.loaded() || !this.clientService.loaded(),
  );

  // ── Stat cards ─────────────────────────────────────────────────────────────

  protected readonly activeProjects  = computed(() => this.projectService.activeCount());
  protected readonly totalClients    = computed(() => this.clientService.total());
  protected readonly onHoldProjects  = computed(() => this.projectService.onHoldCount());
  protected readonly completedCount  = computed(() => this.projectService.completedCount());

  protected readonly outstandingTotal = computed(() =>
    this.invoiceService.invoices()
      .filter(inv => inv.status === 'SENT' || inv.status === 'OVERDUE')
      .reduce((sum, inv) => sum + this.invoiceService.total(inv), 0),
  );

  protected readonly draftQuotesCount = computed(() =>
    this.quoteService.quotes().filter(q => q.status === 'DRAFT').length,
  );

  // ── Widgets ────────────────────────────────────────────────────────────────

  protected readonly pendingInvoices = computed(() =>
    this.invoiceService.invoices()
      .filter(inv => inv.status === 'SENT' || inv.status === 'OVERDUE')
      .sort((a, b) => {
        const da = a.dueDate?.getTime() ?? 0;
        const db = b.dueDate?.getTime() ?? 0;
        return da - db;
      })
      .slice(0, 6),
  );

  protected readonly recentQuotes = computed(() =>
    [...this.quoteService.quotes()]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 6),
  );

  // ── Helpers ────────────────────────────────────────────────────────────────

  protected formatDate(date: Date | null): string {
    if (!date) return '—';
    return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' }).format(date);
  }

  protected dueDays(date: Date | null): number {
    if (!date) return 0;
    return Math.round((date.getTime() - Date.now()) / 86_400_000);
  }

  protected invoiceStatusBadge(status: InvoiceStatus): { label: string; variant: BadgeVariant } {
    const map: Record<InvoiceStatus, { label: string; variant: BadgeVariant }> = {
      DRAFT:     { label: 'Bozza',     variant: 'default' },
      SENT:      { label: 'Inviata',   variant: 'info'    },
      PAID:      { label: 'Pagata',    variant: 'success' },
      OVERDUE:   { label: 'Scaduta',   variant: 'warning' },
      CANCELLED: { label: 'Annullata', variant: 'danger'  },
    };
    return map[status] ?? { label: status, variant: 'default' };
  }

  protected quoteStatusBadge(status: QuoteStatus): { label: string; variant: BadgeVariant } {
    const map: Record<QuoteStatus, { label: string; variant: BadgeVariant }> = {
      DRAFT:    { label: 'Bozza',     variant: 'default' },
      SENT:     { label: 'Inviato',   variant: 'info'    },
      ACCEPTED: { label: 'Accettato', variant: 'success' },
      REJECTED: { label: 'Rifiutato', variant: 'danger'  },
      EXPIRED:  { label: 'Scaduto',   variant: 'warning' },
    };
    return map[status] ?? { label: status, variant: 'default' };
  }

}
