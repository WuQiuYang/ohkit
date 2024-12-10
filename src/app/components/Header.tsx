'use client'

import { motion } from 'framer-motion'

export default function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center px-4 sm:px-0"
    >
      <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
        张三
      </h1>
      <h2 className="text-xl sm:text-2xl text-gray-600">前端开发工程师</h2>
    </motion.header>
  )
}

