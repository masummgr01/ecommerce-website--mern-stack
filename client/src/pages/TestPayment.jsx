import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export default function TestPayment() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)

  const orderId = searchParams.get('orderId')
  const transactionUUID = searchParams.get('transactionUUID')
  const amount = searchParams.get('amount')

  async function handlePayment(success = true) {
    if (!orderId || !transactionUUID) {
      console.error('Missing orderId or transactionUUID')
      return
    }

    setProcessing(true)

    if (success) {
      try {
        // Complete the test payment using axios
        const formData = new URLSearchParams()
        formData.append('orderId', orderId)
        formData.append('transactionUUID', transactionUUID)

        // Use form submission to match backend expectation
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = `${API_BASE}/api/payments/esewa/test/complete`

        const orderIdInput = document.createElement('input')
        orderIdInput.type = 'hidden'
        orderIdInput.name = 'orderId'
        orderIdInput.value = orderId
        form.appendChild(orderIdInput)

        const transactionInput = document.createElement('input')
        transactionInput.type = 'hidden'
        transactionInput.name = 'transactionUUID'
        transactionInput.value = transactionUUID
        form.appendChild(transactionInput)

        document.body.appendChild(form)
        form.submit()
      } catch (err) {
        console.error('Test payment error', err)
        setProcessing(false)
        navigate('/payment/failure')
      }
    } else {
      // Simulate failure
      navigate('/payment/failure')
    }
  }

  return (
    <div className="test-payment-page">
      <div className="test-payment-card">
        <h2>🧪 Test Payment (eSewa Simulation)</h2>
        <div className="test-payment-info">
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Transaction UUID:</strong> {transactionUUID}</p>
          <p><strong>Amount:</strong> Rs. {amount}</p>
        </div>
        <div className="test-payment-note">
          <p>This is a test payment page. Click the buttons below to simulate payment success or failure.</p>
        </div>
        <div className="test-payment-actions">
          <button
            onClick={() => handlePayment(true)}
            disabled={processing}
            className="primary-btn"
            style={{ marginRight: '1rem' }}
          >
            {processing ? 'Processing...' : '✅ Simulate Success'}
          </button>
          <button
            onClick={() => handlePayment(false)}
            disabled={processing}
            className="danger-btn"
          >
            ❌ Simulate Failure
          </button>
        </div>
      </div>
    </div>
  )
}
