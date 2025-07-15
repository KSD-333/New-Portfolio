"use client"

import { Code, Server, Database, Cloud, PenToolIcon as Tool, Smartphone } from "lucide-react"
import { useState, useEffect } from "react"
import { getUserProfile } from "@/actions/user-profile-actions"
import type { IUserProfile } from "@/models/UserProfile"

export default function SkillsApp() {
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
        setError(err.message || "Failed to load skills data.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // Hardcoded skill categories for display structure, but skills themselves come from profile
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: Code,
      color: "bg-blue-500",
      key: "frontend", // Key to map to profile skills if needed
    },
    {
      title: "Backend Development",
      icon: Server,
      color: "bg-green-500",
      key: "backend",
    },
    {
      title: "Database & Storage",
      icon: Database,
      color: "bg-purple-500",
      key: "database",
    },
    {
      title: "Cloud & DevOps",
      icon: Cloud,
      color: "bg-orange-500",
      key: "cloud",
    },
    {
      title: "Tools & Technologies",
      icon: Tool,
      color: "bg-red-500",
      key: "tools",
    },
    {
      title: "Mobile Development",
      icon: Smartphone,
      color: "bg-indigo-500",
      key: "mobile",
    },
  ]

  if (loading) {
    return (
      <div className="p-6 h-full bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading skills...</p>
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

  if (!profile || profile.linkedin.skills.length === 0) {
    return (
      <div className="p-6 h-full bg-white flex items-center justify-center">
        <p className="text-gray-500">No skills data available. Please set it up in the Admin Panel.</p>
      </div>
    )
  }

  // For simplicity, we'll just display all skills from LinkedIn profile under a generic category
  // In a more complex app, you'd categorize them based on the profile data itself.
  const allSkills = profile.linkedin.skills

  return (
    <div className="p-6 h-full bg-white overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Skills & Technologies</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display all skills under a single "All Skills" category for now */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 col-span-full">
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mr-3`}>
                <Code className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">My Skills</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:border-gray-400 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* You can add more structured categories here if your profile data supports it */}
          {/* For example, if profile.skills had categories like { frontend: ["React"], backend: ["Node.js"] } */}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Proficiency Levels (Simulated)</h2>
          <div className="space-y-4">
            {[
              { skill: "JavaScript/TypeScript", level: 95 },
              { skill: "React/Next.js", level: 90 },
              { skill: "Node.js", level: 85 },
              { skill: "Python", level: 80 },
              { skill: "Cloud Platforms", level: 75 },
              { skill: "Mobile Development", level: 70 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.skill}</span>
                  <span className="text-sm text-gray-500">{item.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${item.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
