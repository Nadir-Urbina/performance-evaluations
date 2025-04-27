import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle, Clock, CloudUpload, Code, FileText, LineChart, MessageSquare, Settings, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Simple Evaluation</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">How It Works</Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hidden sm:block hover:text-primary">
              Sign In
            </Link>
            <Link href="/register">
              <Button className="rounded-full">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 py-20 md:py-32 bg-gradient-to-b from-white to-blue-50 dark:from-background dark:to-background/80">
          <div className="container flex flex-col items-center text-center">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
              Simplified Performance Evaluations
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 md:mb-6 max-w-3xl">
              Performance evaluations that <span className="text-primary">drive growth</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Say goodbye to complex, time-consuming performance reviews. Simple Evaluation helps small and medium businesses provide meaningful feedback that employees actually value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="rounded-full px-8">
                  Start Free Trial 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  See How It Works
                </Button>
              </Link>
            </div>
            <div className="mt-16 relative w-full max-w-5xl">
              <div className="rounded-xl overflow-hidden border shadow-xl">
                <div className="bg-gray-100 dark:bg-gray-800 aspect-video w-full relative">
                  {/* Replace with actual dashboard screenshot */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Dashboard Preview Image
                  </div>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 -z-10 h-1/3 w-1/3 rounded-full bg-primary/20 blur-3xl"></div>
              <div className="absolute -left-6 -top-6 -z-10 h-1/3 w-1/3 rounded-full bg-blue-500/20 blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="px-4 py-20 bg-white dark:bg-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why traditional performance reviews fail</h2>
              <p className="text-lg text-muted-foreground">
                Small businesses need feedback systems that work efficiently without enterprise-level complexity
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Clock className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Time-consuming processes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The average manager spends 17 hours per employee on traditional performance reviews each year.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Code className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Overly complex systems</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    73% of managers find traditional performance management systems too complex and difficult to use effectively.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <MessageSquare className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Lack of meaningful feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Only 14% of employees strongly agree that performance reviews inspire them to improve.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Solution Overview */}
        <section className="px-4 py-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">Our Approach</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Simple. Flexible. Actionable.
              </h2>
              <p className="text-lg text-muted-foreground">
                Simple Evaluation reimagines performance reviews for modern small businesses
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="rounded-xl overflow-hidden border shadow-xl">
                  <div className="bg-gray-100 dark:bg-gray-800 aspect-video w-full relative">
                    {/* Replace with actual product screenshot */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Solution Overview Image
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 bg-primary/10 rounded-full p-2 h-fit">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Save valuable time</h3>
                    <p className="text-muted-foreground">
                      Spend 70% less time on administrative tasks with streamlined templates and automated workflows.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-primary/10 rounded-full p-2 h-fit">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Customizable to your needs</h3>
                    <p className="text-muted-foreground">
                      Easily adapt evaluation forms and workflows to match your organization's unique structure and values.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-primary/10 rounded-full p-2 h-fit">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Data-driven insights</h3>
                    <p className="text-muted-foreground">
                      Track employee growth over time with visual analytics that highlight progress and development areas.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-primary/10 rounded-full p-2 h-fit">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Collaborative process</h3>
                    <p className="text-muted-foreground">
                      Involve the right stakeholders with flexible approval flows and transparent evaluation processes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <section id="features" className="px-4 py-20 bg-white dark:bg-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Features designed for real businesses</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to run effective performance evaluations, without unnecessary complexity
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="p-2 w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-2">
                    <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">Customizable evaluations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create evaluation templates specific to each role, department, or seniority level.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="p-2 w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 mb-2">
                    <CloudUpload className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Easy team setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Import your entire team with a simple CSV upload or add employees individually with ease.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="p-2 w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 mb-2">
                    <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">Approval workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Define multi-level approval processes to ensure evaluations are reviewed by the right people.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="p-2 w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 mb-2">
                    <LineChart className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-xl">Analytics & insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Track performance trends and identify development opportunities with visual analytics.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="px-4 py-20 bg-blue-50 dark:bg-blue-950/10">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How Simple Evaluation works</h2>
              <p className="text-lg text-muted-foreground">
                Start providing meaningful feedback in just a few simple steps
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary w-12 h-12 flex items-center justify-center text-white font-bold text-xl mb-6">1</div>
                <h3 className="text-xl font-semibold mb-2">Set up your team</h3>
                <p className="text-muted-foreground mb-4">
                  Add your employees, define job functions, and create custom questions that align with your values.
                </p>
                <div className="mt-auto rounded-lg border overflow-hidden">
                  <div className="bg-gray-100 dark:bg-gray-800 aspect-video w-full relative">
                    {/* Replace with actual step screenshot */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Step 1 Image
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary w-12 h-12 flex items-center justify-center text-white font-bold text-xl mb-6">2</div>
                <h3 className="text-xl font-semibold mb-2">Create evaluations</h3>
                <p className="text-muted-foreground mb-4">
                  Assign evaluations to employees with job-specific questions and define approval workflows.
                </p>
                <div className="mt-auto rounded-lg border overflow-hidden">
                  <div className="bg-gray-100 dark:bg-gray-800 aspect-video w-full relative">
                    {/* Replace with actual step screenshot */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Step 2 Image
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary w-12 h-12 flex items-center justify-center text-white font-bold text-xl mb-6">3</div>
                <h3 className="text-xl font-semibold mb-2">Review and analyze</h3>
                <p className="text-muted-foreground mb-4">
                  Provide feedback, approve evaluations, and track performance trends with visual analytics.
                </p>
                <div className="mt-auto rounded-lg border overflow-hidden">
                  <div className="bg-gray-100 dark:bg-gray-800 aspect-video w-full relative">
                    {/* Replace with actual step screenshot */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Step 3 Image
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 py-20 bg-white dark:bg-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">What our customers say</h2>
              <p className="text-lg text-muted-foreground">
                Businesses of all sizes are transforming their performance management with Simple Evaluation
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <CardTitle className="text-lg">
                    "Complete game-changer for our quarterly reviews"
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "We used to dread performance reviews. Simple Evaluation made the process 3x faster and our employees actually look forward to receiving feedback now."
                  </p>
                </CardContent>
                <CardFooter>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">HR Director, Nimble Tech</p>
                  </div>
                </CardFooter>
              </Card>
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <CardTitle className="text-lg">
                    "Perfect for our growing team"
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "As we scaled from 10 to 50 employees, we needed a system that could grow with us. Simple Evaluation provided just the right balance of structure and flexibility."
                  </p>
                </CardContent>
                <CardFooter>
                  <div>
                    <p className="font-medium">Michael Chen</p>
                    <p className="text-sm text-muted-foreground">CEO, GrowthLab Solutions</p>
                  </div>
                </CardFooter>
              </Card>
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <CardTitle className="text-lg">
                    "Finally, evaluations that actually improve performance"
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "The analytics feature helped us identify skill gaps across departments. We've seen a 27% improvement in team performance since implementing Simple Evaluation."
                  </p>
                </CardContent>
                <CardFooter>
                  <div>
                    <p className="font-medium">Jessica Williams</p>
                    <p className="text-sm text-muted-foreground">COO, Bright Financial</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-4 py-20 bg-blue-50 dark:bg-blue-950/10">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
              <p className="text-lg text-muted-foreground mb-6">
                No hidden fees or complicated tiers
              </p>
              <div className="inline-flex items-center p-1 bg-white dark:bg-gray-800 rounded-full border mb-8">
                <button className="py-2 px-4 rounded-full bg-primary text-white font-medium">Monthly</button>
                <button className="py-2 px-4 rounded-full text-muted-foreground font-medium">Annual (Save 20%)</button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border border-gray-200 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl">Team</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$9</span>
                    <span className="text-muted-foreground ml-1">per user/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-muted-foreground mb-6">
                    Perfect for small teams looking to streamline their evaluation process.
                  </p>
                  <ul className="space-y-3">
                    {["Up to 25 employees", "Custom evaluation templates", "Unlimited evaluations", "Basic approval workflows", "CSV employee import", "Email notifications"].map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-full">Start free trial</Button>
                </CardFooter>
              </Card>
              <Card className="border-2 border-primary">
                <CardHeader>
                  <Badge className="mb-1 px-3 py-1 bg-primary/10 text-primary border-primary/20">Most Popular</Badge>
                  <CardTitle className="text-2xl">Business</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$15</span>
                    <span className="text-muted-foreground ml-1">per user/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-muted-foreground mb-6">
                    Ideal for growing organizations that need advanced evaluation features.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Unlimited employees",
                      "Advanced analytics dashboard",
                      "Multi-level approval workflows",
                      "Performance trend tracking",
                      "Job function libraries",
                      "Question bank templates",
                      "Custom branding options",
                      "Priority support"
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-full" variant="default">Start free trial</Button>
                </CardFooter>
              </Card>
            </div>
            <div className="mt-12 text-center max-w-2xl mx-auto">
              <p className="text-muted-foreground">
                All plans include a 14-day free trial. No credit card required until you're ready to upgrade.
              </p>
              <p className="mt-2 text-muted-foreground">
                Need a custom solution for a larger organization? <Link href="#" className="text-primary font-medium hover:underline">Contact us</Link> about our Enterprise options.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-4 py-20 bg-white dark:bg-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about Simple Evaluation
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">How long does implementation take?</h3>
                <p className="text-muted-foreground">
                  Most teams are up and running in less than an hour. The CSV import feature allows you to quickly add your entire team, and our pre-built templates give you a head start on creating evaluations.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Can I customize the evaluation questions?</h3>
                <p className="text-muted-foreground">
                  Absolutely! You can create custom questions specific to each job function or department. Our platform also comes with a library of proven evaluation questions that you can use as a starting point.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">How secure is our data?</h3>
                <p className="text-muted-foreground">
                  We take security seriously. All data is encrypted both in transit and at rest. We're GDPR compliant, and we never share your data with third parties. Each organization's data is completely isolated.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Can employees see their evaluations?</h3>
                <p className="text-muted-foreground">
                  Yes, transparency is important. You control when and how employees can access their evaluations. You can choose to make evaluations visible immediately or after an approval process is complete.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Do you offer onboarding support?</h3>
                <p className="text-muted-foreground">
                  Yes! All plans include access to our knowledge base and email support. Business plans include priority support and personalized onboarding sessions to help you get the most out of Simple Evaluation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-16 md:py-24 bg-primary text-white">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your performance evaluation process?</h2>
              <p className="text-xl mb-8 text-white/90">
                Join hundreds of businesses that have simplified their evaluations and improved team performance.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="rounded-full px-8 text-primary">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="rounded-full px-8 text-white border-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-white/80">
                No credit card required. 14-day free trial. Cancel anytime.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40">
        <div className="container px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold">Simple Evaluation</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Performance evaluations that drive growth and development for small and medium businesses.
              </p>
              <div className="flex gap-3">
                {/* Social links */}
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-muted-foreground hover:text-primary">Features</Link></li>
                <li><Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary">How It Works</Link></li>
                <li><Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Help Center</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Webinars</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Case Studies</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Simple Evaluation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
