import Service from '../models/Service.js';

// GET all approved services
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find({ status: 'approved' });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// GET single service by ID
export const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Not found' });
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// POST provider creates service
export const createService = async (req, res) => {
    try {
        const newService = new Service({
            ...req.body,
            provider: req.user._id,
            status: 'pending'
        });
        const saved = await newService.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// PUT provider updates own service
export const updateService = async (req, res) => {
    try {
        const service = await Service.findOne({ _id: req.params.id, provider: req.user._id });
        if (!service) return res.status(403).json({ message: 'Unauthorized' });
        Object.assign(service, req.body);
        const updated = await service.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
};

// DELETE provider removes own service
export const deleteService = async (req, res) => {
    try {
        const service = await Service.findOneAndDelete({ _id: req.params.id, provider: req.user._id });
        if (!service) return res.status(403).json({ message: 'Unauthorized' });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
};

// GET all services for a provider
export const getProviderServices = async (req, res) => {
    try {
        const services = await Service.find({ provider: req.user._id });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error loading provider services' });
    }
};

// PUT admin approves a service
export const approveService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Not found' });
        service.status = 'approved';
        await service.save();
        res.json({ message: 'Service approved' });
    } catch (error) {
        res.status(500).json({ message: 'Approval failed' });
    }
};