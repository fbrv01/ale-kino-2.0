export interface Movie {
  id: number;
  title: string;
  imageUrl: string;
  genres: string | string[];
  time: string;
  ageRestriction: string;
  descriptionShort: string;
  descriptionLong: string;
  duration: string | number;
  isPremiere: boolean;
}

export interface Genre {
  id: number;
  name: string;
}
export interface AgeRestriction {
  id: number;
  name: string;
}
