import { TestBed }                 from '@angular/core/testing';
import { provideHttpClient }        from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController }    from '@angular/common/http/testing';
import { signal }                   from '@angular/core';

import { ClientService, Client, CreateClientData } from './client.service';
import { WorkspaceService }                        from './workspace.service';
import { environment }                             from '../environments/environment';


const BASE = environment.apiUrl;

const MOCK_DTO = {
  id:        'c-1',
  firstName: 'Mario',
  lastName:  'Rossi',
  email:     'mario@example.com',
  phone:     '0123456789',
  company:   null,
  vatNumber: '',
  status:    'ACTIVE',
  notes:     '',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const MOCK_CLIENT: Client = {
  id:          'c-1',
  firstName:   'Mario',
  lastName:    'Rossi',
  fullName:    'Mario Rossi',
  email:       'mario@example.com',
  phone:       '0123456789',
  companyId:   null,
  companyName: null,
  vatNumber:   '',
  status:      'ACTIVE',
  notes:       '',
  createdAt:   new Date('2024-01-01'),
  updatedAt:   new Date('2024-01-01'),
};

const MOCK_CREATE_DATA: CreateClientData = {
  firstName: 'Luigi',
  lastName:  'Verdi',
  email:     'luigi@example.com',
  phone:     '',
  notes:     '',
  companyId: null,
};

describe('ClientService', () => {

  let service:  ClientService;
  let httpMock: HttpTestingController;

  const fakeWorkspace = { activeId: signal<string | null>('ws-1') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ClientService,
        { provide: WorkspaceService, useValue: fakeWorkspace },
      ],
    });
    service  = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // --- Creazione ---

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  // --- Stato iniziale ---

  it('should start with empty clients list', () => {
    expect(service.clients().length).toBe(0);
    expect(service.total()).toBe(0);
  });

  // --- load() ---

  it('should load clients from API', async () => {
    const promise = service.load();
    const req = httpMock.expectOne(r => r.url.includes('/api/clients'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('workspaceId')).toBe('ws-1');
    req.flush({ data: [MOCK_DTO], hasMore: false });
    await promise;

    expect(service.clients().length).toBe(1);
    expect(service.clients()[0].fullName).toBe('Mario Rossi');
    expect(service.clients()[0].email).toBe('mario@example.com');
    expect(service.total()).toBe(1);
  });

  it('should not make HTTP request when workspaceId is null', async () => {
    fakeWorkspace.activeId.set(null);
    await service.load();
    httpMock.expectNone(r => r.url.includes('/api/clients'));
    fakeWorkspace.activeId.set('ws-1');
  });

  it('should map DTO dates as Date instances', async () => {
    const promise = service.load();
    httpMock.expectOne(r => r.url.includes('/api/clients'))
      .flush({ data: [MOCK_DTO], hasMore: false });
    await promise;

    expect(service.clients()[0].createdAt).toBeInstanceOf(Date);
    expect(service.clients()[0].updatedAt).toBeInstanceOf(Date);
  });

  // --- create() ---

  it('should POST a new client and reload', async () => {
    const promise = service.create(MOCK_CREATE_DATA);

    const postReq = httpMock.expectOne(`${BASE}/api/clients`);
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body.firstName).toBe('Luigi');
    expect(postReq.request.body.lastName).toBe('Verdi');
    expect(postReq.request.body.workspaceId).toBe('ws-1');
    postReq.flush({});
    await Promise.resolve();

    httpMock.expectOne(r => r.url.includes('/api/clients'))
      .flush({ data: [MOCK_DTO], hasMore: false });
    await promise;

    expect(service.clients().length).toBe(1);
  });

  // --- update() ---

  it('should PUT updated client and reload', async () => {
    const promise = service.update('c-1', MOCK_CREATE_DATA, MOCK_CLIENT);

    const putReq = httpMock.expectOne(`${BASE}/api/clients/c-1`);
    expect(putReq.request.method).toBe('PUT');
    expect(putReq.request.body.id).toBe('c-1');
    putReq.flush({});
    await Promise.resolve();

    httpMock.expectOne(r => r.url.includes('/api/clients'))
      .flush({ data: [MOCK_DTO], hasMore: false });
    await promise;
  });

  // --- remove() ---

  it('should DELETE a client and remove from signal', async () => {
    const promise1 = service.load();
    httpMock.expectOne(r => r.url.includes('/api/clients'))
      .flush({ data: [MOCK_DTO], hasMore: false });
    await promise1;

    expect(service.clients().length).toBe(1);

    const promise2 = service.remove('c-1');
    httpMock.expectOne(`${BASE}/api/clients/c-1`).flush({});
    await promise2;

    expect(service.clients().length).toBe(0);
  });

  it('should only remove the targeted client', async () => {
    const second = { ...MOCK_DTO, id: 'c-2', firstName: 'Anna' };
    const promise1 = service.load();
    httpMock.expectOne(r => r.url.includes('/api/clients'))
      .flush({ data: [MOCK_DTO, second], hasMore: false });
    await promise1;

    const promise2 = service.remove('c-1');
    httpMock.expectOne(`${BASE}/api/clients/c-1`).flush({});
    await promise2;

    expect(service.clients().length).toBe(1);
    expect(service.clients()[0].id).toBe('c-2');
  });

});
