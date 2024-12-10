'use client'

import { motion } from 'framer-motion'

export default function Education() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-purple-600">教育背景</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-gray-800">计算机科学学士</h3>
        <p className="text-gray-600">某某大学 | 2013年9月 - 2017年6月</p>
        <p className="text-gray-700 mt-2">
          主修课程：数据结构、算法分析、计算机网络、数据库系统、软件工程
        </p>
      </motion.div>
    </motion.section>
  )
}

