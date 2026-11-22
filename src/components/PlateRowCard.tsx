import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { formatBaht, type PlateId, type PlateTier } from '../data/plates';
import { SushiPlateArtwork } from './SushiPlateArtwork';

interface PlateRowCardProps {
  tier: PlateTier;
  price: number;
  count: number;
  isEditingPrices: boolean;
  onIncrement: (id: PlateId) => void;
  onDecrement: (id: PlateId) => void;
  onPriceChange: (id: PlateId, newPrice: number) => void;
}

export function PlateRowCard({
  tier,
  price,
  count,
  isEditingPrices,
  onIncrement,
  onDecrement,
  onPriceChange,
}: PlateRowCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const lineSubtotal = count * price;
  const lineAfterSC = lineSubtotal * 1.1;
  const isActive = count > 0;

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-colors duration-150 ${
        isActive
          ? tier.activeSurfaceClass
          : 'bg-white border-[#E7E5E0] hover:border-[#CFCBC2]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Real Sushi Plate Photo + Description */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={() => onIncrement(tier.id)}
            aria-label={`เพิ่ม ${tier.nameTh} 1 จาน`}
            title={`กดที่รูปเพื่อเพิ่ม ${tier.nameTh} +1 จาน`}
            className={`relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FAF9F6] ${tier.photoRingClass} transition-transform duration-150 hover:scale-[1.03] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC3B2E] cursor-pointer`}
          >
            {!imgFailed ? (
              <img
                src={tier.imageSrc}
                alt={`${tier.nameTh} — ${tier.examples}`}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#FAF9F6]">
                <SushiPlateArtwork tier={tier} size={68} />
              </div>
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full border shrink-0 ${tier.swatchClass}`}
                aria-hidden="true"
              />
              <h3 className="text-base sm:text-lg font-bold text-[#18181B] leading-snug">
                {tier.nameTh}
              </h3>
              <span className="text-xs text-[#71717A] font-medium">
                {tier.subName}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm text-[#52525B] mt-1">
              <span className={`font-semibold ${tier.accentTextClass}`}>
                {tier.tierLabel}
              </span>
              <span aria-hidden="true" className="text-[#A1A1AA]">·</span>
              <span className="truncate max-w-[340px]">{tier.examples}</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-xs text-[#52525B]">
              {isEditingPrices ? (
                <label className="inline-flex items-center gap-1.5 text-xs text-[#18181B]">
                  <span>ราคาต่อจาน:</span>
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={price}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!Number.isNaN(val) && val >= 0) {
                        onPriceChange(tier.id, val);
                      }
                    }}
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-[#D4D0C7] bg-white font-mono-num text-sm text-[#18181B] focus:outline-none focus:border-[#DC3B2E]"
                  />
                  <span>บาท</span>
                </label>
              ) : (
                <>
                  <span className="font-mono-num font-semibold text-[#18181B]">
                    ฿{formatBaht(price)} / จาน
                  </span>
                  <span aria-hidden="true" className="text-[#A1A1AA]">·</span>
                  <span className="font-mono-num text-[#71717A]">
                    รวมค่าบริการ 10% = ฿{formatBaht(price * 1.1)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Stepper + Line Total */}
        <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EFECE5] shrink-0">
          <div className="text-left sm:text-right min-w-[96px]">
            <div className="font-mono-num text-base font-bold text-[#18181B]">
              ฿{formatBaht(lineSubtotal)}
            </div>
            <div className="font-mono-num text-[11px] text-[#71717A]">
              หลัง SC: ฿{formatBaht(lineAfterSC)}
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E5E2DA]">
            <button
              type="button"
              onClick={() => onDecrement(tier.id)}
              disabled={count === 0}
              aria-label={`ลด ${tier.nameTh}`}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[#FAF9F6] border border-[#E7E5E0] text-[#18181B] transition-all duration-150 hover:bg-[#F1EFEA] active:scale-[0.96] disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC3B2E] cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span
              className="font-mono-num text-base font-bold text-[#18181B] min-w-[38px] text-center select-none"
              aria-live="polite"
            >
              {count}
            </span>

            <button
              type="button"
              onClick={() => onIncrement(tier.id)}
              aria-label={`เพิ่ม ${tier.nameTh}`}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[#DC3B2E] text-white transition-all duration-150 hover:bg-[#C12F23] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
