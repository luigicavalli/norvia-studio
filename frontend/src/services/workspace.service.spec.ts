import { TestBed }                   from '@angular/core/testing';
import { provideHttpClient }          from '@angular/common/http';
import { provideHttpClientTesting }   from '@angular/common/http/testing';
import { HttpTestingController }      from '@angular/common/http/testing';

import { WorkspaceService, Workspace } from './workspace.service';
import { environment }                from '../environments/environment';


const BASE = environment.apiUrl;

const MOCK_WS: Workspace = {
  id:          'ws-1',
  name:        'My Workspace',
  slug:        'my-workspace',
  description: null,
  createdAt:   new Date('2024-01-01'),
  updatedAt:   new Date('2024-01-01'),
};

describe('WorkspaceService', () => {

  let service:  WorkspaceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        WorkspaceService,
      ],
    });
    service  = TestBed.inject(WorkspaceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // --- Creazione ---

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  // --- Stato iniziale ---

  it('should start with empty workspaces', () => {
    expect(service.workspaces().length).toBe(0);
  });

  it('should start with needsSetup=false (not yet loaded)', () => {
    expect(service.needsSetup()).toBe(false);
  });

  it('should start with hasWorkspace=false', () => {
    expect(service.hasWorkspace()).toBe(false);
  });

  // --- load() ---

  it('should load workspaces and set first as active', async () => {
    const promise = service.load();
    const req = httpMock.expectOne(`${BASE}/api/workspaces`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: [MOCK_WS] });
    await promise;

    expect(service.workspaces().length).toBe(1);
    expect(service.workspaces()[0].name).toBe('My Workspace');
    expect(service.activeId()).toBe('ws-1');
  });

  it('should set needsSetup=true after load with empty list', async () => {
    const promise = service.load();
    httpMock.expectOne(`${BASE}/api/workspaces`).flush({ data: [] });
    await promise;

    expect(service.needsSetup()).toBe(true);
    expect(service.hasWorkspace()).toBe(false);
  });

  it('should set hasWorkspace=true after load with workspaces', async () => {
    const promise = service.load();
    httpMock.expectOne(`${BASE}/api/workspaces`).flush({ data: [MOCK_WS] });
    await promise;

    expect(service.hasWorkspace()).toBe(true);
    expect(service.needsSetup()).toBe(false);
  });

  it('should not override activeId if already set', async () => {
    service.setActive('ws-existing');
    const promise = service.load();
    httpMock.expectOne(`${BASE}/api/workspaces`).flush({ data: [MOCK_WS] });
    await promise;

    expect(service.activeId()).toBe('ws-existing');
  });

  // --- setActive() ---

  it('should update activeId via setActive()', () => {
    service.setActive('ws-2');
    expect(service.activeId()).toBe('ws-2');
  });

  // --- activeWorkspace computed ---

  it('should return active workspace via activeWorkspace()', async () => {
    const promise = service.load();
    httpMock.expectOne(`${BASE}/api/workspaces`).flush({ data: [MOCK_WS] });
    await promise;

    expect(service.activeWorkspace()?.id).toBe('ws-1');
    expect(service.activeWorkspace()?.name).toBe('My Workspace');
  });

  it('should return null when activeId does not match any workspace', () => {
    service.setActive('nonexistent');
    expect(service.activeWorkspace()).toBeNull();
  });

  // --- create() ---

  it('should POST a new workspace and reload', async () => {
    const promise = service.create('Nuovo WS', 'Descrizione');
    const postReq = httpMock.expectOne(`${BASE}/api/workspaces`);
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body.name).toBe('Nuovo WS');
    expect(postReq.request.body.description).toBe('Descrizione');
    expect(postReq.request.body.slug).toBe('nuovo-ws');
    postReq.flush({});
    await Promise.resolve();

    const getReq = httpMock.expectOne(`${BASE}/api/workspaces`);
    getReq.flush({ data: [{ ...MOCK_WS, name: 'Nuovo WS' }] });
    await promise;

    expect(service.workspaces()[0].name).toBe('Nuovo WS');
  });

  it('should generate null description when not provided', async () => {
    const promise = service.create('WS senza desc');
    const postReq = httpMock.expectOne(`${BASE}/api/workspaces`);
    expect(postReq.request.body.description).toBeNull();
    postReq.flush({});
    await Promise.resolve();
    httpMock.expectOne(`${BASE}/api/workspaces`).flush({ data: [] });
    await promise;
  });

  // --- update() ---

  it('should PUT updated workspace and update signal', async () => {
    const promise1 = service.load();
    httpMock.expectOne(`${BASE}/api/workspaces`).flush({ data: [MOCK_WS] });
    await promise1;

    const promise2 = service.update('ws-1', 'Rinominato', 'Nuova desc');
    const putReq   = httpMock.expectOne(`${BASE}/api/workspaces/ws-1`);
    expect(putReq.request.method).toBe('PUT');
    expect(putReq.request.body.name).toBe('Rinominato');
    expect(putReq.request.body.slug).toBe('rinominato');
    expect(putReq.request.body.description).toBe('Nuova desc');
    putReq.flush({});
    await promise2;

    expect(service.workspaces()[0].name).toBe('Rinominato');
    expect(service.workspaces()[0].description).toBe('Nuova desc');
  });

});
