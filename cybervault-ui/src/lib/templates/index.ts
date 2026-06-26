export const MACHINE_TEMPLATE = `# Summary
---
# Enumeration
## Nmap
\`\`\`bash
\`\`\`
## Interesting Findings
---
# Exploitation
---
# Privilege Escalation
---
# Timeline
08:20 Started
---
# Mistakes
---
# Lessons Learned
---
# Commands Used
\`\`\`bash
\`\`\`
---
# References
---
# Screenshots
`;

export const CHALLENGE_TEMPLATE = `# Summary
---
# Approach
---
# Code Snippets
\`\`\`python
\`\`\`
---
# Flags
---
# Lessons Learned
---
# References
`;

export const DAILY_TEMPLATE = `# Date: ${new Date().toISOString().split('T')[0]}
---
# What I Did Today
---
# Learnings & Observations
---
# Tomorrow's Focus
`;

export const SHERLOCK_TEMPLATE = `# Scenario
---
# Timeline of Events
---
# IOCs
---
# Artifacts Analysed
---
# Tools Used
---
# Executive Summary
`;

export const ACADEMY_TEMPLATE = `# Summary
---
# Key Concepts
---
# Commands Learned
\`\`\`bash
\`\`\`
---
# Things I Didn't Know
---
# Questions I Still Have
---
# Real-world Relevance
---
# Revision Notes
`;

export function getTemplateForType(type: string | null | undefined): string {
  switch (type) {
    case 'Machine':
      return MACHINE_TEMPLATE;
    case 'Challenge':
      return CHALLENGE_TEMPLATE;
    case 'Sherlock':
      return SHERLOCK_TEMPLATE;
    case 'Daily':
    case 'Daily Note':
      return DAILY_TEMPLATE;
    case 'Academy':
      return ACADEMY_TEMPLATE;
    default:
      return DAILY_TEMPLATE;
  }
}
