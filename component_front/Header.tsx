const tiles = [
  { char: 'C', cls: 'bg-red-500 rotate-6' },
  { char: 'S', cls: 'bg-green-600 -rotate-6' },
  { char: 'I', cls: 'bg-blue-600 rotate-3' },
  { char: '2', cls: 'bg-sky-400 -rotate-3' },
  { char: '0', cls: 'bg-yellow-400 rotate-6' },
  { char: '5', cls: 'bg-slate-500 -rotate-6' },
]

export default function Header() {
  return (
    <header className="pt-8 text-center">
      <div className="flex justify-center gap-2.5 sm:gap-3">
        {tiles.map((tile) => (
          <span
            key={tile.char}
            className={`grid h-11 w-9 place-items-center rounded-lg text-2xl font-bold text-white shadow-md sm:h-14 sm:w-12 sm:text-3xl ${tile.cls}`}
          >
            {tile.char}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs font-semibold tracking-[0.3em] text-slate-500 sm:text-sm">
        FRONT END SOFTWARE DEVELOPMENT
      </p>
    </header>
  )
}