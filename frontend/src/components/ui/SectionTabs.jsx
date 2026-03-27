import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { cn } from "../../lib/utils";

function SectionTabs({ tabs }) {
  return (
    <TabGroup>
      <TabList className="inline-flex rounded-full bg-[color:var(--color-surface-subtle)] p-1">
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            className={({ selected }) =>
              cn(
                "rounded-full px-4 py-2 text-sm font-semibold outline-none transition",
                selected
                  ? "bg-white text-[color:var(--color-primary-strong)] shadow-sm"
                  : "text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-strong)]",
              )
            }
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="mt-6">
        {tabs.map((tab) => (
          <TabPanel key={tab.label}>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}

export default SectionTabs;
