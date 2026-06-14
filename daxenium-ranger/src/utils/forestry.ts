import { treeSpecies } from "../data/treeSpecies";

export function getSpecies(code: string) {
  return treeSpecies.find(x => x.code === code);
}

export function calculateWeight(
  volume: number,
  speciesCode: string
) {
  const species = getSpecies(speciesCode);

  if (!species) return 0;

  return volume * species.density;
}