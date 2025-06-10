import Head from "next/head";
import { useRouter } from "next/router";
import { Home, Users } from "lucide-react";

export default function Landing() {
	const router = useRouter();

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 font-['Montserrat',sans-serif] px-4 sm:px-6">
			<Head>
				<title>Homiee - Find Flats & Flatmates</title>
				<link
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
				<style jsx global>{`
					html,
					body {
						font-family: "Montserrat", sans-serif;
					}
				`}</style>
			</Head>
			<div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 flex flex-col items-center w-full max-w-md sm:max-w-lg">
				<img
					src="/logo.jpg"
					alt="Homiee Logo"
					className="w-14 h-14 sm:w-16 sm:h-16 mb-4 rounded-lg"
				/>
				<h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 text-center">
					Welcome to Homiee
				</h1>
				<p className="text-gray-600 mb-6 sm:mb-8 text-center text-sm sm:text-base">
					What are you looking for?
				</p>
				<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
					<button
						onClick={() => router.push("/flats")}
						className="flex flex-col items-center px-6 py-4 sm:px-8 sm:py-6 bg-[#49548a] hover:bg-blue-900 text-white rounded-xl shadow transition-colors flex-1"
					>
						<Home className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
						<span className="font-semibold text-base sm:text-lg">
							Find a Flat
						</span>
					</button>
					<button
						onClick={() => router.push("/flatmates")}
						className="flex flex-col items-center px-6 py-4 sm:px-8 sm:py-6 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl shadow transition-colors flex-1"
					>
						<Users className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
						<span className="font-semibold text-base sm:text-lg">
							Find Flatmates
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}
