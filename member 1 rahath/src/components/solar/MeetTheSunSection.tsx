import { MEET_THE_SUN_TOPICS } from '../../data/solarActivityData';

export function MeetTheSunSection() {
  return (
    <section
      id="meet-the-sun"
      aria-labelledby="meet-the-sun-heading"
      className="border-b border-slate-800/80 bg-[#080D1B] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-wider text-cyan-400">
            Solar Fundamentals · Ages 7–12 Guide
          </p>
          <h2
            id="meet-the-sun-heading"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-3xl lg:text-4xl"
          >
            MEET THE SUN
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Before exploring flares and space weather, learn what our star is made of and how it
            powers every mission in the solar system.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {MEET_THE_SUN_TOPICS.map((topic) => (
            <article
              key={topic.index}
              className="rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 transition-colors duration-150 hover:border-slate-700"
            >
              <p className="font-mono text-xs text-cyan-300">
                {topic.index} <span aria-hidden="true">·</span> Core Concept
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-white">
                {topic.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                {topic.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
