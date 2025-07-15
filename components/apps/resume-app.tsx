"use client"

import { useState, useEffect } from "react"
import { getUserProfile } from "@/actions/user-profile-actions"
import type { IUserProfile } from "@/models/UserProfile"
import { Download } from "lucide-react"

export default function ResumeApp() {
  const [profile, setProfile] = useState<IUserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getUserProfile()
        setProfile(data)
      } catch (err: any) {
        setError(err.message || "Failed to load resume data.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="p-6 h-full bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading resume...</p>
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

  if (!profile || !profile.resume || !profile.resume.title) {
    return (
      <div className="p-6 h-full bg-white flex items-center justify-center">
        <p className="text-gray-500">No resume data available. Please set it up in the Admin Panel.</p>
      </div>
    )
  }

  return (
    <div className="p-6 h-full bg-white overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{profile.resume.title}</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </button>
        </div>

        <div className="space-y-8">
          {profile.resume.sections.map((section, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{section.heading}</h2>
              <p className="text-gray-700 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Note</h3>
          <p className="text-sm text-blue-700">
            This is a simulated resume. For a real application, you would integrate with a PDF generation service or
            provide a direct link to your resume PDF.
          </p>
        </div>
      </div>
    </div>
  )
}
