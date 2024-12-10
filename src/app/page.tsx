import Layout from './components/Layout'
import Header from './components/Header'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-16">
        <Header />
        <About />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </div>
    </Layout>
  )
}

