import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="w-full max-w-2xl flex flex-col items-center justify-start space-y-4 px-4 py-0">
        <h1 className="text-3xl font-bold text-center mt-0 mb-4">
          Merry Christmas!
        </h1>

        <div className="text-center mt-8 mb-4 space-y-4">
          <p>
            Upon completing each challenge, a clue leading to a physical location is presented. 
            In the original treasure hunt, participants had to find a QR code at that location to access the next challenge. 
            To preserve the treasure hunt digitally, the link to the next challenge is now directly provided after solving each puzzle. 
            Good luck!
          </p>
        </div>

        <Link 
          href="/MerryChristmas"
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Begin Your Adventure
        </Link>

        <div className="flex flex-col items-center mt-4">
          <img src="/MerryXmasScene.gif" alt="Merry Christmas Scene" className="max-w-full h-auto" />
        </div>
      </div>
    </main>
  );
}
