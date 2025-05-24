import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import CreateAdmin from "@/components/authentication/CreateAdmin";

export default {
  title: "Auth/CreateAdmin",
  component: CreateAdmin,
} satisfies Meta<typeof CreateAdmin>;

type Story = StoryObj<typeof CreateAdmin>;

const CreateAdminWrapper = () => {
  const [showCreateAdmin, setShowCreateAdmin] = useState(true);

  return (
    <div className="relative">
      {showCreateAdmin && (
        <CreateAdmin onSuccess={() => setShowCreateAdmin(false)} />
      )}
    </div>
  );
};

export const Default: Story = {
  render: () => <CreateAdminWrapper />,
};
