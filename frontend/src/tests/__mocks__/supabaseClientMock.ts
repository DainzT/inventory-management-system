export const supabase = {
  auth: {
    signInWithOtp: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
};
