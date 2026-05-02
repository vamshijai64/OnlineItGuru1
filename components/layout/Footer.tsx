"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useHomeStore } from "@/store/homeStore";

export default function Footer() {
    const fetchPublicPages = useHomeStore((s) => s.fetchPublicPages);
    const publicPages = useHomeStore((s) => s.publicPages);

    useEffect(() => {
        if (publicPages.length === 0) {
            fetchPublicPages();
        }
    }, []);

    const legalSlugs = ['refund-policy', 'reschedule-policy', 'disclaimer', 'privacy-policy', 'terms-of-use'];
    const legalPages = publicPages.filter(p => legalSlugs.includes(p.slug));
    const quickPages = publicPages.filter(p => !legalSlugs.includes(p.slug));
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand & Description */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-bold text-white font-outfit tracking-tight">
                                ONLINE<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">ITGURU</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Empowering the next generation of tech leaders with industry-aligned training, expert mentorship, and guaranteed placement support.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink href="#" icon={Facebook} />
                            <SocialLink href="#" icon={Twitter} />
                            <SocialLink href="#" icon={Instagram} />
                            <SocialLink href="#" icon={Linkedin} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold font-outfit text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-sm">
                            <FooterLink href="/courses">All Courses</FooterLink>
                            <FooterLink href="/blog">Success Stories</FooterLink>
                            {quickPages.map(page => (
                                <FooterLink key={page.id} href={`/p/${page.slug}`}>{page.title}</FooterLink>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold font-outfit text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span>123 Tech Park, Innovation Street,<br />Hyderbad, India 560100</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span>admissions@onlineitguru.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold font-outfit text-lg mb-6">Stay Updated</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Subscribe to our newsletter for the latest tech trends and career tips.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-purple-500"
                            />
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full border border-white/10 shadow-lg shadow-purple-500/10">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} ONLINEITGURU. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        {legalPages.map(page => (
                            <Link key={page.id} href={`/p/${page.slug}`} className="hover:text-white transition-colors">
                                {page.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-600 hover:text-white transition-all duration-300"
        >
            <Icon className="w-5 h-5" />
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="hover:text-indigo-400 transition-colors inline-block">
                {children}
            </Link>
        </li>
    );
}
