import React, { useEffect, useState } from 'react';
import { FileText, Printer, Copy, CheckCircle2, Activity, Download } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import api from '../services/api';

export default function ResearchReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await api.getResearchReport();
        setReportData(res);
      } catch (err) {
        console.error("Error generating research report:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, []);

  const handleCopyMarkdown = () => {
    if (reportData?.report_markdown) {
      navigator.clipboard.writeText(reportData.report_markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center space-y-3">
        <Activity className="w-8 h-8 text-[#FF6B00] animate-spin" />
        <p className="text-sm font-medium">Auto-generating 15-Section Academic Research Paper...</p>
      </div>
    );
  }

  const markdownContent = reportData?.report_markdown || 'No report generated.';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Academic Research Paper & Report" 
        subtitle="Auto-generated 15-section research paper documenting dataset specifications, feature selection, cross-validation metrics, and SHAP interpretations."
      />

      {/* Action Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-gray-500 font-medium">
          Best Model: <span className="font-bold text-[#FF6B00]">{reportData?.best_model || 'Naive Bayes'}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Markdown'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#FF6B00] text-white hover:bg-orange-600 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Research Paper Rendered Document */}
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-lg text-gray-900 leading-relaxed font-sans space-y-6">
        <div className="prose prose-orange max-w-none text-xs space-y-4">
          <pre className="whitespace-pre-wrap font-sans text-xs text-gray-800 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 leading-relaxed">
            {markdownContent}
          </pre>
        </div>
      </div>
    </div>
  );
}
