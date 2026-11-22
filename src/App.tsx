import { RotateCcw, SlidersHorizontal, Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BillReceipt } from './components/BillReceipt';
import { ExtraItemsSection } from './components/ExtraItemsSection';
import { PlateRowCard } from './components/PlateRowCard';
import { PriceGuideTable } from './components/PriceGuideTable';
import {
  DEFAULT_PLATE_TIERS,
  HERO_IMAGE_SRC,
  PRESET_EXTRAS,
  formatBaht,
  type ExtraMenuItem,
  type PlateId,
} from './data/plates';

const STORAGE_KEY = 'kaiten_check_state_v1';

const INITIAL_COUNTS: Record<PlateId, number> = {
  white: 0,
  red: 0,
  silver: 0,
  gold: 0,
  black: 0,
};

const INITIAL_PRICES: Record<PlateId, number> = {
  white: 30,
  red: 40,
  silver: 60,
  gold: 80,
  black: 120,
};

function getInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        counts: { ...INITIAL_COUNTS, ...parsed.counts },
        prices: { ...INITIAL_PRICES, ...parsed.prices },
        extras: Array.isArray(parsed.extras)
          ? parsed.extras
          : PRESET_EXTRAS.map((item) => ({ ...item, qty: 0 })),
        splitCount: typeof parsed.splitCount === 'number' && parsed.splitCount >= 1 ? parsed.splitCount : 1,
        includeVat: Boolean(parsed.includeVat),
      };
    }
  } catch {
    // Fallback to fresh defaults if storage is unavailable
  }
  return {
    counts: INITIAL_COUNTS,
    prices: INITIAL_PRICES,
    extras: PRESET_EXTRAS.map((item) => ({ ...item, qty: 0 })),
    splitCount: 1,
    includeVat: false,
  };
}

export default function App() {
  const initial = getInitialState();

  const [counts, setCounts] = useState<Record<PlateId, number>>(initial.counts);
  const [prices, setPrices] = useState<Record<PlateId, number>>(initial.prices);
  const [extras, setExtras] = useState<ExtraMenuItem[]>(initial.extras);
  const [splitCount, setSplitCount] = useState<number>(initial.splitCount);
  const [includeVat, setIncludeVat] = useState<boolean>(initial.includeVat);
  const [isEditingPrices, setIsEditingPrices] = useState<boolean>(false);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ counts, prices, extras, splitCount, includeVat })
      );
    } catch {
      // Ignore storage write failures
    }
  }, [counts, prices, extras, splitCount, includeVat]);

  const handleIncrementPlate = (id: PlateId) => {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrementPlate = (id: PlateId) => {
    setCounts((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
  };

  const handlePriceChange = (id: PlateId, newPrice: number) => {
    setPrices((prev) => ({ ...prev, [id]: newPrice }));
  };

  const handleResetDefaultPrices = () => {
    setPrices(INITIAL_PRICES);
  };

  const handleIncrementExtra = (id: string) => {
    setExtras((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const handleDecrementExtra = (id: string) => {
    setExtras((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item
      )
    );
  };

  const handleAddCustomExtra = (name: string, price: number) => {
    const newItem: ExtraMenuItem = {
      id: `custom-${Date.now()}`,
      name,
      price,
      qty: 1,
    };
    setExtras((prev) => [...prev, newItem]);
  };

  const handleRemoveCustomExtra = (id: string) => {
    setExtras((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetBill = () => {
    setCounts(INITIAL_COUNTS);
    setExtras((prev) =>
      prev
        .filter((item) => !item.id.startsWith('custom-'))
        .map((item) => ({ ...item, qty: 0 }))
    );
    setSplitCount(1);
  };

  const totalPlates = Object.values(counts).reduce((sum, c) => sum + c, 0);
  const platesSubtotal = DEFAULT_PLATE_TIERS.reduce(
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

  const hasCustomPrices = DEFAULT_PLATE_TIERS.some(
    (tier) => prices[tier.id] !== tier.defaultPrice
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#18181B] pb-24 lg:pb-14">
      {/* Top Navigation Bar — 3-Zone Contract */}
      <header className="bg-white border-b border-[#E7E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#plate-counter"
            className="text-lg font-bold tracking-tight text-[#18181B] whitespace-nowrap shrink-0"
          >
            Kaiten Check
          </a>

          {/* Zone 2: Clean Single-Line Nav Links */}
          <nav
            aria-label="เมนูหลัก"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#52525B]"
          >
            <a
              href="#plate-counter"
              className="hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              นับจานตามสี
            </a>
            <a
              href="#extra-items"
              className="hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              เครื่องดื่มและเพิ่มเติม
            </a>
            <a
              href="#price-guide"
              className="hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              ตารางเทียบราคา
            </a>
            <a
              href="#bill-summary"
              className="hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              สรุปบิลและหารต่อคน
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsEditingPrices((prev) => !prev)}
              className={`inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isEditingPrices
                  ? 'bg-[#DC3B2E] text-white hover:bg-[#C12F23]'
                  : 'bg-[#18181B] text-white hover:bg-[#27272A]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{isEditingPrices ? 'บันทึกเสร็จสิ้น' : 'ปรับราคาจาน'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        {/* Hero Split Showcase + 4-Column KPI Strip Below */}
        <section className="space-y-5">
          <div className="bg-white border border-[#E7E5E0] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Clean Editorial Intro & Quick Color Legend */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#DC3B2E] tracking-wide">
                  คู่มือคำนวณค่าซูชิสายพาน
                </div>
                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18181B] tracking-tight leading-[1.2]"
                  style={{ textWrap: 'balance' }}
                >
                  คำนวณราคาซูชิสายพานตามสีจาน
                </h1>
                <p className="text-sm sm:text-base text-[#52525B] leading-relaxed max-w-xl">
                  เลือกนับจานสีขาว แดง เงิน ทอง และดำ พร้อมแสดงยอดรวมทั้งก่อนและหลังคิดค่าบริการ 10% แบบทันทีที่โต๊ะ
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#52525B]">
                  {DEFAULT_PLATE_TIERS.map((tier) => (
                    <div key={tier.id} className="inline-flex items-center gap-1.5">
                      <span
                        className={`w-3 h-3 rounded-full border shrink-0 ${tier.swatchClass}`}
                        aria-hidden="true"
                      />
                      <span className="font-medium text-[#18181B]">{tier.nameTh}</span>
                      <span className="font-mono-num text-[#71717A]">
                        ฿{formatBaht(prices[tier.id])}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="#plate-counter"
                    className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl bg-[#DC3B2E] text-white text-sm font-semibold hover:bg-[#C12F23] transition-colors whitespace-nowrap shrink-0"
                  >
                    เริ่มนับจานซูชิ
                  </a>
                  {(isEditingPrices || hasCustomPrices) && (
                    <button
                      type="button"
                      onClick={handleResetDefaultPrices}
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#D4D0C7] bg-[#FAF9F6] text-xs font-medium text-[#52525B] hover:text-[#18181B] hover:bg-[#F1EFEA] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>คืนค่าราคามาตรฐาน</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Bright Sunlit Kaiten-zushi Hero Photography */}
            <div className="lg:col-span-6 relative min-h-[220px] sm:min-h-[280px] lg:min-h-[320px] bg-[#F3F1EC]">
              {!heroImgFailed ? (
                <img
                  src={HERO_IMAGE_SRC}
                  alt="ซูชิสายพานหลากสีจานบนเคาน์เตอร์ไม้ญี่ปุ่น"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="w-full h-full lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-8 bg-gradient-to-br from-[#FFF5F4] to-[#FFFBEB] text-[#52525B]">
                  <Utensils className="w-8 h-8 text-[#DC3B2E]" />
                  <span className="text-sm font-medium">ซูชิสายพาน 5 สีจานมาตรฐาน</span>
                </div>
              )}
            </div>
          </div>

          {/* 4-column unboxed summary bar directly below hero split */}
          <div className="bg-[#EFECE4] border border-[#E7E5E0] rounded-2xl grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden">
            <div className="bg-white p-4 sm:px-5">
              <div className="text-xs text-[#71717A]">จำนวนจานที่นับ</div>
              <div className="font-mono-num text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
                {totalPlates} จาน
              </div>
            </div>

            <div className="bg-white p-4 sm:px-5">
              <div className="text-xs text-[#71717A]">ราคาก่อนค่าบริการ</div>
              <div className="font-mono-num text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
                ฿{formatBaht(subtotalBeforeSC)}
              </div>
            </div>

            <div className="bg-white p-4 sm:px-5">
              <div className="text-xs text-[#71717A]">ค่าบริการ 10%</div>
              <div className="font-mono-num text-xl sm:text-2xl font-bold text-[#52525B] mt-1">
                +฿{formatBaht(serviceCharge)}
              </div>
            </div>

            <div className="bg-white p-4 sm:px-5">
              <div className="text-xs font-semibold text-[#DC3B2E]">
                ราคาหลังคิดค่าบริการ 10%
              </div>
              <div className="font-mono-num text-xl sm:text-2xl font-bold text-[#DC3B2E] mt-1">
                ฿{formatBaht(totalAfterSC)}
              </div>
            </div>
          </div>
        </section>

        {/* Primary 2-Column Workspace */}
        <section
          id="plate-counter"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
        >
          {/* Left Column: 5 Color Plate Counter + Extras */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base sm:text-lg font-bold text-[#18181B]">
                  เลือกสีจานซูชิ (กดที่รูปจานหรือปุ่ม + เพื่อนับ)
                </h2>
                <span className="text-xs text-[#71717A]">5 ระดับราคา</span>
              </div>

              <div className="space-y-3">
                {DEFAULT_PLATE_TIERS.map((tier) => (
                  <PlateRowCard
                    key={tier.id}
                    tier={tier}
                    price={prices[tier.id]}
                    count={counts[tier.id] || 0}
                    isEditingPrices={isEditingPrices}
                    onIncrement={handleIncrementPlate}
                    onDecrement={handleDecrementPlate}
                    onPriceChange={handlePriceChange}
                  />
                ))}
              </div>
            </div>

            <ExtraItemsSection
              extras={extras}
              onIncrement={handleIncrementExtra}
              onDecrement={handleDecrementExtra}
              onAddCustom={handleAddCustomExtra}
              onRemoveCustom={handleRemoveCustomExtra}
            />
          </div>

          {/* Right Column: Sticky Live Receipt */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6">
            <BillReceipt
              tiers={DEFAULT_PLATE_TIERS}
              prices={prices}
              counts={counts}
              extras={extras}
              splitCount={splitCount}
              includeVat={includeVat}
              onSplitCountChange={setSplitCount}
              onToggleVat={() => setIncludeVat((prev) => !prev)}
              onReset={handleResetBill}
            />
          </div>
        </section>

        {/* Full-Width Reference Table */}
        <PriceGuideTable
          tiers={DEFAULT_PLATE_TIERS}
          prices={prices}
          counts={counts}
        />
      </main>

      {/* Mobile Compact Sticky Summary Bar (< 15% viewport height) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E7E5E0] px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-[#71717A] font-mono-num truncate">
              {totalPlates} จาน · ก่อน SC ฿{formatBaht(subtotalBeforeSC)}
            </div>
            <div className="text-sm font-bold text-[#DC3B2E] font-mono-num">
              หลัง SC 10%: ฿{formatBaht(totalAfterSC)}
            </div>
          </div>

          <a
            href="#bill-summary"
            className="min-h-[42px] px-4 py-2 rounded-xl bg-[#DC3B2E] text-white text-xs font-semibold flex items-center justify-center whitespace-nowrap shrink-0"
          >
            ดูใบสรุปยอด
          </a>
        </div>
      </div>
    </div>
  );
}
