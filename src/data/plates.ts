export type PlateId = 'white' | 'red' | 'silver' | 'gold' | 'black';

export interface PlateTier {
  id: PlateId;
  nameTh: string;
  subName: string;
  defaultPrice: number;
  tierLabel: string;
  examples: string;
  imageSrc: string;
  rimHex: string;
  rimAccentHex: string;
  innerHex: string;
  swatchClass: string;
  activeSurfaceClass: string;
  photoRingClass: string;
  accentTextClass: string;
}

export interface ExtraMenuItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export const HERO_IMAGE_SRC = '/src/assets/images/hero_kaiten_sushi_1795328653706.jpg';

export const DEFAULT_PLATE_TIERS: PlateTier[] = [
  {
    id: 'white',
    nameTh: 'จานสีขาว',
    subName: 'Shiro',
    defaultPrice: 30,
    tierLabel: 'เมนูพื้นฐาน',
    examples: 'แตงกวามากิ, ไข่นกกระทา, ของทานเล่น',
    imageSrc: '/src/assets/images/plate_white_sushi_1795328653093.jpg',
    rimHex: '#F3F1EC',
    rimAccentHex: '#CBD5E1',
    innerHex: '#FFFFFF',
    swatchClass: 'bg-white border-[#CBD5E1]',
    activeSurfaceClass: 'bg-[#F8FAFC] border-[#94A3B8]',
    photoRingClass: 'ring-2 ring-[#CBD5E1]',
    accentTextClass: 'text-[#334155]',
  },
  {
    id: 'red',
    nameTh: 'จานสีแดง',
    subName: 'Aka',
    defaultPrice: 40,
    tierLabel: 'เมนูทั่วไป',
    examples: 'แซลมอน, ไข่หวาน, ปูอัด, สลัดทูน่า',
    imageSrc: '/src/assets/images/plate_red_sushi_1795328652566.jpg',
    rimHex: '#E03E32',
    rimAccentHex: '#B8291E',
    innerHex: '#FCFBF8',
    swatchClass: 'bg-[#E03E32] border-[#B8291E]',
    activeSurfaceClass: 'bg-[#FFF5F4] border-[#F09A93]',
    photoRingClass: 'ring-2 ring-[#E03E32]/85',
    accentTextClass: 'text-[#C23025]',
  },
  {
    id: 'silver',
    nameTh: 'จานสีเงิน',
    subName: 'Gin',
    defaultPrice: 60,
    tierLabel: 'เมนูพิเศษขึ้นมา',
    examples: 'มากุโระ, หมึกโฮตารุ, ฮามาจิ, กุ้งหวาน',
    imageSrc: '/src/assets/images/plate_silver_sushi_1795328653025.jpg',
    rimHex: '#94A3B8',
    rimAccentHex: '#64748B',
    innerHex: '#FAF9F6',
    swatchClass: 'bg-[#94A3B8] border-[#64748B]',
    activeSurfaceClass: 'bg-[#F4F7FB] border-[#94A3B8]',
    photoRingClass: 'ring-2 ring-[#94A3B8]',
    accentTextClass: 'text-[#475569]',
  },
  {
    id: 'gold',
    nameTh: 'จานสีทอง / สีเหลือง',
    subName: 'Kin',
    defaultPrice: 80,
    tierLabel: 'เมนูพรีเมียมหรือปรุงพิเศษ',
    examples: 'แซลมอนเบิร์นชีส, ปลาไหลญี่ปุ่น, เอนกาวะ',
    imageSrc: '/src/assets/images/plate_gold_sushi_1795328653569.jpg',
    rimHex: '#E5A00D',
    rimAccentHex: '#B87A04',
    innerHex: '#FCFBF7',
    swatchClass: 'bg-[#E5A00D] border-[#B87A04]',
    activeSurfaceClass: 'bg-[#FFFBEB] border-[#F3C853]',
    photoRingClass: 'ring-2 ring-[#E5A00D]/90',
    accentTextClass: 'text-[#A16207]',
  },
  {
    id: 'black',
    nameTh: 'จานสีดำ',
    subName: 'Kuro',
    defaultPrice: 120,
    tierLabel: 'เมนูพรีเมียมสูงสุด',
    examples: 'โฮตาเตะ, เนื้อวากิว, โอโทโร่, อูนิ',
    imageSrc: '/src/assets/images/plate_black_sushi_1795328652854.jpg',
    rimHex: '#18181B',
    rimAccentHex: '#09090B',
    innerHex: '#18181B',
    swatchClass: 'bg-[#18181B] border-[#09090B]',
    activeSurfaceClass: 'bg-[#F4F4F5] border-[#71717A]',
    photoRingClass: 'ring-2 ring-[#18181B]',
    accentTextClass: 'text-[#18181B]',
  },
];

export const PRESET_EXTRAS: Omit<ExtraMenuItem, 'qty'>[] = [
  { id: 'green-tea', name: 'ชาเขียว (ร้อน/เย็น รีฟิล)', price: 40 },
  { id: 'miso-soup', name: 'ซุปมิโซะ / ไข่ตุ๋น', price: 50 },
  { id: 'dessert', name: 'ของหวาน / ไอศกรีม', price: 60 },
];

export function formatBaht(amount: number): string {
  const isWhole = Math.abs(amount - Math.round(amount)) < 0.005;
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
