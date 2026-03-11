import LogoWhite from "./logo-white";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-primary-dark overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/90 via-primary-dark/80 to-primary-dark/95" />

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <LogoWhite className="mx-auto mb-8 h-16 md:h-20 w-auto" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Enhanced Living,{" "}
          <span className="text-accent">Empowered Lives</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Providing quality respite and residential disability care services
          across Victoria, supporting individuals to live their best lives with
          dignity and purpose.
        </p>
        <a
          href="#about"
          className="inline-block bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-accent transition-colors"
        >
          Read More
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>
    </section>
  );
}
