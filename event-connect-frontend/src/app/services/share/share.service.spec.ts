import { TestBed } from '@angular/core/testing';
import { ShareService } from './share.service';
import { ShareData } from '../../shared/models/ShareData';

describe('ShareService', () => {
   let service: ShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShareService]
    });
    service = TestBed.inject(ShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if native share is available', () => {
    const result = service.isNativeShareAvailable();
    expect(typeof result).toBe('boolean');
  });

  it('should handle share with Web Share API', async () => {
    const mockShareData: ShareData = {
      title: 'Test Event',
      text: 'Check out this event',
      url: 'https://example.com/event/1'
    };

    // Mock navigator.share
    const mockShare = jasmine.createSpy('share').and.returnValue(Promise.resolve());
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      writable: true,
      configurable: true
    });

    const result = await service.share(mockShareData);
    
    expect(mockShare).toHaveBeenCalledWith(mockShareData);
    expect(result).toBe(true);
  });

  it('should fallback to clipboard when Web Share not available', async () => {
    const mockShareData: ShareData = {
      title: 'Test Event',
      text: 'Check out this event',
      url: 'https://example.com/event/1'
    };

    // Remove Web Share API
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true,
      configurable: true
    });

    // Mock clipboard
    const mockWriteText = jasmine.createSpy('writeText').and.returnValue(Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true
    });

    // Mock alert to avoid dialog
    spyOn(window, 'alert');

    const result = await service.share(mockShareData);
    
    expect(mockWriteText).toHaveBeenCalledWith(mockShareData.url);
    expect(result).toBe(true);
  });

  it('should handle AbortError gracefully', async () => {
    const mockShareData: ShareData = {
      title: 'Test Event',
      text: 'Check out this event',
      url: 'https://example.com/event/1'
    };

    // Mock navigator.share throwing AbortError
    const abortError = new Error('User cancelled');
    (abortError as any).name = 'AbortError';
    
    const mockShare = jasmine.createSpy('share').and.returnValue(Promise.reject(abortError));
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      writable: true,
      configurable: true
    });

    const result = await service.share(mockShareData);
    
    expect(mockShare).toHaveBeenCalledWith(mockShareData);
    expect(result).toBe(false);
  });
});
