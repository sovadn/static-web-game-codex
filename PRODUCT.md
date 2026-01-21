# Opis produkta

## Sažetak
Ova aplikacija je statična web igra za vježbu čitanja nota. Fokus je na brzom prepoznavanju notnih položaja u violinskom i bas ključu uz jasno vizualno sučelje, jednostavnu interakciju i trenutačnu povratnu informaciju.

## Cilj i publika
- Namjena: razvijanje refleksa za čitanje nota i prepoznavanje položaja na crtovlju.
- Ciljana publika: učenici glazbenih škola, samouki glazbenici i svi koji žele ubrzati čitanje nota.

## Način rada
Igra nudi dva moda:

1. **Quiz**
   - Pitanje: prikaz note na crtovlju.
   - Odgovori: 3 gumba s tekstualnim odgovorima (npr. `e1`, `f#1`).
   - Cilj: odabrati točan naziv note s ispravnom oktavom.

2. **Rosetta Stone**
   - Pitanje: tekstualno (npr. “Show note e1”).
   - Odgovori: 4 gumba sa slikama notnog zapisa (bez teksta).
   - Cilj: odabrati ispravan zapis note na crtovlju.

## Glavne značajke
- Podrška za violinski i bas ključ.
- Key signature sustav (C, G, F, D, Bb) koji utječe na predznake.
- Prikaz nota i kratka povratna informacija nakon odgovora.
- “Army/Combo/Level” metrika kao motivacijski UI element.
- Lokalni prikaz nota pomoću VexFlow (offline fallback u `vendor/`).

## UX i vizualni smjer
Vizualni stil je čist, fokusiran i “game-like”, s naglaskom na:
- tamnu pozadinu radi kontrasta,
- jasne kartice za notni prikaz,
- velike, lako klikljive gumbe,
- Rosetta Stone grid s karticama koje nose notni zapis.

## Funkcijska specifikacija: Animacije feedbacka (correct glow / wrong shake)
### Svrha
Povećati osjećaj “igre” i trenutno razumijevanje ishoda (točno/krivo) bez potrebe za čitanjem, uz minimalno ometanje toka igre.

### Objekt animacije
Animacije se primjenjuju na glavni “notation card” (kartica s notnim crtovljem), ne na cijeli ekran.

### Pravila ponašanja
**Točan odgovor**
- Kratki “pozitivni” efekt: zeleni glow (halo oko kartice).
- Trajanje: približno 0.4–0.6 sekundi.
- Ne smije mijenjati raspored elemenata (bez pomicanja sadržaja).

**Netočan odgovor**
- Kratki “negativni” efekt: crveni shake (horizontalno podrhtavanje) i/ili blagi crveni glow.
- Trajanje: približno 0.45–0.65 sekundi.
- Ne smije mijenjati raspored elemenata (bez reflowa).

**Stabilnost i nepreklapanje**
- Brzi uzastopni odgovori: novi efekt poništava prethodni (reset), bez gomilanja.
- Nakon završetka animacije kartica se vraća u normalno stanje.

**Bez “jumpy layouta”**
- Dozvoljeni su samo efekti bez utjecaja na layout (npr. transform, box-shadow/outline).

### Očekivani korisnički doživljaj
- Korisnik odmah osjeti uspjeh (zeleni feedback) ili pogrešku (shake) bez čitanja.
- Efekti su kratki i ne frustriraju; “wrong” efekt je informativan, ne agresivan.

## Tehničke napomene
- Aplikacija je statična (HTML/CSS/JS).
- Pokretanje lokalno: otvoriti `index.html` ili poslužiti preko `python -m http.server`.
- Automatski testovi: Playwright.

## Daljnji razvoj (ideje)
- Uključivanje više razina i šireg raspona nota.
- Dodavanje metrika napretka i statistikâ (točnost, vrijeme reakcije).
- Personalizirani setovi pitanja po korisniku.
