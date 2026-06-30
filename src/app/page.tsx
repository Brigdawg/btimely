import Link from "next/link";
import { Sparkles, TrendingUp, Upload, Brain, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="sm" href="/" />
          <nav className="flex items-center gap-4">
            <Link
              href="/app"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/app"
              className="text-sm font-medium brand-gradient text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
            >
              Get started free
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="pt-28 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <div className="flex justify-center mb-8">
              <Logo size="xl" showText={false} />
            </div>
            <div className="inline-flex items-center gap-2 bg-white/80 border border-border rounded-full px-4 py-1.5 text-sm text-muted mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              AI estimates that learn your pace
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6 text-navy">
              Know how long things{" "}
              <span className="brand-gradient-text">actually</span> take
            </h1>
            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload an assignment, describe a task, or explain what you need to do.
              BTimely estimates the time — then learns from your feedback to get
              eerily accurate over time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 brand-gradient text-white px-8 py-3.5 rounded-full font-medium text-lg hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/25"
              >
                Try it free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-muted">No account required to start</p>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: "Describe or upload",
                desc: "Paste your assignment, type what you need to do, or upload a text file.",
              },
              {
                icon: Brain,
                title: "Get a smart estimate",
                desc: "AI breaks down the task and gives you a realistic time estimate with reasoning.",
              },
              {
                icon: TrendingUp,
                title: "Learn your habits",
                desc: "Tell us how long it actually took. BTimely adapts to your personal pace.",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="bg-card rounded-2xl p-6 card-shadow border border-border animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-navy">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 px-6 bg-white/60">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-navy">Built for students &amp; professionals</h2>
            <p className="text-muted mb-12 leading-relaxed">
              Whether it&apos;s a history essay, a work presentation, or cleaning the garage —
              stop guessing and start planning with estimates tailored to <em>you</em>.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                "🎓 \"Will this essay take 2 hours or 6?\"",
                "💼 \"How long is this report actually going to take?\"",
                "📚 \"Can I finish these readings tonight?\"",
                "🏠 \"Realistically, when can I finish this project?\"",
              ].map((q) => (
                <div
                  key={q}
                  className="bg-card rounded-xl p-4 border border-border text-sm"
                >
                  {q}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Logo size="lg" className="justify-center mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-navy">Ready to plan smarter?</h2>
            <p className="text-muted mb-8">
              Start with your first task. It takes less than a minute.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 brand-gradient text-white px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-accent/20"
            >
              Open BTimely
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted">
        <div className="flex justify-center mb-3">
          <Logo size="sm" showText={false} />
        </div>
        <p>© {new Date().getFullYear()} BTimely. Time estimates that get better with you.</p>
      </footer>
    </div>
  );
}
