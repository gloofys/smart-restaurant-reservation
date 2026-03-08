# Otsused ja eeldused

See dokument koondab peamised tehnilised otsused, töö käigus tehtud eeldused ja teadlikult lihtsustatud kohad. Panin siia kirja just need valikud, mis ei sündinud juhuslikult, vaid aitasid ebamääraseid kohti ülesandes paremini piiritleda.

## 1. Eeldused ja täpsustused ülesande kohta

Ülesandes jäi mitu detaili lahti, seega defineerisin ise mõned reeglid.

- Online-broneeringu maksimaalne grupi suurus on 12 inimest.
  See piirang ei tulnud otseselt ülesandest, vaid oli teadlik otsus. Suuremate gruppide puhul muutuks nii kasutajaliides kui ka lauasoovituse loogika kiiresti keerulisemaks.

- Broneeringu vaikimisi kestus on 150 minutit.
  See tundus restorani kontekstis piisavalt realistlik.

- Süsteem proovib esmalt leida ühe sobiva laua ja alles siis liidetavat lauapaari.
  See oli teadlik loogika, et eelistada võimalusel ühte lauda kahe asemel, mis on tavaliselt kasutajale mugavam ja restorani jaoks lihtsam korraldada.

- Soovitusalgoritm tagastab ühe parima variandi, mitte kõiki võimalikke variante.
  See oli teadlik lihtsustus, et otsus jääks kasutaja jaoks selgeks ja UI ei muutuks liiga kirjuks.

- Kliendi eelistused on pehme eelistus, mitte absoluutne filter.
  Süsteem eelistab akna-, vaikse või mänguala lähedasi laudu, kuid ei jäta pakkumata mõistlikku alternatiivi ainult sellepärast, et kõik soovid ei kattu.

- Tsoonifilter on seevastu range piirang.
  Kui kasutaja valib näiteks ainult terrassi või privaatruumi, otsitakse ja kuvatakse tulemusi ainult sellest tsoonist.

## 2. Miks valisin in-memory lahenduse, mitte andmebaasi

Selle prototüübi eesmärk oli kõigepealt näidata, et põhivoog töötab:

- lauasoovituse loogika
- saadavuse kontroll
- saaliplaani kuvamine
- liidetavate laudade käsitlus
- kasutaja teekond otsingust kinnitamiseni

Selles etapis oli in-memory andmestik kõige mõistlikum lahendus, sest see võimaldas keskenduda äriloogikale ja kasutajakogemusele.

Backendis on eraldi `TableRepository` ja `BookingRepository` abstraktsioonid, mille tõttu saab in-memory implementatsioonid hiljem suhteliselt väikese ümbertõstmisega päris andmebaasi vastu välja vahetada.

Teisisõnu: Seega on andmebaasi puudumine selles etapis teadlik tehniline valik, mitte juhuslik puudujääk.

## 3. Soovitusalgoritmi loogika

Soovitusalgoritm on kogu lahenduse keskne osa, seega panin selle loogika võimalikult lihtsaks ja arusaadavaks.

Algoritm töötab praegu järgmise põhimõtte järgi:

1. Kõigepealt filtreeritakse välja lauad, mis valitud ajavahemikus ei ole saadaval.
2. Kui kasutaja valis tsooni, vaadatakse ainult selle tsooni laudu.
3. Seejärel otsitakse parim üksik laud, mis mahutab kogu seltskonna ära.
4. Kui sobivat üksikut lauda ei leidu, proovitakse leida parim liidetav lauapaar.

Üksiku laua skoorimisel eelistan väikseimat mõistlikku lauda, mis seltskonna ära mahutab. Selle mõte on vältida olukorda, kus väike grupp paigutatakse põhjendamatult suure laua taha.

Eelistused annavad lauale lisapunkte:

- `WINDOW`
- `QUIET`
- `NEAR_PLAY_AREA`

Kui tuleb valida lauapaari vahel, rakendub sellele väike lisakaristus. See aitab hoida loogikat sellisena, et süsteem eelistab võimalusel ikkagi ühte lauda kahe asemel.

Tulemuseks tagastatakse ainult üks parim soovitus.

## 4. Miks eelistused ei ole range filter

Praktikas tuli üsna kiiresti välja, et range filtriloogika tekitaks kasutajale vale mulje. Kui eelistusi käsitleda absoluutse tingimusena, võib süsteem jätta mulje, et kohti pole üldse saadaval, kuigi tegelikult leidub täiesti mõistlik laud, mis lihtsalt ei vasta igale soovile.

Seetõttu on backendi poolel eelistused osa skoorist, mitte kohustuslik lävend.

Frontendis püüdsin selle loogika kasutaja jaoks võimalikult arusaadavana hoida:

- eelistustele vastavad lauad on kasutaja jaoks visuaalselt selgemad
- soovitatud laud jääb nähtavaks ka siis, kui see ei täida kõiki eelistusi
- nii ei teki olukorda, kus backend soovitab lauda, aga frontend peidab selle sisuliselt ära


## 5. Laudade liitmise loogika

Laudade liitmine on lahendatud teadlikult piiratud kujul.

- Liita saab ainult eeldefineeritud naaberlaudu.
- Laudadevahelised suhted on modelleeritud laua andmetes väljaga `mergeableWith`.
- Kui sobivat üksikut lauda ei leidu, otsitakse parim sobiv lauapaar.
- Kui süsteem soovitab lauapaari, peab kasutaja frontendis valima mõlemad soovitatud lauad, enne kui saab järgmisse sammu minna.

See lähenemine hoidis lahenduse realistliku, aga samas piisavalt lihtsana.

## 6. Juhuslik broneeringute genereerimine

Ülesandes oli oluline ka olemasoleva täituvuse genereerimine, seega ei tahtnud ma kasutada täiesti suvalist või käsitsi sisestatud näidisandmestikku.

Praegune in-memory broneeringute generaator töötab nii:

- broneeringud luuakse järgmise 90 päeva jaoks
- kasutusel on kindlad ajaslotid: `12:00`, `13:30`, `18:00`, `19:00`, `20:00`
- õhtused ajad on kõrgema täituvusega kui lõunased
- nädalavahetused on veidi suurema koormusega kui argipäevad
- iga laua puhul välditakse kattuvaid testbroneeringuid
- broneeringu kestus varieerub 120 kuni 180 minuti vahel
- seltskonna suurus valitakse laua suuruse järgi kaalutud loogikaga, et tulemus tunduks realistlikum

Lisaks kasutasin fikseeritud juhuslikkuse seemet (`Random(42)`), et täituvus oleks arenduse ja testimise ajal taastoodetav.


## 7. MVP-kompromissid

Mõned asjad jätsin teadlikult lihtsustatuks.

- Broneeringu kinnitamine ei salvesta hetkel uut broneeringut püsivalt andmebaasi.
  Kinnitusvoog töötab kasutajakogemuse mõttes lõpuni, kuid see ei loo veel päris püsivat reservatsiooni kirjet.

- Admin-vaadet ei realiseerinud.
  Fookus oli kliendivaate otsingu- ja valikuvool.

- Laudade liitmine on piiratud eeldefineeritud seostega.
  Süsteem ei proovi ise dünaamiliselt kõiki võimalikke ruumilisi kombinatsioone arvutada.

- Süsteem soovitab ühte parimat varianti, mitte mitut alternatiivi.

- Avatuse ja erisündmuste loogika on lihtsustatud.
  Lahendus ei arvesta veel näiteks muutuvate lahtiolekuaegade, pühade ega erimenüü sündmustega.

- Eelistused on modelleeritud väikese fikseeritud valikuna.

## 8. Mis osutus töö käigus keerulisemaks

Kõige keerulisem ei olnud mitte üks konkreetne komponent, vaid mitme väikese loogika omavaheline kooskõla.

Keerulisemad kohad olid:

- leida õige tasakaal filtri ja soovituse vahel
- otsustada, millal peaks eelistama üksikut lauda ja millal lauapaari
- hoida backendi soovitusloogika ja frontendi käitumine omavahel kooskõlas
- lahendada state management nii, et kasutaja hetkevalikud ja viimati rakendatud otsing ei läheks segamini
- modelleerida laudade liitmine piisavalt realistlikult, aga mitte üle keeruliseks

Just frontendi ja backendi ühine käitumine oli siin minu jaoks kõige õpetlikum osa. Hea soovitusalgoritm üksi ei piisa, kui kasutajaliides tõlgendab selle tulemust teistmoodi.

## 9. Mida teeksin edasi, kui aega oleks rohkem

Kui seda lahendust järgmises iteratsioonis edasi arendada, siis võtaksin ette eelkõige järgmised sammud:

- päris andmebaas ja püsivad broneeringud
- uue broneeringu tegelik salvestamine pärast kinnitamist
- admin-vaade laudade ja broneeringute haldamiseks
- mitme alternatiivse soovituse kuvamine ühe soovituse asemel
- täpsem saadavuse kontroll koos restorani lahtiolekuaegadega
- rikkalikum eelistuste ja tsoonide mudel
- rohkem automaatteste

## 10. Abi ja allikad

Projekti käigus kasutasin AI-tööriistu ja ametlikku dokumentatsiooni mõistlikus toetavas rollis.

AI-tööriistu kasutasin peamiselt järgmistes olukordades:
- arhitektuuri ja refaktoorimisideede valideerimiseks
- mõne testiklassi ja väiksema abiloogika esialgse mustandi koostamiseks
- README ja täiendava dokumentatsiooni sõnastuse parandamiseks
- frontendi ja backendi loogika kooskõla läbiarutamiseks

Kõik AI abil saadud soovitused vaatasin käsitsi üle ja kohandasin projekti vajadustele vastavaks.

- lisaks kasutasin ametlikku dokumentatsiooni järgmiste tehnoloogiate kohta:
  - Spring Boot
  - React
  - Vite
  - Tailwind CSS
  - Docker
  - Nginx
  - TheMealDB API

## 11. Kokkuvõte

Selle prototüübi eesmärk ei olnud valmis tootmissüsteemi ehitamine, vaid läbimõeldud MVP, mis näitab ära peamise väärtuse: kasutaja saab otsida sobivat aega, näha restorani saaliplaani, saada mõistliku lauasoovituse ja liikuda sujuvalt kinnitamiseni.

Kõige olulisemad teadlikud otsused olid minu jaoks:

- hoida äriloogika lihtne, aga põhjendatud
- eelistada selget kasutajavoogu liiga keerulisele funktsionaalsusele
- jätta arhitektuur piisavalt kihiliseks, et lahendust saaks hiljem edasi kasvatada

Kokku kulus selle prototüübi arendamiseks umbes 30-35 tundi, mis hõlmas nii planeerimist, õppimist, arendust, testimist kui ka dokumenteerimist.

