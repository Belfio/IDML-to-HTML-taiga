// Type definitions for XML structure
export interface SpreadXML {
  "idPkg:Spread": {
    Spread: SpreadElement[];
  };
}

export interface SpreadElement {
  $: SpreadAttributes;
  FlattenerPreference?: [
    {
      $: FlattenerPreference;
      Properties: [
        {
          RasterVectorBalance: [{ $: { type: string }; _: string }];
        }
      ];
    }
  ];
  Page?: PageElement[];
  Rectangle?: RectangleElement[];
  TextFrame?: TextFrameElement[];
  GraphicLine?: GraphicLineElement[];
  Group?: GroupElement[];
  Button?: ButtonElement[];
  AnimationSetting?: AnimationElement[];
  MultiStateObject?: MultiStateElement[];
  Polygon?: PolygonElement[];
}

export interface PageElement {
  $: PageAttributes;
  Properties?: [
    {
      PageColor: [{ $: { type: string }; _: string }];
      Descriptor: [
        {
          ListItem: Array<{ $: { type: string }; _: string }>;
        }
      ];
    }
  ];
  MarginPreference?: [
    {
      $: MarginPreference;
    }
  ];
  GridDataInformation?: [
    {
      $: GridDataInformation;
      Properties: [
        {
          AppliedFont: [{ $: { type: string }; _: string }];
        }
      ];
    }
  ];
  Rectangle?: RectangleElement[];
  TextFrame?: TextFrameElement[];
  GraphicLine?: GraphicLineElement[];
}

export interface RectangleElement {
  $: RectangleAttributes;
  Properties?: ElementProperties[];
  Image?: ImageElement[];
}

export interface TextFrameElement {
  $: TextFrameAttributes;
  Properties?: ElementProperties[];
}

export interface GraphicLineElement {
  $: GraphicLineAttributes;
  Properties?: ElementProperties[];
}

export interface GroupElement {
  $: GroupAttributes;
  Properties?: ElementProperties[];
  Rectangle?: RectangleElement[];
  TextFrame?: TextFrameElement[];
  GraphicLine?: GraphicLineElement[];
  Polygon?: PolygonElement[];
}

export interface ButtonElement {
  $: ButtonAttributes;
}

export interface AnimationElement {
  $: AnimationSettingAttributes;
}

export interface MultiStateElement {
  $: MultiStateObjectAttributes;
}

export interface PolygonElement {
  $: PolygonAttributes;
  Properties?: ElementProperties[];
}

export interface ImageElement {
  $: {
    ItemTransform: string;
  };
  Link?: [
    {
      $: {
        LinkResourceURI: string;
      };
    }
  ];
}

export interface SpreadAttributes {
  Self: string;
  PageTransitionType: string;
  PageTransitionDirection: string;
  PageTransitionDuration: string;
  ShowMasterItems: boolean;
  PageCount: number;
  BindingLocation: string;
  AllowPageShuffle: boolean;
  ItemTransform: string;
  FlattenerOverride: string;
}

export interface PageAttributes {
  Self: string;
  TabOrder: string;
  AppliedMaster: string;
  MasterPageTransform: string;
  Name: string;
  GeometricBounds: string;
  ItemTransform: string;
}

export interface TextFrameAttributes {
  Self: string;
  ParentStory: string;
  ContentType: string;
  ItemTransform: string;
  Visible?: boolean;
  Locked?: boolean;
  ItemLayer?: string;
}

export interface RectangleAttributes {
  Self: string;
  ContentType: string;
  StoryTitle: string;
  Visible: boolean;
  ItemTransform: string;
  GradientFillStart?: string;
  GradientFillLength?: string;
  GradientFillAngle?: string;
  ItemLayer: string;
  Locked: boolean;
  LocalDisplaySetting: string;
  AppliedObjectStyle: string;
}

export interface GraphicLineAttributes {
  Self: string;
  ContentType: string;
  StrokeColor: string;
  StrokeWeight: string;
  LeftLineEnd?: string;
  ItemTransform: string;
  ItemLayer: string;
  Visible?: boolean;
  Locked?: boolean;
}

export interface GroupAttributes {
  Self: string;
  ItemTransform: string;
  Visible: boolean;
  Locked: boolean;
}

export interface ButtonAttributes {
  Self: string;
  ItemTransform: string;
  Visible: boolean;
  Enabled: boolean;
}

export interface AnimationSettingAttributes {
  Self: string;
  Duration: string;
  MotionPath: string;
}

export interface MultiStateObjectAttributes {
  Self: string;
  InitialState: string;
  ItemTransform: string;
}

export interface FlattenerPreference {
  LineArtAndTextResolution: string;
  GradientAndMeshResolution: string;
  ClipComplexRegions: boolean;
  ConvertAllStrokesToOutlines: boolean;
  ConvertAllTextToOutlines: boolean;
  RasterVectorBalance: number;
}

export interface MarginPreference {
  ColumnCount: number;
  ColumnGutter: number;
  Top: number;
  Bottom: number;
  Left: number;
  Right: number;
  ColumnDirection: string;
  ColumnsPositions: string;
}

export interface GridDataInformation {
  FontStyle: string;
  PointSize: number;
  CharacterAki: number;
  LineAki: number;
  HorizontalScale: number;
  VerticalScale: number;
  LineAlignment: string;
  GridAlignment: string;
  CharacterAlignment: string;
  AppliedFont: string;
}

export interface PolygonAttributes {
  Self: string;
  ContentType: string;
  StoryTitle: string;
  OverriddenPageItemProps: string;
  Visible: boolean;
  Name: string;
  HorizontalLayoutConstraints: string;
  VerticalLayoutConstraints: string;
  GradientFillStart: string;
  GradientFillLength: string;
  GradientFillAngle: string;
  ItemLayer: string;
  Locked: boolean;
  LocalDisplaySetting: string;
  ItemTransform: string;
}

// ============================================
// PathGeometry Types
// These define the actual shape/dimensions of IDML elements
// ============================================

/**
 * PathPointType: A single point in a path
 * Anchor defines the point coordinates (x y format, in points)
 * LeftDirection/RightDirection are Bezier control handles
 */
export interface PathPointType {
  $: {
    Anchor: string;           // "x y" format, e.g. "-104.14 -80.76"
    LeftDirection: string;    // Bezier left control handle
    RightDirection: string;   // Bezier right control handle
  };
}

/**
 * PathPointArray: Collection of points that form a path
 */
export interface PathPointArray {
  PathPointType: PathPointType[];
}

/**
 * GeometryPathType: A single path within the geometry
 * PathOpen indicates if it's an open path (line) or closed (shape)
 */
export interface GeometryPathType {
  $: {
    PathOpen: string;  // "true" for open paths (lines), "false" for closed shapes
  };
  PathPointArray: PathPointArray[];
}

/**
 * PathGeometry: Container for the element's geometric shape
 * This is the key structure that defines actual dimensions
 */
export interface PathGeometry {
  GeometryPathType: GeometryPathType[];
}

/**
 * ElementProperties: Generic properties container for IDML elements
 * Contains PathGeometry and other element-specific properties
 */
export interface ElementProperties {
  PathGeometry?: PathGeometry[];
}
