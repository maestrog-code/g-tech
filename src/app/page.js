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
import CryptoTicker from '@/components/CryptoTicker';
import CommandTerminal from '@/components/CommandTerminal';
import GlobeViz from '@/components/GlobeViz';
import TechCountdown from '@/components/TechCountdown';
import DataStream from '@/components/DataStream';

export default function Home() {
    return (
        <main style={{ position: 'relative', zIndex: 1 }}>
            <CryptoTicker />
            <InnovationTicker />
            <HeroSection />
            <TechPulse />
            <TechTimeline />
            <GlobeViz />
            <TechChronicles />
            <LiveLab />
            <IdeaForge />
            <NeuralDecoder />
            <DataStream />
            <CyberVerse />
            <CommandTerminal />
            <TechCountdown />
            <CitizenIdentity />
            <TheCodex />
        </main>
    );
}

