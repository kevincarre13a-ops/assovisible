# AI automation, AI agents and no-code businesses for a low-tech French solo entrepreneur (state as of October 2026)

Scope note: research done on 22 October 2026. All prices are as published on vendor pages or reported by third parties in 2026 unless flagged. FX used for USD→EUR: 1 EUR = 1.1208 USD (ECB reference rate 15 Oct 2026, as quoted by [Katteb](https://katteb.com/blog/n8n-ai-agent/)). Many sources here are vendor blogs selling the very tool or course they describe. Treat their figures as marketing unless the note says a figure was checked.

---

## Cross-cutting: French demand for AI in TPE/PME and current tool-stack pricing (the base for every business below)

### Takeaway
French small businesses are adopting AI quickly: 40% of TPE/PME used it in 2026. But only 19% pay for it, and spending on "conseil et prestations" is just 2%. Demand exists, but the market for done-for-you services is still small and price-sensitive. Tool costs are low (roughly €20–€100/month for an automation stack). The value you sell is your service, not the software.

### Cited Findings
**Demand data (France)**
- Baromètre France Num 2026 (CRÉDOC for DGE, 9,655 firms surveyed 23 Mar–18 Apr 2026): 40% of TPE/PME use at least one AI solution (+14 pts in a year; 13% in 2024). The figure is 53% for PME (+19 pts) — [francenum.gouv.fr](https://www.francenum.gouv.fr/guides-et-conseils/strategie-numerique/comprendre-le-numerique/barometre-france-num-2026-le)
- Uses: 34% generate text/voice/images, 24% chatbots/assistants/search, 13% document analysis/classification, 11% task automation (+6 pts) — [Ministère de l'Économie press release, 28 Sep 2026](https://presse.economie.gouv.fr/barometre-france-num-2026-quatre-tpe-pme-sur-dix-utilisent-desormais-lintelligence-artificielle/)
- Only 19% of TPE/PME use paid AI solutions (32% of PME). How AI spending splits: subscriptions/licences 17%, training 5%, specific development 3%, consulting and services 2% — [francenum.gouv.fr](https://www.francenum.gouv.fr/guides-et-conseils/strategie-numerique/comprendre-le-numerique/barometre-france-num-2026-le)
- 68% of AI users say it has a positive impact. The figure is 84–85% among users of paid solutions — [DGE](https://www.entreprises.gouv.fr/espace-presse/barometre-france-num-2026-quatre-tpe-pme-sur-dix-utilisent-desormais-lintelligence)
- Electronic invoicing reform is the top digital priority of TPE/PME (39%), ahead of software purchases (26%) — [presse.economie.gouv.fr](https://presse.economie.gouv.fr/?p=184420)
- Plan national "Osez l'IA": after one year, 35,000+ firms reached through 615 "Ambassadeurs IA" in 20 regions and 13 sectors — [Ministère de l'Économie](https://presse.economie.gouv.fr/barometre-france-num-2026-quatre-tpe-pme-sur-dix-utilisent-desormais-lintelligence-artificielle/)
- Bpifrance Le Lab (older data, Jan 2025): 31% of TPE/PME used generative AI, only 8% regularly. 29% of TPE with 1–9 employees vs 53% of PME with 100+. Of those that invested in digitalisation over 3 years, only 9% targeted AI — [Bpifrance Le Lab](https://lelab.bpifrance.fr/31-des-tpe-et-pme-utilisent-l-ia-generative/)
- Bpifrance Le Lab PME-ETI study (June 2025, 1,209 leaders): 58% see AI as a survival issue in the medium term, but only 32% use it. 54% of users rely on free tools. 73% of AI projects are driven by the CEO — [Bpifrance Le Lab](https://lelab.bpifrance.fr/les-entreprises-francaises-et-l-ia-l-aube-d-une-revolution/)
- Bpifrance Le Lab notes TPE-PME activity is "morose" in 2026, with investment plans revised down because of political uncertainty — [Bpifrance Le Lab](https://lelab.bpifrance.fr/)

**Tool pricing (2026)**
- n8n Cloud (16 Oct 2026, euros): Starter €24/mo (€20 billed annually) for 2,500 executions. Pro €60/mo (€50 annually) for 10k executions, €144 (€120) for 50k. Business (self-hosted) €800/mo (€667 annually) for 40k. Community Edition is free to self-host — [Katteb](https://katteb.com/blog/n8n-ai-agent/); [n8n.io/pricing](https://n8n.io/pricing/)
- Trap: five workflows polling every 15 minutes (14,400 executions) push you past Pro, and the next tier is €667/mo. Self-hosting on Hetzner costs about €5.50/mo — [DEV Community](https://dev.to/jordan_blake_012e8/n8n-pricing-in-2026-cloud-vs-self-hosting-what-it-really-costs-2p0o)
- Make: free plan with 1,000 credits/mo. Core from $12/mo, Pro $21, Teams $38 (10k-credit tier) — [Make blog, Oct 2026](https://www.make.com/blog/best-ai-automation-tools)
- Zapier: free plan with 100 tasks/mo. Professional from $19.99/mo billed annually. Billed per task (each action step), so costs climb at volume — [Make blog](https://www.make.com/blog/best-ai-automation-tools); [Coworker AI](https://coworker.ai/blog/n8n-pricing)
- Lovable: Free (5 credits/day), Pro $25/mo (100 credits plus rollover, custom domains), Business $50/mo (SSO). Prices were confirmed unchanged in Aug 2026 — [AI Price Compare](https://aipricecompare.org/apps/lovable.html). The chat pricing model is "temporary, subject to change" through 31 Oct 2026 — [Lovable docs](https://docs.lovable.dev/introduction/credits-and-usage)
- Bolt.new: free and from $25/mo. Replit: $20/mo — [AI Price Compare](https://aipricecompare.org/apps/lovable.html)
- GoHighLevel: Starter $97/mo, Unlimited $297/mo, Agency Pro (SaaS Pro) $497/mo. Annual billing saves about 17% — [NetPartners](https://netpartners.marketing/gohighlevel-pricing-plans-explained-features-value-cost-comparison-2026). The AI Employee add-on costs $50/mo (Growth) or $97/mo (Unlimited) per sub-account — [HighLevel pricing](https://www.gohighlevel.com/pricing)
- Voice platforms are covered in the voice section below.

### Inferences
- A realistic solo stack (n8n Starter or Make Core, an LLM API, one voice platform, Lovable Pro) costs about €50–€150/mo before any client usage, so the barrier to entry is near zero. This also means competitors face no barrier.
- The France Num spending split shows that a "service" business selling only consulting fights over a small slice of SMB AI budgets. Formats that bundle a subscription with a service (a managed voice agent or chatbot) or training (OPCO-funded) line up with where SMB money actually goes.
- The macro context (weak investment in 2026, e-invoicing as the top priority) suggests offers tied to e-invoicing compliance or cost savings will sell more easily than "growth" pitches.

### Gaps
- Voiceflow's 2026 pricing was not retrieved, so I cannot confirm it.
- I found no reliable French data on how many "agences IA" or "automatisation" freelancers exist.

---

## Q1. The AI Automation Agency (AAA) model: still working in 2026 or saturated? What actually sells?

### Takeaway
The model works, but the generalist version is saturated. Practitioners agree that it is "saturated for lookalikes, not for focused operators." Clients buy concrete outcomes in one niche: lead follow-up, missed-call recovery, booking, quote follow-up, invoice/document extraction and reporting. They do not buy "AI automation." Course-market income claims are largely unverified, and realistic year-one income for a solo starter is modest.

### Cited Findings
**Is it saturated?**
- "Saturated for lookalikes, not for focused operators" is described as Reddit's 2026 consensus. Saturation bites with generic "AI automation for small businesses" positioning, course-taught LinkedIn scripts, and competing on price — [LeadLock (vendor blog), Oct 2026](https://www.leadlock.ai/blog/is-starting-an-ai-agency-worth-it-2026/)
- r/AI_Agents practitioner: "99% of AI agencies right now are selling the same 3 things like voice receptionist, email agent, custom dashboard… business owners are literally comparing 5 different vendors who all sound identical because everyone's stitched together the same Retell + ElevenLabs + GHL stack… race to zero." He suggests selling the service or outcome (e.g. "I'll run your entire inbound for $4k/mo") and delivering it with AI — [Reddit r/AI_Agents](https://www.reddit.com/r/AI_Agents/comments/1tj2qcl/selling_ai_tools_is_a_dead_game_selling_outcomes)
- Reddit's anger is aimed at gurus selling high-ticket programmes that promise passive five-figure months. The automations themselves (missed-call recovery, booking agents, support deflection) "genuinely help businesses." A red flag is programmes that earn more from enrolling would-be agency owners than graduates earn from clients — [Ciela AI (vendor blog), July 2026](https://ciela.ai/blogs/ai-automation-agency-scam-reddit)
- Specialised AI automation shops are said to run 25–35% net margins vs 11–18% for generalist digital agencies (attributed to "Automaton Agency's 2026 economics breakdown", secondary source, unverified) — [LeadLock](https://www.leadlock.ai/blog/is-starting-an-ai-agency-worth-it-2026/)

**What sells (use cases)**
- An n8n agency lists the typical buyer needs as "Lead follow-up, reporting, invoicing, support replies" — [BULDRR AI, Sep 2026](https://buldrr.com/n8n-automation-agency-pricing)
- A French freelance (Malt) describes concrete deliverables: a form submission creates the customer record and notifies the right person; an unanswered quote is followed up automatically with amounts pulled from the database; budget/delay alerts; PDF/image invoice extraction and filing. His built example is a management system for a renovation company (Airtable + Make) — [Malt, Nicolas Gamard](https://www.malt.com/profile/nicolasgamard)
- Vendasta reports that local businesses buy three agent types: speed-to-lead, AI receptionist, and a third (review/reputation type). AI-related services rose from 10% to 17% of agency revenue — [Vendasta (vendor blog), Sep 2026](https://www.vendasta.com/blog/sell-ai-agents/)

**Pricing benchmarks**
- n8n agency (US/India, published pricing): single workflow $400–$1,200 one-time; multi-workflow system with one AI step $1,500–$4,500; retainer $1,200–$8,000/mo — [BULDRR AI](https://buldrr.com/n8n-automation-agency-pricing)
- n8n/AI integration specialists bill $40–100/h on Upwork in 2026, and senior AI-agent work $125–250+/h (attributed to Layer3 Labs) — [LeadLock](https://www.leadlock.ai/blog/is-starting-an-ai-agency-worth-it-2026/)
- French Malt day rates (TJM) for n8n/Make/AI-agent freelancers in Oct 2026 range widely: €125/day (0–2 yrs), €280/day (several juniors), €290–€500 (mid), €600–€800 (senior / ex-CTO "Claude Code" experts). In Belgium €300–€800 — [Malt n8n listing](https://en.malt.fr/s/tags/n8n-68b1ce80892ea37fa07d5f7b?p=7); [Malt Thomas N.](https://www.malt.com/profile/sarahnovae); [Malt No-code BE](https://fr.malt.be/s/tags/no-code-60239330e7a56507faa5d017)
- Example French packaged offers (Malt, Nantes): mini AI audit €250 (5 days); AI agent/chatbot €500 (7–10 days, 30 days support); "Pro AI automation pack" (chatbot + Make workflow + 1h training) €800 — [Malt, Emmanuel Barencourt](https://www.malt.com/profile/emmanuelbarencourt)
- An unsourced blog claims "local AI automation agencies" charge $2,000 setup plus $500/mo retainers with "low competition." It includes a case study ("Priya… bills $8,000/month with 6 clients") that is not verifiable and looks illustrative — [Bright Coding blog, July 2026](https://www.blog.brightcoding.dev/2026/07/09/side-hustles-dying-in-2026-and-whats-replacing-them-the-new-rules-of-making-money-online)

**Income claims and realistic revenue**
- "$25,000 MRR in 4 months with n8n" (r/n8n post, 10 clients × $2,500/mo, said to be enterprise clients). BrowserAct calls it "verified," but the analysis comes from a third-party marketing blog, and I found no independent verification — [BrowserAct, Jan 2026](https://www.browseract.com/blog/best-high-income-case-analysis-how-to-achieve-25000-monthly-revenue-with-n8n)
- Realistic year one for a solo operator with no existing client base: 3–6 paying clients at $300–800/mo, $10k–48k annual gross, and 12–18 months to reach full-time income (attributed to Layer3 Labs' 2026 guide) — [LeadLock](https://www.leadlock.ai/blog/is-starting-an-ai-agency-worth-it-2026/)
- A one-time build fee leaves no recurring revenue. The retainer is what creates a business worth owning — [LeadLock](https://www.leadlock.ai/blog/is-starting-an-ai-agency-worth-it-2026/)
- French n8n agency guide: about twenty serious French agencies, plus a long tail of freelancers on Malt/Upwork — [Just Use AI, June 2026](https://www.just-use-ai.com/blog/agence-n8n-france-tarif)
- Malt shows "more than 300 n8n freelancers available" — [Malt](https://en.malt.fr/s/tags/n8n-68b1ce80892ea37fa07d5f7b?p=7)

### Inferences
- **Business sheet: "Agence d'automatisation IA verticale"**
  - *What:* build 1–5 workflows (lead capture → CRM → instant notification; quote follow-up; invoice/document extraction; client onboarding sequences; weekly reporting), then maintain them.
  - *Clients:* one niche the entrepreneur already knows. For this entrepreneur, natural adjacent niches are associations (adhésions, relances cotisations, reçus fiscaux), plus artisans/BTP, immobilier and cabinets.
  - *Price (France, inferred from Malt and agency data):* setup €500–€3,000 per system and maintenance €100–€500/mo. Bigger retainers (€1,000+) need proof and PME-size clients.
  - *Tools:* Make (easiest for non-devs) or n8n Cloud, Airtable/Google Sheets, an LLM API.
  - *Prospecting:* existing website clients (upsell), LinkedIn content and demos, local networks (CCI, BNI, Ambassadeurs "Osez l'IA").
  - *Skills:* process mapping, Make/n8n at an intermediate level, debugging. "No technical skill" is not realistic: you need at least the level of the Make/Airtable certifications that Malt freelancers cite.
  - *Saturation:* high for generic offers. Moderate in niche verticals and in the association sector.
  - *Risks:* maintenance burden (APIs change), liability when an automation fails, scope creep, and price competition from €125–€300/day juniors on Malt.
- The low end of French TJM (€125–€300/day) shows that pure "build" labour is commoditising fast. Margin has to come from niche expertise and recurring management.

### Gaps
- No independent dataset on AAA churn, close rates or failure rates. All numbers come from vendors or course sellers.
- No verified French solo-operator revenue case found.

---

## Q2. AI voice agents / AI receptionists for local businesses (restaurants, garages, cabinets médicaux, dentistes, agences immobilières, plombiers)

### Takeaway
Technically this is mature and cheap: platform cost is about €0.06–€0.30/min. But in France it is now a crowded, productised market. Turnkey French SaaS products sell AI receptionists from €39–€89 HT/month, and Doctolib sells its own at €99 TTC/month to doctors. An agency charging €300–€900/month must therefore add real integration, niche tuning and reporting, or target niches the SaaS players don't serve. Legally, AI Act Art. 50 disclosure has applied since 2 Aug 2026, GDPR applies to recordings, health data needs HDS hosting, and **cold outbound calls to consumers have been illegal without prior opt-in since 11 Aug 2026**.

### Cited Findings
**Platform costs (2026)**
- Retell AI: $0.07–$0.31/min pay-as-you-go, no platform fee, $10 free credits, 20 concurrent calls included. Example breakdown: $0.11/min (LLM $0.04 + voice infra $0.055 + TTS $0.015). ElevenLabs voices on Retell cost an extra $0.04–$0.10/min — [Retell AI pricing](https://www.retellai.com/pricing)
- Retell's own comparison (Sept 2026, vendor-biased): realistic totals at 1,000 min/mo are Retell $60–150, Vapi $185–325 ($50 platform fee plus components), Bland $90–340. Vapi replaced its Build/Scale tiers with "Success Packages" in 2026. Vapi's HIPAA add-on costs $2,000/mo — [Retell blog](https://www.retellai.com/blog/vapi-vs-bland)
- A third party puts Vapi at "$0.05 a minute plus model costs" — [HappyRobot](https://www.happyrobot.ai/hub/vapi-ai-pricing)
- ElevenLabs Agents: $0.08/min on Starter after a 20% price cut announced May 2026 (updated Oct 2026). A pay-as-you-go model was introduced — [ElevenLabs blog](https://elevenlabs.io/blog/weve-lowered-api-agents-pricing-and-introduced-pay-as-you-go). Plans run from Free (15 min) to Business (12,375 min). Extra minutes cost $0.08 and burst minutes $0.16. LLM and telephony are billed on top — [Cartesia, Oct 2026](https://www.cartesia.ai/learn/elevenlabs-pricing)
- Synthflow: reported $30,000 annual minimum — [11x](https://www.11x.ai/guides/synthflow-pricing). Agency sub-accounts are on Enterprise contracts from $30,000/yr, and in-product Stripe reseller billing was removed on 15 Sep 2026 — [Vendasta](https://www.vendasta.com/blog/white-label-ai-agents/). Synthflow is therefore effectively no longer a solo-entrepreneur tool.
- White-label voice platforms for agencies: Trillet $299/mo including 3,000 AI minutes ($0.12/min after); Stammer AI $197/mo plus $0.11–0.17/min (June 2026) — [Trillet blog](https://trillet.ai/blogs/building-sustainable-ai-voice-agency-2026)

**French turnkey competitors (key point for pricing)**
- Sayelo (French): AI voice agent for TPE/PME and professions libérales from **€39 HT/mo**, 14-day trial, no setup fee, HDS-certified hosting in France for medical practices — [sayelo.ai](https://sayelo.ai/)
- Sylen (Nancy, France): from **€49 HT/mo** (100 min), Pro €129 (350 min), Scale €329 (1,000 min). Overage €0.44–€0.35/min. Over 120 professions preconfigured in French, works by call forwarding on your existing number, 30-day money-back. Restaurants: integrates with Zenchef, Guestonline, CoverManager and Mozrest (prices read 2 Oct 2026) — [sylen.ai restaurant](https://sylen.ai/solutions/restaurant); [sylen vs Allo](https://sylen.ai/comparatifs/sylen-vs-allo)
- Allo (withallo, Vincennes): business phone system with "Réceptionniste IA" as an option at €35 HT/mo annual (€45 monthly), on top of a paid seat. Minimum about €70 HT/mo — [Sylen comparison](https://sylen.ai/comparatifs/sylen-vs-allo)
- AirAgent (French): turnkey from €89 HT/mo plus minutes. Offers **white-label resale "à vos prix et vos marges"** and claims over 150 partners — [airagent.fr](https://airagent.fr/alternative-a-qualtrics/)
- Doctolib Assistant téléphonique: €99 TTC/mo for doctors and €49 TTC for osteopaths/podiatrists (beta pricing, Oct 2025) — [En-Contact](https://en-contact.com/in-france-doctolib-launches-its-ai-telephone-assistant-priced-at-euro99-per-month-including-vat). It is available to solo GPs and being rolled out to group practices. It now cancels and moves appointments (spring 2026) — [Doctolib Communauté](https://community.doctolib.fr/t/medecins-decouvrez-les-innovations-du-printemps-2026/168806). Summer 2026 added urgent-slot booking and more natural voices — [Doctolib Communauté](https://community.doctolib.fr/t/assistant-telephonique-decouvrez-les-nouvelles-fonctionnalites-et-ameliorations-de-lete-2026/199097). Nvidia took a stake in Doctolib in Oct 2026 to develop AI, including the virtual phone assistant — [Capital](https://www.capital.fr/entreprises-marches/nvidia-la-plus-grosse-entreprise-du-monde-entre-au-capital-de-doctolib-pour-y-developper-son-ia-pour-les-patients-1530963)
- Dentists: DentalCall IA / Webdentiste at €149 TTC/mo, with "several hundred" practices subscribed. Vocca.ai and Yampa.ai have raised funding. "More than forty companies" claim to offer conversational AI in France — [En-Contact](https://en-contact.com/doctolib-lance-son-assistant-telephonique-ia-au-tarif-de-99-euros-par-mois-cest-cher-docteur)
- Medical télésecrétariat comparisons list AirAgent, Doctolib and ClicFone (human + AI "Aglaé", from €99 TTC/mo) among 15 solutions — [telesecretariat-medical.com](https://telesecretariat-medical.com/)
- Ainora (Lithuanian, French-language page) sells an AI phone line for restaurants: reservations, allergens, waitlist, takeaway orders — [ainora.lt](https://ainora.lt/fr/standard-telephonique-restaurants)

**Agency pricing and economics (mostly US data)**
- Agency voice retainers: $300–1,500/mo plus a setup of $500–2,500 — [LeadLock](https://www.leadlock.ai/blog/is-starting-an-ai-agency-worth-it-2026/). Common benchmark: $300/mo plus setup plus per-minute markup — [Trillet](https://trillet.ai/blogs/building-sustainable-ai-voice-agency-2026)
- A fact-checked YouTube "voice agent agency" model: setup $1,500–3,500, retainer $400–950/mo, platform usage about $135/mo per client. The income ladder ($171k/yr at 15 clients) assumes the top tier and zero churn and gives no figures from the founder's own agency. Rated 6/10 for evidence — [IncomeIdeaLab, Oct 2026](https://incomeidealab.com/research/ai-voice-agent-agency-pricing-sums-check-out-171k-assumes-top-tier-and-no-churn)
- Vendasta: a voice agent at 1,000 min/mo costs about $142 in variable cost against a $650 retainer. 12 clients would give about $7,800 MRR and about $4,900 gross profit. Marketing agencies average about 1.6% monthly churn — [Vendasta](https://www.vendasta.com/blog/sell-ai-agents/)
- **Churn warning:** Trillet says agencies that "set and forget" routinely lose 10–20% of clients per month, against 3–5% considered healthy for SMB SaaS. The cure is monthly reports (calls handled, missed calls recovered, appointments, estimated revenue) — [Trillet](https://trillet.ai/blogs/building-sustainable-ai-voice-agency-2026)
- r/AI_Agents observer: agencies stopped building on raw Vapi after about 6 months ("telephony, latency, compliance, integrations… not weekend projects") and now white-label platforms. MSPs, VoIP resellers and BPOs move fastest because they already own the phone line — [Reddit r/AI_Agents](https://www.reddit.com/r/AI_Agents/comments/1tdjrek/the_new_agency_upsell_isnt_an_seo_retainer/)
- Niche selection guide: the ROI formula shows trades (HVAC, plumbers) easily justify $300–400/mo. Bookkeepers, salons and restaurants are weak fits: low ticket, online booking dominance, or specialised competitors — [AI Learning Guides preview](https://ailearningguides.com/wp-content/uploads/2026/10/sell-ai-receptionists-to-local-businesses-preview.pdf)
- 22% of SMBs use a voice agent and 31% plan to invest within 12–24 months (Vendasta survey, US-centric) — [Vendasta](https://www.vendasta.com/blog/sell-ai-agents/)

**Legal (EU / France)**
- AI Act Art. 50(1): systems that interact directly with people (chatbots, virtual assistants, automated phone systems) must inform users that they are talking to an AI, before or at the very start of the interaction. Applies from **2 August 2026**. Draft guidelines confirm AI agents are covered — [artificialintelligenceact.eu](https://artificialintelligenceact.eu/transparency-rules-article-50/); [European Commission FAQ](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)
- The Digital Omnibus (Regulation (EU) 2026/1744, in force 27 July 2026) delayed **high-risk** obligations (Annex III to 2 Dec 2027), **not** Art. 50. The only grace period is for Art. 50(2) machine-readable marking on generative systems already on the market (until 2 Dec 2026). The AI literacy duty (Art. 4) was softened to a "duty of effort" — [euaiact.com](https://www.euaiact.com/digital-omnibus-ai); [euai-act.com](https://www.euai-act.com/articles/eu-ai-act-digital-omnibus-2026)
- Penalties for Art. 50 breaches: up to €15M or 3% of global turnover — [Luxgap](https://luxgap.com/articles/ai-act-article-50-transparence-chatbots-deepfakes-2026/?lang=en)
- The obligation falls mainly on the **provider** (whoever designs the system). Deployers have specific duties for emotion recognition, deepfakes and public-interest text — [EC guidelines page](https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-transparency-obligations)
- **Outbound calls:** since **11 August 2026** (Loi n°2025-594, Décret n°2026-662), telephone prospecting of consumers is banned without prior, specific, documented opt-in consent, valid for at most 1 year. Bloctel was abolished. Allowed hours are Mon–Fri 10h–13h and 14h–20h. Contracts concluded after illegal calls are void — [CNIL](https://www.cnil.fr/fr/cnil-direct/question/2724); [DGCCRF](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/les-regles-du-demarchage-telephonique-simposant-aux-entreprises); [Légifrance](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441/2026-10-20)
- Medical data: French players stress HDS-certified hosting in France (Sayelo) — [sayelo.ai](https://sayelo.ai/). Sylen publishes an "IA vocale et RGPD" checklist and a lawyer-secrecy guide — [sylen.ai/ressources](https://sylen.ai/ressources)

**French-language quality**
- French vendors advertise "voix expressives", ambient sounds and persistent caller memory (Sayelo), and over 120 trades preconfigured in French (Sylen). Doctolib reports its latest voice "led to a significant decrease in unfinished calls" and booking 20 s faster on average — [sayelo.ai](https://sayelo.ai/); [Doctolib Communauté](https://community.doctolib.fr/t/assistant-telephonique-decouvrez-les-nouvelles-fonctionnalites-et-ameliorations-de-lete-2026/199097)
- A telesecretariat CEO said in late 2025 that Doctolib's assistant "doesn't work very well yet" and only handles known patients — [En-Contact](https://en-contact.com/in-france-doctolib-launches-its-ai-telephone-assistant-priced-at-euro99-per-month-including-vat)
- ElevenLabs v4 models support 90+ languages — [Cartesia](https://www.cartesia.ai/learn/elevenlabs-pricing)

### Inferences
- **Business sheet: "Standard téléphonique IA géré pour [niche]"**
  - *What:* configure, integrate (agenda, CRM, SMS confirmation), test, monitor and report on an inbound AI receptionist.
  - *Clients:* artisans/dépannage (plombiers, serruriers, chauffagistes), garages, agences immobilières, cabinets d'avocats/comptables, multi-site businesses. **Avoid cabinets médicaux/dentistes**, where Doctolib (€99 TTC) and specialised players (€149 TTC) dominate distribution. Restaurants are also hard: specialised SaaS integrated with Zenchef etc. sells at €49 HT.
  - *Price (France):* to stay credible against €39–€129 HT SaaS, plan roughly setup €300–€1,500 and €150–€400 HT/mo all-in, including minutes and monthly reporting. US-style $500–$950 retainers will be hard to defend when a plombier can sign up to Sylen alone for €49.
  - *Tools:* reselling a French white-label platform (e.g. AirAgent's partner programme) is the low-tech route. Retell or ElevenLabs Agents plus Make/n8n is the custom route, which needs telephony and prompt-engineering skill.
  - *Prospecting:* inbound only, through the website, SEO pages per métier/ville (the French SaaS players already do this heavily), demos with a live number, and partnerships with accountants and telecom resellers. **Do not cold-call consumers.** B2B prospecting by phone falls outside the consumer opt-in law, but GDPR still applies (not verified in detail).
  - *Realistic revenue:* 5–15 clients × €150–€400 = €750–€6,000/mo after 12+ months, if churn is controlled.
  - *Saturation:* high in France (40+ vendors, Doctolib, cheap SaaS).
  - *Risks:* churn (10–20%/mo when unmanaged), hallucinations on prices/availability, AI Act disclosure, GDPR recording consent, HDS for health, dependence on US platforms, and price compression from SaaS.
- The cleanest positioning for this entrepreneur may be **reseller/integrator of a French white-label voice SaaS**, bundled with the website. It avoids building telephony infrastructure, and website clients already trust them.

### Gaps
- I found no independent benchmark of French-language voice-agent quality (latency, comprehension of accents, number/date errors) across Retell, Vapi and ElevenLabs.
- AirAgent's white-label partner pricing and margins are not public in the pages retrieved.
- CNIL-specific guidance on AI recording of inbound calls was not retrieved directly. Only vendor checklists were found.
- No French data on agency churn for AI receptionists.

---

## Q3. AI chatbots for websites / WhatsApp, "speed-to-lead" systems and missed-call text-back

### Takeaway
Chatbots are the most adopted SMB AI use in France (24% of TPE/PME use chatbots or assistants) and also the most commoditised. A website builder can bolt one on cheaply. Speed-to-lead (instant reply to form or ad leads) is the strongest pitch where clients already buy ads. WhatsApp automation costs a lot in France at Meta's rates, and service replies are no longer free beyond 1,000/month since 1 Oct 2026. US-style SMS "missed-call text-back" has no clear French market data.

### Cited Findings
- 24% of TPE/PME use AI for chatbots, assistants or information search (+10 pts) — [France Num 2026](https://presse.economie.gouv.fr/barometre-france-num-2026-quatre-tpe-pme-sur-dix-utilisent-desormais-lintelligence-artificielle/)
- French freelance chatbot price point: "AI Agent / Chatbot" package €500 (creation plus deployment on the site, connected to a database, 30 days support) — [Malt](https://www.malt.com/profile/emmanuelbarencourt)
- Retell chat agents start at $0.002/message — [retellai.com](https://www.retellai.com/)
- n8n includes "hosted and embedded chat" and agent nodes in its plans — [n8n pricing](https://n8n.io/pricing/)
- Speed-to-lead agent: contacts a prospect the moment they fill out a form. It is a "natural upsell" for agencies that already run a client's ads. An agency sold about $180,000 of AI agents in six weeks using lead magnets promoted only through organic LinkedIn (vendor-reported, unverified) — [Vendasta](https://www.vendasta.com/blog/sell-ai-agents/)
- White-label chatbot and voice platforms claim agencies charge $500–2,000/mo and that deployment takes under an hour. They also claim "82% of SMB clients expect their agency to offer AI tools" (vendor statistic, no source) — [Convocore](https://convocore.ai/ai-for/agencies)
- **WhatsApp Business API, France (Meta rate card effective 1 Oct 2026):** marketing €0.0712 (~$0.0859) per delivered message, utility €0.0248 (~$0.03). Since 1 Oct 2026, replies in the 24h customer-service window are billed at the utility rate after 1,000 free service messages per number per month. Per-message billing replaced conversation billing on 1 July 2025 — [Flowcall](https://www.flowcall.co/blog/whatsapp-business-api-pricing); [Kanal](https://getkanal.com/blog/whatsapp-business-pricing-guide)
- France's marketing rate is among the highest in Europe. Germany is €0.1131 — [Flowcall](https://www.flowcall.co/blog/whatsapp-business-api-pricing)
- BSP platform fees in France: about €29–€500/mo (Go4whatsup €29, Wati ~€85, Bird ~€70, Sinch ~€130). Twilio adds $0.005/message — [Go4whatsup (vendor)](https://www.go4whatsup.com/france/whatsapp-business-api-pricing); [Flowcall](https://www.flowcall.co/blog/whatsapp-business-api-pricing). Note: Go4whatsup quotes lower Meta rates labelled as "India rates", so it is unreliable for France.
- France has 38M+ WhatsApp users. Marketing messages need explicit GDPR opt-in consent — [ChatDaddy](https://www.chatdaddy.tech/blog/whatsapp-business-api-france)
- GoHighLevel's AI Employee add-on (chat, voice and conversation AI) costs $50–97/mo per sub-account — [HighLevel](https://www.gohighlevel.com/pricing)

### Inferences
- **Business sheet: "Chatbot IA + relance instantanée des leads"**
  - *What:* a site chatbot trained on the client's FAQ, tariffs and booking link; instant email/SMS/WhatsApp reply to form leads; booking.
  - *Clients:* businesses with lead forms or ad spend: immobilier, rénovation/BTP, formation, cliniques esthétiques, associations (adhésions/dons FAQ).
  - *Price:* setup €300–€1,000 and €50–€200/mo maintenance. It is a natural add-on to existing site-maintenance contracts.
  - *Tools:* Voiceflow / n8n chat / GHL / Make plus an LLM API. For WhatsApp, an official BSP.
  - *Saturation:* very high as a stand-alone product. Its value is as an upsell to existing web clients.
  - *Risks:* hallucination of prices or policies, AI Act Art. 50 disclosure ("Vous échangez avec un assistant IA"), GDPR consent for WhatsApp marketing, and rising WhatsApp costs in France.
- "Missed-call text-back" (a US GHL staple) translates less well in France. SMS costs, opt-in rules and the cheap French voice SaaS (which answer the call directly) make a voice agent or a simple voicemail-to-SMS option more relevant. This is an inference with no French data found.

### Gaps
- Voiceflow, Botpress and Chatbase 2026 pricing were not retrieved.
- No French source on SMS missed-call text-back adoption or pricing.
- No data on French SMB chatbot churn or conversion uplift.

---

## Q4. White-label SaaS reselling (GoHighLevel "SaaS mode", white-label AI tools): recurring revenue model

### Takeaway
SaaS mode works like this. GoHighLevel Agency Pro costs $497/mo, about €443. The agency rebrands the CRM, funnels, SMS/email and AI Employee and resells sub-accounts at its own price. The recurring revenue is real, but churn is the main risk, especially on plans under ~$100. For France, French white-label voice platforms (e.g. AirAgent's 150+ partners) and the English-first GHL ecosystem are the two options. GDPR is handled through GHL's DPA, but I could not confirm EU data hosting.

### Cited Findings
- GHL plans 2026: Starter $97, Unlimited $297, Agency Pro (SaaS Pro) $497/mo. All include unlimited contacts and users — [NetPartners](https://netpartners.marketing/gohighlevel-pricing-plans-explained-features-value-cost-comparison-2026)
- Add-ons per sub-account: AI Employee Growth $50/mo, AI Employee Unlimited $97/mo, Branded Client Portal App $49/mo — [HighLevel pricing](https://www.gohighlevel.com/pricing)
- SaaS-mode churn: a GHL consultancy says "sub-A$100 plans bleed hardest" and maps a "90-day danger window." It models 40 sub-accounts at A$297/mo — [HL Growth Partner](https://hlgrowthpartner.com/post/gohighlevel-saas-mode-churn-reduce-cancellations-2026)
- HighLevel provides a Data Processing Agreement (2023 version) that is incorporated into its ToS. It encrypts data in transit with TLS 1.2+ — [HighLevel DPA PDF](https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/6435747d41ff79e6e2117755.pdf). UK consultancies sell GDPR "snapshots" with granular consent for email/SMS/WhatsApp. When an agency white-labels GHL, "a different set of rules apply" (the agency becomes the processor to its clients) — [Boost My Business](https://ghl.boostmybusiness.co.uk/gohighlevel-data-processing-agreement)
- White-label AI voice economics (r/AI_Agents): a platform costs an agency about $1k/mo plus about $0.10/min, and agencies bill $500–2,500/mo per deployment. The per-client platform cost falls from $77 at 13 clients to $20 at 50 — [Reddit r/AI_Agents](https://www.reddit.com/r/AI_Agents/comments/1tdjrek/the_new_agency_upsell_isnt_an_seo_retainer/)
- Vendasta white-label: price overrides per client, payments at 2.9% + $0.30. It reports partner results such as "Gig Strategic… $51,800 MRR and retained 100% of clients" (vendor case study, unverified) — [Vendasta](https://www.vendasta.com/blog/white-label-ai-agents/)
- French white-label voice: AirAgent offers resale under your own brand (logo, domain, emails, your prices and margins) and claims 150+ partners — [airagent.fr](https://airagent.fr/alternative-a-qualtrics/)
- Synthflow removed in-product Stripe reseller billing on 15 Sep 2026, and agency sub-accounts need Enterprise contracts from $30k/yr — [Vendasta](https://www.vendasta.com/blog/white-label-ai-agents/)
- An LLM-agnostic GHL voice add-on (LeadLock Pro $497 plan, $0.12/min) shows that GHL-embedded voice agents are being sold as "harder to replicate", with lower churn "when the service is literally answering the phone" (vendor claim) — [LeadLock](https://www.leadlock.ai/blog/is-starting-an-ai-agency-worth-it-2026/)
- Marketing agencies run about 1.6% monthly churn (Focus Digital via Vendasta). Traditional web/SEO/PPC agencies face 30–40% annual churn (vendor claim) — [Vendasta](https://www.vendasta.com/blog/sell-ai-agents/); [Convocore](https://convocore.ai/ai-for/agencies)

### Inferences
- **Business sheet: "CRM tout-en-un en marque blanche (SaaS mode)"**
  - *What:* resell a rebranded CRM + site/funnel + email/SMS + AI chat/voice suite as a monthly subscription, with onboarding templates ("snapshots") per niche.
  - *Clients:* niche TPE such as coaches, instituts de beauté, artisans, immobilier. For this entrepreneur, associations are a possible niche (membership CRM + site + relances), but associations' ability to pay is low.
  - *Price (France):* resale €97–€297/mo per client is typical by analogy with US pricing (inference). Break-even on the $497 plan needs about 3–5 clients.
  - *Tools:* GoHighLevel Agency Pro, or a French white-label voice SaaS for voice only.
  - *Prospecting:* bundle with website projects, run webinars, give niche demos.
  - *Skills:* platform configuration, onboarding, support. This is the most "no-code" of the models, but support load is high.
  - *Saturation:* very high among English-speaking agencies. Lower in France, where GHL is less known (inference, no data found).
  - *Risks:* high fixed platform cost before clients arrive; churn in the first 90 days; heavy support; dependency on a US platform and GDPR/transfer questions; French SMS/telephony deliverability inside GHL (LC Phone is US-centric, not verified); French-language UI quality (not verified).
- Bundling the white-label SaaS with the existing web-design agency makes the website the "anchor" and the SaaS the recurring layer. This is the most coherent recurring-revenue fit for this profile.

### Gaps
- No verified data on GHL usage, EU data residency, or French-language support in France.
- No French SaaS-mode case study with real numbers found.
- GHL SaaS-mode churn benchmark figures (GoCSM page) were not retrieved in detail.

---

## Q5. Micro-SaaS / AI apps built with vibe-coding tools (Lovable, Bolt, Replit, Claude Code) by non-developers

### Takeaway
Vibe-coding tools are mainstream. Lovable has a $500M ARR run-rate and 1M new projects a week, and most of its users are non-technical. Building an MVP takes days, but a sustainable micro-SaaS is still rare and hard to verify. Success stories circulate mostly through the tool vendors' own marketing. Security failures in vibe-coded apps are well documented, and maintenance is the hidden cost. For a low-tech founder, the realistic plays are a niche internal tool sold to a vertical they know, or building client apps as a service rather than a SaaS bet.

### Cited Findings
- Lovable passed a $500M annualised revenue run rate (June 2026), with over 50M projects built and 1M new projects a week. Its users are "primarily non-technical" and build sites, storefronts and internal tools (CRMs, inventory, HR) — [TechCrunch](https://techcrunch.com/2026/06/09/lovable-says-it-has-hit-500m-in-annualized-revenue-with-1-million-new-projects-a-week/)
- TechCrunch warns that the hard part is maintenance, not building. Abandonment rates of vibe-coded projects have not been disclosed — [TechCrunch](https://techcrunch.com/2026/06/09/lovable-says-it-has-hit-500m-in-annualized-revenue-with-1-million-new-projects-a-week/)
- Lovable raised a $400M Series C (Aug 2026) at a $6.6B valuation — [Tracxn](https://platform.tracxn.com/a/d/company/5c8d06ec9adc104cb9b530c9/lovable?utm_source=parallel&utm_medium=ai#a:about)
- Claimed success stories, all from secondary sources and **not independently verified**: Plinq (Lovable) "$456K ARR in months"; QuickTables (Lovable) "$100K/year"; SendPush.io "$135K revenue in week 1"; a property-management app built on Lovable that got into YC with $500K funding — [Medium (Himanshu Kukreja), Mar 2026](https://medium.com/@kkansh/7-profitable-niche-saas-ideas-2026-vibe-code-launch-without-devs-b3ae53bd4b33)
- Lovable's own guide cites non-technical founder Christy Laurence (Plann, $1M revenue in two years) and Subscribr's $20K in pre-sold lifetime deals. Both come from Indie Hackers, and both predate the vibe-coding era or are not Lovable-specific — [Lovable guide](https://lovable.dev/guides/micro-saas-ideas-for-solopreneurs-2026)
- Lovable recommends vertical niches (e.g. niche CRMs, vertical booking tools, a $99–299/mo pricing tier) — [Lovable guide](https://lovable.dev/guides/no-code-micro-saas-ideas)
- **Security:** a Lovable-hosted app leaked data of 18,000+ users (teachers/students), with 16 vulnerabilities including inverted access-control logic generated by AI. Lovable says users are responsible for applying its pre-publish security-scan recommendations — [The Register, Feb 2026](https://www.theregister.com/software/2026/02/27/ai-built-app-on-lovable-exposed-18k-users-researcher-claims/5038511)
- CVE-2025-48757 exposed 170+ live Lovable apps (names, addresses, financial records, Stripe keys). A 2025 scan of 5,600+ vibe-coded apps found thousands of vulnerabilities. Replit's AI agent deleted a production database during a code freeze in July 2025 — [Indie Hackers, Aug 2026](https://www.indiehackers.com/post/why-vibe-coded-apps-are-still-leaking-user-data-in-2026-4a6ab2fbdd)
- Third-party view: Lovable's "credit-based pricing burns fast on complex apps; generated code often needs a real developer's cleanup before production" — [AI Price Compare](https://aipricecompare.org/apps/lovable.html)

### Inferences
- **Business sheet: "Micro-SaaS vertical vibe-codé"**
  - *What:* one small tool for one niche the founder knows deeply. Example for this profile: a membership/cotisation tracker for small associations, a reçu fiscal generator, or a booking tool for a specific profession.
  - *Price:* €9–€49/mo per user. Associations have a low willingness to pay.
  - *Tools:* Lovable/Bolt + Supabase + Stripe; Claude Code for iteration.
  - *Realistic revenue:* most micro-SaaS earn little. €500–€2,000 MRR after 12–24 months would be a good outcome (inference; no verified French data).
  - *Skills:* product sense, distribution and support matter more than code. Basic security literacy (RLS, secrets) is mandatory when handling personal data under GDPR.
  - *Saturation:* very high for generic ideas. Niche B2B verticals remain open.
  - *Risks:* data breach liability (GDPR), maintenance, platform credit costs, and copycats who can clone it in a weekend.
- A lower-risk variant is to **sell vibe-coded internal tools/MVPs as a service** (fixed-price builds for SMBs and associations), which leverages the existing agency. It shares the security risk, so a security review step is needed.

### Gaps
- No independently verified revenue figures for vibe-coded micro-SaaS by non-developers (all figures come from vendors or content marketing).
- No French examples found.
- Abandonment rates for vibe-coded projects are not public.

---

## Q6. Custom GPTs/AI assistants, "formation IA" for SMEs (OPCO via Qualiopi), and AI consulting/audit for SMEs

### Takeaway
"Formation IA" is the most France-specific and the best-funded opportunity. Companies can have AI training reimbursed by their OPCO if the trainer is Qualiopi-certified, or operates under a Qualiopi "portage" partner. Market prices are about €490 (short sessions) up to €1,980–€2,500 HT per intra day. Three caveats: FNE-Formation is suspended, the CPF requires RS/RNCP certification, and since 1 Oct 2026 the company generally pays and the OPCO reimburses the HT part. Subsidised AI audits exist (Bpifrance Diag Data IA: €10k, 40% subsidised), but only for firms with €1M+ turnover and 10+ staff, and they are run by Bpifrance-approved experts.

### Cited Findings
**Training market and prices**
- Masteria: €1,980 HT per day for intra groups of up to 12 (about €165/participant) or 1:1 coaching. 20% VAT applies — [Masteria, Oct 2026](https://www.master-ia.fr/financement-formation-ia)
- Stema Partners: "IA Essentiel" 1 day €2,500; "IA Transformation" (audit + 2 days + J+30 follow-up) €12,000 HT; "IA Growth Academy" 2 days €9,500 — [Stema](https://www.stemapartners.com/formation)
- IA Formation (Qualiopi): short courses from €490, eligible for CPF/OPCO/FAF/France Travail; formats of 1–2, 3–5 or 10 days — [iaformation.ai](https://www.iaformation.ai/)
- France IA: 2-day on-site intra training on the client's real tasks, with deliverables ("vos propres agents IA", a "second cerveau") and up to 4h of coaching afterwards, OPCO-fundable — [franceia.com](https://www.franceia.com/formation-equipes)
- BGB Formation sells "Claude Code" and Claude/Artifacts training. It appears with the "Osez l'IA" logo, with a satisfaction-or-refund clause — [bgbformation.fr](https://bgbformation.fr/)

**OPCO and Qualiopi rules (2026)**
- Qualiopi has been mandatory since 1 Jan 2022 for any funding from an OPCO, the State, regions, CDC, France Travail or Agefiph (art. L6316-1 Code du travail). Valid 3 years, with a surveillance audit between months 14 and 22 — [Masteria](https://www.master-ia.fr/financement-formation-ia)
- **Since 1 Oct 2026 (VAT reform)**, subrogation (OPCO pays the trainer directly) is the exception. Generally the company pays TTC and the OPCO reimburses the HT part within the limits of its agreement. Atlas keeps subrogation for the plan de développement of firms under 50 employees (mutualised funds) on request — [Masteria](https://www.master-ia.fr/financement-formation-ia), citing [Opco Atlas](https://www.opco-atlas.fr/actualites/reforme-de-la-tva-ce-qui-change-pour-le-financement-de-vos-formations.html) and [OPCO EP](https://www.opcoep.fr/actualites/reforme-de-la-tva-ce-qui-change-pour-vos-demandes-de-prise-en-charge-de-formation-hors-contrat-d)
- Funding can reach up to 100% of the HT cost depending on branch criteria. Average remaining cost to the company in 2024 was 38%, and 67% above 50 employees (France compétences, Feb 2026) — [Masteria](https://www.master-ia.fr/financement-formation-ia)
- OPCO mutualised funds apply to companies under 50 employees. Art. L6332-17 lists what can be paid (training costs, trainee salaries, diagnostics with a view to training). **Designing an AI agent or tool is not on the list**, so consulting and development must be financed outside the OPCO — [Masteria](https://www.master-ia.fr/financement-formation-ia)
- **FNE-Formation is suspended since 2025** and not restored in 2026. The tax credit for executive training has been abolished for courses since 1 Jan 2025. The CPF only funds certifying training (RNCP/RS) — [Masteria](https://www.master-ia.fr/financement-formation-ia); [Studeria](https://www.studeria.fr/articles-de-blog/cout-financement-formation-ia-entreprise)
- The OPCO request must be filed before the first day of training. Companies with under 11 employees pay 0.55% of payroll as the training contribution, and 11+ pay 1% — [Studeria, June 2026](https://www.studeria.fr/articles-de-blog/cout-financement-formation-ia-entreprise)
- OPCO case review takes 2–3 weeks, and payment arrives 30–90 days after delivery — [France IA](https://www.franceia.com/financement/opco)
- **Qualiopi portage:** a non-certified freelance trainer can deliver OPCO-funded training under a certified organisation's convention (indicator 27). Example published terms: Formagora charges €350 HT/year plus a 20% commission. Portage does **not** give access to the CPF — [Bienvenum, Oct 2026](https://bienvenum.org/portage-qualiopi-tarif/)

**Consulting/audit and public schemes**
- Bpifrance **Diag Data IA**: 8 days by a Bpifrance-approved data/AI expert over a maximum of 3 months. Max quote €10,000 HT, 40% subsidy (€6,000 left to pay). For PME/ETI with 10–2,000 FTE, €1M+ turnover and over 1 year old. Funded by France 2030 under "Osez l'IA" — [Bpifrance](https://www.bpifrance.fr/catalogue-offres/diag-data-ia); [France Num](https://www.francenum.gouv.fr/aides-financieres/diag-data-ia)
- Diags under Osez l'IA are financed with €9.6M from France 2030 — [entreprises.gouv.fr](https://www.entreprises.gouv.fr/)
- "Osez l'IA" funds part of a diagnostic or support carried out by an approved expert, not a training invoice — [France IA](https://www.franceia.com/financement/opco)
- Crédit d'impôt innovation was extended to 31 Dec 2027 at 20% (mainland). It covers prototypes of new products, not standard consulting — [Masteria](https://www.master-ia.fr/financement-formation-ia)
- Freelance audit price points: "Mini AI audit" €250 (Malt) — [Malt](https://www.malt.com/profile/emmanuelbarencourt). Many training firms offer a free audit as a lead magnet — [BGB Formation](https://bgbformation.fr/); [Just Use AI](https://www.just-use-ai.com/blog/agence-n8n-france-tarif)
- AI Act Art. 4 (AI literacy) was softened by the Omnibus to "take measures to support AI literacy" (a duty of effort) — [euaiact.com](https://www.euaiact.com/digital-omnibus-ai)

### Inferences
- **Business sheet A: "Formation IA intra-entreprise finançable OPCO"**
  - *What:* 1–2 day hands-on workshops (ChatGPT/Claude/Copilot/Mistral on real tasks, custom GPTs/Projects, prompt libraries), plus follow-up coaching.
  - *Clients:* TPE/PME of 5–50 employees (mutualised OPCO funds), associations with employees (Uniformation/other OPCO), professions libérales via FIF-PL/FAF (not verified in detail).
  - *Price:* €1,000–€2,000 HT/day intra is realistic for a newcomer (benchmarks €1,980–€2,500).
  - *Route:* start under a **Qualiopi portage** partner (about €350/year + 20%), then get certified once volume justifies it. Certification audit costs were not found.
  - *Realistic revenue:* 2–4 training days/month × €1,200–€1,800 ≈ €2,400–€7,200/mo gross (inference).
  - *Skills:* pedagogy, AI tool fluency, Qualiopi paperwork (convocations, évaluations, attestations).
  - *Saturation:* high and rising (many organisations already advertise "Formation IA OPCO").
  - *Risks:* OPCO budgets are capped and revised during the year; cash-flow delay (30–90 days, and companies now pre-pay TTC since Oct 2026); Qualiopi compliance burden; commoditisation of generic "ChatGPT" courses.
- **Business sheet B: "Assistants IA sur mesure (Custom GPTs / Claude Projects) + audit IA"**
  - Sell a €250–€1,500 audit plus the configuration of 3–5 assistants with a prompt library and training. It works best bundled with training (OPCO-fundable) and implementation (not fundable).
  - Diag Data IA is not accessible to a newcomer, because it requires Bpifrance expert approval, and the targets have €1M+ turnover.
- Combining training (fundable) with implementation (billed separately) lets the entrepreneur be paid partly by the OPCO for the "education" step that then generates automation projects. This is the most structurally favourable French model found.

### Gaps
- Cost of a Qualiopi certification audit for a solo trainer was not retrieved.
- Barèmes for specific OPCOs in 2026 (Atlas, OPCO EP, Akto, Uniformation for associations) were not retrieved. Only Atlas modalities are documented, via Masteria.
- Whether "Osez l'IA" funds diagnostics by non-Bpifrance experts (e.g. regional schemes) is unclear.
- Custom GPT/assistant pricing in France has no data beyond Malt packages.

---

## Q7. Internal tool building / Notion, Airtable, CRM setup for SMEs

### Takeaway
This is an established, lower-hype freelance market in France. Malt rates range from €125 to €800/day, typically €280–€500 for Airtable/Make/Notion/CRM consultants. AI now makes builds faster and adds AI steps (document extraction, drafting). Lovable says many non-technical users build internal tools (CRM, inventory, HR) themselves, which both validates the demand and threatens the DIY-able low end. The safest angle is process digitalisation for a vertical, delivered as a fixed-price package with maintenance.

### Cited Findings
- Malt profiles combining Airtable/Make/n8n/Notion/CRM work: €125/day (Paris, 0–2 yrs) — [Malt](https://www.malt.com/profile/sarahnovae); €280/day (certified Airtable Builder, Make Advanced, RNCP39108 "No-Code Product Builder" block) — [Malt](https://www.malt.com/profile/nicolasgamard); CRM/Zoho/Make consultant €290/day; €400–€700/day for mid/senior — [Malt n8n listing](https://en.malt.fr/s/tags/n8n-68b1ce80892ea37fa07d5f7b?p=7); Belgian "digitalisation de process" consultant (Lovable, Airtable, Supabase) €555/day — [Malt BE](https://fr.malt.be/s/tags/no-code-60239330e7a56507faa5d017)
- Example internal tool: a complete Airtable + Make information system for a renovation company. Features are one interface per role (manager vs on-site technician), dashboards, automated quote follow-up and invoice extraction — [Malt, Nicolas Gamard](https://www.malt.com/profile/nicolasgamard)
- Lovable's survey: non-technical users build "internal tools like CRMs, inventory systems, and HR platforms" — [TechCrunch](https://techcrunch.com/2026/06/09/lovable-says-it-has-hit-500m-in-annualized-revenue-with-1-million-new-projects-a-week/)
- A French RNCP certification exists for this skill set: RNCP39108 "No-Code Product Builder" — [Malt](https://www.malt.com/profile/nicolasgamard)
- French SMB digital priorities: e-invoicing reform is #1 (39%) — [presse.economie.gouv.fr](https://presse.economie.gouv.fr/?p=184420). Bpifrance Le Lab: 91% of TPE/PME leaders say they are ready for e-invoicing but complain about software cost and lack of support — [Bpifrance Le Lab](https://lelab.bpifrance.fr/)
- Malt hosts 850,000 freelancers and 90,000 companies — [Malt](https://en.malt.fr/a/freelance/tech)

### Inferences
- **Business sheet: "Outil de gestion interne / CRM sur mesure pour [niche]"**
  - *What:* map processes, build an Airtable/Notion base or a light CRM (HubSpot free, Pipedrive, Folk, GHL), add Make automations and AI steps, train staff and maintain.
  - *Clients:* PME of 5–50 people in BTP/rénovation, associations (adhérents, bénévoles, subventions), training organisations, small real estate agencies.
  - *Price:* packages of €1,500–€6,000 per system plus €100–€300/mo maintenance (inference from TJM × 5–15 days).
  - *Tools:* Airtable (paid plans per seat), Notion, Make, Softr/Lovable for front-ends.
  - *Prospecting:* existing association and web clients (this entrepreneur's clear advantage), Malt profile, content per niche.
  - *Skills:* data modelling and process analysis. It is learnable without coding, and the certifications (Airtable Builder, Make) are within reach.
  - *Saturation:* medium. Competition comes from many juniors on Malt, but the pool of skilled business-process people with a vertical niche is thinner.
  - *Risks:* scope creep, client dependency on you for every change, per-seat SaaS costs passed to clients, GDPR on member/customer data.
- For this entrepreneur, the **association vertical** offers a defensible niche: membership management, cotisation reminders, reçus fiscaux, volunteer scheduling and grant tracking. It can be bundled with websites. The main constraint is associations' limited budgets (inference). Grants and associations with employees (OPCO Uniformation for training) are possible funding levers but were not verified.

### Gaps
- No French market-size or pricing survey specific to Notion/Airtable/CRM setup services.
- Airtable and Notion 2026 seat pricing was not retrieved.
- No data on demand from associations specifically for AI/automation services (Recherches & Solidarités or Le Mouvement associatif surveys were not searched).
