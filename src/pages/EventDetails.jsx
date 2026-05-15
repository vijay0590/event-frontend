import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";

const EventDetails = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const role = (user?.role || "").toLowerCase();
  const isUser = role === "user";

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/api/events/${id}`);
        setEvent(res.data.event || res.data);
      } catch (error) {
        toast.error("Failed to load event details");
      }
    };
    fetchEvent();
  }, [id]);

  if (authLoading || !event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.date);
  eventDate.setHours(0, 0, 0, 0);
  const isPastEvent = eventDate < today;

  const selectedTicket = event.ticketTypes?.find((t) => t.type === selectedType);
  const maxAvailable = selectedTicket?.available ?? 1;
  const totalAmount = (selectedTicket?.price || 0) * quantity;

  const handlePayment = async () => {
    if (loading) return;

    if (!isUser) return toast.error("Only users can book tickets");
    if (isPastEvent) return toast.error("This event is already completed");
    if (!selectedType) return toast.error("Please select a ticket type");
    if (selectedTicket?.available === 0) return toast.error("Tickets sold out");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login to book tickets");

    setLoading(true);

    try {
      // 1. Create temporary ticket record
      const ticketRes = await API.post(
        "/api/tickets",
        { eventId: event._id, quantity, ticketType: selectedType, paymentMethod: "razorpay" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const ticketId = ticketRes.data.ticket._id;

      // 2. Create Razorpay Order
      const { data: order } = await API.post(
        "/api/payment/create-order",
        { amount: totalAmount || 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: event.title,
        description: `${selectedType} Ticket x ${quantity}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            toast.loading("Verifying payment...", { id: "pay-toast" });
            
            // 3. Verify Payment
            await API.post(
              "/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // 4. Update Ticket status to 'paid'
            await API.post(
              "/api/tickets/pay",
              {
                ticketId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Ticket booked successfully! 🎟️", { id: "pay-toast" });
            navigate("/my-tickets");
          } catch (err) {
            toast.error("Payment verification failed", { id: "pay-toast" });
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#4f46e5" },
        modal: { ondismiss: () => setLoading(false) }
      };

      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Check your internet.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-10">
          
          {/* LEFT: EVENT INFO (Takes 2 columns) */}
          <div className="md:col-span-2">
            <img
              src={
                event.images?.[0]
                  ? `${import.meta.env.VITE_API_URL}/${event.images[0].replace(/^\/+/, "")}`
                  : "/no-image.png"
              }
              alt={event.title}
              className="w-full h-[400px] object-cover rounded-3xl shadow-lg mb-8"
            />

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold uppercase">
                {event.category}
              </span>
              <span className="text-gray-500 font-medium">
                📅 {new Date(event.date).toDateString()}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <p className="text-lg text-gray-600 flex items-center gap-2 mb-6">
              📍 {event.location}
            </p>

            <hr className="my-8" />

            <h2 className="text-2xl font-bold mb-4">About this event</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* RIGHT: BOOKING CARD (Sticky) */}
          <div className="relative">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-3xl p-6 shadow-xl shadow-indigo-100/50">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ticket Selection</h2>

              {!isUser && !authLoading && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-xl text-sm mb-4">
                  Log in as a user to book tickets.
                </div>
              )}

              <div className="space-y-3">
                {event.ticketTypes?.map((t, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (!isUser || t.available === 0) return;
                      setSelectedType(t.type);
                      setQuantity(1);
                    }}
                    className={`p-4 border-2 rounded-2xl transition-all ${
                      t.available === 0 || !isUser
                        ? "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
                        : selectedType === t.type
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-100 hover:border-indigo-200 cursor-pointer"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900">{t.type}</span>
                      <span className="text-indigo-600 font-bold">₹{t.price}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t.available > 0 ? `${t.available} tickets left` : "Sold Out"}
                    </p>
                  </div>
                ))}
              </div>

              {selectedType && (
                <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-600">Quantity</span>
                    <div className="flex items-center gap-4 bg-white border rounded-xl px-2 py-1">
                      <button
                        disabled={quantity === 1}
                        onClick={() => setQuantity(q => q - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="font-bold w-4 text-center">{quantity}</span>
                      <button
                        disabled={quantity >= maxAvailable}
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-black text-indigo-600">₹{totalAmount}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading || isPastEvent || !isUser || !selectedType}
                className={`w-full mt-6 py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
                  !isUser || isPastEvent || !selectedType
                    ? "bg-gray-300 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200"
                }`}
              >
                {loading ? "Processing..." : isPastEvent ? "Event Closed" : "Book Now"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default EventDetails;