import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Download, Calendar as CalendarIcon, FileText, Users, BookOpen, ChevronDown, ChevronUp, Receipt, CheckSquare } from 'lucide-react';
import api from '../utils/api';

const Reports = () => {
  const [visitors, setVisitors] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reportType, setReportType] = useState('visitors'); // 'visitors' or 'lectures'
  const [expandedLectureId, setExpandedLectureId] = useState(null);
  const [expandedVisitorId, setExpandedVisitorId] = useState(null);

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
        const headers = ['Visitor Name', 'Phone', 'Category', 'Dept', 'Purpose', 'Host', 'Status', 'Check In', 'Check Out', 'Visit Date', 'Student Name', 'Student Roll'];
        const mapVisitorRow = (v) => ([
          v.name || 'N/A',
          v.phone || 'N/A',
          v.visitorCategory || v.visitor_category || 'N/A',
          v.department || 'N/A',
          v.purpose || 'N/A',
          v.personToMeet || v.person_to_meet || 'N/A',
          v.status || 'N/A',
          v.checkIn || 'Pending',
          v.checkOut || 'Pending',
          v.visitDate || v.visit_date || 'N/A',
          v.studentName || v.student_name || 'N/A',
          v.studentRoll || v.student_roll || 'N/A'
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
          l.deleted_at || l.deletedAt ? 'archived' : (l.status || 'completed'),
          Number.parseFloat(l.totalExpenses || 0).toFixed(2)
        ]));

        workbookSheets.push(buildWorksheetXml('Lecture_History', headers, lectureRows));

        const expenseHeaders = ['Lecture Topic', 'Expense Description', 'Amount (INR)'];
        const expenseRows = [];
        filteredLectures.forEach(l => {
          if (l.expenses && l.expenses.length > 0) {
            l.expenses.forEach(e => {
              expenseRows.push([l.topic, e.description, e.amount.toString()]);
            });
          }
        });
        if (expenseRows.length > 0) {
          workbookSheets.push(buildWorksheetXml('Detailed_Expenses', expenseHeaders, expenseRows));
        }

        const checklistHeaders = ['Lecture Topic', 'Task/Item', 'Status'];
        const checklistRows = [];
        filteredLectures.forEach(l => {
          if (l.checklists && l.checklists.length > 0) {
            l.checklists.forEach(c => {
              checklistRows.push([l.topic, c.item_name, c.status]);
            });
          }
        });
        if (checklistRows.length > 0) {
          workbookSheets.push(buildWorksheetXml('Lecture_Checklists', checklistHeaders, checklistRows));
        }
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

  const toggleExpandLecture = (id) => {
    setExpandedLectureId(expandedLectureId === id ? null : id);
  };

  const toggleExpandVisitor = (id) => {
    setExpandedVisitorId(expandedVisitorId === id ? null : id);
  };

  const VisitorRows = ({ rows, emptyText }) => (
    rows.length > 0 ? rows.map((v) => (
      <React.Fragment key={v.id}>
        <tr 
          className={`hover:bg-primary/[0.02] transition-colors group cursor-pointer ${expandedVisitorId === v.id ? 'bg-primary/[0.03]' : ''}`}
          onClick={() => toggleExpandVisitor(v.id)}
        >
          <td className="px-8 py-6">
            <div className="flex flex-col">
              <span className="font-black text-dark text-sm">{v.name}</span>
              <span className="text-[10px] font-bold text-gray-400 tracking-tight">{v.phone}</span>
            </div>
          </td>
          <td className="px-8 py-6">
            <div className="flex flex-col">
              <span className="font-bold text-dark text-xs">{v.purpose}</span>
              <span className="text-[10px] font-black text-primary uppercase tracking-wider mt-1">{v.personToMeet || v.person_to_meet}</span>
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
            <div className="flex items-center justify-end gap-4">
              <span className="text-[10px] font-black text-dark bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                {v.visitDate || v.visit_date}
              </span>
              {expandedVisitorId === v.id ? <ChevronUp size={14} className="text-primary" /> : <ChevronDown size={14} className="text-gray-300" />}
            </div>
          </td>
        </tr>
        {expandedVisitorId === v.id && (
          <tr>
            <td colSpan="5" className="px-8 py-6 bg-gray-50/50 border-y border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Context</p>
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-dark"><span className="text-gray-400 font-medium">Category:</span> {v.visitorCategory || v.visitor_category || 'Guest'}</p>
                      <p className="text-xs font-bold text-dark"><span className="text-gray-400 font-medium">Department:</span> {v.department || 'N/A'}</p>
                   </div>
                </div>
                <div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Student</p>
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-dark"><span className="text-gray-400 font-medium">Name:</span> {v.studentName || v.student_name || 'N/A'}</p>
                      <p className="text-xs font-bold text-dark"><span className="text-gray-400 font-medium">Roll:</span> {v.studentRoll || v.student_roll || 'N/A'}</p>
                   </div>
                </div>
                <div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact</p>
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-dark truncate"><span className="text-gray-400 font-medium">Email:</span> {v.email || 'N/A'}</p>
                      {v.idProof && (
                        <a href={v.idProof.startsWith('http') ? v.idProof : `${api.defaults.baseURL.replace('/api', '')}${v.idProof}`} target="_blank" rel="noreferrer" className="text-[10px] font-black text-primary uppercase underline hover:text-dark">ID Proof</a>
                      )}
                   </div>
                </div>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
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

        <div className="flex bg-gray-100/50 p-1.5 rounded-2xl w-full max-w-md shadow-inner border border-gray-200/50">
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

        <Card noPadding className="overflow-hidden border-none shadow-card bg-white rounded-[2rem]">
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
                      <div className="px-6 py-4 bg-success/5 border-b border-success/10 flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-success">Inside Campus</p>
                        <span className="text-[10px] font-black text-success/60 bg-white/50 px-2 py-0.5 rounded-lg border border-success/10">{insideVisitors.length} Active</span>
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
                      <div className="px-6 py-4 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Archived Access Logs</p>
                        <span className="text-[10px] font-black text-primary/60 bg-white/50 px-2 py-0.5 rounded-lg border border-primary/10">{exitedVisitors.length} Records</span>
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
                      <div className="px-6 py-4 bg-warning/5 border-b border-warning/10 flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-warning">Pending Entry</p>
                        <span className="text-[10px] font-black text-warning/60 bg-white/50 px-2 py-0.5 rounded-lg border border-warning/10">{noEntryVisitors.length} Awaiting</span>
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
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-24 text-center text-gray-400 animate-pulse font-black text-[10px] uppercase tracking-widest">
                        Generating Analytics...
                      </td>
                    </tr>
                  ) : filteredLectures.length > 0 ? filteredLectures.map((l) => (
                    <React.Fragment key={l.id}>
                      <tr 
                        className={`hover:bg-primary/[0.02] transition-colors group cursor-pointer ${expandedLectureId === l.id ? 'bg-primary/[0.03]' : ''}`}
                        onClick={() => toggleExpandLecture(l.id)}
                      >
                        <td className="px-8 py-6">
                           <span className="font-black text-dark text-sm leading-tight block max-w-xs">{l.topic}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-dark text-xs">{l.speakerName || l.speaker_name}</span>
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
                            {l.lecture_date || (l.dateTime ? new Date(l.dateTime).toISOString().split('T')[0] : 'N/A')}
                          </span>
                        </td>
                        <td className="px-4 py-6">
                          {expandedLectureId === l.id ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} className="text-gray-300" />}
                        </td>
                      </tr>
                      {expandedLectureId === l.id && (
                        <tr>
                          <td colSpan="6" className="px-8 py-8 bg-gray-50/50 border-y border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                  <Receipt size={16} className="text-primary" />
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-dark">Financials</h4>
                                </div>
                                {l.expenses && l.expenses.length > 0 ? (
                                  <div className="space-y-2">
                                    {l.expenses.map((exp, idx) => (
                                      <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <span className="text-xs font-bold text-secondary">{exp.description}</span>
                                        <span className="text-xs font-black text-dark">₹{parseFloat(exp.amount).toLocaleString('en-IN')}</span>
                                      </div>
                                    ))}
                                    <div className="flex justify-between items-center p-3 bg-primary/5 rounded-xl border border-primary/10 mt-4">
                                      <span className="text-xs font-black text-primary">Total</span>
                                      <span className="text-sm font-black text-primary">₹{parseFloat(l.totalExpenses).toLocaleString('en-IN')}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-[10px] font-bold text-gray-400 italic">No expense records.</p>
                                )}
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                                  <CheckSquare size={16} className="text-primary" />
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-dark">Checklist</h4>
                                </div>
                                {l.checklists && l.checklists.length > 0 ? (
                                  <div className="space-y-2">
                                    {l.checklists.map((item, idx) => (
                                      <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <span className="text-xs font-bold text-secondary">{item.item_name}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                                          item.status === 'ready' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                        }`}>
                                          {item.status}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-[10px] font-bold text-gray-400 italic">No checklist items.</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-gray-100">
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div>
                                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Department</p>
                                     <p className="text-xs font-bold text-dark">{l.department}</p>
                                  </div>
                                  <div>
                                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Assignee</p>
                                     <p className="text-xs font-bold text-dark">{l.assignee_name || 'N/A'}</p>
                                  </div>
                                  <div>
                                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Description</p>
                                     <p className="text-xs font-bold text-dark line-clamp-2">{l.description || 'No description.'}</p>
                                  </div>
                               </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-8 py-32 text-center">
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
