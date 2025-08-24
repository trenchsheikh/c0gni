import React from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
 
export function MacbookScrollDemo() {
  return (
    <div className="w-full overflow-hidden bg-white dark:bg-[#0B0B0F]">
      <MacbookScroll
        title={
          <span>
            Agents execute in &lt;400ms. <br /> Humans can&apos;t compete.
          </span>
        }
        src={`/dashboardpreview.png`}
        showGradient={false}
      />
    </div>
  );
}