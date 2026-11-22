import type { PlateId, PlateTier } from '../data/plates';

interface SushiPlateArtworkProps {
  tier: PlateTier;
  size?: number;
}

export function SushiPlateArtwork({ tier, size = 64 }: SushiPlateArtworkProps) {
  const isBlack = tier.id === 'black';
  const isWhite = tier.id === 'white';
  const isMetallic = tier.id === 'silver' || tier.id === 'gold';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0 select-none drop-shadow-[0_2px_4px_rgba(24,24,27,0.10)]"
    >
      <defs>
        <linearGradient id={`rim-${tier.id}`} x1="10" y1="8" x2="70" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={tier.rimHex} />
          <stop offset="52%" stopColor={isMetallic ? '#FFFFFF' : tier.rimHex} stopOpacity={isMetallic ? '0.65' : '1'} />
          <stop offset="100%" stopColor={tier.rimAccentHex} />
        </linearGradient>
        <radialGradient id={`well-${tier.id}`} cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor={isBlack ? '#2D2D32' : '#FFFFFF'} />
          <stop offset="100%" stopColor={tier.innerHex} />
        </radialGradient>
      </defs>

      {/* Outer rim base */}
      <circle cx="40" cy="40" r="36" fill={tier.rimHex} stroke={tier.rimAccentHex} strokeWidth="1.5" />

      {/* Glaze / metallic sheen overlay on rim */}
      {isMetallic && (
        <circle cx="40" cy="40" r="35.2" fill={`url(#rim-${tier.id})`} opacity="0.45" />
      )}

      {/* Subtle traditional Kaiten-zushi concentric rim grooves */}
      <circle
        cx="40"
        cy="40"
        r="31"
        stroke={isWhite ? '#DFDBD2' : isBlack ? '#3F3F46' : '#FFFFFF'}
        strokeOpacity={isWhite ? 1 : isBlack ? 0.7 : 0.35}
        strokeWidth="1"
        strokeDasharray={tier.id === 'gold' || tier.id === 'black' ? '4 2.5' : undefined}
      />

      {/* Inner porcelain/lacquer well */}
      <circle
        cx="40"
        cy="40"
        r="24"
        fill={`url(#well-${tier.id})`}
        stroke={isBlack ? '#D4A024' : isWhite ? '#E5E1D8' : tier.rimAccentHex}
        strokeWidth={isBlack ? '1.25' : '1'}
        strokeOpacity={isBlack ? 0.65 : 0.45}
      />

      {/* Subtle inner plate highlight */}
      <path
        d="M23 33C25.5 25.5 32.5 21 40 21C44.5 21 48.7 22.5 52 25"
        stroke={isBlack ? '#52525B' : '#FFFFFF'}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={isBlack ? 0.45 : 0.85}
      />
    </svg>
  );
}

interface PlateStackVisualProps {
  tiers: PlateTier[];
  counts: Record<PlateId, number>;
}

export function PlateStackVisual({ tiers, counts }: PlateStackVisualProps) {
  const totalPlates = Object.values(counts).reduce((sum, c) => sum + c, 0);

  if (totalPlates === 0) {
    return (
      <div className="flex items-center justify-center h-16 rounded-xl bg-[#F6F4EF] border border-[#E6E2D8] text-xs text-[#71717A]">
        ยังไม่มีจานในตั้ง — กด + ที่สีจานเพื่อเริ่มนับ
      </div>
    );
  }

  // Build visual plate slices grouped by tier, capped at 24 visible plates for clean visual density
  const slices: { tier: PlateTier; index: number }[] = [];
  for (const tier of tiers) {
    const count = counts[tier.id] || 0;
    for (let i = 0; i < count; i++) {
      slices.push({ tier, index: i });
    }
  }

  const maxVisible = 20;
  const visibleSlices = slices.slice(-maxVisible);
  const hiddenCount = Math.max(0, slices.length - maxVisible);

  return (
    <div className="rounded-xl bg-[#F6F4EF] border border-[#E6E2D8] px-4 py-3">
      <div className="flex items-center justify-between text-xs text-[#52525B] mb-2.5">
        <span>ตั้งจานบนโต๊ะ</span>
        <span className="font-mono-num font-medium text-[#18181B]">
          {totalPlates} จาน
        </span>
      </div>
      <div className="flex flex-col-reverse items-center justify-start gap-[2px] min-h-[44px] py-1">
        {visibleSlices.map((item, idx) => (
          <div
            key={`${item.tier.id}-${idx}`}
            className="w-28 h-[5px] rounded-full border transition-transform duration-150"
            style={{
              backgroundColor: item.tier.rimHex,
              borderColor: item.tier.rimAccentHex,
            }}
            title={item.tier.nameTh}
          />
        ))}
        {hiddenCount > 0 && (
          <span className="text-[11px] font-mono-num text-[#71717A] mb-1">
            +{hiddenCount} จานด้านล่าง
          </span>
        )}
      </div>
    </div>
  );
}
