"use client"

import { useState, useEffect } from "react"
import { getUserProfile } from "@/actions/user-profile-actions"
import type { IUserProfile } from "@/models/UserProfile"
import { GraduationCap } from "lucide-react"

export default function LinkedinApp() {
  const [profile, setProfile] = useState<IUserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const YOUR_LINKEDIN_URL = "https://www.linkedin.com/in/ketan-dhainje/" // Your actual LinkedIn URL

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getUserProfile()
        setProfile(data)
      } catch (err: any) {
        setError(err.message || "Failed to load LinkedIn profile.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="p-8 h-full flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading LinkedIn profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 h-full flex items-center justify-center bg-white">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-8 h-full flex items-center justify-center bg-white">
        <p className="text-gray-500">No LinkedIn profile data available. Please set it up in the Admin Panel.</p>
      </div>
    )
  }

  return (
    <div className="p-8 h-full overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mr-6">
                <span className="text-2xl font-bold text-blue-600">
                  {profile.linkedin.name
                    ? profile.linkedin.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "KD"}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{profile.linkedin.name}</h1>
                <p className="text-blue-100 text-lg">{profile.linkedin.tagline}</p>
                <p className="text-blue-200">{profile.linkedin.connections}</p>
              </div>
            </div>
            <button
              onClick={() => window.open(YOUR_LINKEDIN_URL, "_blank")}
              className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              Go to Full LinkedIn Profile
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">{profile.linkedin.about}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Experience</h2>
            <div className="space-y-6">
              {profile.linkedin.experience.map((exp, index) => (
                <div key={index} className="flex">
                  <div className="w-12 h-12 bg-blue-600 rounded mr-4 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {exp.company
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-gray-600">
                      {exp.company} • {exp.duration}
                    </p>
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Top Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.linkedin.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{profile.linkedin.education.institution}</h3>
                <p className="text-gray-600">{profile.linkedin.education.degree}</p>
                <p className="text-gray-600 text-sm">{profile.linkedin.education.duration}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
