"use client"

interface PdfViewerAppProps {
  fileName: string
}

export default function PdfViewerApp({ fileName }: PdfViewerAppProps) {
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <img src="/placeholder.svg?height=100&width=80&text=PDF" alt="PDF Icon" className="mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{fileName}</h1>
        <p className="text-gray-600 mb-4">Simulated PDF Viewer</p>
        <p className="text-sm text-gray-500">In a real application, this would display the content of "{fileName}".</p>
        <p className="text-xs text-gray-400 mt-4">
          (For demonstration purposes, actual PDF rendering is not implemented.)
        </p>
      </div>
    </div>
  )
}
