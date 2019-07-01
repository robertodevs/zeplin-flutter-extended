function layer(context, selectedLayer) {

    switch(selectedLayer.type) {
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
            }
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
    }

}

function textStyles(context) {
    // Mapping textStyles from context.project
    return {
        code: convertTextStylesListToDart(context).join("\n"),
        language: "dart"
    }
}

function exportColors(context) {
    // Exporting color to DART file
    var dartCode = `import 'package:flutter/material.dart';\n
${convertColorsListToDart(context).join("\n")}`;

    return{
        code: dartCode,
        filename: `${context.project.name}Colors.dart`,
        language: "dart"
    }

}

function exportTextStyles(context) {
    // Exporting textStyle to DART file
    var dartCode = `import 'package:flutter/material.dart';\n
${convertTextStylesListToDart(context).join("\n")}`;

    return{
        code: dartCode,
        filename: `${context.project.name}TextStyles.dart`,
        language: "dart"
    }
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


/*
The functions below are used for generate Flutter Widgets,
Container, BoxDecoration, Shadows, etc. 
*/

/**
 * 
 * @param {*} context 
 * @param {*} layer 
 */
function buildingBoxDecoration(context, layer){
    // Getting a new decoration Box
    var decoration = new BoxDecoration();

    // Getting gradient 
    decoration.gradient = getGradient(context, layer);

    // Without gradient
    if (decoration.gradient == null){
        // Without Gradient
        decoration.color = new Color(
            layer.fills[layer.fills.length -1].color.toHex().r, 
            layer.fills[layer.fills.length -1].color.toHex().g, 
            layer.fills[layer.fills.length -1].color.toHex().b,
            layer.fills[layer.fills.length -1].color.toHex().a
        );
    }
    // Getting Border
    decoration.border = getBorder(context, layer);

    // Assigning borderRadius
    if (layer.borderRadius != 0)
    {
        decoration.borderRadius = layer.borderRadius;
    }

    // Getting Shadows
    decoration.shadows = getShadows(context, layer.shadows);


    // Adding Opacity to the Layer
    decoration.opacity = layer.opacity;
    return decoration;

}

/**
 * 
 * @param {*} context 
 * @param {*} layer 
 */
function getTextElement(context, layer){
    var body;

    if (layer.textStyles.length > 1){
        // List of TextSpans
        var textSpans = [];
        layer.textStyles.map(
            textSpan => {
                textSpans.push(
                    new Text(
                        layer.content.substring(textSpan.range.start, textSpan.range.end),
                        new TextStyle(
                            textSpan.textStyle.fontFamily,
                            new Color(
                                textSpan.textStyle.color.toHex().r, 
                                textSpan.textStyle.color.toHex().g,
                                textSpan.textStyle.color.toHex().b, 
                                textSpan.textStyle.color.toHex().a),
                            textSpan.textStyle.fontSize,
                            textSpan.textStyle.fontWeight,
                            textSpan.textStyle.fontStyle,
                            textSpan.textStyle.letterSpacing,
                            textSpan.textStyle.lineHeight ,
                            getShadows(context, layer.shadows)
                            )
                        )
                    )
            }
        );

        body = convertRichTextToDart(textSpans);

    }
    else if (layer.textStyles.length == 1)
    {
        body = convertTextToDart(new Text(layer.content, 
            new TextStyle(
                layer.textStyles[0].textStyle.fontFamily,
                new Color(
                    layer.textStyles[0].textStyle.color.toHex().r, 
                    layer.textStyles[0].textStyle.color.toHex().g,
                    layer.textStyles[0].textStyle.color.toHex().b, 
                    layer.textStyles[0].textStyle.color.toHex().a),
                layer.textStyles[0].textStyle.fontSize,
                layer.textStyles[0].textStyle.fontWeight,
                layer.textStyles[0].textStyle.fontStyle,
                layer.textStyles[0].textStyle.letterSpacing,
                layer.textStyles[0].textStyle.lineHeight ,
                getShadows(context, layer.shadows)
                )
            )
        )
    }
    
    return body;
}

/**
 * 
 * @param {*} context 
 * @param {*} layer 
 */
function getContainer(context, layer){
    var container = new Container(layer.rect.width, layer.rect.height);
    container.decoration = buildingBoxDecoration(context, layer);

    return container;

}

/**
 * 
 * @param {*} context 
 * @param {*} layer 
 */
function getGradient(context, layer){
    if(layerHasGradient(context, layer))
    {
        // Building the Gradient
        return new Gradient(
            layer.fills[layer.fills.length -1].gradient.type,
            // List of Colors
            layer.fills[layer.fills.length -1].gradient.colorStops.map(
                colorMap => {
                    return new Color(colorMap.color.toHex().r, colorMap.color.toHex().g,colorMap.color.toHex().b, colorMap.color.toHex().a);
                }
            ),
            // List of Stops
            layer.fills[layer.fills.length -1].gradient.colorStops.map(
                colorMap => {
                    return colorMap.position;
                }
            ),
            layer.fills[layer.fills.length -1].gradient.angle,

        );
        

    }
    return null;

}
/**
 * 
 * @param {*} context 
 * @param {*} layer 
 */
function getBorder(context, layer){

    // Adding Shadows to the Layer
    if(layer.borders.length > 0){
        return new Border(
            new Color(
                layer.borders[layer.borders.length -1].fill.color.toHex().r, 
                layer.borders[layer.borders.length -1].fill.color.toHex().g,
                layer.borders[layer.borders.length -1].fill.color.toHex().b, 
                layer.borders[layer.borders.length -1].fill.color.toHex().a
            ),
            layer.borders[layer.borders.length -1].thickness,
        );
    }

    else{
        return null;
    } 

}

/**
 * 
 * @param {*} context 
 * @param {*} shadows 
 */
function getShadows(context, shadows){
    // Adding Shadows to the Layer
    if(shadows.length > 0){
        return shadows.map( shadow => {
            return new BoxShadow(new Color(
                shadow.color.toHex().r, shadow.color.toHex().g,shadow.color.toHex().b, shadow.color.toHex().a),
                shadow.offsetX,
                shadow.offsetY,
                shadow.blurRadius,
                shadow.spread
                );
            }
        );
    }

    else{
        return null
    } 

}


/*
The functions below are used for generate Flutter Widgets Objects to DART CODE,
*/

/**
 * 
 * @param {*} container 
 */
function convertContainerToDart(container){
    var decorationElements = [];

    if (container.decoration.color != null)
    {
        decorationElements.push(`color: ${convertColorToDart(container.decoration.color, container.decoration.opacity, false)}`);
    }
    if (container.decoration.border != null)
    {
        decorationElements.push(`border: ${convertBorderToDart(container.decoration.border)}`);
    }
    if (container.decoration.borderRadius != null)
    {
        decorationElements.push(`\t\tborderRadius: BorderRadius.circular(${container.decoration.borderRadius})`);
    }

    if (container.decoration.gradient != null){
        decorationElements.push(`\t\tgradient: ${convertGradientToDart(container.decoration.gradient)}`);
    }

    if(container.decoration.shadows != null){
        decorationElements.push(`\t\tboxShadow: ${convertShadowsToDart(container.decoration.shadows)}`);

    }
    return `new Container(
  width: ${container.width},
  height: ${container.height},
  decoration: new BoxDecoration(
    ${decorationElements.join(",\n")}
  )
)`
}

/**
 * 
 * @param {*} color 
 * @param {*} opacity 
 * @param {*} multipleColors 
 */
function convertColorToDart(color, opacity, multipleColors){

    var space;
    if (multipleColors){
        space =  "\n      ";
    }
    else{
        space= "";
    }
    if (opacity < 1){
        return `${space}Color(0x${color.a}${color.r}${color.g}${color.b}).withOpacity(${opacity})`;
    }

    return `${space}Color(0x${color.a}${color.r}${color.g}${color.b})`;

}

/**
 * 
 * @param {*} textSelected 
 */
function convertTextToDart(textSelected){

    return `new Text("${textSelected.text}",
    style: ${convertTextStyleToDart(textSelected.textStyle)}
)`;

}
/**
 * 
 * @param {*} textSelected 
 */
function convertTextSpanToDart(textSelected){

    return `\n\tnew TextSpan(
    text: "${textSelected.text}",
    style: ${convertTextStyleToDart(textSelected.textStyle)}
    )`;

}
/**
 * 
 * @param {*} textStyle 
 */
function convertTextStyleToDart(textStyle){
    var shadowElements;
    var letterSpacingElement;

    // Evaluating if shadow exists
    if (textStyle.shadows != null)
    {
        shadowElements = `shadows: ${convertShadowsToDart(textStyle.shadows)}`;
    }
    else{
        shadowElements = "";
    }

    // Evaluating if shadow exists
    if (textStyle.letterSpacing != null)
    {
        letterSpacingElement = `letterSpacing:: ${textStyle.letterSpacing},`;
    }
    else{
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
/**
 * 
 * @param {*} gradient 
 */
function convertGradientToDart(gradient){
    if (gradient.type === 'linear'){
        return `LinearGradient(colors: [${gradient.colors.map(
            colorHex => {
                return  convertColorToDart(colorHex,1, true)
            }
            )} ],
    stops: [
        ${gradient.stops.join(",\n\t\t\t\t")}
    ]
    )`;
    }

    return `Color(0x${color.a}${color.r}${color.g}${color.b})`;

}

/**
 * 
 * @param {*} shadows 
 */
function convertShadowsToDart(shadows){

    return `[${shadows.map(
        shadow => {
            return  convertBoxShadowToDart(shadow)
        }
        )} ],
`;
}

/**
 * 
 * @param {*} shadow 
 */
function convertBoxShadowToDart(shadow){
    return `BoxShadow(
        color: ${convertColorToDart(shadow.color,1, false)},
        offset: Offset(${shadow.offsetx},${shadow.offsety}),
        blurRadius: ${shadow.blurRadius},
        spreadRadius: ${shadow.spreadRadius}

    )`;
    
}
/**
 * 
 * @param {*} border 
 */
function convertBorderToDart(border){
    return `Border.all(
      color: ${convertColorToDart(border.color,1, false)},
      width: ${border.width}
    )`;
    
}
/**
 * 
 * @param {*} context 
 */
function convertColorsListToDart(context){
    colors = [];
    context.project.colors.map(
        colorMap => {
            colors.push(`const Color ${colorMap.name} = const ${convertColorToDart(new Color(colorMap.toHex().r, colorMap.toHex().g,colorMap.toHex().b, colorMap.toHex().a), 1, false)};`)
            
        }
    );
    return colors;
}
/**
 * 
 * @param {*} context 
 */
function convertTextStylesListToDart(context){
    textStyles = [];
    context.project.textStyles.map(
        textStyleMap => {
            textStyles.push(`const TextStyle ${textStyleMap.name.replace(/\s/g, '')} = const ${convertTextStyleToDart(
                new TextStyle(
                    textStyleMap.fontFamily,
                    new Color(textStyleMap.color.toHex().r, textStyleMap.color.toHex().g,textStyleMap.color.toHex().b, textStyleMap.color.toHex().a),
                    textStyleMap.fontSize,
                    textStyleMap.fontWeight,
                    textStyleMap.fontStyle,
                    textStyleMap.letterSpacing,
                    textStyleMap.lineHeight ,
                    getShadows(context, [])
                    )
                )};`)
            
        }
    );
    return textStyles;
}

/**
 * 
 * @param {*} textSpans 
 */
function convertRichTextToDart(textSpans){
    

    return `RichText(
    text: new TextSpan(
    children: [
    ${textSpans.map( textSpan =>
        {return convertTextSpanToDart(textSpan)}
        )},
    ]
  )
)`;
}


/*
The functions below are used for create all
the Widget Objects from Flutter, this part try organize
better the final code 
*/

/**
 * 
 * @param {*} color 
 * @param {*} offsetx 
 * @param {*} offsety 
 * @param {*} blurRadius 
 * @param {*} spreadRadius 
 */
function BoxShadow(color, offsetx, offsety, blurRadius, spreadRadius){
    this.color = color;
    this.offsetx = offsetx;
    this.offsety = offsety;
    this.blurRadius = blurRadius;
    this.spreadRadius = spreadRadius;

}

/**
 * 
 * @param {*} type 
 * @param {*} colors 
 * @param {*} stops 
 * @param {*} angle 
 */
function Gradient(type, colors, stops, angle){
    this.type = type;
    this.colors = colors;
    this.stops = stops;
    this.angle = angle;
}

/**
 * 
 * @param {*} color 
 * @param {*} width 
 */
// Border Flutter
function Border(color, width){
    this.color = color;
    this.width = width;
}
// This is a function to model Color from DART object
function Color(r,g,b,a){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

/**
 * 
 * @param {*} width 
 * @param {*} height 
 * @param {*} decoration 
 */
// This is a function to model Shape as DART Container Flutter
function Container(width, height, decoration) {
    this.width = width;
    this.height = height;
    this.decoration = decoration;
}

/**
 * 
 * @param {*} color 
 * @param {*} border 
 * @param {*} borderRadius 
 * @param {*} shadows 
 * @param {*} gradient 
 * @param {*} opacity 
 */
// This is a function to model BoxDecoration in Flutter
function BoxDecoration(color, border, borderRadius, shadows, gradient, opacity){
    this.color = color;
    this.border = border;
    this.borderRadius = borderRadius;
    this.shadows = shadows;
    this.gradient = gradient;
    this.opacity = opacity;
}

/**
 * 
 * @param {*} text 
 * @param {*} textStyle 
 */
// This is a funtion to model Text in Flutter
function Text(text, textStyle){
    this.text = text;
    this.textStyle = textStyle;
}
/**
 * 
 * @param {*} fontFamily 
 * @param {*} color 
 * @param {*} fontSize 
 * @param {*} fontWeight 
 * @param {*} fontStyle 
 * @param {*} letterSpacing 
 * @param {*} height 
 * @param {*} shadows 
 */
// This is a function to model TextStyle in Flutter
function TextStyle(fontFamily, color, fontSize, fontWeight, fontStyle, letterSpacing, height, shadows){

    this.fontFamily = fontFamily;
    this.color = color;
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.fontStyle = fontStyle;
    this.letterSpacing = letterSpacing;
    this.height = height;
    this.shadows = shadows;
}

/*
The functions below are used as common functions
*/
/**
 * 
 * @param {*} context 
 * @param {*} layer 
 */
function layerHasGradient(context, layer) {
    return layer.fills.some(f => f.type === "gradient");
}


export default {
    layer,
    // screen,
    // component,
    colors,
    textStyles,
    exportColors,
    exportTextStyles,
    // styleguideColors,
    // styleguideTextStyles,
    // exportStyleguideColors,
    // exportStyleguideTextStyles,
    // comment
};