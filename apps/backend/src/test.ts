import prismaInstance from "@repo/db";
async function testCreatedAt() {
  console.log("--- RUNNING MINIMAL TEST ---");
  try {
    const booking = await prismaInstance.booking.findMany({
      where: {
        status: "Pending",
        tour: {
          agentId: BigInt(7),
        },
      },
    });

    if (!booking) {
      console.log("No booking found to test.");
      return;
    }

    console.log("Minimal query result:", booking);
    console.log("Value of createdAt:", booking[0].createdAt);
    console.log("Type of createdAt:", typeof booking[0].createdAt);
    console.log("Is it a Date object?", booking[0].createdAt instanceof Date);
  } catch (e) {
    console.error("Minimal test failed:", e);
  }
}

// Call the test function
testCreatedAt();
