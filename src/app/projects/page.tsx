import Layout from '../components/Layout'

const projects = [
  { id: 1, name: '电商平台', description: '使用React和Node.js开发的全栈电商平台' },
  { id: 2, name: '任务管理应用', description: '基于Vue.js的高效任务管理工具' },
  { id: 3, name: '数据可视化仪表板', description: '使用D3.js开发的交互式数据可视化项目' },
]

export default function Projects() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-purple-600">团队项目</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{project.name}</h2>
              <p className="text-gray-700">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

