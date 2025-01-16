
//Rule Submap Imports Defined in 'Maps' Directory.
import { flex } from './rules/flex.js';
import { border } from './rules/border.js';
import { text } from './rules/text.js';
import { grid } from './rules/grid.js';
import { backgrounds} from './rules/backgrounds.js';
import { cursor } from './rules/cursor.js';
import { aspect } from './rules/aspect.js';
import { overflow } from './rules/overflow.js';
import { place } from './rules/place.js';
import { decoration } from './rules/decoration.js'; 
import { whitespace } from './rules/whitespace.js';
import { wordbreak } from './rules/wordbreak.js';
import { pointerevents } from './rules/pointerevents.js';
import { resize } from './rules/resize.js';
import { vertical } from './rules/vertical.js';
import { hyphens } from './rules/hyphens.js';
import { attachment } from './rules/attachment.js';
import { clip } from './rules/clip.js';
import { origin } from './rules/origin.js';
import { outline } from './rules/outline.js';
import { pattern } from './rules/pattern.js';

//Token Type Definitions
export const elevateRules = {
    TextAlignRule: text.align,
    TextTransformRule: text.transform,
    xAxis: flex.xAxis,
    yAxis: flex.yAxis,
    BorderWidthRule: border.width,
    BorderRadiusRule: border.radius,
    BorderStyleRule: border.style,
    FlexGrowRule: flex.Grow,
    FlexShrinkRule: flex.Shrink,
    FlexSelfRule: flex.Self,
    FlexOrderRule: flex.Order,
    FlexBasisRule: flex.Basis,
    GridGapRule: grid.gap,
    GridRowRule: grid.row,
    GridColumnRule: grid.column,
    BGSizeRule: backgrounds.size,
    BGRepeatRule: backgrounds.repeat,
    BGPositionRule: backgrounds.position,
    CursorRule: cursor.variety,
    AspectRule: aspect.ratios,
    OverflowRule: overflow.options,
    PlaceRule: place.content,
    TextDecorationRule: decoration.options,
    WhiteSpaceRule: whitespace.options,
    WordBreakRule: wordbreak.options,
    PointerEventsRule: pointerevents.options,
    ResizeRule: resize.options,
    VerticalRule: vertical.options,
    HyphensRule: hyphens.options,
    BackgroundAttachmentRule: attachment.options,
    BackgroundClipRule: clip.options,
    BackgroundOriginRule: origin.options,
    OffsetRule: outline.offset,
    RoundRule: outline.radius,
    PatternForeRule: pattern.foreground,
    PatternBackRule: pattern.background
};