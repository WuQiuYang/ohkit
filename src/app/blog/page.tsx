import Layout from '../components/Layout'
import Link from 'next/link'
import './style.scss'

const blogPosts = [
  { id: 1, title: 'React Hooks 最佳实践', date: '2023-06-01' },
  { id: 2, title: 'Next.js 13 新特性解析', date: '2023-05-15' },
  { id: 3, title: 'TypeScript 高级技巧', date: '2023-04-22' },
]

export default function Blog() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-purple-600">博客文章</h1>
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.id}`} className="text-gray-800 hover:text-purple-600">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600">{post.date}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

