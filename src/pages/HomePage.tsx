import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  Rocket, 
  ChevronDown,
  BarChart3,
  Users,
  Globe,
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  Layers,
  Activity,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Particle System Component
const ParticleField: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// 3D Rotating Cube Component
const Cube3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      className={`relative w-20 h-20 ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      animate={{ rotateX: 360, rotateY: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {/* Front */}
      <div className="absolute w-full h-full bg-gradient-to-br from-primary/40 to-primary/20 border border-primary/50 backdrop-blur-sm" 
           style={{ transform: 'translateZ(40px)' }} />
      {/* Back */}
      <div className="absolute w-full h-full bg-gradient-to-br from-success/40 to-success/20 border border-success/50 backdrop-blur-sm" 
           style={{ transform: 'rotateY(180deg) translateZ(40px)' }} />
      {/* Left */}
      <div className="absolute w-full h-full bg-gradient-to-br from-warning/40 to-warning/20 border border-warning/50 backdrop-blur-sm" 
           style={{ transform: 'rotateY(-90deg) translateZ(40px)' }} />
      {/* Right */}
      <div className="absolute w-full h-full bg-gradient-to-br from-danger/40 to-danger/20 border border-danger/50 backdrop-blur-sm" 
           style={{ transform: 'rotateY(90deg) translateZ(40px)' }} />
      {/* Top */}
      <div className="absolute w-full h-full bg-gradient-to-br from-primary/60 to-success/40 border border-primary/50 backdrop-blur-sm" 
           style={{ transform: 'rotateX(90deg) translateZ(40px)' }} />
      {/* Bottom */}
      <div className="absolute w-full h-full bg-gradient-to-br from-danger/40 to-warning/20 border border-danger/50 backdrop-blur-sm" 
           style={{ transform: 'rotateX(-90deg) translateZ(40px)' }} />
    </motion.div>
  );
};

// Glassmorphic Card
const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
  hover3D?: boolean;
}> = ({ children, className = '', delay = 0, hover3D = true }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateY((x - centerX) / 10);
    setRotateX(-(y - centerY) / 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay, type: "spring", stiffness: 100 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transform-gpu ${className}`}
      style={{ 
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated Background with Multiple Layers
const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
           style={{
             backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
             backgroundSize: '50px 50px'
           }} />
      
      {/* Large orbs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
          top: '-20%',
          left: '-10%',
        }}
        animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--success) / 0.1) 0%, transparent 70%)',
          top: '30%',
          right: '-10%',
        }}
        animate={{ x: [0, -80, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--warning) / 0.08) 0%, transparent 70%)',
          bottom: '10%',
          left: '20%',
        }}
        animate={{ x: [0, 60, 0], y: [0, -80, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute w-32 h-32 border border-primary/20 rounded-2xl"
        style={{ top: '15%', right: '15%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-24 h-24 border border-success/20 rotate-45"
        style={{ bottom: '20%', left: '10%' }}
        animate={{ rotate: [45, 405] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

// 3D Holographic Token Card
const HolographicTokenCard: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1, type: "spring" }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
    >
      <div 
        className="relative p-8 rounded-3xl overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, 
              hsl(var(--card)) 0%, 
              hsl(var(--card-elevated)) 50%, 
              hsl(var(--card)) 100%)
          `,
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateY(${(mousePos.x - 0.5) * 20}deg) rotateX(${-(mousePos.y - 0.5) * 20}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Holographic overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                ${135 + mousePos.x * 90}deg,
                transparent 0%,
                hsl(var(--primary) / 0.3) 25%,
                hsl(var(--success) / 0.3) 50%,
                hsl(var(--warning) / 0.3) 75%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Border glow */}
        <div className="absolute inset-0 rounded-3xl border border-primary/30" />
        <div className="absolute inset-0 rounded-3xl shadow-glow" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-success flex items-center justify-center shadow-glow"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Zap className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">PULSE</h3>
              <p className="text-sm text-muted-foreground">Token Discovery</p>
            </div>
            <motion.div 
              className="ml-auto px-4 py-2 rounded-xl bg-success/20 border border-success/30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-success font-mono font-bold">+142.5%</span>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Market Cap', value: '$12.8M', icon: BarChart3, color: 'primary' },
              { label: 'Volume 24h', value: '$3.4M', icon: Activity, color: 'success' },
              { label: 'Holders', value: '24.5K', icon: Users, color: 'warning' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="p-4 rounded-xl bg-secondary/30 border border-border/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <stat.icon className={`w-4 h-4 text-${stat.color} mb-2`} />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold font-mono text-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Mini chart visualization */}
          <div className="h-16 flex items-end gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-primary to-success rounded-t"
                initial={{ height: 0 }}
                whileInView={{ height: `${30 + Math.random() * 70}%` }}
                transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
              />
            ))}
          </div>
        </div>

        {/* Floating decorations */}
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-primary/10 blur-2xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-success/10 blur-xl"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Shadow layers for depth */}
      <div className="absolute top-4 left-4 right-4 -bottom-4 rounded-3xl bg-primary/5 -z-10" />
      <div className="absolute top-8 left-8 right-8 -bottom-8 rounded-3xl bg-primary/3 -z-20" />
    </motion.div>
  );
};

// Feature Card with 3D effect
const FeatureCard3D: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  gradient: string;
}> = ({ icon, title, description, delay, gradient }) => (
  <GlassCard delay={delay}>
    <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-card/80 to-card-elevated/80 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden h-full">
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 ${gradient} opacity-10`} />
      </div>
      
      {/* Icon with glow */}
      <motion.div 
        className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
        whileHover={{ rotateY: 180 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl group-hover:blur-2xl transition-all" />
        {icon}
      </motion.div>

      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute top-4 right-4 w-16 h-16 ${gradient} rounded-full blur-2xl`} />
      </div>
    </div>
  </GlassCard>
);

// Animated Stats with Counter
const AnimatedStat: React.FC<{
  value: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}> = ({ value, label, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay, type: "spring" }}
    viewport={{ once: true }}
    className="relative text-center group"
  >
    <motion.div
      className="absolute inset-0 bg-primary/5 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      whileHover={{ scale: 1.1 }}
    />
    <div className="p-6">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <motion.p 
        className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: delay + 0.3 }}
        viewport={{ once: true }}
      >
        {value}
      </motion.p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  </motion.div>
);

// Floating Navigation
const FloatingNav: React.FC = () => (
  <motion.nav
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, type: "spring" }}
    className="fixed top-0 left-0 right-0 z-50 p-4"
  >
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between px-6 py-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-elevated">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-glow"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Zap className="w-6 h-6 text-primary-foreground" />
          </motion.div>
          <span className="text-xl font-bold text-foreground">Pulse</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {['Features', 'Stats', 'About'].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-muted-foreground hover:text-foreground transition-colors relative group"
              whileHover={{ y: -2 }}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </div>

        <Link to="/pulse">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="glow" className="gap-2 shadow-glow">
              Launch App
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </Link>
      </div>
    </div>
  </motion.nav>
);

// Main HomePage Component
const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, -150]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 0.9]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden scroll-smooth">
      <AnimatedBackground />
      <ParticleField />
      <FloatingNav />

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-4 pt-24"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating 3D elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute top-20 left-10 perspective-1000"
              animate={{ y: [0, -20, 0], rotateZ: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Cube3D className="opacity-40" />
            </motion.div>
            <motion.div
              className="absolute bottom-40 right-20 perspective-1000"
              animate={{ y: [0, 20, 0], rotateZ: [0, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            >
              <Cube3D className="opacity-30 scale-75" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 mb-8 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-sm text-primary font-semibold">Real-time Token Discovery</span>
              <motion.div
                className="w-2 h-2 rounded-full bg-success"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            
            {/* Main Heading with 3D effect */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8">
              <motion.span 
                className="block text-foreground"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                The Future of
              </motion.span>
              <motion.span 
                className="block text-gradient-primary relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Token Trading
                <motion.div
                  className="absolute -inset-4 bg-primary/5 rounded-3xl -z-10 blur-2xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Discover new tokens before anyone else. Track migrations, analyze holders, 
              and execute trades with lightning speed.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Link to="/pulse">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -3 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/80 to-success rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                  <Button size="lg" variant="glow" className="relative gap-3 text-lg px-10 py-7 rounded-xl">
                    <Rocket className="w-6 h-6" />
                    Start Trading
                    <motion.span
                      className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="gap-3 text-lg px-10 py-7 rounded-xl bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card hover:border-primary/50">
                  <Eye className="w-5 h-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground">Scroll to explore</span>
              <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 3D Token Preview Section */}
      <section className="relative py-24 sm:py-40 px-4" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, type: "spring" }}
              viewport={{ once: true }}
            >
              <motion.span
                className="inline-block px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Layers className="w-4 h-4 inline mr-2" />
                Advanced Analytics
              </motion.span>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Real-Time
                <br />
                <span className="text-gradient-primary">Token Intelligence</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Track new token launches, monitor bonding curves, and catch migrations 
                before the crowd. Our advanced analytics give you the edge you need to 
                make informed trading decisions.
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'New Pairs', icon: Sparkles },
                  { label: 'Final Stretch', icon: TrendingUp },
                  { label: 'Migrated', icon: Rocket }
                ].map((tab, i) => (
                  <motion.span 
                    key={tab.label}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/30 transition-all cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <tab.icon className="w-4 h-4 text-primary" />
                    {tab.label}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <HolographicTokenCard />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 sm:py-40 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-lg bg-success/10 text-success text-sm font-semibold mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Star className="w-4 h-4 inline mr-2" />
              Why Choose Us
            </motion.span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay ahead in the fast-moving world of token trading.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard3D
              icon={<Zap className="w-7 h-7 text-primary" />}
              title="Lightning Fast"
              description="Real-time updates with WebSocket connections. Never miss a beat in the fast-paced crypto markets."
              delay={0.1}
              gradient="bg-gradient-to-br from-primary to-primary/50"
            />
            <FeatureCard3D
              icon={<Shield className="w-7 h-7 text-success" />}
              title="Risk Analysis"
              description="Advanced holder distribution analysis to identify potential risks and protect your investments."
              delay={0.2}
              gradient="bg-gradient-to-br from-success to-success/50"
            />
            <FeatureCard3D
              icon={<TrendingUp className="w-7 h-7 text-warning" />}
              title="Price Tracking"
              description="Live price updates with visual indicators for quick and informed trading decisions."
              delay={0.3}
              gradient="bg-gradient-to-br from-warning to-warning/50"
            />
            <FeatureCard3D
              icon={<BarChart3 className="w-7 h-7 text-primary" />}
              title="Market Analytics"
              description="Deep insights into market cap, volume, and transaction data to understand market dynamics."
              delay={0.4}
              gradient="bg-gradient-to-br from-primary to-success"
            />
            <FeatureCard3D
              icon={<Users className="w-7 h-7 text-success" />}
              title="Holder Insights"
              description="See top holders, dev wallets, and sniper activity at a glance for complete transparency."
              delay={0.5}
              gradient="bg-gradient-to-br from-success to-warning"
            />
            <FeatureCard3D
              icon={<Globe className="w-7 h-7 text-warning" />}
              title="Social Integration"
              description="Quick links to Twitter, Telegram, and official websites for comprehensive research."
              delay={0.6}
              gradient="bg-gradient-to-br from-warning to-danger"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 sm:py-40 px-4" id="stats">
        <div className="max-w-6xl mx-auto">
          <GlassCard delay={0} hover3D={false}>
            <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-card/80 to-card-elevated/80 backdrop-blur-xl border border-border/50 relative overflow-hidden">
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-success/5" />
              <motion.div
                className="absolute top-0 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-primary/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
                <AnimatedStat 
                  value="1M+" 
                  label="Tokens Tracked" 
                  icon={<Layers className="w-6 h-6 text-primary" />}
                  delay={0.1} 
                />
                <AnimatedStat 
                  value="50K+" 
                  label="Active Users" 
                  icon={<Users className="w-6 h-6 text-success" />}
                  delay={0.2} 
                />
                <AnimatedStat 
                  value="<1s" 
                  label="Update Speed" 
                  icon={<Zap className="w-6 h-6 text-warning" />}
                  delay={0.3} 
                />
                <AnimatedStat 
                  value="99.9%" 
                  label="Uptime" 
                  icon={<Shield className="w-6 h-6 text-primary" />}
                  delay={0.4} 
                />
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-40 px-4" id="about">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block mb-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary to-success flex items-center justify-center shadow-glow">
                <Rocket className="w-10 h-10 text-primary-foreground" />
              </div>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              Ready to Start?
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of traders who are already using Pulse to discover 
              the next big opportunity in the crypto market.
            </p>
            
            <Link to="/pulse">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }} 
                whileTap={{ scale: 0.95 }}
                className="inline-block relative group"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-primary via-success to-primary rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity animate-pulse" />
                <Button size="lg" variant="glow" className="relative gap-3 text-xl px-12 py-8 rounded-xl">
                  <Rocket className="w-6 h-6" />
                  Launch App Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Made by</span>
              <span className="text-foreground font-semibold">Ayan Chatterjee</span>
              <span>with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-5 h-5 text-danger fill-danger" />
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Pulse. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
