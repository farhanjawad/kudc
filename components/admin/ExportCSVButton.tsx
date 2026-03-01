'use client';
import { useState } from 'react';
import { generateResultsCSV } from '@/lib/actions/export';

export default function ExportCSVButton({ quizId }: { quizId?: string }) {
  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async () => {
    setIsExporting(true);
    const result = await generateResultsCSV(quizId);
    if (!result.success) { alert(result.error); setIsExporting(false); return; }
    const blob = new Blob([result.csvString!], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'export.csv'; a.click();
    setIsExporting(false);
  };
  return <button onClick={handleExport} disabled={isExporting} className="px-4 py-2 bg-blue-600 text-white rounded font-bold">{isExporting ? 'Exporting...' : 'Export CSV'}</button>;
}
