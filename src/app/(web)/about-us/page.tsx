"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Coffee,
  Heart,
  Sparkles,
  Leaf,
  Users,
  Award,
  HandHeart,
} from "lucide-react";
import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-secondary text-white py-24  text-center px-4">
        <div className="max-w-7xl my-16 mx-auto">
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Monkey Brew
          </h1>
          <p className="text-white/90 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            At Monkey Brew, every cup carries a little spark — a spark of
            origin, craft and connection.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Story Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Our Beans Tell Stories
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our beans tell stories: of the land where they were grown, of
                the farmers who nurtured them, and of the barista who carefully
                brings that story to life in your cup. For us, that story
                matters.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We source beans that have distinctive origin, exceptional flavour
                profiles, and are handled with care from farm to brew. We
                believe in sourcing coffee thoughtfully — beans with character,
                grown with care, roasted to bring out their best.
              </p>
            </div>
            <div className="rounded-2xl w-full h-full border-0 overflow-hidden">
              <Image src="/monkey1.png" alt="About Us" width={500} height={500} className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Heart className="h-10 w-10 text-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              More Than Just Coffee
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We don't see coffee as just a beverage. We see it as a ritual, a
              bridge between people, a moment of pause and presence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-2xl shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Community</h3>
                </div>
                <p className="text-muted-foreground">
                  When you walk into Monkey Brew, you're not just ordering a
                  drink — you're stepping into a space built on moments, on
                  shared humanity, on craft.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-green-500/10 p-3">
                    <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Experience</h3>
                </div>
                <p className="text-muted-foreground">
                  We aim to make every visit matter: the bean you taste, the
                  barista you meet, the place you sit — all parts of the
                  experience.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-blue-500/10 p-3">
                    <HandHeart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Integrity</h3>
                </div>
                <p className="text-muted-foreground">
                  We believe in doing this with integrity: encouraging curiosity,
                  respecting origin, celebrating flavour, and honouring
                  community.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl shadow-lg border-0 bg-secondary/5">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  So come in. Sit down. Stay awhile—or just grab your cup and
                  savour the road ahead. At Monkey Brew, the cup is just the
                  beginning.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Values Grid */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="rounded-2xl shadow-lg border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  Our Commitment
                </h3>
                <ul className="space-y-6 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Badge>Sourcing beans with distinctive origin</Badge>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge>Exceptional flavour profiles</Badge>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge>Careful handling from farm to brew</Badge>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge>Thoughtful sourcing with character</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  What We Stand For
                </h3>
                <ul className="space-y-6 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Badge>Encouraging curiosity</Badge>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge>Respecting origin</Badge>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge>Celebrating flavour</Badge>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge>Honouring community</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
