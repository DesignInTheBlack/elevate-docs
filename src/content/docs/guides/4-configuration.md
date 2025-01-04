---
title: "Configuration"
description: "Discover how to configure Elevate CSS for your specific needs."
---

Elevate is designed with a powerful, flexible configuration system that allows deep customization while maintaining strict design system integrity. With great power, however, comes great responsibility. Take time to thoroughly review and align the configuration options with your project's specific design requirements and architectural goals.

---

## § Configuration


<br>

### ¶ Basic Configuration

Configure Elevate's general settings in `elevate/config/elevate.ts`:

```typescript
// elevate/config/elevate.ts
const options = {
    Watch:'./',                // Directory to watch for changes
    FileTypes: ['html', 'jsx', 'tsx', 'astro'], // File extensions to scan
    Output:'./'                // Output directory for generated CSS
}

export const config = options
```

<br>

Import and distribute design system tokens in `elevate/config/design.ts`

```typescript
//elevate/config/design.ts
//Design System Token Imports 

//Elevate Utility Imports
import { heightUtility } from "../core/system/etc/height.js";

//Example Custom Values Import
import { BrandColors } from "../design/example-brandTokens.js";

//System Standard Imports
import { colors } from "../core/system/design/colors.js";
import { spacing } from "../core/system/design/spacing.js";
import { typography } from "../core/system/design/typography.js";
import { breakpoints } from '../core/system/design/breakpoints.js';

//Token Definitions
export const designSystem = {
    ColorToken: colors,
    BreakPointToken: breakpoints,
    SpacingToken: {...spacing,...heightUtility},
    FontSizeToken: typography.size,
    FontFamilyToken: typography.family,
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
    FontWeightToken: typography.weight,

    //Spread Custom Token Categories
    ...BrandColors
};
```

<br>

Import and distribute syntax rule mappings in `elevate/config/syntax.ts`

```typescript
//elevate/config/syntax.ts

//Import Rule Files
import { Brand } from "../rules/example-brandRules.js";

//Spread Rules into Rules Object
export const rules = {
    ...Brand
};

//Define Custom Property and CSS Declaration Relationship
export const relationships = {
    //Example Custom Property Definition
    brand: 
    { "background-color": "BrandBackgroundRule", 
      "color": "BrandCopyRule" },
};
```

<br>

### ¶ Going Deeper: A Comprehensive Guide

Elevate is designed to be extensible and adaptable, allowing you to easily integrate your design system or add new features and functionality that help you embody your design system in a way that is both consistent and maintainable within your codebase.



<br>

## Flow Overview

<ol>
  <!-- 1. Starting Point (I) -->
  <li>
    <strong>Starting Point (I)</strong><br />
    There are two primary ways to extend Elevate CSs:
    <ul>
      <li>Integrate Design System Tokens</li>
      <li>Expand Upon Elevate's Syntax</li>
    </ul>
  </li>

  <!-- 2. Integrate Design System Tokens -->
  <li>
    <strong>Integrate Design System Tokens</strong>
    <ol>
      <li>Create token files in <code>elevate/design</code>.</li>
      <li>
        Decide if you need to maintain compatibility with existing Elevate properties:
        <ul>
          <li>
            <strong>Yes:</strong> Spread token objects into existing categories in 
            <code>config/design.ts</code>.
          </li>
          <li>
            <strong>No:</strong> Define new token categories in 
            <code>config/design.ts</code>.
          </li>
        </ul>
      </li>
    </ol>
  </li>

  <!-- 3. Expand Upon Elevate's Syntax -->
  <li>
    <strong>Expand Upon Elevate's Syntax</strong>
    <ol>
      <li>Create new rule files in <code>elevate/rules</code>.</li>
      <li>Import and spread new rules in the rules object in <code>config/syntax.ts</code>.</li>
      <li>
        Define a new property and establish token, rule, and declaration relationships 
        in the <code>relationships</code> object in <code>config/syntax.ts</code>.
      </li>
    </ol>
  </li>
</ol>

<br>

#### Design System Integration

If your goal is to simply integrate your design system tokens into elevate, you can follow these steps:

<br>

1. Add new categorized design tokens to the `elevate/design` directory in alignment with your design system and preferred organization.

```
//example-brandTokens.ts
export const BrandColors = {

    //Define New Token Categories

    BrandBackgroundTokens: {
    'popgreen':'#39FF14'
    },

    BrandCopyTokens: {
    'popwhite': '#FFFFFF',
    }

} 

```

<br>

2. Import the new token categories into `elevate/config/design.ts`. 

```
//elevate/config/design.ts

//Importing Our New Token Categories
import { BrandColors } from "../design/example-brandTokens.js";

```

<br>

3. Spread the new token categories into the appropriate token definition for compatability with Elevate's existing syntax.

```
//elevate/config/design.ts
//Token Definitions
export const designSystem = {
   ColorToken: { ...colors, ...BrandColors.BrandBackgroundTokens, ...BrandColors.BrandCopyTokens },
};
```

<br>

You can now utilize these new tokens in your utility strings as you would with any of the existing elevate tokens.

<br>

#### Extending Elevate's Syntax

As you integrate your design system, you may want to create product specific or use case specific syntax rules to better express your design system in your codebase and care has been taken to afford this feature. However, while this is a powerful affordance, it's important to do so with care and consideration. To begin, follow these steps:

<br>

1. Create a new file in the `elevate/rules` directory.

<br>

**※ Rule Files and Modifier Syntax**  

When creating a new rule file, it is important to remember that you are defining the syntax of the **modifier** and **not the property**. In the case below, we're specifying that for our new example property (brand), we want to add new modifier syntax rules and we're articulating how those modifiers should be written as well as the types of design system tokens they will expect. 

<br>

```
//example-brandRules.ts
export const Brand = {

    BrandBackgroundRule: {
    "bg-": "BrandBackgroundToken"
    },

    BrandCopyRule: {
    "copy-": "BrandTextToken"
    }

    //Specifying New Modifier Syntax and Expected Design System Token Types

}

```
<br>

2. Import the new rule file into `elevate/config/syntax.ts` and spread it into the rules object.

```
//elevate/config/syntax.ts

//Import Rule Files
import { Brand } from "../rules/example-brandRules.js";

//Spread Rules into Rules Object
export const rules = {
    ...Brand
};
```
<br>

3. Define a new property in the relationships object

```
//elevate/config/syntax.ts
//Define Custom Property and CSS Declaration Relationship
export const relationships = {
    //Example Custom Property Definition
    brand: 
    { "background-color": "BrandBackgroundRule", 
      "color": "BrandCopyRule" },
};

```
<br>

4. Test your new property in your utility strings within an appropriate filetype
```html

<div class="brand:bg-popgreen:copy-popwhite"></div>

```


<br>


### ¶ Special Tokens

 Elevate includes a number of "helper" token types that provide additional capabilities beyond the core functionality for specific situations. These can be used to extend the framework's capabilities, but they should be used with caution. 

 <br>

   **Pass-Through Tokens**  
   - Unrestricted value entry.  
   - No build-time validation, for dynamic or flexible values.
   - Primarily used for CSS rules that require special syntax (e.g., URLs or complex values).
   - Not recommended for general styling.
   <br>

   **Example:**

   ```typescript
   // declationMap.ts
   rotate: {
     "rotate": "PassThroughToken" // Allows any rotation value
   }
   ```

   ```html
   <div class="rotate:((90deg))"></div>
   ```
<br>

Please note that when using PassThroughToken, you must pass through the value in the same way that you would write it in CSS.
For example, preserving parentheses for values requiring them (e.g., URLs) or as above when passing number and unit combinations.

<br>

  **Numeric Tokens**  
   - For numeric values.  
   - Build-time validation ensures that the value is a valid number.
   - Primarily used for CSS rules that require numeric values.

   <br>

   **Example:**

   ```typescript
   //Elevate's declaration map, responsible for matching modifiers to CSS declarations for a given property.
   // =============================
    // Z-Index
    // =============================
    z: { "z-index": "NumericToken" }
   ```

   ```html
   <div class="z:20"></div>
   ```
<br>


**※ Token Collisions and How to Avoid Them**  


Out of the box, Elevate supports an order agnostic syntax structure. It doesn't matter where you place a given design token in a utility string, so long as the syntax is valid and the rule is defined correctly. It does so through a "first match wins" strategy whereby a modifier passed "slots" to the first CSS declaration that expects a token or rule of that type.


<br>


```typescript
    // Elevate's default text property
    text: {
        "font-size": "FontSizeToken",
        "color": "ColorToken",
        "font-family": "FontFamilyToken",
        "line-height": "LineHeightToken",
        "letter-spacing": "LetterSpacingToken",
        "text-align": "TextAlignRule",
        "max-width": "MeasureToken",
        "font-weight": "FontWeightToken",
        "text-transform": "TextTransformRule"
    }


    //You can write text:red:bold or text:bold:red and the order doesn't matter.

    //Note the distinction between "rules" and "tokens".

```


<br>


However, if you have two CSS declarations under a single property that share a common token type, you might run into something called a token collision and get unexpected results. A token collision is when two tokens passed through a utility string try to match to the same CSS declaration. To avoid this, you must create a new rule in `elevate/rules` to define an intermediary rule to allow the system to differentiate and then use that intermediary rule in the property as seen in the example above. 


<br>


#### Token and Rule Usage Guidelines


**Naming Conventions:**
- Use clear, semantic names
- Prefix with the token type or Rule Purpose (e.g., `BrandColorToken` or `TextAlignRule`)
- Avoid generic names that might cause collisions


**Performance Considerations:**
- Use rules for syntactic relatationships, expanding the syntax, or to avoid token collisions.
- Minimize the number of token types and rules as possible to limit complexity.




<br>


#### Helpful Tips


**Extension Considerations:**
- As you begin extending Elevate to fit your use case, consider the following:
  1. Design system tokens should always be defined in the design directory and you can spread them in the existing token categories in `elevate/config/design.ts` for maximum compatibility with the existing syntax.
  2. Examine the existing rules that allow Elevate to work out of the box by mapping token types to rules to CSS declarations in `core/system` to gain a greater understanding of how Elevate works.
  3. You can effectively create your own use case specific syntax for your project via these rules, but do so with care and consideration if you do. Elevate recommends using the existing rules and token types for maximum compatibility whenever possible.


<br>

#### Troubleshooting


**Common Issues:**
- If a token doesn’t map correctly, verify the following:
  1. The design token is properly **exported** in the token file.
  2. The design token is correctly **imported** and **configured** in `design.ts`.
  3. All relevant **rules** are updated for your use case and structured correctly in the files folder and `syntax.ts`.


<br>