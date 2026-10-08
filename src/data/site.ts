// Single source of truth for the home page and the résumé.

export const person = {
  name: 'Michael Lane',
  title: 'VP of Engineering',
  location: 'Dallas, Texas',
  email: 'michael@michaellane.ai',
  linkedin: 'https://www.linkedin.com/in/michaelnlane/',
  github: 'https://github.com/arsindelve',
  status: 'Open to VP of Engineering roles',
};

export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  place: string;
  summary: string;
  points?: string[];
  stack?: string;
};

// Most recent first. The three most recent companies get the full treatment;
// the rest render compactly.
export const roles: Role[] = [
  {
    company: 'Rev',
    title: 'Vice President of Software Development',
    start: 'Aug 2025',
    end: 'Mar 2026',
    place: 'Austin, TX · Hybrid',
    summary:
      'Led a 60-person engineering organization across product engineering, AI, R&D and design, responsible for Rev’s AI, SaaS and mobile platforms.',
    points: [
      'Ran engineering for Rev’s LLM-based legal assistant, a RAG and multi-agent system ranked the #1 leader in G2’s AI Legal Assistant category (Summer 2025), built on Rev’s speech-to-text.',
      'Set technical direction and organizational strategy for the core products.',
    ],
  },
  {
    company: 'Rev',
    title: 'Senior Director, Software Development, SaaS',
    start: 'Mar 2024',
    end: 'Aug 2025',
    place: 'Austin, TX · Hybrid',
    summary:
      'Led the teams building Rev’s SaaS platform: customer-facing product and core platform services.',
    points: [
      'Moved Rev from transactional to subscription billing: Zuora integration, seat-based plans and a new purchase experience. It now drives 750+ self-serve sign-ups a day.',
      'Brought the first applied-AI capabilities (LLMs, retrieval, agent workflows) into the SaaS product.',
    ],
  },
  {
    company: 'Cart.com',
    title: 'Director of Software Engineering',
    start: 'Aug 2022',
    end: 'Mar 2024',
    place: 'Austin, TX',
    summary:
      'Led the Core Services teams (identity, orders, shipping, notifications), then the Fulfillment group running warehouse software across 13 locations.',
    stack: 'C#/.NET, NestJS, Django, Kafka, GraphQL, Kubernetes on GKE and EKS',
  },
  {
    company: 'Sesami',
    title: 'Director of Software Engineering, Tidel Division',
    start: 'Jan 2021',
    end: 'Aug 2022',
    place: 'Remote',
    summary:
      'Led 16 engineers and 2 managers. Moved a 20-year-old Subversion codebase to Git and Azure DevOps, with CI/CD, automated testing, real code review and Scrum.',
    stack: 'Azure IoT, SQL Server, WPF',
  },
  {
    company: 'Premier Designs',
    title: 'Vice President of Software Development',
    start: 'Jan 2017',
    end: 'Dec 2020',
    place: 'Irving, TX',
    summary:
      'Member of the executive team. Owned servers, network, security, data, ERP and software development, and a multi-million-dollar annual IT budget.',
  },
  {
    company: 'LinkGreen',
    title: 'Head of Development',
    start: 'Apr 2014',
    end: 'Jan 2017',
    place: 'Ontario, Canada',
    summary: 'Led technology for a start-up from inception through R&D to launch in 2016, with daily automated deploys to Azure.',
  },
  {
    company: 'Kobo',
    title: 'Senior Software Development Manager',
    start: 'Sep 2012',
    end: 'Apr 2014',
    place: 'Toronto',
    summary: 'Managed two teams building kobo.com, where readers worldwide buy from a catalogue of three million e-books.',
  },
  {
    company: 'Toolbox Solutions',
    title: 'Software Development Manager',
    start: 'Mar 2011',
    end: 'Sep 2012',
    place: 'Barrie, ON',
    summary: 'Led two .NET teams. Toolbox was later acquired by SPS Commerce.',
  },
  {
    company: 'Logitech',
    title: 'Software Development Manager',
    start: 'Jan 2009',
    end: 'Mar 2011',
    place: 'Ontario, Canada',
    summary:
      'First management role: local and offshore iPhone teams, Scrum, TDD and CI, and the Logitech Revue for Google TV. A commercial failure, but I loved being on the team that built it.',
  },
  {
    company: 'GPS Industries · illumiCell',
    title: 'Senior .NET Developer',
    start: 'May 2007',
    end: 'Oct 2008',
    place: 'Canada',
    summary: 'Hands-on C# and SQL Server: domain models, web service layers, and the start of a habit of test-driven design.',
  },
];

export type Project = {
  name: string;
  years: string;
  url?: string;
  urlLabel?: string;
  repo?: string;
  blurb: string;
  facts: string[];
  // Who did what. Stated plainly on purpose.
  me: string;
  ai: string;
};

export const projects: Project[] = [
  {
    name: 'ZorkAI',
    years: '2024 – now',
    url: 'https://newzork.ai',
    urlLabel: 'newzork.ai · planetfall.ai',
    repo: 'https://github.com/arsindelve/ZorkAI',
    blurb:
      'An engine that rebuilds Infocom’s text adventures with an AI narrator who never breaks character. The original rooms, objects and puzzles are intact; the parser finally understands what you meant.',
    facts: ['C#', 'AWS Lambda', 'DynamoDB', 'React', '3,400+ tests', 'Two games live'],
    me: 'Architecture, the game engine, the rules that keep the model faithful to the original, and most of the early code.',
    ai: 'The narrator itself. Increasingly, AI agents write code against the test suite while I review.',
  },
  {
    name: 'PlayZork',
    years: '2025 – now',
    repo: 'https://github.com/arsindelve/PlayZork',
    blurb:
      'Research into LLM agents on long-horizon problems, using Zork as the testbed. A single model with memory loops and thrashes, so I built a multi-agent design: advocates for each objective, an explorer that proposes information-gathering moves, and an arbiter that decides.',
    facts: ['Python', 'LangChain', 'Ollama', 'Zenodo DOI'],
    me: 'The research question, the architecture and the experiments. It continues into my MSc.',
    ai: 'The subject of the research. Then Claude Opus 4.7, with none of my scaffolding, cleared my escape-room benchmark in 45 seconds. That was humbling, and it was data.',
  },
  {
    name: 'Unopened Worlds',
    years: '2026',
    url: 'https://unopenedworlds.com',
    urlLabel: 'unopenedworlds.com',
    repo: 'https://github.com/arsindelve/UnopenedWorlds',
    blurb:
      'A tribute to the 32 Infocom “grey-box” games from 1980 to 1988, photographed from my own collection, with the two AI rebuilds as the epilogue.',
    facts: ['TypeScript', 'Next.js', 'S3 + CloudFront'],
    me: 'The collection, the photographs, the editorial voice and every decision about what to include.',
    ai: 'The site’s code, written by Claude Code under my direction.',
  },
  {
    name: 'The Manifest Chronicles',
    years: '1992 / 2026',
    url: 'https://arsindelve.github.io/manifest-chronicles/',
    urlLabel: 'Play it in your browser',
    repo: 'https://github.com/arsindelve/manifest-chronicles',
    blurb:
      'A first-person dungeon crawler I wrote in QuickBASIC in high school: four 50×50 levels, 48 monsters, a wizard named Beldan. Thirty-four years later it runs in the browser, matched screen by screen against version 2.01, with the 1995 bugs kept on purpose.',
    facts: ['QuickBASIC (1992)', 'TypeScript (2026)', 'Original data files, unmodified'],
    me: 'The original game, in 1992. In 2026, the decision to port it faithfully, and the screen-by-screen verification.',
    ai: 'The TypeScript port, written by Claude Code reading my teenage source.',
  },
];

export const principles = [
  {
    head: 'You can’t lead engineers without understanding the work.',
    body: 'I still read code, write code and review code. Technical credibility is what makes the rest of leadership possible.',
  },
  {
    head: 'Make your code boring. Make it obvious. Make it kind.',
    body: 'The most expensive resource in computing is developer time. Clever code costs it; clear code saves it.',
  },
  {
    head: 'Architecture that ignores the business is just an expensive mistake.',
    body: 'The right design is the one that ships, serves customers and can be maintained by the team you actually have.',
  },
  {
    head: 'If the AI can’t write the test, the code is probably the problem.',
    body: 'Something trained on trillions of lines of code is a decent proxy for the next developer. I use that.',
  },
];

export const education = [
  {
    degree: 'MSc, Artificial Intelligence',
    school: 'East Texas A&M University',
    when: 'In progress',
    note: 'My research on multi-agent LLM decision-making, PlayZork, continues here.',
    link: { label: 'PlayZork case study', href: '/work/playzork' },
  },
  {
    degree: 'MBA',
    school: 'East Texas A&M University',
    when: 'Graduated 2025 · 4.0 GPA',
  },
];
