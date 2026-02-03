# Projekt

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#projekt)

## 1. Nastavenie projektu & architektúra

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#1-nastavenie-projektu--architekt%C3%BAra)

* [ ] Frontend vytvorený pomocou **Vue.js**
* [ ] Backend vytvorený pomocou **Hono.js**
* [ ] Jasné oddelenie frontendu a backendu

## 2. Autentifikácia & autorizácia

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#2-autentifik%C3%A1cia--autoriz%C3%A1cia)

### Autentifikácia

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#autentifik%C3%A1cia)

#### Bud custom alebo login cez SSO

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#bud-custom-alebo-login-cez-sso)

* [ ] Registracia / Prihlasenie / Odhlasenie / Zmazanie používateľa
* [ ] Zmazanie (hard delete / soft delete) všetkého obsahu ktorý patrí uživatelovi
* [ ] Hashovanie hesiel / Bezpečné porovnanie hesiel

### Session & cookies

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#session--cookies)

* [ ] Autentifikácia uchovávaná pomocou cookies
* [ ] Automatické obnovenie používateľskej session po reloadnutí stránky
* [ ] Odhlásenie vymaže autentifikačné cookies

### Autorizácia

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#autoriz%C3%A1cia)

* [ ] Chránené backendové routy
* [ ] Neautorizovaný prístup vracia správnu chybovú odpoveď
* [ ] Obmedzenie prístupu k dátam podľa používateľa

## 3. Používateľské role & admin dashboard

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#3-pou%C5%BE%C3%ADvate%C4%BEsk%C3%A9-role--admin-dashboard)

### Role

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#role)

* [ ] Definícia rolí (napr. user, admin)
* [ ] Rola uložená v databáze
* [ ] Role-based access control na backende

### Admin dashboard

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#admin-dashboard)

* [ ] Frontendové routy dostupné iba pre admina
* [ ] Backendové endpointy dostupné iba pre admina
* [ ] Admin rozhranie na správu používateľov alebo zdrojov
* [ ] Podmienené renderovanie UI podľa roly

## 4. Databáza & dátový model

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#4-datab%C3%A1za--d%C3%A1tov%C3%BD-model)

### Databázová technológia

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#datab%C3%A1zov%C3%A1-technol%C3%B3gia)

* [ ] SQL databáza (napr. PostgreSQL, MySQL, SQLite)
* [ ] Migrácie databázy alebo definícia schémy
* [ ] Bezpečné spracovanie databázového pripojenia

### Vzťahy

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#vz%C5%A5ahy)

* [ ] Implementovaný vzťah one-to-one
* [ ] Implementovaný vzťah one-to-many
* [ ] Implementovaný vzťah many-to-many
* [ ] Správne použitie cudzích kľúčov
* [ ] Dátová integrita vynútená na úrovni databázy

## 5. Správa zdrojov (CRUD) - s validáciou

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#5-spr%C3%A1va-zdrojov-crud---s-valid%C3%A1ciou)

* [ ] Endpoint na vytvorenie zdroja
* [ ] Endpoint na čítanie zdroja
* [ ] Endpoint na aktualizáciu zdroja
* [ ] Endpoint na zmazanie zdroja
* [ ] Autorizácia pri práci so zdrojmi
* [ ] Používatelia majú prístup iba k vlastným dátam

## 6. Frontendový stav & navigácia

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#6-frontendov%C3%BD-stav--navig%C3%A1cia)

### Vue Router

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#vue-router)

* [ ] Viacero rout v aplikácii
* [ ] Chránené routy (vyžadujú prihlásenie)
* [ ] Route guards založené na roliach
* [ ] 404 / fallback route

### State management (Pinia)

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#state-management-pinia)

* [ ] Globálny store pre autentifikáciu
* [ ] Používateľské dáta uložené v Pinia
* [ ] Zachovanie stavu po reloadnutí stránky
* [ ] Centralizované spracovanie API stavu

## 7. Štýlovanie & UI

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#7-%C5%A1t%C3%BDlovanie--ui)

* [ ] Wireframes
* [ ] Integrovaný Tailwind CSS
* [ ] Responzívny layout
* [ ] Znovupoužiteľné UI komponenty
* [ ] Konzistentný dizajnový systém
* [ ] Loading a empty stavy

## 8. Realtime komunikácia

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#8-realtime-komunik%C3%A1cia)

* [ ] Použitá realtime technológia (napr. WebSockets, SSE)
* [ ] Realtime implementácia na serveri
* [ ] Klientská realtime komunikácia
* [ ] Realtime aktualizácie viditeľné v UI
* [ ] Správne ukončovanie realtime spojení

## 9. Nahrávanie súborov

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#9-nahr%C3%A1vanie-s%C3%BAborov)

* [ ] Endpoint na nahrávanie súborov
* [ ] Validácia súborov (typ a/alebo veľkosť)
* [ ] Metadáta súborov uložené v databáze
* [ ] Autorizovaný prístup k nahraným súborom

## 10. Validácia requestov & spracovanie chýb

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#10-valid%C3%A1cia-requestov--spracovanie-ch%C3%BDb)

### Validácia

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#valid%C3%A1cia)

* [ ] Validácia tela requestu
* [ ] Validácia query parametrov a route parametrov
* [ ] Chybové validačné hlášky so zrozumiteľným popisom
* [ ] Neplatné requesty sa nedostanú k business logike

### Spracovanie chýb

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#spracovanie-ch%C3%BDb)

* [ ] Používanie správnych HTTP status kódov
* [ ] Používateľsky prívetivé chybové hlášky na fronte
* [ ] Frontend korektne spracováva API chyby

## 11. Bezpečnosť & best practices

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#11-bezpe%C4%8Dnos%C5%A5--best-practices)

* [ ] Žiadne citlivé dáta nie sú vystavené klientovi
* [ ] Ochrana proti SQL injection
* [ ] Správna CORS konfigurácia

## 12. Kvalita kódu & udržiavateľnosť

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#12-kvalita-k%C3%B3du--udr%C5%BEiavate%C4%BEnos%C5%A5)

* [ ] Modulárna štruktúra kódu
* [ ] Zmysluplné pomenovanie premenných a funkcií
* [ ] Znovupoužiteľné utility a helpery

## 13. Nice to haves

[](https://gist.github.com/Hladikes/79ce599d24f0772c52e6aa8e1aabd43c#13-nice-to-haves)

* [ ] Preklady
* [ ] Light / Dark mode
