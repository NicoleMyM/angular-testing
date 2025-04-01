import { MetaTagsService } from '@shared/services/meta-tags.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Meta, Title } from '@angular/platform-browser';

describe('MetaTagsService', () => {
  let spectator: SpectatorService<MetaTagsService>;
  let metaPlatform: Meta;
  let titlePlatform: Title;
  const createService = createServiceFactory({
    service: MetaTagsService,
    providers: [
      {
        provide: Title,
        useValue: {
          setTitle: jest.fn(),
        },
      },
      {
        provide: Meta,
        useValue: {
          updateTag: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    metaPlatform = spectator.inject(Meta);
    titlePlatform = spectator.inject(Title);
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should update meta tags', () => {
    spectator.service.updateMetaTags({
      title: 'Test Title',
      description: 'Test Description',
    });

    expect(metaPlatform.updateTag).toHaveBeenCalledTimes(6);
  });
});
