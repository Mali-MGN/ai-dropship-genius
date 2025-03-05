
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

const Marketing = () => {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Supercharge Your Dropshipping Business
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              AI-powered dropshipping platform for finding winning products, automating your store, 
              and scaling your business effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/products/discovery">Explore Features</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img 
              src="/placeholder.svg" 
              alt="AI Dropship Genius Dashboard" 
              className="w-full h-auto" 
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
          <Card>
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
          
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Subscriptions</h3>
              <p className="text-muted-foreground">
                Get instant updates with real-time database subscriptions, ensuring 
                your data stays synchronized across all devices.
              </p>
            </CardContent>
          </Card>
          
          <Card>
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
          
          <Card>
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
          
          <Card>
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
          
          <Card>
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

      {/* Testimonials Section */}
      <section className="py-12 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Success stories from dropshippers who transformed their business with our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Fashion Dropshipper</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The AI product discovery feature helped me find trending products before my competitors. 
                I've increased my monthly revenue by 215% in just three months!"
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
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

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
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

      {/* CTA Section */}
      <section className="py-12 border-t">
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Dropshipping Business?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of successful dropshippers who are scaling their business with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/auth">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg">
              Schedule a Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Marketing;
