import { useState } from "react";

export type ElementConfig = {
  name: string;
  protons: number;
  neutrons: number;
  shells: number[];
};

export const elements: ElementConfig[] = [
  { name: "Hydrogen", protons: 1, neutrons: 0, shells: [1] },
  { name: "Helium", protons: 2, neutrons: 2, shells: [2] },
  { name: "Lithium", protons: 3, neutrons: 4, shells: [2, 1] },
  { name: "Carbon", protons: 6, neutrons: 6, shells: [2, 4] },
  { name: "Neon", protons: 10, neutrons: 10, shells: [2, 8] },
  { name: "Sodium", protons: 11, neutrons: 12, shells: [2, 8, 1] },
  { name: "Magnesium", protons: 12, neutrons: 12, shells: [2, 8, 2] },
  { name: "Aluminum", protons: 13, neutrons: 14, shells: [2, 8, 3] },
  { name: "Silicon", protons: 14, neutrons: 14, shells: [2, 8, 4] },
  { name: "Phosphorus", protons: 15, neutrons: 16, shells: [2, 8, 5] },
  { name: "Sulfur", protons: 16, neutrons: 16, shells: [2, 8, 6] },
  { name: "Chlorine", protons: 17, neutrons: 18, shells: [2, 8, 7] },
  { name: "Argon", protons: 18, neutrons: 22, shells: [2, 8, 8] },
  { name: "Iron", protons: 26, neutrons: 30, shells: [2, 8, 14, 2] },
  { name: "Silver", protons: 47, neutrons: 61, shells: [2, 8, 18, 18, 1] },
  { name: "Gold", protons: 79, neutrons: 118, shells: [2, 8, 18, 32, 18, 1] },
  {
    name: "Uranium",
    protons: 92,
    neutrons: 146,
    shells: [2, 8, 18, 32, 21, 9, 2],
  },
];

export const useAtomModel = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedName, setSelectedElement] = useState("Magnesium");

  const element = elements.find((el) => el.name === selectedName)!;

  return {
    elements,
    element,
    sliderValue,
    setSliderValue,
    setSelectedElement,
  };
};
