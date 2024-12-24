export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="w-full max-w-2xl flex flex-col items-center justify-start space-y-4 px-4 py-0">
        <h1 className="text-3xl font-bold text-center mt-0 mb-4">
          Merry Christmas!
        </h1>
        <a 
          href="/MerryChristmas" 
          className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-xl font-semibold"
        >
          Start Hunt!
        </a>
        <div className="flex flex-col items-center mt-4">
          <img src="/MerryXmasScene.gif" alt="Merry Christmas Scene" className="max-w-full h-auto" />
        </div>
      </div>
    </main>
  );
}
