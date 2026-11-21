export const phoneDisplay = '+91 99897 24320'
export const phoneTel = '+919989724320'
export const whatsapp = '919989724320'
export const instagram = 'https://www.instagram.com/importnow.in/'

export const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#journey', label: 'How it works' },
  { href: '#products', label: 'What we import' },
  { href: '#trips', label: 'China trips' },
  { href: '#contact', label: 'Contact' },
]

export const mobileLinks = [
  ...navLinks.slice(0, 4),
  { href: '#stories', label: 'Client stories' },
  { href: '#contact', label: 'Contact' },
]

export const footerLinks = [
  { href: '#services', label: 'Services' },
  { href: '#journey', label: 'How it works' },
  { href: '#products', label: 'What we import' },
  { href: '#trips', label: 'China trips' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

export const marqueeRoutes = [
  ['Yiwu', 'Adilabad'],
  ['Foshan', 'Hyderabad'],
  ['Shenzhen', 'Siddipet'],
  ['Guangzhou', 'Chennai'],
  ['Shanghai', 'Nhava Sheva'],
  ['Guzhen', 'Vizag'],
  ['Ningbo', 'Mumbai'],
] as const

export const services = [
  {
    num: '01',
    title: 'Product sourcing',
    body: 'We find verified manufacturers across Yiwu, Guangzhou, Shenzhen and Foshan, and negotiate prices on your behalf.',
  },
  {
    num: '02',
    title: 'Factory inspection',
    body: 'Our team visits the factory in person. We check licences, samples and production capacity before you pay.',
  },
  {
    num: '03',
    title: 'Quality control',
    body: 'Pre-shipment checks with photo and video reports, done before the container is sealed.',
  },
  {
    num: '04',
    title: 'Shipping & logistics',
    body: 'Full-container and shared-container sea freight from Chinese ports, plus air cargo for urgent orders.',
  },
  {
    num: '05',
    title: 'Customs clearance',
    body: 'Documentation, duties, GST and clearance at Indian ports. No surprises when the ship lands.',
  },
  {
    num: '06',
    title: 'Doorstep delivery',
    body: 'From the port straight to your shop, warehouse, villa or site, with the container unloaded on location.',
  },
]

export const steps = [
  ['Source the right factory', 'Tell us the product. We shortlist verified manufacturers and get you real prices, not middleman quotes.'],
  ['Inspect & approve samples', 'Our team visits the factory and checks samples. You approve over video call.'],
  ['Quality check & loading', 'Every carton is checked and counted before the container is loaded and sealed.'],
  ['Ocean freight', 'Your container sails from the Chinese port to India, and we track it the whole way.'],
  ['Customs clearance', 'Duties, GST and paperwork are handled at the Indian port, so the container is released quickly.'],
  ['Delivered to your door', 'The container reaches your shop, warehouse or site and is unloaded on location.'],
] as const

export const categories = [
  {
    hub: 'Foshan hub',
    name: 'Furniture & interiors',
    items: ['Complete home and villa furniture', 'Office desks and executive chairs', 'Banquet hall and hotel fit-outs'],
    note: 'Height-adjustable desk from ₹45,000 · MOQ 1',
    art: 'sofa',
  },
  {
    hub: 'Shenzhen hub',
    name: 'Electronics & tech',
    items: ['LED screens and digital signage', 'Mobile accessories in bulk', 'Power bank rental kiosks'],
    note: "Business ideas India doesn't have yet",
    art: 'phone',
  },
  {
    hub: 'Guangzhou hub',
    name: 'EV & automotive',
    items: ['Electric scooters as kits for assembly in India', 'Battery cells sourced separately', 'Car LED lights with your own brand'],
    note: 'Car LED private label · MOQ 500',
    art: 'scooter',
  },
  {
    hub: 'Guzhen hub',
    name: 'Lighting',
    items: ['Decorative and architectural lighting', 'Commercial LED fixtures', 'Custom designs for projects'],
    note: 'Direct from the lighting capital of China',
    art: 'bulb',
  },
  {
    hub: 'Yiwu hub',
    name: 'Supermarket & general goods',
    items: ['Complete store stock in one container', 'Home, kitchen, toys and gifts', 'Choose products over video call'],
    note: "World's largest small-goods market",
    art: 'cart',
  },
  {
    hub: 'Pan-China',
    name: 'Machinery & automation',
    items: ['Production and packaging machines', 'Smart vending and robotic kiosks', 'Spares and after-sales support'],
    note: 'Tell us the machine, we find the factory',
    art: 'gear',
  },
] as const

export const licenceRows = [
  ['Company', 'Shanghai Shengqiao Chain Trading Co., Ltd.'],
  ['Location', "Shanghai, People's Republic of China"],
  ['Scope', 'Supply chain, sourcing & international trade'],
  ['Serving', 'Importers across India'],
]

export const checks = [
  ['Registered business licence', ' issued in Shanghai, China'],
  ['Chinese company bank account', ', so payments to factories are safe and traceable'],
  ['Team on the ground', ' for factory visits, quality checks and market trips'],
  ['Indian founder on both sides', ': talk to us in Telugu, Hindi or English'],
]

export const tripPills = ['Guangzhou', 'Shenzhen', 'Yiwu', 'Foshan', 'Macau', 'Glass bridge']

export const tripIncludes = [
  'Visa guidance & invitation letter',
  'Hotels close to the fair',
  'Indian food daily, veg & non-veg',
  'Guides & translators',
  'Factory visits you choose',
  'Sightseeing between markets',
]

export const departures = [
  ['Spring', 'Canton Fair · April–May'],
  ['Autumn', 'Canton Fair · October–November'],
]

export const projects = [
  {
    place: 'Foshan → Villa',
    name: 'Complete villa furniture',
    desc: 'Sofas, dining sets, office furniture and pergolas, all in one container delivered to a luxury villa.',
    tags: ['Full container', 'Door delivery'],
    tone: 'ph1',
    art: 'sofa',
  },
  {
    place: 'Yiwu → Adilabad',
    name: 'Sagar Supermarket',
    desc: "Complete supermarket stock sourced from Yiwu over video calls and delivered to the client's warehouse.",
    tags: ['Retail', 'Video sourcing'],
    tone: 'ph2',
    art: 'cart',
  },
  {
    place: 'China → Convention',
    name: 'Sreeman Convention Centre',
    desc: 'Cots, beds, dining sets and office furniture for a convention venue, with better finish for the same budget.',
    tags: ['Hospitality', 'Bulk order'],
    tone: 'ph3',
    art: 'hall',
  },
  {
    place: 'China → Hyderabad',
    name: 'Smart office desks',
    desc: 'Motorised height-adjustable L-shaped desks, imported even as a single piece.',
    tags: ['MOQ 1', '~30 days'],
    tone: 'ph4',
    art: 'desk',
  },
] as const

export const testimonials = [
  {
    quote: 'I came to source LED screens and electronics. The Guangzhou and Shenzhen markets were easy to navigate, and hotels, food and travel were all taken care of.',
    name: 'Sai',
    role: 'Ad-tech startup · Siddipet',
    initials: 'S',
  },
  {
    quote: 'Twelve days covering the Canton Fair and factories of my choice. Visa, guidance, Indian food every day. It felt like a personal trip, not a business tour.',
    name: 'Mahender Reddy',
    role: 'Canton Fair trip client',
    initials: 'M',
  },
  {
    quote: 'We picked our products on video calls, and the container came straight from Yiwu to our warehouse. The whole process was hassle-free.',
    name: 'Sagar Supermarket',
    role: 'Retail · Adilabad',
    initials: 'SS',
  },
]

export const faqs = [
  ['Can I import just one piece?', 'Yes, for many products. Furniture like height-adjustable desks can be imported with a minimum order of one piece. Private-label products, such as car LED lights, usually start from around 500 units.'],
  ['How long does delivery take?', "Most sea shipments reach your door in about 30 to 40 days, depending on the product, the factory's production time and the destination port. Air cargo is faster for urgent orders."],
  ['Do you handle customs and GST?', 'Yes. We prepare the documentation and manage duties, GST and clearance at the Indian port, then deliver to your address.'],
  ['Do I need an Import Export Code (IEC)?', "For commercial imports, yes. If you don't have one yet, we'll guide you through getting it."],
  ['Can I visit the factories myself?', "Absolutely. Join one of our guided China business trips, or we can arrange visits to the factories you've shortlisted."],
  ["What's the best business to start by importing from China?", "It depends on your interests and budget. Popular choices with our clients include furniture, EV scooters, car accessories, lighting and supermarket goods. Talk to us and we'll suggest options that fit your market."],
] as const

export const quoteCategories = [
  'Furniture & interiors',
  'Electronics & tech',
  'EV & automotive',
  'Lighting',
  'Supermarket & general goods',
  'Machinery',
  'China business trip / Canton Fair',
  'Something else',
]

export const budgets = ['Under ₹1 lakh', '₹1–5 lakh', '₹5–25 lakh', '₹25 lakh+']
