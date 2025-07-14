export const protect = (req, res, next) => {
    // Example: check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    next();
};

export const isProvider = (req, res, next) => {
    // Example: check if user is a provider
    if (req.user?.role !== 'provider') {
        return res.status(403).json({ message: 'Provider access only' });
    }
    next();
};

export const isAdmin = (req, res, next) => {
    // Example: check if user is an admin
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access only' });
    }
    next();
};