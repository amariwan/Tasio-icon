# Tasio SVG Icon Gallery

Ein kleines statisches Webapp, das die SVG-Icons aus `data-icon/` als durchsuchbare Galerie anzeigt.

How to use

- Einfach `index.html` im Browser öffnen.
- Oder einen kleinen Static-Server starten im Ordner `Tasio-icon`, z. B.: `python3 -m http.server 8000` und dann http://localhost:8000 öffnen.

Theme

- Die Galerie unterstützt Dark und Light Mode. Benutze den Button in der oberen rechten Ecke, um zwischen den Themes zu wechseln. Die Auswahl wird in `localStorage` gespeichert.

Features
- Suche nach Icon-Namen
- Vorschau als Inline-Bild
- Copy SVG (kopiert den SVG-Quelltext in die Zwischenablage)
- Download einzelner SVGs

Hinweis
- "Download alle" ist aus Komfortgründen nur eine Hinweis-Schaltfläche; für ein ZIP aller Icons nutze ein Server-Tool oder packe den Ordner lokal.
