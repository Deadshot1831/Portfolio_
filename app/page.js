import VideoIntro from "@/components/VideoIntro/VideoIntro";
import About from "@/components/About/About";
import Experience from "@/components/Experience/Experience";
import Work from "@/components/Work/Work";
import Certificates from "@/components/Certificates/Certificates";
import Contact from "@/components/Contact/Contact";

export default function Home() {
  return (
    <main>
      <VideoIntro scrollTargetId="about" />
      {/* About scrolls up over the pinned hero — cinematic reveal */}
      <About />
      <Experience />
      <Work />
      <Certificates />
      <Contact />
    </main>
  );
}
