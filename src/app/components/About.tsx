'use client'

import { motion } from 'framer-motion'
import {TextEllipsis} from '@ohkit/text-ellipsis'
// import '@ohkit/text-ellipsis/dist/index.css'
import './About.css'

export default function About() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-600">关于我</h2>
      <TextEllipsis lines={2}>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          我是一名富有激情的前端开发工程师,拥有5年的工作经验。我热衷于创建用户友好、高性能的web应用。我擅长使用现代前端技术栈,并且乐于学习新技术。在工作中,我注重团队协作,善于沟通,能够快速适应新环境。我相信技术能够改变世界,并致力于通过我的技能为用户创造价值。
        </p>
      </TextEllipsis>
    </motion.section>
  )
}

