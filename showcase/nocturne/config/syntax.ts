//Import Rule Files
import { Brand } from "../rules/example-brandRules.js";
import { TypeRules } from "../rules/nocturne-rules.js";

//Spread Rules into Rules Object
export const rules = {
    ...Brand,
    ...TypeRules
};

//Define Custom Property and CSS Declaration Relationship
export const relationships = {
    numerals: { "font-variant-numeric": "NumeralRule" },
    "text-wrap": { "text-wrap": "TextWrapRule" },
    //Example Custom Property Definition
    brand: 
    { "background-color": "BrandBackgroundRule", 
      "color": "BrandCopyRule" },
};