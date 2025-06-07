import Head from "next/head";
import { useRouter } from "next/router";
import { Home, Users } from "lucide-react";

export default function Landing() {
	const router = useRouter();

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 font-['Montserrat',sans-serif]">
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
			<div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center">
				<img
					src="/logo.jpg"
					alt="Homiee Logo"
					className="w-16 h-16 mb-4 rounded-lg"
				/>
				<h1 className="text-3xl font-bold mb-2 text-gray-900">
					Welcome to Homiee
				</h1>
				<p className="text-gray-600 mb-8 text-center">
					What are you looking for?
				</p>
				<div className="flex gap-6">
					<button
						onClick={() => router.push("/flats")}
						className="flex flex-col items-center px-8 py-6 bg-[#49548a] hover:bg-blue-900 text-white rounded-xl shadow transition-colors"
					>
						<Home className="w-8 h-8 mb-2" />
						<span className="font-semibold text-lg">Find a Flat</span>
					</button>
					<button
						onClick={() => router.push("/flatmates")}
						className="flex flex-col items-center px-8 py-6 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl shadow "
					>
						<Users className="w-8 h-8 mb-2" />
						<span className="font-semibold text-lg">Find Flatmates</span>
					</button>
				</div>
			</div>
		</div>
	);
}
