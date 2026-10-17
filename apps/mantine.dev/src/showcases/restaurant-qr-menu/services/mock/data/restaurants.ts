import type {
  LocalizedText,
  OpeningWindow,
  Restaurant,
  RestaurantTable,
} from '../../../domain/types'
import { monogramLogo, photo } from './images'

/** Shorthand for bilingual mock content. */
export const tx = (en: string, ar: string): LocalizedText => ({ en, ar })

function everyDay(open: string, close: string, except: number[] = []): OpeningWindow[] {
  return Array.from({ length: 7 }, (_, day) => day)
    .filter((day) => !except.includes(day))
    .map((day) => ({ day, open, close }))
}

function tables(prefix: string, count: number, area: LocalizedText, seats = 4): RestaurantTable[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}${index + 1}`,
    label: `${prefix}${index + 1}`,
    area,
    seats,
  }))
}

export const saffronHouse: Restaurant = {
  id: 'saffron-house',
  name: tx('Saffron House', 'بيت الزعفران'),
  tagline: tx('Charcoal grill & Levantine kitchen', 'مشويات على الفحم ومطبخ شامي'),
  description: tx(
    'A family-run grill house in the heart of Manama. Our meats are marinated overnight in saffron, sumac and seven spices, then cooked over oak charcoal and served with bread baked to order.',
    'مطعم مشويات عائلي في قلب المنامة. نتبّل اللحوم طوال الليل بالزعفران والسماق والبهارات السبع، ثم نشويها على فحم البلوط ونقدمها مع خبز يُخبز عند الطلب.',
  ),
  cuisines: [tx('Grill', 'مشويات'), tx('Levantine', 'شامي'), tx('Halal', 'حلال')],
  logo: monogramLogo('SH', '#b45309'),
  cover: photo('mixedGrill', tx('Mixed grill platter', 'طبق مشاوي مشكلة')),
  gallery: [
    photo('interiorWarm', tx('Dining room', 'صالة الطعام')),
    photo('tableSetting', tx('Table setting', 'تجهيز الطاولة')),
    photo('keftaSkewers', tx('Kofta on the grill', 'كفتة على الشواية')),
    photo('seasideTerrace', tx('Terrace seating', 'جلسات التراس')),
  ],
  currency: 'BHD',
  defaultLocale: 'en',
  timeZone: 'Asia/Bahrain',
  priceRange: 2,
  rating: { average: 4.7, count: 1284 },
  contact: {
    phone: '+973 1700 0000',
    email: 'hello@saffron-house.example',
    whatsapp: '+97336000000',
    website: 'https://saffron-house.example',
  },
  address: {
    line: tx('Building 214, Road 3803, Adliya', 'مبنى 214، طريق 3803، العدلية'),
    city: tx('Manama, Bahrain', 'المنامة، البحرين'),
    mapUrl: 'https://www.openstreetmap.org/?mlat=26.2125&mlon=50.5952#map=17/26.2125/50.5952',
  },
  social: [
    { platform: 'instagram', url: 'https://instagram.com/', handle: '@saffronhouse' },
    { platform: 'tiktok', url: 'https://tiktok.com/', handle: '@saffronhouse' },
    { platform: 'whatsapp', url: 'https://wa.me/97336000000' },
    { platform: 'website', url: 'https://saffron-house.example' },
  ],
  openingHours: [...everyDay('11:00', '01:00', [5]), { day: 5, open: '13:00', close: '01:00' }],
  wifi: { network: 'SaffronHouse_Guest', password: 'grill2024' },
  announcements: [
    {
      id: 'oud-night',
      tone: 'info',
      title: tx('Live oud every Thursday', 'عزف عود حي كل خميس'),
      message: tx(
        'Join us from 8 pm for live music on the terrace. Booking recommended.',
        'انضموا إلينا من الساعة 8 مساءً لموسيقى حية على التراس. يُنصح بالحجز.',
      ),
    },
    {
      id: 'new-prawns',
      tone: 'promo',
      title: tx('New: Saffron prawns', 'جديد: روبيان بالزعفران'),
      message: tx(
        'Gulf prawns grilled with saffron butter and chilli. Available while stock lasts.',
        'روبيان الخليج مشوي بزبدة الزعفران والفلفل الحار. متوفر حتى نفاد الكمية.',
      ),
      productId: 'sh-saffron-prawns',
    },
  ],
  ordering: {
    modes: ['dine-in', 'takeaway', 'delivery'],
    defaultMode: 'dine-in',
    tables: [
      ...tables('', 12, tx('Main hall', 'الصالة الرئيسية')),
      ...tables('T', 4, tx('Terrace', 'التراس'), 6),
    ],
    pricesIncludeTax: false,
    taxRate: 0.1,
    taxLabel: tx('VAT', 'ضريبة القيمة المضافة'),
    fees: [
      {
        id: 'service',
        label: tx('Service charge', 'رسوم الخدمة'),
        kind: 'percentage',
        value: 0.05,
        modes: ['dine-in'],
        taxable: true,
      },
      {
        id: 'packaging',
        label: tx('Eco packaging', 'تغليف صديق للبيئة'),
        kind: 'fixed',
        value: 200,
        modes: ['takeaway', 'delivery'],
        taxable: true,
      },
    ],
    tipOptions: [0.05, 0.1, 0.15],
    delivery: {
      fee: 800,
      minimumOrder: 3000,
      freeDeliveryAbove: 15000,
      estimatedMinutes: [35, 50],
      areas: [tx('Adliya', 'العدلية'), tx('Juffair', 'الجفير'), tx('Seef', 'السيف')],
    },
    preparationMinutes: 20,
    paymentMethods: {
      'dine-in': ['pay-at-counter', 'demo-online'],
      takeaway: ['pay-at-counter', 'demo-online'],
      delivery: ['cash', 'card-on-delivery', 'demo-online'],
    },
    allowScheduling: true,
    allowServiceRequests: true,
    maxQuantityPerLine: 20,
  },
  branding: { themePreset: 'saffron', layoutPreset: 'modern' },
}

export const brewAndBloom: Restaurant = {
  id: 'brew-and-bloom',
  name: tx('Brew & Bloom', 'برو آند بلوم'),
  tagline: tx('Specialty coffee & all-day brunch', 'قهوة مختصة وفطور طوال اليوم'),
  description: tx(
    'A sunlit neighbourhood café roasting single-origin beans in house. Brunch is served until noon, and our pastry team bakes everything fresh each morning.',
    'مقهى مشمس في الحي يحمّص حبوب القهوة أحادية المصدر داخلياً. يُقدَّم الفطور حتى الظهر، ويخبز فريق المعجنات كل شيء طازجاً كل صباح.',
  ),
  cuisines: [tx('Café', 'مقهى'), tx('Brunch', 'فطور متأخر'), tx('Bakery', 'مخبوزات')],
  logo: monogramLogo('B&B', '#3f6212'),
  cover: photo('brunchTable', tx('Brunch spread', 'مائدة فطور')),
  gallery: [
    photo('interiorIndustrial', tx('Café interior', 'داخل المقهى')),
    photo('lattes', tx('Latte art', 'فن اللاتيه')),
    photo('croissants', tx('Fresh croissants', 'كرواسون طازج')),
  ],
  currency: 'AED',
  defaultLocale: 'en',
  timeZone: 'Asia/Dubai',
  priceRange: 2,
  rating: { average: 4.8, count: 642 },
  contact: { phone: '+971 4 000 0000', email: 'hi@brewandbloom.example' },
  address: {
    line: tx('Shop 4, Alserkal Avenue, Al Quoz', 'محل 4، السركال أفنيو، القوز'),
    city: tx('Dubai, UAE', 'دبي، الإمارات'),
    mapUrl: 'https://www.openstreetmap.org/?mlat=25.1427&mlon=55.2268#map=17/25.1427/55.2268',
  },
  social: [
    { platform: 'instagram', url: 'https://instagram.com/', handle: '@brewandbloom' },
    { platform: 'facebook', url: 'https://facebook.com/' },
  ],
  openingHours: everyDay('07:00', '23:00'),
  wifi: { network: 'BrewAndBloom', password: 'flatwhite' },
  announcements: [
    {
      id: 'brunch-hours',
      tone: 'info',
      title: tx('Brunch until noon', 'الفطور حتى الظهر'),
      message: tx(
        'Breakfast dishes are served daily from 7:00 to 12:00.',
        'تُقدَّم أطباق الفطور يومياً من 7:00 حتى 12:00.',
      ),
    },
  ],
  ordering: {
    modes: ['dine-in', 'takeaway'],
    defaultMode: 'dine-in',
    tables: tables('', 10, tx('Café floor', 'صالة المقهى'), 2),
    pricesIncludeTax: true,
    taxRate: 0.05,
    taxLabel: tx('VAT', 'ضريبة القيمة المضافة'),
    fees: [],
    tipOptions: [0.1, 0.15, 0.2],
    preparationMinutes: 10,
    paymentMethods: {
      'dine-in': ['pay-at-counter', 'demo-online'],
      takeaway: ['pay-at-counter', 'demo-online'],
    },
    allowScheduling: true,
    allowServiceRequests: true,
    maxQuantityPerLine: 10,
  },
  branding: { themePreset: 'olive', layoutPreset: 'classic' },
}

export const lunaTrattoria: Restaurant = {
  id: 'luna-trattoria',
  name: tx('Luna Trattoria', 'تراتوريا لونا'),
  tagline: tx('Wood-fired pizza & fresh pasta', 'بيتزا على الحطب وباستا طازجة'),
  description: tx(
    'Neapolitan dough fermented for 48 hours, pasta rolled by hand every afternoon and a candle-lit dining room in the West Village.',
    'عجينة نابولية مخمّرة لمدة 48 ساعة، وباستا تُفرد يدوياً كل ظهيرة، وصالة طعام على ضوء الشموع في ويست فيليدج.',
  ),
  cuisines: [tx('Italian', 'إيطالي'), tx('Pizza', 'بيتزا'), tx('Pasta', 'باستا')],
  logo: monogramLogo('L', '#1e1b4b', '#facc15'),
  cover: photo('interiorBistro', tx('Candle-lit dining room', 'صالة طعام على ضوء الشموع')),
  gallery: [
    photo('barInterior', tx('The bar', 'البار')),
    photo('margherita', tx('Margherita', 'مارغريتا')),
    photo('pastaBolognese', tx('Fresh pasta', 'باستا طازجة')),
  ],
  currency: 'USD',
  defaultLocale: 'en',
  timeZone: 'America/New_York',
  priceRange: 3,
  rating: { average: 4.6, count: 2310 },
  contact: { phone: '+1 212 555 0100', email: 'ciao@lunatrattoria.example' },
  address: {
    line: tx('88 Bleecker Street', '88 شارع بليكر'),
    city: tx('New York, NY', 'نيويورك'),
    mapUrl: 'https://www.openstreetmap.org/?mlat=40.7286&mlon=-73.9990#map=17/40.7286/-73.9990',
  },
  social: [
    { platform: 'instagram', url: 'https://instagram.com/', handle: '@lunatrattoria' },
    { platform: 'x', url: 'https://x.com/' },
  ],
  openingHours: [...everyDay('12:00', '23:00', [0, 1]), { day: 0, open: '12:00', close: '21:30' }],
  announcements: [],
  ordering: {
    modes: ['dine-in', 'takeaway', 'delivery'],
    defaultMode: 'dine-in',
    tables: tables('', 14, tx('Dining room', 'صالة الطعام')),
    pricesIncludeTax: false,
    taxRate: 0.08875,
    taxLabel: tx('Sales tax', 'ضريبة المبيعات'),
    fees: [],
    tipOptions: [0.18, 0.2, 0.22],
    delivery: {
      fee: 499,
      minimumOrder: 2000,
      freeDeliveryAbove: 6000,
      estimatedMinutes: [30, 45],
      areas: [tx('West Village', 'ويست فيليدج'), tx('SoHo', 'سوهو'), tx('Chelsea', 'تشيلسي')],
    },
    preparationMinutes: 18,
    paymentMethods: {
      'dine-in': ['pay-at-counter', 'demo-online'],
      takeaway: ['pay-at-counter', 'demo-online'],
      delivery: ['card-on-delivery', 'demo-online'],
    },
    allowScheduling: true,
    allowServiceRequests: true,
    maxQuantityPerLine: 15,
  },
  branding: { themePreset: 'midnight', layoutPreset: 'elegant' },
}

export const MOCK_RESTAURANTS: Restaurant[] = [saffronHouse, brewAndBloom, lunaTrattoria]
