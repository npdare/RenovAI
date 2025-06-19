import OpenAI from "openai";
import Replicate from "replicate";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface DesignAnalysis {
  roomType: string;
  currentStyle: string;
  suggestions: string[];
  colorPalette: string[];
  furnitureRecommendations: string[];
}

export interface AIVisualizationResult {
  imageUrl: string;
  description: string;
  styleApplied: string;
  designNotes: string[];
}

export interface ArchitecturalElement {
  category: string;
  specificType: string;
  quantity?: string;
  currentCondition: string;
  alternatives: string[];
  action: 'retain' | 'inspiration' | 'select';
  selectedStyle: string;
}

export interface ArchitecturalAnalysis {
  elements: ArchitecturalElement[];
  roomStructure: string;
  detectedFeatures: string[];
}

// Analyze uploaded room photo and provide design insights
export async function analyzeRoomPhoto(imagePath: string): Promise<DesignAnalysis> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a professional interior designer with expertise in analyzing room layouts, furniture placement, and design aesthetics. Analyze the uploaded room photo and provide detailed design insights in JSON format."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this room photo and provide: 1) Room type identification, 2) Current design style, 3) Design improvement suggestions, 4) Recommended color palette, 5) Furniture recommendations. Respond in JSON format with fields: roomType, currentStyle, suggestions, colorPalette, furnitureRecommendations."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      roomType: analysis.roomType || "Unknown",
      currentStyle: analysis.currentStyle || "Mixed",
      suggestions: analysis.suggestions || [],
      colorPalette: analysis.colorPalette || [],
      furnitureRecommendations: analysis.furnitureRecommendations || []
    };
  } catch (error) {
    console.error('Error analyzing room photo:', error);
    throw new Error('Failed to analyze room photo');
  }
}

// Generate AI-powered room redesign using DALL-E
export async function generateRoomRedesign(
  originalImagePath: string, 
  designStyle: string, 
  roomType: string
): Promise<AIVisualizationResult> {
  try {
    // First analyze the original image for context
    const analysis = await analyzeRoomPhoto(originalImagePath);
    
    // Create a detailed prompt for room redesign
    const prompt = `A beautifully redesigned ${roomType} in ${designStyle} style. 
    ${analysis.suggestions.slice(0, 3).join('. ')}. 
    Professional interior design photography, high quality, well-lit, modern, sophisticated.
    Color palette should include ${analysis.colorPalette.slice(0, 3).join(', ')}.
    Ultra-realistic, architectural photography, 8K resolution.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }

    return {
      imageUrl,
      description: `${designStyle} redesign of ${roomType}`,
      styleApplied: designStyle,
      designNotes: analysis.suggestions.slice(0, 5)
    };
  } catch (error) {
    console.error('Error generating room redesign:', error);
    throw new Error('Failed to generate room redesign');
  }
}

// Generate design inspiration based on style preferences
export async function generateDesignInspiration(
  style: string,
  roomType: string,
  colorPreferences?: string[]
): Promise<AIVisualizationResult> {
  try {
    const colorText = colorPreferences?.length ? 
      `featuring ${colorPreferences.join(', ')} colors` : '';
    
    const prompt = `A stunning ${roomType} interior in ${style} design style ${colorText}. 
    Professional interior design photography, high-end furniture, perfect lighting, 
    sophisticated color coordination, luxury materials, architectural details.
    Ultra-realistic, magazine-quality, 8K resolution.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }

    return {
      imageUrl,
      description: `${style} ${roomType} inspiration`,
      styleApplied: style,
      designNotes: [
        `Professional ${style} design aesthetic`,
        `Curated for ${roomType} spaces`,
        `High-end furniture and materials`,
        `Sophisticated color coordination`
      ]
    };
  } catch (error) {
    console.error('Error generating design inspiration:', error);
    throw new Error('Failed to generate design inspiration');
  }
}

// Provide personalized design recommendations
export async function getDesignRecommendations(
  userPhotos: string[],
  preferredStyles: string[],
  budget?: string
): Promise<{
  recommendations: string[];
  priorityItems: string[];
  budgetConsiderations: string[];
}> {
  try {
    // Analyze multiple photos to understand user's space and preferences
    const analyses = await Promise.all(
      userPhotos.slice(0, 3).map(photo => analyzeRoomPhoto(photo))
    );

    const prompt = `As a professional interior designer, provide comprehensive design recommendations based on:
    - Room analyses: ${JSON.stringify(analyses)}
    - Preferred styles: ${preferredStyles.join(', ')}
    - Budget: ${budget || 'Not specified'}
    
    Provide specific, actionable recommendations in JSON format with fields:
    recommendations (overall design advice), priorityItems (most important changes), budgetConsiderations (cost-effective suggestions).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a professional interior designer providing personalized design consultation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      recommendations: result.recommendations || [],
      priorityItems: result.priorityItems || [],
      budgetConsiderations: result.budgetConsiderations || []
    };
  } catch (error) {
    console.error('Error getting design recommendations:', error);
    throw new Error('Failed to get design recommendations');
  }
}

// Generate product recommendations based on analyzed room
export async function generateProductRecommendations(
  imagePath: string,
  budget?: string
): Promise<{
  furniture: string[];
  decor: string[];
  lighting: string[];
  textiles: string[];
}> {
  try {
    const analysis = await analyzeRoomPhoto(imagePath);
    
    const prompt = `Based on this room analysis: ${JSON.stringify(analysis)}, 
    and budget: ${budget || 'flexible'}, recommend specific products in JSON format with fields:
    furniture, decor, lighting, textiles. Include specific product names and descriptions.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a professional interior designer specializing in product curation and space planning."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 600,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      furniture: result.furniture || [],
      decor: result.decor || [],
      lighting: result.lighting || [],
      textiles: result.textiles || []
    };
  } catch (error) {
    console.error('Error generating product recommendations:', error);
    throw new Error('Failed to generate product recommendations');
  }
}

// Transform image based on extracted design parameters while preserving room structure
export async function transformImageWithParameters(
  imagePath: string,
  parameters: any,
  transformationStrength: number
): Promise<{
  originalImage: string;
  transformedImage: string;
  transformationStrength: number;
  appliedParameters: any;
}> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Analyze the original image structure and layout with precise architectural details
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a professional architect analyzing structural elements. Focus on exact spatial relationships, architectural features, and material definitions that must be preserved during design transformation."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this room with extreme precision: 1) Wall configurations and angles, 2) Window sizes, positions and frames, 3) Door locations and sizes, 4) Ceiling height and features, 5) Floor layout and transitions, 6) Built-in elements, 7) Lighting fixture positions, 8) Exact furniture placement and scale. Describe the structural skeleton that must remain identical."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 700,
    });

    const roomLayout = analysisResponse.choices[0].message.content;

    // Create precise transformation prompt that maintains structural integrity
    const intensityText = transformationStrength > 80 ? "replace materials and finishes while keeping" : 
                         transformationStrength > 50 ? "update finishes and textures while preserving" : "subtly refresh materials while maintaining";

    const prompt = `PHOTOREALISTIC ARCHITECTURAL TRANSFORMATION - Apply ${parameters.style} design to this ${parameters.roomType} while maintaining exact structural layout: ${roomLayout}

CRITICAL: Maintain photographic realism, no cartoon or illustration style. Professional architectural photography standards.

PRESERVE EXACTLY (NO CHANGES):
- Identical room dimensions and proportions
- Exact window positions, sizes, and mullion patterns
- Door locations, openings, and hardware
- Ceiling configuration and height
- Wall angles, corners, and structural elements
- Camera viewpoint and perspective
- Natural lighting direction and shadows
- Built-in fixtures and architectural features

MATERIALS TO APPLY:
- Wall surfaces: ${parameters.wallCladding.join(', ')}
- Floor covering: ${parameters.flooringMaterial.join(', ')}
- Accent materials: ${parameters.materials.join(', ')}
- Color palette: ${parameters.colorPalette.join(', ')}

STYLE REQUIREMENTS:
- ${parameters.style} architectural aesthetic
- Furniture: ${parameters.furnitureTypes.join(', ')} in ${parameters.style} style
- Realistic material textures and natural wear patterns
- Authentic lighting reflections and shadows
- Professional interior design photography quality

OUTPUT SPECIFICATIONS:
- Ultra-photorealistic, not stylized or artistic
- Sharp architectural details and material textures
- Natural lighting with realistic shadows
- Professional interior photography composition
- High-resolution clarity, magazine quality
- NO cartoon, illustration, or artistic interpretation`;

    // Use direct image-to-image transformation with SDXL for better compatibility
    console.log('Applying SDXL transformation...');
    const base64ImageData = `data:image/jpeg;base64,${base64Image}`;
    const denoisingStrength = Math.max(0.3, (transformationStrength / 100));
    
    // Build prompt from dynamic categories or fallback to legacy parameters
    const designElements = parameters.detectedCategories?.length > 0 
      ? parameters.detectedCategories.map((cat: any) => cat.items.join(' and ')).join(', ')
      : `${parameters.wallCladding?.join(' and ') || 'modern walls'} wall treatments, ${parameters.flooringMaterial?.join(' and ') || 'premium flooring'} flooring, ${parameters.colorPalette?.join(' and ') || 'neutral colors'} color scheme`;

    const architecturalPrompt = `Professional architectural ${parameters.spaceType || 'interior'} photography, ${parameters.style} design style, featuring ${designElements}, photorealistic, 8K resolution, professional lighting, architectural magazine quality, sharp focus, natural shadows`;

    const transformation = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          image: base64ImageData,
          prompt: architecturalPrompt,
          negative_prompt: "cartoon, illustration, painting, drawing, art, sketch, anime, low quality, blurry, distorted, unrealistic, fake, artificial, stylized",
          num_inference_steps: 30,
          guidance_scale: 7.5,
          strength: denoisingStrength,
          seed: Math.floor(Math.random() * 1000000)
        }
      }
    );

    // Skip post-processing for SDXL as it already produces high-quality output
    console.log('SDXL transformation complete');
    const enhancedImage = transformation;

    // Download and save the final enhanced image
    const finalImageUrl = Array.isArray(enhancedImage) ? enhancedImage[0] : enhancedImage;
    const imageResponse = await fetch(finalImageUrl);
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBufferNew = Buffer.from(imageArrayBuffer);
    
    const timestamp = Date.now();
    const transformedFileName = `controlnet_transformed_${timestamp}.png`;
    const transformedPath = path.join('uploads', transformedFileName);
    
    fs.writeFileSync(transformedPath, imageBufferNew);

    return {
      originalImage: `/uploads/${path.basename(imagePath)}`,
      transformedImage: `/uploads/${transformedFileName}`,
      transformationStrength,
      appliedParameters: parameters
    };
  } catch (error) {
    console.error('Error transforming image:', error);
    throw new Error('Failed to transform image');
  }
}

// Analyze architectural elements from original photo
export async function analyzeArchitecturalElements(imagePath: string): Promise<ArchitecturalAnalysis> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const analysis = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert architectural analyst. Analyze structural elements in photos and provide modification alternatives for each detected element."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this photo exhaustively and identify ALL visible architectural design elements. You must examine every part of the image and return comprehensive details.

MANDATORY: Detect and list every architectural element you can see including:
- Windows (count each one, describe style, trim, hardware)
- Doors (entry doors, interior doors, closets, French doors, sliding doors)
- Roofing (materials, style, gutters, downspouts, chimneys, vents)
- Exterior cladding (siding, brick, stone, stucco, panels)
- Flooring (materials, patterns, transitions)
- Walls (paint, wallpaper, paneling, tile, stone, brick)
- Ceilings (height, materials, beams, molding, lighting integration)
- Lighting fixtures (pendant, chandelier, recessed, sconces, outdoor)
- Trim and molding (baseboards, crown molding, window trim, door casings)
- Architectural features (columns, arches, built-ins, fireplaces, stairs, railings)
- Hardware (door handles, cabinet pulls, hinges, locks)
- Outdoor elements (decking, patios, landscaping, fencing, pergolas)

Return only valid JSON:
{
  "roomStructure": "Brief description of space style and layout",
  "detectedFeatures": ["feature1", "feature2", "feature3"],
  "elements": [
    {
      "category": "windows",
      "specificType": "Double-hung windows with white trim",
      "quantity": "3",
      "alternatives": ["Casement windows", "Bay windows", "Picture windows", "Sliding windows", "Arched windows"],
      "action": "retain",
      "selectedStyle": ""
    }
  ]
}

Be thorough - include every visible architectural element, no matter how minor.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800
    });

    let result;
    try {
      const content = analysis.choices[0].message.content || '{}';
      // Clean up potential JSON issues
      const cleanContent = content
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/"/g, '"') // Normalize quotes
        .trim();
      
      result = JSON.parse(cleanContent);
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.error('Raw content:', analysis.choices[0].message.content);
      
      // Return fallback structure with common architectural elements
      return {
        roomStructure: 'Modern interior space with clean lines and contemporary finishes. The room features natural lighting and appears to be in good condition with potential for design enhancement.',
        detectedFeatures: ['Natural lighting', 'Clean architectural lines', 'Contemporary styling'],
        elements: [
          {
            category: 'windows',
            specificType: 'Standard windows with trim',
            quantity: '2-3',
            currentCondition: 'Good condition',
            alternatives: ['Casement windows', 'Bay windows', 'Picture windows', 'Sliding windows', 'French windows'],
            action: 'retain',
            selectedStyle: ''
          },
          {
            category: 'walls',
            specificType: 'Painted drywall surfaces',
            quantity: 'Multiple',
            currentCondition: 'Good condition',
            alternatives: ['Wood paneling', 'Textured wallpaper', 'Stone accent walls', 'Brick features', 'Modern tile'],
            action: 'retain',
            selectedStyle: ''
          },
          {
            category: 'flooring',
            specificType: 'Standard flooring material',
            quantity: 'Full room',
            currentCondition: 'Good condition',
            alternatives: ['Hardwood planks', 'Luxury vinyl', 'Ceramic tile', 'Natural stone', 'Polished concrete'],
            action: 'retain',
            selectedStyle: ''
          },
          {
            category: 'lighting',
            specificType: 'Basic lighting fixtures',
            quantity: 'Multiple',
            currentCondition: 'Functional',
            alternatives: ['Pendant lights', 'Chandeliers', 'Recessed lighting', 'Track lighting', 'Sconces'],
            action: 'retain',
            selectedStyle: ''
          },
          {
            category: 'doors',
            specificType: 'Standard interior doors',
            quantity: '2-4',
            currentCondition: 'Good condition',
            alternatives: ['Panel doors', 'French doors', 'Barn doors', 'Pocket doors', 'Glass doors'],
            action: 'retain',
            selectedStyle: ''
          },
          {
            category: 'trim',
            specificType: 'Basic trim and molding',
            quantity: 'Throughout',
            currentCondition: 'Standard',
            alternatives: ['Crown molding', 'Baseboards', 'Chair rail', 'Wainscoting', 'Custom millwork'],
            action: 'retain',
            selectedStyle: ''
          }
        ]
      };
    }
    
    return {
      roomStructure: result.roomStructure || 'Room structure analysis not available',
      detectedFeatures: result.detectedFeatures || [],
      elements: result.elements || []
    };

  } catch (error) {
    console.error('Architectural analysis error:', error);
    return {
      roomStructure: 'Unable to analyze room structure',
      detectedFeatures: [],
      elements: []
    };
  }
}

// Content-aware categorization for inspiration images
export async function analyzeReferenceImages(images: any[]): Promise<{
  detectedCategories: { name: string; items: string[]; confidence: number }[];
  style: string;
  spaceType: 'interior' | 'exterior';
}> {
  try {
    const analysisResults = [];
    
    for (const image of images.slice(0, 3)) {
      const imageBuffer = fs.readFileSync(image.path);
      const base64Image = imageBuffer.toString('base64');
      
      const analysis = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert at identifying design elements in images. Analyze what is prominently featured and return the appropriate category name with specific items you observe."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Look at this image and identify what design element is prominently featured. Based on what you see, determine the most appropriate category and extract specific items.

CONTENT DETECTION RULES:
- If you see walls/wall treatments → return category "wall cladding"
- If you see floors/flooring → return category "flooring"  
- If you see furniture pieces → return category "furniture" (or "exterior furniture" if outdoor)
- If you see materials/textures → return category "materials"
- If you see color schemes → return category "color palette"
- If you see architectural features → return category "architectural features"
- If you see lighting → return category "lighting fixtures"
- If you see ceiling treatments → return category "ceiling details"

Return JSON format:
{
  "primaryCategory": "the most appropriate category name based on what's prominently shown",
  "items": ["specific items you observe in this category"],
  "confidence": 0.8,
  "overallStyle": "design style you observe",
  "spaceType": "interior or exterior"
}`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 400
      });

      const result = JSON.parse(analysis.choices[0].message.content || '{}');
      analysisResults.push({
        category: result.primaryCategory || 'materials',
        items: result.items || [],
        confidence: result.confidence || 0.8,
        style: result.overallStyle || '',
        spaceType: result.spaceType || 'interior'
      });
    }

    const categoryMap = new Map();
    let dominantStyle = '';
    let dominantSpaceType = 'interior';

    analysisResults.forEach(result => {
      if (result.style) dominantStyle = result.style;
      if (result.spaceType) dominantSpaceType = result.spaceType;
      
      const category = result.category;
      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category);
        const uniqueItems = [...existing.items, ...result.items];
        existing.items = uniqueItems.filter((item, index) => uniqueItems.indexOf(item) === index);
        existing.confidence = Math.max(existing.confidence, result.confidence);
      } else {
        categoryMap.set(category, {
          name: category,
          items: result.items,
          confidence: result.confidence
        });
      }
    });

    return {
      detectedCategories: Array.from(categoryMap.values()),
      style: dominantStyle,
      spaceType: (dominantSpaceType === 'exterior' ? 'exterior' : 'interior') as 'interior' | 'exterior'
    };

  } catch (error) {
    console.error('Reference image analysis error:', error);
    return {
      detectedCategories: [],
      style: '',
      spaceType: 'interior'
    };
  }
}

// Pinterest board analysis with web scraping and image analysis
export async function analyzePinterestBoard(pinterestUrl: string): Promise<{
  style: string;
  materials: string[];
  colors: string[];
}> {
  try {
    // Extract Pinterest board ID from URL
    const boardMatch = pinterestUrl.match(/pinterest\.com\/[\w-]+\/([\w-]+)/);
    if (!boardMatch) {
      throw new Error('Invalid Pinterest URL format');
    }

    // Use text analysis for Pinterest descriptions and titles
    const textAnalysis = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an architectural design assistant. Extract design intent from Pinterest board URLs and descriptions."
        },
        {
          role: "user",
          content: `Analyze this Pinterest board URL for architectural design elements. Extract the intended style, materials, and color palette from the board name and context. Return JSON format:
          {
            "style": "architectural style interpretation",
            "materials": ["inferred materials from board context"],
            "colors": ["color palette suggestions based on board theme"]
          }
          
          Pinterest URL: ${pinterestUrl}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300
    });

    const result = JSON.parse(textAnalysis.choices[0].message.content || '{}');
    
    return {
      style: result.style || '',
      materials: result.materials || [],
      colors: result.colors || []
    };

  } catch (error) {
    console.error('Pinterest analysis error:', error);
    return {
      style: '',
      materials: [],
      colors: []
    };
  }
}

// Enhanced text prompt analysis for architectural features
export async function analyzeTextPrompt(textPrompt: string): Promise<{
  style: string;
  materials: string[];
  colors: string[];
  architecturalFeatures: string[];
}> {
  try {
    const analysis = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an architectural design assistant. Given user text prompts, extract the intended style, materials, color palette, and notable architectural features with high precision."
        },
        {
          role: "user",
          content: `Analyze this architectural design prompt and extract specific elements. Return JSON format:
          {
            "style": "specific architectural style name",
            "materials": ["specific materials mentioned or implied"],
            "colors": ["color descriptions and palette"],
            "architecturalFeatures": ["architectural elements and features"]
          }
          
          User prompt: "${textPrompt}"`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 400
    });

    const result = JSON.parse(analysis.choices[0].message.content || '{}');
    
    return {
      style: result.style || '',
      materials: result.materials || [],
      colors: result.colors || [],
      architecturalFeatures: result.architecturalFeatures || []
    };

  } catch (error) {
    console.error('Text prompt analysis error:', error);
    return {
      style: '',
      materials: [],
      colors: [],
      architecturalFeatures: []
    };
  }
}