export const ImageCategory = {
  HALL: "Hall",
  BEDROOM: "Bedroom",
  BATHROOM: "Bathroom",
} as const;

export type ImageCategory =
  (typeof ImageCategory)[keyof typeof ImageCategory];


export interface CategorizedImage {
  id: string;
  url: string;
  category: ImageCategory;
}

export interface ImageCategoryGroup {
  category: ImageCategory;
  images: CategorizedImage[];
}
