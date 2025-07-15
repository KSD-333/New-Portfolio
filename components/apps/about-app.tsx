"use client"

import { User, MapPin, Calendar, Code, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { getUserProfile } from "@/actions/user-profile-actions"
import type { IUserProfile } from "@/models/UserProfile"

export default function AboutApp() {
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
        setError(err.message || "Failed to load profile.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="p-6 h-full bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading about me information...</p>
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

  if (!profile) {
    return (
      <div className="p-6 h-full bg-white flex items-center justify-center">
        <p className="text-gray-500">No profile data available. Please set it up in the Admin Panel.</p>
      </div>
    )
  }

  return (
    <div className="p-6 h-full bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{profile.about.name}</h1>
            <p className="text-gray-600">{profile.about.tagline}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">{profile.about.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">{profile.about.experience}</span>
              </div>
              <div className="flex items-center">
                <Code className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">{profile.about.specialization}</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">{profile.about.passion}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">About Me</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{profile.about.education}</p>
            <p className="text-gray-700 leading-relaxed">{profile.about.certifications}</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Philosophy</h3>
          <p className="text-gray-700 italic">{profile.about.philosophy}</p>
        </div>
      </div>
    </div>
  )
}
