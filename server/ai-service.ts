import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const prompt = `Transform ONLY the surface materials and finishes in this ${parameters.roomType} while ${intensityText} the exact structural layout: ${roomLayout}. 

PRESERVE EXACTLY:
- All wall angles, corners, and configurations
- Window sizes, positions, frames, and mullions  
- Door locations, sizes, and openings
- Ceiling height, beams, and architectural details
- Floor plan and room proportions
- Built-in elements and fixtures
- Camera angle and perspective
- Lighting fixture positions
- Furniture scale and placement

CHANGE ONLY:
- Wall cladding: ${parameters.materials.includes('Natural Stone') ? 'natural stone wall cladding' : parameters.materials.includes('Wood') ? 'wood wall paneling' : 'painted walls'}
- Flooring material: ${parameters.materials.includes('Hardwood') ? 'hardwood flooring' : parameters.materials.includes('Marble') ? 'marble flooring' : 'appropriate flooring for ' + parameters.style}
- Color scheme: ${parameters.colorPalette.join(', ')}
- Furniture style: ${parameters.style} style ${parameters.furnitureTypes.join(', ')}
- Fabric and textile patterns matching ${parameters.style}

Keep identical room dimensions, spatial relationships, and architectural framework. Professional interior photography, same lighting conditions.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    const transformedImageUrl = response.data?.[0]?.url;
    if (!transformedImageUrl) {
      throw new Error('No transformed image URL returned from DALL-E');
    }

    return {
      originalImage: `/uploads/${path.basename(imagePath)}`,
      transformedImage: transformedImageUrl,
      transformationStrength,
      appliedParameters: parameters
    };
  } catch (error) {
    console.error('Error transforming image:', error);
    throw new Error('Failed to transform image');
  }
}