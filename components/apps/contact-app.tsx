"use client"

import type React from "react"

import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send } from "lucide-react"
import { useState } from "react"
import { addContactSubmission } from "@/actions/contact-actions" // Import the new action

export default function ContactApp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmissionStatus("submitting")
    setSubmissionMessage(null)

    const form = e.currentTarget as HTMLFormElement
    const data = new FormData(form)

    const result = await addContactSubmission(data)

    if (result.success) {
      setSubmissionStatus("success")
      setSubmissionMessage(result.message)
      setFormData({ name: "", email: "", message: "" })
    } else {
      setSubmissionStatus("error")
      setSubmissionMessage(result.message)
    }
    setTimeout(() => {
      setSubmissionStatus("idle")
      setSubmissionMessage(null)
    }, 3000)
  }

  return (
    <div className="p-6 h-full bg-white overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Contact Me</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Get In Touch</h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <a href="https://mail.google.com/mail/u/1/#inbox?compose=CllgCJTHVcCJDXkHpmQDKFNqpJPXZfQhQCFLlpbnVjDrqQqkldBwzWpBxKgrzXsvttzqLjDGdMg" target="_blank" rel="noopener noreferrer"><Mail className="w-5 h-5 text-gray-500 mr-3" /></a>
                <span className="text-gray-700">ketandhainje333@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">+91 7219452502</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-gray-700">At/Po Burli, Sangli,Maharastra</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/KSD-333"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-300 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Send Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name" // Add name attribute for FormData
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email" // Add name attribute for FormData
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message" // Add name attribute for FormData
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submissionStatus === "submitting"}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                {submissionStatus === "submitting" ? "Sending..." : "Send Message"}
              </button>
              {submissionMessage && (
                <p
                  className={`text-center text-sm ${
                    submissionStatus === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {submissionMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
