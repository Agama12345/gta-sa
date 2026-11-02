# Port Azul — prototyp mapy 3D

Wczesny prototyp otwartego terenu o wymiarach 5 × 5 km. Są tu dzielnice z zabudową o różnej wysokości, sieć ulic, dwa parki, pagórkowaty las i dwa odcinki plaży. Czas akcji: około 2010–2015 r.

**Stan projektu:** to nadal szkic, nie mapa o jakości GTA: San Andreas. Większość budynków jest generowana proceduralnie, ulice mają powtarzalny układ, nie ma ruchu ulicznego, postaci ani kolizji. Wnętrza nie są ukończone, a kamera może przechodzić przez obiekty. Wydajność i wygląd wymagają dalszej pracy.

Zastosowano wybrane materiały i modele ze źródeł CC0, m.in. tekstury PBR, moduły fasad i wyposażenie ulicy. Wybrane obiekty mogą ładować się po pojawieniu się mapy. Źródła i informacje o licencjach: [public/assets/SOURCES.md](public/assets/SOURCES.md).

## Uruchomienie

```sh
npm install
npm run dev
```

Kliknij **Zwiedzaj mapę**, aby przejść na poziom ulicy. WASD/strzałki: ruch kamery, Q/E: wysokość, Shift: szybszy ruch, przeciąganie myszą: obracanie kamery. **Mapa miasta** otwiera wybór lokalizacji; **Widok ogólny** wraca do widoku początkowego.
