import { Check, Copy, Minus, Plus, RotateCcw, Users } from 'lucide-react';
import { useState } from 'react';
import {
  formatBaht,
  type ExtraMenuItem,
  type PlateId,
  type PlateTier,
} from '../data/plates';
import { PlateStackVisual } from './SushiPlateArtwork';

interface BillReceiptProps {
  tiers: PlateTier[];
  prices: Record<PlateId, number>;
  counts: Record<PlateId, number>;
  extras: ExtraMenuItem[];
  splitCount: number;
  includeVat: boolean;
  onSplitCountChange: (count: number) => void;
  onToggleVat: () => void;
  onReset: () => void;
}

export function BillReceipt({
  tiers,
  prices,
  counts,
  extras,
  splitCount,
  includeVat,
  onSplitCountChange,
  onToggleVat,
  onReset,
}: BillReceiptProps) {
  const [copied, setCopied] = useState(false);

  const totalPlates = Object.values(counts).reduce((sum, c) => sum + c, 0);
  const platesSubtotal = tiers.reduce(
    (sum, tier) => sum + (counts[tier.id] || 0) * prices[tier.id],
    0
  );
  const extrasSubtotal = extras.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const subtotalBeforeSC = platesSubtotal + extrasSubtotal;
  const serviceCharge = subtotalBeforeSC * 0.1;
  const totalAfterSC = subtotalBeforeSC + serviceCharge;
  const vatAmount = includeVat ? totalAfterSC * 0.07 : 0;
  const grandTotal = totalAfterSC + vatAmount;

  const perPersonBeforeSC = splitCount > 0 ? subtotalBeforeSC / splitCount : subtotalBeforeSC;
  const perPersonAfterSC = splitCount > 0 ? totalAfterSC / splitCount : totalAfterSC;
  const perPersonGrand = splitCount > 0 ? grandTotal / splitCount : grandTotal;

  const activeTiers = tiers.filter((t) => (counts[t.id] || 0) > 0);
  const activeExtras = extras.filter((e) => e.qty > 0);
  const hasItems = totalPlates > 0 || activeExtras.length > 0;

  const handleCopySummary = async () => {
    const lines: string[] = ['สรุปค่าซูชิสายพาน (Kaiten Check)'];
    for (const tier of activeTiers) {
      const qty = counts[tier.id];
      const unitPrice = prices[tier.id];
      lines.push(`- ${tier.nameTh} (${qty} จาน × ฿${formatBaht(unitPrice)}) = ฿${formatBaht(qty * unitPrice)}`);
    }
    for (const item of activeExtras) {
      lines.push(`- ${item.name} (${item.qty} × ฿${formatBaht(item.price)}) = ฿${formatBaht(item.qty * item.price)}`);
    }
    lines.push('----------------');
    lines.push(`รวมทั้งหมด: ${totalPlates} จาน`);
    lines.push(`ราคาก่อนค่าบริการ: ฿${formatBaht(subtotalBeforeSC)}`);
    lines.push(`ค่าบริการ 10%: +฿${formatBaht(serviceCharge)}`);
    lines.push(`ราคาหลังคิดค่าบริการ 10%: ฿${formatBaht(totalAfterSC)}`);
    if (includeVat) {
      lines.push(`ภาษีมูลค่าเพิ่ม 7%: +฿${formatBaht(vatAmount)}`);
      lines.push(`ยอดสุทธิรวม VAT 7%: ฿${formatBaht(grandTotal)}`);
    }
    if (splitCount > 1) {
      lines.push(`หาร ${splitCount} คน: คนละ ฿${formatBaht(includeVat ? perPersonGrand : perPersonAfterSC)}`);
    }

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  return (
    <aside
      id="bill-summary"
      className="bg-white border border-[#E6E2D8] rounded-2xl p-5 sm:p-6 space-y-5"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#EFECE4] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#18181B]">
            ใบสรุปยอดค่าซูชิ
          </h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            แสดงยอดก่อนและหลังคิดค่าบริการ 10%
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasItems}
          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg text-xs font-medium text-[#52525B] bg-[#F6F4EF] hover:bg-[#ECE8DF] hover:text-[#18181B] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ล้างรายการ</span>
        </button>
      </div>

      {/* Visual plate stack */}
      <PlateStackVisual tiers={tiers} counts={counts} />

      {/* Itemized breakdown */}
      <div className="space-y-2.5 text-sm">
        <div className="text-xs font-medium text-[#71717A]">
          รายการที่นับได้
        </div>

        {!hasItems ? (
          <p className="text-sm text-[#71717A] py-2">
            ยังไม่มีรายการ กรุณาเลือกสีจานทางด้านซ้าย
          </p>
        ) : (
          <ul className="space-y-2 divide-y divide-[#F4F1EA]">
            {activeTiers.map((tier) => {
              const qty = counts[tier.id];
              const unitPrice = prices[tier.id];
              return (
                <li
                  key={tier.id}
                  className="flex items-center justify-between pt-2 first:pt-0 gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border shrink-0 ${tier.swatchClass}`}
                      aria-hidden="true"
                    />
                    <span className="text-[#18181B] truncate">{tier.nameTh}</span>
                    <span className="font-mono-num text-xs text-[#71717A] shrink-0">
                      × {qty}
                    </span>
                  </div>
                  <span className="font-mono-num font-medium text-[#18181B] shrink-0">
                    ฿{formatBaht(qty * unitPrice)}
                  </span>
                </li>
              );
            })}

            {activeExtras.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between pt-2 first:pt-0 gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-sm border border-[#D6D1C7] bg-[#F6F4EF] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-[#18181B] truncate">{item.name}</span>
                  <span className="font-mono-num text-xs text-[#71717A] shrink-0">
                    × {item.qty}
                  </span>
                </div>
                <span className="font-mono-num font-medium text-[#18181B] shrink-0">
                  ฿{formatBaht(item.qty * item.price)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Core Before & After 10% Service Charge Comparison */}
      <div className="rounded-xl bg-[#F6F4EF] border border-[#E6E2D8] p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#52525B]">จำนวนจานทั้งหมด</span>
          <span className="font-mono-num font-medium text-[#18181B]">
            {totalPlates} จาน
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#18181B] font-medium">
            ราคาก่อนคิดค่าบริการ
          </span>
          <span className="font-mono-num text-base font-semibold text-[#18181B]">
            ฿{formatBaht(subtotalBeforeSC)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#52525B]">ค่าบริการ 10% (Service Charge)</span>
          <span className="font-mono-num font-medium text-[#C23B2B]">
            +฿{formatBaht(serviceCharge)}
          </span>
        </div>

        <div className="border-t border-[#E5E2DA] pt-3 flex items-baseline justify-between gap-2">
          <div>
            <div className="text-sm font-bold text-[#18181B]">
              ราคาหลังคิดค่าบริการ 10%
            </div>
            <div className="text-xs text-[#71717A]">
              รวมค่าอาหารและ Service Charge 10%
            </div>
          </div>
          <div className="font-mono-num text-2xl font-bold text-[#DC3B2E] shrink-0">
            ฿{formatBaht(totalAfterSC)}
          </div>
        </div>

        {/* Optional VAT 7% toggle for restaurants that charge 10% SC + 7% VAT */}
        <div className="border-t border-[#E5E2DA] pt-3 space-y-2">
          <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
            <span className="text-xs text-[#52525B]">
              บวกภาษีมูลค่าเพิ่ม (VAT 7%) เพิ่มเติม
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={includeVat}
              onClick={onToggleVat}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC3B2E] cursor-pointer ${
                includeVat ? 'bg-[#18181B]' : 'bg-[#D6D1C7]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-150 ${
                  includeVat ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>

          {includeVat && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-[#52525B]">
                <span>VAT 7% (คำนวณจากยอดรวม SC)</span>
                <span className="font-mono-num">+฿{formatBaht(vatAmount)}</span>
              </div>
              <div className="flex items-baseline justify-between text-sm font-bold text-[#18181B]">
                <span>ยอดสุทธิรวม SC 10% + VAT 7%</span>
                <span className="font-mono-num text-lg">
                  ฿{formatBaht(grandTotal)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Split Bill per Person */}
      <div className="border border-[#E7E5E0] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[#18181B]">
            <Users className="w-4 h-4 text-[#52525B]" />
            <span>หารค่าอาหารต่อคน</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSplitCountChange(Math.max(1, splitCount - 1))}
              disabled={splitCount <= 1}
              aria-label="ลดจำนวนคน"
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg border border-[#E7E5E0] bg-[#FAF9F6] text-[#18181B] hover:bg-[#F1EFEA] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono-num text-sm font-semibold min-w-[46px] text-center">
              {splitCount} คน
            </span>
            <button
              type="button"
              onClick={() => onSplitCountChange(splitCount + 1)}
              aria-label="เพิ่มจำนวนคน"
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg border border-[#E7E5E0] bg-[#FAF9F6] text-[#18181B] hover:bg-[#F1EFEA] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
          <div className="rounded-lg bg-[#FAF9F6] px-3 py-2">
            <div className="text-[#71717A]">ก่อนค่าบริการ / คน</div>
            <div className="font-mono-num text-sm font-semibold text-[#18181B] mt-0.5">
              ฿{formatBaht(perPersonBeforeSC)}
            </div>
          </div>
          <div className="rounded-lg bg-[#FFF5F4] px-3 py-2">
            <div className="text-[#71717A]">
              {includeVat ? 'หลัง SC + VAT / คน' : 'หลัง SC 10% / คน'}
            </div>
            <div className="font-mono-num text-sm font-semibold text-[#DC3B2E] mt-0.5">
              ฿{formatBaht(includeVat ? perPersonGrand : perPersonAfterSC)}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action */}
      <button
        type="button"
        onClick={handleCopySummary}
        disabled={!hasItems}
        className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#DC3B2E] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 hover:bg-[#C12F23] active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B] cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>คัดลอกสรุปยอดแล้ว</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>คัดลอกสรุปยอดส่งให้เพื่อน</span>
          </>
        )}
      </button>
    </aside>
  );
}
