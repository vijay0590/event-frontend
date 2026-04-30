import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const EventDetails = () => {
const { user } = useContext(AuthContext);
const { id } = useParams();
const navigate = useNavigate();

const [event, setEvent] = useState(null);
const [selectedType, setSelectedType] = useState("");
const [quantity, setQuantity] = useState(1);
const [loading, setLoading] = useState(false);

useEffect(() => {
API.get(`/api/events/${id}`)
.then((res) => setEvent(res.data.event || res.data))
.catch(() => toast.error("Failed to load event"));
}, [id]);

if (!event) return <p>Loading...</p>;

const selectedTicket = event.ticketTypes?.find(
(t) => t.type === selectedType
);
const totalAmount = (selectedTicket?.price || 0) * quantity;

const handlePayment = async () => {
const token = localStorage.getItem("token");


if (!token) {
  alert("Please login to book tickets");
  return;
}
if (!selectedType) return toast.error("Select ticket type");
if (selectedTicket?.available === 0)
  return toast.error("Tickets sold out");

setLoading(true);

try {
  // STEP 1: CREATE TICKET
  const ticketRes = await API.post(
    "/api/tickets",
    {
      eventId: event._id,
      quantity,
      ticketType: selectedType,
      paymentMethod: "razorpay",
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const ticketId = ticketRes.data.ticket._id;

  // STEP 2: CREATE ORDER
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
    description: "Event Ticket",
    order_id: order.id,

    // 🚀 FIXED HANDLER
    handler: function (response) {
      toast.success("Payment successful ✅");

      //  redirect
      navigate("/my-tickets");

      //  Background processing
      API.post(
        "/api/payment/verify",
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
        .then(() => {
          return API.post(
            "/api/tickets/pay",
            {
              ticketId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
        .then(() => {
          toast.success("Ticket booked 🎟️");
        })
        .catch(() => {
          toast.error("Payment verification failed");
        });
    },

    prefill: {
      name: user?.name || "User",
      email: user?.email || "",
    },

    theme: {
      color: "#6366f1",
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
  toast.error(error.response?.data?.message || "Payment failed ❌");
  setLoading(false);
}


};

return ( <div className="max-w-5xl mx-auto px-4 py-10"> <div className="grid md:grid-cols-2 gap-8">


    <div>
      <img
        src={
          event.images?.[0]
            ? `${import.meta.env.VITE_API_URL}${event.images[0]}`
            : "/no-image.png"
        }
        className="w-full h-64 object-cover rounded-2xl"
      />

      <h1 className="text-2xl font-semibold mt-4">{event.title}</h1>
      <p className="text-gray-500">📍 {event.location}</p>
      <p className="mt-3">{event.description}</p>
    </div>

    <div className="bg-white border rounded-2xl p-5">
      <h2 className="text-lg font-semibold mb-4">Book Tickets</h2>

      {event.ticketTypes?.map((t, i) => (
        <div
          key={i}
          onClick={() => {
            setSelectedType(t.type);
            setQuantity(1);
          }}
          className={`p-3 border rounded-lg cursor-pointer mb-2 ${
            selectedType === t.type
              ? "border-indigo-600 bg-indigo-50"
              : ""
          }`}
        >
          {t.type} - ₹{t.price}
        </div>
      ))}

      <div className="mt-4">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          -
        </button>
        <span className="px-4">{quantity}</span>
        <button
          onClick={() =>
            setQuantity((q) =>
              Math.min(selectedTicket?.available ?? 1, q + 1)
            )
          }
        >
          +
        </button>
      </div>

      <p className="mt-4 font-semibold">₹{totalAmount}</p>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg"
      >
        {loading ? "Processing..." : "Book & Pay"}
      </button>
    </div>
  </div>
</div>


);
};

export default EventDetails;
