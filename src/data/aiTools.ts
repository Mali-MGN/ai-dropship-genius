
export interface AITool {
  id: string;
  name: string;
  category: 'marketing' | 'analytics' | 'research' | 'operations' | 'customer-service';
  description: string;
  imageUrl: string;
  url: string;
  pricing: string;
  features: string[];
}

export const aiTools: AITool[] = [
  // Marketing Tools
  {
    id: 'mailchimp-ai',
    name: 'Mailchimp AI',
    category: 'marketing',
    description: 'AI-powered email marketing platform with audience segmentation and campaign optimization',
    imageUrl: 'https://logo.clearbit.com/mailchimp.com',
    url: 'https://mailchimp.com',
    pricing: 'Free tier available, paid plans from $11/month',
    features: ['Email automation', 'Audience segmentation', 'Campaign analytics', 'A/B testing']
  },
  {
    id: 'hootsuite-ai',
    name: 'Hootsuite AI',
    category: 'marketing',
    description: 'Social media management platform with AI-powered content suggestions and scheduling',
    imageUrl: 'https://logo.clearbit.com/hootsuite.com',
    url: 'https://hootsuite.com',
    pricing: 'From $49/month',
    features: ['Content scheduling', 'Performance analytics', 'Audience engagement', 'Multi-platform management']
  },
  {
    id: 'jasper-ai',
    name: 'Jasper',
    category: 'marketing',
    description: 'AI content creation platform for generating marketing copy, blog posts, and product descriptions',
    imageUrl: 'https://logo.clearbit.com/jasper.ai',
    url: 'https://jasper.ai',
    pricing: 'From $39/month',
    features: ['Blog post generation', 'Ad copy creation', 'Product descriptions', 'Email templates']
  },
  
  // Analytics Tools
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    category: 'analytics',
    description: 'AI-enhanced web analytics platform for tracking user behavior and generating insights',
    imageUrl: 'https://logo.clearbit.com/google.com',
    url: 'https://analytics.google.com',
    pricing: 'Free tier available',
    features: ['User behavior tracking', 'Conversion tracking', 'Audience insights', 'Predictive metrics']
  },
  {
    id: 'tableau',
    name: 'Tableau',
    category: 'analytics',
    description: 'Data visualization and business intelligence platform with AI-powered analytics',
    imageUrl: 'https://logo.clearbit.com/tableau.com',
    url: 'https://tableau.com',
    pricing: 'From $70/month',
    features: ['Interactive dashboards', 'Data visualization', 'Predictive analytics', 'Data integration']
  },
  
  // Research Tools
  {
    id: 'crayon',
    name: 'Crayon',
    category: 'research',
    description: 'AI-powered competitive intelligence platform for market and competitor analysis',
    imageUrl: 'https://logo.clearbit.com/crayon.co',
    url: 'https://crayon.co',
    pricing: 'Custom pricing',
    features: ['Competitor tracking', 'Market intelligence', 'Trend analysis', 'Alert system']
  },
  {
    id: 'semrush',
    name: 'SEMrush',
    category: 'research',
    description: 'Marketing research platform with AI-driven keyword analysis and content optimization',
    imageUrl: 'https://logo.clearbit.com/semrush.com',
    url: 'https://semrush.com',
    pricing: 'From $119.95/month',
    features: ['Keyword research', 'Competitor analysis', 'SEO auditing', 'Content marketing platform']
  },
  
  // Operations Tools
  {
    id: 'inventory-planner',
    name: 'Inventory Planner',
    category: 'operations',
    description: 'AI-powered inventory management system for forecasting and optimization',
    imageUrl: 'https://logo.clearbit.com/inventoryplanner.com',
    url: 'https://inventoryplanner.com',
    pricing: 'From $99/month',
    features: ['Demand forecasting', 'Stock level optimization', 'Replenishment recommendations', 'Supplier management']
  },
  
  // Customer Service Tools
  {
    id: 'intercom',
    name: 'Intercom',
    category: 'customer-service',
    description: 'Customer messaging platform with AI chatbots and automated support',
    imageUrl: 'https://logo.clearbit.com/intercom.com',
    url: 'https://intercom.com',
    pricing: 'From $74/month',
    features: ['Live chat', 'AI chatbots', 'Knowledge base', 'Customer data platform']
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    category: 'customer-service',
    description: 'Customer service software with AI-powered ticket routing and self-service',
    imageUrl: 'https://logo.clearbit.com/zendesk.com',
    url: 'https://zendesk.com',
    pricing: 'From $49/month',
    features: ['Ticket management', 'AI answer bot', 'Knowledge base', 'Customer portal']
  }
];

export const getToolsByCategory = (category: string) => {
  return aiTools.filter(tool => tool.category === category);
};

export const getAllCategories = () => {
  return ['marketing', 'analytics', 'research', 'operations', 'customer-service'];
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    'marketing': 'Marketing',
    'analytics': 'Analytics & Insights',
    'research': 'Research & Development',
    'operations': 'Operations Management',
    'customer-service': 'Customer Service'
  };
  
  return labels[category] || category;
};
