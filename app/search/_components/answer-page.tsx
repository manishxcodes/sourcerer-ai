import { useSearchResults } from "../../context/searchResultContext";
import ReactMarkDown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SyntaxHighlighter from "react-syntax-highlighter"
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { LoadingScreen } from "./Loader";
import { ErrorCard } from "./error-card";


// @ts-ignore
export default function AnswerPage({value}: {value: string | undefined}) {
    const {searchResults, isLoading} = useSearchResults();

    if(isLoading) {
        console.log("isiloaidng ans page")
        return (
            <LoadingScreen />
        )
    }

    if((!searchResults?.searchResults || !value) && isLoading) {
        console.log("no asnwer anserpg")
        return (
            <ErrorCard />
        )
    }

    return (
        <div className="w-full h-full">
            <div className="w-full flex pb-4">
                <div className="md:flex hidden  gap-2 pt-2 ">
                {
                    searchResults && value && searchResults.searchResults.slice(0,4).map((result) => (
                        <div key={result.title} className="px-2 py-1 bg-neutral-100 rounded-md flex cursor-pointer hover:bg-neutral-50 transition-all duration-150">
                            <a href={result.link} target="blank">
                            <p className="text-neutral-500 text-[10px]">{result.displayLink}</p>
                                
                            <div className="">
                                <h4 className="text-[12px]">{result.title.slice(0,20)}...</h4>
                            </div>
                            </a>
                        </div>
                    ))
                }
                </div>
            </div>
            <div className="prose max-w-4xl">
                { value ?
                    <ReactMarkDown
                    remarkPlugins={[remarkGfm]}
                    components={{
                    h1: ({ node, ...props }) => (
                        <h1 className="text-4xl font-bold text-black mb-4 leading-snug" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-3xl font-semibold text-black mb-3 leading-snug" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-2xl font-semibold text-black mt-4 mb-2 leading-tight" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                        <p className="text-gray-700 leading-relaxed mb-4" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                        <a
                        className="text-blue-600 underline hover:text-blue-800"
                        target="_blank"
                        rel="noreferrer"
                        {...props}
                        />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc list-outside  pl-6 space-y-2 leading-relaxed" {...props} />
                    ),
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="bg-gray-100 p-4 rounded-lg text-gray-700 leading-relaxed " {...props} />
                    ),
                    table: ({ node, ...props }) => (
                        <table className="table-auto w-full text-sm text-gray-700 border-collapse border border-gray-300" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="border border-gray-300 px-4 py-2" {...props} />
                    ),
                    code: ({ node,  className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        return  match ? (
                        <SyntaxHighlighter
                            style={okaidia}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md overflow-auto"
                        >
                            {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                        ) : (
                        <code className="bg-gray-100 px-1 rounded-md" {...props}>
                            {children}
                        </code>
                        );
                    },
                    }}
                >
                    {value}
                    </ReactMarkDown>
                    : <LoadingScreen />
                }
            </div>
            <Link href={'/'} >
                <Button className=" flex items-center fixed bottom-10 right-10 "> 
                    new chat
                    <Plus />
                </Button>
            </Link>
        </div>
    )
}