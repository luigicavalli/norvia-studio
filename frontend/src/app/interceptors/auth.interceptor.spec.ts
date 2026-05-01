import { TestBed }                 from '@angular/core/testing';
import { provideHttpClient,
         withInterceptors }        from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController }    from '@angular/common/http/testing';
import { HttpClient }               from '@angular/common/http';
import { vi }                       from 'vitest';

import { authInterceptor } from './auth.interceptor';
import { AuthService }     from '../../services/auth.service';


describe('authInterceptor', () => {

  let http:     HttpClient;
  let httpMock: HttpTestingController;

  const getTokenSpy = vi.fn<() => Promise<string | null>>();
  const fakeAuth    = { getToken: getTokenSpy };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: fakeAuth },
      ],
    });
    http     = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // --- Con token ---

  it('should add Authorization header when token is available', async () => {
    getTokenSpy.mockResolvedValue('my-jwt-token');

    http.get('/api/test').subscribe();
    await Promise.resolve(); // attende il token

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-jwt-token');
    req.flush({});
  });

  // --- Senza token ---

  it('should not add Authorization header when token is null', async () => {
    getTokenSpy.mockResolvedValue(null);

    http.get('/api/test').subscribe();
    await Promise.resolve();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  // --- Request non modificata ---

  it('should preserve original request URL and method', async () => {
    getTokenSpy.mockResolvedValue('token');

    http.post('/api/clients', { name: 'Test' }).subscribe();
    await Promise.resolve();

    const req = httpMock.expectOne('/api/clients');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Test' });
    req.flush({});
  });

});
