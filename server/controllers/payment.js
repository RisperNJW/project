exports.processPayment = (req, res) => {
    const { amount, serviceId } = req.body;

    // Fake payment success
    res.json({ success: true, message: `Paid KES ${amount} for service ${serviceId}` });
};
