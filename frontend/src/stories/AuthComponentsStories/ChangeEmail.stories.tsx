import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent, waitFor, screen } from "@storybook/test";
import ChangeEmail from "@/components/authentication/ChangeEmail";
import { IoSettingsOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "Auth/ChangeEmail",
  component: ChangeEmail,
} satisfies Meta<typeof ChangeEmail>;

type Story = StoryObj<typeof ChangeEmail>;

const ChangeEmailWrapper = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className={`flex items-center justify-center w-9 h-9 rounded-full transition-all
          bg-cyan-900 border border-gray-300 shadow-sm
          hover:bg-cyan-800 hover:shadow-md
          active:bg-cyan-800 active:scale-95
          ${isSettingsOpen ? "bg-cyan-800 shadow-md" : ""}`}
        aria-label="Settings"
      >
        <IoSettingsOutline
          className={`text-white transition-transform ${
            isSettingsOpen ? "rotate-45" : ""
          }`}
          size={18}
        />
      </button>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 ml-10 w-40 bg-white rounded-md shadow-lg border border-gray-300 overflow-hidden"
          >
            <button
              onClick={() => {
                setShowChangeEmailModal(true);
                setIsSettingsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center rounded-sm gap-2
                bg-white text-accent
                hover:bg-accent hover:text-white
                active:bg-accent-dark active:scale-95 active:text-white
                focus:outline-none cursor-pointer focus:ring-blue-200`}
            >
              <span>Change Email</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showChangeEmailModal && (
        <ChangeEmail onClose={() => setShowChangeEmailModal(false)} />
      )}
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <MemoryRouter>
      <ChangeEmailWrapper />
    </MemoryRouter>
  ),
};

export const Render: Story = {
  render: () => (
    <MemoryRouter>
      <ChangeEmailWrapper />
    </MemoryRouter>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    await userEvent.click(canvas.getByText("Change Email"));

    const modal = within(document.body);
    await userEvent.type(
      modal.getByPlaceholderText("Enter current PIN"),
      "123456"
    );
    // await userEvent.click(modal.getByText("Verify PIN"));

    const toggleButton = modal.getByLabelText("Show password");
    await userEvent.click(toggleButton);
  },
};
