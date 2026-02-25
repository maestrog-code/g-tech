import HeroSection from '@/components/HeroSection';
import TechChronicles from '@/components/TechChronicles';
import LiveLab from '@/components/LiveLab';
import InnovationTicker from '@/components/InnovationTicker';
import TheCodex from '@/components/TheCodex';
import CyberVerse from '@/components/CyberVerse';
import NeuralDecoder from '@/components/NeuralDecoder';
import CitizenIdentity from '@/components/CitizenIdentity';
import TechPulse from '@/components/TechPulse';
import IdeaForge from '@/components/IdeaForge';
import TechTimeline from '@/components/TechTimeline';

export default function Home() {
    return (
        <main style={{ position: 'relative', zIndex: 1 }}>
            <InnovationTicker />
            <HeroSection />
            <TechPulse />
            <TechTimeline />
            <TechChronicles />
            <LiveLab />
            <IdeaForge />
            <NeuralDecoder />
            <CyberVerse />
            <CitizenIdentity />
            <TheCodex />
        </main>
    );
}
