import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
// import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';

export type CodeTheme =
    'a11yDark'
    | 'atomDark'
    | 'base16AteliersulphurpoolLight'
    | 'cb'
    | 'coldarkCold'
    | 'coldarkDark'
    | 'coyWithoutShadows'
    | 'coy'
    | 'darcula'
    | 'dark'
    | 'dracula'
    | 'duotoneDark'
    | 'duotoneEarth'
    | 'duotoneForest'
    | 'duotoneLight'
    | 'duotoneSea'
    | 'duotoneSpace'
    | 'funky'
    | 'ghcolors'
    | 'gruvboxDark'
    | 'gruvboxLight'
    | 'holiTheme'
    | 'hopscotch'
    | 'lucario'
    | 'materialDark'
    | 'materialLight'
    | 'materialOceanic'
    | 'nightOwl'
    | 'nord'
    | 'okaidia'
    | 'oneDark'
    | 'oneLight'
    | 'pojoaque'
    | 'prism'
    | 'shadesOfPurple'
    | 'solarizedDarkAtom'
    | 'solarizedlight'
    | 'synthwave84'
    | 'tomorrow'
    | 'twilight'
    | 'vs'
    | 'vscDarkPlus'
    | 'xonokai'
    | 'zTouch'
;

export interface MDPlaygroundProps {
    children?: string | null;
    /**
     * 主题
     * @default vscDarkPlus
     */
    theme?: CodeTheme;
}
export const MDPlayground: React.FC<MDPlaygroundProps> = (props) => {
    const {children, theme = 'vscDarkPlus'} = props;
    return <ReactMarkdown
        children={children}
        remarkPlugins={[remarkGfm]}
        components={{
        code({
            node,
            // @ts-ignore ??
            inline,
            className,
            children,
            key,
            ref,
            ...props
        }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
            <div key={key} ref={(r) => {
                if (typeof ref === 'function') {
                    ref(r);
                }
            }}>                
                <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    // @ts-ignore ??=
                    style={require(`react-syntax-highlighter/dist/esm/styles/prism`)[theme]}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                />
            </div>
            ) : (
            <code className={className} {...props}>
                {children}
            </code>
            )
        }
        }}
    />
}