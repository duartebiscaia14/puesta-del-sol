import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { translations, type Language } from '@/lib/languages';

export type PhotoSet = { imgs: string[]; index: number; alt: string };
export function PhotoViewer({ photos, onClose, lang }: { photos: PhotoSet | null; onClose: () => void; lang: Language }) {
 const [index, setIndex] = useState(0);
 const t = translations[lang];
 useEffect(() => { setIndex(photos?.index ?? 0); }, [photos]);
 const count = photos?.imgs.length ?? 0;
 const go = (delta: number) => setIndex(current => (current + delta + count) % count);
 useEffect(() => {
  if (!photos) return;
  const key = (event: KeyboardEvent) => {
   if (event.key === 'ArrowLeft') setIndex(current => (current - 1 + count) % count);
   if (event.key === 'ArrowRight') setIndex(current => (current + 1) % count);
  };
  window.addEventListener('keydown', key);
  return () => window.removeEventListener('keydown', key);
 }, [photos, count]);
 return <Dialog.Root open={Boolean(photos)} onOpenChange={open => { if (!open) onClose(); }}>
  <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-viewer/95" />
   <Dialog.Content aria-describedby={undefined} className="fixed inset-0 z-50 flex flex-col items-center justify-center p-3 text-viewer-foreground sm:p-8">
    <Dialog.Title className="sr-only">{photos?.alt}</Dialog.Title>
    <Dialog.Close asChild><Button variant="ghost" size="icon" className="absolute right-4 top-4 z-10 bg-viewer-control" aria-label={t.close} title={t.close}><X /></Button></Dialog.Close>
    {photos && <img src={photos.imgs[index]} alt={`${photos.alt} · ${index + 1}`} className="max-h-[80dvh] max-w-full object-contain" />}
    <div className="mt-4 flex items-center gap-6">
     <Button variant="ghost" size="icon" aria-label={t.previous} title={t.previous} onClick={() => go(-1)}><ChevronLeft /></Button>
     <span className="min-w-16 text-center text-sm">{index + 1} / {count}</span>
     <Button variant="ghost" size="icon" aria-label={t.next} title={t.next} onClick={() => go(1)}><ChevronRight /></Button>
    </div>
   </Dialog.Content>
  </Dialog.Portal>
 </Dialog.Root>;
}
export function Gallery({ imgs, alt, lang, open }: { imgs: string[]; alt: string; lang: Language; open: (set: PhotoSet) => void }) {
 const [index, setIndex] = useState(0);
 const t = translations[lang];
 return <div className="relative h-64">
  <Button variant="ghost" className="h-full w-full overflow-hidden rounded-none p-0" aria-label={`${t.enlarge}: ${alt}`} onClick={() => open({imgs, index, alt})}><img src={imgs[index]} alt={alt} loading="lazy" className="h-full w-full object-cover" /></Button>
  <Button size="icon" variant="secondary" className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/90" aria-label={t.previous} title={t.previous} onClick={() => setIndex((index - 1 + imgs.length) % imgs.length)}><ChevronLeft /></Button>
  <Button size="icon" variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/90" aria-label={t.next} title={t.next} onClick={() => setIndex((index + 1) % imgs.length)}><ChevronRight /></Button>
  <span className="absolute bottom-2 right-2 rounded bg-card/90 px-2 py-1 text-xs">{index + 1}/{imgs.length}</span>
 </div>;
}
export function PropertyCover({ imgs, lang, open }: { imgs: string[]; lang: Language; open: (set: PhotoSet) => void }) {
 const [index, setIndex] = useState(0);
 const [playing, setPlaying] = useState(true);
 const t = translations[lang];
 useEffect(() => {
  if (!playing || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const timer = window.setInterval(() => setIndex(current => (current + 1) % imgs.length), 6000);
  return () => window.clearInterval(timer);
 }, [playing, imgs.length]);
 return <>
  <Button variant="ghost" aria-label={`${t.enlarge}: ${t.property}`} onClick={() => open({imgs, index, alt: t.property})} className="absolute inset-0 h-full w-full rounded-none p-0">
   {imgs.map((src, i) => <img key={src} src={src} alt={t.property} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${i === index ? 'opacity-100' : 'opacity-0'}`} />)}
  </Button>
  <div className="pointer-events-none absolute inset-0 bg-sunset" />
  <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 text-primary-foreground">
   <Button variant="ghost" size="icon" className="bg-viewer-control" aria-label={t.previous} title={t.previous} onClick={() => setIndex((index - 1 + imgs.length) % imgs.length)}><ChevronLeft /></Button>
   <span className="min-w-10 text-center text-xs">{index + 1}/{imgs.length}</span>
   <Button variant="ghost" size="icon" className="bg-viewer-control" aria-label={t.next} title={t.next} onClick={() => setIndex((index + 1) % imgs.length)}><ChevronRight /></Button>
   <Button variant="ghost" size="icon" className="bg-viewer-control" aria-label={playing ? t.pause : t.play} title={playing ? t.pause : t.play} onClick={() => setPlaying(!playing)}>{playing ? <Pause /> : <Play />}</Button>
   <Button variant="ghost" size="icon" className="bg-viewer-control" aria-label={t.enlarge} title={t.enlarge} onClick={() => open({imgs, index, alt: t.property})}><Maximize2 /></Button>
  </div>
 </>;
}
