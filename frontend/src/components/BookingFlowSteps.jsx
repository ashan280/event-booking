const STEPS = ["Seats", "Summary", "Payment", "Ticket"];

function BookingFlowSteps({ current }) {
  const currentIndex = STEPS.indexOf(current);

  return (
    <div className="booking-steps" aria-label="Booking progress">
      {STEPS.map((step, index) => {
        const state =
          index < currentIndex ? "done" : index === currentIndex ? "current" : "next";

        return (
          <div className={`booking-step booking-step-${state}`} key={step}>
            <span className="booking-step-number">{index + 1}</span>
            <div className="booking-step-copy">
              <strong>{step}</strong>
              <span>
                {state === "done"
                  ? "Done"
                  : state === "current"
                    ? "Current"
                    : "Next"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BookingFlowSteps;
