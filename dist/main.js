(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["extension"] = factory();
	else
		root["extension"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
function layer(context, selectedLayer) {

    switch (selectedLayer.type) {
        case 'text':
            // Getting text information for one specific TextStyle
            var body = getTextElement(context, selectedLayer);

            return {
                code: `${body}`,
                language: "dart"
            };
            break;
        case 'shape':
            // Getting shape information
            var container = getContainer(context, selectedLayer);

            return {
                code: convertContainerToDart(container),
                language: 'dart'
            };
            break;

        case 'group':
            // Missing to implement, it will in future versions
            break;

        default:

    }
}

function colors(context) {
    // Mapping colors from context.project
    var body = convertColorsListToDart(context).join("\n");
    return {
        code: body,
        language: "dart"
    };
}

function textStyles(context) {
    // Mapping textStyles from context.project
    return {
        code: convertTextStylesListToDart(context).join("\n"),
        language: "dart"
    };
}

function exportColors(context) {
    // Exporting color to DART file
    var dartCode = `import 'package:flutter/material.dart';\n
${convertColorsListToDart(context).join("\n")}`;

    return {
        code: dartCode,
        filename: `${context.project.name}Colors.dart`,
        language: "dart"
    };
}

function exportTextStyles(context) {
    // Exporting textStyle to DART file
    var dartCode = `import 'package:flutter/material.dart';\n
${convertTextStylesListToDart(context).join("\n")}`;

    return {
        code: dartCode,
        filename: `${context.project.name}TextStyles.dart`,
        language: "dart"
    };
}

// function screen(context, selectedVersion, selectedScreen) {

// }

// function component(context, selectedVersion, selectedComponent) {

// }


// /**
//  * The following functions will be deprecated. Your extensions can export them to support old versions of Zeplin's macOS app.
//  * See Zeplin Extensions migration guide for details:
//  * https://zpl.io/shared-styleguides-extensions-migration-guide
//  */

// function styleguideColors(context, colors) {

// }

// function styleguideTextStyles(context, textStyles) {

// }

// function exportStyleguideColors(context, colors) {

// }

// function exportStyleguideTextStyles(context, textStyles) {

// }

// function comment(context, text) {

// }

function buildingBoxDecoration(context, layer) {
    // Getting a new decoration Box
    var decoration = new BoxDecoration();

    // Getting gradient 
    decoration.gradient = getGradient(context, layer);

    // Without gradient
    if (decoration.gradient == null) {
        // Without Gradient
        decoration.color = new Color(layer.fills[layer.fills.length - 1].color.toHex().r, layer.fills[layer.fills.length - 1].color.toHex().g, layer.fills[layer.fills.length - 1].color.toHex().b, layer.fills[layer.fills.length - 1].color.toHex().a);
    }
    // Getting Border
    decoration.border = getBorder(context, layer);

    // Assigning borderRadius
    if (layer.borderRadius != 0) {
        decoration.borderRadius = layer.borderRadius;
    }

    // Getting Shadows
    decoration.shadows = getShadows(context, layer.shadows);

    // Adding Opacity to the Layer
    decoration.opacity = layer.opacity;
    return decoration;
}

function getTextElement(context, layer) {
    var body;

    if (layer.textStyles.length > 1) {
        // List of TextSpans
        var textSpans = [];
        layer.textStyles.map(function (textSpan) {
            textSpans.push(new Text(layer.content.substring(textSpan.range.start, textSpan.range.end), new TextStyle(textSpan.textStyle.fontFamily, new Color(textSpan.textStyle.color.toHex().r, textSpan.textStyle.color.toHex().g, textSpan.textStyle.color.toHex().b, textSpan.textStyle.color.toHex().a), textSpan.textStyle.fontSize, textSpan.textStyle.fontWeight, textSpan.textStyle.fontStyle, textSpan.textStyle.letterSpacing, textSpan.textStyle.lineHeight, getShadows(context, layer.shadows))));
        });

        body = convertRichTextToDart(textSpans);
    } else if (layer.textStyles.length == 1) {
        body = convertTextToDart(new Text(layer.content, new TextStyle(layer.textStyles[0].textStyle.fontFamily, new Color(layer.textStyles[0].textStyle.color.toHex().r, layer.textStyles[0].textStyle.color.toHex().g, layer.textStyles[0].textStyle.color.toHex().b, layer.textStyles[0].textStyle.color.toHex().a), layer.textStyles[0].textStyle.fontSize, layer.textStyles[0].textStyle.fontWeight, layer.textStyles[0].textStyle.fontStyle, layer.textStyles[0].textStyle.letterSpacing, layer.textStyles[0].textStyle.lineHeight, getShadows(context, layer.shadows))));
    }

    return body;
}

function getContainer(context, layer) {
    var container = new Container(layer.rect.width, layer.rect.height);
    container.decoration = buildingBoxDecoration(context, layer);

    return container;
}

function getGradient(context, layer) {
    if (layerHasGradient(context, layer)) {
        // Building the Gradient
        return new Gradient(layer.fills[layer.fills.length - 1].gradient.type,
        // List of Colors
        layer.fills[layer.fills.length - 1].gradient.colorStops.map(function (colorMap) {
            return new Color(colorMap.color.toHex().r, colorMap.color.toHex().g, colorMap.color.toHex().b, colorMap.color.toHex().a);
        }),
        // List of Stops
        layer.fills[layer.fills.length - 1].gradient.colorStops.map(function (colorMap) {
            return colorMap.position;
        }), layer.fills[layer.fills.length - 1].gradient.angle);
    }
    return null;
}

function getBorder(context, layer) {

    // Adding Shadows to the Layer
    if (layer.borders.length > 0) {
        return new Border(new Color(layer.borders[layer.borders.length - 1].fill.color.toHex().r, layer.borders[layer.borders.length - 1].fill.color.toHex().g, layer.borders[layer.borders.length - 1].fill.color.toHex().b, layer.borders[layer.borders.length - 1].fill.color.toHex().a), layer.borders[layer.borders.length - 1].thickness);
    } else {
        return null;
    }
}

function getShadows(context, shadows) {
    // Adding Shadows to the Layer
    if (shadows.length > 0) {
        return shadows.map(function (shadow) {
            return new BoxShadow(new Color(shadow.color.toHex().r, shadow.color.toHex().g, shadow.color.toHex().b, shadow.color.toHex().a), shadow.offsetX, shadow.offsetY, shadow.blurRadius, shadow.spread);
        });
    } else {
        return null;
    }
}

// Converting the container model to dart code
function convertContainerToDart(container) {
    var decorationElements = [];

    if (container.decoration.color != null) {
        decorationElements.push(`color: ${convertColorToDart(container.decoration.color, container.decoration.opacity, false)}`);
    }
    if (container.decoration.border != null) {
        decorationElements.push(`border: ${convertBorderToDart(container.decoration.border)}`);
    }
    if (container.decoration.borderRadius != null) {
        decorationElements.push(`\t\tborderRadius: BorderRadius.circular(${container.decoration.borderRadius})`);
    }

    if (container.decoration.gradient != null) {
        decorationElements.push(`\t\tgradient: ${convertGradientToDart(container.decoration.gradient)}`);
    }

    if (container.decoration.shadows != null) {
        decorationElements.push(`\t\tboxShadow: ${convertShadowsToDart(container.decoration.shadows)}`);
    }
    return `new Container(
  width: ${container.width},
  height: ${container.height},
  decoration: new BoxDecoration(
    ${decorationElements.join(",\n")}
  )
)`;
}

function convertColorToDart(color, opacity, multipleColors) {

    var space;
    if (multipleColors) {
        space = "\n      ";
    } else {
        space = "";
    }
    if (opacity < 1) {
        return `${space}Color(0x${color.a}${color.r}${color.g}${color.b}).withOpacity(${opacity})`;
    }

    return `${space}Color(0x${color.a}${color.r}${color.g}${color.b})`;
}

function convertTextToDart(textSelected) {

    return `new Text("${textSelected.text}",
    style: ${convertTextStyleToDart(textSelected.textStyle)}
)`;
}

function convertTextSpanToDart(textSelected) {

    return `\n\tnew TextSpan(
    text: "${textSelected.text}",
    style: ${convertTextStyleToDart(textSelected.textStyle)}
    )`;
}

function convertTextStyleToDart(textStyle) {
    var shadowElements;
    var letterSpacingElement;

    // Evaluating if shadow exists
    if (textStyle.shadows != null) {
        shadowElements = `shadows: ${convertShadowsToDart(textStyle.shadows)}`;
    } else {
        shadowElements = "";
    }

    // Evaluating if shadow exists
    if (textStyle.letterSpacing != null) {
        letterSpacingElement = `letterSpacing:: ${textStyle.letterSpacing},`;
    } else {
        letterSpacingElement = "";
    }

    return `TextStyle(
    fontFamily: '${textStyle.fontFamily}',
    color: ${convertColorToDart(textStyle.color, 1, false)},
    fontSize: ${textStyle.fontSize},
    fontWeight: FontWeight.w${textStyle.fontWeight},
    fontStyle: FontStyle.${textStyle.fontStyle},
    ${letterSpacingElement}
    ${shadowElements}
    )`;
}

function convertGradientToDart(gradient) {
    if (gradient.type === 'linear') {
        return `LinearGradient(colors: [${gradient.colors.map(function (colorHex) {
            return convertColorToDart(colorHex, 1, true);
        })} ],
    stops: [
        ${gradient.stops.join(",\n\t\t\t\t")}
    ]
    )`;
    }

    return `Color(0x${color.a}${color.r}${color.g}${color.b})`;
}

function convertShadowsToDart(shadows) {

    return `[${shadows.map(function (shadow) {
        return convertBoxShadowToDart(shadow);
    })} ],
`;
}

function convertBoxShadowToDart(shadow) {
    return `BoxShadow(
        color: ${convertColorToDart(shadow.color, 1, false)},
        offset: Offset(${shadow.offsetx},${shadow.offsety}),
        blurRadius: ${shadow.blurRadius},
        spreadRadius: ${shadow.spreadRadius}

    )`;
}

function convertBorderToDart(border) {
    return `Border.all(
      color: ${convertColorToDart(border.color, 1, false)},
      width: ${border.width}
    )`;
}

function convertColorsListToDart(context) {
    colors = [];
    context.project.colors.map(function (colorMap) {
        colors.push(`const Color ${colorMap.name} = const ${convertColorToDart(new Color(colorMap.toHex().r, colorMap.toHex().g, colorMap.toHex().b, colorMap.toHex().a), 1, false)};`);
    });
    return colors;
}

function convertTextStylesListToDart(context) {
    textStyles = [];
    context.project.textStyles.map(function (textStyleMap) {
        textStyles.push(`const TextStyle ${textStyleMap.name.replace(/\s/g, '')} = const ${convertTextStyleToDart(new TextStyle(textStyleMap.fontFamily, new Color(textStyleMap.color.toHex().r, textStyleMap.color.toHex().g, textStyleMap.color.toHex().b, textStyleMap.color.toHex().a), textStyleMap.fontSize, textStyleMap.fontWeight, textStyleMap.fontStyle, textStyleMap.letterSpacing, textStyleMap.lineHeight, getShadows(context, [])))};`);
    });
    return textStyles;
}

function convertRichTextToDart(textSpans) {

    return `RichText(
    text: new TextSpan(
    children: [
    ${textSpans.map(function (textSpan) {
        return convertTextSpanToDart(textSpan);
    })},
    ]
  )
)`;
}

function BoxShadow(color, offsetx, offsety, blurRadius, spreadRadius) {
    this.color = color;
    this.offsetx = offsetx;
    this.offsety = offsety;
    this.blurRadius = blurRadius;
    this.spreadRadius = spreadRadius;
}

function Gradient(type, colors, stops, angle) {
    this.type = type;
    this.colors = colors;
    this.stops = stops;
    this.angle = angle;
}

// Border Flutter
function Border(color, width) {
    this.color = color;
    this.width = width;
}
// This is a function to model Color from DART object
function Color(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

// This is a function to model Shape as DART Container Flutter
function Container(width, height, decoration) {
    this.width = width;
    this.height = height;
    this.decoration = decoration;
}

// This is a function to model BoxDecoration in Flutter
function BoxDecoration(color, border, borderRadius, shadows, gradient, opacity) {
    this.color = color;
    this.border = border;
    this.borderRadius = borderRadius;
    this.shadows = shadows;
    this.gradient = gradient;
    this.opacity = opacity;
}

// This is a funtion to model Text in Flutter
function Text(text, textStyle) {
    this.text = text;
    this.textStyle = textStyle;
}

// This is a function to model TextStyle in Flutter
function TextStyle(fontFamily, color, fontSize, fontWeight, fontStyle, letterSpacing, height, shadows) {

    this.fontFamily = fontFamily;
    this.color = color;
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.fontStyle = fontStyle;
    this.letterSpacing = letterSpacing;
    this.height = height;
    this.shadows = shadows;
}

function layerHasGradient(context, layer) {
    return layer.fills.some(function (f) {
        return f.type === "gradient";
    });
}

exports.default = {
    layer,
    // screen,
    // component,
    colors,
    textStyles,
    exportColors,
    exportTextStyles
    // styleguideColors,
    // styleguideTextStyles,
    // exportStyleguideColors,
    // exportStyleguideTextStyles,
    // comment
};

/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBlMGUxZmI3ZGFjNjI1NGNhMmEzNSIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsibGF5ZXIiLCJjb250ZXh0Iiwic2VsZWN0ZWRMYXllciIsInR5cGUiLCJib2R5IiwiZ2V0VGV4dEVsZW1lbnQiLCJjb2RlIiwibGFuZ3VhZ2UiLCJjb250YWluZXIiLCJnZXRDb250YWluZXIiLCJjb252ZXJ0Q29udGFpbmVyVG9EYXJ0IiwiY29sb3JzIiwiY29udmVydENvbG9yc0xpc3RUb0RhcnQiLCJqb2luIiwidGV4dFN0eWxlcyIsImNvbnZlcnRUZXh0U3R5bGVzTGlzdFRvRGFydCIsImV4cG9ydENvbG9ycyIsImRhcnRDb2RlIiwiZmlsZW5hbWUiLCJwcm9qZWN0IiwibmFtZSIsImV4cG9ydFRleHRTdHlsZXMiLCJidWlsZGluZ0JveERlY29yYXRpb24iLCJkZWNvcmF0aW9uIiwiQm94RGVjb3JhdGlvbiIsImdyYWRpZW50IiwiZ2V0R3JhZGllbnQiLCJjb2xvciIsIkNvbG9yIiwiZmlsbHMiLCJsZW5ndGgiLCJ0b0hleCIsInIiLCJnIiwiYiIsImEiLCJib3JkZXIiLCJnZXRCb3JkZXIiLCJib3JkZXJSYWRpdXMiLCJzaGFkb3dzIiwiZ2V0U2hhZG93cyIsIm9wYWNpdHkiLCJ0ZXh0U3BhbnMiLCJtYXAiLCJwdXNoIiwiVGV4dCIsImNvbnRlbnQiLCJzdWJzdHJpbmciLCJ0ZXh0U3BhbiIsInJhbmdlIiwic3RhcnQiLCJlbmQiLCJUZXh0U3R5bGUiLCJ0ZXh0U3R5bGUiLCJmb250RmFtaWx5IiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwiZm9udFN0eWxlIiwibGV0dGVyU3BhY2luZyIsImxpbmVIZWlnaHQiLCJjb252ZXJ0UmljaFRleHRUb0RhcnQiLCJjb252ZXJ0VGV4dFRvRGFydCIsIkNvbnRhaW5lciIsInJlY3QiLCJ3aWR0aCIsImhlaWdodCIsImxheWVySGFzR3JhZGllbnQiLCJHcmFkaWVudCIsImNvbG9yU3RvcHMiLCJjb2xvck1hcCIsInBvc2l0aW9uIiwiYW5nbGUiLCJib3JkZXJzIiwiQm9yZGVyIiwiZmlsbCIsInRoaWNrbmVzcyIsIkJveFNoYWRvdyIsInNoYWRvdyIsIm9mZnNldFgiLCJvZmZzZXRZIiwiYmx1clJhZGl1cyIsInNwcmVhZCIsImRlY29yYXRpb25FbGVtZW50cyIsImNvbnZlcnRDb2xvclRvRGFydCIsImNvbnZlcnRCb3JkZXJUb0RhcnQiLCJjb252ZXJ0R3JhZGllbnRUb0RhcnQiLCJjb252ZXJ0U2hhZG93c1RvRGFydCIsIm11bHRpcGxlQ29sb3JzIiwic3BhY2UiLCJ0ZXh0U2VsZWN0ZWQiLCJ0ZXh0IiwiY29udmVydFRleHRTdHlsZVRvRGFydCIsImNvbnZlcnRUZXh0U3BhblRvRGFydCIsInNoYWRvd0VsZW1lbnRzIiwibGV0dGVyU3BhY2luZ0VsZW1lbnQiLCJjb2xvckhleCIsInN0b3BzIiwiY29udmVydEJveFNoYWRvd1RvRGFydCIsIm9mZnNldHgiLCJvZmZzZXR5Iiwic3ByZWFkUmFkaXVzIiwidGV4dFN0eWxlTWFwIiwicmVwbGFjZSIsInNvbWUiLCJmIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDN0RBLFNBQVNBLEtBQVQsQ0FBZUMsT0FBZixFQUF3QkMsYUFBeEIsRUFBdUM7O0FBRW5DLFlBQU9BLGNBQWNDLElBQXJCO0FBQ0ksYUFBSyxNQUFMO0FBQ0k7QUFDQSxnQkFBSUMsT0FBT0MsZUFBZUosT0FBZixFQUF3QkMsYUFBeEIsQ0FBWDs7QUFFQSxtQkFBTztBQUNISSxzQkFBTyxHQUFFRixJQUFLLEVBRFg7QUFFSEcsMEJBQVU7QUFGUCxhQUFQO0FBSUE7QUFDSixhQUFLLE9BQUw7QUFDSTtBQUNBLGdCQUFJQyxZQUFZQyxhQUFhUixPQUFiLEVBQXNCQyxhQUF0QixDQUFoQjs7QUFFQSxtQkFBTztBQUNISSxzQkFBTUksdUJBQXVCRixTQUF2QixDQURIO0FBRUhELDBCQUFVO0FBRlAsYUFBUDtBQUlBOztBQUVKLGFBQUssT0FBTDtBQUNJO0FBQ0E7O0FBRUo7O0FBeEJKO0FBNEJIOztBQUVELFNBQVNJLE1BQVQsQ0FBZ0JWLE9BQWhCLEVBQXlCO0FBQ3JCO0FBQ0EsUUFBSUcsT0FBT1Esd0JBQXdCWCxPQUF4QixFQUFpQ1ksSUFBakMsQ0FBc0MsSUFBdEMsQ0FBWDtBQUNBLFdBQU87QUFDSFAsY0FBTUYsSUFESDtBQUVIRyxrQkFBVTtBQUZQLEtBQVA7QUFLSDs7QUFFRCxTQUFTTyxVQUFULENBQW9CYixPQUFwQixFQUE2QjtBQUN6QjtBQUNBLFdBQU87QUFDSEssY0FBTVMsNEJBQTRCZCxPQUE1QixFQUFxQ1ksSUFBckMsQ0FBMEMsSUFBMUMsQ0FESDtBQUVITixrQkFBVTtBQUZQLEtBQVA7QUFJSDs7QUFFRCxTQUFTUyxZQUFULENBQXNCZixPQUF0QixFQUErQjtBQUMzQjtBQUNBLFFBQUlnQixXQUFZO0VBQ2xCTCx3QkFBd0JYLE9BQXhCLEVBQWlDWSxJQUFqQyxDQUFzQyxJQUF0QyxDQUE0QyxFQUQxQzs7QUFHQSxXQUFNO0FBQ0ZQLGNBQU1XLFFBREo7QUFFRkMsa0JBQVcsR0FBRWpCLFFBQVFrQixPQUFSLENBQWdCQyxJQUFLLGFBRmhDO0FBR0ZiLGtCQUFVO0FBSFIsS0FBTjtBQU1IOztBQUVELFNBQVNjLGdCQUFULENBQTBCcEIsT0FBMUIsRUFBbUM7QUFDL0I7QUFDQSxRQUFJZ0IsV0FBWTtFQUNsQkYsNEJBQTRCZCxPQUE1QixFQUFxQ1ksSUFBckMsQ0FBMEMsSUFBMUMsQ0FBZ0QsRUFEOUM7O0FBR0EsV0FBTTtBQUNGUCxjQUFNVyxRQURKO0FBRUZDLGtCQUFXLEdBQUVqQixRQUFRa0IsT0FBUixDQUFnQkMsSUFBSyxpQkFGaEM7QUFHRmIsa0JBQVU7QUFIUixLQUFOO0FBS0g7O0FBRUQ7O0FBRUE7O0FBRUE7O0FBRUE7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsU0FBU2UscUJBQVQsQ0FBK0JyQixPQUEvQixFQUF3Q0QsS0FBeEMsRUFBOEM7QUFDMUM7QUFDQSxRQUFJdUIsYUFBYSxJQUFJQyxhQUFKLEVBQWpCOztBQUVBO0FBQ0FELGVBQVdFLFFBQVgsR0FBc0JDLFlBQVl6QixPQUFaLEVBQXFCRCxLQUFyQixDQUF0Qjs7QUFFQTtBQUNBLFFBQUl1QixXQUFXRSxRQUFYLElBQXVCLElBQTNCLEVBQWdDO0FBQzVCO0FBQ0FGLG1CQUFXSSxLQUFYLEdBQW1CLElBQUlDLEtBQUosQ0FDZjVCLE1BQU02QixLQUFOLENBQVk3QixNQUFNNkIsS0FBTixDQUFZQyxNQUFaLEdBQW9CLENBQWhDLEVBQW1DSCxLQUFuQyxDQUF5Q0ksS0FBekMsR0FBaURDLENBRGxDLEVBRWZoQyxNQUFNNkIsS0FBTixDQUFZN0IsTUFBTTZCLEtBQU4sQ0FBWUMsTUFBWixHQUFvQixDQUFoQyxFQUFtQ0gsS0FBbkMsQ0FBeUNJLEtBQXpDLEdBQWlERSxDQUZsQyxFQUdmakMsTUFBTTZCLEtBQU4sQ0FBWTdCLE1BQU02QixLQUFOLENBQVlDLE1BQVosR0FBb0IsQ0FBaEMsRUFBbUNILEtBQW5DLENBQXlDSSxLQUF6QyxHQUFpREcsQ0FIbEMsRUFJZmxDLE1BQU02QixLQUFOLENBQVk3QixNQUFNNkIsS0FBTixDQUFZQyxNQUFaLEdBQW9CLENBQWhDLEVBQW1DSCxLQUFuQyxDQUF5Q0ksS0FBekMsR0FBaURJLENBSmxDLENBQW5CO0FBTUg7QUFDRDtBQUNBWixlQUFXYSxNQUFYLEdBQW9CQyxVQUFVcEMsT0FBVixFQUFtQkQsS0FBbkIsQ0FBcEI7O0FBRUE7QUFDQSxRQUFJQSxNQUFNc0MsWUFBTixJQUFzQixDQUExQixFQUNBO0FBQ0lmLG1CQUFXZSxZQUFYLEdBQTBCdEMsTUFBTXNDLFlBQWhDO0FBQ0g7O0FBRUQ7QUFDQWYsZUFBV2dCLE9BQVgsR0FBcUJDLFdBQVd2QyxPQUFYLEVBQW9CRCxNQUFNdUMsT0FBMUIsQ0FBckI7O0FBR0E7QUFDQWhCLGVBQVdrQixPQUFYLEdBQXFCekMsTUFBTXlDLE9BQTNCO0FBQ0EsV0FBT2xCLFVBQVA7QUFFSDs7QUFFRCxTQUFTbEIsY0FBVCxDQUF3QkosT0FBeEIsRUFBaUNELEtBQWpDLEVBQXVDO0FBQ25DLFFBQUlJLElBQUo7O0FBRUEsUUFBSUosTUFBTWMsVUFBTixDQUFpQmdCLE1BQWpCLEdBQTBCLENBQTlCLEVBQWdDO0FBQzVCO0FBQ0EsWUFBSVksWUFBWSxFQUFoQjtBQUNBMUMsY0FBTWMsVUFBTixDQUFpQjZCLEdBQWpCLENBQ0ksb0JBQVk7QUFDUkQsc0JBQVVFLElBQVYsQ0FDSSxJQUFJQyxJQUFKLENBQ0k3QyxNQUFNOEMsT0FBTixDQUFjQyxTQUFkLENBQXdCQyxTQUFTQyxLQUFULENBQWVDLEtBQXZDLEVBQThDRixTQUFTQyxLQUFULENBQWVFLEdBQTdELENBREosRUFFSSxJQUFJQyxTQUFKLENBQ0lKLFNBQVNLLFNBQVQsQ0FBbUJDLFVBRHZCLEVBRUksSUFBSTFCLEtBQUosQ0FDSW9CLFNBQVNLLFNBQVQsQ0FBbUIxQixLQUFuQixDQUF5QkksS0FBekIsR0FBaUNDLENBRHJDLEVBRUlnQixTQUFTSyxTQUFULENBQW1CMUIsS0FBbkIsQ0FBeUJJLEtBQXpCLEdBQWlDRSxDQUZyQyxFQUdJZSxTQUFTSyxTQUFULENBQW1CMUIsS0FBbkIsQ0FBeUJJLEtBQXpCLEdBQWlDRyxDQUhyQyxFQUlJYyxTQUFTSyxTQUFULENBQW1CMUIsS0FBbkIsQ0FBeUJJLEtBQXpCLEdBQWlDSSxDQUpyQyxDQUZKLEVBT0lhLFNBQVNLLFNBQVQsQ0FBbUJFLFFBUHZCLEVBUUlQLFNBQVNLLFNBQVQsQ0FBbUJHLFVBUnZCLEVBU0lSLFNBQVNLLFNBQVQsQ0FBbUJJLFNBVHZCLEVBVUlULFNBQVNLLFNBQVQsQ0FBbUJLLGFBVnZCLEVBV0lWLFNBQVNLLFNBQVQsQ0FBbUJNLFVBWHZCLEVBWUluQixXQUFXdkMsT0FBWCxFQUFvQkQsTUFBTXVDLE9BQTFCLENBWkosQ0FGSixDQURKO0FBbUJILFNBckJMOztBQXdCQW5DLGVBQU93RCxzQkFBc0JsQixTQUF0QixDQUFQO0FBRUgsS0E3QkQsTUE4QkssSUFBSTFDLE1BQU1jLFVBQU4sQ0FBaUJnQixNQUFqQixJQUEyQixDQUEvQixFQUNMO0FBQ0kxQixlQUFPeUQsa0JBQWtCLElBQUloQixJQUFKLENBQVM3QyxNQUFNOEMsT0FBZixFQUNyQixJQUFJTSxTQUFKLENBQ0lwRCxNQUFNYyxVQUFOLENBQWlCLENBQWpCLEVBQW9CdUMsU0FBcEIsQ0FBOEJDLFVBRGxDLEVBRUksSUFBSTFCLEtBQUosQ0FDSTVCLE1BQU1jLFVBQU4sQ0FBaUIsQ0FBakIsRUFBb0J1QyxTQUFwQixDQUE4QjFCLEtBQTlCLENBQW9DSSxLQUFwQyxHQUE0Q0MsQ0FEaEQsRUFFSWhDLE1BQU1jLFVBQU4sQ0FBaUIsQ0FBakIsRUFBb0J1QyxTQUFwQixDQUE4QjFCLEtBQTlCLENBQW9DSSxLQUFwQyxHQUE0Q0UsQ0FGaEQsRUFHSWpDLE1BQU1jLFVBQU4sQ0FBaUIsQ0FBakIsRUFBb0J1QyxTQUFwQixDQUE4QjFCLEtBQTlCLENBQW9DSSxLQUFwQyxHQUE0Q0csQ0FIaEQsRUFJSWxDLE1BQU1jLFVBQU4sQ0FBaUIsQ0FBakIsRUFBb0J1QyxTQUFwQixDQUE4QjFCLEtBQTlCLENBQW9DSSxLQUFwQyxHQUE0Q0ksQ0FKaEQsQ0FGSixFQU9JbkMsTUFBTWMsVUFBTixDQUFpQixDQUFqQixFQUFvQnVDLFNBQXBCLENBQThCRSxRQVBsQyxFQVFJdkQsTUFBTWMsVUFBTixDQUFpQixDQUFqQixFQUFvQnVDLFNBQXBCLENBQThCRyxVQVJsQyxFQVNJeEQsTUFBTWMsVUFBTixDQUFpQixDQUFqQixFQUFvQnVDLFNBQXBCLENBQThCSSxTQVRsQyxFQVVJekQsTUFBTWMsVUFBTixDQUFpQixDQUFqQixFQUFvQnVDLFNBQXBCLENBQThCSyxhQVZsQyxFQVdJMUQsTUFBTWMsVUFBTixDQUFpQixDQUFqQixFQUFvQnVDLFNBQXBCLENBQThCTSxVQVhsQyxFQVlJbkIsV0FBV3ZDLE9BQVgsRUFBb0JELE1BQU11QyxPQUExQixDQVpKLENBRHFCLENBQWxCLENBQVA7QUFpQkg7O0FBRUQsV0FBT25DLElBQVA7QUFDSDs7QUFFRCxTQUFTSyxZQUFULENBQXNCUixPQUF0QixFQUErQkQsS0FBL0IsRUFBcUM7QUFDakMsUUFBSVEsWUFBWSxJQUFJc0QsU0FBSixDQUFjOUQsTUFBTStELElBQU4sQ0FBV0MsS0FBekIsRUFBZ0NoRSxNQUFNK0QsSUFBTixDQUFXRSxNQUEzQyxDQUFoQjtBQUNBekQsY0FBVWUsVUFBVixHQUF1QkQsc0JBQXNCckIsT0FBdEIsRUFBK0JELEtBQS9CLENBQXZCOztBQUVBLFdBQU9RLFNBQVA7QUFFSDs7QUFHRCxTQUFTa0IsV0FBVCxDQUFxQnpCLE9BQXJCLEVBQThCRCxLQUE5QixFQUFvQztBQUNoQyxRQUFHa0UsaUJBQWlCakUsT0FBakIsRUFBMEJELEtBQTFCLENBQUgsRUFDQTtBQUNJO0FBQ0EsZUFBTyxJQUFJbUUsUUFBSixDQUNIbkUsTUFBTTZCLEtBQU4sQ0FBWTdCLE1BQU02QixLQUFOLENBQVlDLE1BQVosR0FBb0IsQ0FBaEMsRUFBbUNMLFFBQW5DLENBQTRDdEIsSUFEekM7QUFFSDtBQUNBSCxjQUFNNkIsS0FBTixDQUFZN0IsTUFBTTZCLEtBQU4sQ0FBWUMsTUFBWixHQUFvQixDQUFoQyxFQUFtQ0wsUUFBbkMsQ0FBNEMyQyxVQUE1QyxDQUF1RHpCLEdBQXZELENBQ0ksb0JBQVk7QUFDUixtQkFBTyxJQUFJZixLQUFKLENBQVV5QyxTQUFTMUMsS0FBVCxDQUFlSSxLQUFmLEdBQXVCQyxDQUFqQyxFQUFvQ3FDLFNBQVMxQyxLQUFULENBQWVJLEtBQWYsR0FBdUJFLENBQTNELEVBQTZEb0MsU0FBUzFDLEtBQVQsQ0FBZUksS0FBZixHQUF1QkcsQ0FBcEYsRUFBdUZtQyxTQUFTMUMsS0FBVCxDQUFlSSxLQUFmLEdBQXVCSSxDQUE5RyxDQUFQO0FBQ0gsU0FITCxDQUhHO0FBUUg7QUFDQW5DLGNBQU02QixLQUFOLENBQVk3QixNQUFNNkIsS0FBTixDQUFZQyxNQUFaLEdBQW9CLENBQWhDLEVBQW1DTCxRQUFuQyxDQUE0QzJDLFVBQTVDLENBQXVEekIsR0FBdkQsQ0FDSSxvQkFBWTtBQUNSLG1CQUFPMEIsU0FBU0MsUUFBaEI7QUFDSCxTQUhMLENBVEcsRUFjSHRFLE1BQU02QixLQUFOLENBQVk3QixNQUFNNkIsS0FBTixDQUFZQyxNQUFaLEdBQW9CLENBQWhDLEVBQW1DTCxRQUFuQyxDQUE0QzhDLEtBZHpDLENBQVA7QUFtQkg7QUFDRCxXQUFPLElBQVA7QUFFSDs7QUFFRCxTQUFTbEMsU0FBVCxDQUFtQnBDLE9BQW5CLEVBQTRCRCxLQUE1QixFQUFrQzs7QUFFOUI7QUFDQSxRQUFHQSxNQUFNd0UsT0FBTixDQUFjMUMsTUFBZCxHQUF1QixDQUExQixFQUE0QjtBQUN4QixlQUFPLElBQUkyQyxNQUFKLENBQ0gsSUFBSTdDLEtBQUosQ0FDSTVCLE1BQU13RSxPQUFOLENBQWN4RSxNQUFNd0UsT0FBTixDQUFjMUMsTUFBZCxHQUFzQixDQUFwQyxFQUF1QzRDLElBQXZDLENBQTRDL0MsS0FBNUMsQ0FBa0RJLEtBQWxELEdBQTBEQyxDQUQ5RCxFQUVJaEMsTUFBTXdFLE9BQU4sQ0FBY3hFLE1BQU13RSxPQUFOLENBQWMxQyxNQUFkLEdBQXNCLENBQXBDLEVBQXVDNEMsSUFBdkMsQ0FBNEMvQyxLQUE1QyxDQUFrREksS0FBbEQsR0FBMERFLENBRjlELEVBR0lqQyxNQUFNd0UsT0FBTixDQUFjeEUsTUFBTXdFLE9BQU4sQ0FBYzFDLE1BQWQsR0FBc0IsQ0FBcEMsRUFBdUM0QyxJQUF2QyxDQUE0Qy9DLEtBQTVDLENBQWtESSxLQUFsRCxHQUEwREcsQ0FIOUQsRUFJSWxDLE1BQU13RSxPQUFOLENBQWN4RSxNQUFNd0UsT0FBTixDQUFjMUMsTUFBZCxHQUFzQixDQUFwQyxFQUF1QzRDLElBQXZDLENBQTRDL0MsS0FBNUMsQ0FBa0RJLEtBQWxELEdBQTBESSxDQUo5RCxDQURHLEVBT0huQyxNQUFNd0UsT0FBTixDQUFjeEUsTUFBTXdFLE9BQU4sQ0FBYzFDLE1BQWQsR0FBc0IsQ0FBcEMsRUFBdUM2QyxTQVBwQyxDQUFQO0FBU0gsS0FWRCxNQVlJO0FBQ0EsZUFBTyxJQUFQO0FBQ0g7QUFFSjs7QUFFRCxTQUFTbkMsVUFBVCxDQUFvQnZDLE9BQXBCLEVBQTZCc0MsT0FBN0IsRUFBcUM7QUFDakM7QUFDQSxRQUFHQSxRQUFRVCxNQUFSLEdBQWlCLENBQXBCLEVBQXNCO0FBQ2xCLGVBQU9TLFFBQVFJLEdBQVIsQ0FBYSxrQkFBVTtBQUMxQixtQkFBTyxJQUFJaUMsU0FBSixDQUFjLElBQUloRCxLQUFKLENBQ2pCaUQsT0FBT2xELEtBQVAsQ0FBYUksS0FBYixHQUFxQkMsQ0FESixFQUNPNkMsT0FBT2xELEtBQVAsQ0FBYUksS0FBYixHQUFxQkUsQ0FENUIsRUFDOEI0QyxPQUFPbEQsS0FBUCxDQUFhSSxLQUFiLEdBQXFCRyxDQURuRCxFQUNzRDJDLE9BQU9sRCxLQUFQLENBQWFJLEtBQWIsR0FBcUJJLENBRDNFLENBQWQsRUFFSDBDLE9BQU9DLE9BRkosRUFHSEQsT0FBT0UsT0FISixFQUlIRixPQUFPRyxVQUpKLEVBS0hILE9BQU9JLE1BTEosQ0FBUDtBQU9DLFNBUkUsQ0FBUDtBQVVILEtBWEQsTUFhSTtBQUNBLGVBQU8sSUFBUDtBQUNIO0FBRUo7O0FBR0Q7QUFDQSxTQUFTdkUsc0JBQVQsQ0FBZ0NGLFNBQWhDLEVBQTBDO0FBQ3RDLFFBQUkwRSxxQkFBcUIsRUFBekI7O0FBRUEsUUFBSTFFLFVBQVVlLFVBQVYsQ0FBcUJJLEtBQXJCLElBQThCLElBQWxDLEVBQ0E7QUFDSXVELDJCQUFtQnRDLElBQW5CLENBQXlCLFVBQVN1QyxtQkFBbUIzRSxVQUFVZSxVQUFWLENBQXFCSSxLQUF4QyxFQUErQ25CLFVBQVVlLFVBQVYsQ0FBcUJrQixPQUFwRSxFQUE2RSxLQUE3RSxDQUFvRixFQUF0SDtBQUNIO0FBQ0QsUUFBSWpDLFVBQVVlLFVBQVYsQ0FBcUJhLE1BQXJCLElBQStCLElBQW5DLEVBQ0E7QUFDSThDLDJCQUFtQnRDLElBQW5CLENBQXlCLFdBQVV3QyxvQkFBb0I1RSxVQUFVZSxVQUFWLENBQXFCYSxNQUF6QyxDQUFpRCxFQUFwRjtBQUNIO0FBQ0QsUUFBSTVCLFVBQVVlLFVBQVYsQ0FBcUJlLFlBQXJCLElBQXFDLElBQXpDLEVBQ0E7QUFDSTRDLDJCQUFtQnRDLElBQW5CLENBQXlCLDJDQUEwQ3BDLFVBQVVlLFVBQVYsQ0FBcUJlLFlBQWEsR0FBckc7QUFDSDs7QUFFRCxRQUFJOUIsVUFBVWUsVUFBVixDQUFxQkUsUUFBckIsSUFBaUMsSUFBckMsRUFBMEM7QUFDdEN5RCwyQkFBbUJ0QyxJQUFuQixDQUF5QixpQkFBZ0J5QyxzQkFBc0I3RSxVQUFVZSxVQUFWLENBQXFCRSxRQUEzQyxDQUFxRCxFQUE5RjtBQUNIOztBQUVELFFBQUdqQixVQUFVZSxVQUFWLENBQXFCZ0IsT0FBckIsSUFBZ0MsSUFBbkMsRUFBd0M7QUFDcEMyQywyQkFBbUJ0QyxJQUFuQixDQUF5QixrQkFBaUIwQyxxQkFBcUI5RSxVQUFVZSxVQUFWLENBQXFCZ0IsT0FBMUMsQ0FBbUQsRUFBN0Y7QUFFSDtBQUNELFdBQVE7V0FDRC9CLFVBQVV3RCxLQUFNO1lBQ2Z4RCxVQUFVeUQsTUFBTzs7TUFFdkJpQixtQkFBbUJyRSxJQUFuQixDQUF3QixLQUF4QixDQUErQjs7RUFKakM7QUFPSDs7QUFFRCxTQUFTc0Usa0JBQVQsQ0FBNEJ4RCxLQUE1QixFQUFtQ2MsT0FBbkMsRUFBNEM4QyxjQUE1QyxFQUEyRDs7QUFFdkQsUUFBSUMsS0FBSjtBQUNBLFFBQUlELGNBQUosRUFBbUI7QUFDZkMsZ0JBQVMsVUFBVDtBQUNILEtBRkQsTUFHSTtBQUNBQSxnQkFBTyxFQUFQO0FBQ0g7QUFDRCxRQUFJL0MsVUFBVSxDQUFkLEVBQWdCO0FBQ1osZUFBUSxHQUFFK0MsS0FBTSxXQUFVN0QsTUFBTVEsQ0FBRSxHQUFFUixNQUFNSyxDQUFFLEdBQUVMLE1BQU1NLENBQUUsR0FBRU4sTUFBTU8sQ0FBRSxpQkFBZ0JPLE9BQVEsR0FBeEY7QUFDSDs7QUFFRCxXQUFRLEdBQUUrQyxLQUFNLFdBQVU3RCxNQUFNUSxDQUFFLEdBQUVSLE1BQU1LLENBQUUsR0FBRUwsTUFBTU0sQ0FBRSxHQUFFTixNQUFNTyxDQUFFLEdBQWhFO0FBRUg7O0FBRUQsU0FBUzJCLGlCQUFULENBQTJCNEIsWUFBM0IsRUFBd0M7O0FBRXBDLFdBQVEsYUFBWUEsYUFBYUMsSUFBSzthQUM3QkMsdUJBQXVCRixhQUFhcEMsU0FBcEMsQ0FBK0M7RUFEeEQ7QUFJSDs7QUFFRCxTQUFTdUMscUJBQVQsQ0FBK0JILFlBQS9CLEVBQTRDOztBQUV4QyxXQUFRO2FBQ0NBLGFBQWFDLElBQUs7YUFDbEJDLHVCQUF1QkYsYUFBYXBDLFNBQXBDLENBQStDO01BRnhEO0FBS0g7O0FBRUQsU0FBU3NDLHNCQUFULENBQWdDdEMsU0FBaEMsRUFBMEM7QUFDdEMsUUFBSXdDLGNBQUo7QUFDQSxRQUFJQyxvQkFBSjs7QUFFQTtBQUNBLFFBQUl6QyxVQUFVZCxPQUFWLElBQXFCLElBQXpCLEVBQ0E7QUFDSXNELHlCQUFrQixZQUFXUCxxQkFBcUJqQyxVQUFVZCxPQUEvQixDQUF3QyxFQUFyRTtBQUNILEtBSEQsTUFJSTtBQUNBc0QseUJBQWlCLEVBQWpCO0FBQ0g7O0FBRUQ7QUFDQSxRQUFJeEMsVUFBVUssYUFBVixJQUEyQixJQUEvQixFQUNBO0FBQ0lvQywrQkFBd0IsbUJBQWtCekMsVUFBVUssYUFBYyxHQUFsRTtBQUNILEtBSEQsTUFJSTtBQUNBb0MsK0JBQXVCLEVBQXZCO0FBQ0g7O0FBRUQsV0FBUTttQkFDT3pDLFVBQVVDLFVBQVc7YUFDM0I2QixtQkFBbUI5QixVQUFVMUIsS0FBN0IsRUFBb0MsQ0FBcEMsRUFBdUMsS0FBdkMsQ0FBOEM7Z0JBQzNDMEIsVUFBVUUsUUFBUzs4QkFDTEYsVUFBVUcsVUFBVzsyQkFDeEJILFVBQVVJLFNBQVU7TUFDekNxQyxvQkFBcUI7TUFDckJELGNBQWU7TUFQakI7QUFVSDs7QUFFRCxTQUFTUixxQkFBVCxDQUErQjVELFFBQS9CLEVBQXdDO0FBQ3BDLFFBQUlBLFNBQVN0QixJQUFULEtBQWtCLFFBQXRCLEVBQStCO0FBQzNCLGVBQVEsMkJBQTBCc0IsU0FBU2QsTUFBVCxDQUFnQmdDLEdBQWhCLENBQzlCLG9CQUFZO0FBQ1IsbUJBQVF3QyxtQkFBbUJZLFFBQW5CLEVBQTRCLENBQTVCLEVBQStCLElBQS9CLENBQVI7QUFDSCxTQUg2QixDQUk1Qjs7VUFFSnRFLFNBQVN1RSxLQUFULENBQWVuRixJQUFmLENBQW9CLGFBQXBCLENBQW1DOztNQU5yQztBQVNIOztBQUVELFdBQVEsV0FBVWMsTUFBTVEsQ0FBRSxHQUFFUixNQUFNSyxDQUFFLEdBQUVMLE1BQU1NLENBQUUsR0FBRU4sTUFBTU8sQ0FBRSxHQUF4RDtBQUVIOztBQUVELFNBQVNvRCxvQkFBVCxDQUE4Qi9DLE9BQTlCLEVBQXNDOztBQUVsQyxXQUFRLElBQUdBLFFBQVFJLEdBQVIsQ0FDUCxrQkFBVTtBQUNOLGVBQVFzRCx1QkFBdUJwQixNQUF2QixDQUFSO0FBQ0gsS0FITSxDQUlMO0NBSk47QUFNSDs7QUFFRCxTQUFTb0Isc0JBQVQsQ0FBZ0NwQixNQUFoQyxFQUF1QztBQUNuQyxXQUFRO2lCQUNLTSxtQkFBbUJOLE9BQU9sRCxLQUExQixFQUFnQyxDQUFoQyxFQUFtQyxLQUFuQyxDQUEwQzt5QkFDbENrRCxPQUFPcUIsT0FBUSxJQUFHckIsT0FBT3NCLE9BQVE7c0JBQ3BDdEIsT0FBT0csVUFBVzt3QkFDaEJILE9BQU91QixZQUFhOztNQUp4QztBQVFIOztBQUVELFNBQVNoQixtQkFBVCxDQUE2QmhELE1BQTdCLEVBQW9DO0FBQ2hDLFdBQVE7ZUFDRytDLG1CQUFtQi9DLE9BQU9ULEtBQTFCLEVBQWdDLENBQWhDLEVBQW1DLEtBQW5DLENBQTBDO2VBQzFDUyxPQUFPNEIsS0FBTTtNQUZ4QjtBQUtIOztBQUVELFNBQVNwRCx1QkFBVCxDQUFpQ1gsT0FBakMsRUFBeUM7QUFDckNVLGFBQVMsRUFBVDtBQUNBVixZQUFRa0IsT0FBUixDQUFnQlIsTUFBaEIsQ0FBdUJnQyxHQUF2QixDQUNJLG9CQUFZO0FBQ1JoQyxlQUFPaUMsSUFBUCxDQUFhLGVBQWN5QixTQUFTakQsSUFBSyxZQUFXK0QsbUJBQW1CLElBQUl2RCxLQUFKLENBQVV5QyxTQUFTdEMsS0FBVCxHQUFpQkMsQ0FBM0IsRUFBOEJxQyxTQUFTdEMsS0FBVCxHQUFpQkUsQ0FBL0MsRUFBaURvQyxTQUFTdEMsS0FBVCxHQUFpQkcsQ0FBbEUsRUFBcUVtQyxTQUFTdEMsS0FBVCxHQUFpQkksQ0FBdEYsQ0FBbkIsRUFBNkcsQ0FBN0csRUFBZ0gsS0FBaEgsQ0FBdUgsR0FBM0s7QUFFSCxLQUpMO0FBTUEsV0FBT3hCLE1BQVA7QUFDSDs7QUFFRCxTQUFTSSwyQkFBVCxDQUFxQ2QsT0FBckMsRUFBNkM7QUFDekNhLGlCQUFhLEVBQWI7QUFDQWIsWUFBUWtCLE9BQVIsQ0FBZ0JMLFVBQWhCLENBQTJCNkIsR0FBM0IsQ0FDSSx3QkFBZ0I7QUFDWjdCLG1CQUFXOEIsSUFBWCxDQUFpQixtQkFBa0J5RCxhQUFhakYsSUFBYixDQUFrQmtGLE9BQWxCLENBQTBCLEtBQTFCLEVBQWlDLEVBQWpDLENBQXFDLFlBQVdYLHVCQUMvRSxJQUFJdkMsU0FBSixDQUNJaUQsYUFBYS9DLFVBRGpCLEVBRUksSUFBSTFCLEtBQUosQ0FBVXlFLGFBQWExRSxLQUFiLENBQW1CSSxLQUFuQixHQUEyQkMsQ0FBckMsRUFBd0NxRSxhQUFhMUUsS0FBYixDQUFtQkksS0FBbkIsR0FBMkJFLENBQW5FLEVBQXFFb0UsYUFBYTFFLEtBQWIsQ0FBbUJJLEtBQW5CLEdBQTJCRyxDQUFoRyxFQUFtR21FLGFBQWExRSxLQUFiLENBQW1CSSxLQUFuQixHQUEyQkksQ0FBOUgsQ0FGSixFQUdJa0UsYUFBYTlDLFFBSGpCLEVBSUk4QyxhQUFhN0MsVUFKakIsRUFLSTZDLGFBQWE1QyxTQUxqQixFQU1JNEMsYUFBYTNDLGFBTmpCLEVBT0kyQyxhQUFhMUMsVUFQakIsRUFRSW5CLFdBQVd2QyxPQUFYLEVBQW9CLEVBQXBCLENBUkosQ0FEK0UsQ0FXN0UsR0FYTjtBQWFILEtBZkw7QUFpQkEsV0FBT2EsVUFBUDtBQUNIOztBQUdELFNBQVM4QyxxQkFBVCxDQUErQmxCLFNBQS9CLEVBQXlDOztBQUdyQyxXQUFROzs7TUFHTkEsVUFBVUMsR0FBVixDQUFlLG9CQUNiO0FBQUMsZUFBT2lELHNCQUFzQjVDLFFBQXRCLENBQVA7QUFBdUMsS0FEMUMsQ0FFSTs7O0VBTE47QUFTSDs7QUFFRCxTQUFTNEIsU0FBVCxDQUFtQmpELEtBQW5CLEVBQTBCdUUsT0FBMUIsRUFBbUNDLE9BQW5DLEVBQTRDbkIsVUFBNUMsRUFBd0RvQixZQUF4RCxFQUFxRTtBQUNqRSxTQUFLekUsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsU0FBS3VFLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUtuQixVQUFMLEdBQWtCQSxVQUFsQjtBQUNBLFNBQUtvQixZQUFMLEdBQW9CQSxZQUFwQjtBQUVIOztBQUVELFNBQVNqQyxRQUFULENBQWtCaEUsSUFBbEIsRUFBd0JRLE1BQXhCLEVBQWdDcUYsS0FBaEMsRUFBdUN6QixLQUF2QyxFQUE2QztBQUN6QyxTQUFLcEUsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS1EsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS3FGLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUt6QixLQUFMLEdBQWFBLEtBQWI7QUFDSDs7QUFFRDtBQUNBLFNBQVNFLE1BQVQsQ0FBZ0I5QyxLQUFoQixFQUF1QnFDLEtBQXZCLEVBQTZCO0FBQ3pCLFNBQUtyQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxTQUFLcUMsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7QUFDRDtBQUNBLFNBQVNwQyxLQUFULENBQWVJLENBQWYsRUFBaUJDLENBQWpCLEVBQW1CQyxDQUFuQixFQUFxQkMsQ0FBckIsRUFBdUI7QUFDbkIsU0FBS0gsQ0FBTCxHQUFTQSxDQUFUO0FBQ0EsU0FBS0MsQ0FBTCxHQUFTQSxDQUFUO0FBQ0EsU0FBS0MsQ0FBTCxHQUFTQSxDQUFUO0FBQ0EsU0FBS0MsQ0FBTCxHQUFTQSxDQUFUO0FBQ0g7O0FBRUQ7QUFDQSxTQUFTMkIsU0FBVCxDQUFtQkUsS0FBbkIsRUFBMEJDLE1BQTFCLEVBQWtDMUMsVUFBbEMsRUFBOEM7QUFDMUMsU0FBS3lDLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUtDLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUsxQyxVQUFMLEdBQWtCQSxVQUFsQjtBQUNIOztBQUVEO0FBQ0EsU0FBU0MsYUFBVCxDQUF1QkcsS0FBdkIsRUFBOEJTLE1BQTlCLEVBQXNDRSxZQUF0QyxFQUFvREMsT0FBcEQsRUFBNkRkLFFBQTdELEVBQXVFZ0IsT0FBdkUsRUFBK0U7QUFDM0UsU0FBS2QsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsU0FBS1MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0UsWUFBTCxHQUFvQkEsWUFBcEI7QUFDQSxTQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLZCxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFNBQUtnQixPQUFMLEdBQWVBLE9BQWY7QUFDSDs7QUFFRDtBQUNBLFNBQVNJLElBQVQsQ0FBYzZDLElBQWQsRUFBb0JyQyxTQUFwQixFQUE4QjtBQUMxQixTQUFLcUMsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS3JDLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0g7O0FBRUQ7QUFDQSxTQUFTRCxTQUFULENBQW1CRSxVQUFuQixFQUErQjNCLEtBQS9CLEVBQXNDNEIsUUFBdEMsRUFBZ0RDLFVBQWhELEVBQTREQyxTQUE1RCxFQUF1RUMsYUFBdkUsRUFBc0ZPLE1BQXRGLEVBQThGMUIsT0FBOUYsRUFBc0c7O0FBRWxHLFNBQUtlLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBSzNCLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUs0QixRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFNBQUtDLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxTQUFLQyxhQUFMLEdBQXFCQSxhQUFyQjtBQUNBLFNBQUtPLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUsxQixPQUFMLEdBQWVBLE9BQWY7QUFDSDs7QUFFRCxTQUFTMkIsZ0JBQVQsQ0FBMEJqRSxPQUExQixFQUFtQ0QsS0FBbkMsRUFBMEM7QUFDdEMsV0FBT0EsTUFBTTZCLEtBQU4sQ0FBWTBFLElBQVosQ0FBaUI7QUFBQSxlQUFLQyxFQUFFckcsSUFBRixLQUFXLFVBQWhCO0FBQUEsS0FBakIsQ0FBUDtBQUNIOztrQkFHYztBQUNYSCxTQURXO0FBRVg7QUFDQTtBQUNBVyxVQUpXO0FBS1hHLGNBTFc7QUFNWEUsZ0JBTlc7QUFPWEs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWlcsQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZXh0ZW5zaW9uXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImV4dGVuc2lvblwiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGUwZTFmYjdkYWM2MjU0Y2EyYTM1IiwiZnVuY3Rpb24gbGF5ZXIoY29udGV4dCwgc2VsZWN0ZWRMYXllcikge1xuXG4gICAgc3dpdGNoKHNlbGVjdGVkTGF5ZXIudHlwZSkge1xuICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgIC8vIEdldHRpbmcgdGV4dCBpbmZvcm1hdGlvbiBmb3Igb25lIHNwZWNpZmljIFRleHRTdHlsZVxuICAgICAgICAgICAgdmFyIGJvZHkgPSBnZXRUZXh0RWxlbWVudChjb250ZXh0LCBzZWxlY3RlZExheWVyKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBgJHtib2R5fWAsXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IFwiZGFydFwiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3NoYXBlJzpcbiAgICAgICAgICAgIC8vIEdldHRpbmcgc2hhcGUgaW5mb3JtYXRpb25cbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBnZXRDb250YWluZXIoY29udGV4dCwgc2VsZWN0ZWRMYXllcik7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29kZTogY29udmVydENvbnRhaW5lclRvRGFydChjb250YWluZXIpLFxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiAnZGFydCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2dyb3VwJzpcbiAgICAgICAgICAgIC8vIE1pc3NpbmcgdG8gaW1wbGVtZW50LCBpdCB3aWxsIGluIGZ1dHVyZSB2ZXJzaW9uc1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcblxuICAgICAgICAgICAgXG4gICAgICB9XG59XG5cbmZ1bmN0aW9uIGNvbG9ycyhjb250ZXh0KSB7XG4gICAgLy8gTWFwcGluZyBjb2xvcnMgZnJvbSBjb250ZXh0LnByb2plY3RcbiAgICB2YXIgYm9keSA9IGNvbnZlcnRDb2xvcnNMaXN0VG9EYXJ0KGNvbnRleHQpLmpvaW4oXCJcXG5cIik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogYm9keSxcbiAgICAgICAgbGFuZ3VhZ2U6IFwiZGFydFwiXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHRleHRTdHlsZXMoY29udGV4dCkge1xuICAgIC8vIE1hcHBpbmcgdGV4dFN0eWxlcyBmcm9tIGNvbnRleHQucHJvamVjdFxuICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IGNvbnZlcnRUZXh0U3R5bGVzTGlzdFRvRGFydChjb250ZXh0KS5qb2luKFwiXFxuXCIpLFxuICAgICAgICBsYW5ndWFnZTogXCJkYXJ0XCJcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGV4cG9ydENvbG9ycyhjb250ZXh0KSB7XG4gICAgLy8gRXhwb3J0aW5nIGNvbG9yIHRvIERBUlQgZmlsZVxuICAgIHZhciBkYXJ0Q29kZSA9IGBpbXBvcnQgJ3BhY2thZ2U6Zmx1dHRlci9tYXRlcmlhbC5kYXJ0JztcXG5cbiR7Y29udmVydENvbG9yc0xpc3RUb0RhcnQoY29udGV4dCkuam9pbihcIlxcblwiKX1gO1xuXG4gICAgcmV0dXJue1xuICAgICAgICBjb2RlOiBkYXJ0Q29kZSxcbiAgICAgICAgZmlsZW5hbWU6IGAke2NvbnRleHQucHJvamVjdC5uYW1lfUNvbG9ycy5kYXJ0YCxcbiAgICAgICAgbGFuZ3VhZ2U6IFwiZGFydFwiXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGV4cG9ydFRleHRTdHlsZXMoY29udGV4dCkge1xuICAgIC8vIEV4cG9ydGluZyB0ZXh0U3R5bGUgdG8gREFSVCBmaWxlXG4gICAgdmFyIGRhcnRDb2RlID0gYGltcG9ydCAncGFja2FnZTpmbHV0dGVyL21hdGVyaWFsLmRhcnQnO1xcblxuJHtjb252ZXJ0VGV4dFN0eWxlc0xpc3RUb0RhcnQoY29udGV4dCkuam9pbihcIlxcblwiKX1gO1xuXG4gICAgcmV0dXJue1xuICAgICAgICBjb2RlOiBkYXJ0Q29kZSxcbiAgICAgICAgZmlsZW5hbWU6IGAke2NvbnRleHQucHJvamVjdC5uYW1lfVRleHRTdHlsZXMuZGFydGAsXG4gICAgICAgIGxhbmd1YWdlOiBcImRhcnRcIlxuICAgIH1cbn1cblxuLy8gZnVuY3Rpb24gc2NyZWVuKGNvbnRleHQsIHNlbGVjdGVkVmVyc2lvbiwgc2VsZWN0ZWRTY3JlZW4pIHtcblxuLy8gfVxuXG4vLyBmdW5jdGlvbiBjb21wb25lbnQoY29udGV4dCwgc2VsZWN0ZWRWZXJzaW9uLCBzZWxlY3RlZENvbXBvbmVudCkge1xuXG4vLyB9XG5cblxuXG4vLyAvKipcbi8vICAqIFRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIHdpbGwgYmUgZGVwcmVjYXRlZC4gWW91ciBleHRlbnNpb25zIGNhbiBleHBvcnQgdGhlbSB0byBzdXBwb3J0IG9sZCB2ZXJzaW9ucyBvZiBaZXBsaW4ncyBtYWNPUyBhcHAuXG4vLyAgKiBTZWUgWmVwbGluIEV4dGVuc2lvbnMgbWlncmF0aW9uIGd1aWRlIGZvciBkZXRhaWxzOlxuLy8gICogaHR0cHM6Ly96cGwuaW8vc2hhcmVkLXN0eWxlZ3VpZGVzLWV4dGVuc2lvbnMtbWlncmF0aW9uLWd1aWRlXG4vLyAgKi9cblxuLy8gZnVuY3Rpb24gc3R5bGVndWlkZUNvbG9ycyhjb250ZXh0LCBjb2xvcnMpIHtcblxuLy8gfVxuXG4vLyBmdW5jdGlvbiBzdHlsZWd1aWRlVGV4dFN0eWxlcyhjb250ZXh0LCB0ZXh0U3R5bGVzKSB7XG5cbi8vIH1cblxuLy8gZnVuY3Rpb24gZXhwb3J0U3R5bGVndWlkZUNvbG9ycyhjb250ZXh0LCBjb2xvcnMpIHtcblxuLy8gfVxuXG4vLyBmdW5jdGlvbiBleHBvcnRTdHlsZWd1aWRlVGV4dFN0eWxlcyhjb250ZXh0LCB0ZXh0U3R5bGVzKSB7XG5cbi8vIH1cblxuLy8gZnVuY3Rpb24gY29tbWVudChjb250ZXh0LCB0ZXh0KSB7XG5cbi8vIH1cblxuZnVuY3Rpb24gYnVpbGRpbmdCb3hEZWNvcmF0aW9uKGNvbnRleHQsIGxheWVyKXtcbiAgICAvLyBHZXR0aW5nIGEgbmV3IGRlY29yYXRpb24gQm94XG4gICAgdmFyIGRlY29yYXRpb24gPSBuZXcgQm94RGVjb3JhdGlvbigpO1xuXG4gICAgLy8gR2V0dGluZyBncmFkaWVudCBcbiAgICBkZWNvcmF0aW9uLmdyYWRpZW50ID0gZ2V0R3JhZGllbnQoY29udGV4dCwgbGF5ZXIpO1xuXG4gICAgLy8gV2l0aG91dCBncmFkaWVudFxuICAgIGlmIChkZWNvcmF0aW9uLmdyYWRpZW50ID09IG51bGwpe1xuICAgICAgICAvLyBXaXRob3V0IEdyYWRpZW50XG4gICAgICAgIGRlY29yYXRpb24uY29sb3IgPSBuZXcgQ29sb3IoXG4gICAgICAgICAgICBsYXllci5maWxsc1tsYXllci5maWxscy5sZW5ndGggLTFdLmNvbG9yLnRvSGV4KCkuciwgXG4gICAgICAgICAgICBsYXllci5maWxsc1tsYXllci5maWxscy5sZW5ndGggLTFdLmNvbG9yLnRvSGV4KCkuZywgXG4gICAgICAgICAgICBsYXllci5maWxsc1tsYXllci5maWxscy5sZW5ndGggLTFdLmNvbG9yLnRvSGV4KCkuYixcbiAgICAgICAgICAgIGxheWVyLmZpbGxzW2xheWVyLmZpbGxzLmxlbmd0aCAtMV0uY29sb3IudG9IZXgoKS5hXG4gICAgICAgICk7XG4gICAgfVxuICAgIC8vIEdldHRpbmcgQm9yZGVyXG4gICAgZGVjb3JhdGlvbi5ib3JkZXIgPSBnZXRCb3JkZXIoY29udGV4dCwgbGF5ZXIpO1xuXG4gICAgLy8gQXNzaWduaW5nIGJvcmRlclJhZGl1c1xuICAgIGlmIChsYXllci5ib3JkZXJSYWRpdXMgIT0gMClcbiAgICB7XG4gICAgICAgIGRlY29yYXRpb24uYm9yZGVyUmFkaXVzID0gbGF5ZXIuYm9yZGVyUmFkaXVzO1xuICAgIH1cblxuICAgIC8vIEdldHRpbmcgU2hhZG93c1xuICAgIGRlY29yYXRpb24uc2hhZG93cyA9IGdldFNoYWRvd3MoY29udGV4dCwgbGF5ZXIuc2hhZG93cyk7XG5cblxuICAgIC8vIEFkZGluZyBPcGFjaXR5IHRvIHRoZSBMYXllclxuICAgIGRlY29yYXRpb24ub3BhY2l0eSA9IGxheWVyLm9wYWNpdHk7XG4gICAgcmV0dXJuIGRlY29yYXRpb247XG5cbn1cblxuZnVuY3Rpb24gZ2V0VGV4dEVsZW1lbnQoY29udGV4dCwgbGF5ZXIpe1xuICAgIHZhciBib2R5O1xuXG4gICAgaWYgKGxheWVyLnRleHRTdHlsZXMubGVuZ3RoID4gMSl7XG4gICAgICAgIC8vIExpc3Qgb2YgVGV4dFNwYW5zXG4gICAgICAgIHZhciB0ZXh0U3BhbnMgPSBbXTtcbiAgICAgICAgbGF5ZXIudGV4dFN0eWxlcy5tYXAoXG4gICAgICAgICAgICB0ZXh0U3BhbiA9PiB7XG4gICAgICAgICAgICAgICAgdGV4dFNwYW5zLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIG5ldyBUZXh0KFxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXIuY29udGVudC5zdWJzdHJpbmcodGV4dFNwYW4ucmFuZ2Uuc3RhcnQsIHRleHRTcGFuLnJhbmdlLmVuZCksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVGV4dFN0eWxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTcGFuLnRleHRTdHlsZS5mb250RmFtaWx5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBDb2xvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFNwYW4udGV4dFN0eWxlLmNvbG9yLnRvSGV4KCkuciwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTcGFuLnRleHRTdHlsZS5jb2xvci50b0hleCgpLmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTcGFuLnRleHRTdHlsZS5jb2xvci50b0hleCgpLmIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3Bhbi50ZXh0U3R5bGUuY29sb3IudG9IZXgoKS5hKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3Bhbi50ZXh0U3R5bGUuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFNwYW4udGV4dFN0eWxlLmZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFNwYW4udGV4dFN0eWxlLmZvbnRTdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3Bhbi50ZXh0U3R5bGUubGV0dGVyU3BhY2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3Bhbi50ZXh0U3R5bGUubGluZUhlaWdodCAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0U2hhZG93cyhjb250ZXh0LCBsYXllci5zaGFkb3dzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGJvZHkgPSBjb252ZXJ0UmljaFRleHRUb0RhcnQodGV4dFNwYW5zKTtcblxuICAgIH1cbiAgICBlbHNlIGlmIChsYXllci50ZXh0U3R5bGVzLmxlbmd0aCA9PSAxKVxuICAgIHtcbiAgICAgICAgYm9keSA9IGNvbnZlcnRUZXh0VG9EYXJ0KG5ldyBUZXh0KGxheWVyLmNvbnRlbnQsIFxuICAgICAgICAgICAgbmV3IFRleHRTdHlsZShcbiAgICAgICAgICAgICAgICBsYXllci50ZXh0U3R5bGVzWzBdLnRleHRTdHlsZS5mb250RmFtaWx5LFxuICAgICAgICAgICAgICAgIG5ldyBDb2xvcihcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIudGV4dFN0eWxlc1swXS50ZXh0U3R5bGUuY29sb3IudG9IZXgoKS5yLCBcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIudGV4dFN0eWxlc1swXS50ZXh0U3R5bGUuY29sb3IudG9IZXgoKS5nLFxuICAgICAgICAgICAgICAgICAgICBsYXllci50ZXh0U3R5bGVzWzBdLnRleHRTdHlsZS5jb2xvci50b0hleCgpLmIsIFxuICAgICAgICAgICAgICAgICAgICBsYXllci50ZXh0U3R5bGVzWzBdLnRleHRTdHlsZS5jb2xvci50b0hleCgpLmEpLFxuICAgICAgICAgICAgICAgIGxheWVyLnRleHRTdHlsZXNbMF0udGV4dFN0eWxlLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgIGxheWVyLnRleHRTdHlsZXNbMF0udGV4dFN0eWxlLmZvbnRXZWlnaHQsXG4gICAgICAgICAgICAgICAgbGF5ZXIudGV4dFN0eWxlc1swXS50ZXh0U3R5bGUuZm9udFN0eWxlLFxuICAgICAgICAgICAgICAgIGxheWVyLnRleHRTdHlsZXNbMF0udGV4dFN0eWxlLmxldHRlclNwYWNpbmcsXG4gICAgICAgICAgICAgICAgbGF5ZXIudGV4dFN0eWxlc1swXS50ZXh0U3R5bGUubGluZUhlaWdodCAsXG4gICAgICAgICAgICAgICAgZ2V0U2hhZG93cyhjb250ZXh0LCBsYXllci5zaGFkb3dzKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gYm9keTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29udGFpbmVyKGNvbnRleHQsIGxheWVyKXtcbiAgICB2YXIgY29udGFpbmVyID0gbmV3IENvbnRhaW5lcihsYXllci5yZWN0LndpZHRoLCBsYXllci5yZWN0LmhlaWdodCk7XG4gICAgY29udGFpbmVyLmRlY29yYXRpb24gPSBidWlsZGluZ0JveERlY29yYXRpb24oY29udGV4dCwgbGF5ZXIpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcblxufVxuXG5cbmZ1bmN0aW9uIGdldEdyYWRpZW50KGNvbnRleHQsIGxheWVyKXtcbiAgICBpZihsYXllckhhc0dyYWRpZW50KGNvbnRleHQsIGxheWVyKSlcbiAgICB7XG4gICAgICAgIC8vIEJ1aWxkaW5nIHRoZSBHcmFkaWVudFxuICAgICAgICByZXR1cm4gbmV3IEdyYWRpZW50KFxuICAgICAgICAgICAgbGF5ZXIuZmlsbHNbbGF5ZXIuZmlsbHMubGVuZ3RoIC0xXS5ncmFkaWVudC50eXBlLFxuICAgICAgICAgICAgLy8gTGlzdCBvZiBDb2xvcnNcbiAgICAgICAgICAgIGxheWVyLmZpbGxzW2xheWVyLmZpbGxzLmxlbmd0aCAtMV0uZ3JhZGllbnQuY29sb3JTdG9wcy5tYXAoXG4gICAgICAgICAgICAgICAgY29sb3JNYXAgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvbG9yKGNvbG9yTWFwLmNvbG9yLnRvSGV4KCkuciwgY29sb3JNYXAuY29sb3IudG9IZXgoKS5nLGNvbG9yTWFwLmNvbG9yLnRvSGV4KCkuYiwgY29sb3JNYXAuY29sb3IudG9IZXgoKS5hKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgLy8gTGlzdCBvZiBTdG9wc1xuICAgICAgICAgICAgbGF5ZXIuZmlsbHNbbGF5ZXIuZmlsbHMubGVuZ3RoIC0xXS5ncmFkaWVudC5jb2xvclN0b3BzLm1hcChcbiAgICAgICAgICAgICAgICBjb2xvck1hcCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xvck1hcC5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbGF5ZXIuZmlsbHNbbGF5ZXIuZmlsbHMubGVuZ3RoIC0xXS5ncmFkaWVudC5hbmdsZSxcblxuICAgICAgICApO1xuICAgICAgICBcblxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcblxufVxuXG5mdW5jdGlvbiBnZXRCb3JkZXIoY29udGV4dCwgbGF5ZXIpe1xuXG4gICAgLy8gQWRkaW5nIFNoYWRvd3MgdG8gdGhlIExheWVyXG4gICAgaWYobGF5ZXIuYm9yZGVycy5sZW5ndGggPiAwKXtcbiAgICAgICAgcmV0dXJuIG5ldyBCb3JkZXIoXG4gICAgICAgICAgICBuZXcgQ29sb3IoXG4gICAgICAgICAgICAgICAgbGF5ZXIuYm9yZGVyc1tsYXllci5ib3JkZXJzLmxlbmd0aCAtMV0uZmlsbC5jb2xvci50b0hleCgpLnIsIFxuICAgICAgICAgICAgICAgIGxheWVyLmJvcmRlcnNbbGF5ZXIuYm9yZGVycy5sZW5ndGggLTFdLmZpbGwuY29sb3IudG9IZXgoKS5nLFxuICAgICAgICAgICAgICAgIGxheWVyLmJvcmRlcnNbbGF5ZXIuYm9yZGVycy5sZW5ndGggLTFdLmZpbGwuY29sb3IudG9IZXgoKS5iLCBcbiAgICAgICAgICAgICAgICBsYXllci5ib3JkZXJzW2xheWVyLmJvcmRlcnMubGVuZ3RoIC0xXS5maWxsLmNvbG9yLnRvSGV4KCkuYVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGxheWVyLmJvcmRlcnNbbGF5ZXIuYm9yZGVycy5sZW5ndGggLTFdLnRoaWNrbmVzcyxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBlbHNle1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9IFxuXG59XG5cbmZ1bmN0aW9uIGdldFNoYWRvd3MoY29udGV4dCwgc2hhZG93cyl7XG4gICAgLy8gQWRkaW5nIFNoYWRvd3MgdG8gdGhlIExheWVyXG4gICAgaWYoc2hhZG93cy5sZW5ndGggPiAwKXtcbiAgICAgICAgcmV0dXJuIHNoYWRvd3MubWFwKCBzaGFkb3cgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb3hTaGFkb3cobmV3IENvbG9yKFxuICAgICAgICAgICAgICAgIHNoYWRvdy5jb2xvci50b0hleCgpLnIsIHNoYWRvdy5jb2xvci50b0hleCgpLmcsc2hhZG93LmNvbG9yLnRvSGV4KCkuYiwgc2hhZG93LmNvbG9yLnRvSGV4KCkuYSksXG4gICAgICAgICAgICAgICAgc2hhZG93Lm9mZnNldFgsXG4gICAgICAgICAgICAgICAgc2hhZG93Lm9mZnNldFksXG4gICAgICAgICAgICAgICAgc2hhZG93LmJsdXJSYWRpdXMsXG4gICAgICAgICAgICAgICAgc2hhZG93LnNwcmVhZFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZWxzZXtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9IFxuXG59XG5cblxuLy8gQ29udmVydGluZyB0aGUgY29udGFpbmVyIG1vZGVsIHRvIGRhcnQgY29kZVxuZnVuY3Rpb24gY29udmVydENvbnRhaW5lclRvRGFydChjb250YWluZXIpe1xuICAgIHZhciBkZWNvcmF0aW9uRWxlbWVudHMgPSBbXTtcblxuICAgIGlmIChjb250YWluZXIuZGVjb3JhdGlvbi5jb2xvciAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgZGVjb3JhdGlvbkVsZW1lbnRzLnB1c2goYGNvbG9yOiAke2NvbnZlcnRDb2xvclRvRGFydChjb250YWluZXIuZGVjb3JhdGlvbi5jb2xvciwgY29udGFpbmVyLmRlY29yYXRpb24ub3BhY2l0eSwgZmFsc2UpfWApO1xuICAgIH1cbiAgICBpZiAoY29udGFpbmVyLmRlY29yYXRpb24uYm9yZGVyICE9IG51bGwpXG4gICAge1xuICAgICAgICBkZWNvcmF0aW9uRWxlbWVudHMucHVzaChgYm9yZGVyOiAke2NvbnZlcnRCb3JkZXJUb0RhcnQoY29udGFpbmVyLmRlY29yYXRpb24uYm9yZGVyKX1gKTtcbiAgICB9XG4gICAgaWYgKGNvbnRhaW5lci5kZWNvcmF0aW9uLmJvcmRlclJhZGl1cyAhPSBudWxsKVxuICAgIHtcbiAgICAgICAgZGVjb3JhdGlvbkVsZW1lbnRzLnB1c2goYFxcdFxcdGJvcmRlclJhZGl1czogQm9yZGVyUmFkaXVzLmNpcmN1bGFyKCR7Y29udGFpbmVyLmRlY29yYXRpb24uYm9yZGVyUmFkaXVzfSlgKTtcbiAgICB9XG5cbiAgICBpZiAoY29udGFpbmVyLmRlY29yYXRpb24uZ3JhZGllbnQgIT0gbnVsbCl7XG4gICAgICAgIGRlY29yYXRpb25FbGVtZW50cy5wdXNoKGBcXHRcXHRncmFkaWVudDogJHtjb252ZXJ0R3JhZGllbnRUb0RhcnQoY29udGFpbmVyLmRlY29yYXRpb24uZ3JhZGllbnQpfWApO1xuICAgIH1cblxuICAgIGlmKGNvbnRhaW5lci5kZWNvcmF0aW9uLnNoYWRvd3MgIT0gbnVsbCl7XG4gICAgICAgIGRlY29yYXRpb25FbGVtZW50cy5wdXNoKGBcXHRcXHRib3hTaGFkb3c6ICR7Y29udmVydFNoYWRvd3NUb0RhcnQoY29udGFpbmVyLmRlY29yYXRpb24uc2hhZG93cyl9YCk7XG5cbiAgICB9XG4gICAgcmV0dXJuIGBuZXcgQ29udGFpbmVyKFxuICB3aWR0aDogJHtjb250YWluZXIud2lkdGh9LFxuICBoZWlnaHQ6ICR7Y29udGFpbmVyLmhlaWdodH0sXG4gIGRlY29yYXRpb246IG5ldyBCb3hEZWNvcmF0aW9uKFxuICAgICR7ZGVjb3JhdGlvbkVsZW1lbnRzLmpvaW4oXCIsXFxuXCIpfVxuICApXG4pYFxufVxuXG5mdW5jdGlvbiBjb252ZXJ0Q29sb3JUb0RhcnQoY29sb3IsIG9wYWNpdHksIG11bHRpcGxlQ29sb3JzKXtcblxuICAgIHZhciBzcGFjZTtcbiAgICBpZiAobXVsdGlwbGVDb2xvcnMpe1xuICAgICAgICBzcGFjZSA9ICBcIlxcbiAgICAgIFwiO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgICBzcGFjZT0gXCJcIjtcbiAgICB9XG4gICAgaWYgKG9wYWNpdHkgPCAxKXtcbiAgICAgICAgcmV0dXJuIGAke3NwYWNlfUNvbG9yKDB4JHtjb2xvci5hfSR7Y29sb3Iucn0ke2NvbG9yLmd9JHtjb2xvci5ifSkud2l0aE9wYWNpdHkoJHtvcGFjaXR5fSlgO1xuICAgIH1cblxuICAgIHJldHVybiBgJHtzcGFjZX1Db2xvcigweCR7Y29sb3IuYX0ke2NvbG9yLnJ9JHtjb2xvci5nfSR7Y29sb3IuYn0pYDtcblxufVxuXG5mdW5jdGlvbiBjb252ZXJ0VGV4dFRvRGFydCh0ZXh0U2VsZWN0ZWQpe1xuXG4gICAgcmV0dXJuIGBuZXcgVGV4dChcIiR7dGV4dFNlbGVjdGVkLnRleHR9XCIsXG4gICAgc3R5bGU6ICR7Y29udmVydFRleHRTdHlsZVRvRGFydCh0ZXh0U2VsZWN0ZWQudGV4dFN0eWxlKX1cbilgO1xuXG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRUZXh0U3BhblRvRGFydCh0ZXh0U2VsZWN0ZWQpe1xuXG4gICAgcmV0dXJuIGBcXG5cXHRuZXcgVGV4dFNwYW4oXG4gICAgdGV4dDogXCIke3RleHRTZWxlY3RlZC50ZXh0fVwiLFxuICAgIHN0eWxlOiAke2NvbnZlcnRUZXh0U3R5bGVUb0RhcnQodGV4dFNlbGVjdGVkLnRleHRTdHlsZSl9XG4gICAgKWA7XG5cbn1cblxuZnVuY3Rpb24gY29udmVydFRleHRTdHlsZVRvRGFydCh0ZXh0U3R5bGUpe1xuICAgIHZhciBzaGFkb3dFbGVtZW50cztcbiAgICB2YXIgbGV0dGVyU3BhY2luZ0VsZW1lbnQ7XG5cbiAgICAvLyBFdmFsdWF0aW5nIGlmIHNoYWRvdyBleGlzdHNcbiAgICBpZiAodGV4dFN0eWxlLnNoYWRvd3MgIT0gbnVsbClcbiAgICB7XG4gICAgICAgIHNoYWRvd0VsZW1lbnRzID0gYHNoYWRvd3M6ICR7Y29udmVydFNoYWRvd3NUb0RhcnQodGV4dFN0eWxlLnNoYWRvd3MpfWA7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgIHNoYWRvd0VsZW1lbnRzID0gXCJcIjtcbiAgICB9XG5cbiAgICAvLyBFdmFsdWF0aW5nIGlmIHNoYWRvdyBleGlzdHNcbiAgICBpZiAodGV4dFN0eWxlLmxldHRlclNwYWNpbmcgIT0gbnVsbClcbiAgICB7XG4gICAgICAgIGxldHRlclNwYWNpbmdFbGVtZW50ID0gYGxldHRlclNwYWNpbmc6OiAke3RleHRTdHlsZS5sZXR0ZXJTcGFjaW5nfSxgO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgICBsZXR0ZXJTcGFjaW5nRWxlbWVudCA9IFwiXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGBUZXh0U3R5bGUoXG4gICAgZm9udEZhbWlseTogJyR7dGV4dFN0eWxlLmZvbnRGYW1pbHl9JyxcbiAgICBjb2xvcjogJHtjb252ZXJ0Q29sb3JUb0RhcnQodGV4dFN0eWxlLmNvbG9yLCAxLCBmYWxzZSl9LFxuICAgIGZvbnRTaXplOiAke3RleHRTdHlsZS5mb250U2l6ZX0sXG4gICAgZm9udFdlaWdodDogRm9udFdlaWdodC53JHt0ZXh0U3R5bGUuZm9udFdlaWdodH0sXG4gICAgZm9udFN0eWxlOiBGb250U3R5bGUuJHt0ZXh0U3R5bGUuZm9udFN0eWxlfSxcbiAgICAke2xldHRlclNwYWNpbmdFbGVtZW50fVxuICAgICR7c2hhZG93RWxlbWVudHN9XG4gICAgKWA7XG5cbn1cblxuZnVuY3Rpb24gY29udmVydEdyYWRpZW50VG9EYXJ0KGdyYWRpZW50KXtcbiAgICBpZiAoZ3JhZGllbnQudHlwZSA9PT0gJ2xpbmVhcicpe1xuICAgICAgICByZXR1cm4gYExpbmVhckdyYWRpZW50KGNvbG9yczogWyR7Z3JhZGllbnQuY29sb3JzLm1hcChcbiAgICAgICAgICAgIGNvbG9ySGV4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIGNvbnZlcnRDb2xvclRvRGFydChjb2xvckhleCwxLCB0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKX0gXSxcbiAgICBzdG9wczogW1xuICAgICAgICAke2dyYWRpZW50LnN0b3BzLmpvaW4oXCIsXFxuXFx0XFx0XFx0XFx0XCIpfVxuICAgIF1cbiAgICApYDtcbiAgICB9XG5cbiAgICByZXR1cm4gYENvbG9yKDB4JHtjb2xvci5hfSR7Y29sb3Iucn0ke2NvbG9yLmd9JHtjb2xvci5ifSlgO1xuXG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRTaGFkb3dzVG9EYXJ0KHNoYWRvd3Mpe1xuXG4gICAgcmV0dXJuIGBbJHtzaGFkb3dzLm1hcChcbiAgICAgICAgc2hhZG93ID0+IHtcbiAgICAgICAgICAgIHJldHVybiAgY29udmVydEJveFNoYWRvd1RvRGFydChzaGFkb3cpXG4gICAgICAgIH1cbiAgICAgICAgKX0gXSxcbmA7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRCb3hTaGFkb3dUb0RhcnQoc2hhZG93KXtcbiAgICByZXR1cm4gYEJveFNoYWRvdyhcbiAgICAgICAgY29sb3I6ICR7Y29udmVydENvbG9yVG9EYXJ0KHNoYWRvdy5jb2xvciwxLCBmYWxzZSl9LFxuICAgICAgICBvZmZzZXQ6IE9mZnNldCgke3NoYWRvdy5vZmZzZXR4fSwke3NoYWRvdy5vZmZzZXR5fSksXG4gICAgICAgIGJsdXJSYWRpdXM6ICR7c2hhZG93LmJsdXJSYWRpdXN9LFxuICAgICAgICBzcHJlYWRSYWRpdXM6ICR7c2hhZG93LnNwcmVhZFJhZGl1c31cblxuICAgIClgO1xuICAgIFxufVxuXG5mdW5jdGlvbiBjb252ZXJ0Qm9yZGVyVG9EYXJ0KGJvcmRlcil7XG4gICAgcmV0dXJuIGBCb3JkZXIuYWxsKFxuICAgICAgY29sb3I6ICR7Y29udmVydENvbG9yVG9EYXJ0KGJvcmRlci5jb2xvciwxLCBmYWxzZSl9LFxuICAgICAgd2lkdGg6ICR7Ym9yZGVyLndpZHRofVxuICAgIClgO1xuICAgIFxufVxuXG5mdW5jdGlvbiBjb252ZXJ0Q29sb3JzTGlzdFRvRGFydChjb250ZXh0KXtcbiAgICBjb2xvcnMgPSBbXTtcbiAgICBjb250ZXh0LnByb2plY3QuY29sb3JzLm1hcChcbiAgICAgICAgY29sb3JNYXAgPT4ge1xuICAgICAgICAgICAgY29sb3JzLnB1c2goYGNvbnN0IENvbG9yICR7Y29sb3JNYXAubmFtZX0gPSBjb25zdCAke2NvbnZlcnRDb2xvclRvRGFydChuZXcgQ29sb3IoY29sb3JNYXAudG9IZXgoKS5yLCBjb2xvck1hcC50b0hleCgpLmcsY29sb3JNYXAudG9IZXgoKS5iLCBjb2xvck1hcC50b0hleCgpLmEpLCAxLCBmYWxzZSl9O2ApXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIGNvbG9ycztcbn1cblxuZnVuY3Rpb24gY29udmVydFRleHRTdHlsZXNMaXN0VG9EYXJ0KGNvbnRleHQpe1xuICAgIHRleHRTdHlsZXMgPSBbXTtcbiAgICBjb250ZXh0LnByb2plY3QudGV4dFN0eWxlcy5tYXAoXG4gICAgICAgIHRleHRTdHlsZU1hcCA9PiB7XG4gICAgICAgICAgICB0ZXh0U3R5bGVzLnB1c2goYGNvbnN0IFRleHRTdHlsZSAke3RleHRTdHlsZU1hcC5uYW1lLnJlcGxhY2UoL1xccy9nLCAnJyl9ID0gY29uc3QgJHtjb252ZXJ0VGV4dFN0eWxlVG9EYXJ0KFxuICAgICAgICAgICAgICAgIG5ldyBUZXh0U3R5bGUoXG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZU1hcC5mb250RmFtaWx5LFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29sb3IodGV4dFN0eWxlTWFwLmNvbG9yLnRvSGV4KCkuciwgdGV4dFN0eWxlTWFwLmNvbG9yLnRvSGV4KCkuZyx0ZXh0U3R5bGVNYXAuY29sb3IudG9IZXgoKS5iLCB0ZXh0U3R5bGVNYXAuY29sb3IudG9IZXgoKS5hKSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlTWFwLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGVNYXAuZm9udFdlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlTWFwLmZvbnRTdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlTWFwLmxldHRlclNwYWNpbmcsXG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZU1hcC5saW5lSGVpZ2h0ICxcbiAgICAgICAgICAgICAgICAgICAgZ2V0U2hhZG93cyhjb250ZXh0LCBbXSlcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICl9O2ApXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHRleHRTdHlsZXM7XG59XG5cblxuZnVuY3Rpb24gY29udmVydFJpY2hUZXh0VG9EYXJ0KHRleHRTcGFucyl7XG4gICAgXG5cbiAgICByZXR1cm4gYFJpY2hUZXh0KFxuICAgIHRleHQ6IG5ldyBUZXh0U3BhbihcbiAgICBjaGlsZHJlbjogW1xuICAgICR7dGV4dFNwYW5zLm1hcCggdGV4dFNwYW4gPT5cbiAgICAgICAge3JldHVybiBjb252ZXJ0VGV4dFNwYW5Ub0RhcnQodGV4dFNwYW4pfVxuICAgICAgICApfSxcbiAgICBdXG4gIClcbilgO1xufVxuXG5mdW5jdGlvbiBCb3hTaGFkb3coY29sb3IsIG9mZnNldHgsIG9mZnNldHksIGJsdXJSYWRpdXMsIHNwcmVhZFJhZGl1cyl7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMub2Zmc2V0eCA9IG9mZnNldHg7XG4gICAgdGhpcy5vZmZzZXR5ID0gb2Zmc2V0eTtcbiAgICB0aGlzLmJsdXJSYWRpdXMgPSBibHVyUmFkaXVzO1xuICAgIHRoaXMuc3ByZWFkUmFkaXVzID0gc3ByZWFkUmFkaXVzO1xuXG59XG5cbmZ1bmN0aW9uIEdyYWRpZW50KHR5cGUsIGNvbG9ycywgc3RvcHMsIGFuZ2xlKXtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMuY29sb3JzID0gY29sb3JzO1xuICAgIHRoaXMuc3RvcHMgPSBzdG9wcztcbiAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG59XG5cbi8vIEJvcmRlciBGbHV0dGVyXG5mdW5jdGlvbiBCb3JkZXIoY29sb3IsIHdpZHRoKXtcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xufVxuLy8gVGhpcyBpcyBhIGZ1bmN0aW9uIHRvIG1vZGVsIENvbG9yIGZyb20gREFSVCBvYmplY3RcbmZ1bmN0aW9uIENvbG9yKHIsZyxiLGEpe1xuICAgIHRoaXMuciA9IHI7XG4gICAgdGhpcy5nID0gZztcbiAgICB0aGlzLmIgPSBiO1xuICAgIHRoaXMuYSA9IGE7XG59XG5cbi8vIFRoaXMgaXMgYSBmdW5jdGlvbiB0byBtb2RlbCBTaGFwZSBhcyBEQVJUIENvbnRhaW5lciBGbHV0dGVyXG5mdW5jdGlvbiBDb250YWluZXIod2lkdGgsIGhlaWdodCwgZGVjb3JhdGlvbikge1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLmRlY29yYXRpb24gPSBkZWNvcmF0aW9uO1xufVxuXG4vLyBUaGlzIGlzIGEgZnVuY3Rpb24gdG8gbW9kZWwgQm94RGVjb3JhdGlvbiBpbiBGbHV0dGVyXG5mdW5jdGlvbiBCb3hEZWNvcmF0aW9uKGNvbG9yLCBib3JkZXIsIGJvcmRlclJhZGl1cywgc2hhZG93cywgZ3JhZGllbnQsIG9wYWNpdHkpe1xuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICB0aGlzLmJvcmRlciA9IGJvcmRlcjtcbiAgICB0aGlzLmJvcmRlclJhZGl1cyA9IGJvcmRlclJhZGl1cztcbiAgICB0aGlzLnNoYWRvd3MgPSBzaGFkb3dzO1xuICAgIHRoaXMuZ3JhZGllbnQgPSBncmFkaWVudDtcbiAgICB0aGlzLm9wYWNpdHkgPSBvcGFjaXR5O1xufVxuXG4vLyBUaGlzIGlzIGEgZnVudGlvbiB0byBtb2RlbCBUZXh0IGluIEZsdXR0ZXJcbmZ1bmN0aW9uIFRleHQodGV4dCwgdGV4dFN0eWxlKXtcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIHRoaXMudGV4dFN0eWxlID0gdGV4dFN0eWxlO1xufVxuXG4vLyBUaGlzIGlzIGEgZnVuY3Rpb24gdG8gbW9kZWwgVGV4dFN0eWxlIGluIEZsdXR0ZXJcbmZ1bmN0aW9uIFRleHRTdHlsZShmb250RmFtaWx5LCBjb2xvciwgZm9udFNpemUsIGZvbnRXZWlnaHQsIGZvbnRTdHlsZSwgbGV0dGVyU3BhY2luZywgaGVpZ2h0LCBzaGFkb3dzKXtcblxuICAgIHRoaXMuZm9udEZhbWlseSA9IGZvbnRGYW1pbHk7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMuZm9udFNpemUgPSBmb250U2l6ZTtcbiAgICB0aGlzLmZvbnRXZWlnaHQgPSBmb250V2VpZ2h0O1xuICAgIHRoaXMuZm9udFN0eWxlID0gZm9udFN0eWxlO1xuICAgIHRoaXMubGV0dGVyU3BhY2luZyA9IGxldHRlclNwYWNpbmc7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5zaGFkb3dzID0gc2hhZG93cztcbn1cblxuZnVuY3Rpb24gbGF5ZXJIYXNHcmFkaWVudChjb250ZXh0LCBsYXllcikge1xuICAgIHJldHVybiBsYXllci5maWxscy5zb21lKGYgPT4gZi50eXBlID09PSBcImdyYWRpZW50XCIpO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBsYXllcixcbiAgICAvLyBzY3JlZW4sXG4gICAgLy8gY29tcG9uZW50LFxuICAgIGNvbG9ycyxcbiAgICB0ZXh0U3R5bGVzLFxuICAgIGV4cG9ydENvbG9ycyxcbiAgICBleHBvcnRUZXh0U3R5bGVzLFxuICAgIC8vIHN0eWxlZ3VpZGVDb2xvcnMsXG4gICAgLy8gc3R5bGVndWlkZVRleHRTdHlsZXMsXG4gICAgLy8gZXhwb3J0U3R5bGVndWlkZUNvbG9ycyxcbiAgICAvLyBleHBvcnRTdHlsZWd1aWRlVGV4dFN0eWxlcyxcbiAgICAvLyBjb21tZW50XG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=