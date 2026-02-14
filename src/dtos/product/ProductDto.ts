import ProuductImageDto from "./ProductImageDto";

export default interface ProductDto {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  About: string;
  category: number;
  rating: number;
  stock: number;
  images: ProuductImageDto[];
  imageUrls?: string[];
  created_at: string;
  updated_at: string;
}
