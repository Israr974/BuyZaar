
import html2pdf from "html2pdf.js";

export const generateInvoice = (order, user) => {
  // Calculate totals
  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shipping = 0; // Free shipping
  const tax = 0; // Tax included
  const total = subtotal + shipping + tax;

  const invoiceHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${order.orderNumber || order._id}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Arial', sans-serif;
          background: #f5f5f5;
          padding: 40px 20px;
        }
        .invoice-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #284595, #069fe2);
          color: white;
          padding: 30px 40px;
          text-align: center;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 5px;
          letter-spacing: 2px;
        }
        .header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 30px 40px;
        }
        .order-info {
          display: flex;
          justify-content: space-between;
          background: #f8f9fa;
          padding: 15px 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }
        .order-info div {
          flex: 1;
        }
        .order-info strong {
          color: #284595;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h3 {
          color: #284595;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e0e0e0;
          font-size: 18px;
        }
        .customer-details {
          background: #f8f9fa;
          padding: 15px 20px;
          border-radius: 8px;
          line-height: 1.6;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background: #284595;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 500;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #e0e0e0;
        }
        .totals {
          text-align: right;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #e0e0e0;
        }
        .totals p {
          margin-bottom: 8px;
        }
        .totals .grand-total {
          font-size: 20px;
          font-weight: bold;
          color: #284595;
          margin-top: 10px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #e0e0e0;
        }
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .invoice-container {
            box-shadow: none;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <h1>BUYZAAR</h1>
          <p>Premium Shopping Experience</p>
          <p style="margin-top: 10px;">123 Shopping Mall, Aligarh, UP 202001</p>
          <p>Email: support@buyzaar.com | Phone: +91 63973 78896</p>
        </div>

        <div class="content">
          <div class="order-info">
            <div>
              <strong>Order Number:</strong><br>
              ${order.orderNumber || order._id?.slice(-8) || 'N/A'}
            </div>
            <div>
              <strong>Order Date:</strong><br>
              ${new Date(order.createdAt || order.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
            <div>
              <strong>Order Status:</strong><br>
              <span style="color: ${order.status === 'delivered' ? '#10B981' : order.status === 'cancelled' ? '#EF4444' : '#F59E0B'}">
                ${order.status || order.orderStatus || 'Processing'}
              </span>
            </div>
            <div>
              <strong>Payment Method:</strong><br>
              ${order.payment?.method === "COD" ? "Cash on Delivery" : (order.payment?.method || "Online")}
            </div>
          </div>

          <div class="section">
            <h3>Customer Information</h3>
            <div class="customer-details">
              <strong>${user?.name || "Customer"}</strong><br>
              ${user?.email || "N/A"}<br>
              ${user?.mobile || "N/A"}
            </div>
          </div>

          <div class="section">
            <h3>Shipping Address</h3>
            <div class="customer-details">
              ${order.shippingAddress?.name || user?.name || "Customer"}<br>
              ${order.shippingAddress?.address_line || "N/A"}<br>
              ${order.shippingAddress?.city || "N/A"}, ${order.shippingAddress?.state || "N/A"} - ${order.shippingAddress?.pincode || "N/A"}<br>
              ${order.shippingAddress?.country || "India"}<br>
              Phone: ${order.shippingAddress?.mobile || user?.mobile || "N/A"}
            </div>
          </div>

          <div class="section">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items?.map(item => `
                  <tr>
                    <td>${item.productId?.name || item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${(item.price || item.productId?.price).toLocaleString('en-IN')}</td>
                    <td>₹${((item.price || item.productId?.price) * item.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <p><strong>Subtotal:</strong> ₹${subtotal.toLocaleString('en-IN')}</p>
              <p><strong>Shipping:</strong> ${shipping === 0 ? "FREE" : `₹${shipping.toLocaleString('en-IN')}`}</p>
              <p><strong>Tax:</strong> Included</p>
              <div class="grand-total">
                <strong>Grand Total:</strong> ₹${total.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for shopping with BuyZaar!</p>
          <p>For any queries, please contact our support team at support@buyzaar.com</p>
          <p style="margin-top: 10px;">This is a computer generated invoice. No signature required.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `invoice-${order.orderNumber || order._id?.slice(-8)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, letterRendering: true, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(invoiceHtml).save();
};