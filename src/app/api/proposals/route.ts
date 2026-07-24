import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveProposalInquiry, ProposalInquiry } from "@/lib/storage/proposals";

const proposalSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  email: z.string().trim().email("Please provide a valid email address"),
  brand: z.string().trim().min(2, "Brand / Company must be at least 2 characters long"),
  vertical: z.string().trim().min(1, "Collaboration type is required"),
  budget: z.string().trim().min(1, "Budget range is required"),
  timeline: z.string().trim().min(1, "Timeline is required"),
  message: z.string().trim().min(5, "Message must be at least 5 characters long"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const validationResult = proposalSchema.safeParse(body);

    if (!validationResult.success) {
      const issue = validationResult.error.issues[0];
      return NextResponse.json(
        { success: false, error: issue ? issue.message : "Validation error" },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const now = new Date().toISOString();
    const id = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const proposal: ProposalInquiry = {
      id,
      name: data.name,
      email: data.email,
      brand: data.brand,
      vertical: data.vertical,
      budget: data.budget,
      timeline: data.timeline,
      message: data.message,
      status: "new",
      createdAt: now,
      updatedAt: now,
    };

    await saveProposalInquiry(proposal);

    return NextResponse.json(
      {
        success: true,
        id: proposal.id,
        message: "Campaign proposal submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving campaign proposal:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process campaign proposal. Please try again later.",
      },
      { status: 500 }
    );
  }
}
