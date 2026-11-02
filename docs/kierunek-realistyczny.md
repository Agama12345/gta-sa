# Port Azul — realistyczny fragment testowy

## Cel
Jeden niewielki fragment miasta połączony z parkiem i plażą, służący do sprawdzenia modeli, materiałów i oświetlenia przed rozbudową całej mapy 5 × 5 km. Obecna mapa jest wyłącznie szkicem; nie przedstawia docelowej jakości.

## Wstępnie wybrane zasoby

| Rola | Zasób | Stan |
| --- | --- | --- |
| Fasady | [Modular Urban Apartments Facade](https://polyhaven.com/a/modular_urban_apartments_facade) | Wybrany do testu; fasada, bez gotowych wnętrz |
| Asfalt | [Asphalt 02](https://polyhaven.com/a/asphalt_02) | Wybrany do testu |
| Chodnik | [Paving Stones 028](https://ambientcg.com/view?id=PavingStones028) | Wybrany do testu |
| Drzewo parkowe | [Jacaranda Tree](https://polyhaven.com/a/jacaranda_tree) | Wybrane do testu; sprawdzić LOD |
| Trawa | [Leafy Grass](https://polyhaven.com/a/leafy_grass) | Wybrana do testu; potrzeba również trawy 3D |
| Piasek | [Sand 03](https://polyhaven.com/a/sand_03) | Wybrany do testu |
| Skały | [Coast Rocks 05](https://polyhaven.com/a/coast_rocks_05) | Wybrane do testu; sprawdzić LOD |
| Niebo / oświetlenie otoczenia | [Kloofendal 48d Partly Cloudy (Pure Sky)](https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky) | Wstępny wybór; porównać z [Qwantani Noon](https://polyhaven.com/a/qwantani_noon_puresky) i [Kloofendal 43d Clear](https://polyhaven.com/a/kloofendal_43d_clear_puresky) |

Poly Haven i ambientCG deklarują CC0. Należy zachować źródła i ponownie zweryfikować licencję przy włączeniu każdego pliku. Zasoby nie są jeszcze pobrane ani włączone do gry. Bieżące środowisko nie ma bezpośredniego dostępu do hostów tych bibliotek.

## Kryteria testu

1. Ujednolicić rzeczywistą skalę modeli i powtarzalność tekstur.
2. Sprawdzić z bliska mapy koloru, normal i roughness oraz jakość krawędzi modeli.
3. Zestawić oświetlenie nieba z kierunkowym słońcem i cieniami; HDRI nie zastępuje geometrii ani systemu pory dnia.
4. Zmierzyć wydajność na docelowym sprzęcie, liczbę trójkątów, rozmiar tekstur i obciążenie pamięci. Używać LOD i instancjonowania tam, gdzie ma to sens.
5. Zaprojektować jedno rzeczywiste wnętrze i przejście przez drzwi. Fasady nie realizują jeszcze celu dostępności wszystkich budynków.

Wybór jest roboczy i nie opiera się na porównaniu modeli wewnątrz gry. Realistyczny efekt zależy od wspólnego testu, nie tylko od podawanej rozdzielczości tekstur.

## Dostępne kopie przez GitHub — do dalszego sprawdzenia

Ponieważ serwer projektu nie ma bezpośredniego dostępu do Poly Haven i ambientCG, sprawdzono publiczne repozytoria zawierające pochodne zasoby:

- [Jacaranda GLB](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/main/showroom/globe/h-earth/assets/jacaranda/Gratitude-Jacaranda-Candidate.glb) — 33 184 612 bajtów; repozytorium opisuje zoptymalizowany wariant modelu Poly Haven. Geometrię, tekstury i wygląd trzeba sprawdzić w silniku.
- [LeafDraw — modele Poly Haven](https://github.com/francisreboucas/leafdraw/tree/main/leafdraw/resources/models/polyhaven) — m.in. `rock_09.glb` (883 016 bajtów), `rock_07.glb` (979 080 bajtów) i `grass_medium_01_01.glb` (1 048 596 bajtów). Repozytorium opisuje modele Poly Haven jako CC0; przed użyciem zweryfikować zawartość, przekształcenia i źródła poszczególnych plików.
- [Kloofendal — kopia HDRI](https://github.com/jasmine314-dev/dm-portal-assets/blob/main/hdri/kloofendal_48d_partly_cloudy_puresky_256.hdr) — źródło to wybrany wcześniej HDRI Poly Haven, ale wersja została zmniejszona do 256 × 128. Nie jest równoważna oryginalnej rozdzielczości; do prób oświetlenia, nie jako potwierdzona finalna jakość nieba.

Same pliki nie zostały jeszcze dodane do gry i nie zostały ocenione w renderze. Nie znaleziono jeszcze porównywalnej jakościowo, dostępnej kopii wybranej fasady ani asfaltu. Rozmiar pliku ani sama nazwa nie gwarantują jakości.
