export interface StudentProfile {
  id: string;
  fullNameGu: string;
  fullNameEn: string;
  studentId: string;
  rollNo: string;
  gradeGu: string;
  gradeEn: string;
  academicYear: string;
  dob: string;
  bloodGroup: string;
  phone: string;
  emergencyContact: string;
  addressGu: string;
  addressEn: string;
  photoUrl: string;
  gender: 'male' | 'female' | 'other';
  houseGu: string;
  houseEn: string;
  validUpto: string;
  extraFieldTitle?: string;
  extraFieldValue?: string;
}

export interface InstituteConfig {
  nameGu: string;
  nameEn: string;
  affiliationGu: string;
  affiliationEn: string;
  code: string;
  addressGu: string;
  addressEn: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  principalSignatureUrl: string;
  principalStampUrl: string;
  principalTitleGu: string;
  principalTitleEn: string;
}

export type CardLayout = 'vertical' | 'horizontal';

export type CardThemeId = 
  | 'royal-navy' 
  | 'gseb-saffron' 
  | 'emerald-gold' 
  | 'crimson-ruby' 
  | 'slate-modern' 
  | 'cyber-teal';

export interface CardTheme {
  id: CardThemeId;
  nameGu: string;
  nameEn: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  headerBg: string;
  cardBg: string;
  borderClass: string;
}

export interface CardDesign {
  layout: CardLayout;
  themeId: CardThemeId;
  language: 'gu' | 'en' | 'bilingual';
  showBarcode: boolean;
  showQrCode: boolean;
  showChip: boolean;
  showHologram: boolean;
  showLanyardSlot: boolean;
  showLanyardStrap: boolean;
  showWatermark: boolean;
  cardCurvature: 'rounded-lg' | 'rounded-xl' | 'rounded-2xl';
  photoShape: 'square' | 'rounded' | 'circle';
}

export type ViewSide = 'front' | 'back' | 'split';
