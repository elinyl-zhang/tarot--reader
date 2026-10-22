import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TarotSpread, TarotCard as TarotCardType } from "@/lib/tarot-data";
import TarotCard from "./TarotCard";

interface SpreadLayoutProps {
  spread: TarotSpread;
  cards: TarotCardType[];
  onCardClick?: (cardIndex: number) => void;
  onCardSelect?: (cardIndex: number) => void;
  revealedCards?: Set<number>;
  selectedCardIndex?: number | null;
  className?: string;
}

const BOARD_W = 896; // design width of the spread board (max-w-4xl)
const BOARD_H = 672; // 4:3

const SpreadLayout = ({
  spread,
  cards,
  onCardClick,
  onCardSelect,
  revealedCards = new Set(),
  selectedCardIndex = null,
  className,
}: SpreadLayoutProps) => {
  const boardWrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Scale the fixed-size board down to fit narrow viewports (mobile),
  // instead of letting card positions overflow and get clipped.
  useEffect(() => {
    const el = boardWrapRef.current;
    if (!el) return;
    const update = () =>
      setScale(Math.min(1, el.clientWidth / BOARD_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleCardClick = (index: number) => {
    // First reveal the card
    onCardClick?.(index);

    // Then select it if it's revealed or will be revealed
    if (revealedCards.has(index) || !revealedCards.has(index)) {
      onCardSelect?.(index);
    }
  };

  return (
    <div className={cn("relative w-full max-w-4xl mx-auto", className)}>
      {/* Spread Title */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-semibold tracking-wide text-gold-100 mb-2">
          {spread.name}
        </h2>
        <p className="font-display text-mystical-100 max-w-2xl mx-auto">
          {spread.description}
        </p>
      </div>

      {/* Spread Layout — fixed design size, scaled to fit viewport */}
      <div
        ref={boardWrapRef}
        className="relative w-full"
        style={{ height: BOARD_H * scale }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left bg-cosmic-900/35 rounded-2xl border border-gold-200/40"
          style={{
            width: BOARD_W,
            height: BOARD_H,
            transform: `scale(${scale})`,
          }}
        >
        {spread.positions.map((position, index) => {
          const card = cards[index];
          const isRevealed = revealedCards.has(index);
          const isSelected = selectedCardIndex === index;

          return (
            <div
              key={position.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: `translate(-50%, -50%) ${position.rotation ? `rotate(${position.rotation}deg)` : ""}`,
              }}
            >
              {card ? (
                <TarotCard
                  card={card}
                  isRevealed={isRevealed}
                  onFlip={() => handleCardClick(index)}
                  position={position.name}
                  isSelected={isSelected}
                  showMeaning={false} // Remove individual card meanings
                  size="md"
                  className={cn(
                    "animate-card-deal transition-all duration-200",
                    isSelected &&
                      isRevealed &&
                      "ring-2 ring-gold-300 ring-offset-2 ring-offset-mystical-900 rounded-lg",
                  )}
                  style={{ animationDelay: `${index * 0.2}s` }}
                />
              ) : (
                // Empty position placeholder
                <div className="w-32 h-48 border border-dashed border-gold-300/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="tarot-caps text-[10px] text-gold-300">
                      {position.name}
                    </div>
                    <div className="font-display text-[11px] text-mystical-200 mt-1 italic">
                      Click to draw
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>

      {/* Position Legend */}
      <Card className="mt-8 p-6 bg-cosmic-900/90 border-2 border-gold-200/70">
        <h3 className="tarot-caps text-xs text-gold-300 mb-4">
          Position Meanings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spread.positions.map((position, index) => {
            const isRevealed = revealedCards.has(index);
            const isSelected = selectedCardIndex === index;
            const card = cards[index];

            return (
              <div
                key={position.id}
                className={cn(
                  "p-3 rounded-lg border transition-all cursor-pointer",
                  isSelected
                    ? "bg-cosmic-700/60 border-gold-300 ring-1 ring-gold-300/50"
                    : isRevealed
                      ? "bg-cosmic-800/70 border-gold-500/40 hover:border-gold-300/70"
                      : "bg-cosmic-800/40 border-cosmic-500/40 hover:border-gold-500/50",
                )}
                onClick={() => {
                  if (isRevealed) {
                    onCardSelect?.(index);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 tarot-caps text-[10px]",
                      isSelected
                        ? "bg-gold-200 text-cosmic-900 border-gold-200"
                        : isRevealed
                          ? "bg-transparent text-gold-200 border-gold-400/60"
                          : "bg-transparent text-mystical-300 border-mystical-400/50",
                    )}
                  >
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <h4
                      className={cn(
                        "font-display font-medium text-sm mb-1 tracking-wide",
                        isSelected
                          ? "text-gold-200"
                          : isRevealed
                            ? "text-gold-100"
                            : "text-mystical-200",
                      )}
                    >
                      {position.name}
                    </h4>
                    <p
                      className={cn(
                        "text-xs font-display",
                        isSelected
                          ? "text-gold-300/90"
                          : isRevealed
                            ? "text-mystical-100"
                            : "text-mystical-300",
                      )}
                    >
                      {position.description}
                    </p>
                    {isRevealed && card && (
                      <div className="mt-2">
                        <Badge
                          variant="secondary"
                          className="text-xs font-display bg-cosmic-700 text-gold-200 border border-gold-500/40"
                        >
                          {card.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default SpreadLayout;
