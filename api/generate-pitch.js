import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are drafting a media pitch for a Douglas Elliman real estate listing. The goal is a pitch compelling enough that a top-tier publication — WSJ, New York Times, Financial Times, Robb Report, Forbes, Mansion Global, Architectural Digest — would want to run a story. The pitch is not an advertisement. It is a news hook. Your job is to find and articulate the story.

Follow this template exactly. Fill every bracketed field with specific, researched information. Where information is unavailable, use a clearly marked placeholder like [PHOTOGRAPHER CREDIT TBD].

---

[STATE] | [MONTH] | [Full Property Address]

SUBJECT: [Headline - 50 characters or fewer. Include location and abbreviated price (e.g., $7.75M, not $7,750,000). Hook first - lead with the most unusual or compelling angle.]

Hi [Journalist Name],

[Body - 3 to 5 paragraphs. Each paragraph develops one clear idea: the seller and their story, the property's architecture or distinctive features, the market context or trend this listing represents. The body does NOT copy the MLS description verbatim. Write as a journalist would. Be precise and specific. Avoid vague superlatives ("stunning," "breathtaking," "one of a kind"). Name real things: materials, designers, square footage, acreage, specific design features. The final sentence of the body must read: "[Address] is listed at $[price] with [Agent Name(s)] at Douglas Elliman."]

"[Agent quote - one to three sentences. Should address the property's market significance, the current trend it represents, or what distinguishes it from comparable listings. Attributed to the listing agent by name and title.]" - [Agent Name], Douglas Elliman

Listing: [Douglas Elliman URL or property website]
Listed With: [Agent Name(s)], Douglas Elliman
Price: $[price]
Photos by [Photographer Credit]: [Dropbox link]

Property Description: [MLS verbatim description - copy exactly as provided]

---

Writing rules — follow without exception:

Voice and tone:
- Write like a journalist, not a marketing copywriter. Clean declarative sentences. No breathless superlatives.
- Every claim must be either confirmed by the provided details or drawn from the MLS description. Do not invent or assume facts not given.
- No em dashes. Use commas, colons, or sentence breaks instead.
- No filler phrases: "truly unique," "rare opportunity," "nestled," "boasting," "stunning," "breathtaking," "one of a kind," "world-class."
- No AI-sounding hedging ("it's worth noting," "it's important to mention," "in conclusion").

Subject line:
- 50 characters or fewer including spaces.
- Must include location and abbreviated price.
- Lead with the most compelling hook (seller name, notable feature, record price, notable provenance).

Body structure:
- Open with the seller or the property's strongest story angle, not with "Located at..." or "Presenting..."
- Develop the narrative logically: seller story, property character, market/trend context.
- Name specific materials, designers, dimensions, or features rather than describing them vaguely.
- Last sentence of the body always closes with the agent and price attribution.

Quote:
- If the agent has provided a quote, use it verbatim or lightly edited for grammar only.
- If no quote is provided, write a placeholder: "[QUOTE - Agent Name]" - [Agent Name], Douglas Elliman
- Do not fabricate quotes.

Property Highlights section:
- Include only if the MLS or user-provided data contains 5 or more distinct, concrete highlights worth calling out.
- Use bullet points. Be specific. Each bullet should be a factual statement, not a marketing phrase.

After the pitch, add a section:

**Before sending, confirm:**
- [ ] List any fields that are missing or need verification before this pitch can be sent

**Would strengthen the pitch if confirmed:**
- [ ] List any details that, if confirmed, would materially improve the editorial angle`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    state, launchMonth, address, price, listingUrl,
    agents, mlsDescription, photographer, photoLink,
    developerName, developerUrl, architectName, architectUrl,
    designerName, designerUrl, stagerName, stagerUrl,
    seller, newsworthy, agentQuote,
  } = req.body;

  if (!address || !price || !mlsDescription) {
    return res.status(400).json({ error: 'Address, price, and MLS description are required.' });
  }

  const agentList = Array.isArray(agents) ? agents.filter(Boolean) : [agents].filter(Boolean);

  // Build contributors block
  const contributors = [];
  if (developerName) contributors.push(`Developer: ${developerName}${developerUrl ? ' — ' + developerUrl : ''}`);
  if (architectName) contributors.push(`Architect: ${architectName}${architectUrl ? ' — ' + architectUrl : ''}`);
  if (designerName) contributors.push(`Interior Designer: ${designerName}${designerUrl ? ' — ' + designerUrl : ''}`);
  if (stagerName) contributors.push(`Stager: ${stagerName}${stagerUrl ? ' — ' + stagerUrl : ''}`);

  const userMessage = `Please write a media pitch for the following Douglas Elliman property listing.

STATE: ${state || '[not provided]'}
LAUNCH MONTH: ${launchMonth || '[not provided]'}
ADDRESS: ${address}
PRICE: ${price}
LISTING URL: ${listingUrl || '[not yet live]'}
LISTING AGENT(S): ${agentList.join(', ') || '[not provided]'}
PHOTOGRAPHER: ${photographer || '[not provided]'}
PHOTO LINK: ${photoLink || '[not yet available]'}
${contributors.length > 0 ? '\nKEY CONTRIBUTORS:\n' + contributors.join('\n') : ''}
${seller ? '\nSELLER: ' + seller : ''}
${newsworthy ? '\nWHAT MAKES THIS HOME NEWSWORTHY:\n' + newsworthy : ''}
${agentQuote ? '\nAGENT QUOTE (use verbatim):\n"' + agentQuote + '"' : ''}

MLS PROPERTY DESCRIPTION (use verbatim at the end of the pitch):
${mlsDescription}`;

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const pitch = message.content[0].text;
    return res.status(200).json({ pitch });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate pitch. Check your API key and try again.' });
  }
}
