import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Download, Calendar as CalendarIcon, FileText, Users, BookOpen } from 'lucide-react';
import api from '../utils/api';

const Reports = () => {
  const [visitors, setVisitors] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reportType, setReportType] = useState('visitors'); // 'visitors' or 'lectures'

  const fetchData = async () => {
    try {
      setLoading(true);
      const [visitorRes, lectureRes] = await Promise.all([
        api.get('/visitors'),
        api.get('/lectures?includeDeleted=true')
      ]);
      setVisitors(visitorRes.data);
      setLectures(lectureRes.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getVisitorSortTime = (v) => {
    if (v.created_at || v.createdAt) {
      const ts = new Date(v.created_at || v.createdAt).getTime();
      if (!Number.isNaN(ts)) return ts;
    }
    if (v.visitDate || v.visit_date) {
      const dateValue = v.visitDate || v.visit_date;
      const timeValue = v.visitTime || v.visit_time || '00:00:00';
      const ts = new Date(`${dateValue}T${timeValue}`).getTime();
      if (!Number.isNaN(ts)) return ts;
    }
    return 0;
  };

  const filteredVisitors = (dateFilter 
    ? visitors.filter(v => (v.visitDate || v.visit_date) === dateFilter)
    : visitors
  ).sort((a, b) => getVisitorSortTime(b) - getVisitorSortTime(a));

  const insideVisitors = filteredVisitors.filter(v => v.checkIn && !v.checkOut);
  const exitedVisitors = filteredVisitors.filter(v => v.checkOut);
  const noEntryVisitors = filteredVisitors.filter(v => !v.checkIn && !v.checkOut);

  const filteredLectures = (dateFilter
    ? lectures.filter(l => l.lecture_date === dateFilter)
    : lectures
  ).sort((a, b) => {
    const aTs = new Date(a.created_at || a.createdAt || a.lecture_date || 0).getTime();
    const bTs = new Date(b.created_at || b.createdAt || b.lecture_date || 0).getTime();
    return bTs - aTs;
  });

  const xmlEscape = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const buildWorksheetXml = (sheetName, headers, rows) => {
    const headerRow = `<Row>${headers
      .map((header) => `<Cell><Data ss:Type="String">${xmlEscape(header)}</Data></Cell>`)
      .join('')}</Row>`;

    const dataRows = rows
      .map((row) => {
        const cells = row.map(
          (cellValue) => `<Cell><Data ss:Type="String">${xmlEscape(cellValue)}</Data></Cell>`
        );
        return `<Row>${cells.join('')}</Row>`;
      })
      .join('');

    return `<Worksheet ss:Name="${xmlEscape(sheetName)}"><Table>${headerRow}${dataRows}</Table></Worksheet>`;
  };

  const downloadExcelReport = () => {
    if (isExporting || loading) return;

    setIsExporting(true);
    try {
      const workbookSheets = [];
      const generatedDate = new Date().toISOString().split('T')[0];
      const fileDateToken = dateFilter || generatedDate;

      if (reportType === 'visitors') {
        const headers = ['Visitor Name', 'Phone', 'Purpose', 'Host', 'Status', 'Check In', 'Check Out', 'Visit Date'];
        const mapVisitorRow = (v) => ([
          v.name || 'N/A',
          v.phone || 'N/A',
          v.purpose || 'N/A',
          v.personToMeet || v.person_to_meet || 'N/A',
          v.status || 'N/A',
          v.checkIn || 'Pending',
          v.checkOut || 'Pending',
          v.visitDate || v.visit_date || 'N/A'
        ]);

        if (!filteredVisitors.length) {
          alert('No visitor data is available for the selected filters.');
          return;
        }

        workbookSheets.push(
          buildWorksheetXml('Visitors_Inside', headers, insideVisitors.map(mapVisitorRow)),
          buildWorksheetXml('Visitors_Exited', headers, exitedVisitors.map(mapVisitorRow)),
          buildWorksheetXml('Visitors_No_Entry', headers, noEntryVisitors.map(mapVisitorRow)),
          buildWorksheetXml('Visitors_All', headers, filteredVisitors.map(mapVisitorRow))
        );
      } else {
        if (!filteredLectures.length) {
          alert('No lecture data is available for the selected filters.');
          return;
        }

        const headers = ['Topic', 'Speaker', 'Department', 'Venue', 'Date', 'Time', 'Status', 'Total Expense INR'];
        const lectureRows = filteredLectures.map((l) => ([
          l.topic || 'N/A',
          l.speakerName || l.speaker_name || 'N/A',
          l.department || 'N/A',
          l.venue || 'N/A',
          l.lecture_date || (l.dateTime ? new Date(l.dateTime).toISOString().split('T')[0] : 'N/A'),
          l.lecture_time || (l.dateTime ? new Date(l.dateTime).toTimeString().slice(0, 8) : 'N/A'),
          l.deleted_at || l.deletedAt ? 'archived' : (l.status || 'scheduled'),
          Number.parseFloat(l.totalExpenses || 0).toFixed(2)
        ]));

        workbookSheets.push(buildWorksheetXml('Lecture_History', headers, lectureRows));
      }

      const workbookXml =
        `<?xml version="1.0"?>` +
        `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ` +
        `xmlns:o="urn:schemas-microsoft-com:office:office" ` +
        `xmlns:x="urn:schemas-microsoft-com:office:excel" ` +
        `xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" ` +
        `xmlns:html="http://www.w3.org/TR/REC-html40">` +
        workbookSheets.join('') +
        `</Workbook>`;

      const blob = new Blob([workbookXml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${reportType}-report-${fileDateToken}.xls`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to export report:', error);
      alert('Failed to generate Excel report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const VisitorRows = ({ rows, emptyText }) => (
    rows.length > 0 ? rows.map((v) => (
      <tr key={v.id} className="hover:bg-primary/[0.02] transition-colors group">
        <td className="px-8 py-6">
          <div className="flex flex-col">
            <span className="font-black text-dark text-sm">{v.name}</span>
            <span className="text-[10px] font-bold text-gray-400 tracking-tight">{v.phone}</span>
          </div>
        </td>
        <td className="px-8 py-6">
          <div className="flex flex-col">
            <span className="font-bold text-dark text-xs">{v.purpose}</span>
            <span className="text-[10px] font-black text-primary uppercase tracking-wider mt-1">{v.personToMeet}</span>
          </div>
        </td>
        <td className="px-8 py-6">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
            v.status === 'approved' ? 'bg-success/5 text-success border-success/20' :
            v.status === 'rejected' ? 'bg-danger/5 text-danger border-danger/20' :
            'bg-warning/5 text-warning border-warning/20'
          }`}>
            {v.status}
          </span>
        </td>
        <td className="px-8 py-6">
          <div className="flex items-center gap-3 font-mono text-[10px] font-black">
            <span className={v.checkIn ? 'text-success' : 'text-gray-300'}>{v.checkIn || '--:--'}</span>
            <span className="text-gray-200">|</span>
            <span className={v.checkOut ? 'text-primary' : 'text-gray-300'}>{v.checkOut || '--:--'}</span>
          </div>
        </td>
        <td className="px-8 py-6 text-right">
          <span className="text-[10px] font-black text-dark bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
            {v.visitDate || v.visit_date}
          </span>
        </td>
      </tr>
    )) : (
      <tr>
        <td colSpan="5" className="px-8 py-10 text-center">
          <p className="text-secondary text-sm font-bold">{emptyText}</p>
        </td>
      </tr>
    )
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container-max space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-8 border-b border-gray-100">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest border border-primary/10">
              Audit & Analytics
            </div>
            <h1 className="text-4xl font-black text-dark tracking-tight">System Reports</h1>
            <p className="text-secondary text-lg">Detailed logs and performance metrics for campus activities.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none min-w-[200px]">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
              <input 
                type="date"
                className="input-field pl-12 py-2.5 text-sm font-bold shadow-sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 font-bold text-sm h-[46px] shadow-sm"
              onClick={downloadExcelReport}
              isLoading={isExporting}
              disabled={loading}
            >
              <Download size={18} />
              <span>Export Dataset</span>
            </Button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-gray-100/50 p-1.5 rounded-2xl w-full max-w-md shadow-inner">
          <button
            onClick={() => setReportType('visitors')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
              reportType === 'visitors' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-dark'
            }`}
          >
            <Users size={14} />
            Visitor Logs
          </button>
          <button
            onClick={() => setReportType('lectures')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
              reportType === 'lectures' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-dark'
            }`}
          >
            <BookOpen size={14} />
            Lecture History
          </button>
        </div>

        {/* Table Content */}
        <Card noPadding className="overflow-hidden border-none shadow-card bg-white">
          <div className="overflow-x-auto">
            {reportType === 'visitors' ? (
              <div className="space-y-8 p-6">
                {loading ? (
                  <div className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 grayscale opacity-30 animate-pulse">
                      <FileText size={48} />
                      <p className="font-black text-[10px] uppercase tracking-[0.2em]">Synchronizing Records...</p>
                    </div>
                  </div>
                ) : filteredVisitors.length > 0 ? (
                  <>
                    <div className="rounded-2xl border border-success/20 overflow-hidden">
                      <div className="px-6 py-4 bg-success/5 border-b border-success/10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-success">Inside Campus (Entered, Not Exited)</p>
                      </div>
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/60 border-b border-gray-100">
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Visitor Details</th>
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Purpose & Host</th>
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Status</th>
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Check In/Out</th>
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          <VisitorRows rows={insideVisitors} emptyText="No visitor is currently inside." />
                        </tbody>
                      </table>
                    </div>

                    <div className="rounded-2xl border border-primary/20 overflow-hidden">
                      <div className="px-6 py-4 bg-primary/5 border-b border-primary/10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Exited Visitors</p>
                      </div>
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/60 border-b border-gray-100">
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Visitor Details</th>
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Purpose & Host</th>
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Status</th>
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Check In/Out</th>
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          <VisitorRows rows={exitedVisitors} emptyText="No exited visitor records found." />
                        </tbody>
                      </table>
                    </div>

                    <div className="rounded-2xl border border-warning/20 overflow-hidden">
                      <div className="px-6 py-4 bg-warning/5 border-b border-warning/10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-warning">No Entry Logged Yet</p>
                      </div>
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/60 border-b border-gray-100">
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Visitor Details</th>
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Purpose & Host</th>
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Status</th>
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Check In/Out</th>
                            <th className="px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          <VisitorRows rows={noEntryVisitors} emptyText="All listed visitors have entry logs." />
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="h-20 w-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 shadow-inner">
                        <Users size={40} />
                      </div>
                      <div>
                        <p className="text-dark font-black text-lg">No visitor logs found</p>
                        <p className="text-secondary text-sm mt-1">Try adjusting the date filter or switch reports.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="px-8 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Lecture Topic</th>
                    <th className="px-8 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Speaker & Venue</th>
                    <th className="px-8 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Financials</th>
                    <th className="px-8 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-24 text-center text-gray-400 animate-pulse font-black text-[10px] uppercase tracking-widest">
                        Generating Analytics...
                      </td>
                    </tr>
                  ) : filteredLectures.length > 0 ? filteredLectures.map((l) => (
                    <tr key={l.id} className="hover:bg-primary/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                         <span className="font-black text-dark text-sm">{l.topic}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-dark text-xs">{l.speakerName}</span>
                          <span className="text-[10px] font-black text-primary uppercase tracking-wider mt-1">{l.venue}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-baseline gap-1">
                            <span className="text-[10px] font-black text-primary">INR</span>
                            <span className="font-black text-dark text-sm">
                              {parseFloat(l.totalExpenses || 0).toLocaleString('en-IN')}
                            </span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        {l.deleted_at || l.deletedAt ? (
                          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-danger/5 text-danger border border-danger/20">
                            Archived
                          </span>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            l.status === 'completed' ? 'bg-success/5 text-success border-success/20' :
                            l.status === 'cancelled' ? 'bg-danger/5 text-danger border-danger/20' :
                            'bg-primary/5 text-primary border-primary/20'
                          }`}>
                            {l.status}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-[10px] font-black text-dark bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                          {l.lecture_date || new Date(l.dateTime).toISOString().split('T')[0]}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center gap-6">
                          <div className="h-20 w-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 shadow-inner">
                            <BookOpen size={40} />
                          </div>
                          <p className="text-dark font-black text-lg">No lecture records identified</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
