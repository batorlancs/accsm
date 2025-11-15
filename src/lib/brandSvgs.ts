// Brand SVG mappings for ACC cars
// SVGs should be stored in src/assets/brands/

const brandSvgs = import.meta.glob('/src/assets/brands/*.svg', { 
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

// Map brand names to their corresponding SVG file paths
export const getBrandSvg = (brandName: string): string | null => {
  // Normalize brand name to match file naming convention (lowercase, kebab-case)
  const normalizedBrandName = brandName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const svgPath = `/src/assets/brands/${normalizedBrandName}.svg`;
  return brandSvgs[svgPath] || null;
};

// Available brand names from data.rs
export const AVAILABLE_BRANDS = [
  'Audi',
  'BMW', 
  'Bentley',
  'Ferrari',
  'Lamborghini',
  'McLaren',
  'Mercedes-AMG',
  'Porsche',
  'Nissan',
  'Lexus',
  'Honda',
  'Alpine',
  'Aston Martin',
  'Chevrolet',
  'Ginetta',
  'KTM',
  'Maserati'
] as const;

export type BrandName = typeof AVAILABLE_BRANDS[number];

// Expected SVG file names (for reference):
// audi.svg
// bmw.svg
// bentley.svg
// ferrari.svg
// lamborghini.svg
// mclaren.svg
// mercedes-amg.svg
// porsche.svg
// nissan.svg
// lexus.svg
// honda.svg
// alpine.svg
// aston-martin.svg
// chevrolet.svg
// ginetta.svg
// ktm.svg
// maserati.svg