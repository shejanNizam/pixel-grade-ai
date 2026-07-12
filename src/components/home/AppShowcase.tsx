import Image from "next/image";

const steps = [
  {
    tab: "SCAN",
    step: "1",
    title: "Scan",
    body: "Snap a clear photo of your card",
    src: "/assets/straight_phone_one.png",
  },
  {
    tab: "GRADE",
    step: "2",
    title: "GRADE",
    body: "Get AI grade and detailed report",
    src: "/assets/straight_phone_two.png",
  },
  {
    tab: "BRAND",
    step: "3",
    title: "BRAND",
    body: "Add brands, choose label, make it yours",
    src: "/assets/straight_phone_three.png",
  },
  {
    tab: "SLAB",
    step: "4",
    title: "SLAB",
    body: "We print and ship your custom slab to you",
    src: "/assets/straight_phone_four.png",
  },
];

export default function AppShowcase() {
  return (
    <section className="bg-black px-4 py-20">
      <div className="mx-auto max-w-6xl text-center">
        {/* <h2 className="text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
          Your Cards, Your Grades
          <br />
          Your slabs.
        </h2> */}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {steps.map((s) => (
            <span key={s.tab} className="text-lg font-medium text-fuchsia-500">
              {s.tab}
            </span>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.tab} className="flex flex-col items-center">
              <div className="rounded-3xl border border-violet-500/40 p-2">
                <Image
                  src={s.src}
                  alt={`${s.title} screen`}
                  width={280}
                  height={560}
                  className="h-auto w-full rounded-2xl"
                />
              </div>

              <div className="mt-5 w-full rounded-2xl border border-violet-500/40 bg-linear-to-b from-violet-950/40 to-black p-4 text-left">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs font-semibold text-white">
                    {s.step}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {s.title}
                  </span>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
