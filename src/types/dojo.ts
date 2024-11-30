export interface DojoLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  bannerImage: string;
  operatingHours: {
    day: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }[];
  amenities: {
    hasWashroom: boolean;
    hasChangeRooms: boolean;
    hasShowers: boolean;
    hasLockers: boolean;
  };
  capacity: {
    current: number;
    maximum: number;
  };
  checkedInMembers: string[];
  isOpen: boolean;
}
