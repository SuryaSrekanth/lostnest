const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');


// ========================================================
// 1. GET ALL ITEMS (With search & Multi-Filters)
// GET /api/items
// Query parameters: ?type=...&category=...&building=...&status=...&search=...
// ========================================================
router.get('/', async (req, res) => {
    try {
        const { type, category, building, status, search } = req.query;
        let query = {};

        // Filter by Lost vs Found
        if (type && type !== 'All') {
            query.type = type;
        }

        // Filter by Category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Filter by Corporate Building
        if (building && building !== 'All') {
            query.building = building;
        }

        // Filter by Status (Default to Active if not Specified)
        if (status && status !== 'All') {
            if (status === 'Active') {
                query.status = { $in: ['Active', 'Claim Pending'] };
            } else {
                query.status = status;
            }
        }

        //Search keyword in title, description, or room/zone
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { roomZone: { $regex: search, $options: 'i' } },
            ];
        }

        const items = await Item.find(query)
            .populate('reportedBy', 'name email department officeLocation')
            .populate('claimDetails.claimedBy', 'name email phone department')
            .sort({ dateReported: -1 }); //Newest first

        res.status(200).json(items);
    }   catch (err) {
        console.error('Fetch Items Error:', err.message);
        res.status(500).json({ message: 'Server error fetching items' });
    }
});

// ========================================================
// 2. GET ITEMS REPORTED BY CURRENT USER ("My Listings")
// GET /api/items/user/my-items (Protected)
// ========================================================
router.get('/user/my-items', auth, async (req, res) => {
    try {
        const items = await Item.find({ reportedBy: req.user.id })
            .populate('claimDetails.claimedBy', 'name email phone department')
            .sort({ dateReported: -1 });

        res.status(200).json(items);
    }   catch (err) {
        console.error('Fetch My Items Error:', err.message);
        res.status(500).json({ message: 'Server error fetching your reported items' });
    }
});

// ========================================================
// 3. GET SINGLE ITEM DETAILS BY ID
// GET /api/items/:id
// ========================================================
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('reportedBy', 'name email phone department officeLocation')
            .populate('claimDetails.claimedBy', 'name email department');

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json(item);
    }   catch (err) {
        console.error('Fetch Item By ID Error:', err.message);
        res.status(500).json({ message: 'Server error fetching item details' });
    }
});

// ========================================================
// 4. REPORT A NEW ITEM (Lost or Found)
// POST /api/items (Protected)
// ========================================================
router.post('/', auth, async (req, res) => {
    try {
        const {
            title,
            description,
            type,
            category,
            building,
            floor,
            roomZone,
            imageUrl,
            contactEmail,
            contactPhone,
        } = req.body;

        const newItem = new Item({
            title,
            description,
            type,
            category,
            building,
            floor,
            roomZone,
            imageUrl: imageUrl || '',
            contactEmail,
            contactPhone: contactPhone || '',
            reportedBy: req.user.id, //User ID from decoded JWT
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    }   catch (err) {
        console.error('Create Item Error:', err.message);
        res.status(500).json({ message: 'Server error reporting item' });
    }
});

// ========================================================
// 5. SUBMIT A CLAIM OR FOUND REPORT
// POST /api/items/:id/claim (Protected)
// ========================================================
router.post('/:id/claim', auth, async (req, res) => {
    try {
        const { claimNote, contactPhone } = req.body;

        if (!claimNote || claimNote.trim() === '') {
            return res.status(400).json({ message: 'Please provide note details' });
        }

        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item Not Found' });
        }

        if (item.status === 'Returned') {
            return res.status(400).json({ message: 'This item has already been marked as returned' });
        }

        if (item.reportedBy.toString() === req.user.id) {
            return res.status(400).json({ message: 'You cannot submit a request on your own reported item' });
        }

        // Update claim details and status
        item.status = 'Claim Pending';
        item.claimDetails = {
            claimedBy: req.user.id,
            claimNote: claimNote.trim(),
            contactPhone: contactPhone ? contactPhone.trim() : '',
            claimDate: new Date(),
        };

        await item.save();
        await item.populate('claimDetails.claimedBy', 'name email phone department');
        await item.populate('reportedBy', 'name email department officeLocation');

        const successMessage = item.type === 'Lost'
            ? 'Found request posted successfully! The owner has been notified.'
            : 'Claim request submitted successfully!';

        res.status(200).json({ message: successMessage, item });
    } catch (err) {
        console.error('Claim/Found Request Error:', err.message);
        res.status(500).json({ message: 'Server error submitting request' });
    }
});

// ========================================================
// 6. RESOLVE / MARK ITEM AS RETURNED
// PUT /api/items/:id/resolve (Protected - Owner Only)
// ========================================================
router.put('/:id/resolve', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not Found' });
        }

        //Ensure only the person who reported it can mark it as returned
        if (item.reportedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to resolve this item' });
        }

        item.status = 'Returned';
        item.resolvedAt = new Date(); // Starts 24h MongoDB TTL auto-purge clock
        await item.save();

        res.status(200).json({ message: 'Item marked as returned successfully', item });
    }   catch (err) {
        console.error('Resolve Error:', err.message);
        res.status(500).json({ message: 'Server error Resolving Item' });
    }
});

// ========================================================
// 7. DELETE AN ITEM
// DELETE /api/items/:id (Protected - Owner Only)
// ========================================================
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not Found' });
        }

        if (item.reportedBy.toString() !== req.user.id) {
            return res.status(403).json({ message:'You are not authorized to delete this Item' });
        }

        await item.deleteOne();
        res.status(200).json({ message: 'Item deleted Successfully' });
    }   catch (err) {
        console.error('Delete Error:', err.message);
        res.status(500).json({ message: 'Server Error Deleting Item' });
    }
});

module.exports = router;
