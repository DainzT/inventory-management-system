import {Meta, StoryFn} from "@storybook/react";
import {YearSelector, YearSelectorProps} from "@/components/temp/summary/YearSelector";
import {useState} from "react";

export default {
  title: "Summary Components/YearSelector",
  component: YearSelector,
} as Meta;

const Template: StoryFn<YearSelectorProps> = (args: YearSelectorProps) => (
  <YearSelector {...args} />
);

export const Default = Template.bind({});
Default.args = {
    availableYears: [2023],
    selectedYear: undefined,
};

export const WithSelectedYear = Template.bind({});
WithSelectedYear.args = {
    availableYears: [2023, 2022, 2021],
    selectedYear: 2022,
};

const InteractiveTemplate: StoryFn<YearSelectorProps> = (
  args: YearSelectorProps
) => {
  const [selectedYear, setSelectedYear] = useState(args.selectedYear);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <YearSelector
        {...args}
        selectedYear={selectedYear}
        onYearSelect={handleYearSelect}
    />
  );
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
    availableYears: [2023, 2022, 2021],
    selectedYear: 2023,
    };