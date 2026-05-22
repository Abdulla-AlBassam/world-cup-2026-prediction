export type Team = {
  id: string;
  name: string;
  code: string;
  group: string;
};

export const teams: Team[] = [
  { id: "MEX", name: "Mexico", code: "mx", group: "A" },
  { id: "RSA", name: "South Africa", code: "za", group: "A" },
  { id: "KOR", name: "South Korea", code: "kr", group: "A" },
  { id: "CZE", name: "Czech Republic", code: "cz", group: "A" },

  { id: "CAN", name: "Canada", code: "ca", group: "B" },
  { id: "BIH", name: "Bosnia and Herzegovina", code: "ba", group: "B" },
  { id: "QAT", name: "Qatar", code: "qa", group: "B" },
  { id: "SUI", name: "Switzerland", code: "ch", group: "B" },

  { id: "BRA", name: "Brazil", code: "br", group: "C" },
  { id: "MAR", name: "Morocco", code: "ma", group: "C" },
  { id: "HAI", name: "Haiti", code: "ht", group: "C" },
  { id: "SCO", name: "Scotland", code: "gb-sct", group: "C" },

  { id: "USA", name: "United States", code: "us", group: "D" },
  { id: "PAR", name: "Paraguay", code: "py", group: "D" },
  { id: "AUS", name: "Australia", code: "au", group: "D" },
  { id: "TUR", name: "Türkiye", code: "tr", group: "D" },

  { id: "GER", name: "Germany", code: "de", group: "E" },
  { id: "CUW", name: "Curaçao", code: "cw", group: "E" },
  { id: "CIV", name: "Ivory Coast", code: "ci", group: "E" },
  { id: "ECU", name: "Ecuador", code: "ec", group: "E" },

  { id: "NED", name: "Netherlands", code: "nl", group: "F" },
  { id: "JPN", name: "Japan", code: "jp", group: "F" },
  { id: "SWE", name: "Sweden", code: "se", group: "F" },
  { id: "TUN", name: "Tunisia", code: "tn", group: "F" },

  { id: "BEL", name: "Belgium", code: "be", group: "G" },
  { id: "EGY", name: "Egypt", code: "eg", group: "G" },
  { id: "IRN", name: "Iran", code: "ir", group: "G" },
  { id: "NZL", name: "New Zealand", code: "nz", group: "G" },

  { id: "ESP", name: "Spain", code: "es", group: "H" },
  { id: "CPV", name: "Cape Verde", code: "cv", group: "H" },
  { id: "KSA", name: "Saudi Arabia", code: "sa", group: "H" },
  { id: "URU", name: "Uruguay", code: "uy", group: "H" },

  { id: "FRA", name: "France", code: "fr", group: "I" },
  { id: "SEN", name: "Senegal", code: "sn", group: "I" },
  { id: "IRQ", name: "Iraq", code: "iq", group: "I" },
  { id: "NOR", name: "Norway", code: "no", group: "I" },

  { id: "ARG", name: "Argentina", code: "ar", group: "J" },
  { id: "ALG", name: "Algeria", code: "dz", group: "J" },
  { id: "AUT", name: "Austria", code: "at", group: "J" },
  { id: "JOR", name: "Jordan", code: "jo", group: "J" },

  { id: "POR", name: "Portugal", code: "pt", group: "K" },
  { id: "COD", name: "DR Congo", code: "cd", group: "K" },
  { id: "UZB", name: "Uzbekistan", code: "uz", group: "K" },
  { id: "COL", name: "Colombia", code: "co", group: "K" },

  { id: "ENG", name: "England", code: "gb-eng", group: "L" },
  { id: "CRO", name: "Croatia", code: "hr", group: "L" },
  { id: "GHA", name: "Ghana", code: "gh", group: "L" },
  { id: "PAN", name: "Panama", code: "pa", group: "L" },
];

export const teamById: Record<string, Team> = Object.fromEntries(
  teams.map((t) => [t.id, t]),
);

export const teamsByGroup: Record<string, Team[]> = teams.reduce(
  (acc, t) => {
    (acc[t.group] ||= []).push(t);
    return acc;
  },
  {} as Record<string, Team[]>,
);

export const groupLetters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
] as const;

export type GroupLetter = (typeof groupLetters)[number];
