# Brand SVG Assets

This directory should contain SVG logo files for each car brand in ACC.

## Expected Files

Based on the brands in `src-tauri/src/data.rs`, the following SVG files are expected:

- `audi.svg` - Audi
- `bmw.svg` - BMW  
- `bentley.svg` - Bentley
- `ferrari.svg` - Ferrari
- `lamborghini.svg` - Lamborghini
- `mclaren.svg` - McLaren
- `mercedes-amg.svg` - Mercedes-AMG
- `porsche.svg` - Porsche
- `nissan.svg` - Nissan
- `lexus.svg` - Lexus
- `honda.svg` - Honda
- `alpine.svg` - Alpine
- `aston-martin.svg` - Aston Martin
- `chevrolet.svg` - Chevrolet
- `ginetta.svg` - Ginetta
- `ktm.svg` - KTM
- `maserati.svg` - Maserati

## File Naming Convention

- Lowercase
- Replace spaces and special characters with hyphens
- Use `.svg` extension

## Usage

The brand SVGs are loaded automatically via `src/lib/brandSvgs.ts` and used in the CarView component to display brand logos instead of generic car icons.

If a brand SVG is not found, it will fall back to a generic car icon from Lucide React.