import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Briefcase,
  Calendar,
  Camera,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Copy,
  CreditCard,
  Download,
  Edit3,
  Eye,
  File,
  Globe2,
  GraduationCap,
  Heart,
  HelpCircle,
  Home,
  Image as ImageIcon,
  Info,
  Link,
  Lock,
  LucideIcon,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Pause,
  Phone,
  Plane,
  Play,
  Plus,
  Search,
  Settings,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Stethoscope,
  ThumbsUp,
  Trash2,
  Unlock,
  Upload,
  User,
  Users,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import { ImageLayer } from '../../../types/imageStudio';
import {
  TraditionalShapeType,
  UniversalIconId,
} from '../../../types/elementCatalog';
import type { EditableVectorGeometry } from '../../../types/vectorGeometry';
import {
  getEditableVectorPath,
  normalizeEditableVectorGeometry,
  isSafeEditableVectorPath,
  normalizeGeometricShapeProps,
} from '../../../utils/vectorGeometry';

export type { TraditionalShapeType } from '../../../types/elementCatalog';

const ICON_COMPONENTS: Record<UniversalIconId, LucideIcon> = {
  activity: Activity,
  alert: AlertTriangle,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  bell: Bell,
  briefcase: Briefcase,
  calendar: Calendar,
  camera: Camera,
  car: Car,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  clock: Clock,
  copy: Copy,
  'credit-card': CreditCard,
  download: Download,
  edit: Edit3,
  eye: Eye,
  file: File,
  globe: Globe2,
  'graduation-cap': GraduationCap,
  heart: Heart,
  help: HelpCircle,
  home: Home,
  image: ImageIcon,
  info: Info,
  link: Link,
  lock: Lock,
  mail: Mail,
  'map-pin': MapPin,
  menu: Menu,
  message: MessageCircle,
  minus: Minus,
  pause: Pause,
  phone: Phone,
  plane: Plane,
  play: Play,
  plus: Plus,
  search: Search,
  settings: Settings,
  share: Share2,
  shield: Shield,
  'shopping-cart': ShoppingCart,
  star: Star,
  stethoscope: Stethoscope,
  'thumbs-up': ThumbsUp,
  trash: Trash2,
  unlock: Unlock,
  upload: Upload,
  user: User,
  users: Users,
  wifi: Wifi,
  x: X,
  zap: Zap,
};

const polarPoints = (vertices: number, innerRadius?: number): string => {
  const count = Math.max(3, Math.min(24, Math.round(vertices)));
  const isStar = innerRadius !== undefined;
  const total = isStar ? count * 2 : count;
  return Array.from({ length: total }, (_, index) => {
    const radius = isStar && index % 2 === 1 ? Math.max(10, Math.min(48, innerRadius)) : 47;
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / total;
    return `${50 + Math.cos(angle) * radius},${50 + Math.sin(angle) * radius}`;
  }).join(' ');
};

const arcPath = (startAngle: number, endAngle: number, radius: number): string => {
  const toPoint = (angle: number) => {
    const radians = (angle - 90) * Math.PI / 180;
    return { x: 50 + Math.cos(radians) * radius, y: 50 + Math.sin(radians) * radius };
  };
  const start = toPoint(startAngle);
  const end = toPoint(endAngle);
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  const sweep = endAngle >= startAngle ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
};

export interface GeometricShapeGraphicProps {
  shapeType: TraditionalShapeType;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  sides?: number;
  points?: number;
  innerRadius?: number;
  ringRadius?: number;
  ringThickness?: number;
  arcStartAngle?: number;
  arcEndAngle?: number;
  waveStartY?: number;
  waveEndY?: number;
  waveAmplitude?: number;
  waveCycles?: number;
  waveAnchor?: 'top' | 'bottom';
  wavePath?: string;
  /** Normalized reusable geometry. When present it supersedes the preset shape. */
  vectorGeometry?: EditableVectorGeometry;
  className?: string;
}

export const GeometricShapeGraphic: React.FC<GeometricShapeGraphicProps> = ({
  shapeType,
  fill = 'currentColor',
  stroke = 'transparent',
  strokeWidth = 0,
  borderRadius = 16,
  sides = 7,
  points = 10,
  innerRadius = 40,
  ringRadius = 42,
  ringThickness,
  arcStartAngle = 180,
  arcEndAngle = 360,
  waveStartY = 48,
  waveEndY = 48,
  waveAmplitude = 24,
  waveCycles = 2,
  waveAnchor = 'bottom',
  wavePath,
  vectorGeometry,
  className = 'h-full w-full',
}) => {
  const svgProps = {
    viewBox: '0 0 100 100',
    className: `${className} block select-none`,
    preserveAspectRatio: 'none' as const,
  };
  const normalizedVectorGeometry = normalizeEditableVectorGeometry(vectorGeometry);
  const normalizedShapeProps = normalizeGeometricShapeProps({
    sides,
    points,
    innerRadius,
    borderRadius,
    strokeWidth,
    ringRadius,
    ringThickness,
    arcStartAngle,
    arcEndAngle,
    waveStartY,
    waveEndY,
    waveAmplitude,
    waveCycles,
    waveAnchor,
    wavePath,
  });
  const safeSides = Number(normalizedShapeProps.sides ?? sides ?? 7);
  const safePoints = Number(normalizedShapeProps.points ?? points ?? 10);
  const safeInnerRadius = Number(normalizedShapeProps.innerRadius ?? innerRadius ?? 40);
  const safeRingRadius = Number(normalizedShapeProps.ringRadius ?? ringRadius ?? 42);
  const safeArcStart = Number(normalizedShapeProps.arcStartAngle ?? arcStartAngle ?? 180);
  const safeArcEnd = Number(normalizedShapeProps.arcEndAngle ?? arcEndAngle ?? 360);
  const safeWaveStart = Number(normalizedShapeProps.waveStartY ?? waveStartY);
  const safeWaveEnd = Number(normalizedShapeProps.waveEndY ?? waveEndY);
  const safeWaveAmplitude = Number(normalizedShapeProps.waveAmplitude ?? 24);
  const safeWaveCycles = Number(normalizedShapeProps.waveCycles ?? 2);
  const safeWavePath = isSafeEditableVectorPath(normalizedShapeProps.wavePath)
    ? normalizedShapeProps.wavePath
    : undefined;
  const safeStrokeWidth = Number(normalizedShapeProps.strokeWidth ?? 0);
  const safeBorderRadius = Number(normalizedShapeProps.borderRadius ?? borderRadius ?? 16);
  const safeRingThickness = Number(normalizedShapeProps.ringThickness ?? ringThickness ?? (safeStrokeWidth || 10));
  const visibleStroke = safeStrokeWidth > 0 && stroke !== 'transparent' ? stroke : 'none';
  const lineColor = stroke !== 'transparent' ? stroke : fill;
  const lineWidth = Math.max(2, safeStrokeWidth || 4);

  if (normalizedVectorGeometry) {
    return (
      <svg {...svgProps}>
        <path
          d={getEditableVectorPath(normalizedVectorGeometry)}
          fill={normalizedVectorGeometry.closed ? fill : 'none'}
          fillRule={normalizedVectorGeometry.fillRule}
          stroke={visibleStroke}
          strokeWidth={safeStrokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (shapeType.startsWith('icon-')) {
    const iconId = shapeType.slice(5) as UniversalIconId;
    const Icon = ICON_COMPONENTS[iconId];
    if (Icon) {
      return (
        <Icon
          aria-hidden="true"
          className={className}
          color={lineColor}
          fill="none"
          strokeWidth={Math.max(1, Math.min(4, strokeWidth || 2))}
        />
      );
    }
  }

  switch (shapeType) {
    case 'line':
    case 'line-dashed':
    case 'line-dotted':
    case 'line-arrow-right':
    case 'line-arrow-both':
      return (
        <svg {...svgProps} viewBox="0 0 100 24">
          <line
            x1={shapeType === 'line-arrow-both' ? 12 : 2}
            y1="12"
            x2={shapeType.includes('arrow') ? 88 : 98}
            y2="12"
            stroke={lineColor}
            strokeWidth={lineWidth}
            strokeLinecap="round"
            strokeDasharray={shapeType === 'line-dashed' ? '12 8' : shapeType === 'line-dotted' ? '1 8' : undefined}
          />
          {shapeType.includes('arrow') && <polygon points="80,3 100,12 80,21" fill={lineColor} />}
          {shapeType === 'line-arrow-both' && <polygon points="20,3 0,12 20,21" fill={lineColor} />}
        </svg>
      );
    case 'curve':
      return <svg {...svgProps}><path d="M4 82 C24 8 76 8 96 82" fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" /></svg>;
    case 'arc':
      return <svg {...svgProps}><path d={arcPath(safeArcStart, safeArcEnd, safeRingRadius)} fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" /></svg>;
    case 'ring':
      return <svg {...svgProps}><circle cx="50" cy="50" r={safeRingRadius} fill="none" stroke={lineColor} strokeWidth={safeRingThickness} /></svg>;
    case 'connector-elbow':
      return <svg {...svgProps}><path d="M6 16 H52 V84 H94" fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" strokeLinejoin="round" /><polygon points="84,76 98,84 84,92" fill={lineColor} /></svg>;
    case 'connector-curved':
      return <svg {...svgProps}><path d="M6 16 C62 16 38 84 94 84" fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" /><polygon points="84,76 98,84 84,92" fill={lineColor} /></svg>;
    case 'circle':
    case 'mask-circle':
      return <svg {...svgProps}><ellipse cx="50" cy="50" rx="46" ry="46" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
    case 'rounded_rect':
    case 'mask-rounded':
      return <svg {...svgProps}><rect x="3" y="3" width="94" height="94" rx={Math.max(2, Math.min(48, safeBorderRadius / 2))} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
    case 'full-rectangle':
      return <svg {...svgProps}><rect x="0" y="0" width="100" height="100" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
    case 'top-semicircle':
      return <svg {...svgProps}><path d="M0 0 H100 A50 50 0 0 1 0 0Z" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
    case 'square':
    case 'rectangle':
      return <svg {...svgProps}><rect x="3" y="3" width="94" height="94" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
    case 'triangle':
    case 'triangle-up':
      return <svg {...svgProps}><polygon points="50,4 96,96 4,96" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'triangle-down':
      return <svg {...svgProps}><polygon points="50,96 96,4 4,4" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'diamond':
      return <svg {...svgProps}><polygon points="50,3 97,50 50,97 3,50" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'pentagon':
      return <svg {...svgProps}><polygon points={polarPoints(5)} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'hexagon':
    case 'mask-hexagon':
      return <svg {...svgProps}><polygon points={polarPoints(6)} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'octagon':
      return <svg {...svgProps}><polygon points={polarPoints(8)} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'polygon-parametric':
      return <svg {...svgProps}><polygon points={polarPoints(safeSides)} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'star':
    case 'star-5':
      return <svg {...svgProps}><polygon points={polarPoints(5, 22)} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'star-4':
      return <svg {...svgProps}><polygon points={polarPoints(4, 16)} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'star-6':
      return <svg {...svgProps}><polygon points={polarPoints(6, 25)} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'star-8':
      return <svg {...svgProps}><polygon points={polarPoints(8, 28)} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'burst-12':
      return <svg {...svgProps}><polygon points={polarPoints(12, 38)} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'star-parametric':
      return <svg {...svgProps}><polygon points={polarPoints(safePoints, safeInnerRadius)} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'arrow':
    case 'arrow-right':
      return <svg {...svgProps}><polygon points="2,32 55,32 55,12 98,50 55,88 55,68 2,68" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'arrow-left':
      return <svg {...svgProps}><polygon points="98,32 45,32 45,12 2,50 45,88 45,68 98,68" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'arrow-up':
      return <svg {...svgProps}><polygon points="32,98 32,45 12,45 50,2 88,45 68,45 68,98" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'arrow-down':
      return <svg {...svgProps}><polygon points="32,2 32,55 12,55 50,98 88,55 68,55 68,2" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'arrow-both':
      return <svg {...svgProps}><polygon points="24,20 2,50 24,80 24,66 76,66 76,80 98,50 76,20 76,34 24,34" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'speech_bubble':
      return <svg {...svgProps}><path d="M10 8 H90 Q97 8 97 18 V66 Q97 76 87 76 H48 L25 94 L29 76 H10 Q3 76 3 66 V18 Q3 8 10 8Z" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'heart':
    case 'mask-heart':
      return <svg {...svgProps}><path d="M50 91 C20 68 4 47 4 29 C4 14 15 4 29 4 C39 4 46 10 50 19 C54 10 61 4 71 4 C85 4 96 14 96 29 C96 47 80 68 50 91Z" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'shield':
      return <svg {...svgProps}><path d="M50 3 L92 20 V54 C92 79 50 97 50 97 C50 97 8 79 8 54 V20Z" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} strokeLinejoin="round" /></svg>;
    case 'blob-1':
    case 'mask-blob':
      return <svg {...svgProps}><path d="M17 21 C31 5 62 2 81 16 C99 30 97 62 80 80 C63 98 28 95 12 75 C-2 57 2 37 17 21Z" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
    case 'blob-2':
      return <svg {...svgProps}><path d="M9 35 C14 12 38 1 61 8 C85 15 100 36 92 59 C84 82 64 99 39 93 C14 88 3 60 9 35Z" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
    case 'blob-3':
      return <svg {...svgProps}><path d="M19 14 C35 2 51 10 62 9 C82 7 97 22 94 43 C91 62 100 74 82 88 C67 100 53 90 39 93 C17 98 3 82 7 61 C10 44 1 28 19 14Z" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
    case 'blob-4':
      return <svg {...svgProps}><path d="M10 28 C15 7 39 4 55 11 C70 17 84 6 94 24 C105 44 89 56 92 70 C95 88 73 99 57 91 C42 83 31 101 16 87 C2 74 14 55 8 43 C5 37 8 32 10 28Z" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
    case 'blob-5':
      return <svg {...svgProps}><path d="M21 8 C39 -1 54 12 68 8 C86 3 99 20 93 38 C87 54 101 66 87 82 C73 98 57 84 43 94 C24 108 6 91 11 70 C14 56 -1 43 8 27 C11 19 16 12 21 8Z" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
    case 'blob-6':
      return <svg {...svgProps}><path d="M7 41 C3 21 23 6 43 10 C59 13 71 1 86 12 C101 23 91 42 96 57 C102 78 80 91 61 88 C44 85 28 101 14 84 C3 71 11 56 7 41Z" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
    case 'carousel-wave': {
      if (safeWavePath) {
        return <svg {...svgProps}><path d={safeWavePath} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
      }
      const start = Math.max(8, Math.min(92, safeWaveStart));
      const end = Math.max(8, Math.min(92, safeWaveEnd));
      const middle = (start + end) / 2;
      const amplitude = Math.min(48, safeWaveAmplitude);
      const cycles = Math.max(1, Math.min(8, Math.round(safeWaveCycles)));
      const control = Math.max(4, Math.min(96, middle - amplitude));
      const reverseControl = Math.max(4, Math.min(96, middle + amplitude));
      const path = waveAnchor === 'top'
        ? `M0 0 L0 ${start} ${Array.from({ length: cycles }, (_, index) => `C${(index * 100 / cycles) + 25 / cycles} ${control} ${(index * 100 / cycles) + 25 / cycles} ${control} ${(index + 0.5) * 100 / cycles} ${middle} C${(index * 100 / cycles) + 75 / cycles} ${reverseControl} ${(index * 100 / cycles) + 75 / cycles} ${reverseControl} ${(index + 1) * 100 / cycles} ${end}`).join(' ')} L100 0Z`
        : `M0 ${start} ${Array.from({ length: cycles }, (_, index) => `C${(index * 100 / cycles) + 25 / cycles} ${control} ${(index * 100 / cycles) + 25 / cycles} ${control} ${(index + 0.5) * 100 / cycles} ${middle} C${(index * 100 / cycles) + 75 / cycles} ${reverseControl} ${(index * 100 / cycles) + 75 / cycles} ${reverseControl} ${(index + 1) * 100 / cycles} ${end}`).join(' ')} L100 100 L0 100Z`;
      return (
        <svg {...svgProps}>
          <path d={path} fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} />
        </svg>
      );
    }
    case 'bracket-square-left':
      return <svg {...svgProps}><path d="M74 5 H26 V95 H74" fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'bracket-square-right':
      return <svg {...svgProps}><path d="M26 5 H74 V95 H26" fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'bracket-square-pair':
      return <svg {...svgProps}><path d="M34 5 H12 V95 H34 M66 5 H88 V95 H66" fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'bracket-curly-pair':
      return <svg {...svgProps}><path d="M36 4 C18 4 26 35 10 38 C26 42 18 96 36 96 M64 4 C82 4 74 35 90 38 C74 42 82 96 64 96" fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" /></svg>;
    case 'separator-wave':
      return <svg {...svgProps}><path d="M2 50 C14 20 26 20 38 50 S62 80 74 50 S88 20 98 50" fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" /></svg>;
    case 'separator-curve':
      return <svg {...svgProps}><path d="M2 68 C28 68 34 22 58 30 C76 36 80 64 98 64" fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" /></svg>;
    case 'separator-zigzag':
      return <svg {...svgProps}><polyline points="2,62 18,38 34,62 50,38 66,62 82,38 98,62" fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinejoin="round" /></svg>;
    case 'separator-dots':
      return <svg {...svgProps}>{[18, 34, 50, 66, 82].map((cx) => <circle key={cx} cx={cx} cy="50" r={cx === 50 ? 6 : 3.5} fill={lineColor} />)}</svg>;
    case 'separator-diamond':
      return <svg {...svgProps}><path d="M2 50 H38 M62 50 H98" stroke={lineColor} strokeWidth={lineWidth} /><polygon points="50,34 66,50 50,66 34,50" fill={lineColor} /></svg>;
    case 'frame-simple':
      return <svg {...svgProps}><rect x="5" y="5" width="90" height="90" fill="none" stroke={lineColor} strokeWidth={lineWidth} /></svg>;
    case 'frame-rounded':
      return <svg {...svgProps}><rect x="5" y="5" width="90" height="90" rx={Math.max(4, Math.min(32, safeBorderRadius / 2))} fill="none" stroke={lineColor} strokeWidth={lineWidth} /></svg>;
    case 'frame-circle':
      return <svg {...svgProps}><ellipse cx="50" cy="50" rx="44" ry="44" fill="none" stroke={lineColor} strokeWidth={lineWidth} /></svg>;
    case 'frame-corners':
      return <svg {...svgProps}><path d="M35 7 H7 V35 M65 7 H93 V35 M93 65 V93 H65 M35 93 H7 V65" fill="none" stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" /></svg>;
    case 'frame-polaroid':
      return <svg {...svgProps}><path d="M5 5 H95 V95 H5Z M16 16 V69 H84 V16Z" fill={fill === 'transparent' ? lineColor : fill} fillRule="evenodd" /><rect x="16" y="16" width="68" height="53" fill="none" stroke={lineColor} strokeWidth={Math.max(2, lineWidth / 2)} /></svg>;
    case 'frame-film':
      return <svg {...svgProps}><rect x="3" y="10" width="94" height="80" fill="none" stroke={lineColor} strokeWidth={lineWidth} />{[12, 30, 48, 66, 84].flatMap((x) => [<rect key={`${x}-t`} x={x} y="3" width="8" height="12" fill={lineColor} />, <rect key={`${x}-b`} x={x} y="85" width="8" height="12" fill={lineColor} />])}</svg>;
    case 'mask-arch':
      return <svg {...svgProps}><path d="M5 97 V48 C5 22 25 3 50 3 C75 3 95 22 95 48 V97Z" fill={fill} stroke={visibleStroke} strokeWidth={safeStrokeWidth} /></svg>;
    default:
      return (
        <div
          className={`${className} flex items-center justify-center rounded-md border border-dashed border-current text-xs font-semibold`}
          data-preview-fallback={shapeType}
          role="img"
          aria-label="Vista previa no disponible"
        >
          ?
        </div>
      );
  }
};

export interface GeometricShapeBlockProps {
  layer: ImageLayer;
  onUpdateLayerProps?: (layerId: string, patch: Record<string, unknown>) => void;
}

export const GeometricShapeBlock: React.FC<GeometricShapeBlockProps> = ({ layer }) => {
  const blockProps = normalizeGeometricShapeProps({
    ...(layer.props ?? {}),
    ...(layer.vectorGeometry ? { vectorGeometry: layer.vectorGeometry } : {}),
  });
  return (
    <GeometricShapeGraphic
      shapeType={(blockProps.shapeType as TraditionalShapeType) ?? 'rectangle'}
      fill={(blockProps.fill as string) || (layer.fill as string) || 'currentColor'}
      stroke={(blockProps.stroke as string) || (blockProps.borderColor as string) || (layer.borderColor as string) || 'transparent'}
      strokeWidth={(blockProps.strokeWidth as number) ?? (blockProps.borderWidth as number) ?? layer.borderWidth ?? 0}
      borderRadius={(blockProps.borderRadius as number) ?? layer.borderRadius ?? 16}
      sides={(blockProps.sides as number) ?? 7}
      points={(blockProps.points as number) ?? 10}
      innerRadius={(blockProps.innerRadius as number) ?? 40}
      ringRadius={(blockProps.ringRadius as number) ?? 42}
      ringThickness={(blockProps.ringThickness as number) ?? undefined}
      arcStartAngle={(blockProps.arcStartAngle as number) ?? 180}
      arcEndAngle={(blockProps.arcEndAngle as number) ?? 360}
      waveStartY={(blockProps.waveStartY as number) ?? 48}
      waveEndY={(blockProps.waveEndY as number) ?? 48}
      waveAmplitude={(blockProps.waveAmplitude as number) ?? 24}
      waveCycles={(blockProps.waveCycles as number) ?? 2}
      waveAnchor={(blockProps.waveAnchor as 'top' | 'bottom') ?? 'bottom'}
      wavePath={blockProps.wavePath as string | undefined}
      vectorGeometry={blockProps.vectorGeometry as EditableVectorGeometry | undefined ?? layer.vectorGeometry}
    />
  );
};
