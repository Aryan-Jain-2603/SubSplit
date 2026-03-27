import { useState } from "react";
import Button from "./Button";
import { useRazorpay } from "../../hooks/useRazorpay";

function PaymentButton({
  amount,
  description,
  prefill,
  razorpayKeyId,
  createOrder,
  onPaymentAuthorized,
  onError,
  disabled = false,
  children,
  className,
  variant = "primary",
}) {
  const { ensureLoaded } = useRazorpay();
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    try {
      setIsPending(true);
      await ensureLoaded();

      const orderResponse = await createOrder(amount);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || "Order creation failed");
      }

      const razorpay = new window.Razorpay({
        key: razorpayKeyId,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        description,
        order_id: orderResponse.order.id,
        name: "CraveCart",
        prefill,
        handler: async (response) => {
          try {
            await onPaymentAuthorized(response);
          } catch (error) {
            onError?.(error);
          } finally {
            setIsPending(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPending(false);
          },
        },
        theme: {
          color: "#4059d8",
        },
      });

      razorpay.open();
    } catch (error) {
      setIsPending(false);
      onError?.(error);
    }
  }

  return (
    <Button
      className={className}
      variant={variant}
      onClick={handleClick}
      disabled={disabled || isPending || !razorpayKeyId}
    >
      {isPending ? "Opening payment..." : children}
    </Button>
  );
}

export default PaymentButton;
