import type { ImageAsset, LocalizedText } from '../../../domain/types'

/**
 * Sample photography served by the Unsplash CDN (https://unsplash.com/license).
 * Every image used by the mock menus is listed here so it is easy to swap the
 * whole set for self-hosted assets.
 */
const PHOTOS = {
  // Restaurants
  interiorWarm: '1517248135467-4c7edcad34c4',
  interiorIndustrial: '1555396273-367ea4eb4db5',
  interiorBistro: '1552566626-52f8b828add9',
  tableSetting: '1414235077428-338989a2e8c0',
  seasideTerrace: '1559339352-11d035aa65de',
  barInterior: '1514933651103-005eec06c04b',
  brunchTable: '1424847651672-bf20a4b0982b',
  // Grill & Middle Eastern
  mixedGrill: '1555939594-58d7cb561ad1',
  keftaSkewers: '1599487488170-d11ec9c172f0',
  bbqRibs: '1544025162-d76694265947',
  steakPlate: '1504674900247-0877df9cc836',
  chickenPlate: '1561651823-34feb02250e4',
  shawarma: '1529006557810-274b9b2fc783',
  couscous: '1541518763669-27fef04b14ea',
  grilledSalmon: '1467003909585-2f8a72700288',
  prawns: '1565680018434-b513d5e5fd47',
  chickenWings: '1608039755401-742074f0548d',
  fries: '1573080496219-bb080dd4f877',
  shakshuka: '1590412200988-a436970781fa',
  burger: '1568901346375-23c9450c58cd',
  burgerAlt: '1551782450-a2132b4ba21d',
  // Salads & bowls
  gardenSalad: '1540189549336-e6e99c3679fe',
  quinoaBowl: '1547592180-85f173990554',
  salmonSalad: '1546793665-c74683f339c1',
  pokeBowl: '1546069901-ba9599a7e63c',
  buddhaBowl: '1512621776951-a57141f2eefd',
  eggBowl: '1490645935967-10de6ba17061',
  tomatoSoup: '1547592166-23ac45744acd',
  avocadoToast: '1541519227354-08fa5d50c44d',
  // Italian
  pizzaBasil: '1565299624946-b28f40a0ae38',
  pizzaSpicy: '1513104890138-7c749659a591',
  margherita: '1574071318508-1cdbab80d002',
  pastaBolognese: '1473093295043-cdd812d0e601',
  penne: '1621996346565-e3dbc646d9a9',
  shrimpSpaghetti: '1563379926898-05f4575a45d8',
  // Bakery & desserts
  pancakes: '1567620905732-2d1ec7ab7445',
  croissants: '1555507036-ab1f4038808a',
  baklava: '1617806501553-d3a6a3a7b227',
  brownies: '1606313564200-e75d5e30476c',
  raspberryCake: '1565958011703-44f9829ba187',
  cheesecake: '1533134242443-d4fd215305ad',
  tiramisu: '1571877227200-a0d98ea607e9',
  pannaCotta: '1488477181946-6428a0291777',
  donuts: '1551024601-bec78aea704b',
  sundae: '1563805042-7684c019e1cb',
  // Drinks
  orangeJuice: '1600271886742-f049cd451bba',
  mintLemonade: '1621263764928-df1444c5e859',
  lemonade: '1523371054106-bbf80586c38c',
  icedTea: '1556679343-c7306c1976bc',
  mocktails: '1544145945-f90425340c7e',
  mojito: '1551538827-9c037cb4f32a',
  espresso: '1510707577719-ae7c14805e3a',
  cappuccino: '1572442388796-11668a67e53d',
  lattes: '1495474472287-4d71bcdd2085',
  latteArt: '1509042239860-f550ce710b93',
  icedCoffee: '1461023058943-07fcbe16d735',
  milkshake: '1577805947697-89e18249d767',
} as const

export type PhotoKey = keyof typeof PHOTOS

export function photo(key: PhotoKey, alt?: LocalizedText): ImageAsset {
  return { url: `https://images.unsplash.com/photo-${PHOTOS[key]}`, alt }
}

/** Monogram logo rendered as an inline SVG data URI, so no extra asset is required. */
export function monogramLogo(letters: string, background: string, foreground = '#ffffff') {
  const text = letters.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${background}"/><circle cx="48" cy="48" r="40" fill="none" stroke="${foreground}" stroke-opacity=".35" stroke-width="2"/><text x="48" y="58" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-weight="700" fill="${foreground}">${text}</text></svg>`
  return { url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` }
}
