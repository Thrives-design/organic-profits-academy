import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../server/db";
import {
  users,
  paymentPlans,
  videos,
  webinars,
  chatMessages,
  forumPosts,
  forumReplies,
  products,
} from "@shared/schema";

async function main() {
  const existing = await db.select().from(users);
  if (existing.length > 0) {
    console.log(`Seed skipped — ${existing.length} users already exist.`);
    return;
  }

  console.log("Seeding Neon database...");
  const now = Date.now();

  const adminHash = await bcrypt.hash("admin123", 10);
  const demoHash = await bcrypt.hash("demo1234", 10);

  // ---- Admin ----
  await db.insert(users).values({
    email: "admin@organicprofits.com",
    password: adminHash,
    name: "BillionairePrice",
    isMember: true,
    isAdmin: true,
  });

  // ---- Demo member ----
  const [demoMember] = await db
    .insert(users)
    .values({
      email: "demo@organicprofits.com",
      password: demoHash,
      name: "Demo Member",
      isMember: true,
      isAdmin: false,
    })
    .returning();

  await db.insert(paymentPlans).values({
    userId: demoMember.id,
    planType: "3mo",
    totalAmount: 1100,
    installmentAmount: 367,
    totalInstallments: 3,
    paidInstallments: 2,
    nextChargeDate: new Date(Date.now() + 14 * 86400000).toISOString(),
  });

  // ---- Videos — 3 niches: crypto, forex, options (~8 each = 24 total) ----
  const SAMPLE_MP4 =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const videoSeed = [
    // Crypto (8)
    { title: "BTC Liquidity Sweeps & Order Blocks", niche: "crypto", level: "advanced", duration: "48:12", instructor: "Marcus Hale", color: "#ae9b6c" },
    { title: "Crypto Market Structure 101", niche: "crypto", level: "beginner", duration: "32:45", instructor: "Marcus Hale", color: "#ae9b6c" },
    { title: "ETH Setups: London to NY Session", niche: "crypto", level: "advanced", duration: "54:02", instructor: "Sara Lin", color: "#ae9b6c" },
    { title: "Reading On-Chain Flow for Swing Trades", niche: "crypto", level: "advanced", duration: "41:30", instructor: "Marcus Hale", color: "#ae9b6c" },
    { title: "Altcoin Rotation & Sector Strength", niche: "crypto", level: "advanced", duration: "38:11", instructor: "Sara Lin", color: "#ae9b6c" },
    { title: "Stablecoin Mechanics Every Trader Should Know", niche: "crypto", level: "beginner", duration: "22:08", instructor: "Marcus Hale", color: "#ae9b6c" },
    { title: "Perps & Funding: A Trader's Field Guide", niche: "crypto", level: "advanced", duration: "36:55", instructor: "Sara Lin", color: "#ae9b6c" },
    { title: "Reading Coinbase Premium & Spot CVD", niche: "crypto", level: "advanced", duration: "43:20", instructor: "Marcus Hale", color: "#ae9b6c" },
    // Forex (8)
    { title: "EUR/USD London Session Playbook", niche: "forex", level: "advanced", duration: "44:21", instructor: "Kwame Adeyemi", color: "#ae9b6c" },
    { title: "Forex 101: Pairs, Pips & Lot Sizing", niche: "forex", level: "beginner", duration: "29:14", instructor: "Kwame Adeyemi", color: "#ae9b6c" },
    { title: "Yen Carry Trade & Macro Flows", niche: "forex", level: "advanced", duration: "51:00", instructor: "Isabel Moreno", color: "#ae9b6c" },
    { title: "GBP Volatility Around UK Data", niche: "forex", level: "advanced", duration: "36:42", instructor: "Isabel Moreno", color: "#ae9b6c" },
    { title: "Smart Money Concepts in FX", niche: "forex", level: "advanced", duration: "49:55", instructor: "Kwame Adeyemi", color: "#ae9b6c" },
    { title: "Trading the NY Open FX Fix", niche: "forex", level: "advanced", duration: "33:27", instructor: "Isabel Moreno", color: "#ae9b6c" },
    { title: "DXY Structure & The Dollar Cycle", niche: "forex", level: "advanced", duration: "40:18", instructor: "Kwame Adeyemi", color: "#ae9b6c" },
    { title: "The Weekly Forex Bias Routine", niche: "forex", level: "beginner", duration: "24:36", instructor: "Isabel Moreno", color: "#ae9b6c" },
    // Options (8)
    { title: "0DTE SPX Options: Iron Condors", niche: "options", level: "advanced", duration: "56:15", instructor: "Priya Shah", color: "#ae9b6c" },
    { title: "The Greeks for Directional Traders", niche: "options", level: "beginner", duration: "35:12", instructor: "Priya Shah", color: "#ae9b6c" },
    { title: "Earnings Season Playbook: Strangles & Spreads", niche: "options", level: "advanced", duration: "47:33", instructor: "Noah Bennett", color: "#ae9b6c" },
    { title: "Selling Premium in High IV Environments", niche: "options", level: "advanced", duration: "42:19", instructor: "Priya Shah", color: "#ae9b6c" },
    { title: "LEAPS: Long-Dated Calls for Position Trading", niche: "options", level: "advanced", duration: "38:48", instructor: "Noah Bennett", color: "#ae9b6c" },
    { title: "Options Chain: Reading Flow Like a Pro", niche: "options", level: "beginner", duration: "26:30", instructor: "Priya Shah", color: "#ae9b6c" },
    { title: "Vertical Spreads: A Complete Primer", niche: "options", level: "beginner", duration: "31:04", instructor: "Noah Bennett", color: "#ae9b6c" },
    { title: "Gamma, Pin Risk & The Close", niche: "options", level: "advanced", duration: "45:09", instructor: "Priya Shah", color: "#ae9b6c" },
  ];

  for (let i = 0; i < videoSeed.length; i++) {
    const v = videoSeed[i];
    await db.insert(videos).values({
      title: v.title,
      description: `A focused session covering ${v.title.toLowerCase()}. Expect live chart annotations, entry and exit criteria, and a runbook you can apply on Monday morning.`,
      niche: v.niche,
      level: v.level,
      duration: v.duration,
      instructor: v.instructor,
      videoUrl: SAMPLE_MP4,
      thumbnailColor: v.color,
      createdAt: new Date(now - i * 3600_000),
    });
  }

  // ---- Webinars ----
  const webinarSeed = [
    { title: "Weekly Market Open Playbook", niche: "crypto", instructor: "Marcus Hale", daysAhead: 2, duration: 60, status: "upcoming" },
    { title: "Live: BTC Weekend Recap & Week Ahead", niche: "crypto", instructor: "Marcus Hale", daysAhead: 4, duration: 45, status: "upcoming" },
    { title: "0DTE War Room — Fed Day Edition", niche: "options", instructor: "Priya Shah", daysAhead: 7, duration: 90, status: "upcoming" },
    { title: "Forex Macro Briefing — CPI Week", niche: "forex", instructor: "Isabel Moreno", daysAhead: 10, duration: 60, status: "upcoming" },
    { title: "Risk Management Masterclass", niche: "crypto", instructor: "Sara Lin", daysAhead: -5, duration: 75, status: "past" },
    { title: "Smart Money Concepts — Live Q&A", niche: "forex", instructor: "Kwame Adeyemi", daysAhead: -12, duration: 60, status: "past" },
    { title: "Options Greeks Deep Dive", niche: "options", instructor: "Noah Bennett", daysAhead: -18, duration: 90, status: "past" },
  ];
  for (const w of webinarSeed) {
    const d = new Date();
    d.setDate(d.getDate() + w.daysAhead);
    d.setHours(14, 0, 0, 0);
    await db.insert(webinars).values({
      title: w.title,
      description: `${w.title} — an hour with the desk. Bring questions.`,
      niche: w.niche,
      instructor: w.instructor,
      scheduledAt: d.toISOString(),
      durationMin: w.duration,
      status: w.status,
      replayUrl: w.status === "past" ? SAMPLE_MP4 : null,
    });
  }

  // ---- Chat messages — mirrors the real Telegram channels (11) ----
  const channels = [
    "general",
    "trade-ideas",
    "profits",
    "digital-downloads",
    "organic-conversations",
    "tips-tricks",
    "credit-building",
    "opa-events",
    "backtesting",
    "webinar-feedback",
    "crypto-investing",
  ];
  const chatSeed: Record<string, string[]> = {
    "trade-ideas": [
      "BTC tagged prev week high, waiting for the sweep.",
      "ETH / BTC ratio starting to base out.",
      "Looking at SOL for a pullback entry into the 15m FVG.",
      "EUR/USD London session gave us the classic sweep-and-reclaim.",
      "0DTE SPX: iron condor on at 14 delta, risk $85 to make $15.",
      "USDJPY: short at daily FVG tap.",
      "NQ: retest of VPOC then continuation.",
      "AAPL: weekly breakout above 195 watching for momentum.",
      "GLD: long the 200ma retest.",
    ],
    profits: [
      "I had $350 yesterday — turned it into $700+. Goal is to keep stacking this account. 💯",
      "Passed my funded account certificate yesterday. My guy going crazy 🔥",
      "3R on the 0DTE iron condor — by the book.",
      "Closed month at +14%. Risk discipline is everything.",
      "First +$1k day today. Thank you team.",
      "Hit my monthly target on day 12.",
      "Closed NQ long for +30pts.",
      "Funded my second prop account this week.",
    ],
    "digital-downloads": [
      "Dropped this week's backtest workbook — link in pinned.",
      "New PDF: pre-market routine checklist.",
      "Updated risk-management template for prop firms.",
      "Link to the full webinar archive in pinned.",
      "Added the chart annotation template Byron uses.",
    ],
    "organic-conversations": [
      "Starting to catch on more, now understanding more when you say paint the picture you see.",
      "Coffee + charts + chat. Tuesday energy.",
      "Anyone in Houston this weekend? Pull up.",
      "Mindset talk: what's your reset routine after a red day?",
      "Small group, big accountability. Glad we keep it real here.",
    ],
    "tips-tricks": [
      "Set alerts on your bias levels overnight — wake up to the levels, not the noise.",
      "Trail half, runner targets PD high.",
      "Don't trade greeks you don't understand.",
      "Risk per trade BEFORE you click — never after.",
      "Walk away after 2R red. Always.",
    ],
    "credit-building": [
      "Got my score from 620 to 740 in 6 months. AMA.",
      "Authorized user trick still works — pick the right card.",
      "Pay the statement balance, not the minimum. Easy win.",
      "Disputing inquiries — send the letters this week.",
    ],
    "opa-events": [
      "Houston meetup this Saturday. RSVP in DM.",
      "Live desk session tomorrow 9:15 CT.",
      "End-of-month house dinner — invites going out.",
      "Friday wrap-up call at 4 PM CT.",
    ],
    backtesting: [
      "Ran 200 trades on the London sweep play — 62% win rate, 1.4 expectancy.",
      "Posted my journal for last week. Feedback welcome.",
      "Backtested 0DTE iron condors at 12d — too tight. 14d is the sweet spot.",
      "Sample size matters. 30 trades is not a strategy.",
    ],
    "webinar-feedback": [
      "Last night's webinar was 🔥. The order block walkthrough finally clicked.",
      "Question on the 0DTE session: how do you size after a green day?",
      "Replay link please?",
      "Suggesting a deep-dive on prop firm risk rules.",
    ],
    "crypto-investing": [
      "Long-term BTC bias still constructive. DCAing through the chop.",
      "Watching SOL ecosystem narratives this cycle.",
      "Funding rates flipping negative — short-term contrarian tell.",
      "Stables on Coinbase still earning — set and forget.",
    ],
    general: [
      "Morning everyone — coffee's on, charts are loaded.",
      "New here. Just picked up the lifetime — what's the best place to start?",
      "Welcome! Start with Market Structure 101 and the Risk Management masterclass replay.",
      "Weekly recap is dropping later today.",
      "Love the energy in here.",
      "Anyone else trade the CPI print tomorrow?",
      "Sitting out macro data until I see confirmation.",
      "Fraunces serif typography on the new site is chef's kiss.",
      "Marcus is live in #crypto walking through BTC liquidity.",
      "Let's have a good week team.",
      "Welcome to new members this week — make yourselves at home.",
    ],
    crypto: [
      "BTC tagged prev week high, waiting for the sweep.",
      "ETH / BTC ratio starting to base out.",
      "Looking at SOL for a pullback entry into the 15m FVG.",
      "On-chain flow shows spot buying into this dip.",
      "Don't chase. Let price come to you.",
      "Marcus: we covered order blocks in today's session.",
      "Anyone else watching the weekly for a macro shift?",
      "Funding rates turned negative — contrarian tell.",
      "Nice entry on that retest. Chef's kiss.",
      "Ranging market, scaling down size.",
      "Target hit. Stop to breakeven on the runner.",
    ],
    options: [
      "0DTE SPX: iron condor on at 14 delta, risk $85 to make $15.",
      "VIX compressed — premium sellers feasting.",
      "Priya's earnings playbook changed my game.",
      "Avoid holding gamma risk into the close on Fed days.",
      "Bought strangles into NVDA earnings last night. Got paid.",
      "LEAPS are for patient capital.",
      "Chain flow into the 510 calls is heavy.",
      "Don't trade the greeks you don't understand.",
      "Rolled my put credit spread for more time.",
      "Iron fly closed for half profit. Next.",
      "Who else is short vol into OPEX?",
    ],
    forex: [
      "EUR/USD London session gave us the classic sweep-and-reclaim.",
      "Isabel's macro briefing saved me from fighting the trend.",
      "Yen weakness resuming. Watching 152 on USD/JPY.",
      "GBP volatility wide around UK CPI.",
      "DXY pushing higher — risk assets cautious.",
      "Kwame: smart money sweep into the Asia low, reversal in London.",
      "Trailing half my position on EUR/USD short.",
      "NY fix grind setting up well.",
      "Pairs I'm watching this week: EURUSD, USDJPY, AUDUSD.",
      "Pip thief mode activated.",
      "Respect the daily bias.",
    ],
    wins: [
      "First +$1k day today. Thank you team.",
      "Closed month at +14%. Risk discipline is everything.",
      "Funded my second prop account this week.",
      "3R on the 0DTE iron condor — by the book.",
      "Paid off my lifetime membership in a month. Worth every cent.",
      "Hit my monthly target on day 12.",
      "Long SOL worked. Thanks for the setup review.",
      "Small wins compound. Stay consistent.",
      "Closed NQ long for +30pts.",
      "Finally stopped revenge trading. Biggest win of all.",
    ],
    setups: [
      "ES: 4-hour bull flag, watching 4512 trigger.",
      "BTC: daily demand at 62,400 — swing long with 60,800 invalidation.",
      "EURUSD: London sweep + reclaim, expecting 30 pip push.",
      "SPX: 0DTE iron condor 5390/5395/5450/5455.",
      "NQ: retest of VPOC then continuation.",
      "AAPL: weekly breakout above 195 watching for momentum.",
      "CL: descending triangle on the 1h, short on breakdown.",
      "USDJPY: short at daily FVG tap.",
      "META: short strangle into earnings.",
      "GLD: long the 200ma retest.",
    ],
  };
  const names = ["BillionairePrice", "Jacob", "Wyskii", "Marcus", "Sara", "Dan", "Rachel", "Priya", "Noah", "Kwame", "Isabel", "Jordan", "Taylor", "Riley", "Quinn"];
  let msgOffset = 0;
  for (const ch of channels) {
    const messages = chatSeed[ch] || [];
    for (let i = 0; i < messages.length; i++) {
      await db.insert(chatMessages).values({
        channel: ch,
        userId: demoMember.id,
        userName: names[(i + msgOffset) % names.length],
        body: messages[i],
        createdAt: new Date(now - (messages.length - i) * 120000),
      });
    }
    msgOffset++;
  }

  // ---- Forum posts + replies ----
  const forumSeed = [
    { title: "What pre-market routine actually works?", category: "Psychology", author: "Jordan H.", body: "I'm still working through the mental side. What's your wake-up to market open routine? Trying to stop opening charts before I've had coffee and reviewed the plan." },
    { title: "My 3-month journey from -$2k to +$4k profitable", category: "Wins", author: "Taylor R.", body: "Tracking my progress here. Started the academy in January. Risk management changed everything — I cut size in half and my win rate went up." },
    { title: "Best charting setup for crypto + options?", category: "Tools", author: "Riley S.", body: "Running TradingView for crypto and ThinkOrSwim for options chains. Is anyone using a single platform for both without the pain?" },
    { title: "How do you journal trades without burning out?", category: "Strategy", author: "Quinn L.", body: "I've tried Notion, Edgewonk, and a custom spreadsheet. Looking for something that gets reviewed every week, not abandoned in 30 days." },
    { title: "0DTE risk caps — what's your daily stop?", category: "Strategy", author: "Noah B.", body: "Setting a max daily loss per 0DTE day and sticking to it has been the single biggest improvement to my PnL. What's yours?" },
    { title: "Question: can beginners survive perps?", category: "Ask a Question", author: "Sam P.", body: "I have options experience but never traded perpetuals. Is small-size on ETH a reasonable starting point while I learn structure, or is it a trap?" },
    { title: "Tilt recovery: walking away works", category: "Psychology", author: "Alex K.", body: "After two red days in a row I literally close the laptop and go for a run. Sounds obvious. It's been the hardest habit to build." },
    { title: "Which broker for prop firm passing?", category: "Tools", author: "Chris D.", body: "Looking for a broker that plays nicely with the major prop firms' rulesets. Fees, execution, platform preferences welcomed." },
    { title: "Hit my prop firm target — 10% in 18 days", category: "Wins", author: "Mia T.", body: "Following the risk framework from the Risk Management Masterclass. Max 1R per trade, 3R daily stop. It works." },
    { title: "Anyone else find the serif typography relaxing?", category: "Ask a Question", author: "Pat N.", body: "Off-topic but the site feels more like a Bloomberg terminal than a Discord. Refreshing." },
  ];
  const replyBodies = [
    "Really well put. I've been doing something similar and it's made a difference.",
    "This. The quiet work compounds.",
    "Respectfully disagree — I think smaller size early is the better move.",
    "Same experience here. Writing down the plan before the open changed my trading.",
    "What timeframe are you using for confirmation?",
    "Thanks for posting this. Needed to read it today.",
    "Second this. The Risk Management replay is worth watching twice.",
    "Love the transparency. Keep going.",
  ];
  for (let i = 0; i < forumSeed.length; i++) {
    const p = forumSeed[i];
    const [post] = await db
      .insert(forumPosts)
      .values({
        title: p.title,
        body: p.body,
        category: p.category,
        authorId: demoMember.id,
        authorName: p.author,
        upvotes: Math.floor(Math.random() * 40) + 3,
        createdAt: new Date(now - i * 3600_000),
      })
      .returning();

    const repliesCount = 2 + Math.floor(Math.random() * 4);
    for (let r = 0; r < repliesCount; r++) {
      await db.insert(forumReplies).values({
        postId: post.id,
        authorId: demoMember.id,
        authorName: names[(i + r) % names.length],
        body: replyBodies[(i + r) % replyBodies.length],
        createdAt: new Date(now - i * 3600_000 + (r + 1) * 600_000),
      });
    }
  }

  // ---- Products ----
  const productSeed = [
    { name: "Leaf Logo Tee — Navy", category: "tshirts", price: 42, baseColor: "#0c1b28", description: "Heavyweight 6 oz cotton tee with the Organic Profits leaf embroidered on the left chest. Pre-shrunk. Made in USA.", colors: ["navy", "black", "cream"], sizes: ["S", "M", "L", "XL", "XXL"] },
    { name: "Candlestick Hoodie — Navy", category: "hoodies", price: 84, baseColor: "#0c1b28", description: "Heavy-weight 400 gsm fleece pullover hoodie with gold foil candlestick print across the back. Kangaroo pocket. Ribbed cuffs.", colors: ["navy", "black"], sizes: ["S", "M", "L", "XL", "XXL"] },
    { name: "Organic Profits Dad Cap", category: "headwear", price: 36, baseColor: "#7bac3f", description: "Unstructured 6-panel dad cap in brushed twill. Adjustable leather strap. Embroidered leaf at front.", colors: ["green", "navy", "cream"], sizes: ["ONE"] },
    { name: "Leaf Beanie — Gold", category: "headwear", price: 32, baseColor: "#ae9b6c", description: "Ribbed-knit beanie in a warm gold tone. Subtle woven label at the cuff.", colors: ["gold", "navy", "black"], sizes: ["ONE"] },
    { name: "Trader Sweats — Navy", category: "sweatpants", price: 78, baseColor: "#0c1b28", description: "Tapered fit jogger with elastic waistband, zip pockets, and a small leaf embroidery at the left thigh.", colors: ["navy", "black"], sizes: ["S", "M", "L", "XL", "XXL"] },
    { name: "Cultivate Profits Tee — Cream", category: "tshirts", price: 42, baseColor: "#f5f3ec", description: "Soft-washed tee with our mantra 'Cultivate Profits' in a small serif across the chest.", colors: ["cream", "navy", "green"], sizes: ["S", "M", "L", "XL", "XXL"] },
    { name: "Academy Pullover Hoodie — Cream", category: "hoodies", price: 84, baseColor: "#f5f3ec", description: "Mid-weight fleece pullover in a vintage cream wash. Tonal embroidery. Relaxed fit.", colors: ["cream", "navy", "green"], sizes: ["S", "M", "L", "XL", "XXL"] },
    { name: "Prop Desk Sweats — Black", category: "sweatpants", price: 78, baseColor: "#111111", description: "Relaxed-fit fleece jogger in heavyweight French terry. Side pockets. Drawstring waistband.", colors: ["black", "navy"], sizes: ["S", "M", "L", "XL", "XXL"] },
    { name: "Leaf Logo Snapback", category: "headwear", price: 38, baseColor: "#0c1b28", description: "Structured 6-panel snapback with flat brim and raised embroidery.", colors: ["navy", "black", "green"], sizes: ["ONE"] },
    { name: "Market Maker Tee — Green", category: "tshirts", price: 42, baseColor: "#7bac3f", description: "Soft combed cotton tee in a deep brand green with tonal back print.", colors: ["green", "navy", "black"], sizes: ["S", "M", "L", "XL", "XXL"] },
  ];
  for (const p of productSeed) {
    await db.insert(products).values({
      name: p.name,
      category: p.category,
      price: p.price,
      description: p.description,
      colors: p.colors as any,
      sizes: p.sizes as any,
      baseColor: p.baseColor,
    });
  }

  console.log("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
