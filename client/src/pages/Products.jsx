export function OrderFailurePage() {
  const navigate = useNavigate()

  return (
    <div className="order-failure">
      <h2>Payment Failed</h2>
      <p>Payment failed or cancelled. Please try again.</p>
      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate('/cart')} className="primary-btn">
          Back to Cart
        </button>
      </div>
    </div>
  )
}