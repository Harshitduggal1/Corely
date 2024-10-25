export default function BgGradient({
  children,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 opacity-30"
          style={{ filter: 'blur(150px)' }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-300 to-teal-500 opacity-20"
          style={{ filter: 'blur(150px)' }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-tl from-yellow-400 via-orange-500 to-red-600 opacity-25"
          style={{ filter: 'blur(150px)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] rounded-full bg-gradient-conic from-blue-500 via-purple-500 to-pink-500 opacity-30 animate-spin-slow"
          style={{ filter: 'blur(200px)' }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
