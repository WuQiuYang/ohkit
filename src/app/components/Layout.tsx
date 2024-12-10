'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: '首页', href: '/' },
  { name: '关于', href: '/about' },
  { name: '博客', href: '/blog' },
  { name: '项目', href: '/projects', subItems: [{name: '子项目1', href: '/projects1'}, {name: '子项目2', href: '/projects2'}] },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const closeSidebar = () => setSidebarOpen(false)
    window.addEventListener('resize', closeSidebar)
    return () => window.removeEventListener('resize', closeSidebar)
  }, [])

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-purple-600">BPIT-HCM</Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'text-purple-600 bg-gray-100'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                {/* <Menu className="h-6 w-6" /> */}
                Menu
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          sticky top-0 h-screen z-40 bg-white shadow-lg transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out 
          sm:translate-x-0 overflow-y-auto
          w-full sm:w-1/4 max-w-xs
        `}>
          <div className="h-16 flex items-center justify-between px-4 sm:hidden">
            <h2 className="text-2xl font-semibold text-gray-800">菜单</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {/* <X className="h-6 w-6" /> */}
              X
            </button>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            {navItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => item.subItems && toggleExpand(item.name)}
                  className={`w-full group flex items-center justify-between px-2 py-2 text-base font-medium rounded-md ${
                    pathname === item.href
                      ? 'text-purple-600 bg-gray-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Link href={item.href}>{item.name}</Link>
                  {/* {item.subItems && (
                    expandedItems.includes(item.name) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )
                  )} */}
                </button>
                {/* {item.subItems && expandedItems.includes(item.name) && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`group flex items-center px-2 py-1 text-sm font-medium rounded-md ${
                          pathname === subItem.href
                            ? 'text-purple-600 bg-gray-100'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )} */}
              </div>
            ))}
          </nav>
          <div className="mt-8 px-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">外部链接</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/zhangsan" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/zhangsan" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full sm:flex-grow">
          {children}
        </main>
      </div>
    </div>
  )
}

