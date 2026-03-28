// Available years based on actual images in public/urban_sprawl
export const AVAILABLE_YEARS = [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2030];

export function getImageUrl(year: number): string {
  return `/urban_sprawl/Urban_${year}.tif.jpg`;
}

export function isYearAvailable(year: number): boolean {
  return AVAILABLE_YEARS.includes(year);
}

export function getNextAvailableYear(currentYear: number): number | null {
  const currentIndex = AVAILABLE_YEARS.indexOf(currentYear);
  if (currentIndex === -1 || currentIndex === AVAILABLE_YEARS.length - 1) {
    return null;
  }
  return AVAILABLE_YEARS[currentIndex + 1];
}

export function getPreviousAvailableYear(currentYear: number): number | null {
  const currentIndex = AVAILABLE_YEARS.indexOf(currentYear);
  if (currentIndex === -1 || currentIndex === 0) {
    return null;
  }
  return AVAILABLE_YEARS[currentIndex - 1];
}

export function getYearRange(): { min: number; max: number } {
  return {
    min: Math.min(...AVAILABLE_YEARS),
    max: Math.max(...AVAILABLE_YEARS)
  };
}

// Check if image exists (client-side)
export async function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}