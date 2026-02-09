# Hotelex – Concept Document

### Premium hotel reservation system (school project)

## 1. Overview

Hotelex je webová aplikácia typu  **hotel reservation system** , inšpirovaná službami ako Booking, no zameraná na  **jednoduchosť, prehľadnosť a prémiový používateľský zážitok** .

Projekt je vytvorený ako  **školský mockup** , ktorého cieľom je demonštrovať prácu s moderným frontendom (Vue), backend API, databázou a UX flowom.

Hlavnou myšlienkou je:

> *„Rezervácia hotela by mala byť otázkou pár klikov, bez zbytočného chaosu.“*

---

## 2. Design Philosophy (Apple premium feel)

Dizajn aplikácie je inšpirovaný modernými produktmi typu Apple / premium SaaS aplikácie.

### Základné princípy:

* **Minimalizmus** – málo prvkov, veľa whitespace
* **Jasná hierarchia** – používateľ vždy vie, čo je hlavná akcia
* **Jemné animácie** – animácia podporuje pochopenie flowu, nie je len dekorácia
* **Premium look & feel** – zaoblené karty, jemné tiene, moderná typografia
* **Jednoduchosť** – cieľom nie je „veľa funkcií“, ale plynulý zážitok

Aplikácia podporuje  **light aj dark mód** .

---

## 3. Page Structure & Flow

### 3.1 Landing Page

Úvodná stránka slúži ako **marketingový vstup** do aplikácie.

**Obsah:**

* Hero sekcia s krátkym headline (value proposition)
* Krátky popis aplikácie
* CTA tlačidlo „Start booking“
* 2–3 výhody (napr. Fast booking, Simple flow, Modern design)

**Úloha stránky:**

* Vytvoriť prvý dojem
* Presmerovať používateľa do rezervačného flowu

---

### 3.2 Search / Browse Page

Stránka, kde používateľ  **prehliada hotely** .

**Funkcie:**

* Zoznam hotelov (karty)
* Základné filtre:
  * lokalita (text)
  * dátum (check-in / check-out)
  * počet hostí
* Kliknutím na hotel sa používateľ dostane na detail hotela

**UX cieľ:**

* Prehľadný zoznam
* Žiadne zbytočné informácie
* Fokus na výber hotela

---

### 3.3 Hotel Detail & Booking Flow

Najdôležitejšia časť aplikácie.

**Obsah stránky:**

* Názov hotela
* Galéria / obrázok
* Zoznam izieb (room cards)
* Informácie o dostupnosti

**Booking flow (2–3 kroky):**

1. Výber dátumu
2. Výber izby
3. Potvrdenie rezervácie (modal)

Rezervácia prebieha  **na jednej stránke** , bez presmerovaní.

**UX cieľ:**

* Minimalizovať počet krokov
* Používateľ má stále prehľad o tom, čo rezervuje

---

### 3.4 User Profile – My Bookings

Profilová stránka používateľa.

**Funkcie:**

* Zoznam aktívnych rezervácií
* Zobrazenie detailov rezervácie
* Možnosť zrušenia rezervácie

Táto stránka slúži ako **prehľadný dashboard** pre používateľa.

---

### 3.5 Admin Panel

Admin rozhranie je oddelené od bežného používateľského rozhrania.

**Admin funkcie:**

* Správa hotelov (CRUD)
* Správa izieb
* Prehľad všetkých rezervácií

**Design:**

* Jednoduchý, prehľadný
* Minimum animácií
* Fokus na dáta, nie na efekty

---

## 4. Animation & Motion Guidelines

Animácie sú použité  **iba tam, kde zlepšujú UX** .

### Použité typy animácií:

* Section enter (fade + translateY)
* Hover efekt na kartách (jemný lift)
* Modal enter/exit (scale + opacity)

### Pravidlá:

* Žiadne agresívne animácie
* Konzistentné trvanie animácií
* Podpora `prefers-reduced-motion`

---

## 5. Scope & Limitations

Projekt je  **školský prototyp** , nie produkčná aplikácia.

### Out of scope:

* Platby
* Reálne ceny
* Mapy a geolokácia
* Externé booking API

Cieľom projektu je  **ukázať architektúru, UX flow a prácu s dátami** , nie kompletný komerčný systém.

---

## 6. Summary

Hotelex demonštruje:

* moderný rezervačný flow
* dôraz na UX a dizajn
* prepojenie frontend – backend – databáza
* realistický, ale zvládnuteľný rozsah pre školský projekt

Projekt kladie dôraz na  **kvalitu spracovania, nie kvantitu funkcií** .
