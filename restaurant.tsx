import { Button } from '@/components/ui/button';
import { translations, type Language } from '@/lib/languages';
import type { PhotoSet } from './photo-experience';
import { BookOpen, Phone } from 'lucide-react';
import { foodPhotos, tablePhotos, RESTAURANT_PHONE, RESTAURANT_WHATSAPP } from '@/lib/restaurant-photos';
import { Gallery } from './photo-experience';

export function Restaurant({ lang, open }: { lang: Language; open: (photos: PhotoSet) => void }) {
 const t = translations[lang];
 return <section id="restaurante" className="bg-sea px-6 py-20 text-sea-foreground"><div className="mx-auto max-w-6xl">
  <div className="grid items-center gap-10 md:grid-cols-2">
   <Gallery imgs={tablePhotos} alt={t.tables} lang={lang} open={open} />
   <div><h2 className="text-3xl sm:text-4xl">{t.restaurantTitle}</h2><p className="mt-4 max-w-xl">{t.restaurantBody}</p>
    <div className="mt-6 flex flex-wrap gap-3">
     <Button asChild className="h-auto whitespace-normal py-3"><a href={RESTAURANT_WHATSAPP} target="_blank" rel="noreferrer">{t.restaurantBook}</a></Button>
     <Button asChild variant="secondary" className="h-auto whitespace-normal py-3"><a href={`${RESTAURANT_WHATSAPP}?text=${encodeURIComponent('Hola, ¿podrían enviarme el menú del restaurante?')}`} target="_blank" rel="noreferrer"><BookOpen />{t.menuRequest}</a></Button>
    </div>
    <a href="tel:+50575574518" className="mt-5 inline-flex items-center gap-2 text-base"><Phone className="size-4" />{RESTAURANT_PHONE}</a>
   </div>
  </div>
  <h3 className="mt-14 text-2xl">{t.foodTitle}</h3>
  <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">{foodPhotos.map((src,index) => <Button key={src} variant="ghost" className="aspect-square h-auto w-full overflow-hidden rounded-lg p-0" aria-label={`${t.enlarge}: ${t.food} ${index+1}`} onClick={() => open({imgs:foodPhotos,index,alt:t.food})}><img src={src} alt={`${t.food} ${index+1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 hover:scale-105 motion-reduce:transition-none" /></Button>)}</div>
 </div></section>;
}