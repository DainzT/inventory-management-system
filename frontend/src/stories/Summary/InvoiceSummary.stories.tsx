import {Meta, StoryFn} from "@storybook/react";
import { InvoiceSummary, InvoiceSummaryProps } from "@/components/Summary/InvoiceSummary";

export default {
    title: "Summary Components/InvoiceSummary",
    component: InvoiceSummary,
    decorators: [
        (Story) => (
            <div style={{ fontFamily: "Arial, sans-serif" }} className="justify-center items-center flex flex-col">
                <Story />
            </div>
        ),
    ],
} as Meta<typeof InvoiceSummary>;

const Template: StoryFn<InvoiceSummaryProps> = (args: InvoiceSummaryProps) => (
    <InvoiceSummary {...args} />
);

export const Default: StoryFn<InvoiceSummaryProps> = Template.bind({});
Default.args = {
    total: 5000,
}

export const NoData: StoryFn<InvoiceSummaryProps> = Template.bind({});
NoData.args = {
    total: 0,
}