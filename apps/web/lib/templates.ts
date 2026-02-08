import { Block } from "@stackpage/blocks";

export type SiteModel = 'portfolio' | 'saas' | 'blog' | 'bio';

export interface Template {
    id: SiteModel;
    name: string;
    description: string;
    thumbnail: string; // CSS class or Emoji for now
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
                    title: `Olá, sou o ${siteName}`,
                    subtitle: "Creative Director & Designer based in Lisbon.",
                    paddingTop: "80px",
                    paddingBottom: "40px"
                }
            },
            {
                id: 'text-1',
                type: 'text',
                props: {
                    content: "Selected Works",
                    align: "center",
                    paddingBottom: "20px"
                }
            },
            {
                id: 'grid-1',
                type: 'post-grid',
                props: {
                    limit: 6,
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
                    ctaText: "Get Started",
                    ctaLink: "/signup",
                    paddingTop: "100px",
                    paddingBottom: "80px"
                }
            },
            {
                id: 'text-1',
                type: 'text',
                props: {
                    content: "Why Choose Us?",
                    align: "center",
                    paddingTop: "40px",
                    paddingBottom: "20px"
                }
            },
            {
                id: 'features-1', // Placeholder using Text for now, later custom block
                type: 'text',
                props: {
                    content: "Feature 1: Blazing Fast\nFeature 2: Secure by Default\nFeature 3: 24/7 Support",
                    align: "center",
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
                    paddingBottom: "60px"
                }
            },
            {
                id: 'grid-1',
                type: 'post-grid',
                props: {
                    limit: 10,
                    paddingTop: "20px"
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
                    subtitle: "@username",
                    paddingTop: "40px",
                    paddingBottom: "20px"
                }
            },
            {
                id: 'links-1',
                type: 'text',
                props: {
                    content: "👉 Instagram\n👉 Twitter\n👉 YouTube",
                    align: "center",
                    paddingBottom: "40px"
                }
            }
        ]
    }
};

export function getTemplateContent(model: SiteModel, siteName: string): Block[] {
    return TEMPLATES[model]?.blocks(siteName) || TEMPLATES.blog.blocks(siteName);
}
