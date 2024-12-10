'use client'

import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-purple-600">联系方式</h2>
      <div className="space-y-4">
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a href="mailto:zhangsan@example.com" className="text-gray-700 hover:text-purple-600 transition-colors">
            zhangsan@example.com
          </a>
        </motion.div>
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a href="tel:+86123456789" className="text-gray-700 hover:text-purple-600 transition-colors">
            +86 123 456 789
          </a>
        </motion.div>
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a href="https://www.example.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-purple-600 transition-colors">
            www.example.com
          </a>
        </motion.div>
      </div>
    </motion.section>
  )
}

