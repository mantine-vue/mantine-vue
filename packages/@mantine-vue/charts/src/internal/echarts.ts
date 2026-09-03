import { use } from 'echarts/core'
import {
  BarChart as EBarChart,
  CandlestickChart as ECandlestickChart,
  EffectScatterChart,
  FunnelChart as EFunnelChart,
  GaugeChart,
  GraphChart,
  HeatmapChart as EHeatmapChart,
  LineChart as ELineChart,
  PieChart as EPieChart,
  RadarChart as ERadarChart,
  SankeyChart as ESankeyChart,
  ScatterChart as EScatterChart,
  TreemapChart as ETreemapChart,
} from 'echarts/charts'
import {
  AriaComponent,
  CalendarComponent,
  DatasetComponent,
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
  PolarComponent,
  RadarComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent,
} from 'echarts/components'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'

let registered = false

export function registerECharts(): void {
  if (registered) {
    return
  }

  use([
    EBarChart,
    ECandlestickChart,
    EffectScatterChart,
    EFunnelChart,
    GaugeChart,
    GraphChart,
    EHeatmapChart,
    ELineChart,
    EPieChart,
    ERadarChart,
    ESankeyChart,
    EScatterChart,
    ETreemapChart,
    AriaComponent,
    CalendarComponent,
    DatasetComponent,
    DataZoomComponent,
    GraphicComponent,
    GridComponent,
    LegendComponent,
    MarkLineComponent,
    MarkAreaComponent,
    MarkPointComponent,
    PolarComponent,
    RadarComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    TransformComponent,
    VisualMapComponent,
    CanvasRenderer,
    SVGRenderer,
  ])

  registered = true
}
