import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiPlus,
  HiPencilSquare,
  HiTrash,
  HiUsers,
  HiEnvelope,
  HiPhone,
  HiMapPin,
  HiAcademicCap,
  HiArrowDownTray,
  HiDocumentArrowDown,
  HiMagnifyingGlass,
  HiFunnel,
  HiChevronDown,
  HiChevronUp,
  HiIdentification
} from 'react-icons/hi2';
import apiService from '../../services/api';
import LoadingDots from '../LoadingDots';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', cost: '', published: false });
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRowId, setExpandedRowId] = useState(null);


  useEffect(() => {
    loadCourses();
    loadEnrollments();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await apiService.courses.listCourses();
      const list = Array.isArray(response?.courses) ? response.courses : (Array.isArray(response) ? response : []);
      const processed = list.map(course => ({
        ...course,
        published: Boolean(course.published ?? course.is_published ?? false)
      }));
      setCourses(processed);
    } catch (e) {
      console.error('Failed to load courses:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = () => {
    try {
      setEnrollmentsLoading(true);
      const stored = localStorage.getItem('courseEnrollments');
      if (!stored) {
        setEnrollments([]);
        return;
      }
      const parsed = JSON.parse(stored);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      const normalized = list.map((enr, idx) => ({
        ...enr,
        id: enr.id || `ENR-${Date.now()}-${idx + 1}`,
        enrollmentDate: enr.enrollmentDate || new Date().toISOString(),
        status: enr.status || 'Active'
      }));
      setEnrollments(normalized);
    } catch (e) {
      console.error('Failed to load enrollments:', e);
      setEnrollments([]);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString('en-KE', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    const n = Number(amount || 0);
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await apiService.courses.editCourse(editingCourse.id, courseForm);
      } else {
        await apiService.courses.addCourse({ ...courseForm, cost: Number(courseForm.cost) });
      }
      setCourseForm({ title: '', description: '', cost: '', published: false });
      setEditingCourse(null);
      setShowForm(false);
      loadCourses();
    } catch (e) {
      console.error('Failed to save course:', e);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      cost: course.cost ?? '',
      published: Boolean(course.published)
    });
    setShowForm(true);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await apiService.courses.deleteCourse(id);
      loadCourses();
    } catch (e) {
      console.error('Failed to delete course:', e);
    }
  };

  const filteredEnrollments = enrollments.filter((enr) => {
    const s = searchTerm.trim().toLowerCase();
    const matchesSearch = !s || [
      enr.firstName, enr.otherNames, enr.email, enr.phoneNumber, enr.selectedModule
    ].some(v => String(v || '').toLowerCase().includes(s));
    const matchesStatus = filterStatus === 'all' || (enr.status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const downloadCSV = () => {
    const headers = [
      'ID','First Name','Other Names','Gender','Year of Birth','Email','Phone','Other Phone','Address','City','Country','Church','Membership Duration','Course','Cost','Enrollment Date','Status'
    ];
    const rows = filteredEnrollments.map(enr => ([
      enr.id,
      enr.firstName || '',
      enr.otherNames || '',
      enr.gender || '',
      enr.yearOfBirth || '',
      enr.email || '',
      enr.phoneNumber || '',
      enr.otherNumber || '',
      (enr.homeAddress || '').replace(/,/g, ' '),
      enr.city || '',
      enr.country || '',
      (enr.church || '').replace(/,/g, ' '),
      (enr.membershipDuration || '').replace(/,/g, ' '),
      (enr.selectedModule || '').replace(/,/g, ' '),
      enr.courseCost || '',
      formatDate(enr.enrollmentDate),
      enr.status || 'Active'
    ].join(',')));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `course-enrollments-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const w = window.open('', '_blank');
    const table = document.querySelector('.enrollments-table');
    const html = table ? table.outerHTML : '<p>No enrollments</p>';
    w.document.write(`<!doctype html><html><head><title>Course Enrollments</title>
      <style>
        body{font-family:Arial,sans-serif;margin:24px}
        h1{margin:0 0 8px;color:#333}
        p{margin:0 0 12px;color:#666}
        table{width:100%;border-collapse:collapse;font-size:12px}
        th,td{border:1px solid #ddd;padding:8px;text-align:left}
        th{background:#f5f7fa}
        .status-badge{padding:2px 6px;border-radius:10px;font-size:10px}
        .active{background:#d4edda;color:#155724;border:1px solid #c3e6cb}
        .pending{background:#fff3cd;color:#856404;border:1px solid #ffeaa7}
        .completed{background:#d1ecf1;color:#0c5460;border:1px solid #bee5eb}
      </style>
    </head><body>
      <h1>Course Enrollments</h1>
      <p>Generated on ${new Date().toLocaleString()}</p>
      ${html}
    </body></html>`);
    w.document.close();
    w.print();
  };

  const toggleExpandRow = (rowId) => {
    setExpandedRowId(prev => (prev === rowId ? null : rowId));
  };

  const renderCoursesTab = () => (
    <div className="p-0">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Course Management</h2>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-emerald-600" onClick={() => { setShowForm(true); setEditingCourse(null); setCourseForm({ title: '', description: '', cost: '', published: false }); }}>
          <HiPlus /> Add Course
        </motion.button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <form onSubmit={handleCourseSubmit} className="space-y-3">
            <div className="text-sm font-semibold text-gray-900">{editingCourse ? 'Edit Course' : 'Add New Course'}</div>
            <div>
              <label className="block text-sm text-gray-700">Title</label>
              <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200" value={courseForm.title} onChange={(e)=>setCourseForm({ ...courseForm, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Description</label>
              <textarea className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200" value={courseForm.description} onChange={(e)=>setCourseForm({ ...courseForm, description: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Cost (KES)</label>
              <input type="number" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200" value={courseForm.cost} onChange={(e)=>setCourseForm({ ...courseForm, cost: e.target.value })} required />
            </div>
            <div className="flex items-center gap-2">
              <input id="published" type="checkbox" checked={Boolean(courseForm.published)} onChange={(e)=>setCourseForm({ ...courseForm, published: e.target.checked })} />
              <label htmlFor="published" className="text-sm text-gray-700">Published</label>
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" className="inline-flex items-center rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600">{editingCourse ? 'Update Course' : 'Add Course'}</button>
              <button type="button" className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={()=>{ setShowForm(false); setEditingCourse(null); setCourseForm({ title:'', description:'', cost:'', published:false }); }}>Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="grid place-items-center rounded-xl border border-emerald-100 bg-white p-6 shadow-sm"><LoadingDots text="Loading courses..." /></div>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{course.title}</h3>
                <p className="mt-1 text-sm text-gray-700">{course.description}</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-900">{formatCurrency(course.cost)}</span>
                  <span className="text-xs text-gray-600">ID: {course.id}</span>
                  <span className={`ml-auto text-xs font-semibold ${course.published ? 'text-emerald-700' : 'text-amber-700'}`}>{course.published ? 'Published' : 'Draft'}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50" onClick={()=>handleEditCourse(course)}><HiPencilSquare /> Edit</button>
                  <button className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700" onClick={()=>handleDeleteCourse(course.id)}><HiTrash /> Delete</button>
                  <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50" onClick={async ()=>{ try { const payload = { title: course.title, description: course.description, cost: course.cost, published: !course.published }; await apiService.courses.editCourse(course.id, payload); loadCourses(); } catch (e) { console.error('Failed to toggle publish:', e); } }}>{course.published ? 'Unpublish' : 'Publish'}</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEnrollmentsTab = () => (
    <div className="p-0">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Student Enrollments</h2>
          <p className="text-sm text-gray-700">Manage and view all course enrollments</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={downloadCSV}>
            <HiArrowDownTray /> Export CSV
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600" onClick={downloadPDF}>
            <HiDocumentArrowDown /> Download PDF
          </motion.button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative">
          <HiMagnifyingGlass className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="w-64 rounded-md border border-gray-300 pl-8 pr-2 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200" placeholder="Search enrollments..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
        </div>
        <div>
          <select className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200" value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {enrollmentsLoading ? (
        <div className="grid place-items-center rounded-xl border border-emerald-100 bg-white p-6 shadow-sm"><LoadingDots text="Loading enrollments..." /></div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-emerald-100 bg-white p-6 text-center text-sm text-gray-700 shadow-sm"><HiUsers className="mb-2 text-2xl" /><h3 className="font-semibold text-gray-900">No Enrollments Found</h3><p>No student enrollments match your search criteria.</p></div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-3 py-2"><h3 className="text-sm font-semibold text-gray-900">Enrollment Details ({filteredEnrollments.length} students)</h3><div className="text-xs text-gray-600">Ready to export</div></div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-emerald-50 text-gray-900">
                <tr>
                  <th className="px-3 py-2"></th>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Student</th>
                  <th className="px-3 py-2">Contact</th>
                  <th className="px-3 py-2">Course</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEnrollments.map((enr, i) => {
                  const rowKey = enr.id || `ENR-${i+1}`;
                  return (
                    <React.Fragment key={rowKey}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-3 py-2" data-label="">
                          <button className={`inline-flex items-center rounded-md border px-2 py-1 text-xs ${expandedRowId === rowKey ? 'border-emerald-600 text-emerald-700' : 'border-gray-300 hover:bg-gray-50'}`} onClick={() => toggleExpandRow(rowKey)} aria-label="Toggle details">
                            {expandedRowId === rowKey ? <HiChevronUp /> : <HiChevronDown />}
                          </button>
                        </td>
                        <td className="px-3 py-2" data-label="ID">{rowKey}</td>
                        <td className="px-3 py-2" data-label="Student">
                          <div className="text-sm font-medium text-gray-900">{enr.firstName || 'N/A'}</div>
                          <div className="text-xs text-gray-600">{enr.otherNames || 'No other names'}</div>
                          <div className="text-xs text-gray-600">Gender: {enr.gender || 'N/A'} • Age: {enr.yearOfBirth ? new Date().getFullYear() - Number(enr.yearOfBirth) : 'N/A'}</div>
                    </td>
                        <td className="px-3 py-2" data-label="Contact">
                          <div className="text-xs text-gray-700 flex items-center gap-1"><HiEnvelope /> <span>{enr.email || 'N/A'}</span></div>
                          <div className="text-xs text-gray-700 flex items-center gap-1"><HiPhone /> <span>{enr.phoneNumber || 'N/A'}</span></div>
                          {enr.otherNumber && (<div className="text-xs text-gray-700 flex items-center gap-1"><HiPhone /> <span>{enr.otherNumber}</span></div>)}
                    </td>
                        <td className="px-3 py-2" data-label="Course">
                          <div className="text-sm font-medium text-gray-900">{enr.selectedModule || 'N/A'}</div>
                          <div className="text-xs text-gray-600">Cost: {formatCurrency(enr.courseCost || 0)} {enr.church && <>• Church: {enr.church}</>}</div>
                    </td>
                        <td className="px-3 py-2" data-label="Location">
                          <div className="text-xs text-gray-700 flex items-center gap-1"><HiMapPin /> <span>{enr.city || 'N/A'}, {enr.country || 'N/A'}</span></div>
                          {enr.homeAddress && (<div className="text-xs text-gray-700">Address: {enr.homeAddress}</div>)}
                    </td>
                        <td className="px-3 py-2" data-label="Date">{formatDate(enr.enrollmentDate)}</td>
                        <td className="px-3 py-2" data-label="Status"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ${String(enr.status || 'active').toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : String(enr.status || '').toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-700 ring-amber-100' : 'bg-sky-50 text-sky-700 ring-sky-100'}`}>{enr.status || 'Active'}</span></td>
                      </tr>
                      {expandedRowId === rowKey && (
                        <tr className="bg-gray-50/60">
                          <td colSpan={8} className="px-3 py-3">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                              <div className="rounded-md border border-gray-200 bg-white p-3">
                                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-900"><HiIdentification /> Identity</div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                                  <div><span className="text-gray-500">First name</span><div className="font-semibold text-gray-900">{enr.firstName || 'N/A'}</div></div>
                                  <div><span className="text-gray-500">Other names</span><div className="font-semibold text-gray-900">{enr.otherNames || 'N/A'}</div></div>
                                  <div><span className="text-gray-500">Gender</span><div className="font-semibold text-gray-900">{enr.gender || 'N/A'}</div></div>
                                  <div><span className="text-gray-500">Year of birth</span><div className="font-semibold text-gray-900">{enr.yearOfBirth || 'N/A'}</div></div>
                                </div>
                              </div>
                              <div className="rounded-md border border-gray-200 bg-white p-3">
                                <div className="mb-1 text-sm font-semibold text-gray-900">Contact</div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                                  <div><span className="text-gray-500">Email</span><div className="font-semibold text-gray-900">{enr.email || 'N/A'}</div></div>
                                  <div><span className="text-gray-500">Phone</span><div className="font-semibold text-gray-900">{enr.phoneNumber || 'N/A'}</div></div>
                                  <div><span className="text-gray-500">Other phone</span><div className="font-semibold text-gray-900">{enr.otherNumber || '—'}</div></div>
                                </div>
                              </div>
                              <div className="rounded-md border border-gray-200 bg-white p-3">
                                <div className="mb-1 text-sm font-semibold text-gray-900">Address</div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                                  <div><span className="text-gray-500">Address</span><div className="font-semibold text-gray-900">{enr.homeAddress || 'N/A'}</div></div>
                                  <div><span className="text-gray-500">City</span><div className="font-semibold text-gray-900">{enr.city || 'N/A'}</div></div>
                                  <div><span className="text-gray-500">Country</span><div className="font-semibold text-gray-900">{enr.country || 'N/A'}</div></div>
                                </div>
                              </div>
                              <div className="rounded-md border border-gray-200 bg-white p-3">
                                <div className="mb-1 text-sm font-semibold text-gray-900">Course</div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                                  <div><span className="text-gray-500">Module</span><div className="font-semibold text-gray-900">{enr.selectedModule || 'N/A'}</div></div>
                                  <div><span className="text-gray-500">Cost</span><div className="font-semibold text-gray-900">{formatCurrency(enr.courseCost || 0)}</div></div>
                                  <div><span className="text-gray-500">Enrollment</span><div className="font-semibold text-gray-900">{formatDate(enr.enrollmentDate)}</div></div>
                                  <div><span className="text-gray-500">Status</span><div className="font-semibold text-gray-900">{enr.status || 'Active'}</div></div>
                                  {enr.church && <div><span className="text-gray-500">Church</span><div className="font-semibold text-gray-900">{enr.church}</div></div>}
                                  {enr.membershipDuration && <div><span className="text-gray-500">Membership</span><div className="font-semibold text-gray-900">{enr.membershipDuration}</div></div>}
                                </div>
                              </div>
                            </div>
                          </td>
                  </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <div className="mb-3 inline-flex rounded-md border border-emerald-100 bg-white p-1 shadow-sm">
        <button className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${activeTab === 'courses' ? 'bg-emerald-700 text-white' : 'text-gray-700 hover:bg-gray-50'}`} onClick={()=>setActiveTab('courses')}>
          <HiAcademicCap /> Courses
        </button>
        <button className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${activeTab === 'enrollments' ? 'bg-emerald-700 text-white' : 'text-gray-700 hover:bg-gray-50'}`} onClick={()=>setActiveTab('enrollments')}>
          <HiUsers /> Enrollments ({enrollments.length})
        </button>
      </div>

      {activeTab === 'courses' ? renderCoursesTab() : renderEnrollmentsTab()}
    </div>
  );
};

export default Courses;
