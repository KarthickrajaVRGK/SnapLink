import QRCode from 'qrcode';
import Url from '../models/Url.js';
import Analytics from '../models/Analytics.js';

// Alphanumeric characters for short code generation
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Helper: Generate a random 6-character alphanumeric code
 */
const generateUniqueCode = () => {
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
};

/**
 * @route   POST /api/urls/shorten
 * @desc    Create a shortened URL and QR code
 * @access  Private
 */
export const shortenUrl = async (req, res, next) => {
  const { originalUrl } = req.body;

  try {
    // 1. Basic validation
    if (!originalUrl) {
      res.status(400);
      throw new Error('Please provide an original URL');
    }

    // 2. Validate URL format (must start with http:// or https://)
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(originalUrl)) {
      res.status(400);
      throw new Error('Please provide a valid URL starting with http:// or https://');
    }

    // 3. Generate a unique short code with collision handling (max 5 retries)
    let shortCode = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      shortCode = generateUniqueCode();
      const existingUrl = await Url.findOne({ shortCode });
      if (!existingUrl) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      res.status(500);
      throw new Error('Could not generate a unique short code, please try again');
    }

    // 4. Generate QR Code
    // Construct the public short URL dynamically based on host headers or environment variables
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const shortUrl = `${baseUrl}/${shortCode}`;

    let qrCode = '';
    try {
      // Generate base64 Data URI for the image
      qrCode = await QRCode.toDataURL(shortUrl);
    } catch (qrError) {
      console.error('Failed to generate QR Code image: ', qrError.message);
      // We can fail gracefully here or choose to let it throw. We choose to log it,
      // and continue so the URL is still shortened even if QR fails.
    }

    // 5. Save Url document in database
    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      user: req.user._id,
      qrCode,
    });

    res.status(201).json(newUrl);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/urls
 * @desc    Get all URLs created by the logged-in user
 * @access  Private
 */
export const getUrls = async (req, res, next) => {
  try {
    const urls = await Url.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(urls);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/urls/:id
 * @desc    Delete a URL & cascade delete its analytics
 * @access  Private
 */
export const deleteUrl = async (req, res, next) => {
  const { id } = req.params;

  try {
    const url = await Url.findById(id);

    if (!url) {
      res.status(404);
      throw new Error('URL not found');
    }

    // Ensure the URL belongs to the logged-in user
    if (url.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this URL');
    }

    // Delete the URL from DB
    await Url.findByIdAndDelete(id);

    // Cascade delete any analytics tracking records associated with this URL
    await Analytics.deleteMany({ url: id });

    res.status(200).json({ message: 'URL and associated analytics deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/urls/:id/analytics
 * @desc    Get detailed analytics and visit history for a specific URL
 * @access  Private
 */
export const getUrlAnalytics = async (req, res, next) => {
  const { id } = req.params;

  try {
    const url = await Url.findById(id);

    if (!url) {
      res.status(404);
      throw new Error('URL not found');
    }

    // Ensure the URL belongs to the logged-in user
    if (url.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to view these analytics');
    }

    // Retrieve analytics sorted by visit timestamp (newest first)
    const analytics = await Analytics.find({ url: id }).sort({ timestamp: -1 });

    res.status(200).json({
      url,
      analytics,
    });
  } catch (error) {
    next(error);
  }
};
