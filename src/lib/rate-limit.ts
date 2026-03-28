export const rateLimiters = {
  api: async (req: any) => {
    return {
      limit: 100,
      remaining: 99,
      reset: Date.now() + 60000,
      success: true,
    };
  }
};
