import './globals.css';
import BackgroundAudio from '@/components/BackgroundAudio';
import SectorNavigator from '@/components/SectorNavigator';
import CitizenRegistry from '@/components/CitizenRegistry';
import CyberBuddy from '@/components/CyberBuddy';
import ParticleNetwork from '@/components/ParticleNetwork';
import BootSequence from '@/components/BootSequence';
import { AchievementProvider } from '@/components/AchievementSystem';

export const metadata = {
    title: 'G-Tech | Portal to the Future',
    description: 'Daily tech innovations and immersive experiments.',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/public/assets/logo.png',
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                {/* Ambient layer — behind everything */}
                <ParticleNetwork />
                {/* Boot sequence — plays once per session */}
                <BootSequence />
                <AchievementProvider>
                    <div className="hero-gradient" style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
                        <SectorNavigator />
                        <CitizenRegistry />
                        <CyberBuddy />
                        {children}
                        <BackgroundAudio />
                    </div>
                </AchievementProvider>
            </body>
        </html>
    );
}
