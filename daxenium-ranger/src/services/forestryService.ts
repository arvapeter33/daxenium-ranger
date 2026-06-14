import { treeSpecies } from "../data/treeSpecies";

export function getSpecies(code: string) {
  return treeSpecies.find(
    (s) => s.code === code
  );
}

export function calculateLogWeight(
  volume: number,
  density: number
) {
  return Math.round(
    volume * density
  );
}

export function calculateEnergy(
  weightKg: number,
  speciesCode: string
) {
  const species =
    getSpecies(speciesCode);

  if (!species) return 0;

  return Number(
    (
      weightKg *
      species.calorificValue
    ).toFixed(0)
  );
}

export function calculateLogVolume(
  diameterCm: number,
  lengthM: number
) {
  const d = diameterCm / 100;

  return Number(
    (
      Math.PI *
      d *
      d *
      lengthM /
      4
    ).toFixed(4)
  );
}

export function calculateTimberVolume(
  diameterCm: number,
  lengthM: number,
  species: string
) {
  const diameterM = diameterCm / 100;

  const cylinderVolume =
    Math.PI *
    Math.pow(diameterM, 2) *
    lengthM /
    4;

  let factor = 0.92;

  switch (species) {

    case "Akác":
      factor = 0.90;
      break;

    case "Tölgy":
      factor = 0.92;
      break;

    case "Bükk":
      factor = 0.93;
      break;

    case "Nyár":
      factor = 0.95;
      break;

    case "Lucfenyő":
      factor = 0.94;
      break;

    case "Erdeifenyő":
      factor = 0.94;
      break;
  }

  return Number(
    (cylinderVolume * factor).toFixed(3)
  );
}