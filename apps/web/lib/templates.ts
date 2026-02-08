import { Block } from "@stackpage/blocks";

export type SiteModel = 'portfolio' | 'saas' | 'blog' | 'bio';

export interface Template {
    id: SiteModel;
    name: string;
    description: string;
    thumbnail: string;
    blocks: (siteName: string) => Block[];
}

export const TEMPLATES: Record<SiteModel, Template> = {
    portfolio: {
        id: 'portfolio',
        name: 'Portfolio',
        description: 'Showcase your work with large images and a clean grid.',
        thumbnail: '🎨',
        blocks: (siteName) => [
            {
                id: 'hero-1',
                type: 'hero',
                props: {
                    title: siteName,
                    subtitle: "Creative Director & Designer based in Lisbon.",
                    paddingTop: "80px",
                    paddingBottom: "40px"
                }
            },
            {
                id: 'gallery-1',
                type: 'gallery-masonry',
                props: {
                    columns: 3,
                    paddingTop: "40px",
                    paddingBottom: "60px"
                }
            },
            {
                id: 'stats-1',
                type: 'stats-bar',
                props: {
                    stats: [
                        { value: '50+', label: 'Projects' },
                        { value: '12', label: 'Years' },
                        { value: '30+', label: 'Clients' },
                        { value: '5', label: 'Awards' }
                    ],
                    paddingBottom: "60px"
                }
            },
            {
                id: 'text-contact',
                type: 'text',
                props: {
                    content: "Available for freelance work. Let's create something amazing together.",
                    align: "center",
                    paddingBottom: "80px"
                }
            }
        ]
    },
    saas: {
        id: 'saas',
        name: 'Startup / SaaS',
        description: 'Convert visitors with a hero, features, and pricing.',
        thumbnail: '🚀',
        blocks: (siteName) => [
            {
                id: 'hero-1',
                type: 'hero',
                props: {
                    title: siteName,
                    subtitle: "The ultimate solution for your problems. Start for free today.",
                    ctaText: "Get Started →",
                    ctaLink: "#pricing",
                    paddingTop: "100px",
                    paddingBottom: "80px"
                }
            },
            {
                id: 'features-1',
                type: 'features-grid',
                props: {
                    title: "Why Choose Us?",
                    subtitle: "Everything you need to succeed",
                    columns: 3,
                    paddingTop: "60px",
                    paddingBottom: "60px"
                }
            },
            {
                id: 'stats-1',
                type: 'stats-bar',
                props: {
                    stats: [
                        { value: '10K+', label: 'Users' },
                        { value: '99.9%', label: 'Uptime' },
                        { value: '24/7', label: 'Support' },
                        { value: '50+', label: 'Countries' }
                    ],
                    paddingBottom: "60px"
                }
            },
            {
                id: 'testimonials-1',
                type: 'testimonials',
                props: {
                    title: "What Our Customers Say",
                    paddingBottom: "60px"
                }
            },
            {
                id: 'pricing-1',
                type: 'pricing-cards',
                props: {
                    title: "Simple, Transparent Pricing",
                    subtitle: "Choose the plan that works for you",
                    paddingBottom: "80px"
                }
            }
        ]
    },
    blog: {
        id: 'blog',
        name: 'Personal Blog',
        description: 'Focus on your writing and stories.',
        thumbnail: '✍️',
        blocks: (siteName) => [
            {
                id: 'hero-1',
                type: 'hero',
                props: {
                    title: siteName,
                    subtitle: "Thoughts on technology, design, and life.",
                    paddingTop: "60px",
                    paddingBottom: "40px"
                }
            },
            {
                id: 'grid-1',
                type: 'post-grid',
                props: {
                    limit: 10,
                    paddingTop: "20px",
                    paddingBottom: "80px"
                }
            }
        ]
    },
    bio: {
        id: 'bio',
        name: 'Link in Bio',
        description: 'Simple profile for your social media links.',
        thumbnail: '🔗',
        blocks: (siteName) => [
            {
                id: 'hero-1',
                type: 'hero',
                props: {
                    title: siteName,
                    subtitle: "@username • Creator & Designer",
                    paddingTop: "60px",
                    paddingBottom: "30px"
                }
            },
            {
                id: 'links-1',
                type: 'link-buttons',
                props: {
                    links: [
                        { icon: 'instagram', label: 'Instagram', url: 'https://instagram.com' },
                        { icon: 'twitter', label: 'Twitter / X', url: 'https://twitter.com' },
                        { icon: 'youtube', label: 'YouTube', url: 'https://youtube.com' },
                        { icon: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
                        { icon: 'mail', label: 'Email Me', url: 'mailto:hello@example.com' }
                    ],
                    style: 'outline',
                    paddingBottom: "40px"
                }
            },
            {
                id: 'text-footer',
                type: 'text',
                props: {
                    content: "© 2025 " + siteName,
                    align: "center",
                    paddingTop: "40px",
                    paddingBottom: "40px"
                }
            }
        ]
    }
};

export function getTemplateContent(model: SiteModel, siteName: string): Block[] {
    return TEMPLATES[model]?.blocks(siteName) || TEMPLATES.blog.blocks(siteName);
}

