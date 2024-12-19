import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {/* Add the Merry Christmas message */}
        <h1 className="text-3xl font-bold text-center">
          Merry Christmas! Scan the QR Codes to find your next clues!
        </h1>
        {/* Display the animated MerryXmasScene GIF */}
        <div className="flex flex-col items-center mt-8">
          <img src="/MerryXmasScene.gif" alt="Merry Christmas Scene" className="max-w-full h-auto" />
        </div>
      </div>
    </main>
  );
}
