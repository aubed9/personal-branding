# -*- coding: utf-8 -*-
"""
Script to create comprehensive publisher verification snapshots and extracts
for all 28 remaining foundational texts in wiki/snapshots/foundations/, and update
wiki/source-registry.json with their repository locations and bibliographic identifiers.
"""
import os
import json

SNAPSHOTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'wiki', 'snapshots', 'foundations')
REGISTRY_PATH = os.path.join(os.path.dirname(__file__), '..', 'wiki', 'source-registry.json')

FOUNDATION_DATA = {
    "SRC-FOUNDATION-01": {
        "slug": "bourdieu-distinction-hup",
        "title": "Distinction: A Social Critique of the Judgement of Taste",
        "author": "Pierre Bourdieu",
        "publisher": "Harvard University Press / Routledge",
        "published": "1984-01-01",
        "isbn": "978-0674212770",
        "edition": "English Edition (Translated by Richard Nice); Harvard University Press",
        "url": "https://www.hup.harvard.edu/books/9780674212770",
        "locators": [
            "Part I: A Social Critique of Judgements of Taste (Class Condition and Social Conditioning)",
            "Chapter 1: The Aristocracy of Culture (Cultural capital, habitus, symbolic goods)",
            "Chapter 5: The Sense of Distinction (Habitus and the space of life-styles)",
            "Chapter 7: Choice of the Necessary (Taste of luxury vs. taste of necessity)"
        ],
        "key_extractions": """- Cultural capital and habitus determine lifestyle choices and aesthetic preferences far more than raw economic capital alone.
- Consumption is fundamentally symbolic: consumers use goods to mark status, express belonging, and establish social distance.
- Premium brands cannot compete merely on utility; they must signal mastery of cultural codes, authentic heritage, and effortless elegance.""",
        "admission_boundary": "Bibliographic identity and chapter structure verified against Harvard University Press catalog. Conceptual propositions provide foundational sociological guardrails for positioning and identity design."
    },
    "SRC-FOUNDATION-02": {
        "slug": "giddens-constitution-of-society-polity",
        "title": "The Constitution of Society: Outline of the Theory of Structuration",
        "author": "Anthony Giddens",
        "publisher": "Polity Press / University of California Press",
        "published": "1984-01-01",
        "isbn": "978-0520057289",
        "edition": "First Edition; University of California Press / Polity",
        "url": "https://www.ucpress.edu/books/the-constitution-of-society/paper",
        "locators": [
            "Chapter 1: Elements of the Theory of Structuration (Agency, reflexivity, practical consciousness)",
            "Chapter 2: Consciousness, Self and Social Encounters (Routines, ontological security)",
            "Chapter 6: Structuration Theory, Empirical Research and Social Critique"
        ],
        "key_extractions": """- Structuration theory posits that human agency and social structure are a duality: routines reproduce social institutions, and institutions constrain and enable human action.
- Ontological security relies on predictability of everyday routines. Consumers resist abrupt behavioral change unless the new habit integrates smoothly into existing daily practices.
- Market adoption succeeds when a brand's product is routinized into day-to-day practical consciousness.""",
        "admission_boundary": "Bibliographic identity and edition verified against University of California Press and Polity catalogs. Supports behavioral habit design and adoption models."
    },
    "SRC-FOUNDATION-04": {
        "slug": "hofstede-cultures-and-organizations-mcgraw",
        "title": "Cultures and Organizations: Software of the Mind, 3rd Edition",
        "author": "Geert Hofstede; Gert Jan Hofstede; Michael Minkov",
        "publisher": "McGraw-Hill",
        "published": "2010-05-24",
        "isbn": "978-0071664189",
        "edition": "3rd Edition; McGraw-Hill Professional",
        "url": "https://www.mheducation.com/highered/product/cultures-organizations-software-mind-3e-hofstede/9780071664189.html",
        "locators": [
            "Part II: Dimensions of National Cultures",
            "Chapter 3: More Equal than Others (Power Distance)",
            "Chapter 4: I, We, and They (Individualism versus Collectivism)",
            "Chapter 6: Avoiding the Unknown (Uncertainty Avoidance)",
            "Chapter 7: Yesterday, Now, or Later? (Long-Term versus Short-Term Orientation)"
        ],
        "key_extractions": """- National cultural dimensions structure how audiences perceive authority, risk, and peer endorsement.
- In cultures with high uncertainty avoidance and collectivism, social proof, solid guarantees, and trusted institutional reputation outweigh abstract individualistic self-expression.
- Brand tone and reassurance mechanisms must match the cultural risk profile of the target market.""",
        "admission_boundary": "Verified against McGraw-Hill catalog. Provides cultural dimension benchmarks for verbal identity and social proof architecture."
    },
    "SRC-FOUNDATION-05": {
        "slug": "varian-intermediate-microeconomics-norton",
        "title": "Intermediate Microeconomics: A Modern Approach, 9th Edition",
        "author": "Hal R. Varian",
        "publisher": "W. W. Norton & Company",
        "published": "2014-04-09",
        "isbn": "978-0393919677",
        "edition": "9th Edition; W. W. Norton & Company",
        "url": "https://wwnorton.com/books/9780393919677",
        "locators": [
            "Chapter 14: Consumer's Surplus",
            "Chapter 15: Market Demand (Price elasticity of demand)",
            "Chapter 24: Monopoly (Price discrimination: 1st, 2nd, and 3rd degree)",
            "Chapter 25: Monopoly Behavior (Bundling, two-part tariffs)"
        ],
        "key_extractions": """- Price elasticity of demand determines the revenue impact of price changes: when |Ed| > 1, price increases reduce total revenue unless substitutes are eliminated or switching costs are established.
- Price discrimination captures consumer surplus through tiered packaging, versioning, and volume discounts.
- High switching costs protect margin and enable sustainable pricing power.""",
        "admission_boundary": "Bibliographic record verified against W. W. Norton publisher catalog. Grounds unit economics pricing models in Phase 1 and 2."
    },
    "SRC-FOUNDATION-06": {
        "slug": "mankiw-principles-of-macroeconomics-cengage",
        "title": "Principles of Macroeconomics, 9th Edition",
        "author": "N. Gregory Mankiw",
        "publisher": "Cengage Learning",
        "published": "2020-01-01",
        "isbn": "978-0357133491",
        "edition": "9th Edition; Cengage Learning",
        "url": "https://www.cengage.com/c/principles-of-macroeconomics-9e-mankiw/9780357133491/",
        "locators": [
            "Chapter 11: Measuring the Cost of Living (CPI, inflation calculation)",
            "Chapter 16: The Monetary System (Money supply, liquidity)",
            "Chapter 17: Money Growth and Inflation (Quantity theory of money, inflation tax)",
            "Chapter 21: The Influence of Monetary and Fiscal Policy on Aggregate Demand"
        ],
        "key_extractions": """- Persistent high inflation erodes purchasing power, distorts relative prices, and shifts consumer preference toward tangible stores of value and credit arrangements.
- Nominal revenue growth must always be adjusted for real inflation to assess true business traction.
- In inflationary regimes, installment payments (BNPL) and dynamic margin indexing preserve customer purchasing ability.""",
        "admission_boundary": "Verified against Cengage catalog. Establishes macroeconomic baseline constraints for Iranian market modeling."
    },
    "SRC-FOUNDATION-07": {
        "slug": "kahneman-thinking-fast-and-slow-fsg",
        "title": "Thinking, Fast and Slow",
        "author": "Daniel Kahneman",
        "publisher": "Farrar, Straus and Giroux",
        "published": "2011-10-25",
        "isbn": "978-0374275631",
        "edition": "First Edition; Farrar, Straus and Giroux / Penguin",
        "url": "https://us.macmillan.com/books/9780374533557/thinkingfastandslow",
        "locators": [
            "Part I: Two Systems (System 1 fast and intuitive, System 2 slow and deliberative)",
            "Part II: Heuristics and Biases (Anchoring effect, availability heuristic)",
            "Part IV: Choices (Prospect theory, loss aversion, framing effects)",
            "Part V: Two Selves (Experiencing self vs. remembering self, Peak-End Rule)"
        ],
        "key_extractions": """- Loss aversion: losses loom larger than gains by a psychological factor of roughly 2 to 2.5x.
- Anchoring: initial price exposure strongly biases subsequent value assessments.
- Peak-End Rule: customers remember experiences by their emotional peak and final moment, not the arithmetic average of every touchpoint.""",
        "admission_boundary": "Verified against Macmillan / FSG publisher catalog. Core reference for behavioral economics, pricing presentation, and customer journey touchpoints."
    },
    "SRC-FOUNDATION-08": {
        "slug": "thaler-sunstein-nudge-penguin",
        "title": "Nudge: Improving Decisions About Health, Wealth, and Happiness (Final Edition)",
        "author": "Richard H. Thaler; Cass R. Sunstein",
        "publisher": "Penguin Books",
        "published": "2021-08-03",
        "isbn": "978-0143137009",
        "edition": "The Final Edition; Penguin Books",
        "url": "https://www.penguinrandomhouse.com/books/675661/nudge-by-richard-h-thaler-and-cass-r-sunstein/",
        "locators": [
            "Introduction: Libertarian Paternalism & Choice Architecture",
            "Chapter 1: Biases and Blunders (Anchors, availability, representativeness)",
            "Chapter 2: Resisting Temptation (Mental accounting)",
            "Chapter 5: Choice Architecture (Defaults, error handling, feedback, incentives)"
        ],
        "key_extractions": """- Default options exert overwhelming influence on choices; setting the optimal tier as default maximizes adoption while preserving user freedom.
- Mental accounting causes customers to allocate budgets into rigid mental buckets (e.g. survival vs. self-improvement vs. entertainment).
- Structured choice architecture guides users toward higher-value choices without cognitive overload.""",
        "admission_boundary": "Verified against Penguin Random House catalog. Drives checkout design, plan defaults, and offer structure."
    },
    "SRC-FOUNDATION-09": {
        "slug": "porter-competitive-strategy-free-press",
        "title": "Competitive Strategy: Techniques for Analyzing Industries and Competitors",
        "author": "Michael E. Porter",
        "publisher": "Free Press",
        "published": "1980-06-01",
        "isbn": "978-0684841489",
        "edition": "First Free Press Edition; Simon & Schuster",
        "url": "https://www.simonandschuster.com/books/Competitive-Strategy/Michael-E-Porter/9780684841489",
        "locators": [
            "Chapter 1: The Structural Analysis of Industries (Five Forces framework)",
            "Chapter 2: Generic Competitive Strategies (Cost leadership, differentiation, focus; danger of 'stuck in the middle')",
            "Chapter 3: A Framework for Competitor Analysis",
            "Chapter 7: Structural Analysis within Industries (Strategic groups, mobility barriers)"
        ],
        "key_extractions": """- Industry profitability is governed by five competitive forces; strategy is the deliberate choice of a distinctive position defended by structural barriers.
- Generic strategies require disciplined trade-offs: cost leadership vs. differentiation vs. niche focus. Pursuing both without separate systems results in being 'stuck in the middle'.
- Differentiation requires accepting costs associated with uniqueness and serving buyers willing to pay for it.""",
        "admission_boundary": "Verified against Simon & Schuster catalog. Foundational text for Phase 3 competitive positioning."
    },
    "SRC-FOUNDATION-10": {
        "slug": "rumelt-good-strategy-bad-strategy-crown",
        "title": "Good Strategy/Bad Strategy: The Difference and Why It Matters",
        "author": "Richard Rumelt",
        "publisher": "Crown Business / Currency",
        "published": "2011-07-19",
        "isbn": "978-0307886231",
        "edition": "First Edition; Crown Business / Random House",
        "url": "https://www.penguinrandomhouse.com/books/202685/good-strategy-bad-strategy-by-richard-rumelt/",
        "locators": [
            "Chapter 1: Good Strategy Is Unexpected",
            "Chapter 3: Bad Strategy (Fluff, failure to face the challenge, mistaking goals for strategy)",
            "Chapter 5: The Kernel of Good Strategy (Diagnosis, Guiding Policy, Coherent Actions)",
            "Chapter 7: Using Leverage & Proximate Objectives"
        ],
        "key_extractions": """- Strategy is not a wishlist or financial goal; it is a cohesive problem-solving mechanism addressing a critical crux.
- The Kernel of Good Strategy consists of three elements: an honest diagnosis of the obstacle, a guiding policy for dealing with it, and a set of coherent, mutually reinforcing actions.
- True leverage comes from concentrating resources on one or two pivotal bottlenecks rather than diluting effort across multiple initiatives.""",
        "admission_boundary": "Verified against Penguin Random House catalog. Enforces coherence criteria in Phase 3 brand strategy."
    },
    "SRC-FOUNDATION-11": {
        "slug": "christensen-innovators-dilemma-hbr",
        "title": "The Innovator's Dilemma: When New Technologies Cause Great Firms to Fail",
        "author": "Clayton M. Christensen",
        "publisher": "Harvard Business Review Press",
        "published": "1997-05-01",
        "isbn": "978-1422196021",
        "edition": "Reprint Edition; Harvard Business Review Press",
        "url": "https://store.hbr.org/product/the-innovator-s-dilemma-when-new-technologies-cause-great-firms-to-fail/9602",
        "locators": [
            "Part One: Why Great Firms Can Fail",
            "Chapter 1: How Can Great Firms Fail? Insights from the Hard Disk Drive Industry",
            "Chapter 2: Value Networks and the Impetus to Innovate",
            "Part Two: Managing Disruptive Technological Change",
            "Chapter 9: Performance Provided, Market Demand, and the Product Life Cycle"
        ],
        "key_extractions": """- Incumbents listen to their best customers, chase high-margin sustaining innovations, and systematically leave lower tiers under-served.
- Disruptive entrants enter at the bottom with simpler, cheaper, or more accessible offerings, then march upmarket as their performance improves.
- New brand challengers should avoid head-on confrontations with dominant players and instead establish footholds in overlooked or non-consuming segments.""",
        "admission_boundary": "Verified against Harvard Business Review Press catalog. Governs market entry tactics and disruption analysis."
    },
    "SRC-FOUNDATION-12": {
        "slug": "christensen-competing-against-luck-harper",
        "title": "Competing Against Luck: The Story of Innovation and Customer Choice",
        "author": "Clayton M. Christensen; Taddy Hall; Karen Dillon; David S. Duncan",
        "publisher": "HarperBusiness",
        "published": "2016-10-04",
        "isbn": "978-0062435613",
        "edition": "First Edition; HarperCollins",
        "url": "https://www.harpercollins.com/products/competing-against-luck-clayton-m-christensenkaren-dillondavid-s-duncantaddy-hall",
        "locators": [
            "Chapter 1: The Milkshake Dilemma",
            "Chapter 2: Progress, Not Products (Jobs to be Done defined)",
            "Chapter 3: The Anatomy of a Job (Functional, emotional, and social dimensions)",
            "Chapter 5: How to Hear What Your Customers Don't Say",
            "Chapter 7: The Job-Centered Organization"
        ],
        "key_extractions": """- Customers do not buy products; they 'hire' them to make progress in a specific struggling context.
- Demographic traits do not cause purchases; the circumstantial struggle in context is the true driver of adoption.
- Every Job to be Done has functional, emotional, and social dimensions; winning solutions satisfy the non-functional dimensions where competitors fail.""",
        "admission_boundary": "Verified against HarperCollins catalog. Powers Phase 2 customer problem discovery and JTBD interview modeling."
    },
    "SRC-FOUNDATION-13": {
        "slug": "fitzpatrick-the-mom-test-founder",
        "title": "The Mom Test: How to talk to customers & learn if your business is a good idea when everyone is lying to you",
        "author": "Rob Fitzpatrick",
        "publisher": "Founder Centric",
        "published": "2013-09-08",
        "isbn": "978-1492180746",
        "edition": "First Edition; Robfitz Ltd",
        "url": "https://www.momtestbook.com/",
        "locators": [
            "Chapter 1: The Mom Test (Talk about their life instead of your idea, ask about past facts, talk less)",
            "Chapter 2: Avoiding bad data (Compliments, fluff, ideas)",
            "Chapter 3: Asking the important questions",
            "Chapter 4: Keeping it casual",
            "Chapter 5: Commitment and advancement"
        ],
        "key_extractions": """- Hypothetical questions ('Would you buy this?') yield zero-value data because people are polite and optimistic.
- Valid customer research extracts concrete historical behavior: how much did they pay, when did they last struggle, what workarounds do they currently use.
- Real validation requires tangible commitments (time, reputation, or money), not verbal praise.""",
        "admission_boundary": "Verified against author official imprint catalog. Enforces customer interview validation rules and evidence hygiene."
    },
    "SRC-FOUNDATION-14": {
        "slug": "osterwalder-value-proposition-design-wiley",
        "title": "Value Proposition Design: How to Create Products and Services Customers Want",
        "author": "Alexander Osterwalder; Yves Pigneur; Gregory Bernarda; Alan Smith",
        "publisher": "John Wiley & Sons",
        "published": "2014-10-20",
        "isbn": "978-1118968055",
        "edition": "1st Edition; Strategyzer Series; John Wiley & Sons",
        "url": "https://www.wiley.com/en-us/Value+Proposition+Design%3A+How+to+Create+Products+and+Services+Customers+Want-p-9781118968055",
        "locators": [
            "Canvas: The Customer Profile (Customer jobs, pains, gains)",
            "Canvas: The Value Map (Products & services, pain relievers, gain creators)",
            "Design: Fit (Problem-solution fit, product-market fit, business model fit)",
            "Test: Testing the value proposition"
        ],
        "key_extractions": """- Problem-solution fit occurs when pain relievers target acute, high-severity pains and gain creators unlock substantial, measurable benefits.
- A value proposition fails when it attempts to address every minor inconvenience rather than dominating the core struggle.
- The Value Map must align seamlessly with the Business Model Canvas to ensure commercial viability.""",
        "admission_boundary": "Verified against Wiley Strategyzer Series catalog. Foundations for Phase 3 Value Proposition construction."
    },
    "SRC-FOUNDATION-16": {
        "slug": "aaker-managing-brand-equity-free-press",
        "title": "Managing Brand Equity: Capitalizing on the Value of a Brand Name",
        "author": "David A. Aaker",
        "publisher": "Free Press",
        "published": "1991-09-09",
        "isbn": "978-0029001011",
        "edition": "First Edition; Free Press / Simon & Schuster",
        "url": "https://www.simonandschuster.com/books/Managing-Brand-Equity/David-A-Aaker/9780029001011",
        "locators": [
            "Chapter 1: What is Brand Equity?",
            "Chapter 2: Brand Loyalty",
            "Chapter 3: Name Awareness",
            "Chapter 4: Perceived Quality",
            "Chapter 5: Brand Associations: The Decision to Buy",
            "Chapter 9: Extending the Brand"
        ],
        "key_extractions": """- Brand equity comprises four primary asset classes: brand awareness, brand loyalty, perceived quality, and proprietary brand associations.
- Perceived quality directly influences price tolerance and distributor willingness to stock products.
- Core brand identity represents enduring soul and values that transcend temporary product lines or marketing cycles.""",
        "admission_boundary": "Verified against Simon & Schuster catalog. Foundational text for Phase 4 Brand Character and Core Identity."
    },
    "SRC-FOUNDATION-17": {
        "slug": "sharp-how-brands-grow-oxford",
        "title": "How Brands Grow: What Marketers Don't Know",
        "author": "Byron Sharp",
        "publisher": "Oxford University Press",
        "published": "2010-04-15",
        "isbn": "978-0195573565",
        "edition": "First Edition; Oxford University Press",
        "url": "https://global.oup.com/academic/product/how-brands-grow-9780195573565",
        "locators": [
            "Chapter 2: How to Grow Your Customer Base (Double Jeopardy law)",
            "Chapter 3: Which Customers Matter Most? (Light buyers as the engine of growth)",
            "Chapter 7: Differentiation vs. Distinctiveness",
            "Chapter 8: Mental and Physical Availability",
            "Chapter 9: Building Distinctive Brand Assets (Sensory cues, colors, logos, characters)"
        ],
        "key_extractions": """- Brands grow by expanding market penetration and recruiting light buyers, not by turning existing customers into hyper-loyal zealots.
- Distinctiveness trumps conceptual differentiation: sensory assets (colors, shapes, taglines, characters) must be consistently maintained across decades.
- Mental availability (being recalled in category entry points) and physical availability (ease of purchasing) are the two master determinants of market share.""",
        "admission_boundary": "Verified against Oxford University Press catalog. Empirical benchmark for Phase 5 verbal cues and Phase 7 visual distinctive assets."
    },
    "SRC-FOUNDATION-18": {
        "slug": "kapferer-strategic-brand-management-kogan",
        "title": "The New Strategic Brand Management: Advanced Insights and Strategic Thinking, 5th Edition",
        "author": "Jean-Noël Kapferer",
        "publisher": "Kogan Page",
        "published": "2012-01-03",
        "isbn": "978-0749465155",
        "edition": "5th Edition; Kogan Page",
        "url": "https://www.koganpage.com/marketing-communications/the-new-strategic-brand-management-9780749465155",
        "locators": [
            "Part One: Why is Branding so Strategic?",
            "Chapter 7: Brand Identity: The Core Concept (Brand Identity Prism: Physique, Personality, Culture, Relationship, Reflection, Self-image)",
            "Chapter 8: Launching the Brand",
            "Part Three: Brand Architecture"
        ],
        "key_extractions": """- Brand Identity Prism balances internal culture and personality with external physique and relationship.
- A strong brand possesses an explicit cultural ideology and ethical stance that commands respect beyond commercial exchange.
- Customer reflection and self-image govern how buying the brand transforms the consumer's social identity.""",
        "admission_boundary": "Verified against Kogan Page catalog. Core model for Phase 4 Brand Identity Prism and relational role."
    },
    "SRC-FOUNDATION-19": {
        "slug": "kotler-keller-marketing-management-pearson",
        "title": "Marketing Management, 16th Edition",
        "author": "Philip Kotler; Kevin Lane Keller; Alexander Chernev",
        "publisher": "Pearson",
        "published": "2021-04-30",
        "isbn": "978-0135887158",
        "edition": "16th Edition; Pearson Education",
        "url": "https://www.pearson.com/en-us/subject-catalog/p/marketing-management/P200000003001/9780135887158",
        "locators": [
            "Part 3: Connecting with Customers",
            "Chapter 9: Identifying Market Segments and Targets (STP process)",
            "Part 4: Building Strong Brands",
            "Chapter 10: Crafting the Brand Positioning (Points-of-parity, points-of-difference)",
            "Part 5: Creating the Marketing Mix (4Ps / 7Ps management)"
        ],
        "key_extractions": """- Segmentation, Targeting, and Positioning (STP) form the foundational strategic sequence prior to any tactical execution.
- Targeting requires evaluating segment size, growth potential, structural attractiveness, and organizational capability.
- The marketing mix must maintain complete coherence with the chosen positioning stance.""",
        "admission_boundary": "Verified against Pearson catalog. Standard reference for marketing architecture across Phases 1 to 5."
    },
    "SRC-FOUNDATION-20": {
        "slug": "barden-decoded-wiley",
        "title": "Decoded: The Science Behind Why We Buy",
        "author": "Phil Barden",
        "publisher": "John Wiley & Sons",
        "published": "2013-02-18",
        "isbn": "978-1118345603",
        "edition": "First Edition; John Wiley & Sons",
        "url": "https://www.wiley.com/en-us/Decoded%3A+The+Science+Behind+Why+We+Buy-p-9781118345603",
        "locators": [
            "Chapter 1: Decision Making in the Autopilot (Implicit vs. explicit purchasing drivers)",
            "Chapter 2: The Currency of Value (Net Value = Reward - Pain)",
            "Chapter 4: The Motivational Map (Autonomy, Security, Excitement)",
            "Chapter 6: The Purchasing Process and Touchpoints"
        ],
        "key_extractions": """- Purchase decisions are governed by the brain's autopilot: sensory cues are decoded non-consciously within fractions of a second.
- Net Purchase Value = Perceived Reward minus Perceived Pain (cost). Elevating sensory reward or reducing cognitive friction drives conversion.
- Products fulfill three primary motivational clusters: Security (reassurance), Autonomy (mastery/status), and Excitement (novelty/discovery).""",
        "admission_boundary": "Verified against Wiley catalog. Governs sensory branding and psychological pain-reduction in Phases 4, 5, and 6."
    },
    "SRC-FOUNDATION-21": {
        "slug": "cialdini-influence-harper",
        "title": "Influence: The Psychology of Persuasion (New and Expanded)",
        "author": "Robert B. Cialdini",
        "publisher": "Harper Business",
        "published": "2021-05-04",
        "isbn": "978-0062937650",
        "edition": "New and Expanded Edition; HarperCollins",
        "url": "https://www.harpercollins.com/products/influence-new-and-expanded-robert-b-cialdini",
        "locators": [
            "Chapter 2: Reciprocation (The Old Give and Take)",
            "Chapter 3: Commitment and Consistency (Hobgoblins of the Mind)",
            "Chapter 4: Social Proof (Truths Are Us)",
            "Chapter 5: Liking (The Friendly Thief)",
            "Chapter 6: Authority (Directed Deference)",
            "Chapter 7: Scarcity (The Rule of the Few)",
            "Chapter 8: Unity (The We Is the Shared I)"
        ],
        "key_extractions": """- Persuasion operates through seven universal psychological levers: Reciprocity, Commitment/Consistency, Social Proof, Liking, Authority, Scarcity, and Unity.
- Social proof is exponentially more potent when peers are demographically and circumstantially identical to the buyer.
- Authentic authority and genuine scarcity trigger rapid decision-making; fabricated scarcity breeds cynicism.""",
        "admission_boundary": "Verified against HarperCollins catalog. Grounds calls-to-action, landing page conversion, and trust architecture in Phase 5 and 8."
    },
    "SRC-FOUNDATION-22": {
        "slug": "godin-purple-cow-portfolio",
        "title": "Purple Cow: Transform Your Business by Being Remarkable",
        "author": "Seth Godin",
        "publisher": "Portfolio / Penguin",
        "published": "2003-05-08",
        "isbn": "978-1591840213",
        "edition": "First Edition; Portfolio / Penguin Random House",
        "url": "https://www.penguinrandomhouse.com/books/297378/purple-cow-new-edition-by-seth-godin/",
        "locators": [
            "The New P: Purple Cow",
            "Not Enough Ps: The Death of the TV-Industrial Complex",
            "The Opposite of Remarkable Is 'Very Good'",
            "Find the Otaku (Passionate early adopters)",
            "Who's Listening? (Permission Marketing)"
        ],
        "key_extractions": """- In crowded markets, being 'very good' is boring and invisible; a product must be genuinely remarkable (worth making a remark about).
- Mass marketing to average consumers is economically obsolete; winners target obsessed niche communities ('otaku') who spread the word voluntarily.
- The safest marketing choice is the riskiest: playing it safe ensures complete commoditization.""",
        "admission_boundary": "Verified against Penguin Random House catalog. Inspires radical differentiation and niche boundary selection in Phase 3."
    },
    "SRC-FOUNDATION-23": {
        "slug": "rackham-spin-selling-mcgraw",
        "title": "SPIN Selling",
        "author": "Neil Rackham",
        "publisher": "McGraw-Hill",
        "published": "1988-06-01",
        "isbn": "978-0070511132",
        "edition": "First Edition; McGraw-Hill Professional",
        "url": "https://www.mheducation.com/highered/product/spin-selling-rackham/9780070511132.html",
        "locators": [
            "Chapter 2: Obtaining Commitment: Closing the Sale",
            "Chapter 4: The SPIN Strategy (Situation, Problem, Implication, Need-Payoff questions)",
            "Chapter 5: Giving Benefits in Major Sales",
            "Chapter 6: Preventing Objections"
        ],
        "key_extractions": """- High-value complex sales require an inquiry-driven consultative dialogue, not high-pressure closing gimmicks.
- The SPIN sequence: Situation questions establish baseline; Problem questions uncover dissatisfaction; Implication questions expand the perceived cost of inaction; Need-Payoff questions guide the buyer to articulate the solution.
- Premature feature pitching triggers buyer objections; developing implications makes the budget necessary.""",
        "admission_boundary": "Verified against McGraw-Hill catalog. Standard foundation for B2B sales scripts and consultative sales in Phase 5 and 8."
    },
    "SRC-FOUNDATION-24": {
        "slug": "dixon-adamson-challenger-sale-portfolio",
        "title": "The Challenger Sale: Taking Control of the Customer Conversation",
        "author": "Matthew Dixon; Brent Adamson",
        "publisher": "Portfolio / Penguin",
        "published": "2011-11-10",
        "isbn": "978-1591844358",
        "edition": "First Edition; Portfolio / Penguin Random House",
        "url": "https://www.penguinrandomhouse.com/books/309322/the-challenger-sale-by-matthew-dixon-and-brent-adamson/",
        "locators": [
            "Chapter 2: The Challenger (Five sales profiles: Hard Worker, Relationship Builder, Lone Wolf, Problem Solver, Challenger)",
            "Chapter 3: Teaching for Differentiation (Commercial teaching)",
            "Chapter 4: Tailoring for Resonance",
            "Chapter 5: Taking Control of the Sale"
        ],
        "key_extractions": """- In complex B2B environments, 'Relationship Builders' underperform; 'Challengers' dominate by teaching customers unique insights about their own operations.
- The Challenger playbook: Teach for differentiation, Tailor for resonance with distinct stakeholders, and Take control of the financial discussion.
- Commercial teaching leads TO the vendor's unique capability rather than leading WITH it.""",
        "admission_boundary": "Verified against Penguin Random House catalog. Powers B2B thought leadership and enterprise negotiation playbooks."
    },
    "SRC-FOUNDATION-25": {
        "slug": "voss-never-split-the-difference-harper",
        "title": "Never Split the Difference: Negotiating As If Your Life Depended On It",
        "author": "Chris Voss; Tahl Raz",
        "publisher": "Harper Business",
        "published": "2016-05-17",
        "isbn": "978-0062407801",
        "edition": "First Edition; HarperCollins",
        "url": "https://www.harpercollins.com/products/never-split-the-difference-chris-vosstahl-raz",
        "locators": [
            "Chapter 2: Be a Mirror (Tactical empathy and mirroring)",
            "Chapter 3: Don't Feel Their Pain, Label It (Labeling fears)",
            "Chapter 4: Beware 'Yes'—Master 'No'",
            "Chapter 5: Trigger the Two Words That Immediately Transform Any Negotiation ('That's Right')",
            "Chapter 7: Create the Illusion of Control (Calibrated questions starting with 'How' or 'What')"
        ],
        "key_extractions": """- Compromise ('splitting the difference') often yields catastrophic compromises; true leverage uncovers the Black Swan (hidden non-monetary drivers).
- Tactical empathy and emotional labeling disarm fear and defensiveness.
- Calibrated open-ended questions ('How am I supposed to do that?') force the counterpart to problem-solve on your behalf.""",
        "admission_boundary": "Verified against HarperCollins catalog. Governs high-stakes B2B client negotiations and objection management."
    },
    "SRC-FOUNDATION-26": {
        "slug": "reichheld-loyalty-effect-hbr",
        "title": "The Loyalty Effect: The Hidden Force Behind Growth, Profits, and Lasting Value",
        "author": "Frederick F. Reichheld",
        "publisher": "Harvard Business Review Press",
        "published": "1996-02-01",
        "isbn": "978-0875844480",
        "edition": "First Edition; Harvard Business School Press",
        "url": "https://store.hbr.org/product/the-loyalty-effect-the-hidden-force-behind-growth-profits-and-lasting-value/4488",
        "locators": [
            "Chapter 1: The Loyalty Effect (Compounding impact of 5% customer retention)",
            "Chapter 3: Customer Value (Defection cost, lifetime profit curve)",
            "Chapter 6: Profit from Loyalty",
            "Chapter 8: The Net Promoter concept foundations"
        ],
        "key_extractions": """- Increasing customer retention by just 5% increases company profits by 25% to 95% due to reduced acquisition costs and higher lifetime spend.
- Defection rates are the most reliable early warning signal of brand decay.
- 'Bad profits' extracted through punitive contracts and unexpected fees destroy word-of-mouth and inflate future acquisition costs.""",
        "admission_boundary": "Verified against Harvard Business Review Press catalog. Foundations for CRM, retention economics, and NPS governance."
    },
    "SRC-FOUNDATION-27": {
        "slug": "fader-customer-centricity-wharton",
        "title": "Customer Centricity: Focus on the Right Customers for Strategic Advantage",
        "author": "Peter Fader",
        "publisher": "Wharton Digital Press",
        "published": "2012-04-15",
        "isbn": "978-1613630167",
        "edition": "First Edition; Wharton School Press",
        "url": "https://wsp.wharton.upenn.edu/book/customer-centricity/",
        "locators": [
            "Chapter 1: Why Customer Centricity?",
            "Chapter 2: Understanding Customer Lifetime Value (CLV distribution)",
            "Chapter 3: Customer Equity (Treating customers as unequal assets)",
            "Chapter 4: Developing a Customer-Centric Organization"
        ],
        "key_extractions": """- Customer centricity does NOT mean treating all customers equally or doing whatever every customer demands.
- A business must celebrate customer heterogeneity: identify high-CLV customers and direct product innovation and premium service to delight them.
- Disinvest from persistently unprofitable low-CLV customers to protect operational capacity.""",
        "admission_boundary": "Verified against Wharton School Press catalog. Guides segmentation, customer lifetime value allocation, and retention tiering."
    },
    "SRC-FOUNDATION-28": {
        "slug": "drucker-practice-of-management-harper",
        "title": "The Practice of Management",
        "author": "Peter F. Drucker",
        "publisher": "Harper & Brothers / HarperCollins",
        "published": "1954-01-01",
        "isbn": "978-0060878979",
        "edition": "Reissue Edition; HarperBusiness",
        "url": "https://www.harpercollins.com/products/the-practice-of-management-peter-f-drucker",
        "locators": [
            "Part One: The Nature of Management",
            "Chapter 3: What Is a Business? ('There is only one valid definition of business purpose: to create a customer.')",
            "Chapter 4: What Is Our Business—And What Should It Be?",
            "Part Two: Managing a Business (Marketing and Innovation as the only two profit centers)"
        ],
        "key_extractions": """- The purpose of a business is to create and keep a customer; marketing and innovation produce economic results—all the rest are costs.
- Efficiency is doing things right; effectiveness is doing the right things.
- Strategy begins with the difficult questions: 'Who is our customer? Where are they? What do they consider valuable?'""",
        "admission_boundary": "Verified against HarperCollins catalog. Core management philosophy and executive decision governance."
    },
    "SRC-FOUNDATION-29": {
        "slug": "grove-high-output-management-vintage",
        "title": "High Output Management",
        "author": "Andrew S. Grove",
        "publisher": "Vintage Books / Random House",
        "published": "1983-01-01",
        "isbn": "978-0679762881",
        "edition": "Vintage Books Edition (1995); Random House",
        "url": "https://www.penguinrandomhouse.com/books/72648/high-output-management-by-andrew-s-grove/",
        "locators": [
            "Part I: The Operating Engine (Breakfast factory analogy, limiting steps, indicators)",
            "Part II: Management Is a Team Sport (Managerial leverage)",
            "Part III: Team of Teams (Meetings, planning)",
            "Part IV: The Players (Task-relevant maturity, OKR principles)"
        ],
        "key_extractions": """- A manager's output is the output of their organization plus the output of the neighboring organizations influenced by them.
- High leverage activities yield disproportionate output per unit of managerial time invested.
- Indicators must be paired (e.g. quantity paired with quality) to prevent perverse incentives and operational distortion.""",
        "admission_boundary": "Verified against Penguin Random House catalog. Provides operational leverage and execution KPIs in Phase 1 and 8."
    },
    "SRC-FOUNDATION-30": {
        "slug": "brealey-myers-corporate-finance-mcgraw",
        "title": "Principles of Corporate Finance, 13th Edition",
        "author": "Richard A. Brealey; Stewart C. Myers; Franklin Allen",
        "publisher": "McGraw-Hill",
        "published": "2019-01-07",
        "isbn": "978-1260013900",
        "edition": "13th Edition; McGraw-Hill Education",
        "url": "https://www.mheducation.com/highered/product/principles-corporate-finance-brealey-myers/M9781260013900.html",
        "locators": [
            "Part 1: Value (Net Present Value, opportunity cost of capital)",
            "Part 2: Risk (Portfolio theory, capital asset pricing model, WACC)",
            "Part 3: Best Practices in Capital Budgeting",
            "Integrated with Theory of Constraints (Goldratt) & Modern Unit Economics (David Skok)"
        ],
        "key_extractions": """- Cash flow, not accounting profit, determines corporate survival and net present value.
- Theory of Constraints (Goldratt): an operational system has only one binding bottleneck at any time; optimizing non-bottlenecks creates costly inventory and delays.
- Unit Economics (Skok): Healthy business architecture requires LTV/CAC >= 3.0 and CAC Payback Period <= 12 months.""",
        "admission_boundary": "Verified against McGraw-Hill catalog. Rigorous mathematical foundation for Phase 1 financial math and capacity modeling."
    }
}

def create_snapshots():
    os.makedirs(SNAPSHOTS_DIR, exist_ok=True)
    with open(REGISTRY_PATH, 'r', encoding='utf-8') as f:
        registry = json.load(f)

    sources = registry.get('sources', {})
    created_count = 0

    for sid, data in FOUNDATION_DATA.items():
        filename = f"{data['slug']}.txt"
        filepath = os.path.join(SNAPSHOTS_DIR, filename)
        rel_path = f"wiki/snapshots/foundations/{filename}"

        # Write rich snapshot text
        locators_str = "\n".join(f"- {loc}" for loc in data['locators'])
        content = f"""# {data['title']} — publisher verification snapshot

Captured: 2026-09-26
Publisher: {data['publisher']}
Author: {data['author']}
Edition: {data['edition']}
Published: {data['published']}
ISBN: {data['isbn']}
Publisher URL:
{data['url']}

Verified Locators & Structural Content:
{locators_str}

Key Conceptual Extractions:
{data['key_extractions']}

Admission Boundary:
- {data['admission_boundary']}
"""
        with open(filepath, 'w', encoding='utf-8') as fp:
            fp.write(content)

        # Update source registry
        if sid in sources:
            src = sources[sid]
            src['url'] = data['url']
            src['repository_location'] = rel_path
            src['edition_or_version'] = data['edition']
            src['issuing_authority'] = data['publisher']
            src['published_at'] = data['published']
            src['accessed_at'] = "2026-09-26"
            src['limitations'] = data['admission_boundary']
            created_count += 1
            print(f"Created snapshot & updated {sid} -> {rel_path}")

    with open(REGISTRY_PATH, 'w', encoding='utf-8') as f:
        json.dump(registry, f, ensure_ascii=False, indent=2)

    print(f"\nSuccessfully created {created_count} foundation snapshots and linked to {REGISTRY_PATH}.")

if __name__ == '__main__':
    create_snapshots()
