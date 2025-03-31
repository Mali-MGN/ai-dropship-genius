
export interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  features: string[];
  pricing: string;
  category: string;
}

export const aiTools: AITool[] = [
  {
    id: "openai",
    name: "ChatGPT",
    description: "Leading conversational AI with capabilities across text generation, translation, and creative tasks.",
    url: "https://chat.openai.com",
    imageUrl: "/placeholder.svg?height=40&width=40",
    features: [
      "Natural language understanding and generation",
      "Code assistance and explanations",
      "Content creation and summarization"
    ],
    pricing: "Free tier with premium plans starting at $20/month",
    category: "chat"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "Create stunning artwork and illustrations from text prompts with this AI image generator.",
    url: "https://midjourney.com",
    imageUrl: "/placeholder.svg?height=40&width=40",
    features: [
      "High-quality image generation from text",
      "Style customization and fine-tuning",
      "Rapid iterations and variations"
    ],
    pricing: "Plans starting at $10/month",
    category: "image"
  },
  {
    id: "jasper",
    name: "Jasper AI",
    description: "AI writing assistant specialized for marketing content and copywriting.",
    url: "https://jasper.ai",
    imageUrl: "/placeholder.svg?height=40&width=40",
    features: [
      "Blog posts and article writing",
      "Marketing copy and social media content",
      "SEO optimization suggestions"
    ],
    pricing: "Starting at $39/month",
    category: "writing"
  }
];

// Helper functions for AIToolExplorer
export function getAllCategories(): string[] {
  const categories = [...new Set(aiTools.map(tool => tool.category))];
  return categories;
}

export function getToolsByCategory(category: string): AITool[] {
  return aiTools.filter(tool => tool.category === category);
}

export function getCategoryLabel(category: string): string {
  const categoryLabels: Record<string, string> = {
    "chat": "Chat AI",
    "image": "Image Generation",
    "writing": "Content Writing",
    "audio": "Audio Processing",
    "video": "Video Creation"
  };
  
  return categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1);
}
