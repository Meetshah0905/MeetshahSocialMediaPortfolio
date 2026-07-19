"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowRight, ArrowLeft, UploadCloud, CheckCircle2, ShieldCheck, Lock, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewReportWizardPage() {
  const router = useRouter();
  
  // Auth wall state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Wizard state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Source
  const [source, setSource] = useState<"instagram_fitness" | "instagram_finance" | "youtube_main">("instagram_fitness");

  // Step 2: Period
  const [periodType, setPeriodType] = useState<"30d" | "90d" | "custom">("30d");
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-30");

  // Step 3: Screenshot upload
  const [files, setFiles] = useState<File[]>([]);
  const [uploadUrls, setUploadUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Step 4: Extracted/Review Form
  const [extractedData, setExtractedData] = useState<any>(null);

  // Verify auth session
  useEffect(() => {
    fetch("/api/admin/platforms")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || "Incorrect passcode");
      }
    } catch (err) {
      setAuthError("Failed to authenticate");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    setIsUploading(true);
    const newFiles = Array.from(selected);
    setFiles((prev) => [...prev, ...newFiles]);

    const urls: string[] = [];
    for (const file of newFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/uploads/mock", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          urls.push(data.url);
        }
      } catch (err) {
        console.error("Upload failed for file", file.name, err);
      }
    }

    setUploadUrls((prev) => [...prev, ...urls]);
    setIsUploading(false);
  };

  const triggerGeminiAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          period: periodType,
          startDate,
          endDate,
          screenshotUrls: uploadUrls,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExtractedData(data);
        setStep(4);
      } else {
        alert("Failed to analyze screenshots. Using mock data fallback.");
      }
    } catch (err) {
      alert("Error during Gemini analysis");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (status: "draft" | "published") => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...extractedData,
          status,
        }),
      });

      if (res.ok) {
        alert(`Successfully saved report as ${status}!`);
        router.push("/analytics");
      } else {
        alert("Failed to save report.");
      }
    } catch (err) {
      alert("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const updateMetric = (field: string, val: string) => {
    setExtractedData((prev: any) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [field]: val === "" ? null : Number(val),
      },
    }));
  };

  const updateTopContentField = (idx: number, field: string, val: string | number | null) => {
    setExtractedData((prev: any) => {
      const newTopContent = [...(prev.topContent || [])];
      newTopContent[idx] = {
        ...newTopContent[idx],
        [field]: val,
      };
      return {
        ...prev,
        topContent: newTopContent,
      };
    });
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-blue" />
      </div>
    );
  }

  // Auth passcode block
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center px-6">
        <Card className="w-full max-w-md p-8 border border-border bg-white shadow-soft text-center flex flex-col items-center">
          <div className="size-12 rounded-full bg-blue/10 flex items-center justify-center text-blue border border-blue-pale mb-4">
            <Lock className="size-5" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-ink">Admin Auth Required</h2>
          <form onSubmit={handleLogin} className="w-full mt-6 space-y-4">
            <input
              type="password"
              placeholder="Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full border border-border px-4 py-3 rounded-lg text-sm bg-surface-soft focus:outline-none focus:border-blue text-center font-mono"
              required
            />
            {authError && <p className="text-xs font-bold text-danger">{authError}</p>}
            <Button type="submit" disabled={loggingIn} className="w-full bg-blue text-white">
              Access Editor
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const virtualFolderPath = `analytics/${
    source.startsWith("instagram") ? "instagram" : "youtube"
  }/${source.split("_")[1] || "main"}/${startDate}_to_${endDate}/`;

  return (
    <div className="bg-white text-ink min-h-screen py-24 border-t border-border">
      <Container className="max-w-4xl">
        {/* Header navigation steps indicator */}
        <div className="border-b border-border pb-6 mb-8 flex justify-between items-center">
          <div>
            <div className="flex gap-2 items-center">
              <Badge className="bg-blue/10 text-blue border-transparent">Step {step} of 4</Badge>
              <span className="text-[10px] text-success font-bold flex gap-1 items-center uppercase tracking-wider">
                <ShieldCheck className="size-3.5" /> Secure Report Wizard
              </span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-ink mt-2">New Analytics Report</h1>
          </div>
          <Button
            href="/analytics"
            className="bg-transparent border-border text-ink hover:bg-surface-soft"
            size="sm"
          >
            Cancel
          </Button>
        </div>

        {/* STEP 1: CHOOSE SOURCE */}
        {step === 1 && (
          <Card className="p-8 border border-border bg-white space-y-6">
            <h3 className="font-heading text-lg font-bold text-ink">1. Choose Channel Source</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { id: "instagram_fitness", label: "Instagram Fitness", desc: "@meetsofficial" },
                { id: "instagram_finance", label: "Instagram Finance", desc: "@meet.fitfix" },
                { id: "youtube_main", label: "YouTube Main", desc: "YouTube Subscriber base" },
              ] as const).map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSource(opt.id)}
                  className={`p-6 rounded-lg border-2 cursor-pointer text-left transition-all ${
                    source === opt.id
                      ? "border-blue bg-blue-pale/20"
                      : "border-border hover:border-blue/30 bg-surface-soft"
                  }`}
                >
                  <h4 className="font-heading text-sm font-bold text-ink">{opt.label}</h4>
                  <p className="text-[10px] text-muted font-mono mt-1">{opt.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} className="bg-blue text-white hover:bg-blue-deep">
                Next Step <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: CHOOSE PERIOD */}
        {step === 2 && (
          <Card className="p-8 border border-border bg-white space-y-6">
            <h3 className="font-heading text-lg font-bold text-ink">2. Choose Reporting Period</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["30d", "90d", "custom"] as const).map((type) => (
                <div
                  key={type}
                  onClick={() => {
                    setPeriodType(type);
                    if (type === "30d") {
                      setStartDate("2026-06-01");
                      setEndDate("2026-06-30");
                    } else if (type === "90d") {
                      setStartDate("2026-04-01");
                      setEndDate("2026-06-30");
                    }
                  }}
                  className={`p-5 rounded-lg border-2 cursor-pointer text-left transition-all ${
                    periodType === type
                      ? "border-blue bg-blue-pale/20"
                      : "border-border hover:border-blue/30 bg-surface-soft"
                  }`}
                >
                  <h4 className="font-heading text-sm font-bold text-ink uppercase">{type}</h4>
                </div>
              ))}
            </div>

            {/* Custom Dates Picker */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-border px-3.5 py-2.5 rounded-lg text-xs bg-surface-soft"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-border px-3.5 py-2.5 rounded-lg text-xs bg-surface-soft"
                />
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-border">
              <Button onClick={() => setStep(1)} className="bg-transparent border-border text-ink hover:bg-surface-soft">
                <ArrowLeft className="size-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="bg-blue text-white hover:bg-blue-deep">
                Next Step <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: UPLOAD SCREENSHOTS */}
        {step === 3 && (
          <Card className="p-8 border border-border bg-white space-y-6">
            <h3 className="font-heading text-lg font-bold text-ink">3. Upload Insights Screenshots</h3>
            <p className="text-[11px] text-body leading-relaxed">
              Virtual Destination Prefix: <span className="font-mono text-blue font-bold">{virtualFolderPath}</span>
            </p>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-border rounded-panel p-10 text-center flex flex-col items-center justify-center bg-surface-soft hover:border-blue/40 transition-colors relative">
              <UploadCloud className="size-10 text-muted mb-3" />
              <p className="text-xs font-semibold text-ink">Drag screenshots here, or click to browse</p>
              <p className="text-[10px] text-muted mt-1">PNG, JPG, or WEBP formats allowed (multi-file select or directory folders)</p>
              
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                accept="image/png, image/jpeg, image/webp"
              />
            </div>

            {/* Files listing and previews */}
            {files.length > 0 && (
              <div className="space-y-2 pt-4">
                <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest">Selected files ({files.length})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {files.map((f, idx) => (
                    <div key={idx} className="p-3 border border-border rounded bg-white flex flex-col items-center relative">
                      <FileText className="size-6 text-blue" />
                      <span className="text-[9px] text-ink font-semibold truncate w-full text-center mt-2">{f.name}</span>
                      {uploadUrls[idx] ? (
                        <Badge className="bg-success/10 text-success border-transparent text-[8px] mt-1.5">Uploaded</Badge>
                      ) : (
                        <Loader2 className="size-3 animate-spin text-blue mt-1.5" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-border">
              <Button onClick={() => setStep(2)} className="bg-transparent border-border text-ink hover:bg-surface-soft">
                <ArrowLeft className="size-4 mr-2" /> Back
              </Button>
              <Button
                onClick={triggerGeminiAnalysis}
                disabled={files.length === 0 || isUploading || loading}
                className="bg-blue text-white hover:bg-blue-deep"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" /> Analyzing metrics...
                  </>
                ) : (
                  <>
                    Analyze Screenshots <ArrowRight className="size-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 4: REVIEW & EDIT EXTRACTED SCHEMA */}
        {step === 4 && extractedData && (
          <Card className="p-8 border border-border bg-white space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-lg font-bold text-ink">4. Review Extracted Statistics</h3>
              <Badge className="bg-success/15 text-success border-transparent capitalize">
                Confidence: {extractedData.extraction?.confidence || "high"}
              </Badge>
            </div>

            {/* Warnings list */}
            {extractedData.extraction?.warnings?.length > 0 && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-warning uppercase tracking-wider block">Extraction Notes</span>
                {extractedData.extraction.warnings.map((w: string, idx: number) => (
                  <p key={idx} className="text-[10px] text-body">{w}</p>
                ))}
              </div>
            )}

            {/* Core Numeric Metrics inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              {source === "youtube_main" ? (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Subscribers</label>
                    <input
                      type="number"
                      value={extractedData.metrics.subscribers || ""}
                      onChange={(e) => updateMetric("subscribers", e.target.value)}
                      className="w-full border border-border px-3.5 py-2.5 rounded-lg text-xs bg-surface-soft"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Views</label>
                    <input
                      type="number"
                      value={extractedData.metrics.views || ""}
                      onChange={(e) => updateMetric("views", e.target.value)}
                      className="w-full border border-border px-3.5 py-2.5 rounded-lg text-xs bg-surface-soft"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Watch Time (Hours)</label>
                    <input
                      type="number"
                      value={extractedData.metrics.watchTimeHours || ""}
                      onChange={(e) => updateMetric("watchTimeHours", e.target.value)}
                      className="w-full border border-border px-3.5 py-2.5 rounded-lg text-xs bg-surface-soft"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Followers</label>
                    <input
                      type="number"
                      value={extractedData.metrics.followers || ""}
                      onChange={(e) => updateMetric("followers", e.target.value)}
                      className="w-full border border-border px-3.5 py-2.5 rounded-lg text-xs bg-surface-soft"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Reach</label>
                    <input
                      type="number"
                      value={extractedData.metrics.reach || ""}
                      onChange={(e) => updateMetric("reach", e.target.value)}
                      className="w-full border border-border px-3.5 py-2.5 rounded-lg text-xs bg-surface-soft"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Impressions</label>
                    <input
                      type="number"
                      value={extractedData.metrics.impressions || ""}
                      onChange={(e) => updateMetric("impressions", e.target.value)}
                      className="w-full border border-border px-3.5 py-2.5 rounded-lg text-xs bg-surface-soft"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Demographics Gender summary */}
            <div className="pt-6 border-t border-border space-y-4">
              <h4 className="font-heading text-xs font-bold text-ink">Demographics Gender Split</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold">Male %</span>
                  <input
                    type="number"
                    value={extractedData.demographics.gender.male || ""}
                    onChange={(e) =>
                      setExtractedData((prev: any) => ({
                        ...prev,
                        demographics: {
                          ...prev.demographics,
                          gender: { ...prev.demographics.gender, male: Number(e.target.value) },
                        },
                      }))
                    }
                    className="w-full border border-border px-3.5 py-2 rounded-lg text-xs bg-surface-soft mt-1"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold">Female %</span>
                  <input
                    type="number"
                    value={extractedData.demographics.gender.female || ""}
                    onChange={(e) =>
                      setExtractedData((prev: any) => ({
                        ...prev,
                        demographics: {
                          ...prev.demographics,
                          gender: { ...prev.demographics.gender, female: Number(e.target.value) },
                        },
                      }))
                    }
                    className="w-full border border-border px-3.5 py-2 rounded-lg text-xs bg-surface-soft mt-1"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold">Other %</span>
                  <input
                    type="number"
                    value={extractedData.demographics.gender.otherOrUnspecified || ""}
                    onChange={(e) =>
                      setExtractedData((prev: any) => ({
                        ...prev,
                        demographics: {
                          ...prev.demographics,
                          gender: { ...prev.demographics.gender, otherOrUnspecified: Number(e.target.value) },
                        },
                      }))
                    }
                    className="w-full border border-border px-3.5 py-2 rounded-lg text-xs bg-surface-soft mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Notes input */}
            <div className="pt-4 border-t border-border">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Creator Notes</label>
              <textarea
                value={extractedData.creatorNotes}
                onChange={(e) => setExtractedData((prev: any) => ({ ...prev, creatorNotes: e.target.value }))}
                rows={3}
                className="w-full border border-border px-3.5 py-2.5 rounded-lg text-xs bg-surface-soft focus:outline-none"
              />
            </div>

            {/* Top Content Editor */}
            {extractedData.topContent && extractedData.topContent.length > 0 && (
              <div className="pt-6 border-t border-border space-y-4">
                <h4 className="font-heading text-xs font-bold text-ink">Top Performing Content Links & Thumbnails</h4>
                <div className="space-y-4">
                  {extractedData.topContent.map((item: { id?: string; title?: string; mediaType?: string; views?: number | null; url?: string | null; thumbnail?: string | null; }, idx: number) => (
                    <div key={item.id || idx} className="p-4 border border-border rounded-lg bg-surface-soft space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-6">
                          <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Title</label>
                          <input
                            type="text"
                            value={item.title || ""}
                            onChange={(e) => updateTopContentField(idx, "title", e.target.value)}
                            className="w-full border border-border px-3 py-1.5 rounded text-xs bg-white focus:outline-none focus:border-blue"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Media Type</label>
                          <select
                            value={item.mediaType || "unknown"}
                            onChange={(e) => updateTopContentField(idx, "mediaType", e.target.value)}
                            className="w-full border border-border px-3 py-1.5 rounded text-xs bg-white focus:outline-none focus:border-blue"
                          >
                            <option value="reel">Reel</option>
                            <option value="video">Video/Short</option>
                            <option value="post">Post</option>
                            <option value="story">Story</option>
                            <option value="unknown">Unknown</option>
                          </select>
                        </div>
                        <div className="sm:col-span-3">
                          <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Views</label>
                          <input
                            type="number"
                            value={item.views || ""}
                            onChange={(e) => updateTopContentField(idx, "views", e.target.value === "" ? null : Number(e.target.value))}
                            className="w-full border border-border px-3 py-1.5 rounded text-xs bg-white focus:outline-none focus:border-blue"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Video/Post URL</label>
                          <input
                            type="text"
                            value={item.url || ""}
                            placeholder="https://youtube.com/shorts/... or instagram.com/p/..."
                            onChange={(e) => updateTopContentField(idx, "url", e.target.value)}
                            className="w-full border border-border px-3 py-1.5 rounded text-xs bg-white font-mono focus:outline-none focus:border-blue"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Thumbnail Path/URL</label>
                          <input
                            type="text"
                            value={item.thumbnail || ""}
                            placeholder="/images/reels/thumb.jpg or external url"
                            onChange={(e) => updateTopContentField(idx, "thumbnail", e.target.value)}
                            className="w-full border border-border px-3 py-1.5 rounded text-xs bg-white font-mono focus:outline-none focus:border-blue"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-border">
              <Button onClick={() => setStep(3)} className="bg-transparent border-border text-ink hover:bg-surface-soft">
                <ArrowLeft className="size-4 mr-2" /> Back
              </Button>
              <div className="flex gap-3">
                <Button
                  onClick={() => handlePublish("draft")}
                  disabled={loading}
                  className="bg-transparent border-border text-ink hover:bg-surface-soft"
                >
                  Save Draft
                </Button>
                <Button
                  onClick={() => handlePublish("published")}
                  disabled={loading}
                  className="bg-blue text-white hover:bg-blue-deep"
                >
                  Publish Report
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
}
