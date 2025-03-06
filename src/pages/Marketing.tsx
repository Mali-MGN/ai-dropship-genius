
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Database, 
  Lock, 
  Layout, 
  Rocket, 
  CheckCircle, 
  Users, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getSEOMetadata } from '@/lib/utils';

const Marketing = () => {
  // Set SEO metadata
  const seoMetadata = getSEOMetadata(
    "AI-Powered Dropshipping Platform", 
    "Supercharge your dropshipping business with our AI-powered platform featuring Supabase integration, real-time data, and enhanced authentication."
  );
  
  // Update document title
  React.useEffect(() => {
    document.title = seoMetadata.title;
  }, []);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent animate-fade-in">
              Supercharge Your Dropshipping Business
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              AI-powered dropshipping platform for finding winning products, automating your store, 
              and scaling your business effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="animate-fade-in" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="animate-fade-in delay-150" asChild>
                <Link to="/products/discovery">Explore Features</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl animate-float">
            <img 
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1"
              alt="AI Dropship Genius Dashboard" 
              className="w-full h-auto rounded-lg transition-all hover:scale-105 duration-300" 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to build, manage, and scale your dropshipping empire
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Supabase Integration</h3>
              <p className="text-muted-foreground">
                Seamlessly connect to Supabase for powerful backend capabilities, 
                real-time data synchronization, and secure data storage.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Subscriptions</h3>
              <p className="text-muted-foreground">
                Get instant updates with real-time database subscriptions, ensuring 
                your data stays synchronized across all devices and team members.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enhanced Authentication</h3>
              <p className="text-muted-foreground">
                Secure your application with multiple authentication options, including
                email/password, social logins, and multi-factor authentication.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Layout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User-Friendly Interface</h3>
              <p className="text-muted-foreground">
                Intuitive and responsive design that makes managing your dropshipping
                business a breeze, even for beginners.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance & Scalability</h3>
              <p className="text-muted-foreground">
                Built for speed and growth, our platform handles everything from 
                startups to established businesses with millions of products.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-muted-foreground">
                Get intelligent suggestions and answers to your questions with our
                built-in AI assistant, helping you make better business decisions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it Works Section - New Section */}
      <section className="py-12 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Getting started with our platform is easy and straightforward
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4 text-xl font-bold">1</div>
            <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
            <p className="text-muted-foreground">
              Create your account in seconds and connect it to your existing stores or start a new one.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4 text-xl font-bold">2</div>
            <h3 className="text-xl font-semibold mb-2">Discover Products</h3>
            <p className="text-muted-foreground">
              Use our AI-powered tools to find trending products that match your niche and audience.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4 text-xl font-bold">3</div>
            <h3 className="text-xl font-semibold mb-2">Scale Your Business</h3>
            <p className="text-muted-foreground">
              Leverage analytics, marketing tools, and automation to grow your dropshipping empire.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Success stories from dropshippers who transformed their business with our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary/60 to-blue-400/60 mr-4 flex items-center justify-center text-white font-bold">SW</div>
                <div>
                  <h4 className="font-semibold">Sarah Wilson</h4>
                  <p className="text-sm text-muted-foreground">Fashion Dropshipper</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The AI product discovery feature helped me find trending products before my competitors. 
                I've increased my monthly revenue by 215% in just three months!"
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400/60 to-purple-400/60 mr-4 flex items-center justify-center text-white font-bold">MR</div>
                <div>
                  <h4 className="font-semibold">Michael Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">Tech Gadget Store Owner</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The real-time database and analytics tools give me instant insights into what's selling. 
                The platform practically pays for itself with the time I save."
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400/60 to-pink-400/60 mr-4 flex items-center justify-center text-white font-bold">ET</div>
                <div>
                  <h4 className="font-semibold">Emma Thompson</h4>
                  <p className="text-sm text-muted-foreground">Home Goods Entrepreneur</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "I was skeptical at first, but the integration with my existing store was seamless. 
                The AI assistant feels like having a business partner who's always available."
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Read More Success Stories <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Pricing Section - New Section */}
      <section className="py-12 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that works best for your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Starter</h3>
                <div className="text-4xl font-bold mb-2">$29<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                <p className="text-muted-foreground">Perfect for beginners</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Up to 100 products</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>AI product discovery (limited)</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/auth">Choose Starter</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary hover-scale relative">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg rounded-tr-lg">
              Popular
            </div>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Professional</h3>
                <div className="text-4xl font-bold mb-2">$79<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                <p className="text-muted-foreground">For growing businesses</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Up to 1,000 products</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Unlimited AI product discovery</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Multi-store management</span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link to="/auth">Choose Professional</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="text-4xl font-bold mb-2">$199<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                <p className="text-muted-foreground">For large operations</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Unlimited products</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Custom analytics & reporting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>24/7 dedicated support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced AI features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>White-labeling options</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>API access</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/auth">Contact Sales</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 border-t">
        <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Dropshipping Business?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of successful dropshippers who are scaling their business with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="animate-pulse-soft" asChild>
              <Link to="/auth">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/products/discovery">See It In Action</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>
      
      {/* FAQ Section - New Section */}
      <section className="py-12 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Got questions? We've got answers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2">How does the AI product discovery work?</h3>
            <p className="text-muted-foreground">
              Our AI analyzes millions of products across multiple marketplaces, considering factors like 
              trend data, profit margins, competition levels, and customer sentiment to identify winning products.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I integrate with my existing store?</h3>
            <p className="text-muted-foreground">
              Yes! We offer seamless integration with all major e-commerce platforms including Shopify, 
              WooCommerce, Magento, and more. Our one-click integration makes setup easy.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Is there a limit to how many products I can analyze?</h3>
            <p className="text-muted-foreground">
              Limits vary based on your subscription plan. Our Professional and Enterprise plans offer 
              significantly higher analysis capabilities for serious dropshippers.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">How secure is my data?</h3>
            <p className="text-muted-foreground">
              We take security seriously. All data is encrypted, and we use Supabase's enterprise-grade security 
              infrastructure with row-level security policies to ensure your business data stays private.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Marketing;
