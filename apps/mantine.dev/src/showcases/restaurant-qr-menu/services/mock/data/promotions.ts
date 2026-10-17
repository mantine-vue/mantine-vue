import type { Promotion } from '../../../domain/types'
import { photo } from './images'
import { tx } from './restaurants'

export const MOCK_PROMOTIONS: Record<string, Promotion[]> = {
  'saffron-house': [
    {
      id: 'sh-welcome',
      code: 'WELCOME10',
      title: tx('10% off your first order', 'خصم 10% على طلبك الأول'),
      description: tx(
        'Use code WELCOME10 on orders above BHD 5. Max discount BHD 2.',
        'استخدم الرمز WELCOME10 على الطلبات فوق 5 د.ب. الحد الأقصى للخصم 2 د.ب.',
      ),
      image: photo('mixedGrill'),
      kind: 'percentage',
      value: 0.1,
      minSubtotal: 5000,
      maxDiscount: 2000,
    },
    {
      id: 'sh-free-delivery',
      code: 'FREEDEL',
      title: tx('Free delivery tonight', 'توصيل مجاني الليلة'),
      description: tx(
        'Free delivery on orders above BHD 8 with code FREEDEL.',
        'توصيل مجاني للطلبات فوق 8 د.ب مع الرمز FREEDEL.',
      ),
      image: photo('shawarma'),
      kind: 'free-delivery',
      value: 0,
      minSubtotal: 8000,
      modes: ['delivery'],
    },
    {
      id: 'sh-grill-night',
      code: 'GRILL15',
      title: tx('BHD 1.500 off grill platters', 'خصم 1.500 د.ب على أطباق المشاوي'),
      description: tx(
        'Spend BHD 10 or more and save BHD 1.500 with code GRILL15.',
        'أنفق 10 د.ب أو أكثر ووفّر 1.500 د.ب مع الرمز GRILL15.',
      ),
      image: photo('keftaSkewers'),
      kind: 'fixed',
      value: 1500,
      minSubtotal: 10000,
      productId: 'sh-mixed-grill',
    },
    {
      id: 'sh-expired',
      code: 'SUMMER24',
      title: tx('Summer special', 'عرض الصيف'),
      description: tx('Expired summer campaign.', 'حملة صيفية منتهية.'),
      kind: 'percentage',
      value: 0.2,
      validUntil: '2024-09-01T00:00:00.000Z',
    },
  ],
  'brew-and-bloom': [
    {
      id: 'bb-morning',
      code: 'MORNING15',
      title: tx('15% off brunch for two', 'خصم 15% على الفطور لشخصين'),
      description: tx(
        'Use MORNING15 on orders above AED 80.',
        'استخدم الرمز MORNING15 على الطلبات فوق 80 درهم.',
      ),
      image: photo('brunchTable'),
      kind: 'percentage',
      value: 0.15,
      minSubtotal: 8000,
      maxDiscount: 4000,
      productId: 'bb-brunch-board',
    },
    {
      id: 'bb-loyalty',
      code: 'BLOOM10',
      title: tx('AED 10 off takeaway', 'خصم 10 دراهم على الطلبات الخارجية'),
      description: tx(
        'Valid on takeaway orders above AED 40.',
        'صالح للطلبات الخارجية فوق 40 درهم.',
      ),
      image: photo('icedCoffee'),
      kind: 'fixed',
      value: 1000,
      minSubtotal: 4000,
      modes: ['takeaway'],
    },
  ],
  'luna-trattoria': [
    {
      id: 'lt-luna20',
      code: 'LUNA20',
      title: tx('20% off pasta night', 'خصم 20% في ليلة الباستا'),
      description: tx(
        'Use LUNA20 on orders above $40. Max discount $15.',
        'استخدم الرمز LUNA20 على الطلبات فوق 40 دولار. الحد الأقصى للخصم 15 دولار.',
      ),
      image: photo('pastaBolognese'),
      kind: 'percentage',
      value: 0.2,
      minSubtotal: 4000,
      maxDiscount: 1500,
      productId: 'lt-bolognese',
    },
    {
      id: 'lt-free-delivery',
      code: 'FREEDEL',
      title: tx('Free delivery', 'توصيل مجاني'),
      description: tx('Free delivery on orders above $30.', 'توصيل مجاني للطلبات فوق 30 دولار.'),
      image: photo('margherita'),
      kind: 'free-delivery',
      value: 0,
      minSubtotal: 3000,
      modes: ['delivery'],
    },
  ],
}
