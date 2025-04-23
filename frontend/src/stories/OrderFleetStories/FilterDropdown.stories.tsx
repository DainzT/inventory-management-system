import { Meta, StoryObj } from "@storybook/react";
import { FilterDropdown } from "../../components/OrderFleetDisplay/FilterDropdown";

const meta: Meta<typeof FilterDropdown> = {
  title: "Order Components/FilterDropdown",
  component: FilterDropdown,
  tags: ['autodocs'],
  argTypes: {
    onSelect: { action: 'selected' }
  }
} satisfies Meta<typeof FilterDropdown>;

export default meta;

type Story = StoryObj<typeof FilterDropdown>;


export const AllFleetsView: Story = {
  args: {
    label: "All Boats",
    options: [
      "All Boats",
      "F/B Lady Rachelle",
      "F/B Mariella",
      "F/B My Shield",
      "F/B Abigail",
      "F/B DC-9",
      "F/B Adomar",
      "F/B Prince of Peace",
      "F/B Ruth Gaily",
      "F/V Vadeo Scout",
      "F/B Mariene"
    ]
  }
};


export const DonyaDonyaFleetView: Story = {
  args: {
    label: "All Boats",
    options: [
      "All Boats",
      "F/B Lady Rachelle",
      "F/B Mariella",
      "F/B My Shield",
      "F/B Abigail",
      "F/B DC-9"
    ]
  }
};


export const DonaLibradaFleetView: Story = {
  args: {
    label: "All Boats",
    options: [
      "All Boats",
      "F/B Adomar",
      "F/B Prince of Peace",
      "F/B Ruth Gaily",
      "F/V Vadeo Scout",
      "F/B Mariene"
    ]
  }
};


export const NoOptions: Story = {
    args: {
      label: "No Boats Available",
      options: []
    }
  };