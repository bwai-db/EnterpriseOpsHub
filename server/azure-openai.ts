import { OpenAI } from 'openai';

// Configuration for Azure OpenAI
const azureOpenAIConfig = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
  apiKey: process.env.AZURE_OPENAI_KEY || process.env.OPENAI_API_KEY || '',
  deployments: {
    gpt4o: process.env.AZURE_OPENAI_GPT4O_DEPLOYMENT || 'gpt-4o',
    gpt35turbo: process.env.AZURE_OPENAI_GPT35_DEPLOYMENT || 'gpt-35-turbo',
    embedding: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || 'text-embedding-ada-002',
    dalle: process.env.AZURE_OPENAI_DALLE_DEPLOYMENT || 'dall-e-3'
  }
};

// Initialize Azure OpenAI or fallback to OpenAI
const isAzureOpenAI = !!azureOpenAIConfig.endpoint;

const openai = isAzureOpenAI 
  ? new OpenAI({
      apiKey: azureOpenAIConfig.apiKey,
      baseURL: `${azureOpenAIConfig.endpoint}/openai/deployments`,
      defaultQuery: { 'api-version': '2024-02-01' },
      defaultHeaders: {
        'api-key': azureOpenAIConfig.apiKey,
      },
    })
  : new OpenAI({ 
      apiKey: azureOpenAIConfig.apiKey 
    });

/**
 * Generate content improvements for documentation
 */
export async function generateDocumentImprovements(
  content: string,
  improvementType: 'readability' | 'completeness' | 'accuracy' | 'structure'
): Promise<{
  improvedContent: string;
  reason: string;
  confidence: number;
}> {
  try {
    const prompt = `As a technical writing expert, analyze and improve the following documentation content for ${improvementType}.

Original content:
${content}

Improvement type: ${improvementType}
- readability: Make text clearer, more concise, and easier to understand
- completeness: Add missing information, context, or details
- accuracy: Correct technical inaccuracies and improve precision
- structure: Improve organization, formatting, and logical flow

Provide your response in JSON format with:
{
  "improvedContent": "The improved version of the content",
  "reason": "Explanation of what was improved and why",
  "confidence": 0.95
}`;

    const deployment = isAzureOpenAI ? azureOpenAIConfig.deployments.gpt4o : 'gpt-4o';
    
    const response = await openai.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical writer and documentation specialist. Provide improvements that enhance clarity, accuracy, and usefulness while maintaining the original intent and technical accuracy.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      improvedContent: result.improvedContent || content,
      reason: result.reason || 'No specific improvements identified',
      confidence: Math.min(Math.max(result.confidence || 0.7, 0.1), 1.0)
    };
  } catch (error) {
    console.error('Error generating document improvements:', error);
    throw new Error('Failed to generate document improvements: ' + (error as Error).message);
  }
}

/**
 * Generate embeddings for document search
 */
export async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const deployment = isAzureOpenAI ? azureOpenAIConfig.deployments.embedding : 'text-embedding-ada-002';
    
    const response = await openai.embeddings.create({
      model: deployment,
      input: text,
      encoding_format: 'float'
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error('Failed to generate embeddings: ' + (error as Error).message);
  }
}

/**
 * Analyze document content and suggest categories
 */
export async function suggestDocumentCategory(
  title: string,
  content: string,
  existingCategories: string[]
): Promise<{
  suggestedCategory: string;
  confidence: number;
  reason: string;
}> {
  try {
    const prompt = `Analyze this document and suggest the most appropriate category from the existing categories.

Document Title: ${title}
Document Content: ${content.substring(0, 500)}...

Existing Categories: ${existingCategories.join(', ')}

Provide your response in JSON format:
{
  "suggestedCategory": "Most appropriate category from the list",
  "confidence": 0.95,
  "reason": "Brief explanation of why this category fits best"
}`;

    const deployment = isAzureOpenAI ? azureOpenAIConfig.deployments.gpt35turbo : 'gpt-3.5-turbo';
    
    const response = await openai.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: 'system',
          content: 'You are a documentation categorization expert. Analyze content and suggest the most appropriate category based on the document\'s primary purpose and content type.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 300
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      suggestedCategory: result.suggestedCategory || existingCategories[0] || 'General',
      confidence: Math.min(Math.max(result.confidence || 0.7, 0.1), 1.0),
      reason: result.reason || 'Category suggestion based on content analysis'
    };
  } catch (error) {
    console.error('Error suggesting document category:', error);
    throw new Error('Failed to suggest document category: ' + (error as Error).message);
  }
}

/**
 * Generate document summary
 */
export async function generateDocumentSummary(content: string, maxLength: number = 200): Promise<string> {
  try {
    const prompt = `Summarize the following documentation content in approximately ${maxLength} characters. Focus on key points and actionable information.

Content:
${content}

Provide a concise, informative summary that helps users understand what this document covers.`;

    const deployment = isAzureOpenAI ? azureOpenAIConfig.deployments.gpt35turbo : 'gpt-3.5-turbo';
    
    const response = await openai.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: 'system',
          content: 'You are a technical writing assistant. Create clear, concise summaries that capture the essential information and value of documentation.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: Math.min(Math.floor(maxLength / 3), 150)
    });

    return response.choices[0].message.content?.trim() || 'Summary not available';
  } catch (error) {
    console.error('Error generating document summary:', error);
    throw new Error('Failed to generate document summary: ' + (error as Error).message);
  }
}

/**
 * Check Azure OpenAI service health
 */
export async function checkAzureOpenAIHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  endpoint: string;
  deployments: typeof azureOpenAIConfig.deployments;
  isAzure: boolean;
}> {
  try {
    // Test with a simple completion
    const deployment = isAzureOpenAI ? azureOpenAIConfig.deployments.gpt35turbo : 'gpt-3.5-turbo';
    
    await openai.chat.completions.create({
      model: deployment,
      messages: [{ role: 'user', content: 'Test connection' }],
      max_tokens: 5,
      temperature: 0
    });

    return {
      status: 'healthy',
      endpoint: azureOpenAIConfig.endpoint || 'api.openai.com',
      deployments: azureOpenAIConfig.deployments,
      isAzure: isAzureOpenAI
    };
  } catch (error) {
    console.error('Azure OpenAI health check failed:', error);
    return {
      status: 'unhealthy',
      endpoint: azureOpenAIConfig.endpoint || 'api.openai.com',
      deployments: azureOpenAIConfig.deployments,
      isAzure: isAzureOpenAI
    };
  }
}

export { azureOpenAIConfig, isAzureOpenAI };