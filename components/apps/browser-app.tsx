"use client"

import type React from "react"
import { useState, useEffect } from "react" // Import useEffect
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Home,
  Star,
  MoreHorizontal,
  Shield,
  Lock,
  Plus,
  Bookmark,
  Folder,
  FileText,
  GitFork,
  StarIcon,
  BookOpen,
  ExternalLink,
} from "lucide-react"
import { useFileSystem } from "@/contexts/file-system-context"
import { getRepositories } from "@/actions/repository-actions" // Import getRepositories action
import { getUserProfile } from "@/actions/user-profile-actions" // Import getUserProfile action
interface IRepository {
  id?: string;
  name: string;
  description: string;
  lang: string;
  stars: number;
  forks: number;
  isPinned: boolean;
}
import type { IUserProfile } from "@/models/UserProfile" // Import IUserProfile type
import LinkedinApp from "@/components/apps/linkedin-app"

export default function BrowserApp() {
  // --- Your Actual Profile URLs ---
  const YOUR_GITHUB_URL = "https://github.com/KSD-333"
  const YOUR_LINKEDIN_URL = "https://www.linkedin.com/in/ketan-dhainje/"
  // --------------------------------

  const { getEntry, resolvePathSegments } = useFileSystem()

  const [currentUrl, setCurrentUrl] = useState("https://portfolio.dev")
  const [inputUrl, setInputUrl] = useState("https://portfolio.dev")
  const [currentPage, setCurrentPage] = useState("portfolio")
  const [history, setHistory] = useState(["https://portfolio.dev"])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [tabs, setTabs] = useState([{ id: 1, title: "Portfolio", url: "https://portfolio.dev", active: true }])
  const [activeTabId, setActiveTabId] = useState(1)
  const [bookmarks, setBookmarks] = useState([
    { title: "Portfolio", url: "https://portfolio.dev" },
    { title: "GitHub", url: YOUR_GITHUB_URL },
    { title: "LinkedIn", url: YOUR_LINKEDIN_URL },
  ])
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  const [iframeLoadError, setIframeLoadError] = useState(false)
  const [currentRepoName, setCurrentRepoName] = useState("")
  const [copyButtonText, setCopyButtonText] = useState("Copy URL")
  const [githubRepos, setGithubRepos] = useState<IRepository[]>([]) // State for fetched repos
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null) // State for fetched user profile

  // Fetch repositories and user profile on component mount
  useEffect(() => {
    const fetchData = async () => {
      const repos = await getRepositories()
      setGithubRepos(repos)

      const profileData = await getUserProfile()
      setUserProfile(profileData)
    }
    fetchData()
  }, [])

  // Helper to get all repository names from the fetched data
  const getAllRepoNames = () => {
    return githubRepos.map((repo) => repo.name)
  }

  const handleCopyUrl = () => {
    const repoUrl = `${YOUR_GITHUB_URL}/${currentRepoName}`
    navigator.clipboard.writeText(repoUrl).then(() => {
      setCopyButtonText("Copied!")
      setTimeout(() => setCopyButtonText("Copy URL"), 2000)
    })
  }

  const handleDownloadZip = () => {
    alert(`Simulating download of ${currentRepoName}.zip...`)
  }

  const pages = {
    portfolio: {
      title: "John Developer - Portfolio",
      content: (
        <div className="p-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">JD</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{userProfile?.about.name || "John Developer"}</h1>
            <p className="text-xl text-gray-600 mb-6">
              {userProfile?.about.tagline || "Full Stack Developer & Ubuntu Enthusiast"}
            </p>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {userProfile?.about.education ||
                "Passionate about creating efficient, scalable solutions with modern web technologies. 5+ years of experience in full-stack development with expertise in React, Node.js, and cloud platforms."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-orange-600">Frontend</h3>
              <p className="text-gray-600">React, Next.js, TypeScript, Tailwind CSS</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Backend</h3>
              <p className="text-gray-600">Node.js, Python, PostgreSQL, MongoDB</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-green-600">DevOps</h3>
              <p className="text-gray-600">Docker, AWS, Kubernetes, CI/CD</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigateToPage("github", YOUR_GITHUB_URL)}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors mr-4"
            >
              View GitHub
            </button>
            <button
              onClick={() => navigateToPage("linkedin", YOUR_LINKEDIN_URL)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors mr-4"
            >
              LinkedIn Profile
            </button>
          </div>
        </div>
      ),
    },
    github: {
      title: "GitHub - KSD-333",
      content: (
        <div className="p-8 bg-white">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src="/placeholder.svg?height=64&width=64&text=KSD"
                  alt="KSD-333 Profile"
                  className="w-16 h-16 rounded-full border border-gray-200"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">KSD-333</h1>
                  <p className="text-gray-600 text-sm">1 follower • 0 following</p>
                </div>
              </div>
              <button
                onClick={() => window.open(YOUR_GITHUB_URL, "_blank")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Full GitHub Profile
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
              <div className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-semibold">Overview</div>
              <div className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer">
                Repositories {githubRepos.length}
              </div>
            </div>

            {/* Pinned Repositories */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pinned</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {githubRepos
                .filter((repo) => repo.isPinned)
                .map((repo, index) => (
                  <div key ="repo._id || index" className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3
                        className="font-semibold text-blue-600 hover:underline cursor-pointer"
                        onClick={() => navigateToPage("repo", `${YOUR_GITHUB_URL}/${repo.name}`)}
                      >
                        <BookOpen className="inline-block w-4 h-4 mr-1 text-gray-600" />
                        {repo.name}
                      </h3>
                      <span className="text-xs text-gray-500 border border-gray-300 px-2 py-0.5 rounded-full">
                        Public
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{repo.description}</p>
                    <div className="flex items-center text-sm text-gray-600 space-x-3">
                      <span
                        className={`w-2 h-2 rounded-full mr-1 ${
                          repo.lang === "Python"
                            ? "bg-blue-500"
                            : repo.lang === "JavaScript"
                              ? "bg-yellow-500"
                              : repo.lang === "TypeScript"
                                ? "bg-purple-500"
                                : "bg-gray-400"
                        }`}
                      ></span>
                      <span>{repo.lang}</span>
                      <span className="flex items-center">
                        <StarIcon className="w-3 h-3 mr-1" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center">
                        <GitFork className="w-3 h-3 mr-1" />
                        {repo.forks}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* All Repositories */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">All Repositories</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {githubRepos.map((repo, index) => (
                <div key="repo._id || index" className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3
                      className="font-semibold text-blue-600 hover:underline cursor-pointer"
                      onClick={() => navigateToPage("repo", `${YOUR_GITHUB_URL}/${repo.name}`)}
                    >
                      <BookOpen className="inline-block w-4 h-4 mr-1 text-gray-600" />
                      {repo.name}
                    </h3>
                    <span className="text-xs text-gray-500 border border-gray-300 px-2 py-0.5 rounded-full">
                      Public
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{repo.description}</p>
                  <div className="flex items-center text-sm text-gray-600 space-x-3">
                    <span
                      className={`w-2 h-2 rounded-full mr-1 ${
                        repo.lang === "Python"
                          ? "bg-blue-500"
                          : repo.lang === "JavaScript"
                            ? "bg-yellow-500"
                            : repo.lang === "TypeScript"
                              ? "bg-purple-500"
                              : "bg-gray-400"
                      }`}
                    ></span>
                    <span>{repo.lang}</span>
                    <span className="flex items-center">
                      <StarIcon className="w-3 h-3 mr-1" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center">
                      <GitFork className="w-3 h-3 mr-1" />
                      {repo.forks}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Contribution Activity (Simplified) */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contribution activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">July 2025</span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">2025</button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm">2024</button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 font-medium mb-2">Created 21 commits in 3 repositories</p>
                <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                  <li>
                    <span
                      className="hover:underline cursor-pointer"
                      onClick={() => navigateToPage("repo", `${YOUR_GITHUB_URL}/Asim--Agro-Res-Lim`)}
                    >
                      KSD-333/Asim--Agro-Res-Lim
                    </span>{" "}
                    15 commits
                  </li>
                  <li>
                    <span
                      className="hover:underline cursor-pointer"
                      onClick={() => navigateToPage("repo", `${YOUR_GITHUB_URL}/Portfolio`)}
                    >
                      KSD-333/Portfolio
                    </span>{" "}
                    4 commits
                  </li>
                  <li>
                    <span
                      className="hover:underline cursor-pointer"
                      onClick={() => navigateToPage("repo", `${YOUR_GITHUB_URL}/Ketan-Dhainje`)}
                    >
                      KSD-333/Ketan-Dhainje
                    </span>{" "}
                    2 commits
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    linkedin: {
      title: userProfile?.linkedin.name ? `${userProfile.linkedin.name} | LinkedIn` : "LinkedIn Profile",
      content: <LinkedinApp />, // Use the new LinkedinApp component
    },
    google: {
      title: "Google",
      content: (
        <div className="flex flex-col items-center justify-center h-full bg-white">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-8">
              <span className="text-blue-500">G</span>
              <span className="text-red-500">o</span>
              <span className="text-yellow-500">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </div>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search Google or type a URL"
                className="w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-center space-x-4 mt-6">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  Google Search
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  I'm Feeling Lucky
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    repo: {
      title: currentRepoName ? `GitHub - ${currentRepoName}` : "GitHub Repository",
      content: (
        <div className="p-8 bg-white h-full overflow-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              <span className="text-blue-600">KSD-333</span> / {currentRepoName || "repository-name"}
            </h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <div className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-semibold">Code</div>
              <div className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer">Issues</div>
              <div className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer">Pull requests</div>
            </div>

            {/* Clone/Download section */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <span className="text-sm text-gray-700">Clone or download</span>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  {copyButtonText}
                </button>
                <button
                  onClick={handleDownloadZip}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                >
                  Download ZIP
                </button>
              </div>
            </div>

            {/* View Original Repository Button */}
            <div className="mb-6">
              <button
                onClick={() => window.open(`${YOUR_GITHUB_URL}/${currentRepoName}`, "_blank")}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Original Repository
              </button>
            </div>

            {/* File Tree / README */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Files</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <Folder className="w-4 h-4 mr-2 text-blue-500" />
                    <span>src/</span>
                  </li>
                  <li className="flex items-center">
                    <Folder className="w-4 h-4 mr-2 text-blue-500" />
                    <span>public/</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    <span>package.json</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    <span>README.md</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    <span>.gitignore</span>
                  </li>
                </ul>
              </div>
              <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">README.md</h3>
                <div className="prose max-w-none text-gray-700">
                  <p className="text-red-600 font-semibold mb-4">
                    Due to a simulated Git error, we cannot display the full README.md content here.
                  </p>
                  <p className="mb-2">
                    To view the original repository and its README, please click the "View Original Repository" button
                    above.
                  </p>
                  <p className="mb-2">
                    You can also directly download the repository as a ZIP file using the "Download ZIP" button in the
                    section above.
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    (This limitation is for demonstration purposes within the simulated environment.)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    iframe: {
      title: iframeUrl ? `Loading ${iframeUrl}` : "Browser",
      content: iframeLoadError ? (
        <div className="flex flex-col items-center justify-center h-full bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Page</h1>
          <p className="text-gray-700 mb-2">
            The website <span className="font-semibold break-all">{iframeUrl}</span> could not be loaded.
          </p>
          <p className="text-gray-600 text-sm">
            This is often due to security restrictions (X-Frame-Options) that prevent websites from being embedded in
            other sites.
          </p>
          <p className="text-gray-600 text-sm mt-2">Please try a different URL or use a simulated page.</p>
        </div>
      ) : (
        <iframe
          src={iframeUrl || ""}
          title="External Website"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-downloads"
          onError={() => setIframeLoadError(true)}
          onLoad={() => setIframeLoadError(false)}
        />
      ),
    },
  }

  const navigateToPage = (page: string, url: string) => {
    setCurrentUrl(url)
    setInputUrl(url)
    setIframeLoadError(false)
    setCopyButtonText("Copy URL")

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(url)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)

    if (url.includes(YOUR_GITHUB_URL) && url !== YOUR_GITHUB_URL) {
      const repoName = url.split("/").pop() || ""
      setCurrentRepoName(repoName)
      setCurrentPage("repo")
      setIframeUrl(null)
    } else if (url === YOUR_GITHUB_URL) {
      setCurrentPage("github")
      setIframeUrl(null)
    } else if (url === YOUR_LINKEDIN_URL) {
      setCurrentPage("linkedin")
      setIframeUrl(null)
    } else if (url.includes("google.com")) {
      setCurrentPage("google")
      setIframeUrl(null)
    } else if (url.includes("portfolio.dev")) {
      setCurrentPage("portfolio")
      setIframeUrl(null)
    } else {
      setCurrentPage("iframe")
      setIframeUrl(url)
    }

    setTabs(
      tabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, title: pages[currentPage as keyof typeof pages].title, url } : tab,
      ),
    )
  }

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const url = history[newIndex]
      navigateToPage(determinePageType(url), url)
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const url = history[newIndex]
      navigateToPage(determinePageType(url), url)
    }
  }

  const refresh = () => {
    if (currentPage === "iframe" && iframeUrl) {
      setIframeUrl(null)
      setTimeout(() => setIframeUrl(currentUrl), 10)
    } else {
      navigateToPage(currentPage, currentUrl)
    }
  }

  const goHome = () => {
    navigateToPage("portfolio", "https://portfolio.dev")
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const url = inputUrl.trim()
    navigateToPage(determinePageType(url), url)
  }

  const addNewTab = () => {
    const newTab = {
      id: Date.now(),
      title: "New Tab",
      url: "https://portfolio.dev",
      active: false,
    }
    setTabs([...tabs, newTab])
    setActiveTabId(newTab.id)
    navigateToPage("portfolio", "https://portfolio.dev")
  }

  const closeTab = (tabId: number) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter((tab) => tab.id !== tabId)
      setTabs(newTabs)
      if (tabId === activeTabId) {
        setActiveTabId(newTabs[0].id)
        navigateToPage(determinePageType(newTabs[0].url), newTabs[0].url)
      }
    }
  }

  const switchTab = (tabId: number) => {
    setActiveTabId(tabId)
    const tab = tabs.find((t) => t.id === tabId)
    if (tab) {
      navigateToPage(determinePageType(tab.url), tab.url)
    }
  }

  const determinePageType = (url: string) => {
    if (url.includes(YOUR_GITHUB_URL) && url !== YOUR_GITHUB_URL) {
      return "repo"
    } else if (url === YOUR_GITHUB_URL) {
      return "github"
    } else if (url === YOUR_LINKEDIN_URL) {
      return "linkedin"
    } else if (url.includes("google.com")) {
      return "google"
    } else if (url.includes("portfolio.dev")) {
      return "portfolio"
    } else {
      return "iframe"
    }
  }

  const currentPageData = pages[currentPage as keyof typeof pages]

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Browser Header */}
      <div className="bg-gray-100 border-b border-gray-300 p-2">
        {/* Tabs */}
        <div className="flex items-center mb-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 rounded-t-lg border-t border-l border-r max-w-xs cursor-pointer ${
                tab.id === activeTabId ? "bg-white border-gray-300" : "bg-gray-200 border-gray-400"
              }`}
              onClick={() => switchTab(tab.id)}
            >
              <Shield className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm truncate flex-1">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addNewTab}
            className="ml-2 w-8 h-8 rounded hover:bg-gray-200 flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center space-x-2">
          <button
            onClick={goBack}
            disabled={historyIndex === 0}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={refresh} className="p-2 rounded hover:bg-gray-200">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={goHome} className="p-2 rounded hover:bg-gray-200">
            <Home className="w-4 h-4" />
          </button>

          <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
            <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-full px-4 py-2">
              <Lock className="w-4 h-4 text-green-600 mr-2" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
              <Star className="w-4 h-4 text-gray-400 ml-2" />
            </div>
          </form>

          <button className="p-2 rounded hover:bg-gray-200">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Bookmarks Bar */}
        <div className="flex items-center space-x-1 mt-2 pt-2 border-t border-gray-200">
          <Bookmark className="w-4 h-4 text-gray-500 mr-2" />
          {bookmarks.map((bookmark, index) => (
            <button
              key={index}
              onClick={() => navigateToPage(determinePageType(bookmark.url), bookmark.url)}
              className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 rounded"
            >
              {bookmark.title}
            </button>
          ))}
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-auto bg-white">{currentPageData.content}</div>
    </div>
  )
}
