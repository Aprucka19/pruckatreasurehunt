export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="w-full max-w-2xl flex flex-col items-center justify-start space-y-4 px-4 py-0">
        <h1 className="text-3xl font-bold text-center mt-0 mb-4">
          Merry Christmas!
        </h1>

        <div className="text-center mt-8 mb-4 space-y-4">
          <p>If you take a tumble on the snowy chutes,</p>
          <p>And find a broken ankle in your boots,</p>
          <p>Down below, there&apos;s a place to go,</p>
          <p>Where mending hands will ease your woe.</p>
        </div>

        <div className="flex flex-col items-center mt-4">
          <img src="/MerryXmasScene.gif" alt="Merry Christmas Scene" className="max-w-full h-auto" />
        </div>
      </div>
    </main>
  );
}
