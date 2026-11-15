import { Bookmark, Trash2 } from 'lucide-react';
import type { NasaImageItem, SavedDiscoveryItem } from '../../types/imageExplorer';
import { SpaceImage } from '../SpaceImage';

interface DiscoveryCollectionProps {
  discoveries: SavedDiscoveryItem[];
  onOpenDiscovery: (item: NasaImageItem) => void;
  onRemoveDiscovery: (nasaId: string) => void;
}

export function DiscoveryCollection({
  discoveries,
  onOpenDiscovery,
  onRemoveDiscovery,
}: DiscoveryCollectionProps) {
  return (
    <section
      id="discovery-collection"
      aria-labelledby="collection-heading"
      className="border-b border-slate-800/80 bg-[#080D1B] py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs tracking-wider text-cyan-400">
              My Discoveries · Saved on This Device
            </p>
            <h2
              id="collection-heading"
              className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              DISCOVERY COLLECTION
            </h2>
          </div>
          <p className="font-mono text-xs text-slate-400 tabular-nums">
            {discoveries.length} {discoveries.length === 1 ? 'saved image' : 'saved images'}
          </p>
        </div>

        {discoveries.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-800/90 bg-[#0B1120] p-8 text-center">
            <Bookmark className="mx-auto h-7 w-7 text-cyan-400/80" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg font-bold text-white">
              Your Discovery Collection Is Empty
            </h3>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-300">
              Search for a space topic above, open a NASA image, and click{' '}
              <strong className="text-white">Save Discovery</strong> to keep your favourite
              discoveries here.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {discoveries.map((saved) => (
              <article
                key={saved.nasaId}
                className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800/90 bg-[#0B1120]"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-800/80 bg-[#060913]">
                    <SpaceImage
                      src={saved.previewUrl}
                      alt={saved.title}
                      fallbackTitle={saved.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-xs text-cyan-300">
                      {saved.nasaId} <span aria-hidden="true">·</span> {saved.center}
                    </p>
                    <h3 className="mt-1.5 font-display text-base font-bold text-white line-clamp-2">
                      {saved.title}
                    </h3>
                    {saved.discoveredComponents.length > 0 && (
                      <p className="mt-2 text-xs text-slate-300">
                        Components explored:{' '}
                        <span className="text-cyan-200">
                          {saved.discoveredComponents.join(', ')}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 px-5 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenDiscovery({
                        nasaId: saved.nasaId,
                        title: saved.title,
                        description: saved.description,
                        dateCreated: saved.dateCreated,
                        keywords: saved.keywords,
                        center: saved.center,
                        photographer: '',
                        previewUrl: saved.previewUrl,
                        nasaSourceUrl: saved.nasaSourceUrl,
                      })
                    }
                    className="min-h-[38px] rounded-md border border-slate-700 bg-[#111B33] px-3 py-1.5 text-xs font-semibold text-white hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
                  >
                    Open in Viewer
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveDiscovery(saved.nasaId)}
                    aria-label={`Remove ${saved.title} from saved discoveries`}
                    className="inline-flex min-h-[38px] items-center gap-1 rounded-md border border-slate-800 bg-[#060913] px-2.5 py-1.5 text-xs text-slate-400 hover:border-rose-500/50 hover:text-rose-300 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Remove</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
