export {
  restaurantExtension,
  createRestaurantTemplates,
  type RestaurantExtensionOptions,
} from './extension'
export {
  createRestaurantNodeTypes,
  resolveTableStatus,
  getStatusDefinitions,
  STATUS_STATE_KEY,
  STATUS_DEFINITIONS_STATE_KEY,
} from './node-types'
export {
  allocate,
  getBarStoolPositions,
  getSeatPositions,
  getTableFootprint,
  BAR_TYPE,
  BOOTH_TYPE,
  SEATING_TYPES,
  TABLE_TYPE,
  ZONE_TYPE,
  type SeatLayout,
  type SeatPosition,
  type TableData,
  type TableShape,
} from './seating'
export {
  DEFAULT_STATUS,
  DEFAULT_TABLE_STATUSES,
  getCapacity,
  getTablesInReadingOrder,
  getZoneOf,
  isTable,
  mergeTables,
  nextTableNumber,
  renumberTables,
  seatToWorld,
  splitTable,
  summarizeRestaurant,
  validateRestaurantLayout,
  type RestaurantIssue,
  type RestaurantIssueType,
  type RestaurantLayoutRules,
  type RestaurantSummary,
  type TableStatusDefinition,
} from './tables'
export {
  useRestaurantFloor,
  type RestaurantTable,
  type UseRestaurantFloorOptions,
} from './use-restaurant-floor'
export { default as RestaurantStatusLegend } from './RestaurantStatusLegend.vue'
