export interface TreeSpecies {
  code: string;
  name: string;
  category: "hardwood" | "softwood" | "conifer";

  density: number;
  qFactor: number;
  barkFactor: number;

  firewoodFactor: number;
  calorificValue: number;
}

export const treeSpecies: TreeSpecies[] = [
  {
    code: "AK",
    name: "Akác",
    category: "hardwood",
    density: 650,
    qFactor: 0.35,
    barkFactor: 0.91,
    firewoodFactor: 0.57,
    calorificValue: 3800,
  },
  {
    code: "BT",
    name: "Bükk",
    category: "hardwood",
    density: 680,
    qFactor: 0.40,
    barkFactor: 0.92,
    firewoodFactor: 0.57,
    calorificValue: 3800,
  },
  {
    code: "TL",
    name: "Tölgy",
    category: "hardwood",
    density: 670,
    qFactor: 0.40,
    barkFactor: 0.92,
    firewoodFactor: 0.57,
    calorificValue: 3800,
  },
  {
    code: "GY",
    name: "Gyertyán",
    category: "hardwood",
    density: 800,
    qFactor: 0.36,
    barkFactor: 0.89,
    firewoodFactor: 0.57,
    calorificValue: 3800,
  },
  {
    code: "NY",
    name: "Nyár",
    category: "softwood",
    density: 450,
    qFactor: 0.34,
    barkFactor: 0.90,
    firewoodFactor: 0.59,
    calorificValue: 3600,
  },
  {
    code: "ERF",
    name: "Erdeifenyő",
    category: "conifer",
    density: 520,
    qFactor: 0.39,
    barkFactor: 0.93,
    firewoodFactor: 0.59,
    calorificValue: 3900,
  },
  {
    code: "LF",
    name: "Lucfenyő",
    category: "conifer",
    density: 480,
    qFactor: 0.40,
    barkFactor: 0.93,
    firewoodFactor: 0.59,
    calorificValue: 3900,
  },
];