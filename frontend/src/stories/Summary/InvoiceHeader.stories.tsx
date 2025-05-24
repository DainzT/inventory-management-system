import { Meta, StoryFn } from "@storybook/react";
import {
  InvoiceHeader,
  InvoiceHeaderProps,
} from "@/components/temp/summary/InvoiceHeader";


export default {
  title: "Summary Components/InvoiceHeader",
  component: InvoiceHeader,
  decorators: [
    (Story) => (
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof InvoiceHeader>;

const Template: StoryFn<InvoiceHeaderProps> = (args: InvoiceHeaderProps) => (
  <InvoiceHeader {...args} />
);

export const Default: StoryFn<InvoiceHeaderProps> = Template.bind({});
Default.args = {
  fleetName: "All Fleet",
  selectedMonth: "January",
  selectedYear: 2024,
};

export const WithFleetName: StoryFn<InvoiceHeaderProps> = Template.bind({});
WithFleetName.args = {
        fleetName:"F/B Doña Librada",
        selectedMonth: "February",
        selectedYear: 2025,
}
