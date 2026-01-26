"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";

interface Log {
  message: string;
  type: "info" | "success" | "warning" | "error"; 
  timestamp: string;
}

interface LogsTerminalProps {
  logs: Log[];
}

export function LogsTerminal({ logs }: LogsTerminalProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <Card className="bg-black text-green-400 font-mono text-sm h-[300px] flex flex-col border-gray-800 shadow-2xl">
      <div className="p-3 border-b border-gray-800 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-gray-500">processing-logs</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-gray-500">[{log.timestamp}]</span>
            <span className={
              log.type === "error" ? "text-red-400" :
              log.type === "success" ? "text-blue-400 font-bold" :
              "text-green-400"
            }>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </Card>
  );
}
