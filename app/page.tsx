import Image from 'next/image'
import type { ReactNode } from 'react'

const courseTopics = [
  {
    title: 'UI/UX Fundamentals',
    text: 'Review the fundamentals of user-friendly web interface design with UX research (covered in previous courses)',
  },
  {
    title: 'Traditional HTML/CSS/JS',
    text: 'Learn from the ground up by using basic HTML tags, then amplify web pages with CSS, and finally write JavaScript to interact with users or handle DOM events within web pages',
  },
  {
    title: 'React Web Applications',
    text: 'Start with basic React concepts such as the Virtual DOM, class and function components, props and state, followed by numerous hands-on React examples',
  },
  {
    title: 'Back-End/Interface Preparation',
    text: 'Examples prepared for future back-end interfaces via APIs',
  },
  {
    title: 'DevOps Fundamentals',
    text: 'Topics such as virtual machines, container technologies, version control, and deployment tools',
  },
]

const goals = [
  {
    title: 'Build solid front-end foundations',
    text: 'Write clean, semantic HTML, maintainable CSS, and JavaScript that handles user interaction confidently',
  },
  {
    title: 'Master React',
    text: 'Understand components, props, and state well enough to build a complete web application on my own',
  },
  {
    title: 'Design for real users',
    text: 'Apply UI/UX principles so every page I build is clear, responsive, and easy to use',
  },
  {
    title: 'Connect with back-end services',
    text: 'Learn to consume APIs and prepare front-end code that works smoothly with a back-end',
  },
  {
    title: 'Work like a professional developer',
    text: 'Use Git, containers, and deployment tools to ship projects reliably and collaborate with others',
  },
]

const affiliations = [
  'Innovation Dept. (CSI)',
  'School of Information Technology (SIT)',
  'Sripatum University (SPU)',
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-4 text-lg font-bold text-slate-900">{title}</h2>
      {children}
    </section>
  )
}

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      {/* Profile card */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 sm:h-36" />
        <div className="px-6 pb-8 sm:px-10">
          <div className="-mt-16 flex flex-col items-center gap-5 sm:-mt-20 sm:flex-row sm:items-end">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg sm:h-40 sm:w-40">
              <Image
                src="/face.png"
                alt="Profile Picture"
                fill
                sizes="160px"
                className="object-cover"
                priority
              />
            </div>
            <div className="text-center sm:pt-10 sm:text-left">
              <p className="text-sm font-semibold text-indigo-600">68032408</p>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                นายจักรกฤษ มะตะผล
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Computer Science and Software Development
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
            {affiliations.map((item) => (
              <span
                key={item}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <Section title="About Me">
        <p className="leading-relaxed text-slate-600">
          I am a Computer Science and Software Development student at the School
          of Information Technology, Sripatum University. I enjoy turning ideas
          into working web interfaces and I am currently studying front-end
          development in CSI205, where I learn to build web pages from plain
          HTML, CSS, and JavaScript up to modern React applications. This site is
          one of my course projects, created to practice component-based design.
        </p>
      </Section>

      {/* Course topics */}
      <Section title="CSI205 Front-End Software Development covers">
        <div className="grid gap-3 sm:grid-cols-2">
          {courseTopics.map((item, index) => (
            <div
              key={item.title}
              className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:[&:last-child:nth-child(odd)]:col-span-2"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {index + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Goals */}
      <Section title="My Goals">
        <ul className="space-y-4">
          {goals.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                ✓
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <p className="text-center text-sm italic text-slate-400">
        Let&apos;s code, build, and have fun together!
      </p>
    </div>
  )
}