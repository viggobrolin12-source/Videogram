import express, { Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Get user profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.params.id !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { bio, profilePicture, username } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { bio, profilePicture, username },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow user
router.post('/:id/follow', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.params.id === req.userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { followers: req.userId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { following: req.params.id } }
    );

    res.json(userToFollow);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow user
router.post('/:id/unfollow', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userToUnfollow = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { followers: req.userId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { following: req.params.id } }
    );

    res.json(userToUnfollow);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
