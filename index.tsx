import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Gallery, PhotoViewer, PropertyCover, type PhotoSet } from '@/components/photo-experience';
import { Restaurant } from '@/components/restaurant';
import { languages, translations, isLanguage, type Language } from '@/lib/languages';
import { photos_792543001, photos_792543002, photos_792543003, photos_792543004, photos_common } from '@/lib/booking-photos';

const HOTEL_BOOKING = 'https://www.booking.com/hotel/ni/cabanas-puesta-del-sol.es.html';
const PHONE = '+505 8383 0015';
const WA = 'https://wa.me/50583830015';
const coverPhotos = [photos_common[1], photos_common[0], photos_common[2], photos_common[3]].filter((src): src is string => Boolean(src));
export const Route = createFileRoute('/')({
 head: () => ({
  meta: [
   { title: 'Hotel Cabañas Puesta del Sol · Las Peñitas, Nicaragua' },
   { name: 'description', content: 'Hotel a 30 m de Playa Las Peñitas: piscina, restaurante italiano, desayuno incluido. Reserva tu habitación o mesa.' },
   { property: 'og:title', content: 'Hotel Cabañas Puesta del Sol · Las Peñitas' },
   { property: 'og:description', content: 'Cabañas, piscina y cocina italiana en Las Peñitas, Nicaragua.' },
   { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
   ...(coverPhotos[0] ? [{ property: 'og:image', content: coverPhotos[0] }, { name: 'twitter:image', content: coverPhotos[0] }] : []),
  ],
  links: [{ rel: 'preconnect', href: 'https://fonts.googleapis.com' }, { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;600&display=swap' }],
 }), component: Index,
});
const rooms = [
 { id: 'deluxe1', sea: false, p2: 70, p1: 65, imgs: photos_792543001 },
 { id: 'deluxe2', sea: false, p2: 70, p1: 65, imgs: photos_792543002 },
 { id: 'deluxe3', sea: false, p2: 70, p1: 65, imgs: photos_792543003 },
 { id: 'mar', sea: true, p2: 80, p1: 80, imgs: photos_792543004 },
];
const amenityIcons = ['🏖️','🏊','🍝','🍹','🅿️','📶','❄️','🔐','🌿','🥐','🚿','🚐'];
function Index() {
 const [lang, setLang] = useState<Language>('es');
 const [viewer, setViewer] = useState<PhotoSet | null>(null);
 const [checkin, setCheckin] = useState('');
 const [checkout, setCheckout] = useState('');
 const [roomId, setRoomId] = useState('deluxe1');
 const [guests, setGuests] = useState(2);
 const t = translations[lang];
 useEffect(() => { const saved = localStorage.getItem('hotel-language'); if (isLanguage(saved)) setLang(saved); }, []);
 useEffect(() => { document.documentElement.lang = lang; }, [lang]);
 const changeLanguage = (code: string) => { if (isLanguage(code)) { setLang(code); localStorage.setItem('hotel-language', code); } };
 const today = new Date().toISOString().slice(0,10);
 const room = rooms.find(r => r.id === roomId) ?? rooms[0];
 const nights = useMemo(() => !checkin || !checkout ? 0 : Math.max(0, Math.round((+new Date(checkout) - +new Date(checkin)) / 86400000)), [checkin, checkout]);
 if (!room) return null;
 const price = guests === 1 ? room.p1 : room.p2;
 const bookingUrl = `${HOTEL_BOOKING}?checkin=${checkin}&checkout=${checkout}&group_adults=${guests}&no_rooms=1&lang=${lang === 'zh' ? 'zh-cn' : lang}`;
 const roomName = (sea: boolean) => sea ? t.seaRoom : t.deluxe;
 return <main>
  <section className="relative h-[92svh] min-h-[480px] overflow-hidden">
   <PropertyCover imgs={coverPhotos} lang={lang} open={setViewer} />
   <nav className="relative z-20 flex items-center justify-between gap-3 p-4 text-primary-foreground md:p-6">
    <span className="font-display text-lg sm:text-xl">Puesta del Sol</span>
    <div className="hidden gap-6 text-sm lg:flex"><a href="#habitaciones">{t.rooms}</a><a href="#piscina">{t.pool}</a><a href="#restaurante">{t.restaurant}</a><a href="#ubicacion">{t.location}</a></div>
    <div className="flex shrink-0 items-center gap-2">
     <Button asChild className="rounded-full"><a href="#reservar">{t.book}</a></Button>
     <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={t.language} title={t.language} className="bg-viewer-control"><Languages /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44"><DropdownMenuRadioGroup value={lang} onValueChange={changeLanguage}>{languages.map(l => <DropdownMenuRadioItem key={l.code} value={l.code}>{l.name}</DropdownMenuRadioItem>)}</DropdownMenuRadioGroup></DropdownMenuContent>
     </DropdownMenu>
    </div>
   </nav>
   <div className="pointer-events-none absolute inset-x-0 bottom-24 z-10 px-6 text-primary-foreground md:px-16">
    <p className="mb-3 text-xs uppercase">{t.eyebrow}</p>
    <h1 className="max-w-3xl text-4xl leading-tight sm:text-5xl md:text-6xl">Cabañas<br/><em>Puesta del Sol</em></h1>
    <p className="mt-3 font-display text-xl italic">{t.tagline}</p>
    <p className="mt-4 max-w-xl text-base opacity-90 sm:text-lg">{t.intro}</p>
   </div>
  </section>
  <section className="mx-auto max-w-5xl px-6 py-20 text-center">
   <h2 className="text-3xl sm:text-4xl">{t.welcome}</h2><p className="mt-6 text-lg text-muted-foreground">{t.welcomeBody}</p>
   <div className="mt-10 grid grid-cols-2 gap-3 text-left md:grid-cols-4">{t.amenities.map((a,i) => <div key={i} className="rounded-lg bg-card p-4 text-sm shadow-sm">{amenityIcons[i]} {a}</div>)}</div>
  </section>
  <section id="habitaciones" className="bg-secondary px-6 py-20"><div className="mx-auto max-w-6xl">
   <h2 className="text-center text-4xl">{t.roomsTitle}</h2><p className="mt-3 text-center text-muted-foreground">{t.breakfast}</p>
   <div className="mt-12 grid gap-8 md:grid-cols-2">{rooms.map((r,i) => <article key={r.id} className="overflow-hidden rounded-lg bg-card shadow-md">
    <Gallery imgs={r.imgs} alt={roomName(r.sea)} lang={lang} open={setViewer} />
    <div className="p-6"><h3 className="text-xl">{roomName(r.sea)}</h3><p className="mt-1 text-sm text-muted-foreground">{r.sea ? t.seaView : t.gardenView} · {t.roomFeatures}</p>
     <p className="mt-4 text-2xl font-semibold text-primary">US$ {r.p2} <span className="text-sm font-normal text-muted-foreground">/ {t.night} · {t.twoGuests}</span></p>
     {r.p1 !== r.p2 && <p className="text-sm text-muted-foreground">US$ {r.p1} / {t.night} · {t.oneGuest}</p>}
     <Button asChild className="mt-5 rounded-full"><a href="#reservar" onClick={() => setRoomId(r.id)}>{t.bookRoom}{!r.sea ? ` · ${i+1}` : ''}</a></Button>
    </div>
   </article>)}</div>
  </div></section>
  <section id="piscina" className="px-6 py-20"><div className="mx-auto max-w-6xl">
   <h2 className="text-center text-4xl">{t.poolTitle}</h2><p className="mt-3 text-center text-muted-foreground">{t.poolBody}</p>
   <div className="mt-12 columns-2 gap-4 md:columns-3">{photos_common.map((src,index) => <Button key={src} variant="ghost" className="mb-4 block h-auto w-full overflow-hidden rounded-lg p-0" aria-label={`${t.enlarge}: ${t.poolTitle} ${index+1}`} onClick={() => setViewer({imgs:photos_common,index,alt:t.poolTitle})}><img src={src} alt={`${t.poolTitle} ${index+1}`} loading="lazy" className="w-full object-cover" /></Button>)}</div>
  </div></section>
  <section id="reservar" className="mx-auto max-w-4xl px-6 py-20">
   <h2 className="text-center text-4xl">{t.bookingTitle}</h2><p className="mt-3 text-center text-muted-foreground">{t.bookingBody}</p>
   <div className="mt-10 grid gap-4 rounded-lg bg-card p-5 shadow-lg sm:p-8 md:grid-cols-2">
    <label className="min-w-0 text-sm">{t.arrival}<input type="date" min={today} value={checkin} onChange={e => setCheckin(e.target.value)} className="mt-1 w-full min-w-0 rounded-md border bg-background p-3" /></label>
    <label className="min-w-0 text-sm">{t.departure}<input type="date" min={checkin || today} value={checkout} onChange={e => setCheckout(e.target.value)} className="mt-1 w-full min-w-0 rounded-md border bg-background p-3" /></label>
    <label className="min-w-0 text-sm">{t.room}<select value={roomId} onChange={e => setRoomId(e.target.value)} className="mt-1 w-full rounded-md border bg-background p-3">{rooms.map((r,i) => <option key={r.id} value={r.id}>{roomName(r.sea)}{!r.sea ? ` · ${i+1}` : ''}</option>)}</select></label>
    <label className="text-sm">{t.people}<select value={guests} onChange={e => setGuests(+e.target.value)} className="mt-1 w-full rounded-md border bg-background p-3"><option value={1}>{t.oneGuest}</option><option value={2}>{t.twoGuests}</option></select></label>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-muted p-4 md:col-span-2"><span className="text-sm text-muted-foreground">{nights > 0 ? `${nights} ${t.nights} × US$ ${price}` : t.selectDates}</span><span className="text-2xl font-semibold text-primary">US$ {nights * price}</span></div>
    <Button asChild className={`h-auto whitespace-normal rounded-full py-4 text-center md:col-span-2 ${nights === 0 ? 'pointer-events-none opacity-50' : ''}`}><a href={nights > 0 ? bookingUrl : undefined} target="_blank" rel="noreferrer" aria-disabled={nights === 0}>{t.availability}</a></Button>
    <p className="text-center text-sm text-muted-foreground md:col-span-2">{t.direct} <a href={WA} target="_blank" rel="noreferrer" className="font-semibold text-primary">{PHONE}</a></p>
   </div>
  </section>
  <Restaurant lang={lang} open={setViewer} />
  <section id="ubicacion" className="mx-auto max-w-5xl px-6 py-20 text-center"><h2 className="text-4xl">{t.locationTitle}</h2><p className="mt-4 text-muted-foreground">{t.locationBody}</p><iframe title={t.locationTitle} className="mt-8 h-80 w-full rounded-lg" loading="lazy" src="https://maps.google.com/maps?q=12.360724029883,-87.022776776975&z=15&output=embed" /></section>
  <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Hotel Cabañas Puesta del Sol · Las Peñitas, León, Nicaragua · <a href={`tel:${PHONE.replace(/ /g,'')}`}>{PHONE}</a></footer>
  <PhotoViewer photos={viewer} onClose={() => setViewer(null)} lang={lang} />
 </main>;
}
