"use client"

import { ExternalLink, Github, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { getRepositories } from "@/actions/repository-actions"

interface IRepository {
  id?: string;
  name: string;
  description: string;
  lang: string;
  stars: number;
  forks: number;
  isPinned: boolean;
}

export default function ProjectsApp() {
  const [projects, setProjects] = useState<IRepository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getRepositories()
        setProjects(data)
      } catch (err: any) {
        setError(err.message || "Failed to load projects.")
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="p-6 h-full bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 h-full bg-white flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="p-6 h-full bg-white flex items-center justify-center">
        <p className="text-gray-500">No projects found. Add some in the Admin Panel!</p>
      </div>
    )
  }

  return (
    <div className="p-6 h-full bg-white overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Projects</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <img
                src="/placeholder.svg?height=200&width=300&text=Project"
                alt={project.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.isPinned ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.isPinned ? "Pinned" : "Active"}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700">
                    {project.lang}
                  </span>
                  <span className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700">
                    Stars: {project.stars}
                  </span>
                  <span className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700">
                    Forks: {project.forks}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date().getFullYear()} {/* Placeholder for date */}
                  </div>

                  <div className="flex space-x-3">
                    <a
                      href={`https://github.com/KSD-333/${project.name}`} // Link to actual GitHub
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-gray-800 text-sm transition-colors"
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </a>
                    <a
                      href="#" // Placeholder for demo link
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Demo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
