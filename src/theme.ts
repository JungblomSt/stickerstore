
export const spacing = { xs: 4, s: 8, m: 12, l: 16, xl: 24 };

export const fontSize = {
  small: 12,
  body: 16,
  heading: 20,
  title: 24,
} as const;

const palette = {
  inkBlack: "#1b3034",
  pineTeal: "#004643",
  lightPine: "#a1ccca",
  cornSilk: "#FAF4D3",
  metallicGold: "#D1AC00",
  peachGlow: "#F6BE9A",
  transparent: "transparent",
  danger: "#B3261E",
};

export const colors = {
  background: palette.pineTeal,   // skärmens bakgrund (arket)
  surface: palette.cornSilk,      // kort och sökfält (märkena)
  text: palette.inkBlack,         // text på ljus yta
  textSecondary: palette.pineTeal,    // sekundär text på ljus yta
  textOnDark: palette.cornSilk,   // text på mörk bakgrund
  textOnDarkSecondary: palette.peachGlow, // sekundär text på mörk bakgrund
  accent: palette.metallicGold,   // knappar och markeringar
  cut: palette.peachGlow,         // skärlinjer, platshållare
  logoBackground: palette.transparent, // bakgrund för transparenta logotyper
  danger: palette.danger,
} as const;

export const frameColors = [
  '#FFFFFF',
  '#18263A',
  '#FFC532',
  '#E4572E',
  '#E83F8B',
  '#7B4FD6',
  '#2E86DE',
  '#17A589',
  '#6BBF3B',
];