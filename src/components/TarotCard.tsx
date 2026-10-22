import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TarotCard as TarotCardType } from "@/lib/tarot-data";
import { WIKIMEDIA_TAROT_IMAGES } from "@/lib/tarot-images";

interface TarotCardProps {
  card: TarotCardType;
  isRevealed?: boolean;
  showMeaning?: boolean;
  onFlip?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  position?: string;
  isSelected?: boolean;
  style?: React.CSSProperties;
}

/* ---- Celestial card-back motif, drawn in the vintage editorial style:
   ink face, cream double frame, purple crescent moon, brass stars ---- */
const CardBackMotif = () => (
  <svg
    viewBox="0 0 100 164"
    className="w-full h-full"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {/* face */}
    <rect width="100" height="164" fill="#232029" />
    {/* double frame */}
    <rect
      x="4"
      y="4"
      width="92"
      height="156"
      rx="5"
      fill="none"
      stroke="#EFE4C8"
      strokeWidth="2"
    />
    <rect
      x="8.5"
      y="8.5"
      width="83"
      height="147"
      rx="3"
      fill="none"
      stroke="#D8C28E"
      strokeWidth="0.75"
      opacity="0.75"
    />

    {/* moon rays */}
    <g stroke="#D8C28E" strokeWidth="0.9" strokeLinecap="round" opacity="0.9">
      <line x1="50" y1="28" x2="50" y2="35" />
      <line x1="50" y1="85" x2="50" y2="92" />
      <line x1="24" y1="56" x2="31" y2="56" />
      <line x1="69" y1="56" x2="76" y2="56" />
      <line x1="31" y1="37" x2="36" y2="42" />
      <line x1="64" y1="70" x2="69" y2="75" />
      <line x1="69" y1="37" x2="64" y2="42" />
      <line x1="31" y1="75" x2="36" y2="70" />
    </g>

    {/* crescent moon (purple) */}
    <circle cx="50" cy="56" r="13" fill="#9C8BC7" />
    <circle cx="55.5" cy="52.5" r="11" fill="#232029" />
    {/* tiny star on the moon */}
    <path
      d="M47 55 l1.2 2.4 2.4 1.2 -2.4 1.2 -1.2 2.4 -1.2 -2.4 -2.4 -1.2 2.4 -1.2 z"
      fill="#EFE4C8"
    />

    {/* four-point stars */}
    <g fill="#D8C28E">
      <path d="M30 100 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6 z" />
      <path d="M70 104 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 z" />
      <path d="M52 118 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 z" />
      <path d="M34 132 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1 z" />
      <path d="M66 136 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1 z" />
    </g>

    {/* scattered dots */}
    <g fill="#9C8BC7" opacity="0.85">
      <circle cx="26" cy="118" r="1.1" />
      <circle cx="74" cy="122" r="1.1" />
      <circle cx="58" cy="96" r="1" />
      <circle cx="42" cy="106" r="1" />
    </g>
    <g fill="#D8C28E" opacity="0.8">
      <circle cx="62" cy="112" r="0.9" />
      <circle cx="38" cy="92" r="0.9" />
      <circle cx="50" cy="142" r="0.9" />
    </g>

    {/* bottom ornament */}
    <g stroke="#D8C28E" strokeWidth="0.8" opacity="0.9">
      <line x1="34" y1="150" x2="44" y2="150" />
      <line x1="56" y1="150" x2="66" y2="150" />
    </g>
    <path
      d="M50 146.5 l1.1 2.4 2.4 1.1 -2.4 1.1 -1.1 2.4 -1.1 -2.4 -2.4 -1.1 2.4 -1.1 z"
      fill="#EFE4C8"
    />
  </svg>
);

const ROMAN = [
  "0","I","II","III","IV","V","VI","VII","VIII","IX","X",
  "XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI",
];

const TarotCard = ({
  card,
  isRevealed = false,
  showMeaning = false,
  onFlip,
  className,
  size = "md",
  position,
  isSelected = false,
  style,
}: TarotCardProps) => {
  const [isFlipped, setIsFlipped] = useState(isRevealed);
  // 0 = try local asset, 1 = fall back to Wikimedia, 2 = text-only placeholder
  const [stage, setStage] = useState(0);

  // Local copy may be missing (images are downloaded separately), so fall back
  // to the remote Wikimedia URL before giving up to a text placeholder.
  const src =
    stage === 0
      ? card.imageUrl
      : stage === 1
        ? WIKIMEDIA_TAROT_IMAGES[card.id] || ""
        : "";

  // Sync internal state with prop changes (for reveal all/hide all)
  useEffect(() => {
    setIsFlipped(isRevealed);
  }, [isRevealed]);

  const handleClick = () => {
    if (onFlip) {
      onFlip();
    }
    setIsFlipped(!isFlipped);
  };

  const sizeClasses = {
    sm: "w-16 h-24",
    md: "w-32 h-48",
    lg: "w-40 h-60",
  };

  return (
    <div className={cn("relative", className)} style={style}>
      {position && (
        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-[11px] tarot-caps text-gold-300 text-center whitespace-nowrap [text-shadow:0_1px_2px_rgba(14,59,51,0.8)]">
          {position}
        </div>
      )}

      <Card
        className={cn(
          sizeClasses[size],
          "relative cursor-pointer transform-gpu transition-all duration-300 hover:scale-[1.04]",
          "bg-transparent border-0 shadow-none",
          "group perspective-1000",
          isSelected && "animate-mystical-glow",
        )}
        onClick={handleClick}
      >
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-700 transform-style-preserve-3d",
            isFlipped && "rotate-y-180",
          )}
        >
          {/* Card Back */}
          <div className="absolute inset-0 backface-hidden">
            <div className="w-full h-full rounded-lg overflow-hidden shadow-[0_6px_18px_rgba(11,36,31,0.45)]">
              <CardBackMotif />
            </div>
          </div>

          {/* Card Front — ink frame, cream inner border, engraved name plate */}
          <div className="absolute inset-0 rotate-y-180 backface-hidden">
            <div className="w-full h-full rounded-lg overflow-hidden bg-cosmic-900 border-2 border-gold-200 shadow-[0_6px_18px_rgba(11,36,31,0.45)] flex flex-col">
              {/* optional roman numeral for major arcana */}
              {card.type === "major" && card.number !== undefined && (
                <div className="tarot-caps text-[10px] text-gold-400 text-center pt-1.5 leading-none">
                  {ROMAN[card.number] ?? card.number}
                </div>
              )}

              {/* image area */}
              <div className="flex-1 m-1.5 mt-1 rounded-[3px] overflow-hidden border border-gold-500/50 bg-gold-50 relative">
                {stage < 2 ? (
                  <img
                    src={src}
                    alt={card.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={() => setStage((s) => s + 1)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-cosmic-800 text-gold-300">
                    <div className="tarot-caps text-[10px] text-center px-2 leading-relaxed">
                      {card.name}
                    </div>
                  </div>
                )}
              </div>

              {/* name plate */}
              <div className="shrink-0 py-1.5 px-1 flex items-center justify-center bg-cosmic-900">
                <span
                  className={cn(
                    "tarot-caps leading-none text-gold-300 text-center",
                    card.name.length > 14 ? "text-[7px]" : "text-[9px]",
                  )}
                >
                  {card.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TarotCard;
