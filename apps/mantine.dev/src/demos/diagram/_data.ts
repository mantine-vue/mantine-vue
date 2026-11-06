import { segmentBox } from '@mantine-vue/diagram'
import type { DiagramDocument, DiagramNode, DiagramTemplate } from '@mantine-vue/diagram'

export function createBasicDocument(): DiagramDocument {
  return {
    version: 1,
    nodes: [
      {
        id: 'idea',
        type: 'note',
        x: 40,
        y: 40,
        width: 160,
        height: 110,
        label: 'Drag me, resize me or double click to edit',
      },
      {
        id: 'box',
        type: 'rect',
        x: 280,
        y: 60,
        width: 160,
        height: 70,
        label: 'Rectangle',
        style: { fill: 'blue.0', stroke: 'blue.6', cornerRadius: 8 },
      },
      {
        id: 'circle',
        type: 'ellipse',
        x: 520,
        y: 50,
        width: 140,
        height: 90,
        label: 'Ellipse',
        style: { fill: 'teal.0', stroke: 'teal.6' },
      },
      {
        id: 'star',
        type: 'star',
        x: 300,
        y: 220,
        width: 120,
        height: 120,
        style: { fill: 'yellow.2', stroke: 'yellow.8' },
      },
      {
        id: 'text',
        type: 'text',
        x: 500,
        y: 250,
        width: 200,
        height: 60,
        label: 'Plain text',
        style: { fontSize: 20 },
      },
    ],
    edges: [
      {
        id: 'e1',
        type: 'orthogonal',
        source: { nodeId: 'box', portId: 'right' },
        target: { nodeId: 'circle', portId: 'left' },
        targetArrow: 'triangle',
      },
      {
        id: 'e2',
        type: 'bezier',
        source: { nodeId: 'box', portId: 'bottom' },
        target: { nodeId: 'star', portId: 'top' },
        label: 'curved',
      },
    ],
  }
}

/** Flowchart shapes for palettes. */
export const FLOWCHART_TEMPLATES: DiagramTemplate[] = [
  {
    id: 'start',
    label: 'Start / end',
    category: 'Flowchart',
    keywords: ['terminator'],
    node: {
      type: 'stadium',
      width: 160,
      height: 56,
      label: 'Start',
      style: { fill: 'teal.0', stroke: 'teal.6' },
    },
  },
  {
    id: 'process',
    label: 'Process',
    category: 'Flowchart',
    node: {
      type: 'rect',
      width: 160,
      height: 70,
      label: 'Process',
      style: { fill: 'blue.0', stroke: 'blue.6', cornerRadius: 6 },
    },
  },
  {
    id: 'decision',
    label: 'Decision',
    category: 'Flowchart',
    node: {
      type: 'diamond',
      width: 150,
      height: 100,
      label: 'Decision?',
      style: { fill: 'yellow.0', stroke: 'yellow.7' },
    },
  },
  {
    id: 'data',
    label: 'Data',
    category: 'Flowchart',
    keywords: ['input', 'output'],
    node: {
      type: 'parallelogram',
      width: 160,
      height: 70,
      label: 'Data',
      style: { fill: 'grape.0', stroke: 'grape.6' },
    },
  },
  {
    id: 'document',
    label: 'Document',
    category: 'Flowchart',
    node: {
      type: 'document',
      width: 150,
      height: 90,
      label: 'Document',
      style: { fill: 'orange.0', stroke: 'orange.6' },
    },
  },
  {
    id: 'database',
    label: 'Database',
    category: 'Flowchart',
    node: {
      type: 'cylinder',
      width: 110,
      height: 120,
      label: 'Database',
      style: { fill: 'cyan.0', stroke: 'cyan.7' },
    },
  },
  {
    id: 'manual',
    label: 'Manual step',
    category: 'Flowchart',
    node: { type: 'trapezoid', width: 160, height: 70, label: 'Manual step' },
  },
  {
    id: 'note',
    label: 'Note',
    category: 'Annotations',
    node: { type: 'note', width: 160, height: 100, label: 'Note' },
  },
  {
    id: 'text',
    label: 'Text',
    category: 'Annotations',
    node: { type: 'text', width: 160, height: 40, label: 'Text' },
  },
  {
    id: 'decision-pair',
    label: 'Decision with branches',
    category: 'Patterns',
    nodes: [
      {
        type: 'diamond',
        x: 0,
        y: 0,
        width: 150,
        height: 100,
        label: 'Valid?',
        style: { fill: 'yellow.0', stroke: 'yellow.7' },
      },
      {
        type: 'rect',
        x: -120,
        y: 170,
        width: 150,
        height: 64,
        label: 'Yes',
        style: { fill: 'green.0', stroke: 'green.6', cornerRadius: 6 },
      },
      {
        type: 'rect',
        x: 130,
        y: 170,
        width: 150,
        height: 64,
        label: 'No',
        style: { fill: 'red.0', stroke: 'red.6', cornerRadius: 6 },
      },
    ],
    edges: [
      { source: 0, target: 1, label: 'yes' },
      { source: 0, target: 2, label: 'no' },
    ],
  },
]

export function createFlowchartDocument(): DiagramDocument {
  const node = (
    id: string,
    type: string,
    label: string,
    style: DiagramNode['style'],
    width = 160,
    height = 64,
  ): DiagramNode => ({
    id,
    type,
    x: 0,
    y: 0,
    width,
    height,
    label,
    style,
  })

  return {
    version: 1,
    nodes: [
      node('start', 'stadium', 'Order received', { fill: 'teal.0', stroke: 'teal.6' }),
      node('check', 'diamond', 'In stock?', { fill: 'yellow.0', stroke: 'yellow.7' }, 150, 100),
      node('reserve', 'rect', 'Reserve items', {
        fill: 'blue.0',
        stroke: 'blue.6',
        cornerRadius: 6,
      }),
      node('order', 'rect', 'Order from supplier', {
        fill: 'blue.0',
        stroke: 'blue.6',
        cornerRadius: 6,
      }),
      node('db', 'cylinder', 'Inventory', { fill: 'cyan.0', stroke: 'cyan.7' }, 110, 110),
      node('ship', 'rect', 'Ship order', { fill: 'blue.0', stroke: 'blue.6', cornerRadius: 6 }),
      node('end', 'stadium', 'Done', { fill: 'teal.0', stroke: 'teal.6' }),
    ],
    edges: [
      {
        id: 'f1',
        type: 'orthogonal',
        source: { nodeId: 'start' },
        target: { nodeId: 'check' },
        targetArrow: 'triangle',
      },
      {
        id: 'f2',
        type: 'orthogonal',
        source: { nodeId: 'check' },
        target: { nodeId: 'reserve' },
        label: 'yes',
        targetArrow: 'triangle',
      },
      {
        id: 'f3',
        type: 'orthogonal',
        source: { nodeId: 'check' },
        target: { nodeId: 'order' },
        label: 'no',
        targetArrow: 'triangle',
      },
      {
        id: 'f4',
        type: 'orthogonal',
        source: { nodeId: 'reserve' },
        target: { nodeId: 'db' },
        targetArrow: 'triangle',
        style: { strokeDasharray: '6 4' },
      },
      {
        id: 'f5',
        type: 'orthogonal',
        source: { nodeId: 'reserve' },
        target: { nodeId: 'ship' },
        targetArrow: 'triangle',
      },
      {
        id: 'f6',
        type: 'orthogonal',
        source: { nodeId: 'order' },
        target: { nodeId: 'ship' },
        targetArrow: 'triangle',
      },
      {
        id: 'f7',
        type: 'orthogonal',
        source: { nodeId: 'ship' },
        target: { nodeId: 'end' },
        targetArrow: 'triangle',
      },
    ],
  }
}

export function createOrgChartDocument(): DiagramDocument {
  const people: [string, string, string, string | null][] = [
    ['ceo', 'Maya Chen', 'Chief executive', null],
    ['cto', 'Omar Haddad', 'Engineering', 'ceo'],
    ['cfo', 'Lena Ivanova', 'Finance', 'ceo'],
    ['coo', 'Sam Okafor', 'Operations', 'ceo'],
    ['fe', 'Ana Silva', 'Frontend', 'cto'],
    ['be', 'Kenji Mori', 'Backend', 'cto'],
    ['acc', 'Priya Nair', 'Accounting', 'cfo'],
    ['ops', 'Jonas Berg', 'Logistics', 'coo'],
  ]

  return {
    version: 1,
    nodes: people.map(([id, name, role]) => ({
      id,
      type: 'person',
      x: 0,
      y: 0,
      width: 200,
      height: 76,
      data: { name, role, progress: Math.round(((id.charCodeAt(0) * 7) % 100) / 10) * 10 },
    })),
    edges: people
      .filter(([, , , manager]) => manager)
      .map(([id, , , manager]) => ({
        id: `r-${id}`,
        type: 'rounded',
        source: { nodeId: manager! },
        target: { nodeId: id },
        targetArrow: 'none',
      })),
  }
}

const M = 100

const wall = (
  id: string,
  a: [number, number],
  b: [number, number],
  thickness = 20,
): DiagramNode => ({
  id,
  type: 'floor-wall',
  ...segmentBox({ x: a[0] * M, y: a[1] * M }, { x: b[0] * M, y: b[1] * M }, thickness),
})

/** An apartment of 12 × 8 m. */
export function createApartmentDocument(): DiagramDocument {
  const outline: [number, number][] = [
    [0, 0],
    [12, 0],
    [12, 8],
    [0, 8],
  ]
  const walls = outline.map((point, index) =>
    wall(`w${index}`, point, outline[(index + 1) % outline.length]),
  )

  return {
    version: 1,
    settings: {
      scale: { pixelsPerMeter: 100, unit: 'm', precision: 2 },
      gridSize: 25,
      bounds: { x: -100, y: -100, width: 1400, height: 1000 },
    },
    layers: [{ id: 'ground', name: 'Ground floor', kind: 'floor', visible: true }],
    nodes: [
      {
        id: 'living',
        type: 'floor-room',
        x: 0,
        y: 0,
        width: 700,
        height: 800,
        label: 'Living room',
        data: {
          points: [
            { x: 0, y: 0 },
            { x: 700, y: 0 },
            { x: 700, y: 800 },
            { x: 0, y: 800 },
          ],
          showArea: true,
        },
      },
      {
        id: 'bedroom',
        type: 'floor-room',
        x: 700,
        y: 0,
        width: 500,
        height: 450,
        label: 'Bedroom',
        style: { fill: 'grape.0', stroke: 'grape.4' },
        data: {
          points: [
            { x: 0, y: 0 },
            { x: 500, y: 0 },
            { x: 500, y: 450 },
            { x: 0, y: 450 },
          ],
          showArea: true,
        },
      },
      {
        id: 'bath',
        type: 'floor-room',
        x: 700,
        y: 450,
        width: 500,
        height: 350,
        label: 'Bathroom',
        style: { fill: 'cyan.0', stroke: 'cyan.5' },
        data: {
          points: [
            { x: 0, y: 0 },
            { x: 500, y: 0 },
            { x: 500, y: 350 },
            { x: 0, y: 350 },
          ],
          showArea: true,
        },
      },
      ...walls,
      wall('w4', [7, 0], [7, 8], 12),
      wall('w5', [7, 4.5], [12, 4.5], 12),
      {
        id: 'door-main',
        type: 'floor-door',
        x: 0,
        y: 0,
        width: 100,
        height: 20,
        data: { kind: 'single', wallId: 'w2', offset: 900 },
      },
      {
        id: 'door-bed',
        type: 'floor-door',
        x: 0,
        y: 0,
        width: 90,
        height: 12,
        flipY: true,
        data: { kind: 'single', wallId: 'w4', offset: 250 },
      },
      {
        id: 'door-bath',
        type: 'floor-door',
        x: 0,
        y: 0,
        width: 80,
        height: 12,
        data: { kind: 'sliding', wallId: 'w4', offset: 620 },
      },
      {
        id: 'window-1',
        type: 'floor-window',
        x: 0,
        y: 0,
        width: 200,
        height: 20,
        data: { wallId: 'w0', offset: 300 },
      },
      {
        id: 'window-2',
        type: 'floor-window',
        x: 0,
        y: 0,
        width: 160,
        height: 20,
        data: { wallId: 'w0', offset: 950 },
      },
      {
        id: 'sofa',
        type: 'floor-furniture',
        x: 80,
        y: 520,
        width: 200,
        height: 90,
        rotation: 0,
        data: { kind: 'sofa' },
      },
      {
        id: 'table',
        type: 'floor-furniture',
        x: 380,
        y: 150,
        width: 160,
        height: 90,
        data: { kind: 'dining-table' },
      },
      {
        id: 'tv',
        type: 'floor-furniture',
        x: 100,
        y: 720,
        width: 160,
        height: 45,
        rotation: 180,
        data: { kind: 'tv-stand' },
      },
      {
        id: 'bed',
        type: 'floor-furniture',
        x: 900,
        y: 60,
        width: 160,
        height: 200,
        data: { kind: 'bed-double' },
      },
      {
        id: 'wardrobe',
        type: 'floor-furniture',
        x: 740,
        y: 350,
        width: 120,
        height: 60,
        data: { kind: 'wardrobe' },
      },
      {
        id: 'tub',
        type: 'floor-furniture',
        x: 1010,
        y: 700,
        width: 170,
        height: 75,
        data: { kind: 'bathtub' },
      },
      {
        id: 'toilet',
        type: 'floor-furniture',
        x: 730,
        y: 700,
        width: 40,
        height: 65,
        rotation: 0,
        data: { kind: 'toilet' },
      },
      {
        id: 'basin',
        type: 'floor-furniture',
        x: 800,
        y: 470,
        width: 55,
        height: 45,
        data: { kind: 'washbasin' },
      },
      {
        id: 'dim',
        type: 'floor-dimension',
        ...segmentBox({ x: 0, y: -60 }, { x: 1200, y: -60 }, 30),
      },
    ],
    edges: [],
  }
}

const table = (
  id: string,
  x: number,
  y: number,
  seats: number,
  shape: string,
  extra: Partial<DiagramNode> = {},
): DiagramNode => {
  const size =
    shape === 'rectangle'
      ? { width: 180, height: 80 }
      : shape === 'square'
        ? { width: 80, height: 80 }
        : { width: seats > 4 ? 130 : 90, height: seats > 4 ? 130 : 90 }

  return {
    id,
    type: 'restaurant-table',
    x,
    y,
    ...size,
    ...extra,
    data: { shape, seats, ...extra.data },
  }
}

/** A dining room of 16 × 10 m with a terrace, a bar and a kitchen. */
export function createRestaurantDocument(): DiagramDocument {
  const outline: [number, number][] = [
    [0, 0],
    [16, 0],
    [16, 10],
    [0, 10],
  ]

  return {
    version: 1,
    settings: {
      scale: { pixelsPerMeter: 100, unit: 'm', precision: 1 },
      gridSize: 25,
      bounds: { x: 0, y: 0, width: 1600, height: 1400 },
    },
    nodes: [
      {
        id: 'dining',
        type: 'restaurant-zone',
        x: 20,
        y: 20,
        width: 1060,
        height: 960,
        label: 'Main room',
        data: {
          kind: 'dining',
          points: [
            { x: 0, y: 0 },
            { x: 1060, y: 0 },
            { x: 1060, y: 960 },
            { x: 0, y: 960 },
          ],
        },
      },
      {
        id: 'kitchen',
        type: 'restaurant-zone',
        x: 1100,
        y: 20,
        width: 480,
        height: 520,
        label: 'Kitchen',
        data: {
          kind: 'restricted',
          points: [
            { x: 0, y: 0 },
            { x: 480, y: 0 },
            { x: 480, y: 520 },
            { x: 0, y: 520 },
          ],
        },
      },
      {
        id: 'walkway',
        type: 'restaurant-zone',
        x: 20,
        y: 440,
        width: 1060,
        height: 120,
        label: 'Walkway',
        data: {
          kind: 'walkway',
          points: [
            { x: 0, y: 0 },
            { x: 1060, y: 0 },
            { x: 1060, y: 120 },
            { x: 0, y: 120 },
          ],
        },
      },
      {
        id: 'terrace',
        type: 'restaurant-zone',
        x: 20,
        y: 1020,
        width: 1560,
        height: 360,
        label: 'Terrace',
        data: {
          kind: 'outdoor',
          points: [
            { x: 0, y: 0 },
            { x: 1560, y: 0 },
            { x: 1560, y: 360 },
            { x: 0, y: 360 },
          ],
        },
      },
      ...outline.map((point, index) =>
        wall(`w${index}`, point, outline[(index + 1) % outline.length]),
      ),
      wall('kitchen-wall', [11, 0], [11, 5.5], 12),
      wall('kitchen-wall-2', [11, 5.5], [16, 5.5], 12),
      {
        id: 'entrance',
        type: 'floor-door',
        x: 0,
        y: 0,
        width: 160,
        height: 20,
        data: { kind: 'double', wallId: 'w2', offset: 1300 },
      },
      {
        id: 'kitchen-door',
        type: 'floor-door',
        x: 0,
        y: 0,
        width: 100,
        height: 12,
        data: { kind: 'double', wallId: 'kitchen-wall', offset: 450 },
      },
      table('t1', 60, 100, 2, 'round', { data: { number: 1 } }),
      table('t2', 330, 105, 4, 'square', { data: { number: 2, status: 'reserved' } }),
      table('t3', 580, 105, 4, 'square', { data: { number: 3 } }),
      table('t4', 830, 85, 6, 'round', { data: { number: 4, status: 'occupied' } }),
      table('t5', 90, 650, 6, 'rectangle', { data: { number: 5, seatLayout: 'long-sides' } }),
      table('t6', 450, 650, 6, 'rectangle', {
        data: { number: 6, seatLayout: 'long-sides', status: 'occupied' },
      }),
      table('t7', 800, 640, 8, 'round', { data: { number: 7 } }),
      {
        id: 'b1',
        type: 'restaurant-booth',
        x: 120,
        y: 1120,
        width: 160,
        height: 160,
        data: { number: 8, seats: 4, layout: 'double' },
      },
      {
        id: 'b2',
        type: 'restaurant-booth',
        x: 340,
        y: 1120,
        width: 160,
        height: 160,
        data: { number: 9, seats: 4, layout: 'double', status: 'cleaning' },
      },
      table('t10', 620, 1155, 2, 'round', { data: { number: 10 } }),
      table('t11', 880, 1155, 2, 'round', { data: { number: 11, status: 'disabled' } }),
      {
        id: 'bar',
        type: 'restaurant-bar',
        x: 1150,
        y: 640,
        width: 380,
        height: 60,
        label: 'Bar',
        data: { number: 12, seats: 6 },
      },
    ],
    edges: [],
  }
}

/** Statuses as a reservation system would report them. */
export const SIMULATED_STATUSES = ['available', 'reserved', 'occupied', 'cleaning'] as const
