export function getLogFactor(
  species: string
): number {

  switch (species) {

    case "Akác":
      return 0.88;

    case "Bükk":
      return 0.90;

    case "Tölgy":
      return 0.89;

    case "Nyár":
      return 0.93;

    case "Lucfenyő":
      return 0.92;

    case "Erdeifenyő":
      return 0.92;

    default:
      return 0.90;
  }
}

export function getStandingTreeFactor(
  species: string
): number {

  switch (species) {

    case "Akác":
      return 0.35;

    case "Bükk":
      return 0.40;

    case "Tölgy":
      return 0.40;

    case "Nyár":
      return 0.34;

    case "Lucfenyő":
      return 0.40;

    case "Erdeifenyő":
      return 0.39;

    default:
      return 0.40;
  }
}

export function calculateVolume(
  diameterCm: number,
  lengthM: number,
  quantity: number,
  species: string,
  assortmentType: string
): number {

  const radius =
    diameterCm / 100 / 2;

  const cylinderVolume =
    Math.PI *
    radius *
    radius *
    lengthM;

  let volume = 0;

  switch (assortmentType) {

    case "Papírfa":

      volume =
        cylinderVolume *
        0.85;

      break;

    case "Tűzifa":

      volume =
        cylinderVolume *
        0.75;

      break;

    case "Oszlopfa":

      volume =
        cylinderVolume *
        0.95;

      break;

    case "Állófa becslés": {

      const d =
        diameterCm / 100;

      const q =
        getStandingTreeFactor(
          species
        );

      volume =
        q *
        d *
        d *
        (lengthM + 3);

      break;
    }

    case "Fűrészrönk":
    default:

      volume =
        cylinderVolume *
        getLogFactor(
          species
        );

      break;
  }

  return Number(
    (
      volume *
      quantity
    ).toFixed(3)
  );
}