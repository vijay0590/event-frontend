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
    if (!selectedType) return toast.error("Select ticket type");

    try {
      // 🔹 STEP 1: CREATE TICKET (PENDING)
      const ticketRes = await API.post("/api/tickets", {
        eventId: event._id,
        quantity,
        ticketType: selectedType,
        paymentMethod: "razorpay",
      });

      const ticketId = ticketRes.data.ticket._id;

      // 🔹 STEP 2: CREATE ORDER
      const { data: order } = await API.post("/api/payment/create-order", {
        amount: totalAmount || 1,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: event.title,
        description: "Event Ticket",
        order_id: order.id,

        handler: async function (response) {
          try {
            // 🔹 VERIFY PAYMENT
            const verify = await API.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verify.data.message === "Payment verified") {
              toast.success("Payment successful ✅");

              // 🔹 CONFIRM PAYMENT + SEND EMAIL
              await API.post("/api/tickets/pay", {
                ticketId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
              });

              toast.success("Ticket booked 🎟️");
              navigate("/my-tickets");
            } else {
              toast.error("Verification failed");
            }
          } catch (err) {
            toast.error("Verification error");
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

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      toast.error("Payment failed ❌");
    }
  };

  return (
<div className="max-w-3xl mx-auto px-4 py-4">

      {/* IMAGE */}
      <img
        src={`http://localhost:3001${event.images?.[0]}`}
   className="w-full h-48 md:h-60 object-cover rounded-xl"
      />

      {/* BASIC INFO */}
     <h1 className="text-xl md:text-2xl font-bold mt-3">{event.title}</h1>
      <p className="text-gray-600">{event.location}</p>
      <p className="mt-2">{event.description}</p>

      {/* SCHEDULE */}
      <h2 className="mt-4 font-bold">Schedule</h2>
      {event.schedule?.length > 0 ? (
        event.schedule.map((s, i) => (
          <div key={i} className="border p-2 mt-2 rounded">
            <p className="font-semibold">{s.title}</p>
            <p className="text-sm text-gray-600">
              {s.startTime} - {s.endTime}
            </p>
            <p className="text-xs text-gray-500">{s.speaker}</p>
          </div>
        ))
      ) : (
        <p>No schedule available</p>
      )}

      {/* TICKETS */}
      <h2 className="mt-4 font-bold">Tickets</h2>
      {event.ticketTypes?.map((t, i) => (
        <div key={i} className="border p-3 mt-2 rounded flex flex-col md:flex-row md:justify-between gap-2">
          <div>
            <p>{t.type}</p>
            <p>₹{t.price}</p>
          </div>

          <button
            onClick={() => setSelectedType(t.type)}
            className={`px-2 py-1 rounded ${
              selectedType === t.type
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Select
          </button>
        </div>
      ))}

      {/* QUANTITY */}
      <div className="mt-4">
        <p>Quantity</p>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
    className="border p-2 w-full md:w-32 rounded"
        />
      </div>

      {/* TOTAL */}
      <p className="mt-3 font-bold">
        Total: ₹{totalAmount || 0}
      </p>

      {/* PAYMENT BUTTON */}
      <button
        onClick={handlePayment}
       className="bg-green-600 text-white px-4 py-3 mt-4 rounded w-full text-lg"
      >
        Book & Pay
      </button>
    </div>
  );
};

export default EventDetails;