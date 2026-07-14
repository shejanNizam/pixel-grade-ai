/* Frontend-only placeholder data for the Creator profile screen. */

export const impact = [
  { value: "128", label: "Total cards certified" },
  { value: "$ 3526", label: "Total market value" },
  { value: "92 %", label: "Avg confidence score" },
  { value: "92 %", label: "Slabs ordered" },
  { value: "92 %", label: "Community rating" },
];

export const creator = {
  name: "Alex Alfred",
  badge: "Pixel verified",
  stats: [
    { value: "358", label: "Cards certified" },
    { value: "12k", label: "Followers" },
    { value: "12k", label: "Following" },
  ],
  activity: [
    { text: "Slab order is confirmed", when: "2h ago" },
    { text: "New review on your profile", when: "2d ago" },
    { text: "Your report was verified", when: "5h ago" },
    { text: "New followers", when: "7h ago" },
  ],
};

/** "David joseph" -> "DJ". The avatar is initials until real artwork exists. */
export const initials = creator.name
  .split(" ")
  .map((part) => part[0])
  .join("")
  .toUpperCase();
