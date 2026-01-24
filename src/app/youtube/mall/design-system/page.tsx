"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Grid3X3, LayoutTemplate, Settings2, Type } from "lucide-react";
import Link from "next/link";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8 border-gray-200">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">
              Step 2 of Derivation Logic
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-gray-900 uppercase">
              Design System <span className="text-indigo-600">Definition</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
              Define the structural principles that carry the Brand Soul into visual assets. 
              This is where we establish the DNA of the shopping mall.
            </p>
          </div>
          <Link href="/youtube/mall">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 rounded-xl shadow-xl shadow-indigo-100 flex gap-3 text-lg font-bold">
              Back to Wizard <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Placeholder Sections */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <SectionCard 
            icon={<Type className="w-8 h-8 text-indigo-500" />}
            title="Typography System"
            description="Define font weights, scales, and line heights that align with the brand's voice."
          />
          <SectionCard 
            icon={<Grid3X3 className="w-8 h-8 text-indigo-500" />}
            title="Grid & Spacing"
            description="Establish the density and rhythm of the layout based on the commerce strategy."
          />
          <SectionCard 
            icon={<LayoutTemplate className="w-8 h-8 text-indigo-500" />}
            title="Layout Principles"
            description="Define structural blueprints for main pages, product lists, and detail views."
          />
        </div>

        {/* Coming Soon Alert */}
        <div className="bg-indigo-900 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-bold">Awaiting Specific Parameters...</h2>
            <p className="text-indigo-100 text-lg max-w-xl">
              I've created this space as requested. Once you provide the specific details for the Design System Definition, 
              I will implement the interactive controls and AI mapping logic here.
            </p>
          </div>
          <div className="absolute right-[-10%] top-[-10%] opacity-10">
            <Settings2 className="w-96 h-96 transform rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden group cursor-pointer bg-white">
      <CardHeader className="p-8 pb-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <p className="text-gray-500 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
