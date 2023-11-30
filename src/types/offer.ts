import Host from './host';
import { City } from './city';
import Loc from './loc';

type Offer = { //для CityPage
  id: string;
  title: string;
  type: string;
  price: number;
  previewImage?: string;
  city: City;
  location: Loc;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
}

type SelectedOffer = { //для OfferPage
  id: string;
  title: string;
  type: string;
  price: number;
  city: City;
  location: Loc;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  description: string;
  bedrooms: number;
  goods: Array<string>;
  host: Host;
  images: Array<string>;
  maxAdults: number;
}

type Favorite = Offer


export type { Offer, SelectedOffer, Favorite };
