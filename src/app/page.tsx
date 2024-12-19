export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="w-full max-w-2xl flex flex-col items-center justify-start space-y-4 px-4 py-0">
        {/* Add the Merry Christmas message */}
        <h1 className="text-3xl font-bold text-center mt-0 mb-0">
          Merry Christmas! Scan the QR Codes to find your next clues!
        </h1>
        {/* Display the animated MerryXmasScene GIF */}
        <div className="flex flex-col items-center mt-0 mb-0">
          <img src="/MerryXmasScene.gif" alt="Merry Christmas Scene" className="max-w-full h-auto" />
        </div>
      </div>
    </main>
  );
}
