import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch event
  useEffect(() => {
    API.get(`/api/events/${id}`)
      .then((res) => setEvent(res.data.event || res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!event) return <p>Loading...</p>;

  //Calculate price
  const selectedTicket = event.ticketTypes?.find(
    (t) => t.type === selectedType
  );

  const totalAmount = (selectedTicket?.price || 0) * quantity;

  // FINAL PAYMENT FLOW
  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to book tickets");
      return;
    }
    if (!selectedType) return toast.error("Select ticket type");
    setLoading(true);
    try {
      // 🔹 STEP 1: CREATE TICKET (PENDING)
      const ticketRes = await API.post(
        "/api/tickets",
        {
          eventId: event._id,
          quantity,
          ticketType: selectedType,
          paymentMethod: "razorpay",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const ticketId = ticketRes.data.ticket._id;

      // 🔹 STEP 2: CREATE ORDER
      const { data: order } = await API.post(
        "/api/payment/create-order",
        {
          amount: totalAmount || 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: event.title,
        description: "Event Ticket",
        order_id: order.id,
        
        //verify payment
        handler: async function (response) {
          try {
            const token = localStorage.getItem("token");

            const verify = await API.post(
              "/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verify.data.message === "Payment verified") {
              toast.success("Payment successful ✅");

              // 🔹 CONFIRM PAYMENT + SEND EMAIL

              await API.post(
                "/api/tickets/pay",
                {
                  ticketId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              toast.success("Ticket booked 🎟️");
              setLoading(false);
              navigate("/my-tickets");
            } else {
              toast.error("Verification failed");
              setLoading(false);
            }
          } catch (err) {
            toast.error("Verification error");
            setLoading(false);
          }
        },

        prefill: {
          name: "User",
          email: "user@gmail.com",
        },

        theme: {
          color: "#3399cc",
        },
      };
      if (!window.Razorpay) {
        alert("Payment service not loaded. Refresh page.");
        setLoading(false);
        return;
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Payment failed ❌");
    }
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <div className="grid md:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div>

          {/* IMAGE */}
          <img
            src={`${import.meta.env.VITE_API_URL}${event.images?.[0]}`}
            className="w-full h-64 object-cover rounded-2xl"
          />

          {/* INFO */}
          <h1 className="text-2xl font-semibold text-gray-900 mt-4">
            {event.title}
          </h1>

          <p className="text-gray-500 mt-1">
            📍 {event.location}
          </p>

          <p className="text-gray-600 mt-3">
            {event.description}
          </p>

          {/* SCHEDULE */}
          <h2 className="mt-6 text-lg font-semibold text-gray-900">
            Schedule
          </h2>

          {event.schedule?.length > 0 ? (
            <div className="space-y-2 mt-2">
              {event.schedule.map((s, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-100 rounded-lg p-3"
                >
                  <p className="font-medium text-gray-900">
                    {s.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {s.startTime} - {s.endTime}
                  </p>
                  <p className="text-xs text-gray-400">
                    {s.speaker}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No schedule available</p>
          )}

        </div>

        {/* RIGHT SIDE (BOOKING PANEL) */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 h-fit">

          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Book Tickets
          </h2>

          {/* TICKETS */}
          <div className="space-y-2">
            {event.ticketTypes?.map((t, i) => (
              <div
                key={i}
                onClick={() => setSelectedType(t.type)}
                className={`p-3 border rounded-lg cursor-pointer flex justify-between ${selectedType === t.type
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200"
                  }`}
              >
                <p className="font-medium">{t.type}</p>
                <p className="text-gray-600">₹{t.price}</p>
                <p className="text-sm text-gray-500">
  {ticket.available} / {ticket.total} available
</p>
              </div>
            ))}
          </div>

          {/* QUANTITY */}
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">
              Quantity
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-100 rounded"
              >
                -
              </button>

              <span className="px-4">{quantity}</span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 bg-gray-100 rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* TOTAL */}
          <p className="mt-4 font-semibold text-gray-900">
            Total: ₹{totalAmount || 0}
          </p>

          {/* CTA */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full mt-4 py-3 rounded-lg text-white ${loading
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Processing..." : "Book & Pay"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default EventDetails;