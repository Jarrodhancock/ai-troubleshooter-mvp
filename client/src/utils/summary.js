export function buildSummary(answers, uploadedFilesMeta = []) {
  // STEP 1
  let osLine = "OS: Not sure";
  if (answers.os === "Windows") {
    const ver = answers.windowsVersion || "Not sure";
    const bits = answers.windowsBits || "Not sure";
    osLine = `OS: Windows ${ver} (${bits})`;
  } else if (answers.os === "macOS") {
    const ver = answers.macosVersion || "Not sure";
    const dev = answers.macosDevice || "Not sure";
    osLine = `OS: macOS ${ver} (${dev})`;
  } else if (answers.os === "Linux") {
    osLine = `OS: Linux`;
  }

  // STEP 2
  const cpu = answers.cpu || "Not sure";
  const ram = answers.ram || "Not sure";
  const storage = answers.storageType || "Not sure";
  const diskFree = answers.diskFree || "Not sure";
  const hwLine = `Hardware: CPU ${cpu}, RAM ${ram}, Storage ${storage}, Free disk ${diskFree}`;

  // STEP 3 (optional)
  const gfx = answers.graphicsCard || null;

  // STEP 4
  const app = answers.problemApp || "Not sure";
  const appVersion = answers.softwareVersion || "Not sure";
  const issueLine = `Issue app: ${app} (${appVersion})`;

  // STEP 5 (optional)
  const netType = answers.networkType || null;
  const netStability = answers.networkStability || null;

  // STEP 6
  const admin = answers.isAdmin || "Not sure";
  const permsLine = `Permissions: Admin = ${admin}`;

  // STEP 7
  const before = answers.beforeIssue || "Not sure";
  const errorMsg = answers.errorMessage || "None";
  const filesLine =
    uploadedFilesMeta.length > 0
      ? `Files uploaded: ${uploadedFilesMeta.map(f => f.originalName).join(", ")}`
      : `Files uploaded: None`;

  const lines = [
    osLine,
    hwLine,
    ...(gfx ? [`Graphics: ${gfx}`] : []),
    ...(netType ? [`Network: ${netType}${netStability ? `, ${netStability}` : ""}`] : []),
    issueLine,
    permsLine,
    `Before issue: ${before}`,
    `Error message: ${errorMsg}`,
    filesLine
  ];

  return lines.join("\n");
}
