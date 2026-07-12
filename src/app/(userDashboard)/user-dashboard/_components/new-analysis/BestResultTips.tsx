import { FiCrop, FiSun, FiZoomIn } from "react-icons/fi";

/* The Figma's tip list was partly covered in the screenshot — the first tip is
   verbatim, the rest follow its pattern. Easy to correct once it's readable. */
const tips = [
  {
    Icon: FiSun,
    title: "Use good lighting",
    body: "Avoid shadows and glare",
  },
  {
    Icon: FiZoomIn,
    title: "Focus clarity",
    body: "Make sure the card is sharp and in focus",
  },
  {
    Icon: FiCrop,
    title: "Fill the frame",
    body: "Keep the whole card in shot on a plain background",
  },
];

export default function BestResultTips() {
  return (
    <section>
      <h2 className="text-lg font-medium text-white">Tips for best result</h2>

      <ul className="mt-5 space-y-4">
        {tips.map(({ Icon, title, body }) => (
          <li key={title} className="flex gap-3">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">
              <Icon className="text-sm" />
            </span>
            <div>
              <p className="text-sm text-white">{title}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
