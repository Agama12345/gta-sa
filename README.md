# Port Azul — prototyp mapy 3D

Wczesny szkic terenu o wymiarach 5 × 5 km: miasto, dzielnice, dwa parki, las i dwa odcinki plaży. Na razie mapa **nie jest fotorealistyczną ani ukończoną grą**: budynki, większość drzew i teren są uproszczone; nie ma ruchu ulicznego, kolizji ani kompletnych wnętrz. Kamera może przelatywać przez obiekty. Wygląd, oświetlenie i zawartość są w trakcie budowy.

Do projektu dodano wybrane zdjęciowe tekstury asfaltu i trawy oraz modele drzewa, skały i paproci. Źródła i informacje o licencjach znajdują się w [public/assets/SOURCES.md](public/assets/SOURCES.md). Ze względu na rozmiar modelu drzewa pierwsze wczytanie może trochę potrwać. Model nieba ma niską rozdzielczość i jest tymczasowy.

## Uruchomienie

`npm install` i `npm run dev`. Kliknij „Zwiedzaj mapę”, aby przejść do poziomu ulicy. WASD/strzałki: ruch, Q/E: wysokość, Shift: szybciej, przeciąganie myszą: obracanie kamery. Lista miejsc przenosi kamerę do wybranej części mapy.
