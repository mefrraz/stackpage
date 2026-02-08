"use client";

import React from 'react';
import { Button } from '@stackpage/ui';
import { Instagram, Twitter, Youtube, Linkedin, Github, Globe, Mail, Music, ExternalLink } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, any> = {
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    linkedin: Linkedin,
    github: Github,
    globe: Globe,
    mail: Mail,
    music: Music,
    link: ExternalLink,
};

export interface LinkItem {
    icon?: string;
    label: string;
    url: string;
}

export interface LinkButtonsBlockProps {
    links?: LinkItem[];
    style?: 'solid' | 'outline' | 'ghost';
    paddingTop?: string;
    paddingBottom?: string;
}

const defaultLinks: LinkItem[] = [
    { icon: 'instagram', label: 'Instagram', url: 'https://instagram.com' },
    { icon: 'twitter', label: 'Twitter', url: 'https://twitter.com' },
    { icon: 'youtube', label: 'YouTube', url: 'https://youtube.com' },
];

export const LinkButtonsBlock: React.FC<LinkButtonsBlockProps> = ({
    links = defaultLinks,
    style = 'outline',
    paddingTop = '20px',
    paddingBottom = '40px',
}) => {
    return (
        <section style={{ paddingTop, paddingBottom }} className="w-full px-6">
            <div className="max-w-md mx-auto flex flex-col gap-3">
                {links.map((link, idx) => {
                    const IconComponent = ICON_MAP[link.icon || 'link'] || ExternalLink;
                    return (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                                flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl font-medium text-base
                                transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                                ${style === 'solid'
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    : style === 'outline'
                                        ? 'border-2 border-border hover:border-primary hover:bg-primary/5'
                                        : 'hover:bg-muted/50'
                                }
                            `}
                        >
                            <IconComponent className="w-5 h-5" />
                            <span>{link.label}</span>
                        </a>
                    );
                })}
            </div>
        </section>
    );
};
