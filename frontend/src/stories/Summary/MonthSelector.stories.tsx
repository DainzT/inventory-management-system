import { Meta, StoryFn } from "@storybook/react";

import {
  MonthSelector,
  MonthSelectorProps,
} from "@/components/summary/MonthSelector";
import { useState } from "react";

export default {
  title: "Summary Components/MonthSelector",
  component: MonthSelector,
} as Meta;

const Template: StoryFn<MonthSelectorProps> = (args: MonthSelectorProps) => (
  <MonthSelector {...args} />
);

export const Default = Template.bind({});
Default.args = {
  selectedMonth: "",
};

export const WithSelectedMonth = Template.bind({});
WithSelectedMonth.args = {
  selectedMonth: "April",
};

const InteractiveTemplate: StoryFn<MonthSelectorProps> = (
  args: MonthSelectorProps
) => {
  const [selectedMonth, setSelectedMonth] = useState(args.selectedMonth);

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <MonthSelector
      {...args}
      selectedMonth={selectedMonth}
      onMonthSelect={handleMonthSelect}
    />
  );
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  selectedMonth: "",
};
