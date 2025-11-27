import { serve } from "@upstash/workflow/nextjs";

type InitialData = {
  email: string;
};

// OLD VERSION WORKFLOW SYNTAX
export const { POST } = serve<InitialData>(async (context) => {
  const { email } = context.requestPayload;

  // Step 1: Send welcome email
  await context.run("new-signup", async () => {
    await sendEmail("welcome to the platform", email);
  });

  // Step 2: Check user state
  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUsersState();
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail("Email to non active users", email);
      });
    } else if (state == "active") {
      await context.run("send-email-active", async () => {
        await sendEmail("Send newsLetter to active users", email);
      });
    }
    await context.sleep("wait-for-1month", 60 * 60 * 24 * 10);
  }
});

async function sendEmail(message: string, email: string) {
  console.log(`Sending ${message} email to ${email}`);
}

type UserState = "non-active" | "active";

const getUsersState = async (): Promise<UserState> => {
  return "non-active";
};
