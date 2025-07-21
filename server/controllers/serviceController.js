const Service = require("../models/service");

exports.createService = async (req, res) => {
    try {
        const service = new Service(req.body);
        const saved = await service.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: "Error creating service", error: err });
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: "Error fetching services", error: err });
    }
};
