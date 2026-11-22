import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatBaht, type ExtraMenuItem } from '../data/plates';

interface ExtraItemsSectionProps {
  extras: ExtraMenuItem[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onAddCustom: (name: string, price: number) => void;
  onRemoveCustom: (id: string) => void;
}

export function ExtraItemsSection({
  extras,
  onIncrement,
  onDecrement,
  onAddCustom,
  onRemoveCustom,
}: ExtraItemsSectionProps) {
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customName.trim();
    const parsedPrice = Number(customPrice);

    if (!trimmed) {
      setError('กรุณาระบุชื่อเมนูหรือรายการ');
      return;
    }
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('กรุณาระบุราคาที่มากกว่า 0 บาท');
      return;
    }

    onAddCustom(trimmed, parsedPrice);
    setCustomName('');
    setCustomPrice('');
    setError('');
  };

  return (
    <section
      id="extra-items"
      className="bg-white border border-[#E6E2D8] rounded-2xl p-5 sm:p-6 space-y-5"
    >
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[#18181B]">
          เครื่องดื่ม ของหวาน และรายการเพิ่มเติม
        </h2>
        <p className="text-xs sm:text-sm text-[#52525B] mt-0.5">
          รายการนอกสายพาน เช่น ชาเขียวรีฟิล หรือของทานเล่นที่สั่งเพิ่ม (คิดรวมค่าบริการ 10% ด้วย)
        </p>
      </div>

      <div className="divide-y divide-[#F0EDE6]">
        {extras.map((item) => {
          const isCustom = item.id.startsWith('custom-');
          return (
            <div
              key={item.id}
              className="py-3 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-[#18181B] truncate">
                  {item.name}
                </div>
                <div className="text-xs font-mono-num text-[#71717A] mt-0.5">
                  ฿{formatBaht(item.price)} / รายการ
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => onRemoveCustom(item.id)}
                    aria-label={`ลบรายการ ${item.name}`}
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#71717A] hover:text-[#C23B2B] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-center gap-1 bg-[#F6F4EF] p-1 rounded-xl border border-[#E6E2D8]">
                  <button
                    type="button"
                    onClick={() => onDecrement(item.id)}
                    disabled={item.qty === 0}
                    aria-label={`ลด ${item.name}`}
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-white border border-[#E6E2D8] text-[#18181B] hover:bg-[#FAF9F6] disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="font-mono-num text-sm font-semibold min-w-[32px] text-center">
                    {item.qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => onIncrement(item.id)}
                    aria-label={`เพิ่ม ${item.name}`}
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-[#18181B] text-white hover:bg-[#27272A] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom item quick-add form */}
      <form
        onSubmit={handleAdd}
        className="pt-4 border-t border-[#EFECE4] space-y-2.5"
      >
        <div className="text-xs font-medium text-[#52525B]">
          เพิ่มรายการกำหนดราคาเอง
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="ชื่อเมนู เช่น ซาชิมิรวม, น้ำอัดลม"
            className="flex-1 min-h-[44px] px-3.5 rounded-xl border border-[#D6D1C7] bg-[#F6F4EF] text-sm text-[#18181B] placeholder:text-[#71717A] focus:outline-none focus:bg-white focus:border-[#C23B2B]"
          />
          <input
            type="number"
            min={1}
            step={1}
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            placeholder="ราคา (บาท)"
            className="w-full sm:w-32 min-h-[44px] px-3.5 rounded-xl border border-[#D6D1C7] bg-[#F6F4EF] font-mono-num text-sm text-[#18181B] placeholder:text-[#71717A] focus:outline-none focus:bg-white focus:border-[#C23B2B]"
          />
          <button
            type="submit"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#18181B] text-white text-sm font-medium hover:bg-[#27272A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            เพิ่มรายการ
          </button>
        </div>
        {error && (
          <p className="text-xs text-[#C23B2B]" role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
