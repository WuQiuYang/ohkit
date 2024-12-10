import React, { useContext, createContext } from 'react'
import { FC, ComponentType as CT } from 'react'

// import { Entry } from '../state'

export interface Heading {
  depth: number
  slug: string
  value: string
}

export interface Entry {
  id: string
  filepath: string
  slug: string
  route: string
  name: string
  order: number
  menu: string | null
  headings: Heading[]
  [key: string]: any
}

export interface PlaygroundProps {
  className?: string
  style?: any
  wrapper?: CT<any>
  components: ComponentsMap
  component: React.JSX.Element | (() => React.JSX.Element)
  position: number
  code: string
  scope: Record<string, any>
  language?: string
  showLivePreview?: boolean
  useScoping?: boolean
}

export interface LayoutProps {
  doc: Entry
  [key: string]: any
}

export interface ComponentsMap {
  notFound?: CT
  layout?: CT<LayoutProps>
  playground?: CT<PlaygroundProps>
  [key: string]: any
}

const DefNotFound: FC = () => <>Not found</>
const DefLayout: FC<React.PropsWithChildren<LayoutProps>> = ({ children }) => <>{children}</>
const DefPlayground: FC<PlaygroundProps> = ({ component, code }) => (
  <div style={{
    border: "1px solid hsla(203, 50%, 30%, 0.15)",
    borderRadius: "4px",
    margin: "10px 0",
  }}>
    <div style={{padding: "10px"}}>
      {typeof component === "function" ? component() : component}
    </div>
    <pre
      style={{
        padding: "10px",
        borderRadius: "0 0 4px 4px",
        backgroundColor: "#f5f5f5",
      }}
    >
      {code}
    </pre>
  </div>
);

const defaultComponents: ComponentsMap = {
  layout: DefLayout,
  notFound: DefNotFound,
  playground: DefPlayground,
}

export interface ComponentsProviderProps {
  components: ComponentsMap
}

const ctx = createContext<ComponentsMap>(defaultComponents)
export const ComponentsProvider: FC<React.PropsWithChildren<ComponentsProviderProps>> = ({
  components: themeComponents = {},
  children,
}) => (
  <ctx.Provider value={{ ...defaultComponents, ...themeComponents }}>
    {children}
  </ctx.Provider>
)

export const useComponents = (): ComponentsMap => {
  return useContext(ctx)
}
