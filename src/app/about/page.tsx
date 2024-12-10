import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-purple-600">关于我</h1>
        <p className="text-gray-700 leading-relaxed">
          我是张三,一名热爱技术的前端开发工程师。我有5年的工作经验,擅长使用React、Vue.js和Node.js等现代web技术栈。
          我相信技术的力量可以改变世界,因此我一直在不断学习和探索新的技术领域。在工作之余,我喜欢参与开源项目,
          为开发者社区贡献自己的一份力量。
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          除了编程,我还喜欢阅读技术博客、参加技术会议,以及与其他开发者交流分享经验。我相信,只有不断学习和成长,
          才能在这个快速发展的行业中保持竞争力。
        </p>
      </div>
    </Layout>
  )
}

