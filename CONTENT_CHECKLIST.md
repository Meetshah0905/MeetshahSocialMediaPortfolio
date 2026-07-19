# Content checklist

Everything Meet still needs to supply. Nothing here is invented — each item is a real gap, marked `[[LIKE THIS]]` in the code.

**Rule:** never fill these with plausible-sounding filler. An empty section hides in production; a fake one damages credibility with the exact people this site is for.

---

## Identity and contact — `src/content/site.ts`, `src/content/contact.ts`

| Item | Placeholder | Where |
|---|---|---|
| Email address | `[[ADD EMAIL]]` | `site.email` |
| Phone (or delete) | `[[ADD PHONE OR REMOVE]]` | `site.phone` — set to `""` to hide |
| Footer positioning line | `[[ADD SHORT FOOTER POSITIONING LINE]]` | `footerContent.positioning` |
| Contact intro | `[[ADD SHORT CONTACT INTRO]]` | `contact.intro` |
| Expected next step | `[[ADD EXPECTED NEXT STEP]]` | `contact.nextStep` |

## Channel positioning — `src/content/site.ts`

| Item | Placeholder |
|---|---|
| Fitness positioning line | `[[ADD FITNESS POSITIONING LINE]]` |
| Fitness channel description | `[[ADD FITNESS CHANNEL DESCRIPTION]]` |
| Finance positioning line | `[[ADD FINANCE POSITIONING LINE]]` |
| Finance channel description | `[[ADD FINANCE CHANNEL DESCRIPTION]]` |

Content pillars for both channels are pre-filled with reasonable defaults — **review and edit them**, they're placeholders too.

## Images — `/public/images/`

All are currently `null` and render as labelled placeholders. Set the path in content once the file is on disk.

| Asset | Suggested path | Used by |
|---|---|---|
| Hero portrait (B&W studio) | `/images/meet/hero-portrait.webp` | Home hero |
| About lifestyle photo (lake) | `/images/meet/about-lifestyle.webp` | About |
| Fitness channel hero | `/images/fitness/hero.webp` | `channels.fitness.heroImage` |
| Finance channel hero | `/images/finance/hero.webp` | `channels.finance.heroImage` |
| Open Graph share image | generated in Phase 8 | social sharing |

## Not yet created (later phases)

These files don't exist yet — listed so nothing is forgotten.

- **Reels** (Phase 2/3): thumbnail + real Instagram URL + title per reel, for both channels.
- **Brand collaborations** (Phase 2): 6 slots — real names and logos only. **No invented brands.**
- **Testimonials** (Phase 3): real quotes with attribution, or the section stays hidden.
- **Packages** (Phase 3): names, deliverables, revision counts, turnaround, usage rights. Prices optional — missing shows "Custom quote", never `₹0`.
- **About** (Phase 3): the 2–3 year journey. No invented dates or milestones.
- **UGC process copy** (Phase 3): script / shoot / edit / publish.
- **Gear list** (Phase 3): optional — section hides if empty.
- **Analytics screenshots** (Phase 5+): Instagram Insights for 30-day and 90-day, per channel.

## Configuration

| Variable | Needed for |
|---|---|
| `GEMINI_API_KEY` | Screenshot extraction |
| `ANALYTICS_ADMIN_PASSCODE` | Admin login |
| `ANALYTICS_SESSION_SECRET` | Signing the admin session |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Publishing reports |
| `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | Contact form (optional — form hides without it) |

## Decisions Meet needs to make

1. **Final hero headline.** Currently "Content built for attention, trust and action." Alternative in the spec: "Fitness and finance content that converts."
2. **One-line positioning statement** — the single most important sentence on the site.
3. **Phone number:** publish or omit?
4. **Primary contact preference:** email or Instagram DM? (`site.primaryContactPreference`)
5. **Finance disclaimer wording** — a conservative default is in `site.ts`.
