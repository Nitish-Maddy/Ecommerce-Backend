import { useState, useEffect } from 'react';
import { MapPin, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../services/api';
import { AddressCard } from '../../components/AddressCard';
import { toast } from 'sonner';

interface Address {
  _id: string;
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  isDefault?: boolean;
}

const emptyAddress = { fullName: '', phone: '', street: '', city: '', state: '', pincode: '', country: 'India' };

export function SavedAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAddress);
  const [saving, setSaving] = useState(false);

  const userId = user?._id;

  useEffect(() => { fetchAddresses(); }, [userId]);

  const fetchAddresses = async () => {
    if (!userId) return;
    try {
      const res = await userApi.getProfile(userId);
      if (res.success && res.data?.addresses) {
        setAddresses(res.data.addresses);
      }
    } catch { /* error */ }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    try {
      if (editingId) {
        await userApi.updateAddress(userId, editingId, form);
        toast.success('Address updated');
      } else {
        await userApi.addAddress(userId, form);
        toast.success('Address added');
      }
      await fetchAddresses();
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save address');
    }
    setSaving(false);
  };

  const handleEdit = (address: Address) => {
    setForm({
      fullName: address.fullName || '',
      phone: address.phone || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || 'India',
    });
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!userId || !confirm('Delete this address?')) return;
    try {
      await userApi.deleteAddress(userId, addressId);
      toast.success('Address deleted');
      await fetchAddresses();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyAddress);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="text-primary" size={24} /> Saved Addresses
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{addresses.length} address{addresses.length !== 1 ? 'es' : ''} saved</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary/90 transition-all"
        >
          <Plus size={16} /> Add Address
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg text-foreground">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input type="text" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50">
                  {saving ? 'Saving...' : editingId ? 'Update Address' : 'Add Address'}
                </button>
                <button type="button" onClick={resetForm}
                  className="px-6 py-2.5 rounded-xl font-medium text-sm border border-border text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm py-16 text-center">
          <MapPin size={40} className="text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-foreground mb-2">No Saved Addresses</h2>
          <p className="text-muted-foreground text-sm mb-4">Add an address for faster checkout</p>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">
            + Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard key={addr._id} address={addr} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
