import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';


describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty toasts list', () => {
    expect(service.toasts().length).toBe(0);
  });

  it('should add a toast via show()', () => {
    service.show('Messaggio', 'success');

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Messaggio');
    expect(service.toasts()[0].variant).toBe('success');
  });

  it('should assign unique ids to multiple toasts', () => {
    service.show('A', 'info');
    service.show('B', 'info');

    const [first, second] = service.toasts();

    expect(first.id).not.toBe(second.id);
  });

  it('should auto-dismiss after duration', () => {
    service.show('Auto', 'info', 2000);

    expect(service.toasts().length).toBe(1);

    vi.advanceTimersByTime(2000);

    expect(service.toasts().length).toBe(0);
  });

  it('should not dismiss before duration expires', () => {
    service.show('Auto', 'info', 3000);

    vi.advanceTimersByTime(1000);

    expect(service.toasts().length).toBe(1);

    vi.advanceTimersByTime(2000);

    expect(service.toasts().length).toBe(0);
  });

  it('should dismiss a toast by id', () => {
    service.show('Hello', 'info');

    const id = service.toasts()[0].id;

    service.dismiss(id);

    expect(service.toasts().length).toBe(0);
  });

  it('should only dismiss the targeted toast', () => {
    service.show('A', 'info');
    service.show('B', 'info');

    const idA = service.toasts()[0].id;

    service.dismiss(idA);

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('B');
  });

  it('should ignore dismiss for unknown id', () => {
    service.show('A', 'info');

    service.dismiss(9999);

    expect(service.toasts().length).toBe(1);
  });

  it('success() should add a success toast', () => {
    service.success('Salvato');

    expect(service.toasts()[0].variant).toBe('success');
    expect(service.toasts()[0].message).toBe('Salvato');
  });

  it('danger() should add a danger toast', () => {
    service.danger('Errore');

    expect(service.toasts()[0].variant).toBe('danger');
  });

  it('warning() should add a warning toast', () => {
    service.warning('Attenzione');

    expect(service.toasts()[0].variant).toBe('warning');
  });

  it('info() should add an info toast', () => {
    service.info('Info');

    expect(service.toasts()[0].variant).toBe('info');
  });
});
