import fs from 'node:fs';
import path from 'node:path';

// process.cwd() is the site/ directory in both dev and build
const DATA_DIR = path.resolve(process.cwd(), '../data/plants');

export interface Plant {
  id: string;
  name: {
    commonName: string[];
    latinName: string;
    family: string;
  };
  range: {
    nativeRange: string;
    usNativeStatus: { native: boolean; description: string };
    invasive: { invasive: boolean; description: string };
    zone: { min: number | null; max: number | null; description: string };
  };
  description: {
    height: string;
    spread: string;
    spacing: string;
    growthRate: string;
    timeToMaturity: string;
    lifespan: string;
    deciduousEvergreen: string;
    winterInterest: string;
  };
  lightAndWater: {
    sun: string;
    water: string;
    drainagePreference: {
      description: string;
      claySoilPerformance: { rating: string; description: string } | null;
    };
  };
  soil: {
    phRange: { min: number | null; max: number | null; description: string };
    texturePreference: string;
    rootCharacter: string;
  };
  bloom: {
    bloomTime: string;
    bloomDescription: string;
    fragrance: string;
    flowerSex: string;
    pollination: string;
  };
  yield: {
    edibleParts: string;
    harvestSeason: string;
    medicinalUses: string;
    craftOtherYield: string;
  };
  cautionsAndHazards: {
    thornsSpines: boolean;
    toxicityPeople: string;
    toxicityAnimals: string;
    allelopathy: string;
    notes: string;
  };
  permaculture: {
    layer: { primary: string; description: string };
    roles: string[];
    companionPlants: string[];
    antagonists: string[];
    coppiceable: boolean;
  };
  wildlife: {
    attracts: string;
    hostPlantFor: string;
    nestingHabitat: string;
  };
  tolerances: {
    deer: { rating: string; description: string };
    salt: { rating: string; description: string };
    drought: { rating: string; description: string };
    other: string;
  };
  maintenance: {
    maintenanceLevel: string;
    pruningNotes: string;
    propagationMethods: string[];
  };
  cultivarNotes: string;
  gardenUse: {
    suggestedUse: string[];
    designPlacement: string;
    acquisitionStatus: string;
  };
  links: {
    wikipedia: string;
    inaturalist: string;
    missouriBotanicalGarden: { label: string; url: string }[];
  };
  siteNotes?: Record<string, unknown>;
}

let _cache: Plant[] | null = null;

export function getAllPlants(): Plant[] {
  if (_cache) return _cache;
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  _cache = files.map(f => {
    const raw = fs.readFileSync(path.join(DATA_DIR, f), 'utf-8');
    const plant: Plant = JSON.parse(raw);
    // Strip siteNotes for public site
    delete plant.siteNotes;
    return plant;
  });
  _cache.sort((a, b) => a.name.latinName.localeCompare(b.name.latinName));
  return _cache;
}

export function getPlantById(id: string): Plant | undefined {
  return getAllPlants().find(p => p.id === id);
}

/** Get unique values for a field across all plants, for filter dropdowns */
export function getUniqueFamilies(): string[] {
  const set = new Set(getAllPlants().map(p => p.name.family).filter(Boolean));
  return [...set].sort();
}

export function getUniqueLayers(): string[] {
  const set = new Set(getAllPlants().map(p => p.permaculture?.layer?.primary).filter(Boolean));
  return [...set].sort();
}

export function getUniqueRoles(): string[] {
  const set = new Set<string>();
  for (const p of getAllPlants()) {
    for (const role of p.permaculture?.roles ?? []) {
      // Normalize: take the text before any parenthetical
      const base = role.replace(/\s*\(.*$/, '').trim();
      if (base) set.add(base);
    }
  }
  return [...set].sort();
}
