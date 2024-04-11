import { Email, LinkedIn, Phone } from '@mui/icons-material';
import {
  AmazonwebservicesPlainWordmark,
  BunPlain,
  DockerPlain,
  EslintOriginal,
  FirebasePlain,
  GithubOriginal,
  GithubactionsPlain,
  GitlabPlain,
  JestPlain,
  KubernetesPlain,
  MaterialuiPlain,
  MongodbPlain,
  MysqlOriginal,
  NextjsPlain,
  NodejsPlain,
  PlaywrightPlain,
  PnpmPlain,
  PrismaOriginal,
  PulumiPlain,
  ReactOriginal,
  ReduxOriginal,
  TrpcPlain,
  TypescriptPlain,
  WebpackPlain,
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
    role: 'Software & Platform Engineer',
    company: 'Cambridge Intelligence',
    location: 'Cambridge, Cambridgeshire',
    duration: 'Sep 2021 - [present]',
    employment: 'Full-time',
    description:
      'Worked in the ReGraph, KeyLines, Prototyping and DevSecOps teams but most prominently in the Platform Team. Highlights include:',
    highlights: [
      {
        label: 'Innovation Centre',
        role: 'Platform',
        span: 2,
        description:
          'Singlehandedly built and deployed an internal SaaS product which hosts a collection of static apps built by developers and accessible by product managers to drive innovation. The Innovation Centre also allows developers manage their GitLab branches and review apps, access the logs for the pods running review apps which are stored on Kubernetes / AWS CloudWatch, and contribute to a growing collection of playgrounds which demonstrate product capabilities in order to support external customers.',
      },
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
          'Built a service which produces semi-interactive SVG charts using Puppeteer and ReGraph on a network of microservices, inspiring a new customer base seeking lower-priced accessible charts.',
      },
      {
        label: 'Automated Secrets Rotation',
        role: 'Platform',
        description:
          'Automated the rotation of SSH keys and access tokens stored on 1Password used as CI/CD pipeline variables for all company GitHub and GitLab projects, cutting the average time of the weekly process from 6 hours to 3 minutes.',
      },
      {
        label: 'Core Infrastructure Refactor',
        role: 'Platform',
        description:
          'Modularised our Infrastructure-as-Code repository by breaking down the stack and separating all Pulumi resources into appropriate projects and sub-stacks, significantly increasing the performance of previews and updates.',
      },
      // {
      //   label: 'Security Audit',
      //   role: 'DevSecOps',
      //   description:
      //     'Addressed 100+ site and SDK security vulnerabilities in response to pen testing including the examination of vulnerable dependencies across all products, patching username enumeration and instating relevant HTTP security headers, improving the security benchmark by 14%.',
      // },
      // {
      //   label: 'Node Customisation Showcases',
      //   role: 'Prototyping',
      //   description:
      //     'Within a sprint, produced a series of 6 visually-appealing demonstrable ReGraph visualisations for the Marketing team to showcase unreleased features to a conference of 68 customers, driving significant interest for pending releases.',
      // },
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
      'Led a team of 29 volunteers and developed software to facilitate 100+ discussions and debates on various sociopolitical topics at university campuses, secondary schools and with external organisations. Highlights include:',
    highlights: [
      {
        label: 'Web Application',
        description:
          'Designed and built the web application used for adding, updating and deleting session reviews, candidate tributes, team member profiles and the exhaustive bank of over 200 categorised debate topics.',
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
      { label: 'Next.js', Icon: NextjsPlain },
      { label: 'React', Icon: ReactOriginal },
      { label: 'Node.js', Icon: NodejsPlain },
      { label: 'Material UI', Icon: MaterialuiPlain },
      { label: 'Redux', Icon: ReduxOriginal },
      { label: 'tRPC', Icon: TrpcPlain },
      { label: 'Playwright', Icon: PlaywrightPlain },
      { label: 'Prisma', Icon: PrismaOriginal },
      { label: 'Docker', Icon: DockerPlain },
      { label: 'Pulumi', Icon: PulumiPlain },
      { label: 'AWS', Icon: AmazonwebservicesPlainWordmark },
      { label: 'Bun', Icon: BunPlain },
      { label: 'ESLint', Icon: EslintOriginal },
    ],
  },
  Side: {
    preamble: 'Also worked with...',
    stack: [
      { label: 'Kubernetes', Icon: KubernetesPlain },
      { label: 'MongoDB', Icon: MongodbPlain },
      { label: 'MySQL', Icon: MysqlOriginal },
      { label: 'Webpack', Icon: WebpackPlain },
      { label: 'Jest', Icon: JestPlain },
      { label: 'pnpm', Icon: PnpmPlain },
      { label: 'GitLab CI', Icon: GitlabPlain },
      { label: 'GitHub Actions', Icon: GithubactionsPlain },
      { label: 'React Native', Icon: ReactOriginal },
      { label: 'Firebase', Icon: FirebasePlain },
    ],
  },
};

export const PROFILE_SUMMARY =
  'A diligent developer whose experience with client, server and cloud technologies alongside his affinity for all things web development and automation drives his creative ability. Joining these traits are his consistent knack for grasping new tools and concepts, perseverance at solving problems, attention to detail, and a chronic cheerful smile.';

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
    span?: 1 | 2;
  }>;
}
