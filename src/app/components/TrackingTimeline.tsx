import { CheckCircle2, Circle, Truck, Package, BoxSelect, MapPin, Clock } from 'lucide-react';

interface TrackingStep {
  status: string;
  label: string;
  description?: string;
  date?: string;
  completed: boolean;
  current: boolean;
}

interface TrackingTimelineProps {
  orderStatus: string;
  createdAt?: string;
  deliveredAt?: string;
  expectedDeliveryDate?: string;
}

const ALL_STEPS = [
  { status: 'PLACED', label: 'Order Placed', icon: Package, description: 'Your order has been placed successfully' },
  { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2, description: 'Seller has confirmed your order' },
  { status: 'PACKED', label: 'Packed', icon: BoxSelect, description: 'Your item has been packed' },
  { status: 'SHIPPED', label: 'Shipped', icon: Truck, description: 'Your package is on the way' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: MapPin, description: 'Package is out for delivery' },
  { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, description: 'Package has been delivered' },
];

const STATUS_ORDER = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export function TrackingTimeline({ orderStatus, createdAt, deliveredAt, expectedDeliveryDate }: TrackingTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(orderStatus);
  const isCancelled = orderStatus === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-red-500 text-2xl font-bold">✕</span>
        </div>
        <h3 className="text-lg font-bold text-red-600 mb-1">Order Cancelled</h3>
        <p className="text-sm text-red-500">This order has been cancelled</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {ALL_STEPS.map((step, index) => {
        const StepIcon = step.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.status} className="flex items-start gap-4 relative">
            {/* Vertical line */}
            {index < ALL_STEPS.length - 1 && (
              <div className="absolute left-[19px] top-10 w-0.5 h-full -translate-x-1/2">
                <div
                  className={`w-full h-full transition-colors duration-500 ${
                    index < currentIndex ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}

            {/* Icon */}
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
              isCompleted
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
            } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
              {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </div>

            {/* Content */}
            <div className={`pb-8 flex-1 ${index === ALL_STEPS.length - 1 ? 'pb-0' : ''}`}>
              <p className={`font-bold text-sm ${isCompleted ? 'text-foreground' : 'text-gray-400'} ${isCurrent ? 'text-primary' : ''}`}>
                {step.label}
              </p>
              <p className={`text-xs mt-0.5 ${isCompleted ? 'text-muted-foreground' : 'text-gray-300'}`}>
                {step.description}
              </p>
              {isCurrent && step.status === 'PLACED' && createdAt && (
                <p className="text-xs text-primary font-medium mt-1">
                  {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
              {isCurrent && step.status === 'DELIVERED' && deliveredAt && (
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  Delivered on {new Date(deliveredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Estimated delivery */}
      {expectedDeliveryDate && currentIndex < STATUS_ORDER.indexOf('DELIVERED') && (
        <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
          <Clock size={18} className="text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Estimated Delivery</p>
            <p className="text-xs text-muted-foreground">
              {new Date(expectedDeliveryDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
