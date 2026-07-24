import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { listProposalInquiries } from "@/lib/storage/proposals";

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const proposals = await listProposalInquiries();
    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Failed to list proposals:", error);
    return NextResponse.json(
      { error: "Failed to list proposal inquiries" },
      { status: 500 }
    );
  }
}
