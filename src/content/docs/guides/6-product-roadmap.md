---
title: "Product Roadmap"
description: "Explore planned features, selector support, and the evolving nature of Elevate CSS."
---

Elevate CSS is actively evolving to adapt to the needs of the design and development community. It is an early, experimental framework, and community feedback, contributions, and insights are warmly welcomed.

<details>
<summary><strong>Planned Features</strong></summary>

- Static analysis and compile-time guarantees  
- IDE integration for syntax highlighting and autocomplete (potentially via LSP)  
- Child selector support  
- Expanded grid support with expressive syntax  
- Container query support  
- Logical property support for internationalization  
- Accessibility-focused utilities (e.g., `hidden:visually`, ARIA helpers)  
- Advanced selector composition (sibling selectors, combinators, pseudo-classes)  
- Open to community suggestions!

</details>

---

<details>
<summary><strong>Selector Support</strong></summary>

| **Selector Type**              | **Examples**                                   | **Description**                                                             | **Support** |
|--------------------------------|-----------------------------------------------|-----------------------------------------------------------------------------|------------|
| **State Selectors**            | `:hover`, `:focus`, `:active`, `:visited`     | Styles elements based on user interactions.                                 | ✅          |
|                                | `:disabled`                                   | Applies styles to disabled elements.                                        | ✅          |
| **Structural Pseudo-classes**  | `:first-child`, `:last-child`, `:only-child`  | Targets elements based on their structural position within the DOM.         | ✅          |
|                                | `:empty`                                      | Matches elements with no children or content.                               | ✅          |
|                                | `:nth-child(n)`, `:nth-of-type(n)`            | Targets elements based on their position among siblings.                    | ❌          |
|                                | `:has()`                                      | Matches parents that contain specific children.                             | ❌          |
| **Form and Input States**      | `:checked`, `:required`, `:optional`          | Targets form inputs based on validation or attribute states.                | ✅          |
|                                | `:valid`, `:invalid`                          | Applies styles to valid or invalid form fields.                             | ✅          |
|                                | `:in-range`, `:out-of-range`                  | Matches inputs within or outside a specified range.                         | ✅          |
| **Pseudo-elements**            | `::before`, `::after`                         | Inserts content before or after an element's content.                       | ✅          |
|                                | `::first-letter`, `::first-line`              | Styles the first letter or line of an element's content.                    | ✅          |
|                                | `::placeholder`, `::selection`                | Applies styles to placeholder or selected text.                             | ✅          |
| **Attribute Selectors**        | `[attr=value]`, `[attr^=value]`               | Matches elements based on attribute values (exact, prefix, suffix).         | ❌          |
|                                | `[attr*=value]`, `[attr~=value]`              | Matches elements where the attribute contains or is in a space-separated list. | ❌       |
| **Combinators**                | `>`, `+`, `~`                                 | Matches elements based on parent-child or sibling relationships.            | ❌          |
| **Group Selectors**            | `:is()`, `:where()`                           | Matches elements using a list of selectors.                                 | ❌          |
| **Target and Logical States**  | `:target`                                     | Styles elements based on URL fragment targeting (e.g. `#section`).          | ❌          |
|                                | `:lang()`, `:dir()`                           | Matches elements based on language or text direction.                       | ❌          |
| **Universal Selectors**        | `*`                                           | Matches all elements.                                                       | ❌          |
| **Type Selectors**             | `div`, `p`, `span`                            | Matches all elements of a specific type.                                    | ❌          |
| **ID Selectors**               | `#id`                                         | Matches elements with a specific id.                                        | ❌          |
| **Class Selectors**            | `.class`                                      | Matches elements with a specific class.                                     | ❌          |
| **Descendant Selectors**       | `ancestor descendant`                         | Matches elements nested within an ancestor.                                 | ❌          |
| **Negation Selectors**         | `:not(selector)`                              | Matches elements that do not match a given selector.                        | ❌          |

</details>
