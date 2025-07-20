export type BasePoint = {
  id: number;
  kabupaten: string;
  province: string;
  latitude: number;
  longitude: number;
};

export type CoveredPoint = BasePoint & {
  svCopyright: string;
  svLatitude: number;
  svLongitude: number;
  svPanoId: string;
  svDate: string;
};

export type Mode = 'copyright'; // | 'elevation' | 'coverage' | 'camera-gen' | 'car' | 'poles' | 'rooftops' | 'foliage';
