"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface TextEditorAppProps {
  fileName: string
  fileContent: string
}

export default function TextEditorApp({ fileName, fileContent }: TextEditorAppProps) {
  const isMarkdown = fileName.endsWith(".md")

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Editor Header */}
      <div className="border-b border-gray-200 p-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{fileName}</span>
      </div>

      {/* Text Area for Content */}
      <div className="flex-1 p-4 overflow-auto font-mono text-sm text-gray-800 bg-gray-50">
        {isMarkdown ? (
          <div className="prose max-w-none text-gray-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fileContent}</ReactMarkdown>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap break-words">{fileContent}</pre>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-xs text-gray-600">Read-only</div>
    </div>
  )
}
