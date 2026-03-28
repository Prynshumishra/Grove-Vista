import { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckSquare, LayoutDashboard, Building,
  ArrowUpRight, Plus, Pencil, Trash2, Loader2, 
  UserPlus, ListTodo, Contact, X, CalendarCheck, MapPin, Bed, Bath, Square
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE = `${API_URL}/api/dashboard`;

// ──── Modal (portal-based for correct centering) ────
const Modal = ({ isOpen, onClose, title, children }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-[#0c1322] border border-white/10 rounded-2xl p-5 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

// ──── Skeletons ────
const SkeletonCard = () => (
  <div className="glass p-6 rounded-3xl border border-white/5 animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="h-4 bg-white/10 rounded w-28"></div>
      <div className="w-12 h-12 bg-white/10 rounded-2xl"></div>
    </div>
    <div className="h-10 bg-white/10 rounded w-24 mb-3"></div>
    <div className="h-4 bg-white/10 rounded w-32"></div>
  </div>
);

const SkeletonRow = () => (
  <tr>
    <td className="p-4 sm:p-5 pl-4 sm:pl-6"><div className="h-4 bg-white/10 rounded w-40 animate-pulse"></div></td>
    <td className="p-4 sm:p-5"><div className="h-4 bg-white/10 rounded w-32 animate-pulse"></div></td>
    <td className="p-4 sm:p-5"><div className="h-4 bg-white/10 rounded w-24 animate-pulse"></div></td>
    <td className="p-4 sm:p-5 pr-4 sm:pr-6"><div className="h-6 bg-white/10 rounded-full w-20 animate-pulse"></div></td>
  </tr>
);

// ──── Status Badge ────
const StatusBadge = ({ status }) => {
  const colors = {
    'Active': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    'Inactive': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    'New': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Contacted': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Qualified': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    'Pending': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Completed': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    'High': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Medium': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'Low': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider border ${colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>{status}</span>;
};

// ──── Dashboard Page ────
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [apiLoading, setApiLoading] = useState(false);

  const [summary, setSummary] = useState({ leads: 0, tasks: 0, users: 0, properties: 0 });
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const token = user?.token;
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_BASE}/summary`, { headers });
      const data = await res.json();
      if (res.ok && data.leads > 0) {
        setSummary(data);
      } else {
        setSummary({ leads: 7, tasks: 4, users: 5, properties: 4 });
      }
    } catch (e) { 
      setSummary({ leads: 7, tasks: 4, users: 5, properties: 4 });
    }
  };

  const fetchData = async (endpoint, setter) => {
    setApiLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, { headers });
      const data = await res.json();
      if (res.ok && Array.isArray(data) && data.length > 0) {
        setter(data);
      } else {
        // Use initial data as fallback if API is empty
        if (endpoint === 'leads') setter(FALLBACK_LEADS);
        if (endpoint === 'tasks') setter(FALLBACK_TASKS);
        if (endpoint === 'users') setter(FALLBACK_USERS);
      }
    } catch (e) { 
      if (endpoint === 'leads') setter(FALLBACK_LEADS);
      if (endpoint === 'tasks') setter(FALLBACK_TASKS);
      if (endpoint === 'users') setter(FALLBACK_USERS);
    }
    setApiLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      await fetchSummary();
      await fetchBookings();
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/bookings`, { headers });
      if (res.ok) setBookings(await res.json());
    } catch (e) { /* silent */ }
  };

  const cancelBooking = async (id) => {
    setApiLoading(true);
    try {
      await fetch(`${API_URL}/api/bookings/${id}`, { method: 'DELETE', headers });
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (e) { /* silent */ }
    setApiLoading(false);
  };

  useEffect(() => {
    if (!loading && token) {
      if (activeTab === 'leads') fetchData('leads', setLeads);
      if (activeTab === 'tasks') fetchData('tasks', setTasks);
      if (activeTab === 'users') fetchData('users', setUsers);
      if (activeTab === 'properties') fetchDataProperties();
      if (activeTab === 'bookings') fetchBookings();
      if (activeTab === 'overview') { fetchSummary(); fetchBookings(); }
    }
  }, [activeTab, loading]);

const FALLBACK_LEADS = [
  { id: 1, name: 'Vikram Singhania', email: 'vikram@techventures.in', phone: '+91 98765 43210', status: 'New', source: 'Website' },
  { id: 2, name: 'Ananya Desai', email: 'ananya@desaicapital.com', phone: '+91 87654 32109', status: 'Contacted', source: 'Referral' },
  { id: 3, name: 'Rahul Mehta', email: 'rahul@meridian.com', phone: '+91 76543 21098', status: 'Qualified', source: 'LinkedIn' },
];
const FALLBACK_TASKS = [
  { id: 1, title: 'Follow up with Vikram Singhania', priority: 'High', status: 'Pending', dueDate: '2026-04-02' },
  { id: 2, title: 'Schedule property viewing', priority: 'Medium', status: 'In Progress', dueDate: '2026-04-05' },
];
const FALLBACK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@grovevista.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Ravi Kumar', email: 'ravi@grovevista.com', role: 'Portfolio Manager', status: 'Active' },
];
const FALLBACK_PROPERTIES = [
  { _id: 'f1', title: 'Sky-High Penthouse', location: 'Worli, Mumbai', price: 450000000, beds: 5, baths: 6, sqft: 8500, type: 'Penthouse', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=80', description: 'Luxury living.' },
  { _id: 'f2', title: 'Azure Bay Mansion', location: 'Alibaug, Maharashtra', price: 280000000, beds: 6, baths: 7, sqft: 12000, type: 'Mansion', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80', description: 'Beachfront mansion.' },
  { _id: 'f3', title: 'Royal Heritage Villa', location: 'Udaipur, Rajasthan', price: 150000000, beds: 4, baths: 5, sqft: 6000, type: 'Villa', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80', description: 'Heritage luxury.' }
];

  const fetchDataProperties = async () => {
    setApiLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/properties`, { headers });
      const data = await res.json();
      if (res.ok && Array.isArray(data) && data.length > 0) {
        setProperties(data);
      } else {
        setProperties(FALLBACK_PROPERTIES);
      }
    } catch (e) { 
      console.error('Error fetching properties:', e);
      setProperties(FALLBACK_PROPERTIES);
    }
    setApiLoading(false);
  };

  // ──── CRUD ────
  const openAdd = (defaults = {}) => { setModalMode('add'); setEditingItem(null); setFormData(defaults); setModalOpen(true); };
  const openEdit = (item) => { setModalMode('edit'); setEditingItem(item); setFormData({ ...item }); setModalOpen(true); };

  const handleSave = async () => {
    const endpoint = activeTab;
    setApiLoading(true);
    try {
      if (modalMode === 'add') {
        const urlSplit = endpoint === 'properties' ? `${API_URL}/api/properties` : `${API_BASE}/${endpoint}`;
        const res = await fetch(urlSplit, { method: 'POST', headers, body: JSON.stringify(formData) });
        if (res.ok) {
          const newItem = await res.json();
          if (endpoint === 'leads') setLeads(prev => [...prev, newItem]);
          if (endpoint === 'tasks') setTasks(prev => [...prev, newItem]);
          if (endpoint === 'users') setUsers(prev => [...prev, newItem]);
          if (endpoint === 'properties') setProperties(prev => [...prev, newItem]);
        }
      } else {
        const urlSplit = endpoint === 'properties' ? `${API_URL}/api/properties/${editingItem._id}` : `${API_BASE}/${endpoint}/${editingItem.id}`;
        const res = await fetch(urlSplit, { method: 'PUT', headers, body: JSON.stringify(formData) });
        if (res.ok) {
          const updated = await res.json();
          if (endpoint === 'leads') setLeads(prev => prev.map(i => i.id === updated.id ? updated : i));
          if (endpoint === 'tasks') setTasks(prev => prev.map(i => i.id === updated.id ? updated : i));
          if (endpoint === 'users') setUsers(prev => prev.map(i => i.id === updated.id ? updated : i));
          if (endpoint === 'properties') setProperties(prev => prev.map(i => i._id === updated._id ? updated : i));
        }
      }
    } catch (e) { /* silent */ }
    setApiLoading(false);
    setModalOpen(false);
    fetchSummary();
  };

  const handleDelete = async (id) => {
    const endpoint = activeTab;
    setApiLoading(true);
    try {
      const urlSplit = endpoint === 'properties' ? `${API_URL}/api/properties/${id}` : `${API_BASE}/${endpoint}/${id}`;
      await fetch(urlSplit, { method: 'DELETE', headers });
      if (endpoint === 'leads') setLeads(prev => prev.filter(i => i.id !== id));
      if (endpoint === 'tasks') setTasks(prev => prev.filter(i => i.id !== id));
      if (endpoint === 'users') setUsers(prev => prev.filter(i => i.id !== id));
      if (endpoint === 'properties') setProperties(prev => prev.filter(i => i._id !== id));
    } catch (e) { /* silent */ }
    setApiLoading(false);
    fetchSummary();
  };

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const InputField = ({ label, field, type = 'text', placeholder = '' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <input type={type} value={formData[field] || ''} onChange={e => updateForm(field, e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all placeholder-gray-600"
        placeholder={placeholder} />
    </div>
  );

  const SelectField = ({ label, field, options }) => (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <select value={formData[field] || options[0]} onChange={e => updateForm(field, e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all">
        {options.map(o => <option key={o} value={o} className="bg-gray-900">{o}</option>)}
      </select>
    </div>
  );

  const renderModalForm = () => {
    if (activeTab === 'leads') return (
      <div className="space-y-4">
        <InputField label="Name" field="name" placeholder="Full name" />
        <InputField label="Email" field="email" type="email" placeholder="email@example.com" />
        <InputField label="Phone" field="phone" placeholder="+91 XXXXX XXXXX" />
        <SelectField label="Status" field="status" options={['New', 'Contacted', 'Qualified']} />
        <SelectField label="Source" field="source" options={['Website', 'Referral', 'LinkedIn', 'Other']} />
      </div>
    );
    if (activeTab === 'tasks') return (
      <div className="space-y-4">
        <InputField label="Title" field="title" placeholder="Task description" />
        <SelectField label="Priority" field="priority" options={['High', 'Medium', 'Low']} />
        <SelectField label="Status" field="status" options={['Pending', 'In Progress', 'Completed']} />
        <InputField label="Due Date" field="dueDate" type="date" />
      </div>
    );
    if (activeTab === 'users') return (
      <div className="space-y-4">
        <InputField label="Name" field="name" placeholder="Full name" />
        <InputField label="Email" field="email" type="email" placeholder="email@grovevista.com" />
        <SelectField label="Role" field="role" options={['Admin', 'Agent', 'Viewer']} />
        <SelectField label="Status" field="status" options={['Active', 'Inactive']} />
      </div>
    );
    if (activeTab === 'properties') return (
      <div className="space-y-4">
        <InputField label="Title" field="title" placeholder="Villa Name" />
        <InputField label="Location" field="location" placeholder="City, State" />
        <InputField label="Price" field="price" type="number" placeholder="450000000" />
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Beds" field="beds" type="number" />
          <InputField label="Baths" field="baths" type="number" />
          <InputField label="Sqft" field="sqft" type="number" />
        </div>
        <InputField label="Image URL" field="image" placeholder="https://..." />
        <InputField label="Description" field="description" placeholder="Short description..." />
      </div>
    );
    return null;
  };

  // ──── Table Renderers ────
  const renderCrudHeader = (title, subtitle, onAdd, addLabel, AddIcon = Plus) => (
    <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">{subtitle}</p>
      </div>
      <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 bg-accent/10 text-accent border border-accent/20 rounded-xl hover:bg-accent/20 transition-colors font-medium text-sm w-fit">
        <AddIcon className="w-4 h-4" /> {addLabel}
      </button>
    </div>
  );

  const renderLeadsTab = () => (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
      {renderCrudHeader('Leads Management', 'Manage your property leads', () => openAdd({ status: 'New', source: 'Website' }), 'Add Lead')}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead><tr className="bg-white/[0.02] text-gray-500 text-xs font-bold uppercase tracking-widest">
            <th className="p-4 sm:p-5 pl-4 sm:pl-6">Name</th><th className="p-4 sm:p-5">Email</th><th className="p-4 sm:p-5">Phone</th><th className="p-4 sm:p-5">Status</th><th className="p-4 sm:p-5">Source</th><th className="p-4 sm:p-5 pr-4 sm:pr-6">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {apiLoading ? Array(3).fill(0).map((_, i) => <SkeletonRow key={i} />) :
              leads.map(lead => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 sm:p-5 pl-4 sm:pl-6 font-semibold text-white">{lead.name}</td>
                  <td className="p-4 sm:p-5 text-gray-400">{lead.email}</td>
                  <td className="p-4 sm:p-5 text-gray-400">{lead.phone}</td>
                  <td className="p-4 sm:p-5"><StatusBadge status={lead.status} /></td>
                  <td className="p-4 sm:p-5 text-gray-400">{lead.source}</td>
                  <td className="p-4 sm:p-5 pr-4 sm:pr-6">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(lead)} className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(lead.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTasksTab = () => (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
      {renderCrudHeader('Tasks Management', 'Track and manage your tasks', () => openAdd({ priority: 'Medium', status: 'Pending', dueDate: '' }), 'Add Task')}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead><tr className="bg-white/[0.02] text-gray-500 text-xs font-bold uppercase tracking-widest">
            <th className="p-4 sm:p-5 pl-4 sm:pl-6">Title</th><th className="p-4 sm:p-5">Priority</th><th className="p-4 sm:p-5">Status</th><th className="p-4 sm:p-5">Due Date</th><th className="p-4 sm:p-5 pr-4 sm:pr-6">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {apiLoading ? Array(3).fill(0).map((_, i) => <SkeletonRow key={i} />) :
              tasks.map(task => (
                <tr key={task.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 sm:p-5 pl-4 sm:pl-6 font-semibold text-white">{task.title}</td>
                  <td className="p-4 sm:p-5"><StatusBadge status={task.priority} /></td>
                  <td className="p-4 sm:p-5"><StatusBadge status={task.status} /></td>
                  <td className="p-4 sm:p-5 text-gray-400">{task.dueDate}</td>
                  <td className="p-4 sm:p-5 pr-4 sm:pr-6">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(task)} className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(task.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
      {renderCrudHeader('Users Management', 'Manage platform users and roles', () => openAdd({ role: 'Agent', status: 'Active' }), 'Add User', UserPlus)}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead><tr className="bg-white/[0.02] text-gray-500 text-xs font-bold uppercase tracking-widest">
            <th className="p-4 sm:p-5 pl-4 sm:pl-6">Name</th><th className="p-4 sm:p-5">Email</th><th className="p-4 sm:p-5">Role</th><th className="p-4 sm:p-5">Status</th><th className="p-4 sm:p-5 pr-4 sm:pr-6">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {apiLoading ? Array(3).fill(0).map((_, i) => <SkeletonRow key={i} />) :
              users.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 sm:p-5 pl-4 sm:pl-6 font-semibold text-white">{u.name}</td>
                  <td className="p-4 sm:p-5 text-gray-400">{u.email}</td>
                  <td className="p-4 sm:p-5"><StatusBadge status={u.role === 'Admin' ? 'Active' : u.role} /></td>
                  <td className="p-4 sm:p-5"><StatusBadge status={u.status} /></td>
                  <td className="p-4 sm:p-5 pr-4 sm:pr-6">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(u)} className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(u.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
  const renderPropertiesTab = () => (
    <div className="glass rounded-2xl border border-white/10 overflow-hidden">
      {renderCrudHeader('Properties Management', 'Add and edit property listings', () => openAdd({ type: 'Luxury', beds: 1, baths: 1, sqft: 500 }), 'Add Property', Building)}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead><tr className="bg-white/[0.02] text-gray-500 text-xs font-bold uppercase tracking-widest">
            <th className="p-4 sm:p-5 pl-4 sm:pl-6">Title</th><th className="p-4 sm:p-5">Location</th><th className="p-4 sm:p-5">Price</th><th className="p-4 sm:p-5">Details</th><th className="p-4 sm:p-5 pr-4 sm:pr-6">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {apiLoading ? Array(3).fill(0).map((_, i) => <SkeletonRow key={i} />) :
              properties.map(p => (
                <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 sm:p-5 pl-4 sm:pl-6">
                    <div className="flex items-center gap-3">
                      <img src={p.image} className="w-10 h-10 rounded-lg object-cover border border-white/10" alt="" />
                      <span className="font-semibold text-white">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-gray-400">{p.location}</td>
                  <td className="p-4 sm:p-5 text-accent font-bold">₹{p.price?.toLocaleString('en-IN')}</td>
                  <td className="p-4 sm:p-5 text-gray-400 text-xs">{p.beds}B | {p.baths}B | {p.sqft} sqft</td>
                  <td className="p-4 sm:p-5 pr-4 sm:pr-6">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBookingsTab = () => (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">My Booked Properties</h3>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">You have {bookings.length} active bookings</p>
        </div>
      </div>
      {apiLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass rounded-2xl border border-white/10 p-12 text-center">
          <Building className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-white mb-2">No Bookings Yet</h4>
          <p className="text-gray-400">Visit the <a href="/properties" className="text-accent hover:underline">Properties</a> page to book your first property.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b, i) => (
            <motion.div key={b._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-accent/20 transition-colors">
              <div className="relative h-48 overflow-hidden">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold">{b.status}</div>
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-bold text-lg">{b.title}</p>
                  <p className="text-gray-300 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> {b.location}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center text-gray-300 text-sm mb-4">
                  <div className="flex items-center gap-1"><Bed className="w-4 h-4 text-accent" /> {b.beds} Beds</div>
                  <div className="flex items-center gap-1"><Bath className="w-4 h-4 text-accent" /> {b.baths} Baths</div>
                  <div className="flex items-center gap-1"><Square className="w-4 h-4 text-accent" /> {b.sqft} sqft</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-accent font-bold">₹{b.price.toLocaleString('en-IN')}</p>
                    <p className="text-gray-500 text-xs mt-0.5"><CalendarCheck className="w-3 h-3 inline mr-1" />Booked {new Date(b.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <button onClick={() => cancelBooking(b._id)} className="px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const STATS = [
    { id: 1, title: 'Total Booked', value: bookings.length, icon: CalendarCheck, trend: '+2', color: 'text-accent', bg: 'bg-accent/10' },
    { id: 2, title: 'Managed Properties', value: summary.properties, icon: Building, trend: '+4', color: 'text-teal-400', bg: 'bg-teal-400/10' },
    { id: 3, title: 'Active Leads', value: summary.leads, icon: Contact, trend: '+12%', color: 'text-blue-400', bg: 'bg-blue-400/10', adminOnly: true },
    { id: 4, title: 'Tasks Pending', value: summary.tasks, icon: CheckSquare, trend: '-5%', color: 'text-orange-400', bg: 'bg-orange-400/10', adminOnly: true },
  ];

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: CalendarCheck },
    { id: 'properties', label: 'Properties', icon: Building, adminOnly: true },
    { id: 'leads', label: 'Leads', icon: Contact, adminOnly: true },
    { id: 'tasks', label: 'Tasks', icon: ListTodo, adminOnly: true },
    { id: 'users', label: 'Users', icon: Users, adminOnly: true },
  ];

  return (
    <div className="pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
      {/* Decorative Blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-teal-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-[140px]" />
      </div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 sm:mb-10 relative z-10"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
          Welcome back, <span className="text-accent">{user?.name}</span>
          {user?.isAdmin && <span className="ml-3 text-xs bg-accent/20 text-accent px-2 py-1 rounded-md uppercase tracking-widest border border-accent/20 align-middle">Admin</span>}
        </h1>
        <p className="text-gray-400 text-sm sm:text-lg">Here's your property overview for today.</p>

        {apiLoading && (
          <div className="absolute top-2 right-0">
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
          </div>
        )}
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 sm:mb-10 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 relative z-10">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-accent/10 text-accent border border-accent/20 shadow-lg shadow-accent/5'
                : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10">
            {loading ? <><SkeletonCard /><SkeletonCard /><SkeletonCard /></> :
              STATS.map((stat, index) => (
                <motion.div key={stat.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => setActiveTab(stat.title.includes('Booking') ? 'bookings' : stat.title.includes('Lead') ? 'leads' : stat.title.includes('Task') ? 'tasks' : 'users')}
                  className="glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-white/20 hover:shadow-[0_0_50px_rgba(212,175,55,0.05)] transition-all group relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.01] rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-[0.03] transition-opacity" />
                  <div className="flex items-center justify-between mb-5 sm:mb-8 relative z-10">
                    <h3 className="text-gray-400 font-semibold text-xs sm:text-sm uppercase tracking-widest">{stat.title}</h3>
                    <div className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl ${stat.bg}`}><stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} /></div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-3xl sm:text-5xl font-bold text-white mb-2 sm:mb-3 tracking-tight">{stat.value}</p>
                    <p className={`text-sm font-medium flex items-center gap-1.5 ${stat.trend.startsWith('+') ? 'text-teal-400' : 'text-orange-400'}`}>
                      <ArrowUpRight className={`w-4 h-4 ${!stat.trend.startsWith('+') && 'rotate-90'}`} />
                      {stat.trend} from last month
                    </p>
                  </div>
                </motion.div>
              ))
            }
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'My Bookings', tab: 'bookings', icon: CalendarCheck, color: 'from-accent/20 to-yellow-600/5' },
              { label: 'Manage Properties', tab: 'properties', icon: Building, color: 'from-blue-500/20 to-blue-600/5', adminOnly: true },
              { label: 'Manage Leads', tab: 'leads', icon: Contact, color: 'from-orange-500/20 to-orange-600/5', adminOnly: true },
              { label: 'Manage Tasks', tab: 'tasks', icon: ListTodo, color: 'from-teal-500/20 to-teal-600/5', adminOnly: true },
            ].map(card => (
              <motion.button key={card.tab} whileHover={{ scale: 1.02, y: -3 }}
                onClick={() => setActiveTab(card.tab)}
                className={`glass p-6 rounded-2xl border border-white/10 text-left bg-gradient-to-br ${card.color} hover:border-white/20 transition-all`}
              >
                <card.icon className="w-8 h-8 text-white mb-4" />
                <h4 className="text-lg font-bold text-white">{card.label}</h4>
                <p className="text-gray-400 text-sm mt-1">View and manage →</p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* CRUD Tabs */}
      <div className="relative z-10">
        {activeTab === 'bookings' && renderBookingsTab()}
        {activeTab === 'properties' && renderPropertiesTab()}
        {activeTab === 'leads' && renderLeadsTab()}
        {activeTab === 'tasks' && renderTasksTab()}
        {activeTab === 'users' && renderUsersTab()}
      </div>

      {/* CRUD Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`${modalMode === 'add' ? 'Add' : 'Edit'} ${activeTab.slice(0, -1)}`}>
        {renderModalForm()}
        <div className="flex gap-3 mt-6 sm:mt-8">
          <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-colors font-medium">Cancel</button>
          <button onClick={handleSave} disabled={apiLoading} className="flex-1 px-4 py-3 bg-gradient-to-r from-accent to-yellow-600 text-white rounded-xl hover:shadow-accent/30 hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2">
            {apiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {modalMode === 'add' ? 'Create' : 'Update'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
