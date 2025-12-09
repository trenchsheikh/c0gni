import { MacbookScroll } from "@/components/LazyComponents";
 
export function MacbookScrollDemo() {
  return (
    <div className="w-full overflow-hidden bg-gray-50 dark:bg-[#0B0B0F] transition-colors duration-500">
      <MacbookScroll
        title={
          <span className="text-black dark:text-white transition-colors duration-500">
            Agents execute in &lt;400ms. <br /> Humans can&apos;t compete.
          </span>
        }
        src={`/dashboardpreview.png`}
        showGradient={false}
      />
    </div>
  );
}
