//Design System Token Imports 

//Elevate Utility Imports
import { dimensionUtility } from "../core/system/etc/dimension.js";

//Example Custom Values Import
import { BrandColors } from "../design/example-brandTokens.js";
import { faces, sizes, nightColors, nightGradients } from "../design/nocturne.js";

//System Standard Imports
import { colors } from "../core/system/design/colors.js";
import { spacing } from "../core/system/design/spacing.js";
import { typography } from "../core/system/design/typography.js";
import { breakpoints } from '../core/system/design/breakpoints.js';
import { effects } from '../core/system/design/effects.js';

//Token Definitions
export const designSystem = {
    ColorToken: { ...colors, ...nightColors },
    BreakPointToken: breakpoints,
    SpacingToken: {...spacing,...dimensionUtility},
    FontSizeToken: { ...typography.size, ...sizes },
    FontFamilyToken: { ...typography.family, ...faces },
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
    MeasureToken: typography.measure,
    FontWeightToken: typography.weight,
    ShadowToken: effects.shadows,
    GradientToken: { ...effects.gradients, ...nightGradients },
    TextShadowToken: effects.textShadows,
    TransitionToken: effects.transitions,
    PatternToken: effects.backgrounds,

    //Spread Custom Token Categories
    ...BrandColors
};