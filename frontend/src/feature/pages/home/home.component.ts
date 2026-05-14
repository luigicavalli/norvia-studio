import { RouterLink }                      from '@angular/router';
import { DecimalPipe }                     from '@angular/common';
import { Component, computed, inject }     from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService }        from '../../../services/auth.service';
import { QuoteService }       from '../../../services/quote.service';
import { BadgeVariant }       from '../../components/shared/badge/badge.component';
import { ClientService }      from '../../../services/client.service';
import { ProjectService }     from '../../../services/project.service';
import { InvoiceService }     from '../../../services/invoice.service';
import { BadgeComponent }     from '../../components/shared/badge/badge.component';
import type { QuoteStatus }   from '../../../models/quote.model';
import type { InvoiceStatus } from '../../../models/invoice.model';


@Component({
  selector:    'app-home',
  standalone:  true,
  imports:     [DecimalPipe, RouterLink, TranslatePipe, BadgeComponent],
  templateUrl: './home.component.html',
  styleUrl:    './home.component.scss',
})
export class HomeComponent {

  private readonly auth           = inject(AuthService);
  private readonly projectService = inject(ProjectService);
  private readonly clientService  = inject(ClientService);
  private readonly translate      = inject(TranslateService);
  protected readonly invoiceService = inject(InvoiceService);
  protected readonly quoteService   = inject(QuoteService);

  protected readonly firstName = computed(() => this.auth.user()?.firstName ?? '');

  protected readonly today = new Intl.DateTimeFormat(
    this.translate.getCurrentLang() === 'en' ? 'en-GB' : 'it-IT',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  ).format(new Date());

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
    const locale = this.translate.getCurrentLang() === 'en' ? 'en-GB' : 'it-IT';
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date);
  }

  protected dueDays(date: Date | null): number {
    if (!date) return 0;
    return Math.round((date.getTime() - Date.now()) / 86_400_000);
  }

  protected invoiceStatusBadge(status: InvoiceStatus): { label: string; variant: BadgeVariant } {
    const variants: Record<InvoiceStatus, BadgeVariant> = {
      DRAFT:     'default',
      SENT:      'info',
      PAID:      'success',
      OVERDUE:   'warning',
      CANCELLED: 'danger',
    };
    return {
      label:   this.translate.instant(`INVOICE_STATUS.${status}`),
      variant: variants[status] ?? 'default',
    };
  }

  protected quoteStatusBadge(status: QuoteStatus): { label: string; variant: BadgeVariant } {
    const variants: Record<QuoteStatus, BadgeVariant> = {
      DRAFT:    'default',
      SENT:     'info',
      ACCEPTED: 'success',
      REJECTED: 'danger',
      EXPIRED:  'warning',
    };
    return {
      label:   this.translate.instant(`QUOTE_STATUS.${status}`),
      variant: variants[status] ?? 'default',
    };
  }

}
