const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

// Figma API
const access_token = 'figd_xjI9mfZ1EcAocjRtJS8fZ1KdtruyHqwG2xasl40V';
const file_id = 'F8NudXpRM99UbUWxD8A00t';

const headers = {
    'X-Figma-Token': access_token,
};

function processNode(node, s) {
    const name = node.name;
    let x, y, width, height;
    
    if (node.absoluteBoundingBox) {
        x = node.absoluteBoundingBox.x;
        y = node.absoluteBoundingBox.y;
        width = node.absoluteBoundingBox.width;
        height = node.absoluteBoundingBox.height;
    } else {
        x = y = width = height = null;
    }

    let fill_color = null;
    let text = '';

    if (node.fills && node.fills.length > 0) {
        fill_color = node.fills[0].color;
    }

    if (node.characters) {
        text = node.characters;
    }

    s += `Name: ${name}\n`;
    if (x !== null) {
        s += `X: ${x}, Y: ${y}\n`;
        s += `Width: ${width}, Height: ${height}\n`;
    }
    if (fill_color !== null) {
        s += `Fill Color: ${JSON.stringify(fill_color)}\n`;
    }
    if (text) {
        s += `Text: ${text}\n`;
    }
    s += '---\n';

    if (node.children) {
        for (const child of node.children) {
            s = processNode(child, s);
        }
    }
    return s;
}

const file_url = `https://api.figma.com/v1/files/${file_id}`;

axios
    .get(file_url, { headers })
    .then((response) => {
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Figma API request failed');
        }
    })
    .then((figma_data) => {
        function generateReactCode(data) {
            let reactCode = '';
            for (const item of data.document.children) {
                if (item.type === 'FRAME') {
                    reactCode += generateFrameReactCode(item);
                } else if (item.type === 'TEXT') {
                    reactCode += generateTextReactCode(item);
                } else if (item.type === 'IMAGE') {
                    reactCode += generateImageReactCode(item);
                } else if (item.type === 'RECTANGLE') {
                    reactCode += generateRectangleReactCode(item);
                } else if (item.type === 'VECTOR') {
                    reactCode += generateVectorReactCode(item);
                } else if (item.type === 'SHAPE') {
                    reactCode += generateShapeReactCode(item);
                } else if (item.type === 'CANVAS') {
                    reactCode += `Page Name: ${item.name}\n`;
                    for (const layer of item.children) {
                        reactCode = processNode(layer, reactCode);
                    }
                }
            }
            return reactCode;
        }

        function generateFrameReactCode(frameItem) {
            let frameCode = '';
            const children = frameItem.children || [];
            for (const child of children) {
                if (child.type === 'TEXT') {
                    frameCode += generateTextReactCode(child);
                } else if (child.type === 'IMAGE') {
                    frameCode += generateImageReactCode(child);
                } else if (child.type === 'RECTANGLE') {
                    frameCode += generateRectangleReactCode(child);
                } else if (child.type === 'VECTOR') {
                    frameCode += generateVectorReactCode(child);
                } else if (child.type === 'SHAPE') {
                    frameCode += generateShapeReactCode(child);
                }
            }
            return frameCode;
        }

        function generateTextReactCode(textItem) {
            const text = textItem.characters;
            const fontFamily = textItem.style.fontFamily;
            const fontSize = textItem.style.fontSize;
            const fill = textItem.style.fill;
            const fillColor = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;

            return `<p style={{ fontFamily: "${fontFamily}", fontSize: "${fontSize}px", color: "${fillColor}" }}>${text}</p>\n`;
        }

        function generateImageReactCode(imageItem) {
            const src = imageItem.src;
            const alt = imageItem.alt;

            return `<img src="${src}" alt="${alt}" />\n`;
        }

        function generateRectangleReactCode(rectangleItem) {
            const width = rectangleItem.width;
            const height = rectangleItem.height;
            const fill = rectangleItem.fill.color;
            const fillColor = `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${fill.a})`;

            return `<div style={{ width: "${width}px", height: "${height}px", backgroundColor: "${fillColor}" }}></div>\n`;
        }

        function generateVectorReactCode(vectorItem) {
            const vectorData = vectorItem.data;
            const vectorType = vectorData.type.toLowerCase();

            if (vectorType === 'line') {
                const { x1, y1, x2, y2, stroke_color, stroke_width } = vectorData;
                const svgCode = `
                    <svg width="${x2}" height="${y2}">
                        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke: ${stroke_color}; stroke-width: ${stroke_width}px;" />
                    </svg>
                `;
                return svgCode;
            } else if (vectorType === 'polyline') {
                const { points, stroke_color, stroke_width } = vectorData;
                const svgCode = `
                    <svg width="100" height="100">
                        <polyline points="${points}" style="fill: none; stroke: ${stroke_color}; stroke-width: ${stroke_width}px;" />
                    </svg>
                `;
                return svgCode;
            } else {
                // Обработка других типов векторов здесь, если необходимо
                return ''; 
            }
        }

        function generateShapeReactCode(shapeItem) {
            const shapeData = shapeItem.data;
            const shapeType = shapeData.type.toLowerCase();

            if (shapeType === 'rectangle') {
                const { width, height, fill_color } = shapeData;
                const divCode = `
                    <div style={{ width: ${width}px, height: ${height}px, backgroundColor: "${fill_color}" }}></div>
                `;
                return divCode;
            } else if (shapeType === 'circle') {
                const { radius, fill_color } = shapeData;
                const divCode = `
                    <div style={{ width: ${radius * 2}px, height: ${radius * 2}px, borderRadius: "50%", backgroundColor: "${fill_color}" }}></div>
                `;
                return divCode;
            } else if (shapeType === 'ellipse') {
                const { rx, ry, fill_color } = shapeData;
                const divCode = `
                    <div style={{ width: ${rx * 2}px, height: ${ry * 2}px, borderRadius: "50%", backgroundColor: "${fill_color}" }}></div>
                `;
                return divCode;
            } else {
                // Обработка других типов форм здесь, если необходимо
                return ''; 
            }
        }

        const reactCode = generateReactCode(figma_data);

        // OpenAI API
        const openai_api_key = process.env.API_KEY;

        const configuration = new Configuration({
            apiKey: openai_api_key,
        });

        const openaiapi = new OpenAIApi(configuration);

        const history = [];

        const user_input =
            'сделай и выведи полный react код на основе этих описаний figma-объектов (выводи просто код без каких-либо комментариев от тебя): ' +
            reactCode;
        history.push({ role: 'user', content: user_input });
        
        // Создайте запрос к ChatGPT для генерации React-кода
        openaiapi.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: history,
        })
        .then((response) => {
            // Получите ответ ChatGPT
            const chatgptResponse = response.data.choices[0].message.content;

            // Выведите полный React-код в консоль
            console.log(chatgptResponse);
        })
        .catch((error) => {
            console.error(error);
        });
    })
    .catch((error) => {
        console.error(error);
    });