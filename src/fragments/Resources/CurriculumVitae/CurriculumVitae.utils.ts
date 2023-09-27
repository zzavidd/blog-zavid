import { Email, LinkedIn, Phone } from '@mui/icons-material';
import {
  AmazonwebservicesPlainWordmark,
  CircleciPlain,
  DenojsOriginal,
  DockerPlain,
  EslintOriginal,
  GithubOriginal,
  GithubactionsPlain,
  GitlabPlain,
  JestPlain,
  MaterialuiPlain,
  MongodbPlain,
  MysqlPlain,
  NextjsLine,
  NodejsPlain,
  PlaywrightPlain,
  PnpmPlain,
  PrismaOriginal,
  PuppeteerPlain,
  ReactOriginal,
  ReduxOriginal,
  TrpcPlain,
  TypescriptPlain,
  WebpackPlain,
  YarnOriginal,
} from 'devicons-react';

export const CV_HEIGHT = 3508 / 3;
export const CV_WIDTH = 2480 / 3;

export const CONTACT_DETAILS = <const>[
  { label: 'davidegbue@gmail.com', Icon: Email },
  { label: '+44 7825 737 027', Icon: Phone },
  { label: 'linkedin.com/in/david-egbue', Icon: LinkedIn },
  { label: 'github.com/zzavidd', Icon: GithubOriginal },
];

export const EXPERIENCE: Experience[] = [
  {
    role: 'Software Developer',
    company: 'Cambridge Intelligence',
    location: 'Cambridge, Cambridgeshire',
    duration: 'Sep 2021 - [present]',
    employment: 'Full-time',
    description:
      'Worked extensively on the ReGraph, KeyLines, Platform and Prototyping teams as well as the DevSecOps tiger team. Highlights include:',
    highlights: [
      {
        label: 'Graph Designer',
        role: 'Prototyping',
        description:
          'Within 7 days, built a full-fledged no-code solution on top of the ReGraph SDK using a Next.js-built GUI, enabling developers build demo charts and design themes in less than 10% of the average time.',
      },
      {
        label: 'SVG Service',
        role: 'Prototyping',
        description:
          'Built a service which produces semi-interactive SVG chart using Puppeteer and ReGraph on a network of microservices, inspiring a new customer base seeking lower-priced accessible charts.',
      },
      {
        label: 'Node Customisation Showcases',
        role: 'Prototyping',
        description:
          'Within a sprint, produced a series of 6 visually-appealing demonstrable ReGraph visualisations for the Marketing team to showcase unreleased features to a conference of 68 customers, driving significant interest for pending releases.',
      },
      {
        label: 'Automated Secrets Rotation',
        role: 'Platform',
        description:
          'Automated the rotation of SSH keys and access tokens stored on 1Password used as CI/CD pipeline variables for all company GitHub and GitLab projects, cutting the average time of the weekly process from 6 hours to 3 minutes.',
      },
      {
        label: 'Security Audit',
        role: 'DevSecOps',
        description:
          'Addressed 100+ site and SDK security vulnerabilities in response to pen testing including the examination of vulnerable dependencies across all products, patching username enumeration and instating relevant HTTP security headers, improving the security benchmark by 14%.',
      },
      {
        label: 'WebDriver Overhaul',
        role: 'KeyLines',
        description:
          'Refactored the suite of 98 KeyLines WebDriver tests to use TypeScript and asynchronous WebDriver operations in order to unblock the necessary upgrade to greater versions of Node.js for security purposes. (@wdio/sync breaks for all versions of Node greater than 16).',
      },
    ],
  },
  {
    role: 'Software Developer',
    company: 'IBM',
    location: 'Fulbourn, Cambridgeshire',
    duration: 'Sep 2019 - Sep 2021',
    employment: 'Full-time',
    description:
      'Contributed to the development of i2 Analyze; primarily operating as a Java developer. Highlights include:',
    highlights: [
      {
        label: 'i2 Connect Enablement',
        description:
          'Developed, documented and recorded live tutorials for the usage of the i2 Connect SDK for Java, Node.js and Python to support 40+ customers interfacing with i2 Analyze.',
      },
      {
        label: 'AskMissParks UI',
        description:
          'Designed and built the user interface (and engineered prompts) for "AskMissParks", the Watson-powered chatbot used by IBM\'s BAME Network of 400+ members and allies.',
      },
    ],
  },
  {
    role: 'Director & Web Developer',
    company: '#WOKEWeekly',
    duration: 'Mar 2017 - Feb 2021',
    employment: 'Self-employed',
    location: null,
    description:
      'Leading a team of 29 volunteers to facilitate 100+ discussions and debates on topics centred around and beyond the Black community at university campuses, secondary schools and with external organisations. Highlights include:',
    highlights: [
      {
        label: 'Web Application',
        description:
          'Designed and built the web application used for adding, updating and deleting session reviews, candidate tributes, team member profiles and the exhaustive bank of 215+ categorised debate topics.',
      },
      {
        label: 'Mobile Application',
        description:
          'Developed the React Native mobile application for organisation adminstrators to interface with database information with native accessibility.',
      },
    ],
  },
];

export const EDUCATION = <const>[
  {
    location: 'University of Surrey',
    course: 'BSc Computer Science with Industrial Experience',
    award: 'Awarded First-Class Honours',
    duration: '2015 - 2019',
  },
];

export const TECH_POOL = <const>{
  Main: {
    preamble: 'Primarily work with...',
    stack: [
      { label: 'TypeScript', Icon: TypescriptPlain },
      { label: 'Node.js', Icon: NodejsPlain },
      { label: 'React', Icon: ReactOriginal },
      { label: 'Material UI', Icon: MaterialuiPlain },
      { label: 'Next.js', Icon: NextjsLine },
      { label: 'Redux', Icon: ReduxOriginal },
      { label: 'Prisma', Icon: PrismaOriginal },
      { label: 'tRPC', Icon: TrpcPlain },
      { label: 'MySQL', Icon: MysqlPlain },
      { label: 'Playwright', Icon: PlaywrightPlain },
      { label: 'Docker', Icon: DockerPlain },
      { label: 'CircleCI', Icon: CircleciPlain },
      { label: 'pnpm', Icon: PnpmPlain },
      { label: 'ESLint', Icon: EslintOriginal },
    ],
  },
  Side: {
    preamble: 'Also worked with...',
    stack: [
      { label: 'MongoDB', Icon: MongodbPlain },
      { label: 'AWS', Icon: AmazonwebservicesPlainWordmark },
      { label: 'Puppeteer', Icon: PuppeteerPlain },
      { label: 'Deno', Icon: DenojsOriginal },
      { label: 'Webpack', Icon: WebpackPlain },
      { label: 'Jest', Icon: JestPlain },
      { label: 'Yarn', Icon: YarnOriginal },
      { label: 'GitLab CI', Icon: GitlabPlain },
      { label: 'React Native', Icon: ReactOriginal },
      { label: 'GitHub Actions', Icon: GithubactionsPlain },
    ],
  },
};

export const PROFILE_SUMMARY =
  'A diligent developer whose experience with client, server, database and platform technologies alongside his affinity for all things web development and automation drives his creative ability. Joining these traits are his consistent knack for grasping new tools and concepts, perseverance at solving problems, attention to detail, and a chronic cheerful smile.';

interface Experience {
  role: string;
  company: string;
  location: string | null;
  duration: string;
  employment: string;
  description: string;
  highlights: Array<{
    label: string;
    description: string;
    role?: string;
  }>;
}
