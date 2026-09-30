# Notes for Claude (Hobson / askhobson.homes)

From Paul. Please work through these in order, and check with me before anything that changes how the live site behaves.

## 1. Give every listing its own web address (biggest SEO win)
Right now, when you open a property, the address bar stays `askhobson.homes`, so Google can't see any of our listings.

- Give each MLS listing its own URL in this format: `/listings/street-unit-city-state-zip-mlsid`
  - Example: `/listings/2295-53rd-street-boca-raton-fl-33496-<mlsid>`
  - Model to follow: my friend's site, e.g. modernlivingre.com/listings/701-s-olive-avenue-1219-west-palm-beach-fl-33401-1181392897
- The page should load directly with the details rendered on the server (no chat needed), with its own title and description.
- Clicking a property on the site should go to that URL.
- Build the sitemap automatically from the feed, and remove listings when they're sold or withdrawn.
- **Before building this:** confirm our Spark/MLS feed license allows public IDX display. Every listing page needs the listing brokerage's name and the MLS disclaimer.

## 2. Community pages
- Examples: `/communities/broken-sound`, `/communities/royal-palm-yacht-club`, `/communities/delray-beach-east`, `/communities/boca-west`
- Each one gets a unique write-up in Hobson's voice plus that community's live listings.
- Link the existing guides to the community pages, and the listings to their community page.

## 3. Mobile layout (keep desktop exactly as it is)
For phones under ~768px wide, switch to a vertical scroll feed:
- A slim header.
- A compact Hobson intro card (photo, welcome line, text box). Tapping it opens the chat full-screen.
- Full-width property cards, one per row.
- Tappable quick-search chips (e.g. Boca waterfront, Under $1M, 55+, Delray East) instead of dropdowns. Keep full filters behind a "Filters" button.
- Guide cards in the feed, then the Anasa and Next Endeavor strips.
- A sticky bottom bar with "Ask Hobson" and "Call Paul" buttons.
- The Guide drawer should be full-screen on small phones.
- Test at iPhone width (~390px), not only tablet or foldable.

## 4. Small fixes
- The bottom strip says "$15,000 credit. Every closing." Change it to "on qualifying closings" to match the Next Endeavor site.
- The footer still shows VantaSure Realty and the Delray office address. Update both when I change brokerages. The name and address must match everywhere: the site, Google Business, Zillow, Realtor.com and social media.

## 5. More guides (SEO)
Current guides: Living in Delray Beach, Boca Raton Luxury Homes, Palm Beach County Homes, Relocating to Palm Beach County, Waterfront vs Inland. Ideas for new ones:
- Broken Sound membership fees explained
- Best 55+ communities in Boca Raton
- Flood zones in Palm Beach County: what buyers should know
- Delray Beach vs Boca Raton: where to live
- Florida homestead exemption for new buyers
- Cost of living in Palm Beach County
- Moving to Palm Beach from New York
- A monthly market update (e.g. "Boca Raton market update, October")

## 6. Live avatar (later)
- When we add a live avatar, load it only after someone taps "Talk to Hobson," not on page load. Set a time limit per session, since avatar services bill by the minute.
- Plain text chat stays free for everyone.

## 7. Seller page (later)
- Add `/sell` for sellers: the Palm Beach Premiere look with the 1% offer, worded the upscale way ("Full-service representation, with listing fees from 1%").
- Private per-seller pre-listing pages under `/sell/<address>`. **Hide these from Google** with noindex.

## 8. Domain
- Point palmbeachrealestatepros.com at the Hobson Vercel project as a redirect to askhobson.homes.
- Leave the GoDaddy email records alone.
