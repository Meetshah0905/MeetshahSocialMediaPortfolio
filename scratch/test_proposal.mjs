import { saveProposalInquiry, listProposalInquiries, getProposalInquiry, updateProposalInquiryStatus, deleteProposalInquiry } from "../src/lib/storage/proposals.ts";

async function test() {
  const testId = `prop_test_${Date.now()}`;
  console.log("Testing proposal storage...");

  await saveProposalInquiry({
    id: testId,
    name: "Test Sponsor",
    email: "sponsor@brand.com",
    brand: "Acme Tech",
    vertical: "Dedicated Short-Form Reels",
    budget: "Campaign Bundle",
    timeline: "This month",
    message: "We would like to partner on a 3-reel campaign highlighting our new product launch.",
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const list = await listProposalInquiries();
  console.log("Total proposals in storage:", list.length);

  const item = await getProposalInquiry(testId);
  console.log("Retrieved item name:", item?.name, "| status:", item?.status);

  await updateProposalInquiryStatus(testId, "reviewed");
  const updatedItem = await getProposalInquiry(testId);
  console.log("Updated item status:", updatedItem?.status);

  await deleteProposalInquiry(testId);
  const deletedItem = await getProposalInquiry(testId);
  console.log("Deleted item exists?", deletedItem !== null);

  console.log("Storage test completed successfully!");
}

test().catch(console.error);
