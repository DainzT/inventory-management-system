import type { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const updateArchivedItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const assignedItems = await prisma.assignedItem.findMany({
      where: {
        archived: false,
      },
    });

    const itemsToArchive = assignedItems.filter((item) => {
      const outDate = new Date(item.outDate);
      return (
        outDate.getFullYear() < currentYear ||
        (outDate.getFullYear() === currentYear && outDate.getMonth() < currentMonth)
      );
    });

    const updatePromises = itemsToArchive.map((item) =>
      prisma.assignedItem.update({
        where: { id: item.id },
        data: { archived: true },
      })
    );

    await Promise.all(updatePromises);
    next(); // continue to the main route
  } catch (error) {
    console.error("Error updating archived items:", error);
    res.status(500).json({ message: "Failed to update archived items." });
  }
};