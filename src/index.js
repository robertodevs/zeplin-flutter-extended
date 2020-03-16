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
                code: convertContainerToDart(container, context),
                language: 'dart'
            }
            break;

        case 'group':
            // Missing to implement, it will in future versions
            return {
                code: `group`,
                language: 'dart'
            }
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

function screen(context, selectedVersion, selectedScreen) {
    return{
        code: 'Cooming soon',
        filename: `${context.project.name}TextStyles.dart`,
        language: "dart"
    }
}

function component(context, selectedVersion, selectedComponent) {
    return{
        code: 'Cooming soon...',
        filename: `${context.project.name}TextStyles.dart`,
        language: "dart"
    }
}



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

    // Evaluating if the selected layer has Fills

    if (layer.fills.length>0)
    {
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

        body = convertRichTextToDart(textSpans, context);

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
            ), context
        )
    }
    
    return body;
}

/**
 * 
 * @param {*} context has all elements from the entire project
 * @param {*} color to evaluate if exists on the project 
 */
function getColorNameFromProject(context, color){
    // The color must be the object from Zepli Model not DART
    colors = [];
    var colorName = '';
    // It is important to evaluate before map the colors
    // if the context is not null
    if(context != null){
        context.project.colors.map(
            colorMap => {
                // Evaluating if the color exists for the project
                var dartColor = new Color(colorMap.toHex().r, colorMap.toHex().g,colorMap.toHex().b, colorMap.toHex().a)
                // Both colors must be object dart colors model
                if (equalsColor(dartColor, color)){
                    // The name of the color will show instead of hex code
                    colorName = colorMap.name;
                }
            }
        );
    }
    return colorName;
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
        const lastBorder = layer.borders[layer.borders.length -1];
        if (lastBorder.fill == "color") {
            return new Border(
                new Color(
                    lastBorder.fill.color.toHex().r, 
                    lastBorder.fill.color.toHex().g,
                    lastBorder.fill.color.toHex().b, 
                    lastBorder.fill.color.toHex().a
                ),
                lastBorder.thickness,
            );
        } else {
            return null;
        }
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
The functions below are used to generate Flutter Widgets Objects to DART CODE,
*/

/**
 * 
 * @param {*} container 
 */
function convertContainerToDart(container, context){
    var decorationElements = [];

    if (container.decoration != null){
        if (container.decoration.color != null)
        {
            decorationElements.push(`color: ${convertColorToDart(container.decoration.color, 1, false, context)}`);
        }
        if (container.decoration.border != null)
        {
            decorationElements.push(`border: ${convertBorderToDart(container.decoration.border, context)}`);
        }
        if (container.decoration.borderRadius != null)
        {
            decorationElements.push(`\t\tborderRadius: BorderRadius.circular(${container.decoration.borderRadius})`);
        }
    
        if (container.decoration.gradient != null){
            decorationElements.push(`\t\tgradient: ${convertGradientToDart(container.decoration.gradient, context)}`);
        }
    
        if(container.decoration.shadows != null){
            decorationElements.push(`\t\tboxShadow: ${convertShadowsToDart(container.decoration.shadows, context)}`);
    
        }
    }

    let containerCode = `new Container(
        width: ${container.width},
        height: ${container.height},
        decoration: new BoxDecoration(
          ${decorationElements.join(",\n")}
        )
      )`;

    // opacity is applied to the whole container, this way it affects its gradient (or color), border and shadows
    if (container.decoration.opacity != null && container.decoration.opacity < 1.0) {
        // we wrap the Opacity in a stack for the purpose of enabling the developer putting a widget inside
        // that is not affected by the opacity (the empty Container() inside Positioned.fill)
        containerCode = `Stack(
            children: <Widget>[
                Opacity(
                    opacity: ${container.decoration.opacity},
                    child: ${containerCode},
                ),
                Positioned.fill(
                    child: Container(),
                ),
            ],
            )`;
    }
    
    return containerCode;
}

/**
 * 
 * @param {*} color 
 * @param {*} opacity 
 * @param {*} multipleColors 
 * @param {*} context 
 */
function convertColorToDart(color, opacity, multipleColors, context){

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
    // Evaluating if the color exists
    // If '' is returned the color does not exist
    var colorName = getColorNameFromProject(context, color);
    // Assigning the new color name 
    if(colorName != ''){
        return `${space}${colorName}`;
    }
    return `${space}Color(0x${color.a}${color.r}${color.g}${color.b})`;

}

/**
 * 
 * @param {*} textSelected 
 */
function convertTextToDart(textSelected, context){

    return `new Text("${textSelected.text}",
    style: ${convertTextStyleToDart(textSelected.textStyle, context)}
)`;

}
/**
 * 
 * @param {*} textSelected 
 */
function convertTextSpanToDart(textSelected, context){

    return `\n\tnew TextSpan(
    text: "${textSelected.text}",
    style: ${convertTextStyleToDart(textSelected.textStyle, context)}
    )`;

}
/**
 * 
 * @param {*} textStyle 
 * @param {*} context
 */
function convertTextStyleToDart(textStyle, context){
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
        letterSpacingElement = `letterSpacing: ${textStyle.letterSpacing},`;
    }
    else{
        letterSpacingElement = "";
    }

    return `TextStyle(
    fontFamily: '${textStyle.fontFamily}',
    color: ${convertColorToDart(textStyle.color, 1, false, context)},
    fontSize: ${textStyle.fontSize},
    fontWeight: FontWeight.w${textStyle.fontWeight},
    fontStyle: FontStyle.${textStyle.fontStyle},
    ${letterSpacingElement}
    ${shadowElements}
    )`;

}

function angleToPoint(degrees) {
    return {
        x: Math.sin(degrees / 180.0 * Math.PI),
        y: -1.0 * Math.cos(degrees / 180.0 * Math.PI),
    };
}

/**
 * 
 * @param {*} gradient 
 * @param {*} context 
 */
function convertGradientToDart(gradient, context){

    if (gradient.type === 'linear'){
        const angle = gradient.angle || 90;
        const end = angleToPoint(angle);
        const begin = {
            x : -end.x,
            y : -end.y,
        };

        return `LinearGradient(
    colors: [${gradient.colors.map(
            colorHex => {
                return  convertColorToDart(colorHex,1, true, context)
            }
            )} ],
    stops: [
        ${gradient.stops.join(",\n\t\t\t\t")}
    ],
    begin: Alignment(${begin.x.toFixed(2)}, ${begin.y.toFixed(2)}),
    end: Alignment(${end.x.toFixed(2)}, ${end.y.toFixed(2)}),
    // angle: ${gradient.angle},
    // scale: ${gradient.scale},
    )`;
    }

    else if (gradient.type === 'radial'){
        return `RadialGradient(colors: [${gradient.colors.map(
            colorHex => {
                return  convertColorToDart(colorHex,1, true, context)
            }
            )} ],
    stops: [
        ${gradient.stops.join(",\n\t\t\t\t")}
    ]
    )`;  
    }

    return ``;

}

/**
 * 
 * @param {*} shadows 
 * @param {*} context 
 */
function convertShadowsToDart(shadows, context){

    return `[${shadows.map(
        shadow => {
            return  convertBoxShadowToDart(shadow, context)
        }
        )} ],
`;
}

/**
 * 
 * @param {*} shadow 
 * @param {*} context 
 */
function convertBoxShadowToDart(shadow, context){
    return `BoxShadow(
        color: ${convertColorToDart(shadow.color,1, false, context)},
        offset: Offset(${shadow.offsetx},${shadow.offsety}),
        blurRadius: ${shadow.blurRadius},
        spreadRadius: ${shadow.spreadRadius}

    )`;
    
}
/**
 * 
 * @param {*} border 
 * @param {*} context 
 */
function convertBorderToDart(border, context){
    return `Border.all(
      color: ${convertColorToDart(border.color,1, false, context)},
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
                    ), context
                )};`)
            
        }
    );
    return textStyles;
}

/**
 * 
 * @param {*} textSpans 
 */
function convertRichTextToDart(textSpans, context){
    

    return `RichText(
    text: new TextSpan(
    children: [
    ${textSpans.map( textSpan =>
        {return convertTextSpanToDart(textSpan, context)}
        )},
    ]
  )
)`;
}


/*
The functions below are used to create all
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
 * @param {*} scale 
 */
function Gradient(type, colors, stops, angle, scale){
    this.type = type;
    this.colors = colors;
    this.stops = stops;
    this.angle = angle;
    this.scale = scale;
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

function equalsColor(color1, color2){
    if (color1.r == color2.r && 
        color1.g == color2.g && 
        color1.b == color2.b && 
        color1.a == color2.a )
        return true;
    return false;
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
    screen,
    component,
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