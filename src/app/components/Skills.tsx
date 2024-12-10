'use client'

import { motion } from 'framer-motion'

export default function Skills() {
  const skills = [
    "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Node.js",
    "HTML5", "CSS3", "Tailwind CSS", "GraphQL", "Webpack", "Git"
  ]

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-600">技能</h2>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {skills.map((skill, index) => (
          <motion.span 
            key={index} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-2 py-1 text-xs sm:text-sm font-semibold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.section>
  )
}

