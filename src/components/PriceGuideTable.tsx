import { useState } from 'react';
import { formatBaht, type PlateId, type PlateTier } from '../data/plates';

interface PriceGuideTableProps {
  tiers: PlateTier[];
  prices: Record<PlateId, number>;
  counts: Record<PlateId, number>;
}

function PlateThumbnail({ tier }: { tier: PlateTier }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`w-9 h-9 rounded-xl border shrink-0 ${tier.swatchClass}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={tier.imageSrc}
      alt={tier.nameTh}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`w-10 h-10 rounded-xl object-cover shrink-0 ${tier.photoRingClass}`}
    />
  );
}

export function PriceGuideTable({ tiers, prices, counts }: PriceGuideTableProps) {
  return (
    <section
      id="price-guide"
      className="bg-white border border-[#E7E5E0] rounded-2xl p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#18181B]">
            ตารางเทียบราคาจานแต่ละสี (ก่อนและหลังค่าบริการ 10%)
          </h2>
          <p className="text-sm text-[#52525B] mt-1">
            เทียบราคาสุทธิต่อจานเมื่อรวมค่าบริการ 10% เพื่อช่วยตัดสินใจระหว่างเลือกจากสายพาน
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#E7E5E0] text-xs text-[#71717A] font-medium">
              <th className="py-3 pr-4 whitespace-nowrap">สีจาน</th>
              <th className="py-3 px-4 whitespace-nowrap">ระดับเมนูและตัวอย่าง</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">ราคาก่อน SC</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">ค่าบริการ 10%</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">ราคาหลัง SC 10%</th>
              <th className="py-3 pl-4 text-right whitespace-nowrap">ที่โต๊ะนับไว้</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F1EC]">
            {tiers.map((tier) => {
              const unitPrice = prices[tier.id];
              const scPerPlate = unitPrice * 0.1;
              const afterScPerPlate = unitPrice * 1.1;
              const qty = counts[tier.id] || 0;

              return (
                <tr key={tier.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <PlateThumbnail tier={tier} />
                      <div>
                        <div className="font-semibold text-[#18181B]">
                          {tier.nameTh}
                        </div>
                        <div className="text-xs text-[#71717A]">
                          {tier.subName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#52525B]">
                    <span className={`font-semibold ${tier.accentTextClass}`}>
                      {tier.tierLabel}
                    </span>
                    <span className="mx-1.5 text-[#A1A1AA]">·</span>
                    <span>{tier.examples}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono-num text-[#18181B] whitespace-nowrap">
                    ฿{formatBaht(unitPrice)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono-num text-[#71717A] whitespace-nowrap">
                    +฿{formatBaht(scPerPlate)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono-num font-bold text-[#DC3B2E] whitespace-nowrap">
                    ฿{formatBaht(afterScPerPlate)}
                  </td>
                  <td className="py-3.5 pl-4 text-right font-mono-num text-[#18181B] whitespace-nowrap">
                    {qty > 0 ? `${qty} จาน` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
