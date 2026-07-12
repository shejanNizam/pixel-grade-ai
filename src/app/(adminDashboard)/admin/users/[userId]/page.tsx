import Image from "next/image";
import BackHeading from "../../_components/BackHeading";
import { userDetails } from "../../_components/users/data";

export default function UserDetailsPage() {
  const { name, email, state, cards } = userDetails;

  return (
    <div>
      <BackHeading label="User details" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <section>
          <h2 className="mb-3 text-sm text-zinc-400">Post by</h2>

          <article className="flex items-center gap-4 rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-4">
            <Image
              src="/assets/main_logo.png"
              alt=""
              width={56}
              height={56}
              className="h-12 w-12 shrink-0 object-contain"
            />

            <div className="min-w-0 text-xs leading-relaxed">
              <p className="text-base font-medium text-white">{name}</p>
              <p className="truncate text-zinc-400">Email : {email}</p>
              <p className="truncate text-zinc-400">State : {state}</p>
            </div>
          </article>
        </section>

        <section>
          <h2 className="mb-3 text-sm text-zinc-400">Card</h2>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <article
                key={card.id}
                className="rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-4"
              >
                <Image
                  src={card.image}
                  alt=""
                  width={320}
                  height={440}
                  className="w-full rounded-xl object-cover"
                />

                <dl className="mt-4 flex flex-wrap gap-2">
                  {card.grades.map((grade) => (
                    <div
                      key={grade.label}
                      className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 px-3 py-1.5"
                    >
                      <dt className="text-[11px] text-zinc-400">
                        {grade.label}
                      </dt>
                      <dd className="text-[11px] font-medium text-white tabular-nums">
                        {grade.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
