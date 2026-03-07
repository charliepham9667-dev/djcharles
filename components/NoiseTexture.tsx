export default function NoiseTexture({ id }: { id: string }) {
  return (
    <div className="absolute inset-0 bg-[#111]">
      <svg
        className="w-full h-full pointer-events-none"
        style={{ opacity: 0.06 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </div>
  )
}
