export const MACOS_VERSIONS = [
  "Sonoma 14",
  "Ventura 13",
  "Monterey 12",
  "Big Sur 11",
  "Catalina 10.15",
  "Mojave 10.14",
  "High Sierra 10.13",
  "Not sure"
];

export const DECISION_TREE = [
  {
    id: "step1",
    title: "STEP 1 – What operating system are you using?",
    fields: [
      {
        key: "os",
        label: "Operating system",
        type: "pill",
        options: ["Windows", "macOS", "Linux", "Not sure"]
      }
    ],
    subSteps: [
      {
        when: (a) => a.os === "Windows",
        fields: [
          {
            key: "windowsVersion",
            label: "What version of Windows?",
            type: "select",
            options: ["Windows 10", "Windows 11", "Not sure"]
          },
          {
            key: "windowsBits",
            label: "Is your system 32-bit or 64-bit?",
            type: "select",
            options: ["64-bit", "32-bit", "Not sure"]
          },
          {
            key: "windowsDeviceType",
            label: "Are you using:",
            type: "select",
            options: ["A work computer (managed by IT)", "A personal computer", "Not sure"]
          }
        ]
      },
      {
        when: (a) => a.os === "macOS",
        fields: [
          {
            key: "macosVersion",
            label: "What macOS version?",
            type: "select",
            options: MACOS_VERSIONS
          },
          {
            key: "macosDevice",
            label: "Device type:",
            type: "select",
            options: ["Intel-based Mac", "Apple Silicon (M1/M2/M3)", "Not sure"]
          }
        ]
      }
    ]
  },
  {
    id: "step2",
    title: "STEP 2 – Hardware Details",
    fields: [
      {
        key: "cpu",
        label: "CPU (choose one)",
        type: "select",
        options: ["Intel", "AMD", "Apple M-series", "Not sure"]
      },
      {
        key: "ram",
        label: "RAM",
        type: "select",
        options: ["4 GB", "8 GB", "16 GB", "32 GB+", "Not sure"]
      },
      {
        key: "storageType",
        label: "Storage type",
        type: "select",
        options: ["SSD", "HDD", "Not sure"]
      },
      {
        key: "diskFree",
        label: "How much free disk space do you currently have?",
        type: "select",
        options: ["Less than 5 GB", "5–20 GB", "20+ GB", "Not sure"]
      }
    ]
  },
  {
    id: "step3",
    title: "STEP 3 – Graphics (only shown if needed)",
    conditionalKey: "showGraphics",
    fields: [
      {
        key: "graphicsCard",
        label: "Do you know your graphics card?",
        type: "select",
        options: ["NVIDIA", "AMD", "Intel", "Apple integrated", "Not sure"]
      }
    ]
  },
  {
    id: "step4",
    title: "STEP 4 – Installed Software",
    fields: [
      {
        key: "problemApp",
        label: "Which app is having an issue?",
        type: "select",
        options: [
          "Microsoft 365 (Word/Excel/Teams/Outlook)",
          "Browsers (Chrome/Edge/Safari/Firefox)",
          "Antivirus",
          "Device drivers",
          "Other"
        ]
      },
      {
        key: "problemAppOther",
        label: "If Other, specify",
        type: "text",
        showWhen: (a) => a.problemApp === "Other"
      },
      {
        key: "softwareVersion",
        label: "What version of the software are you using?",
        type: "select",
        options: ["Latest version", "Older version", "Not sure"]
      }
    ]
  },
  {
    id: "step5",
    title: "STEP 5 – Network (only shown if issue sounds online-related)",
    conditionalKey: "showNetwork",
    fields: [
      {
        key: "networkType",
        label: "Are you using:",
        type: "select",
        options: ["Home Wi-Fi", "Work Wi-Fi", "Ethernet", "Hotspot", "VPN"]
      },
      {
        key: "networkStability",
        label: "How stable is your connection?",
        type: "select",
        options: ["Stable", "Drops occasionally", "Drops frequently"]
      }
    ]
  },
  {
    id: "step6",
    title: "STEP 6 – Permissions",
    fields: [
      {
        key: "isAdmin",
        label: "Are you an admin on the device?",
        type: "select",
        options: ["Yes", "No", "Not sure"]
      }
    ]
  },
  {
    id: "step7",
    title: "STEP 7 – Describe the problem",
    fields: [
      {
        key: "beforeIssue",
        label: "What were you doing right before the issue happened?",
        type: "textarea"
      },
      {
        key: "errorMessage",
        label: "Exact error message (if any)",
        type: "textarea"
      }
      // Screenshot upload is handled separately (still Step 7 per requirements)
    ]
  },
  {
    id: "step8",
    title: "STEP 8 – Summary (auto-generated)",
    fields: []
  }
];
