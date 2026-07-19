import { AnalyticsReport } from "../storage/db";

class PDFBuilder {
  private body = "";
  private xrefOffsets: number[] = [];
  private objects: string[] = [];

  constructor() {
    this.body = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  }

  private writeObject(content: string): number {
    const id = this.objects.length + 1;
    this.xrefOffsets.push(this.body.length);
    const objStr = `${id} 0 obj\n${content}\nendobj\n`;
    this.body += objStr;
    this.objects.push(objStr);
    return id;
  }

  build(report: AnalyticsReport): Buffer {
    const fontId = 3;
    const fontBoldId = 4;

    const pagesContent: string[] = [];
    
    let handle = "meetsofficial";
    if (report.persona === "instagram_finance") handle = "meet.fitfix";
    if (report.persona === "youtube_main") handle = "YouTube Channel";

    // PAGE 1: COVER PAGE
    pagesContent.push(`
BT
/F2 26 Tf
50 680 Td
(MEET SHAH) Tj
/F2 20 Tf
0 -40 Td
(Creator Insights & Media-Kit Report) Tj
/F1 12 Tf
0 -40 Td
(Channel: ${handle} \\(${report.persona.toUpperCase()}\\)) Tj
0 -25 Td
(Reporting Period: ${report.period.label} \\(${report.period.startDate} to ${report.period.endDate}\\)) Tj
0 -25 Td
(Published Date: ${report.publishedAt ? report.publishedAt.split("T")[0] : "Draft"}) Tj
0 -25 Td
(Location: Ahmedabad, India) Tj
0 -25 Td
(Email: editsbymks@gmail.com) Tj
ET
0.18 0.49 1.0 rg
50 500 495 6 re f
0.75 rg
50 470 495 1 re f
BT
/F1 10 Tf
50 440 Td
(This report compiles verified metrics directly extracted from insights screenshots.) Tj
0 -18 Td
(Data integrity has been audited and approved by Meet Shah.) Tj
ET
`);

    // PAGE 2: PERFORMANCE OVERVIEW
    const m = report.metrics;
    const isYouTube = report.persona === "youtube_main";

    if (isYouTube) {
      pagesContent.push(`
BT
/F2 18 Tf
50 780 Td
(PERFORMANCE OVERVIEW) Tj
ET
0.93 0.95 0.98 rg
50 560 230 180 re f
50 560 230 180 re s
BT
/F2 12 Tf
65 710 Td
(Total Channel Views) Tj
/F2 24 Tf
0 -40 Td
(${m.views?.toLocaleString() ?? "N/A"}) Tj
/F1 10 Tf
0 -25 Td
(Video views in period) Tj
ET
0.93 0.95 0.98 rg
315 560 230 180 re f
315 560 230 180 re s
BT
/F2 12 Tf
330 710 Td
(Subscribers Count) Tj
/F2 24 Tf
0 -40 Td
(${m.subscribers?.toLocaleString() ?? "N/A"}) Tj
/F1 10 Tf
0 -25 Td
(+${m.subscriberChange?.toLocaleString() ?? "0"} in report period) Tj
ET
0.93 0.95 0.98 rg
50 340 230 180 re f
50 340 230 180 re s
BT
/F2 12 Tf
65 490 Td
(Watch Time Hours) Tj
/F2 24 Tf
0 -40 Td
(${m.watchTimeHours?.toLocaleString() ?? "N/A"}) Tj
/F1 10 Tf
0 -25 Td
(Total viewing hours) Tj
ET
0.93 0.95 0.98 rg
315 340 230 180 re f
315 340 230 180 re s
BT
/F2 12 Tf
330 490 Td
(CTR Percentage) Tj
/F2 24 Tf
0 -40 Td
(${m.impressionsClickThroughRate ? m.impressionsClickThroughRate + "%" : "N/A"}) Tj
/F1 10 Tf
0 -25 Td
(Impressions CTR) Tj
ET
`);
    } else {
      pagesContent.push(`
BT
/F2 18 Tf
50 780 Td
(PERFORMANCE OVERVIEW) Tj
ET
0.93 0.95 0.98 rg
50 560 230 180 re f
50 560 230 180 re s
BT
/F2 12 Tf
65 710 Td
(Audience Reach) Tj
/F2 24 Tf
0 -40 Td
(${m.reach?.toLocaleString() ?? "N/A"}) Tj
/F1 10 Tf
0 -25 Td
(Accounts reached in period) Tj
ET
0.93 0.95 0.98 rg
315 560 230 180 re f
315 560 230 180 re s
BT
/F2 12 Tf
330 710 Td
(Followers Count) Tj
/F2 24 Tf
0 -40 Td
(${m.followers?.toLocaleString() ?? "N/A"}) Tj
/F1 10 Tf
0 -25 Td
(+${m.followerChange?.toLocaleString() ?? "0"} in report period) Tj
ET
0.93 0.95 0.98 rg
50 340 230 180 re f
50 340 230 180 re s
BT
/F2 12 Tf
65 490 Td
(Engagement Rate) Tj
/F2 24 Tf
0 -40 Td
(${m.engagementRate ? m.engagementRate + "%" : "N/A"}) Tj
/F1 10 Tf
0 -25 Td
(Average content interactions) Tj
ET
0.93 0.95 0.98 rg
315 340 230 180 re f
315 340 230 180 re s
BT
/F2 12 Tf
330 490 Td
(Video Views) Tj
/F2 24 Tf
0 -40 Td
(${m.reelPlays?.toLocaleString() ?? "N/A"}) Tj
/F1 10 Tf
0 -25 Td
(Reel plays & loops count) Tj
ET
`);
    }

    // PAGE 3: DEMOGRAPHICS
    const d = report.demographics;
    pagesContent.push(`
BT
/F2 18 Tf
50 780 Td
(AUDIENCE DEMOGRAPHICS) Tj
/F2 12 Tf
0 -45 Td
(Gender Distribution) Tj
/F1 11 Tf
0 -25 Td
(Male: ${d.gender.male ?? "N/A"}%) Tj
0 -20 Td
(Female: ${d.gender.female ?? "N/A"}%) Tj
0 -20 Td
(Other/Unspecified: ${d.gender.otherOrUnspecified ?? "N/A"}%) Tj
ET
0.93 0.95 0.98 rg
50 510 495 16 re f
0.18 0.49 1.0 rg
50 510 ${(495 * (d.gender.male ?? 50)) / 100} 16 re f
BT
/F2 12 Tf
50 440 Td
(Age Bracket Breakdown) Tj
ET
${d.ageRanges
  .map(
    (age, idx) => `
BT
/F1 11 Tf
50 ${390 - idx * 30} Td
(${age.label}: ${age.percentage}%) Tj
ET
0.93 0.95 0.98 rg
150 ${392 - idx * 30} 300 10 re f
0.18 0.49 1.0 rg
150 ${392 - idx * 30} ${(300 * age.percentage) / 100} 10 re f
`
  )
  .join("\n")}
`);

    // PAGE 4: TOP CONTENT & CONTACT
    const top = report.topContent[0];
    pagesContent.push(`
BT
/F2 18 Tf
50 780 Td
(TOP CONTENT & VERIFICATION) Tj
ET
0.95 rg
50 560 495 160 re f
50 560 495 160 re s
BT
/F2 12 Tf
65 680 Td
(${isYouTube ? "Featured Video Performance" : "Featured Reels Performance"}) Tj
/F2 14 Tf
0 -30 Td
(${top ? top.title : "N/A"}) Tj
/F1 11 Tf
0 -25 Td
(Views: ${top?.views?.toLocaleString() ?? "N/A"}   |   Likes: ${top?.likes?.toLocaleString() ?? "N/A"}) Tj
0 -20 Td
(Comments: ${top?.comments?.toLocaleString() ?? "N/A"}   |   Shares: ${top?.shares?.toLocaleString() ?? "N/A"}) Tj
ET
BT
/F2 12 Tf
50 460 Td
(Creator Notes) Tj
/F1 10 Tf
0 -25 Td
(${report.creatorNotes || "No comments published for this period."}) Tj
/F2 12 Tf
0 -60 Td
(Methodology & Contact) Tj
/F1 10 Tf
0 -25 Td
(Methodology: Verified console screenshot extracts compiled in Zod structures.) Tj
0 -18 Td
(Email: editsbymks@gmail.com) Tj
0 -18 Td
(Instagram: @meetsofficial  |  @meet.fitfix) Tj
0 -18 Td
(LinkedIn: https://www.linkedin.com/in/meet-shah-527440372/) Tj
ET
`);

    const fontObjId = this.writeObject(
      `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`
    );
    const fontBoldObjId = this.writeObject(
      `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`
    );

    const pageContentIds: number[] = [];
    for (const content of pagesContent) {
      const cleanContent = content.trim();
      const length = cleanContent.length;
      const streamId = this.writeObject(
        `<< /Length ${length} >>\nstream\n${cleanContent}\nendstream`
      );
      pageContentIds.push(streamId);
    }

    const pageObjIds: number[] = [];
    for (const cId of pageContentIds) {
      const pId = this.writeObject(
        `<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 ${fontObjId} 0 R /F2 ${fontBoldObjId} 0 R >> >> /MediaBox [0 0 595 842] /Contents ${cId} 0 R >>`
      );
      pageObjIds.push(pId);
    }

    const pagesKids = pageObjIds.map((id) => `${id} 0 R`).join(" ");
    
    const pagesRootStr = `2 0 obj\n<< /Type /Pages /Kids [${pagesKids}] /Count ${pageObjIds.length} >>\nendobj\n`;
    this.xrefOffsets[1] = this.body.length;
    this.body += pagesRootStr;
    this.objects[1] = pagesRootStr;

    const catalogStr = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
    this.xrefOffsets[0] = this.body.length;
    this.body += catalogStr;
    this.objects[0] = catalogStr;

    const startXref = this.body.length;
    let xref = "xref\n0 " + (this.objects.length + 1) + "\n0000000000 65535 f \n";
    for (const offset of this.xrefOffsets) {
      const padded = ("0000000000" + offset).slice(-10);
      xref += `${padded} 00000 n \n`;
    }
    this.body += xref;

    this.body += `trailer\n<< /Size ${this.objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

    return Buffer.from(this.body, "binary");
  }
}

export function generatePDFReport(report: AnalyticsReport): Buffer {
  const builder = new PDFBuilder();
  return builder.build(report);
}
