import { Link } from '@tanstack/react-router'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { Check, Download, PlayCircle, Quote, Star, Tv } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Utility functions from stackrant tutorial
const round = (num: number, fix = 2) => parseFloat(num.toFixed(fix))

// HoverCard component with glare effect
const HoverCard = ({
  children,
  className = '',
  variants,
}: {
  children: React.ReactNode
  className?: string
  variants?: any
}) => {
  const [isAnimating, setAnimating] = useState(false)
  const isAnimatingReference = useRef(isAnimating)

  // Use motion values for instant glare updates
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareOpacity = useMotionValue(0)

  // Create the radial gradient using motion template
  const glareBackground = useMotionTemplate`radial-gradient(
    farthest-corner circle at ${glareX}% ${glareY}%,
    rgba(255, 255, 255, ${glareOpacity}) 10%,
    rgba(255, 255, 255, 0) 50%
  )`

  // Update the ref when isAnimating changes
  isAnimatingReference.current = isAnimating

  const animate = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnimating(true)

    const rect = event.currentTarget.getBoundingClientRect()

    const absolute = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    const percent = {
      x: round((100 / rect.width) * absolute.x),
      y: round((100 / rect.height) * absolute.y),
    }

    // Update glare motion values directly - no React render cycle!
    glareX.set(percent.x)
    glareY.set(percent.y)
    glareOpacity.set(0.15)
  }

  const stopAnimating = () => {
    setAnimating(false)

    // Reset glare motion values
    glareX.set(50)
    glareY.set(50)
    glareOpacity.set(0)
  }

  return (
    <motion.div
      variants={variants}
      onMouseMove={animate}
      onMouseLeave={stopAnimating}
      animate={{}}
      whileHover={{ scale: 1.05 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className={className}
      style={{
        userSelect: 'none',
      }}
    >
      {/* Glare effect overlay */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '1rem',
          pointerEvents: 'none',
          zIndex: 1,
          mixBlendMode: 'overlay' as const,
          background: glareBackground,
          overflow: 'hidden',
        }}
      />
      {children}
    </motion.div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
    },
  },
}

const features = [
  {
    icon: <PlayCircle className="w-8 h-8" />,
    title: 'Unlimited Streaming',
    description:
      'Watch thousands of theater performances from around the world',
  },
  {
    icon: <Download className="w-8 h-8" />,
    title: 'Offline Downloads',
    description: 'Download your favorite plays and watch them offline anywhere',
  },
  {
    icon: <Tv className="w-8 h-8" />,
    title: 'Multiple Devices',
    description: 'Stream on TV, laptop, tablet, and mobile with seamless sync',
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: 'Exclusive Content',
    description: 'Access rare performances and exclusive theater recordings',
  },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Limited theater plays',
      'Standard definition (480p)',
      'Ads between acts',
      '1 device',
    ],
    popular: false,
    cta: 'Get Started',
  },
  {
    name: 'Standard',
    price: '$9.99',
    period: 'per month',
    description: 'Our most popular plan',
    features: [
      'Unlimited theater plays',
      'High definition (1080p)',
      'No advertisements',
      'Download for offline viewing',
      '2 devices simultaneously',
    ],
    popular: true,
    cta: 'Start Free Trial',
  },
  {
    name: 'Premium',
    price: '$15.99',
    period: 'per month',
    description: 'The ultimate theater experience',
    features: [
      'Everything in Standard',
      'Ultra HD (4K) quality',
      'Exclusive premieres',
      'Behind-the-scenes content',
      '4 devices simultaneously',
      'Priority customer support',
    ],
    popular: false,
    cta: 'Start Free Trial',
  },
]

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Theater Enthusiast',
    content:
      'TiyatroFlix has completely changed how I experience theater. I can now watch world-class performances from my living room!',
    rating: 5,
    avatar: 'SM',
  },
  {
    name: 'James Rodriguez',
    role: 'Drama Teacher',
    content:
      "As an educator, this platform is invaluable. My students can access performances they'd never see otherwise.",
    rating: 5,
    avatar: 'JR',
  },
  {
    name: 'Emma Thompson',
    role: 'Broadway Fan',
    content:
      "The quality is incredible and the selection is amazing. It's like having front-row seats to every show!",
    rating: 5,
    avatar: 'ET',
  },
]

const featuredPlays = [
  {
    title: 'Hamlet - RSC Production',
    genre: 'Drama',
    year: '2024',
    rating: '★★★★★',
    thumbnail: 'bg-gradient-to-br from-blue-600 to-purple-600',
  },
  {
    title: 'The Lion King - Broadway',
    genre: 'Musical',
    year: '2023',
    rating: '★★★★☆',
    thumbnail: 'bg-gradient-to-br from-yellow-600 to-orange-600',
  },
  {
    title: 'Death of a Salesman',
    genre: 'Drama',
    year: '2024',
    rating: '★★★★★',
    thumbnail: 'bg-gradient-to-br from-gray-600 to-slate-600',
  },
  {
    title: 'Chicago - West End',
    genre: 'Musical',
    year: '2023',
    rating: '★★★★☆',
    thumbnail: 'bg-gradient-to-br from-red-600 to-pink-600',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div className="text-center space-y-8" variants={itemVariants}>
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              TiyatroFlix
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Stream thousands of world-class theater performances anywhere,
              anytime. Your front-row seat to the world's greatest stages.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={itemVariants}
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link to="/signup" search={{ redirect: '/dashboard' }}>
                  Start Watching Free
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 px-8 py-3 rounded-full font-semibold"
              >
                <Link to="/login" search={{ redirect: '/dashboard' }}>
                  Sign In
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Plays Section */}
      <motion.section
        className="py-16 bg-slate-900/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 text-center">
              Featured This Month
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPlays.map((play, index) => (
                <motion.div
                  key={index}
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div
                    className={`${play.thumbnail} aspect-[3/4] rounded-lg relative overflow-hidden shadow-lg`}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg mb-1">
                        {play.title}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">
                          {play.genre} • {play.year}
                        </span>
                        <span className="text-yellow-400 text-sm">
                          {play.rating}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-24 bg-slate-800/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Why Choose TiyatroFlix?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience theater like never before with our cutting-edge
              streaming platform
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <HoverCard key={index} variants={itemVariants}>
                <Card className="bg-slate-800/20 backdrop-blur-md border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 h-full shadow-2xl">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </HoverCard>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        className="py-24 bg-gradient-to-r from-slate-800 to-slate-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start with our free plan or upgrade for the full theater
              experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <HoverCard
                key={index}
                variants={itemVariants}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card
                  className={`bg-slate-800/20 backdrop-blur-md border-slate-700/50 h-full flex flex-col ${
                    plan.popular
                      ? 'border-purple-500/50 shadow-lg shadow-purple-500/20'
                      : 'hover:border-purple-500/30'
                  } transition-all duration-300 shadow-2xl`}
                >
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-white text-2xl mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-400 ml-2">{plan.period}</span>
                    </div>
                    <CardDescription className="text-gray-400">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center text-gray-300"
                        >
                          <Check className="w-5 h-5 text-green-400 mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full mt-6 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                          : 'bg-slate-700 hover:bg-slate-600'
                      } text-white cursor-pointer`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </HoverCard>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-24 bg-slate-900/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              What Our Audience Says
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of theater lovers who've discovered their new
              favorite performances
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <HoverCard key={index} variants={itemVariants}>
                <Card className="bg-slate-800/20 backdrop-blur-md border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 h-full shadow-2xl">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-purple-400 mb-4" />
                    <p className="text-gray-300 leading-relaxed">
                      {testimonial.content}
                    </p>
                  </CardContent>
                </Card>
              </HoverCard>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-24 bg-gradient-to-r from-purple-600 to-pink-600"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Your Theater Journey Starts Now
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join millions of theater enthusiasts and discover performances
              that will move, inspire, and entertain you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white text-purple-600 hover:bg-gray-100 border-white px-8 py-3 rounded-full font-semibold"
              >
                <Link to="/signup" search={{ redirect: '/dashboard' }}>
                  Start Free Trial
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-purple-800 hover:bg-purple-900 text-white px-8 py-3 rounded-full font-semibold"
              >
                <Link to="/login" search={{ redirect: '/dashboard' }}>
                  Sign In
                </Link>
              </Button>
            </div>
            <p className="text-purple-200 text-sm mt-4">
              No credit card required • Cancel anytime • 30-day free trial
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
