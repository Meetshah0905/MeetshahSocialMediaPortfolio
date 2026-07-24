"use client";

import Script from "next/script";

export function CalEmbed() {
  return (
    <Script
      id="cal-embed-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");

          // 1. Social Media / 1:1 60min General Meeting
          Cal("init", "60min", {origin:"https://app.cal.com"});
          Cal.config = Cal.config || {};
          Cal.config.forwardQueryParams = true;
          Cal.ns["60min"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});

          // 2. Join Creator Team Discussion Meeting
          Cal("init", "creator-team-discussing", {origin:"https://app.cal.com"});
          Cal.ns["creator-team-discussing"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
        `,
      }}
    />
  );
}
