export const emailTemplates = [
  {
    id: 'e1',
    subject: 'Quick question about {{company}}',
    body: `Hi {{firstName}},

I came across {{company}} and was impressed by what you're building in the {{industry}} space.

We help companies like yours generate 30-50 qualified meetings per month through targeted cold outreach — without the overhead of building an in-house SDR team.

Would you be open to a quick 15-minute call this week?

Best,
{{senderName}}
Zoka Works`,
    personalization: 'Based on company industry and role',
    tone: 'professional',
  },
  {
    id: 'e2',
    subject: '{{firstName}}, noticed something about {{company}}',
    body: `Hey {{firstName}},

I was doing some research on {{industry}} companies and {{company}} caught my eye — love what you're doing with your growth strategy.

Quick question: are you currently running any cold outbound campaigns? If so, how's it going?

We've helped 50+ B2B companies scale their outbound pipeline predictably. Happy to share some insights over a quick call.

No pressure either way — just thought it could be valuable.

Cheers,
{{senderName}}
Zoka Works`,
    personalization: 'Research-based opener about company',
    tone: 'casual',
  },
  {
    id: 'e3',
    subject: '{{company}} + Zoka Works = 📈',
    body: `{{firstName}},

3 reasons {{company}} should consider outsourcing outbound:

1. You'll book 30+ qualified meetings in 30 days
2. No hiring. No training. No management overhead.
3. We guarantee results or you don't pay.

We've done this for 50+ {{industry}} companies. Want to see the playbook?

Let's do a quick 10-min call. No pitch, just value.

{{senderName}}
Zoka Works`,
    personalization: 'Value-prop focused with company merge',
    tone: 'bold',
  },
];

export const aiPersonalizationExamples = [
  {
    leadId: 1,
    firstName: 'Sarah',
    company: 'GrowthLoop',
    industry: 'B2B SaaS',
    title: 'CEO & Co-Founder',
    personalization: `I saw that GrowthLoop recently launched a new analytics feature — congrats on the traction! As a fellow SaaS builder, I know how important it is to keep the pipeline full while shipping product.`,
    subjectLine: 'Sarah, quick thought on GrowthLoop\'s outbound',
    emailBody: `Hi Sarah,

I saw that GrowthLoop recently launched a new analytics feature — congrats on the traction!

As you scale, one of the biggest challenges I've seen SaaS founders face is keeping the pipeline full while staying focused on product.

That's exactly what we solve at Zoka Works. We run end-to-end cold outreach campaigns that consistently book 30-50 meetings/month for B2B SaaS companies.

Would love to show you how it works — free to chat for 10 minutes this week?

Best,
Vishav
Zoka Works`,
  },
  {
    leadId: 2,
    firstName: 'Marcus',
    company: 'ScaleStack',
    industry: 'B2B SaaS',
    title: 'Head of Growth',
    personalization: `As Head of Growth at ScaleStack, you're probably always looking for new channels to drive qualified pipeline. Most growth leaders I talk to are maxed out on inbound and looking for predictable outbound systems.`,
    subjectLine: 'Marcus, a question about ScaleStack\'s pipeline',
    emailBody: `Hi Marcus,

As Head of Growth at ScaleStack, you're probably always looking for new channels to drive qualified pipeline.

Most growth leaders I talk to tell me the same thing: inbound is getting more expensive, and they need a predictable outbound system.

We build exactly that — managed cold outreach that books 30-50 qualified meetings monthly, without you lifting a finger.

Worth exploring? Happy to do a quick 10-minute walkthrough.

Cheers,
Vishav
Zoka Works`,
  },
  {
    leadId: 3,
    firstName: 'Emma',
    company: 'RevHub',
    industry: 'Agency',
    title: 'Founder',
    personalization: `As an agency founder, I'm sure you understand the value of consistent lead flow. RevHub's work in the agency space is impressive — I'd love to help you scale your own client acquisition.`,
    subjectLine: 'Emma, helping RevHub fill the pipeline',
    emailBody: `Hi Emma,

As an agency founder, you know better than anyone how important it is to have a predictable flow of new clients.

The irony? Most agencies are great at generating leads for their clients but struggle with their own pipeline.

At Zoka Works, we run managed outbound campaigns specifically for agencies. We've helped 15+ agencies book 20-40 qualified meetings per month.

Would love to share how — free for a quick call this week?

Best,
Vishav
Zoka Works`,
  },
];

export const toneOptions = [
  { id: 'professional', label: 'Professional', description: 'Polished, formal, trustworthy' },
  { id: 'casual', label: 'Casual', description: 'Friendly, conversational, approachable' },
  { id: 'bold', label: 'Bold', description: 'Direct, confident, numbers-driven' },
];
