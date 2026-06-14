import Url from '../models/Url.js';
import Analytics from '../models/Analytics.js';

/**
 * @route   GET /:shortCode
 * @desc    Redirect short code to original URL & log analytics
 * @access  Public
 */
export const redirectUrl = async (req, res, next) => {
  const { shortCode } = req.params;

  try {
    // 1. Find the URL by short code
    const url = await Url.findOne({ shortCode });

    if (!url) {
      res.status(404);
      throw new Error('Shortened URL not found');
    }

    // 2. Gather analytics data
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referrer = req.headers['referer'] || req.headers['referrer'] || 'Direct';

    // 3. Log the visit in the database asynchronously (don't block the redirect)
    Analytics.create({
      url: url._id,
      ipAddress,
      userAgent,
      referrer,
    }).catch((err) => console.error('Error logging analytics: ', err.message));

    // 4. Increment the click count atomically on the URL document
    await Url.findByIdAndUpdate(url._id, { $inc: { clicks: 1 } });

    // 5. Perform a 302 Temporary Redirect to ensure subsequent visits hit the server for tracking
    return res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
};
