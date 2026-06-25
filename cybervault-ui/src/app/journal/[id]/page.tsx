import React from 'react';
import JournalClient from './JournalClient';
import { getJournalEntry } from '@/lib/queries/journal';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const MACHINE_TEMPLATE = `# Summary
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

const ACADEMY_TEMPLATE = `# Summary
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

export default async function JournalPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const data = await getJournalEntry(params.id);

  if (!data) {
    notFound();
  }

  const template = data.machine?.type === 'Academy' ? ACADEMY_TEMPLATE : MACHINE_TEMPLATE;

  return (
    <JournalClient 
      initialData={data} 
      machineTemplate={template} 
    />
  );
}
