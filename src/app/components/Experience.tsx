'use client'

import { motion } from 'framer-motion'

export default function Experience() {
  const experiences = [
    {
      company: "科技有限公司",
      position: "高级前端开发工程师",
      period: "2020年1月 - 至今",
      description: "负责公司主要产品的前端开发,优化用户体验和页面性能。主导了多个大型项目的技术选型和架构设计,显著提升了开发效率和产品质量。"
    },
    {
      company: "互联网公司",
      position: "前端开发工程师",
      period: "2017年6月 - 2019年12月",
      description: "参与多个web项目的开发,使用React和Vue.js构建用户界面。负责实现复杂的交互功能和数据可视化,获得了客户的高度评价。"
    }
  ]

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-600">工作经验</h2>
      {experiences.map((exp, index) => (
        <motion.div 
          key={index} 
          className="mb-6 last:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{exp.company}</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-2">{exp.position} | {exp.period}</p>
          <p className="text-sm sm:text-base text-gray-700">{exp.description}</p>
        </motion.div>
      ))}
    </motion.section>
  )
}

