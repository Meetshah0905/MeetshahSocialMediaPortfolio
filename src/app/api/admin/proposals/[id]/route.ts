import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth/session";
import {
  updateProposalInquiryStatus,
  deleteProposalInquiry,
  getProposalInquiry,
  ProposalStatus,
} from "@/lib/storage/proposals";

const updateSchema = z.object({
  status: z.enum(["new", "reviewed", "contacted", "archived"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);

    const validationResult = updateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid status value. Must be 'new', 'reviewed', 'contacted', or 'archived'." },
        { status: 400 }
      );
    }

    const updated = await updateProposalInquiryStatus(
      id,
      validationResult.data.status as ProposalStatus
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Proposal inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, proposal: updated });
  } catch (error) {
    console.error("Failed to update proposal status:", error);
    return NextResponse.json(
      { error: "Failed to update proposal status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await getProposalInquiry(id);

    if (!existing) {
      return NextResponse.json(
        { error: "Proposal inquiry not found" },
        { status: 404 }
      );
    }

    const deleted = await deleteProposalInquiry(id);

    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("Failed to delete proposal:", error);
    return NextResponse.json(
      { error: "Failed to delete proposal inquiry" },
      { status: 500 }
    );
  }
}
