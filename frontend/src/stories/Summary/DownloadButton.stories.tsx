import { Meta, StoryFn } from "@storybook/react";

import { DownloadButton } from "@/components/summary/DownloadButton";

export default {
  title: "Summary Components/DownloadButton",
  component: DownloadButton,
  parameters: {
    layout: "centered",
  },
} as Meta;

const Template: StoryFn<{ isLoading: boolean; onDownload: () => void }> = (args) => <DownloadButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  isLoading: false,
  onDownload: () => alert("Download triggered!"),
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  onDownload: () => alert("Download triggered!"),
};