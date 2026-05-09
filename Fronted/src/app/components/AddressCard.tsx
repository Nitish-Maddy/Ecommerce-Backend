import { MapPin, Edit3, Trash2, Star } from 'lucide-react';

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

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 relative transition-all hover:shadow-md ${
      address.isDefault ? 'border-primary ring-1 ring-primary/20' : 'border-border'
    }`}>
      {/* Default Badge */}
      {address.isDefault && (
        <span className="absolute top-3 right-3 bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Star size={10} fill="currentColor" /> Default
        </span>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <MapPin size={16} className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground text-sm">{address.fullName || 'Address'}</p>
          {address.phone && <p className="text-xs text-muted-foreground mt-0.5">{address.phone}</p>}
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed ml-12">
        {address.street && <>{address.street}<br /></>}
        {address.city && <>{address.city}, </>}
        {address.state && <>{address.state} </>}
        {address.pincode && <>{address.pincode}<br /></>}
        {address.country}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 ml-12">
        <button
          onClick={() => onEdit(address)}
          className="flex items-center gap-1.5 text-primary text-xs font-medium hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Edit3 size={13} /> Edit
        </button>
        <button
          onClick={() => onDelete(address._id)}
          className="flex items-center gap-1.5 text-red-500 text-xs font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 size={13} /> Delete
        </button>
        {!address.isDefault && onSetDefault && (
          <button
            onClick={() => onSetDefault(address._id)}
            className="flex items-center gap-1.5 text-gray-500 text-xs font-medium hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Star size={13} /> Set Default
          </button>
        )}
      </div>
    </div>
  );
}
