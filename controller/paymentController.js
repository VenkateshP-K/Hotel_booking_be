const PaymentMethod = require('../models/PaymentMethod');


const paymentController = {
    //add a payment method 
    createPayment: async (req, res) => {
        try {
          const { type, cardNumber, expiryDate,cvv } = req.body;
          console.log('User from req:', req.user); 
          console.log('Received payment data:', { type, cardNumber: '*'.repeat(cardNumber.length - 4) + cardNumber.slice(-4), expiryDate });
          
          const newPaymentMethod = new PaymentMethod({
            user: req.userId,
            type,
            cardNumber,
            expiryDate,
            cvv
          });
          
          const savedMethod = await newPaymentMethod.save();
          res.json(savedMethod);
        } catch (error) {
          console.error('Error in createPayment:', error);
          res.status(500).json({ message: 'Server error', error: error.message });
        }
      },

    //get all payment methods
    getPayment: async (req, res) => {
        try {
          const paymentMethods = await PaymentMethod.find({ user: req.userId });
          res.json(paymentMethods);
        } catch (error) {
          res.status(500).json({ message: 'Server error' });
        }
      },

    //delete a payment method
    deletePayment: async (req, res) => {
        try {
          const paymentMethod = await PaymentMethod.findById(req.params.id);
          if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
          }
          if (paymentMethod.user.toString() !== req.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
          await PaymentMethod.findByIdAndDelete(req.params.id);
          res.json({ message: 'Payment method deleted successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Server error' });
        }
      },
}

module.exports = paymentController