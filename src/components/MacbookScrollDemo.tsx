import React from "react";
import { MacbookScroll } from "@/components/LazyComponents";
 
export function MacbookScrollDemo() {
  return (
    <div className="w-full overflow-hidden bg-[#0B0B0F]">
      <MacbookScroll
        title={
          <span className="text-white">
            Agents execute in &lt;400ms. <br /> Humans can&apos;t compete.
          </span>
        }
        src={`/dashboardpreview.png`}
        showGradient={false}
      />
    </div>
  );
}
