Funkcijska Specifikacija: Solfeggio 2.0
Intelligent Music Theory Learning Platform
Verzija dokumenta: 1.1
Datum: 25. siječnja 2026.
Autor: Solution & Software Architect
Status: Finalna verzija nakon korisničkog feedbacka

1. Sažetak Proizvoda
1.1. Vizija
Solfeggio 2.0 je inteligentna edukacijska platforma za učenje glazbene teorije, namijenjena učenicima glazbenih škola (od 1. do 6. razreda) i samoukim entuzijastima. Platforma koristi hibridni pristup koji kombinira stroga pedagoška pravila (strukturirani kurikulum) s algoritmima za optimizaciju pamćenja (Spaced Repetition System), stvarajući personalizirano iskustvo učenja koje se prilagođava svakom korisniku.

1.2. Problem koji rješavamo
Tradicionalno učenje solfeggia pati od nekoliko ključnih problema.

Jednoobraznost tempa. Svi učenici prolaze istim redoslijedom i brzinom, bez obzira na predznanje ili sposobnosti. Učenik koji već poznaje note gubi vrijeme na trivijalne zadatke, dok učenik koji ima poteškoća s određenim konceptom nema dovoljno ponavljanja.

Nedostatak personalizacije. Udžbenici i tradicionalna nastava ne mogu pratiti individualne slabosti svakog učenika. Profesor s 30 učenika fizički ne može znati da Ivan griješi specifično na noti F1 u bas ključu.

Zaboravljanje. Čak i kada učenik savlada gradivo, bez sustavnog ponavljanja to znanje blijedi. Krivulja zaboravljanja (Ebbinghaus) pokazuje da bez intervencije gubimo 70% naučenog unutar 24 sata.

Pasivnost učenja. Čitanje udžbenika je pasivna aktivnost. Aktivno prisjećanje (active recall) kroz testiranje je dokazano 3-5 puta učinkovitije za dugoročno pamćenje.

1.3. Naše rješenje
Platforma rješava ove probleme kroz četiri ključna mehanizma.

Adaptivni kurikulum. Sustav prati što korisnik zna i automatski prilagođava težinu i sadržaj. Napredni učenik može preskočiti osnove kroz inicijalni test, dok početnik dobiva postupno vođenje.

Spaced Repetition System. Algoritam izračunava optimalni trenutak za ponavljanje svakog pojma, baš prije nego što bi ga korisnik zaboravio. Time se maksimizira učinkovitost vremena provedenog u učenju.

Praćenje vještina prilagođeno tipu sadržaja. Za pojmove koji to omogućuju, sustav prati odvojeno vještinu prepoznavanja i vještinu produkcije. Za ostale pojmove prati se dostupna vještina.

Hibridno generiranje sadržaja. Sustav kombinira proceduralno generiranje za vizualne i audio elemente s unaprijed pripremljenim sadržajem za tekstualne i konceptualne pojmove.

2. Ciljana Publika
2.1. Primarni korisnici
Učenici glazbenih škola (7-14 godina). Djeca koja pohađaju glazbenu školu paralelno s osnovnom školom. Trebaju alat za vježbanje kod kuće između satova s profesorom. Motivira ih napredak i igra, a frustrira ih dosada i ponavljanje onoga što već znaju.

Roditelji učenika. Žele pratiti napredak djeteta i osigurati da vrijeme provedeno na mobitelu ima edukativnu vrijednost. Trebaju jednostavan uvid u to koliko dijete vježba i gdje ima poteškoća.

2.2. Sekundarni korisnici
Odrasli samouci. Amateri koji uče glazbu samostalno (sviraju gitaru, klavir) i žele nadopuniti praktično znanje teorijskom podlogom. Imaju manje vremena, ali veću samodisciplinu.

Profesori solfeggia. Mogu preporučiti aplikaciju učenicima kao dodatni alat za vježbanje. U budućim verzijama mogli bi dobiti dashboard za praćenje napretka svojih učenika.

2.3. Korisničke Persone
Persona 1: Mia (9 godina). Mia je učenica 3. razreda glazbene škole. Svira violinu i ima sat solfeggia jednom tjedno. Voli igrice na tabletu i natjecanje s prijateljicama. Mrzi dosadne vježbenice. Želi aplikaciju koja je "kao igra" i gdje može vidjeti da napreduje.

Persona 2: Marko (12 godina). Marko je učenik 6. razreda glazbene škole. Priprema se za završni ispit iz solfeggia. Ima solidno predznanje, ali nesiguran je u intervale i akorde. Želi ciljano vježbati svoje slabosti bez gubljenja vremena na osnove koje već zna.

Persona 3: Ana (35 godina). Ana je samounica koja uči svirati klavir preko YouTube tutoriala. Shvaća da joj nedostaje teorijska podloga za razumijevanje harmonije. Ima 15-20 minuta dnevno za učenje, obično ujutro uz kavu. Želi strukturirani pristup bez "dječjih" elemenata.

3. Arhitektura Sadržaja
3.1. Četiri Staze Učenja (Tracks)
Cjelokupni sadržaj organiziran je u četiri paralelne staze koje predstavljaju temeljne stupove glazbene pismenosti. Korisnik može napredovati u svim stazama istovremeno, pri čemu je napredak u jednoj stazi većinom neovisan od drugih.

Staza 1: Melodija. Obuhvaća prepoznavanje i lociranje nota na crtovlju. Kreće od osnovnih nota u violinskom ključu (C-dur ljestvica), proširuje se na bas ključ, zatim na tonalitete s predznacima (G-dur, F-dur, itd.), i napreduje do proširenog raspona i alteriranih nota.

Staza 2: Harmonija. Obuhvaća vertikalne odnose između tonova. Kreće od osnovnih intervala (sekunda, terca, kvinta), napreduje do trozvuka (dur, mol, umanjeni, povećani), zatim do obrata akorada i septakorada.

Staza 3: Ritam. Obuhvaća trajanje nota i organizaciju vremena. Kreće od osnovnih vrijednosti (cijela, polovinka, četvrtinka), napreduje do mjera (dvodobna, trodobna, četverodobna), sinkopa, punktiranih nota i kompleksnijih ritamskih obrazaca.

Staza 4: Sluh. Obuhvaća povezivanje zvuka s teorijskim konceptima. Uključuje prepoznavanje intervala na sluh, melodijske diktate, ritamske diktate i prepoznavanje akorada na sluh.

3.2. Struktura Unutar Staze (Units)
Svaka staza podijeljena je na Jedinice učenja (Units). Svaka jedinica predstavlja koherentni paket znanja koji se može savladati u nekoliko sesija. Jedinice su međusobno povezane ovisnostima koje definiraju pedagoški ispravan redoslijed.

Primjer strukture staze Melodija:

Jedinica 1.1 obuhvaća note C-dur ljestvice u violinskom ključu (C4-C5). Ova jedinica nema preduvjeta i predstavlja ulaznu točku za početnike.

Jedinica 1.2 obuhvaća prošireni raspon u violinskom ključu (A3-E5). Preduvjet je savladana Jedinica 1.1.

Jedinica 1.3 obuhvaća note u bas ključu (F2-F3). Preduvjet je savladana Jedinica 1.1 jer korisnik mora razumjeti koncept nota prije nego uči novi ključ.

Jedinica 2.1 obuhvaća G-dur tonalitet (uključuje F#). Preduvjet je savladana Jedinica 1.2.

Jedinica 2.2 obuhvaća F-dur tonalitet (uključuje Bb). Preduvjet je savladana Jedinica 1.2.

Pravilo ovisnosti. Jedinica je "otključana" tek kada su svi njeni preduvjeti označeni kao "savladani". Ovo sprječava preskakanje gradiva i osigurava da korisnik ima potrebnu podlogu za razumijevanje novog materijala.

3.3. Kategorije Pojmova po Mogućnosti Generiranja
Svi pojmovi u sustavu ne mogu se tretirati jednako. Ovisno o prirodi pojma, razlikujemo tri kategorije.

Kategorija A: Potpuno Generabilni Pojmovi

Ovo su pojmovi za koje sustav može algoritmički generirati i vizualni prikaz pitanja i vizualni prikaz odgovora. Za ove pojmove pratimo dualne vještine (Čitanje i Pisanje).

Primjeri uključuju note na crtovlju (C4, D4, E4...), intervale prikazane na crtovlju, trozvuke i akorde prikazane na crtovlju, oznake mjere, ključeve, te predznake tonaliteta.

Za ove pojmove vrijedi puni model dualnog praćenja. Vještina prepoznavanja (vidi simbol, imenuj) i vještina produkcije (vidi naziv, lociraj/nacrtaj) prate se odvojeno. Pojam je savladan tek kada su obje vještine iznad praga.

Kategorija B: Djelomično Generabilni Pojmovi

Ovo su pojmovi za koje sustav može generirati vizualni prikaz u jednom smjeru, ali ne u oba. Za ove pojmove pratimo samo onu vještinu koju možemo testirati.

Primjeri uključuju ritamske obrasce (možemo prikazati notaciju i pitati "koliko doba traje", ali ne možemo očekivati da korisnik "nacrta" ritam), te dinamičke oznake sa simbolima (možemo prikazati "f" i pitati što znači, ali obrnuto je trivijalno).

Za ove pojmove pratimo samo jednosmjernu vještinu. Sustav bilježi koja je to vještina i ne pokušava generirati pitanja u smjeru koji nije podržan.

Kategorija C: Čisto Tekstualni Pojmovi

Ovo su pojmovi koji nemaju vizualnu reprezentaciju koja bi se mogla algoritmički generirati. To su definicije, talijanski termini, teorijska pravila. Za ove pojmove koristimo klasični format pitanje-odgovor iz statičkog sadržaja.

Primjeri uključuju tempo oznake (Adagio, Andante, Allegro, Presto...), artikulacijske oznake (Legato, Staccato, Marcato...), notacijske pojmove (Ligatura, Korona, Da Capo, Dal Segno...), te teorijske koncepte (Što je dominanta? Što je modulacija?).

Za ove pojmove pitanja i odgovori su unaprijed definirani kao dio aplikacije. Nema proceduralnog generiranja. Pratimo jednostruku vještinu (prisjećanje definicije). SRS algoritam i dalje vrijedi za optimizaciju ponavljanja.

3.4. Implikacije Kategorija za Sustav
Struktura Podataka. Svaki pojam mora imati oznaku kategorije (A, B, ili C). Ako je kategorija B, mora biti definirano koja vještina je podržana.

Generator Sesije. Kada generator bira pitanja, mora poštovati kategoriju pojma. Ne smije pokušati generirati "Write" pitanje za pojam kategorije B ili C koji to ne podržava.

Prikaz Napretka. Za pojmove kategorije A, korisnik može vidjeti odvojeni napredak za Čitanje i Pisanje. Za pojmove kategorije B i C, prikazuje se samo jedna metrika napretka.

Uvjet Savladavanja. Za kategoriju A, potrebno je savladati obje vještine. Za kategorije B i C, potrebno je savladati dostupnu vještinu.

3.5. Generiranje i Pohrana Sadržaja
Sustav koristi hibridni pristup koji kombinira algoritmičko generiranje gdje je to moguće s unaprijed pripremljenim sadržajem gdje nije.

Proceduralno Generiranje (za Kategoriju A i dijelom B)

Za pojmove koji imaju jasnu vizualnu ili audio reprezentaciju temeljenu na parametrima, sustav generira sadržaj u stvarnom vremenu.

Vizualno generiranje obuhvaća note (definirane visinom, trajanjem, ključem), intervale (definirane dvjema notama), akorde (definirane skupom nota), te predznake (definirane tonalitetom).

Audio generiranje obuhvaća pojedinačne tonove, intervale (melodijske i harmonijske), akorde, te jednostavne ritamske obrasce.

Prednosti proceduralnog pristupa uključuju beskonačne varijacije istog koncepta, mogućnost fine prilagodbe težine kroz parametre, te eliminaciju potrebe za održavanjem velike baze resursa.

Statički Sadržaj kao JavaScript Moduli (za Kategoriju C i dijelom B)

Pojmovi koji su inherentno tekstualni ili konceptualni definirani su kao dio samog koda aplikacije.

Sadržaj se definira kao JavaScript objekti ili JSON datoteke koje se uključuju u build aplikacije. Svaka kategorija sadržaja ima svoju datoteku: datoteka za tempo oznake, datoteka za artikulacije, datoteka za teorijske pojmove, i tako dalje.

Svaki zapis sadrži identifikator pojma, naziv pojma, kategoriju, tekst pitanja, točan odgovor, netočne opcije za višestruki izbor, te opcionalno objašnjenje ili mnemotehniku.

Razlika: Statički Sadržaj vs. Korisničko Stanje

Statički sadržaj je definicija "što postoji" i to je isto za sve korisnike, dolazi s kodom. Korisničko stanje je "kako korisnik napreduje" i to je jedinstveno za svakog korisnika, živi u LocalStorage-u.

Primjer: Definicija da Adagio znači "polagano" je statički sadržaj. Informacija da je korisnik Marko odgovorio krivo na pitanje o Adagiu tri puta i treba ga ponoviti sutra je korisničko stanje.

3.6. Kurikulum kao Eksterna Konfiguracija
Kurikulum mora biti odvojen od aplikacijske logike i spreman u zasebnim datotekama koje je lako uređivati bez promjene koda. Aplikacija je "engine", kurikulum je "sadržaj".

Format kurikuluma. Glavna datoteka definira kategorije i pravila generiranja, a definicije pojmova žive u posebnim datotekama:

- curriculum.json: kategorije, generator pravila, preduvjeti, metapodaci.
- concepts/*.json: definicije pojmova (render parametri, objašnjenja, pitanja).

Generativna pravila (umjesto eksplicitnih lista):

- spiral_from_anchor: za note. Definira se sidro (npr. C1), granice (najniža/najviša nota) i obrazac širenja (naizmjenično gore-dolje). Aplikacija automatski generira redoslijed učenja bez ručnog popisa svih nota.
- ordered_list: za pojmove gdje redoslijed nije izvediv iz jednostavnog pravila (intervali, akordi). Redoslijed je eksplicitan, ali samo na razini pojmova, ne svih mogućih pitanja.
- explicit_qa: za kategoriju C (teorija). Svako pitanje i odgovor su ručno definirani.

Primjer pravila za note (ideja):
Sidro C1, zatim D1 (prvo gore), H (prvo dolje), E1 (drugo gore), A (drugo dolje), i tako dalje, sve dok se ne dosegne donja i gornja granica raspona za ključ.

Pravila:
- Aplikacija učitava kurikulum pri pokretanju i kešira ga u memoriju.
- Promjene u kurikulumu ne zahtijevaju promjene u kodu.
- Napredak korisnika ostaje kompatibilan i nakon promjene redoslijeda ili granica.

Primjena: ako se utvrdi da je redoslijed nota pogrešan (npr. C1 → D1 → E1 umjesto C4 → D4 → E4), mijenja se samo pravilo u kurikulumu.

4. Sustav Učenja i Pamćenja
4.1. Spaced Repetition System (SRS)
Sustav koristi algoritam raspršenog ponavljanja koji optimizira trenutke ponavljanja za maksimalno zadržavanje znanja uz minimalno utrošeno vrijeme.

Temeljna logika. Svaki pojam (točnije, svaka podržana vještina svakog pojma) ima svoj "interval ponavljanja" koji se dinamički prilagođava. Kada korisnik točno odgovori, interval se povećava (npr. s 1 dana na 3 dana, zatim na 7 dana, zatim na 14 dana). Kada korisnik pogriješi, interval se resetira na početak.

Krivulja zaboravljanja. Algoritam je dizajniran da prezentira pojam korisniku upravo u trenutku kada je vjerojatnost prisjećanja pala na oko 90%. To je "sweet spot" gdje je ponavljanje najučinkovitije - dovoljno teško da zahtijeva mentalni napor, ali ne toliko teško da korisnik zaboravlja.

Prioritizacija. Kada sustav generira sesiju vježbanja, prvo uzima pojmove čiji je interval istekao (potrebno ih je ponoviti danas). Tek ako nema dovoljno takvih pojmova, uvodi novo gradivo.

4.2. Planer Kurikuluma (Curriculum Planner)
Planer je komponenta koja odlučuje koji je sljedeći logični korak u učenju, neovisno o SRS-u.

Funkcija Planera. Planer pregledava graf ovisnosti i identificira prvu jedinicu koja ispunjava dva uvjeta: svi preduvjeti su savladani, sama jedinica još nije savladana. Ta jedinica postaje "aktivna" i iz nje se crpe novi pojmovi za učenje.

Interakcija Planera i SRS-a. Planer kaže "što", SRS kaže "kada". Planer identificira da je sljedeća jedinica "G-dur tonalitet". SRS odlučuje hoće li danas uvesti nove note iz G-dura ili će korisnik prvo ponoviti stare note iz C-dura koje je blizu zaboravljanja.

4.3. Generator Sesije (Session Mixer)
Generator je komponenta koja kreira konačni set pitanja za svaku sesiju vježbanja.

Sastav sesije. Svaka sesija sadrži 10 pitanja s otprilike sljedećim omjerom: 30% novog gradiva (pojmovi koje korisnik još nije vidio ili ih je vidio samo jednom), 50% ponavljanja (pojmovi čiji je SRS interval istekao ili uskoro ističe), 20% utvrđivanja (pojmovi koje korisnik dobro zna, služe za održavanje samopouzdanja i sprječavanje regresije).

Poštivanje kategorija. Generator mora provjeriti kategoriju svakog pojma prije generiranja pitanja. Za pojmove kategorije A, može generirati i "Read" i "Write" pitanja. Za pojmove kategorije B, generira samo podržani smjer. Za pojmove kategorije C, koristi unaprijed definirano pitanje iz statičkog sadržaja.

Dinamička prilagodba formata. Za pojmove kategorije A, ako sustav detektira da korisnik ima značajno bolju točnost u čitanju nego u pisanju za određeni pojam, generirat će više pitanja tipa "lociranje" za taj pojam dok se vještine ne izjednače.

Dnevni limit novog gradiva. Sustav ima ugrađeni limit koliko novih pojmova može uvesti u jednom danu (npr. maksimalno 10 novih pojmova). Ovo sprječava preopterećenje i osigurava da korisnik ima kapacitet za kvalitetno procesuiranje novog znanja.

5. Korisničko Sučelje i Navigacija
5.1. Glavna Navigacija
Aplikacija koristi fiksnu donju navigacijsku traku s tri glavna taba koji su uvijek vidljivi (osim tijekom aktivnog kviza).

Tab 1: Učenje (Discovery). Ovo je početni ekran i glavna ulazna točka. Služi za usvajanje novog gradiva i pregled napretka kroz kurikulum. Ovdje korisnik vidi "veliku sliku" svog putovanja.

Tab 2: Vježbanje (Practice). Služi za ciljano utvrđivanje postojećeg znanja. Ovdje korisnik može odabrati specifičnu kategoriju za vježbanje ili fokusirati se na svoje slabosti.

Tab 3: Napredak (Profile). Prikazuje statistike, povijest aktivnosti i postavke. Služi za refleksiju i motivaciju.

5.2. Ekran Učenje (Tab 1)
Zaglavlje. Prikazuje pozdrav korisniku, trenutni streak (broj uzastopnih dana vježbanja) i ukupnu razinu/iskustvo.

Primarna Akcija - Dnevni Mix. Dominantan gumb koji pokreće algoritamski optimiziranu sesiju. Ovo je preporučena akcija za većinu korisnika većinu vremena. Sustav automatski balansira novo gradivo i ponavljanje.

Sekcija Staze. Četiri horizontalne kartice (Melodija, Harmonija, Ritam, Sluh) koje prikazuju trenutni status svake staze. Za svaku stazu vidljiva je trenutno aktivna jedinica i postotak napretka. Korisnik može kliknuti na stazu da fokusira učenje samo na tu domenu.

Vizualni Indikatori. Zaključane jedinice prikazane su sivo s ikonom lokota. Aktivne jedinice imaju istaknutu boju i poziv na akciju. Savladane jedinice imaju kvačicu.

5.3. Ekran Vježbanje (Tab 2)
Sekcija Slabosti. Dinamička sekcija koja se prikazuje samo ako sustav detektira pojmove s niskom točnošću. Prikazuje listu od 3-5 najproblematičnijih pojmova s gumbom za ciljanu vježbu.

Katalog Kategorija. Lista svih otključanih kategorija (Note violinski, Note bas, Intervali, Trozvuci, itd.). Svaka kategorija prikazuje indikator "svježine" - vizualni signal koliko je znanje u toj kategoriji stabilno. Zeleno znači da je sve sveže u pamćenju. Žuto znači da neke stavke trebaju ponavljanje uskoro. Crveno znači da postoje stavke koje korisnik vjerojatno već zaboravlja.

Akcija. Klik na bilo koju kategoriju pokreće sesiju vježbanja fokusiranu isključivo na tu kategoriju.

5.4. Ekran Napredak (Tab 3)
Statistike. Ukupna točnost (postotak svih točnih odgovora), broj naučenih pojmova (pojmovi koji su dosegli status "savladano"), ukupno riješenih pitanja, najduži streak.

Graf Aktivnosti. Stupčasti graf koji prikazuje aktivnost kroz zadnjih 7 dana. Y-os predstavlja broj riješenih pitanja, X-os predstavlja dane u tjednu.

Prognoza Zaboravljanja. Lista kategorija s brojem pojmova koji će "dospjeti" za ponavljanje u idućih nekoliko dana. Pomaže korisniku planirati vrijeme za učenje.

Postavke. Kontrole za zvuk, dnevni cilj, i opcija resetiranja napretka.

5.5. Ekran Kviz (Immersive Mode)
Kada korisnik započne bilo koju sesiju vježbanja, sučelje prelazi u način rada preko cijelog ekrana. Donja navigacija nestaje. Fokus je 100% na pitanju.

Zaglavlje Kviza. Gumb za izlaz (X) u kutu, naslov sesije ili kategorije, indikator napretka (npr. "Pitanje 4/10" ili progress bar).

Zona Pitanja. Centralni prostor za prikaz pitanja. Za vizualna pitanja prikazuje se crtovlje s notama, intervalima ili akordima. Za slušna pitanja prikazuje se gumb za reprodukciju zvuka. Za teorijska pitanja prikazuje se tekst pitanja.

Zona Odgovora. Prostor za unos odgovora. Za pitanja s višestrukim izborom prikazuju se 3-4 gumba s ponuđenim odgovorima. Za pitanja lociranja prikazuje se interaktivno crtovlje gdje korisnik može kliknuti.

Povratna Informacija. Odmah nakon odgovora, sustav vizualno signalizira točnost. Zelena pozadina i animacija za točan odgovor. Crvena pozadina i animacija "tresenja" za netočan odgovor.

Edukativni Trenutak (Teachable Moment). U slučaju netočnog odgovora, prije nego korisnik može nastaviti, prikazuje se panel s objašnjenjem. Panel sadrži što je korisnik odgovorio, što je bio točan odgovor, i kratko objašnjenje zašto (npr. "Nota D1 nalazi se u prostoru ispod prve crte u violinskom ključu"). Korisnik mora kliknuti "Dalje" da nastavi.

5.6. Ekran Rezultat (Summary)
Pojavljuje se automatski nakon zadnjeg pitanja u sesiji.

Prikaz Rezultata. Veliki, istaknut prikaz broja točnih odgovora (npr. "9/10"). Motivacijska poruka prilagođena rezultatu. Prikaz zarađenih bodova iskustva (XP).

Analiza Grešaka. Ako je bilo pogrešnih odgovora, prikazuje se sažeta lista s prikazom pojmova na kojima je korisnik pogriješio.

Akcije. Gumb "Ponovi" za ponovno rješavanje iste sesije. Gumb "Završi" za povratak na prethodni ekran (Učenje ili Vježbanje).

5.7. Modalni Dijalozi
Modal Izlaza. Pojavljuje se kada korisnik klikne "X" tijekom aktivnog kviza. Upozorava da napredak neće biti spremljen i nudi opcije "Nastavi" ili "Izađi".

Modal Postignuća. Pojavljuje se kada korisnik otključa novo postignuće (badge). Prikazuje ikonu postignuća, naziv i kratki opis.

6. Onboarding i Prvi Kontakt
6.1. Potreba za Onboardingom
Novi korisnik može biti potpuni početnik ili može već imati značajno predznanje. Bez inicijalne kalibracije, iskustvo neće biti optimalno - početnik će biti preplavljen, a napredni korisnik će se dosađivati.

6.2. Tijek Onboardinga
Korak 1: Dobrodošlica. Ekran dobrodošlice s kratkim opisom aplikacije i dva jasna puta naprijed.

Korak 2: Odabir Puta. Korisnik bira između dvije opcije.

Opcija A - "Testiraj svoje znanje": Za korisnike koji već imaju neko predznanje. Vodi na adaptivni inicijalni test.

Opcija B - "Kreni od početka": Za potpune početnike. Preskače test i postavlja korisnika na prvi nivo svih staza.

Korak 3: Adaptivni Test (ako je odabrana Opcija A). Kratki test od 15-25 pitanja koji pokriva sve četiri staze. Pitanja se dinamički prilagođavaju - postaju teža ako korisnik odgovara točno, lakša ako griješi. Cilj nije "ocjenjivanje" već kalibracija.

Korak 4: Rezultat Kalibracije. Prikaz procijenjene razine za svaku stazu (npr. "Melodija: Razina 3, Harmonija: Razina 1"). Sustav automatski otključava odgovarajuće jedinice. Korisnik vidi koliko je sadržaja "preskočio" i može odmah krenuti s relevantnim gradivom.

6.3. Trigger za Onboarding
Onboarding se pokreće samo jednom, pri prvom pokretanju aplikacije (kada je ukupni XP jednak nuli). Nakon toga, korisnik uvijek dolazi direktno na ekran Učenje.

7. Sustav Nagrađivanja (Gamifikacija)
7.1. Svrha Gamifikacije
Gamifikacija nije sama sebi svrha. Njen cilj je poticanje redovitosti i dugoročne angažiranosti. Elementi su dizajnirani da nagrađuju konzistentnost, ne samo sposobnost.

7.2. Streakovi (Vatrice)
Definicija. Streak je broj uzastopnih dana u kojima je korisnik završio barem jednu sesiju vježbanja.

Prikaz. Streak se prominentno prikazuje na ekranu Učenje s ikonom vatre i brojem dana.

Gubitak. Ako korisnik preskoči dan, streak se resetira na nulu. Ovo stvara "pozitivni pritisak" za svakodnevno vraćanje.

Vizualno pojačanje. Što je streak duži, to je vizualni prikaz intenzivniji (veća vatra, toplije boje na kartici).

7.3. Bodovi Iskustva (XP)
Zarađivanje. Korisnik zarađuje XP za svaki točan odgovor (npr. 10 XP). Bonus XP za visoku točnost u sesiji (npr. +50 XP za 100% točnost). Bonus XP za održavanje streaka.

Razine. Akumulirani XP određuje "razinu" korisnika. Razine imaju nazive prilagođene glazbenoj domeni (npr. "Početnik", "Učenik", "Glazbenik", "Virtuoz"). Prelazak na novu razinu prikazuje se kao mini-proslava.

7.4. Postignuća (Badges)
Postignuća su trajna priznanja za specifične uspjehe. Za razliku od XP-a koji se kontinuirano akumulira, postignuća se otključavaju jednom i ostaju trajno vidljiva.

Primjeri postignuća:

"Prvi Koraci" - Završi prvu sesiju vježbanja.

"Tjedan Dana" - Održi streak od 7 dana.

"Perfekcionista" - Postići 10/10 u jednoj sesiji.

"Notni Majstor" - Savladaj sve note u violinskom ključu.

"Zlatno Uho" - Točno odgovori na 50 slušnih pitanja.

"Maraton" - Riješi 100 pitanja u jednom danu.

7.5. Dnevni Cilj
Korisnik može postaviti dnevni cilj (npr. 10 pitanja, 20 pitanja, 30 pitanja). Ispunjenje cilja prikazuje se vizualno (npr. punjenje prstena). Ispunjeni cilj doprinosi osjećaju postignuća čak i kada nije bilo savršenih rezultata.

8. Tehnički Zahtjevi
8.1. Pohrana Podataka - LocalStorage
Za verziju 2.0, svi podaci pohranjuju se lokalno na korisnikovom uređaju koristeći Web LocalStorage API. Nema centralnog servera, nema baze podataka, nema korisničkih računa.

Prednosti ovog pristupa. Nulta latencija jer su svi podaci dostupni trenutno, bez mrežnih poziva. Potpuna offline funkcionalnost jer aplikacija radi identično s internetom i bez njega. Jednostavnost implementacije jer nema potrebe za backend infrastrukturom, autentikacijom, API-jima. Privatnost jer podaci nikad ne napuštaju korisnikov uređaj. Nulti troškovi održavanja jer nema servera koji treba plaćati i održavati.

Ograničenja koja prihvaćamo. Jedan korisnik po uređaju, odnosno po pregledniku. Nema sinkronizacije između uređaja, što znači da napredak na mobitelu nije vidljiv na tabletu. Gubitak podataka ako korisnik obriše podatke preglednika ili reinstalira aplikaciju. Ograničenje veličine od oko 5-10MB ovisno o pregledniku, što je više nego dovoljno za naše potrebe.

Struktura Pohranjenih Podataka

Korisnički profil sadrži datum prvog pokretanja, akumulirane XP bodove, trenutnu razinu, postavke poput uključenosti zvuka i dnevnog cilja.

Statistika streakova sadrži trenutni streak, datum zadnje aktivnosti, najduži streak ikad postignut.

Stanje napretka po pojmovima sadrži za svaki pojam razinu savladanosti, interval ponavljanja u danima, datum idućeg ponavljanja, broj uzastopnih točnih odgovora, ukupan broj pokušaja, broj točnih odgovora ukupno. Za pojmove kategorije A, ovi podaci postoje odvojeno za čitanje i pisanje vještinu.

Povijest sesija sadrži za svaku sesiju datum i vrijeme, tip sesije, broj pitanja, broj točnih, i listu pojmova koji su bili krivo odgovoreni.

Stanje kurikuluma sadrži listu otključanih jedinica i listu savladanih jedinica.

Strategija Verzioniranja. LocalStorage struktura može se mijenjati između verzija aplikacije. Svaki spremljeni objekt uključuje broj verzije sheme. Pri pokretanju, aplikacija provjerava verziju i po potrebi migrira podatke na novu strukturu. Migracija mora biti unatrag kompatibilna i nikad ne smije izgubiti korisničke podatke.

Budući Prijelaz na Backend. Arhitektura je dizajnirana tako da se LocalStorage može zamijeniti ili nadopuniti backend pohranom bez velikih promjena u ostatku aplikacije. Sva komunikacija s pohranom ide kroz definirane funkcije. Kada i ako dođe potreba za sinkronizacijom ili višekorisničkim pristupom, te funkcije mogu interno preusmjeriti na API pozive, dok ostatak aplikacije ostaje nepromijenjen.

8.2. Statički Sadržaj kao Dio Koda
Pojopa savladavanja.** Prosječno vrijeme potrebno da pojam prijeđe iz statusa "novi" u status "savladano".

Stopa zadržavanja. Postotak pojmova koje korisnik točno prisjeti nakon 7 dana, 30 dana, 90 dana bez ponavljanja.

Distribucija slabosti. Koji pojmovi imaju najnižu prosječnu točnost. Identificira potencijalne probleme u kurikulumu ili objašnjenjima.

9.3. Tehničke Metrike
Stopa padova. Postotak sesija koje završe neočekivanim zatvaranjem aplikacije.

Vrijeme učitavanja. Koliko brzo se aplikacija pokreće i koliko brzo se generiraju pitanja.

10. Ograničenja i Izvan Opsega
10.1. Izvan Opsega za Verziju 2.0
Društvene funkcionalnosti. Prijatelji, leaderboardi, dijeljenje na društvene mreže. Ovo komplicira GDPR compliance i nije kritično za osnovnu vrijednost proizvoda.

Dashboard za profesore. Mogućnost da profesori prate napredak više učenika. Značajna dodatna kompleksnost koja zahtijeva autentikaciju, uloge i posebno sučelje.

Napredno stvaranje sadržaja. Mogućnost da korisnici ili profesori kreiraju vlastite jedinice i pitanja. Zahtijeva značajnu moderacijsku infrastrukturu.

Multiplayer/natjecanja. Sinkrona natjecanja između korisnika u stvarnom vremenu.

Detaljni melodijski diktati. Zapisivanje cijelih melodija od više taktova. Zahtijeva kompleksno sučelje za unos.

Backend i sinkronizacija. Centralni server, korisnički računi, sinkronizacija između uređaja. Ovo je svjesna odluka za pojednostavljenje verzije 2.0.

10.2. Poznata Ograničenja
Jedan korisnik po uređaju. Verzija 2.0 ne podržava više profila na istom uređaju. Ovo pojednostavljuje upravljanje stanjem.

Nema sinkronizacije. Napredak na jednom uređaju nije vidljiv na drugom. Korisnik mora koristiti isti uređaj/preglednik za kontinuitet.

Samo mobilni/tablet format. Optimizirano za uređaje s ekranom na dodir. Desktop verzija nije prioritet.

Samo hrvatski jezik. Inicijalna verzija je lokalizirana samo za hrvatski. Internacionalizacija je moguća u budućim verzijama.

11. Primjeri Pojmova po Kategorijama
Kategorija A - Potpuno Generabilni (Dualno Praćenje)
Note u violinskom ključu (C4 do G5), note u bas ključu (F2 do C4), intervali do oktave, durski trozvuci, molski trozvuci, predznaci dur tonaliteta, predznaci mol tonaliteta.

Kategorija B - Djelomično Generabilni (Jednosmjerno Praćenje)
Ritamske figure (prikaz → imenovanje), dinamičke oznake sa simbolima poput pp, p, mp, mf, f, ff (simbol → značenje), ukrasne oznake poput trilera i mordenta (simbol → naziv).

Kategorija C - Tekstualni iz Statičkog Sadržaja (Jednosmjerno Praćenje)
Tempo oznake (Largo, Adagio, Andante, Moderato, Allegro, Vivace, Presto), artikulacijske oznake (Legato, Staccato, Tenuto, Marcato, Sforzando), notacijski pojmovi (Ligatura, Korona, Cezura, Repeticija, Da Capo, Dal Segno, Coda, Fine), teorijski pojmovi (Tonika, Dominanta, Subdominanta, Modulacija, Kadenca), glazbeni oblici (Rondo, Sonata, Fuga, Kanon).

12. Plan Implementacije po Fazama
FAZA 0: Stabilizacija Temelja
Trajanje: 1-2 vikenda

Cilj: Pripremiti postojeći kod za evoluciju bez velikih promjena vidljivih korisniku.

Zadaci: Organizirati postojeći kod u logičke module (razdvojiti UI logiku od podataka). Implementirati osnovni sustav za LocalStorage pohranu korisničkog stanja. Osigurati da se rezultati sesija spremaju lokalno. Dodati praćenje osnovne statistike (broj riješenih pitanja, broj točnih).

Rezultat: Aplikacija "pamti" korisnika između posjeta. Korisnik može vidjeti svoju ukupnu statistiku na ekranu Profil.

Vrijednost za korisnika: Osjećaj kontinuiteta - aplikacija više nije "stranac" svaki put kad se otvori.

FAZA 1: Pamćenje Slabosti
Trajanje: 2 vikenda

Cilj: Aplikacija postaje "svjesna" korisnikovih slabosti.

Zadaci: Za svaki odgovor, spremiti koji je pojam bio u pitanju i je li odgovor bio točan. Implementirati algoritam koji identificira najproblematičnije pojmove (najniža točnost kroz zadnjih N pokušaja). Na ekranu Učenje, popuniti sekciju "Tvoje slabosti" s dinamičkim podacima. Dodati gumb "Vježbaj slabosti" koji generira sesiju fokusiranu na te pojmove.

Rezultat: Korisnik vidi listu pojmova na kojima najviše griješi i može ih ciljano vježbati.

Vrijednost za korisnika: Personalizacija - aplikacija "zna" gdje imam problem i pomaže mi upravo s tim.

FAZA 1B: Strukturirani Kurikulum po Kategorijama
Trajanje: 2-3 vikenda

Cilj: Implementirati kurikulum kao eksternu konfiguraciju koja definira generativna pravila i redoslijed pojmova unutar svake kategorije.

Zadaci: Definirati format kurikulum datoteka (curriculum.json + concepts/*.json). Za svaku kategoriju definirati generator pravila (npr. spiral_from_anchor za note, ordered_list za intervale, explicit_qa za teoriju). Uvesti praćenje fronte učenja po kategoriji (zadnji viđen i savladan pojam). Implementirati logiku generiranja sesije unutar kategorije: prioritet imaju pojmovi u procesu, uvode se 1-3 nova pojma po sesiji, ostatak popunjava ponavljanje savladanih. Osigurati kompatibilnost napretka nakon promjena pravila ili granica.

Rezultat: Klik na kategoriju pokreće sesiju koja postupno uvodi nove pojmove prema kurikulumu bez ručnog odabira podlekcija.

Vrijednost za korisnika: Jasna progresija i fleksibilan kurikulum koji se može mijenjati bez promjene koda.

FAZA 2: Gamifikacija i Motivacija
Trajanje: 2 vikenda

Cilj: Povećati redovitost korištenja kroz sustav nagrada.

Zadaci: Implementirati sustav streakova (praćenje uzastopnih dana aktivnosti). Implementirati XP sustav i razine. Kreirati vizualne indikatore napretka (progress barovi po kategorijama). Implementirati 3-5 početnih postignuća (badges).

Rezultat: Korisnik ima razlog vraćati se svaki dan. Vidljiv je dugoročni napredak.

Vrijednost za korisnika: Motivacija i osjećaj postignuća - vježbanje postaje "igra" s nagradama.

FAZA 3: Spaced Repetition System
Trajanje: 3-4 vikenda

Cilj: Optimizirati vrijeme učenja kroz algoritamsko raspoređivanje ponavljanja.

Zadaci: Za pojmove kategorije A, pratiti odvojeno "Čitanje" i "Pisanje" vještinu. Za pojmove kategorije B i C, pratiti dostupnu vještinu. Implementirati pojednostavljeni SRS algoritam (izračun intervala ponavljanja). Kreirati logiku koja prioritizira pojmove koji su "dospjeli" za ponavljanje. Implementirati funkciju "Dnevni Mix" koja balansira ponavljanje i novo gradivo. Dodati vizualni indikator "svježine" znanja po kategorijama.

Rezultat: Aplikacija inteligentno bira što prikazati korisniku i kada. Korisnik uči efikasnije jer ponavlja stvari u optimalnom trenutku.

Vrijednost za korisnika: Efikasnost - manje vremena za bolje rezultate, bez ručnog planiranja.

FAZA 4: Struktura Kurikuluma
Trajanje: 2-3 vikenda

Cilj: Uvesti pedagošku strukturu i osjećaj progresije.

Zadaci: Definirati graf ovisnosti za sve jedinice učenja. Implementirati logiku otključavanja (jedinica postaje dostupna kad su preduvjeti ispunjeni). Redizajnirati ekran Učenje da prikazuje "staze" s vidljivim napretkom. Dodati vizualne indikatore za zaključane/otključane/savladane jedinice.

Rezultat: Korisnik vidi "mapu" svog učenja. Jasno je što je sljedeći korak i zašto.

Vrijednost za korisnika: Jasnoća i struktura - osjećaj da postoji plan, ne samo nasumična gomila pitanja.

FAZA 5: Onboarding
Trajanje: 2 vikenda

Cilj: Prilagoditi početno iskustvo razini predznanja korisnika.

Zadaci: Kreirati ekran dobrodošlice s izborom puta. Implementirati adaptivni inicijalni test (pitanja se prilagođavaju točnosti). Implementirati logiku kalibracije (mapiranje rezultata testa na otključavanje jedinica). Kreirati ekran rezultata kalibracije.

Rezultat: Novi korisnik s predznanjem može preskočiti osnove. Potpuni početnik dobiva primjeren start.

Vrijednost za korisnika: Poštovanje vremena - napredni korisnik ne mora prolaziti ono što već zna.

FAZA 6: Audio Engine
Trajanje: 3-4 vikenda

Cilj: Omogućiti slušne vježbe i aktivirati stazu "Sluh".

Zadaci: Integrirati audio biblioteku za sintezu zvuka. Implementirati reprodukciju pojedinačnih nota. Implementirati reprodukciju intervala (melodijski i harmonijski). Kreirati novi tip pitanja: "Slušaj i prepoznaj". Aktivirati sadržaj za stazu "Sluh" u kurikulumu.

Rezultat: Aplikacija može reproducirati glazbene tonove. Korisnik može vježbati prepoznavanje intervala na sluh.

Vrijednost za korisnika: Kompletnost - glazba nije samo vizualna, slušna komponenta je kritična.

FAZA 7: Teachable Moments
Trajanje: 2 vikenda

Cilj: Transformirati pogreške u prilike za učenje.

Zadaci: Za svaki pojam, definirati strukturirano objašnjenje (pozicija, pravilo, mnemotehniku). Kreirati UI komponentu za prikaz objašnjenja nakon pogreške. Implementirati logiku koja spaja pojam s odgovarajućim objašnjenjem. Osigurati da korisnik mora potvrditi da je pročitao objašnjenje prije nastavka.

Rezultat: Svaka pogreška je prilika za učenje, ne samo frustracija.

Vrijednost za korisnika: Razumijevanje - ne samo "krivo" nego "zašto i kako".

FAZA 8: Dvosmjerne Vještine (Full Implementation)
Trajanje: 3 vikenda

Cilj: Omogućiti pitanja "u oba smjera" za pojmove kategorije A.

Zadaci: Implementirati interaktivno crtovlje (korisnik može kliknuti na poziciju). Kreirati tip pitanja "Lociranje" (vidi naziv, klikni gdje je nota). Povezati dvosmjerno praćenje s SRS algoritmom. Osigurati da sustav automatski pojačava slabiji smjer za pojmove koji to podržavaju.

Rezultat: Za pojmove kategorije A, korisnik ne može "varati" tako da prepoznaje ali ne zna locirati. Znanje je doista duboko.

Vrijednost za korisnika: Pravo znanje - sposobnost korištenja u praksi, ne samo prepoznavanje.

FAZA 9: Tekstualni Sadržaj (Kategorija C)
Trajanje: 2-3 vikenda

Cilj: Proširiti kurikulum s teorijskim pojmovima koji se ne mogu proceduralno generirati.

Zadaci: Kreirati datoteke sa statičkim sadržajem za tempo oznake, artikulacije, notacijske pojmove i teorijske koncepte. Implementirati tip pitanja koji koristi statički sadržaj (pitanje iz baze, višestruki izbor). Integrirati tekstualne pojmove u postojeći SRS sustav. Dodati nove jedinice u kurikulum koje koriste kombinaciju generiranih i statičkih pojmova.

Rezultat: Kurikulum pokriva i vizualne i teorijske aspekte glazbene pismenosti.

Vrijednost za korisnika: Potpunost - ne samo note i intervali, već i razumijevanje glazbenog rječnika.

FAZA 10: Polish i Optimizacija
Trajanje: Kontinuirano

Cilj: Fino podešavanje na temelju stvarnog korištenja.

Zadaci: Prikupljati feedback od stvarnih korisnika. Analizirati metrike korištenja. Identificirati i popraviti "pain points". Optimizirati performanse. Dodavati sadržaj u kurikulum na temelju potreba.

Rezultat: Aplikacija koja kontinuirano postaje bolja.

Vrijednost za korisnika: Osjećaj da netko sluša i da se proizvod razvija.
