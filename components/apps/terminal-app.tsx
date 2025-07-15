"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useFileSystem } from "@/contexts/file-system-context" // Import the new context

export default function TerminalApp() {
  const {
    fileSystem,
    currentPath,
    setCurrentPath,
    resolvePathSegments,
    getEntry,
    updateFileSystem,
    listDirectoryContents,
  } = useFileSystem() // Use the context
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([
    "Welcome to Ubuntu 24.04 LTS (GNU/Linux)",
    "Last login: " + new Date().toLocaleString(),
    "",
    'Type "help" to see available commands.',
    "",
  ])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: { [key: string]: (args: string[]) => string[] | Promise<string[]> } = {
    help: () => [
      "Available commands:",
      "  about     - Display information about me",
      "  skills    - List my technical skills",
      "  projects  - Show my projects",
      "  contact   - Display contact information",
      "  clear     - Clear the terminal",
      "  whoami    - Display current user",
      "  ls        - List directory contents",
      "  ll        - List directory contents (detailed)",
      "  cat       - Display file contents",
      "  pwd       - Print working directory",
      "  cd        - Change directory",
      "  mkdir     - Create directory",
      "  touch     - Create file",
      "  rm        - Remove file or directory",
      "  history   - Show command history",
      "  date      - Show current date and time",
      "  uptime    - Show system uptime",
      "  ps        - Show running processes",
      "  top       - Show system processes",
      "  df        - Show disk usage",
      "  free      - Show memory usage",
      "  uname     - Show system information",
      "",
    ],
    about: () => [
      "John Developer - Full Stack Developer",
      "Location: San Francisco, CA",
      "Experience: 5+ years",
      "Specialization: React, Node.js, Python",
      "Passion: Open source development",
      "Education: Computer Science, Stanford University",
      "Certifications: AWS Solutions Architect, Google Cloud Professional",
      "",
    ],
    skills: () => [
      "Technical Skills:",
      "├── Frontend: React, Next.js, TypeScript, Tailwind CSS",
      "├── Backend: Node.js, Python, Express, FastAPI",
      "├── Database: PostgreSQL, MongoDB, Redis",
      "├── Cloud: AWS, Docker, Kubernetes",
      "├── Tools: Git, Linux, VS Code, Figma",
      "└── Mobile: React Native, Flutter",
      "",
      "Soft Skills:",
      "├── Team Leadership",
      "├── Project Management",
      "├── Problem Solving",
      "└── Communication",
      "",
    ],
    projects: () => [
      "Recent Projects:",
      "├── E-Commerce Platform (React, Node.js, PostgreSQL)",
      "│   └── Full-stack solution with payment integration",
      "├── Task Management System (Next.js, MongoDB)",
      "│   └── Collaborative tool with real-time updates",
      "├── API Gateway Service (Node.js, Kubernetes)",
      "│   └── Microservices architecture with load balancing",
      "└── Analytics Dashboard (React, Python, FastAPI)",
      "    └── Real-time data visualization platform",
      "",
      "Open Source Contributions:",
      "├── React (5 PRs merged)",
      "├── Next.js (3 PRs merged)",
      "└── Various npm packages",
      "",
    ],
    contact: () => [
      "Contact Information:",
      "Email: john@developer.com",
      "Phone: +1 (555) 123-4567",
      "GitHub: github.com/johndeveloper",
      "LinkedIn: linkedin.com/in/johndeveloper",
      "Website: johndeveloper.dev",
      "Location: San Francisco, CA",
      "",
      "Available for:",
      "├── Full-time opportunities",
      "├── Freelance projects",
      "├── Technical consulting",
      "└── Speaking engagements",
      "",
    ],
    whoami: () => ["developer"],
    pwd: () => [currentPath.replace("/home/developer", "~")],
    date: () => [new Date().toString()],
    uptime: () => ["System uptime: 42 days, 13 hours, 37 minutes"],
    uname: () => ["Linux ubuntu 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"],
    ps: () => [
      "  PID TTY          TIME CMD",
      " 1234 pts/0    00:00:01 bash",
      " 5678 pts/0    00:00:00 portfolio",
      " 9012 pts/0    00:00:00 ps",
    ],
    top: () => [
      "Tasks: 156 total,   1 running, 155 sleeping",
      "CPU usage: 12.5% user, 3.2% system, 84.3% idle",
      "Memory: 8192MB total, 4096MB used, 4096MB free",
      "",
      "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND",
      " 1234 developer 20   0  123456  45678  12345 S   5.2  2.1   0:12.34 portfolio",
      " 5678 developer 20   0   98765  32109   8765 S   2.1  1.5   0:05.67 firefox",
    ],
    df: () => [
      "Filesystem     1K-blocks    Used Available Use% Mounted on",
      "/dev/sda1       20971520 8388608  12582912  40% /",
      "/dev/sda2        2097152  524288   1572864  25% /home",
      "tmpfs            4194304       0   4194304   0% /tmp",
    ],
    free: () => [
      "              total        used        free      shared  buff/cache   available",
      "Mem:        8388608     4194304     2097152      524288     2097152     3670016",
      "Swap:       2097152           0     2097152",
    ],
    history: () => commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`),
    ls: async (args: string[]) => {
  const targetPath = args[0] || "."
  const fullPath =
    targetPath.startsWith("/") || targetPath.startsWith("~")
      ? targetPath
      : currentPath + "/" + targetPath

  const contents = await listDirectoryContents(fullPath) // <- await

  if (!Array.isArray(contents)) {
    return [`ls: ${targetPath}: Not a directory`]
  }

  return contents.map((item) => item.name)
},
  ll: async (args: string[]) => {
  const targetPath = args[0] || "."
  const fullPath =
    targetPath.startsWith("/") || targetPath.startsWith("~")
      ? targetPath
      : currentPath + "/" + targetPath

  const contents = await listDirectoryContents(fullPath)

  if (!Array.isArray(contents)) {
    return [`ll: ${targetPath}: Not a directory`]
  }

  const items = contents.map((item) => {
    const isDir = item.type === "folder"
    const permissions = isDir ? "drwxr-xr-x" : "-rw-r--r--"
    const size = isDir ? "4096" : Math.floor(Math.random() * 10000).toString()
    const date = "Dec 15 10:30"
    return `${permissions} 1 developer developer ${size.padStart(8)} ${date} ${item.name}`
  })

  return [`total ${items.length}`, ...items]
},
    cat: (args: string[]) => {
      if (!args[0]) {
        return ["cat: missing file operand"]
      }
      const fileName = args[0]
      const fullPath = fileName.startsWith("/") || fileName.startsWith("~") ? fileName : currentPath + "/" + fileName
      const segments = resolvePathSegments(fullPath)
      const entry = getEntry(segments)

      if (entry === undefined) {
        return [`cat: ${fileName}: No such file or directory`]
      }
      if (typeof entry === "object") {
        return [`cat: ${fileName}: Is a directory`]
      }
      return entry.split("\n")
    },
    cd: (args: string[]) => {
      if (!args[0] || args[0] === "~") {
        setCurrentPath("/home/developer/portfolio")
        return []
      }

      const targetPath = args[0]
      const newFullPath =
        targetPath.startsWith("/") || targetPath.startsWith("~") ? targetPath : currentPath + "/" + targetPath
      const segments = resolvePathSegments(newFullPath)
      const entry = getEntry(segments)

      if (entry === undefined) {
        return [`cd: ${targetPath}: No such file or directory`]
      }
      if (typeof entry === "string") {
        return [`cd: ${targetPath}: Not a directory`]
      }

      setCurrentPath("/" + segments.join("/"))
      return []
    },
    mkdir: (args: string[]) => {
      if (!args[0]) {
        return ["mkdir: missing operand"]
      }
      const newDirName = args[0]
      const fullPath =
        newDirName.startsWith("/") || newDirName.startsWith("~") ? newDirName : currentPath + "/" + newDirName
      const segments = resolvePathSegments(fullPath)
      const parentSegments = segments.slice(0, -1)
      const finalSegment = segments[segments.length - 1]

      const parentEntry = getEntry(parentSegments)
      if (parentEntry === undefined || typeof parentEntry === "string") {
        return [`mkdir: cannot create directory '${newDirName}': No such file or directory`]
      }

      if (finalSegment in (parentEntry as object)) {
        return [`mkdir: cannot create directory '${newDirName}': File exists`]
      }

      updateFileSystem(segments, {}) // Create an empty object for the new directory
      return []
    },
    touch: (args: string[]) => {
      if (!args[0]) {
        return ["touch: missing file operand"]
      }
      const newFileName = args[0]
      const fullPath =
        newFileName.startsWith("/") || newFileName.startsWith("~") ? newFileName : currentPath + "/" + newFileName
      const segments = resolvePathSegments(fullPath)
      const parentSegments = segments.slice(0, -1)
      const finalSegment = segments[segments.length - 1]

      const parentEntry = getEntry(parentSegments)
      if (parentEntry === undefined || typeof parentEntry === "string") {
        return [`touch: cannot create file '${newFileName}': No such file or directory`]
      }

      if (finalSegment in (parentEntry as object)) {
        return [`touch: cannot create file '${newFileName}': File exists`]
      }

      updateFileSystem(segments, "") // Create an empty string for the new file
      return []
    },
    rm: (args: string[]) => {
      if (!args[0]) {
        return ["rm: missing operand"]
      }
      const itemToRemove = args[0]
      const fullPath =
        itemToRemove.startsWith("/") || itemToRemove.startsWith("~") ? itemToRemove : currentPath + "/" + itemToRemove
      const segments = resolvePathSegments(fullPath)
      const parentSegments = segments.slice(0, -1)
      const finalSegment = segments[segments.length - 1]

      const parentEntry = getEntry(parentSegments)
      if (parentEntry === undefined || typeof parentEntry === "string") {
        return [`rm: cannot remove '${itemToRemove}': No such file or directory`]
      }

      if (!(finalSegment in (parentEntry as object))) {
        return [`rm: cannot remove '${itemToRemove}': No such file or directory`]
      }

      // Check if it's a directory and not empty (for a simple rm, not rmdir -r)
      const entryToRemove = getEntry(segments)
      if (typeof entryToRemove === "object" && Object.keys(entryToRemove).length > 0) {
        return [`rm: cannot remove '${itemToRemove}': Directory not empty`]
      }

      updateFileSystem(segments, undefined) // Remove the entry
      return []
    },
    clear: () => {
      setHistory([])
      return []
    },
  }
const handleCommand = async (cmd: string): Promise<string[]> => {
  const [command, ...args] = cmd.trim().split(" ")

  if (cmd.trim()) {
    setCommandHistory((prev) => [...prev, cmd.trim()])
  }

  const commandFn = commands[command as keyof typeof commands]

  if (commandFn) {
    const output = await commandFn(args) // ✅ await here
    return Array.isArray(output) ? output : [output]
  } else if (command === "") {
    return []
  } else {
    return [`bash: ${command}: command not found`]
  }
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const displayPath = currentPath.replace("/home/developer", "~")
  const prompt = `developer@ubuntu:${displayPath}$ ${input}`

  const output = await handleCommand(input) // ✅ await async command
  setHistory((prev) => [...prev, prompt, ...output])
  setInput("")
  setHistoryIndex(-1)
}


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "")
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "")
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Simple tab completion for commands
      const commandsForCompletion = Object.keys(commands)
      const matches = commandsForCompletion.filter((cmd) => cmd.startsWith(input))
      if (matches.length === 1) {
        setInput(matches[0])
      } else if (matches.length > 1) {
        // If multiple matches, show them and don't complete
        setHistory((prev) => [
          ...prev,
          `developer@ubuntu:${currentPath.replace("/home/developer", "~")}$ ${input}`,
          ...matches,
        ])
        setInput(input) // Keep current input
      }
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    // Focus input when terminal is opened
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="h-full bg-gray-900 text-green-400 font-mono text-sm" onClick={() => inputRef.current?.focus()}>
      <div ref={terminalRef} className="h-full p-4 overflow-auto">
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-green-400 mr-2">developer@ubuntu:{currentPath.replace("/home/developer", "~")}$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400"
            autoFocus
          />
        </form>
      </div>
    </div>
  )
}
