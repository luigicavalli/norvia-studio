import { TestBed }                 from '@angular/core/testing';
import { provideHttpClient }        from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController }    from '@angular/common/http/testing';
import { signal }                   from '@angular/core';

import { ProjectService, Project, SaveProjectData } from './project.service';
import { WorkspaceService }                         from './workspace.service';
import type { Client }                              from './client.service';


const BASE = 'http://localhost:3000';

const MOCK_CLIENT: Client = {
  id:          'c-1',
  firstName:   'Mario',
  lastName:    'Rossi',
  fullName:    'Mario Rossi',
  email:       'mario@example.com',
  phone:       '',
  companyId:   null,
  companyName: null,
  vatNumber:   '',
  status:      'ACTIVE',
  notes:       '',
  createdAt:   new Date('2024-01-01'),
  updatedAt:   new Date('2024-01-01'),
};

const MOCK_DTO = {
  id:             'p-1',
  name:           'Sito Web',
  description:    '',
  client:         { id: 'c-1', firstName: 'Mario', lastName: 'Rossi' },
  status:         'ACTIVE',
  priority:       'MEDIUM',
  budgetAmount:   5000,
  budgetCurrency: 'EUR',
  startDate:      '2024-01-01T00:00:00.000Z',
  dueDate:        '2024-06-01T00:00:00.000Z',
  completedAt:    null,
  createdAt:      '2024-01-01T00:00:00.000Z',
  updatedAt:      '2024-01-01T00:00:00.000Z',
};

const MOCK_PROJECT: Project = {
  id:             'p-1',
  name:           'Sito Web',
  description:    '',
  clientId:       'c-1',
  clientName:     'Mario Rossi',
  status:         'ACTIVE',
  priority:       'MEDIUM',
  budgetAmount:   5000,
  budgetCurrency: 'EUR',
  startDate:      new Date('2024-01-01'),
  dueDate:        new Date('2024-06-01'),
  completedAt:    null,
  createdAt:      new Date('2024-01-01'),
  updatedAt:      new Date('2024-01-01'),
};

const MOCK_SAVE_DATA: SaveProjectData = {
  name:           'Nuovo progetto',
  description:    '',
  client:         MOCK_CLIENT,
  status:         'ACTIVE',
  priority:       'MEDIUM',
  budgetAmount:   null,
  budgetCurrency: 'EUR',
  startDate:      null,
  dueDate:        null,
};

describe('ProjectService', () => {

  let service:  ProjectService;
  let httpMock: HttpTestingController;

  const fakeWorkspace = { activeId: signal<string | null>('ws-1') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProjectService,
        { provide: WorkspaceService, useValue: fakeWorkspace },
      ],
    });
    service  = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // --- Creazione ---

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  // --- Stato iniziale ---

  it('should start with empty projects list', () => {
    expect(service.projects().length).toBe(0);
  });

  it('should start with zero counts', () => {
    expect(service.activeCount()).toBe(0);
    expect(service.onHoldCount()).toBe(0);
    expect(service.completedCount()).toBe(0);
  });

  // --- load() ---

  it('should load projects from API', async () => {
    const promise = service.load();
    const req = httpMock.expectOne(r => r.url.includes('/api/projects'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('workspaceId')).toBe('ws-1');
    req.flush({ data: [MOCK_DTO], hasMore: false });
    await promise;

    expect(service.projects().length).toBe(1);
    expect(service.projects()[0].name).toBe('Sito Web');
    expect(service.projects()[0].clientName).toBe('Mario Rossi');
  });

  it('should not make HTTP request when workspaceId is null', async () => {
    fakeWorkspace.activeId.set(null);
    await service.load();
    httpMock.expectNone(r => r.url.includes('/api/projects'));
    fakeWorkspace.activeId.set('ws-1');
  });

  it('should map DTO dates as Date instances', async () => {
    const promise = service.load();
    httpMock.expectOne(r => r.url.includes('/api/projects'))
      .flush({ data: [MOCK_DTO], hasMore: false });
    await promise;

    expect(service.projects()[0].startDate).toBeInstanceOf(Date);
    expect(service.projects()[0].dueDate).toBeInstanceOf(Date);
    expect(service.projects()[0].completedAt).toBeNull();
  });

  // --- Computed counts ---

  it('should count active projects', async () => {
    const promise = service.load();
    httpMock.expectOne(r => r.url.includes('/api/projects'))
      .flush({ data: [MOCK_DTO], hasMore: false });
    await promise;

    expect(service.activeCount()).toBe(1);
    expect(service.onHoldCount()).toBe(0);
    expect(service.completedCount()).toBe(0);
  });

  it('should count projects by status correctly', async () => {
    const completed = { ...MOCK_DTO, id: 'p-2', status: 'COMPLETED' };
    const onHold    = { ...MOCK_DTO, id: 'p-3', status: 'ON_HOLD'   };
    const promise   = service.load();
    httpMock.expectOne(r => r.url.includes('/api/projects'))
      .flush({ data: [MOCK_DTO, completed, onHold], hasMore: false });
    await promise;

    expect(service.activeCount()).toBe(1);
    expect(service.completedCount()).toBe(1);
    expect(service.onHoldCount()).toBe(1);
  });

  // --- create() ---

  it('should POST a new project and reload', async () => {
    const promise = service.create(MOCK_SAVE_DATA);

    const postReq = httpMock.expectOne(`${BASE}/api/projects`);
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body.name).toBe('Nuovo progetto');
    expect(postReq.request.body.workspaceId).toBe('ws-1');
    postReq.flush({});
    await Promise.resolve();

    httpMock.expectOne(r => r.url.includes('/api/projects'))
      .flush({ data: [MOCK_DTO], hasMore: false });
    await promise;

    expect(service.projects().length).toBe(1);
  });

  // --- update() ---

  it('should PUT updated project and reload', async () => {
    const promise = service.update('p-1', MOCK_SAVE_DATA, MOCK_PROJECT);

    const putReq = httpMock.expectOne(`${BASE}/api/projects/p-1`);
    expect(putReq.request.method).toBe('PUT');
    expect(putReq.request.body.id).toBe('p-1');
    putReq.flush({});
    await Promise.resolve();

    httpMock.expectOne(r => r.url.includes('/api/projects'))
      .flush({ data: [MOCK_DTO], hasMore: false });
    await promise;
  });

  it('should set completedAt when status changes to COMPLETED', async () => {
    const completedData = { ...MOCK_SAVE_DATA, status: 'COMPLETED' as const };
    const promise = service.update('p-1', completedData, MOCK_PROJECT);

    const putReq = httpMock.expectOne(`${BASE}/api/projects/p-1`);
    expect(putReq.request.body.completedAt).not.toBeNull();
    putReq.flush({});
    await Promise.resolve();

    httpMock.expectOne(r => r.url.includes('/api/projects'))
      .flush({ data: [], hasMore: false });
    await promise;
  });

  it('should set completedAt to null for non-COMPLETED status', async () => {
    const promise = service.update('p-1', MOCK_SAVE_DATA, MOCK_PROJECT);

    const putReq = httpMock.expectOne(`${BASE}/api/projects/p-1`);
    expect(putReq.request.body.completedAt).toBeNull();
    putReq.flush({});
    await Promise.resolve();

    httpMock.expectOne(r => r.url.includes('/api/projects'))
      .flush({ data: [], hasMore: false });
    await promise;
  });

  // --- remove() ---

  it('should DELETE a project and remove from signal', async () => {
    const promise1 = service.load();
    httpMock.expectOne(r => r.url.includes('/api/projects'))
      .flush({ data: [MOCK_DTO], hasMore: false });
    await promise1;

    expect(service.projects().length).toBe(1);

    const promise2 = service.remove('p-1');
    httpMock.expectOne(`${BASE}/api/projects/p-1`).flush({});
    await promise2;

    expect(service.projects().length).toBe(0);
  });

  it('should only remove the targeted project', async () => {
    const second  = { ...MOCK_DTO, id: 'p-2', name: 'Altro' };
    const promise1 = service.load();
    httpMock.expectOne(r => r.url.includes('/api/projects'))
      .flush({ data: [MOCK_DTO, second], hasMore: false });
    await promise1;

    const promise2 = service.remove('p-1');
    httpMock.expectOne(`${BASE}/api/projects/p-1`).flush({});
    await promise2;

    expect(service.projects().length).toBe(1);
    expect(service.projects()[0].id).toBe('p-2');
  });

});
