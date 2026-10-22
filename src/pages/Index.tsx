import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  Moon,
  Stars,
  Heart,
  Compass,
  BookOpen,
  Shuffle,
  Clock,
  Users,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TAROT_SPREADS } from "@/lib/tarot-data";

const Index = () => {
  const navigate = useNavigate();
  const [selectedSpread, setSelectedSpread] = useState<string | null>(null);

  const handleSpreadSelect = (spreadId: string) => {
    setSelectedSpread(spreadId);
    // Small delay for visual feedback before navigation
    setTimeout(() => {
      navigate(`/reading/${spreadId}`);
    }, 300);
  };

  const getSpreadIcon = (spreadId: string) => {
    const icons = {
      "three-card": Clock,
      "celtic-cross": Compass,
      relationship: Heart,
      horseshoe: Stars,
    };
    const Icon = icons[spreadId as keyof typeof icons] || Sparkles;
    return <Icon className="w-6 h-6" />;
  };

  const getSpreadDifficulty = (spreadId: string) => {
    const difficulties = {
      "three-card": "Beginner",
      relationship: "Intermediate",
      horseshoe: "Intermediate",
      "celtic-cross": "Advanced",
    };
    return difficulties[spreadId as keyof typeof difficulties] || "Beginner";
  };

  const getSpreadTime = (spreadId: string) => {
    const times = {
      "three-card": "5-10 min",
      relationship: "15-20 min",
      horseshoe: "20-25 min",
      "celtic-cross": "30-45 min",
    };
    return times[spreadId as keyof typeof times] || "10 min";
  };

  return (
    <div className="min-h-screen bg-mystical-gradient">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Moon className="w-7 h-7 text-gold-300" strokeWidth={1.5} />
              <h1 className="font-display text-5xl font-semibold tracking-wide text-gold-100">
                Mystic <span className="text-gold-300">Tarot</span>
              </h1>
              <Stars className="w-7 h-7 text-gold-300" strokeWidth={1.5} />
            </div>

            <p className="font-display text-xl text-mystical-100 leading-relaxed">
              Discover the wisdom of the ancient Rider-Waite tarot deck. Let the
              cards guide you through life's mysteries and reveal hidden
              insights about your past, present, and future.
            </p>

            <div className="tarot-caps flex items-center justify-center space-x-8 text-[11px] text-mystical-200">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                <span>78 Traditional Cards</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                <span>Multiple Spreads</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" strokeWidth={1.5} />
                <span>All Experience Levels</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spread Selection */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-semibold text-gold-100 mb-4">
            Choose Your Spread
          </h2>
          <p className="font-display text-mystical-100 max-w-2xl mx-auto">
            Each spread offers a unique perspective on your question. Select the
            one that resonates with your current situation and level of
            experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {TAROT_SPREADS.map((spread) => (
            <Card
              key={spread.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300 cursor-pointer group",
                "bg-cosmic-900/90 border-2 border-gold-200/70 hover:border-gold-200",
                "hover:shadow-[0_10px_30px_rgba(11,36,31,0.5)] hover:-translate-y-1",
                selectedSpread === spread.id &&
                  "border-gold-200 shadow-[0_10px_30px_rgba(11,36,31,0.5)]",
              )}
              onClick={() => handleSpreadSelect(spread.id)}
            >
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-sm border border-gold-400/50 text-gold-300 group-hover:border-gold-300 transition-colors">
                      {getSpreadIcon(spread.id)}
                    </div>
                    <div>
                      <CardTitle className="font-display text-xl tracking-wide text-gold-100 group-hover:text-gold-50 transition-colors">
                        {spread.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant="outline"
                          className="tarot-caps text-[9px] bg-transparent text-mystical-200 border-mystical-400/50"
                        >
                          {getSpreadDifficulty(spread.id)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="tarot-caps text-[9px] bg-transparent text-mystical-200 border-mystical-400/50"
                        >
                          {getSpreadTime(spread.id)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="font-display text-3xl font-semibold text-gold-300">
                    {spread.positions.length}
                  </div>
                </div>

                <CardDescription className="font-display text-mystical-100 leading-relaxed">
                  {spread.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10">
                <Separator className="mb-4 bg-gold-500/30" />

                <div className="space-y-2">
                  <h4 className="tarot-caps text-[10px] text-gold-400 mb-3">
                    Card Positions
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {spread.positions.slice(0, 4).map((position, index) => (
                      <div
                        key={position.id}
                        className="text-xs font-display text-mystical-100"
                      >
                        <span className="font-medium text-gold-400">
                          {index + 1}.
                        </span>{" "}
                        {position.name}
                      </div>
                    ))}
                    {spread.positions.length > 4 && (
                      <div className="text-xs font-display italic text-mystical-300 col-span-2">
                        +{spread.positions.length - 4} more positions
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full mt-6 tarot-caps text-xs bg-gold-200 hover:bg-gold-100 text-cosmic-900 group-hover:shadow-lg transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpreadSelect(spread.id);
                  }}
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Start Reading
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Reading CTA */}
        <div className="text-center mt-16">
          <Card className="inline-block p-8 bg-cosmic-900/90 border-2 border-gold-200/70">
            <div className="space-y-4">
              <Sparkles
                className="w-10 h-10 text-gold-300 mx-auto"
                strokeWidth={1.5}
              />
              <h3 className="font-display text-xl font-semibold text-gold-100">
                New to Tarot?
              </h3>
              <p className="font-display text-mystical-100 max-w-md">
                Start with the Three Card Spread to get familiar with tarot
                readings. It's perfect for daily guidance and simple questions.
              </p>
              <Button
                size="lg"
                className="tarot-caps text-xs bg-gold-200 hover:bg-gold-100 text-cosmic-900"
                onClick={() => handleSpreadSelect("three-card")}
              >
                <Moon className="w-4 h-4 mr-2" />
                Quick Reading
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gold-500/25">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="font-display text-mystical-100 text-sm">
              ✨ Remember: Tarot is a tool for self-reflection and guidance.
              Trust your intuition. ✨
            </p>
            <div className="tarot-caps flex items-center justify-center space-x-6 text-[10px] text-mystical-300">
              <span>Traditional Rider-Waite Deck</span>
              <span>•</span>
              <span>For Entertainment Purposes</span>
              <span>•</span>
              <span>Trust Your Inner Wisdom</span>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="tarot-caps text-[10px] text-gold-300 border-gold-500/40 bg-transparent hover:bg-cosmic-900/60 hover:text-gold-200"
                onClick={() => navigate("/download")}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Card Images
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
