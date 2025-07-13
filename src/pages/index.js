import Head from "next/head";
import { useSmoothScroll } from "../lib/smoothScroll";
import {
	Navbar,
	HeroSection,
	HowItWorksSection,
	FeaturesSection,
	EventsSection,
	CTASection,
	Footer,
	LoginModal,
} from "../components";

export default function Landing() {
	const { scrollToSection } = useSmoothScroll();

	return (
		<div className="relative flex size-full min-h-screen flex-col bg-[#fcfaf8] group/design-root font-body">
			<Head>
				<title>Homiee - Find Your Place in the City</title>
			</Head>

			<Navbar scrollToSection={scrollToSection} />

			{/* Main Content */}
			<div className="px-10 lg:px-40 flex flex-1 justify-center py-5 pt-20">
				<div className="layout-content-container flex flex-col flex-1">
					<HeroSection />
					<HowItWorksSection />
					<FeaturesSection />
					<EventsSection />
					<CTASection />
				</div>
			</div>

			<Footer />

			{/* Modals */}
			<LoginModal />
		</div>
	);
}




