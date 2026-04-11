import React, { useState, useEffect } from "react";
import { MapPin, Package, Truck, CheckCircle, Clock } from "lucide-react";

const OrderTrackingMap = ({ order }) => {
  const [trackingStatus, setTrackingStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock tracking data - Replace with actual API call
  useEffect(() => {
    const fetchTrackingInfo = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTrackingStatus({
          status: order?.status || "processing",
          estimatedDelivery: "2024-01-15",
          currentLocation: "Mumbai Sorting Center",
          timeline: [
            { status: "Order Placed", date: order?.createdAt, completed: true, icon: Package },
            { status: "Order Confirmed", date: order?.createdAt, completed: true, icon: CheckCircle },
            { status: "Processing", date: "2024-01-10", completed: order?.status !== "pending", icon: Clock },
            { status: "Shipped", date: order?.status === "shipped" ? "2024-01-12" : null, completed: order?.status === "shipped" || order?.status === "delivered", icon: Truck },
            { status: "Out for Delivery", date: order?.status === "delivered" ? "2024-01-14" : null, completed: order?.status === "delivered", icon: MapPin },
            { status: "Delivered", date: order?.status === "delivered" ? "2024-01-14" : null, completed: order?.status === "delivered", icon: CheckCircle }
          ]
        });
        setLoading(false);
      }, 1000);
    };
    fetchTrackingInfo();
  }, [order]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-bg-alt rounded-xl">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            trackingStatus?.status === "delivered" ? "bg-success" :
            trackingStatus?.status === "shipped" ? "bg-primary" :
            trackingStatus?.status === "processing" ? "bg-warning" : "bg-error"
          }`} />
          <span className="font-medium text-text capitalize">{trackingStatus?.status}</span>
        </div>
        <div className="text-sm text-text-muted">
          Estimated Delivery: {new Date(trackingStatus?.estimatedDelivery).toLocaleDateString()}
        </div>
        <div className="text-sm text-text-muted flex items-center gap-2">
          <MapPin size={14} />
          {trackingStatus?.currentLocation}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
        <div className="space-y-6">
          {trackingStatus?.timeline.map((item, index) => (
            <div key={index} className="relative flex gap-4">
              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.completed ? "bg-primary/10" : "bg-bg-alt"
              }`}>
                <item.icon size={20} className={item.completed ? "text-primary" : "text-text-muted"} />
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className={`font-medium ${item.completed ? "text-text" : "text-text-muted"}`}>
                    {item.status}
                  </h4>
                  {item.date && (
                    <span className="text-xs text-text-muted">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {item.completed && item.status === "Shipped" && (
                  <p className="text-sm text-text-muted mt-1">
                    Your order has been dispatched and is on its way
                  </p>
                )}
                {item.completed && item.status === "Out for Delivery" && (
                  <p className="text-sm text-text-muted mt-1">
                    Delivery agent is on the way to your address
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-bg-alt rounded-xl p-4 text-center">
        <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin size={32} className="text-primary mx-auto mb-2" />
            <p className="text-text-muted text-sm">Live tracking map will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingMap;