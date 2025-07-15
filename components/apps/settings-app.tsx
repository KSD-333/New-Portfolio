"use client"
import { useTheme } from "next-themes"


import { Monitor, Palette, Shield, Wifi, Volume2, Power } from "lucide-react"

export default function SettingsApp() {
  const { theme, setTheme } = useTheme()

  const settingsCategories = [
    // {
    //   title: "Appearance",
    //   icon: Palette,
    //   items: [
        // {
        //   label: "Theme",
        //   description: "Choose between light and dark theme",
        //   control: (
        //     <div className="flex space-x-2">
        //       <button
        //         onClick={() => setTheme("light")}
        //         className={`px-3 py-1 rounded text-sm ${
        //           theme === "light" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
        //         }`}
        //       >
        //         Light
        //       </button>
        //       <button
        //         onClick={() => setTheme("dark")}
        //         className={`px-3 py-1 rounded text-sm ${
        //           theme === "dark" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
        //         }`}
        //       >
        //         Dark
        //       </button>
        //     </div>
        //   ),
    //     // },
    //   ],
    // },
    {
      title: "Display",
      icon: Monitor,
      items: [
        {
          label: "Resolution",
          description: "1920 x 1080 (Recommended)",
          control: <span className="text-sm text-gray-500">Auto</span>,
        },
        {
          label: "Scale",
          description: "Make text and apps larger or smaller",
          control: <span className="text-sm text-gray-500">100%</span>,
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      items: [
        {
          label: "Firewall",
          description: "Ubuntu firewall is active",
          control: <span className="text-sm text-green-600">Enabled</span>,
        },
        {
          label: "Automatic Updates",
          description: "Keep your system up to date",
          control: <span className="text-sm text-green-600">On</span>,
        },
      ],
    },
    {
      title: "Network",
      icon: Wifi,
      items: [
        {
          label: "Wi-Fi",
          description: "Connected to Portfolio-Network",
          control: <span className="text-sm text-green-600">Connected</span>,
        },
        {
          label: "Ethernet",
          description: "Wired connection",
          control: <span className="text-sm text-gray-500">Not connected</span>,
        },
      ],
    },
    {
      title: "Sound",
      icon: Volume2,
      items: [
        {
          label: "Output Volume",
          description: "System sound level",
          control: <input type="range" min="0" max="100" defaultValue="75" className="w-20" />,
        },
      ],
    },
    {
      title: "Power",
      icon: Power,
      items: [
        {
          label: "Power Mode",
          description: "Balanced performance and battery life",
          control: <span className="text-sm text-gray-500">Balanced</span>,
        },
        {
          label: "Screen Blank",
          description: "Turn off screen when inactive",
          control: <span className="text-sm text-gray-500">5 minutes</span>,
        },
      ],
    },
  ]

  return (
    <div className="h-full bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <h2 className="font-semibold text-gray-800 mb-4">Settings</h2>
        <nav className="space-y-2">
          {settingsCategories.map((category, index) => (
            <div key={index} className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
              <category.icon className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-sm text-gray-700">{category.title}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">System Settings</h1>

          <div className="space-y-8">
            {settingsCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center mb-4">
                  <category.icon className="w-6 h-6 text-gray-600 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-800">{category.title}</h2>
                </div>

                <div className="space-y-4 ml-9">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <h3 className="font-medium text-gray-800">{item.label}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div>{item.control}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-2">About Ubuntu</h3>
            <div className="text-sm text-orange-700 space-y-1">
              <p>Ubuntu 24.04 LTS "Noble Numbat"</p>
              <p>Kernel: 6.8.0-45-generic</p>
              <p>GNOME: 46.0</p>
              <p>Memory: 16.0 GiB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
