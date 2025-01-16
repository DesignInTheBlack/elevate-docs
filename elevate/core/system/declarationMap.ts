import { relationships } from "../../config/syntax.js";

export const declarationMap = {

    // =============================
    // Positioning
    // =============================
    relative: { "position": "relative" },
    absolute: { "position": "absolute" },
    fixed: { "position": "fixed" },
    sticky: { "position": "sticky" },
    static: { "position": "static" },
    initial: { "position": "initial" },
    inherit: { "position": "inherit" },

    // =============================
    // Display Properties
    // =============================
    block: { "display": "block" },
    "inline-block": { "display": "inline-block" },
    inline: { "display": "inline" },
    flex: { "display": "flex" },
    "inline-flex": { "display": "inline-flex" },
    table: { "display": "table" },
    "inline-table": { "display": "inline-table" },
    "table-caption": { "display": "table-caption" },
    "table-cell": { "display": "table-cell" },
    "table-column": { "display": "table-column" },
    "table-column-group": { "display": "table-column-group" },
    "table-footer-group": { "display": "table-footer-group" },
    "table-header-group": { "display": "table-header-group" },
    "table-row-group": { "display": "table-row-group" },
    "table-row": { "display": "table-row" },
    "flow-root": { "display": "flow-root" },
    "inline-grid": { "display": "inline-grid" },
    contents: { "display": "contents" },
    "list-item": { "display": "list-item" },
    hidden: { "display": "none" },

    // =============================
    // Z-Index
    // =============================
    z: { "z-index": "NumericToken" },

    // =============================
    // Spacing & Layout
    // =============================
    mg: {
        "margin-top": "top",
        "margin-left": "left",
        "margin-right": "right",
        "margin-bottom": "bottom"
    },

    pd: {
        "padding-top": "top",
        "padding-left": "left",
        "padding-right": "right",
        "padding-bottom": "bottom"
    },

    'pd-l': { "padding-left": "SpacingToken" },
    'pd-r': { "padding-right": "SpacingToken" },
    'pd-t': { "padding-top": "SpacingToken" },
    'pd-b': { "padding-bottom": "SpacingToken" },
    'mg-l': { "margin-left": "SpacingToken" },
    'mg-r': { "margin-right": "SpacingToken" },
    'mg-t': { "margin-top": "SpacingToken" },
    'mg-b': { "margin-bottom": "SpacingToken" },
    w: { "width": "SpacingToken" },
    h: { "height": "SpacingToken" },
    'min-w': { "min-width": "SpacingToken" },
    'max-w': { "max-width": "SpacingToken" },
    'min-h': { "min-height": "SpacingToken" },
    'max-h': { "max-height": "SpacingToken" },
    gap: { "gap": "SpacingToken" },

    inset: {
        "top": "top",
        "right": "right",
        "bottom": "bottom",
        "left": "left"
    },

    left: { "left": "SpacingToken" },
    right: { "right": "SpacingToken" },
    top: { "top": "SpacingToken" },
    bottom: { "bottom": "SpacingToken" },

    // =============================
    // Flex Properties
    // =============================
    row: {
        "justify-content": "x", // x maps to justify-content in row
        "align-items": "y",    // y maps to align-items in row
        "flex-wrap": "FlexWrapRule"
    },

    col: {
        "align-items": "x",   // x maps to align-items in col
        "justify-content": "y", // y maps to justify-content in col
        "flex-wrap": "FlexWrapRule"
    },

    'row-r': {
        "align-items": "x",   // x maps to align-items in col
        "justify-content": "y", // y maps to justify-content in col
        "flex-wrap": "FlexWrapRule"
    },

    'col-r': {
        "align-items": "x",   // x maps to align-items in col
        "justify-content": "y", // y maps to justify-content in col
        "flex-wrap": "FlexWrapRule"
    },

    item: {
        "flex-basis": "FlexBasisRule",
        "flex-grow": "FlexGrowRule",
        "flex-shrink": "FlexShrinkRule",
        "align-self": "FlexSelfRule",
        "order": "FlexOrderRule"
    },

    // =============================
    // Typography
    // =============================
    font: {
        "font-size": "FontSizeToken",
        "font-family": "FontFamilyToken",
        "font-weight": "FontWeightToken",
        "line-height": "LineHeightToken",
        "letter-spacing": "LetterSpacingToken",
    },

    text: {
        "color": "ColorToken",
        "text-transform": "TextTransformRule",
        "max-width": "MeasureToken",
        "text-align": "TextAlignRule",
        "text-decoration": "TextDecorationRule",
    },



    // =============================
    // Borders
    // =============================
    bd: {
        "border-color": "ColorToken",
        "border-width": "BorderWidthRule",
        "border-radius": "BorderRadiusRule",
        "border-style": "BorderStyleRule"
    },

    'bd-l': {
        "border-left-color": "ColorToken",
        "border-left-width": "BorderWidthRule",
        "border-left-radius": "BorderRadiusRule",
        "border-left-style": "BorderStyleRule"
    },

    'bd-r': {
        "border-right-color": "ColorToken",
        "border-right-width": "BorderWidthRule",
        "border-right-radius": "BorderRadiusRule",
        "border-right-style": "BorderStyleRule"
    },

    'bd-t': {
        "border-top-color": "ColorToken",
        "border-top-width": "BorderWidthRule",
        "border-top-radius": "BorderRadiusRule",
        "border-top-style": "BorderStyleRule"
    },

    'bd-b': {
        "border-bottom-color": "ColorToken",
        "border-bottom-width": "BorderWidthRule",
        "border-bottom-radius": "BorderRadiusRule",
        "border-bottom-style": "BorderStyleRule"
    },

    // =============================
    // Backgrounds
    // =============================
    'bg-img': { "background-image": "PassThroughToken" },
    'bg-color': { 'background-color': "ColorToken" },
    'bg-size': { "background-size": "BGSizeRule" },
    'bg-position': { "background-position": "BGPositionRule" },
    'bg-repeat': { "background-repeat": "BGRepeatRule" },


    // =============================
    // Grid Layout
    // =============================
    grid: {
        "grid-template-columns": "GridColumnRule",
        "grid-template-rows": "GridRowRule",
        "grid-gap": "GridGapRule"
    },


    //To be documented

    // =============================
    // Cursor
    // =============================
    'cursor': { "cursor": "CursorRule" },

    // =============================
    // Aspect Ratios
    // =============================

    'aspect': { "aspect-ratio": "AspectRule" },

     // =============================
    // Aspect Ratios
    // =============================
     'content-box': { "box-sizing": "content-box" },
     'border-box': { "box-sizing": "border-box" },

    // =============================
    // Overflow
    // =============================
    'overflow': { "overflow": "OverflowRule" },

    // =============================
    // Visibility
    // =============================
    'visible': { "visibility": "visible" },
    'invisible': { "visibility": "hidden" },
    'collapse': { "visibility": "collapse" },

    
    // =============================
    // Place Content
    // =============================

    'place-content': { "place-content": "PlaceRule" },

    // =============================
    // White Space
    // =============================

    'white-space': { "white-space": "WhiteSpaceRule" },

    // =============================
    // Word Break
    // =============================

    'break': { "word-break": "WordBreakRule" },

    // =============================
    // Pointer Events
    // =============================

    'events': { "pointer-events": "PointerEventsRule" },

    // =============================
    // Caret Color
    // =============================

    caret: { "caret-color": "ColorToken" },
    
    // =============================
    // Resize
    // =============================

    'resize': { "resize": "ResizeRule" },

    // =============================
    // Vertical Alignment
    // =============================

    'vertical': { "vertical-align": "VerticalAlignmentRule" },

    // =============================
    // Hyphens
    // =============================

    'hyphens': { "hyphens": "HyphensRule" },

    // =============================
    // Background Attachment
    // =============================

    'bg-attach': { "background-attachment": "BackgroundAttachmentRule" },

    // =============================
    // Background Clip
    // =============================

    'bg-clip': { "background-clip": "BackgroundClipRule" },

     // =============================
    // Background Origin
    // =============================

    'bg-origin': { "background-origin": "BackgroundOriginRule" },

    // =============================
    // Outline
    // =============================

    outline: {
        "outline-color": "ColorToken",
        "outline-width": "SpacingToken",
        "outline-style": "BorderStyleRule",
        "outline-offset": "OffsetRule",
        "border-radius": "RoundRule",
    },

    // =============================
    // Shadow
    // =============================

    'shadow': { "box-shadow": "ShadowToken",
                "text-shadow": "TextShadowToken"
     },

     // =============================
    // Gradient
    // =============================

    'gradient': { "background": "GradientToken" },

    // =============================
    // Transition
    // =============================

    'transition': { "transition": "TransitionToken" },

    // =============================
    // Patterns
    // =============================

    'pattern': { "background": "PatternToken",
                "background-color": "PatternBackRule",
                "color": "PatternForeRule",
     },

     'contain':{},



    // Allow User Overrides and Extensions
    ...relationships

};
