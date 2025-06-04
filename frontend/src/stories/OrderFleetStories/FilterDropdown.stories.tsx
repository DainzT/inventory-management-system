import { Meta, StoryObj } from "@storybook/react";
import { FilterDropdown } from "../../components/orders/OrdersManagementTable/FilterDropdown";
import userEvent from "@testing-library/user-event";
import {within} from "@storybook/testing-library";
import { Decorator } from "@storybook/react";


const CenterDecorator: Decorator = (Story) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Story />
  </div>
);

const meta: Meta<typeof FilterDropdown> = {
  title: "Order Components/FilterDropdown",
  component: FilterDropdown,
  tags: ['autodocs'],
  argTypes: {
    onSelect: { action: 'selected' }
  },
  decorators: [CenterDecorator],
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
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const expand = canvas.getByText("All Boats")
    await userEvent.click(expand);
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
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const expand = canvas.getByText("All Boats")
    await userEvent.click(expand);
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
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const expand = canvas.getByText("All Boats")
    await userEvent.click(expand);
    }
};


export const NoOptions: Story = {
    args: {
      label: "No Boats Available",
      options: ["No Boats"]
    },
  };
